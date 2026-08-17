import { NextResponse } from "next/server";
import { verifyStripeWebhookSignature } from "../../../../lib/stripe/webhooks";
import { isSupabaseConfigured } from "../../../../lib/supabase/config";
import { createSupabaseServerClient } from "../../../../lib/supabase/server";
import { generateVoucherCode } from "../../../../lib/db/orders";
import { sendBookingConfirmation } from "../../../../lib/notifications/email";

export async function POST(request: Request) {
  try {
    const rawPayload = await request.text();
    const signature = request.headers.get("stripe-signature");

    const { event, isValid } = verifyStripeWebhookSignature(rawPayload, signature);

    if (!isValid || !event) {
      // In development / demo when webhook secret is not set, log gracefully
      return NextResponse.json(
        { error: "Assinatura do webhook Stripe inválida ou webhook secret ausente." },
        { status: 400 }
      );
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as {
        client_reference_id?: string;
        id: string;
        metadata?: {
          buyer_id?: string;
          excursion_id?: string;
          order_id?: string;
          quantity?: string;
        };
        payment_intent?: string;
        payment_status?: string;
      };

      const orderId = session.metadata?.order_id || session.client_reference_id;
      if (orderId && isSupabaseConfigured()) {
        const supabase = await createSupabaseServerClient();

        // Check current status for idempotency
        const { data: currentOrder } = await supabase
          .from("orders")
          .select("payment_status, status, voucher_code")
          .eq("id", orderId)
          .single();

        if (currentOrder?.payment_status === "paid") {
          // Idempotency: already processed
          return NextResponse.json({ message: "Evento já processado anteriormente.", received: true });
        }

        const voucher = currentOrder?.voucher_code || generateVoucherCode();

        await supabase
          .from("orders")
          .update({
            payment_status: "paid",
            status: "confirmed",
            stripe_checkout_session_id: session.id,
            stripe_payment_intent_id: typeof session.payment_intent === "string" ? session.payment_intent : null,
            voucher_code: voucher
          })
          .eq("id", orderId);

        const { data: fullOrder } = await supabase
          .from("orders")
          .select("*, order_participants(*), excursions(*)")
          .eq("id", orderId)
          .single();

        if (fullOrder && fullOrder.buyer_email) {
          sendBookingConfirmation({
            buyerEmail: fullOrder.buyer_email,
            buyerName: fullOrder.buyer_name || "Viajante",
            date: fullOrder.excursions?.date || "Em breve",
            departureCity: fullOrder.excursions?.departure_city || "São Paulo",
            excursionTitle: fullOrder.excursions?.title || "Excursão Liete",
            orderId: fullOrder.id,
            participants: (fullOrder.order_participants || []).map((p: any) => ({
              birthDate: p.birth_date,
              document: p.document,
              name: p.full_name
            })),
            totalAmount: Number(fullOrder.total_amount),
            voucherCode: voucher
          }).catch(() => {});
        }
      }
    }

    if (event.type === "account.updated") {
      const account = event.data.object as {
        charges_enabled?: boolean;
        details_submitted?: boolean;
        id: string;
        payouts_enabled?: boolean;
      };

      if (account.id && isSupabaseConfigured()) {
        const supabase = await createSupabaseServerClient();
        await supabase
          .from("organizers")
          .update({
            stripe_charges_enabled: Boolean(account.charges_enabled),
            stripe_onboarding_completed: Boolean(account.details_submitted && account.charges_enabled),
            stripe_payouts_enabled: Boolean(account.payouts_enabled),
            verification_status: account.details_submitted ? "verified" : "in_review"
          })
          .eq("stripe_account_id", account.id);
      }
    }

    if (event.type === "charge.refunded") {
      const charge = event.data.object as {
        id: string;
        payment_intent?: string;
      };

      if (charge.payment_intent && isSupabaseConfigured()) {
        const supabase = await createSupabaseServerClient();
        await supabase
          .from("orders")
          .update({
            payment_status: "refunded",
            status: "cancelled"
          })
          .eq("stripe_payment_intent_id", charge.payment_intent);
      }
    }

    if (event.type === "transfer.created" || event.type === "transfer.paid") {
      const transfer = event.data.object as {
        amount: number;
        destination?: string;
        id: string;
        metadata?: {
          excursion_id?: string;
          organizer_id?: string;
          stage?: "first_payout" | "final_payout";
        };
      };

      if (transfer.destination && isSupabaseConfigured()) {
        const supabase = await createSupabaseServerClient();
        const { data: organizer } = await supabase
          .from("organizers")
          .select("id")
          .eq("stripe_account_id", transfer.destination)
          .single();

        if (organizer?.id && transfer.metadata?.excursion_id) {
          await supabase.from("payouts").insert({
            amount: transfer.amount / 100,
            excursion_id: transfer.metadata.excursion_id,
            organizer_id: organizer.id,
            paid_at: new Date().toISOString(),
            stage: transfer.metadata.stage || "first_payout",
            status: "paid",
            stripe_transfer_id: transfer.id
          });
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Erro no processamento do webhook Stripe." },
      { status: 500 }
    );
  }
}

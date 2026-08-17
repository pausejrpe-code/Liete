import { getStripeConfig, isStripeConfigured, stripeApiRequest } from "./config";
import type { ExcursionRecord } from "../db/types";

export type CreateCheckoutSessionParams = {
  buyerEmail: string;
  buyerId?: string;
  buyerName: string;
  cancelUrl: string;
  excursion: ExcursionRecord;
  orderId: string;
  organizerStripeAccountId?: string | null;
  paymentMethod?: "card" | "pix" | "boleto";
  quantity: number;
  successUrl: string;
};

export async function createExcursionCheckoutSession(
  params: CreateCheckoutSessionParams
): Promise<{ sessionId: string; url: string }> {
  const {
    excursion,
    quantity,
    orderId,
    buyerEmail,
    buyerId,
    successUrl,
    cancelUrl,
    organizerStripeAccountId,
    paymentMethod = "card"
  } = params;

  // Server-side calculation of total in cents (BRL)
  const unitAmountCents = Math.round(Number(excursion.price_per_seat) * 100);
  const totalAmountCents = unitAmountCents * quantity;

  if (!isStripeConfigured()) {
    const mockSessionId = `cs_demo_${Date.now()}`;
    return {
      sessionId: mockSessionId,
      url: `${successUrl}?session_id=${mockSessionId}&order_id=${orderId}`
    };
  }

  const { feePercent } = getStripeConfig();
  const applicationFeeCents = feePercent > 0 ? Math.round(totalAmountCents * (feePercent / 100)) : 0;

  const paymentMethodTypes = paymentMethod === "pix" ? ["pix"] : ["card", "boleto"];

  const sessionBody: Record<string, any> = {
    cancel_url: cancelUrl,
    client_reference_id: orderId,
    customer_email: buyerEmail,
    expires_at: Math.floor(Date.now() / 1000) + 3600, // 1 hour expiration for unpaid sessions
    line_items: [
      {
        price_data: {
          currency: "brl",
          product_data: {
            description: `Excursão ${excursion.title} — Saída: ${excursion.departure_city} (${excursion.date})`,
            name: `Ingresso: ${excursion.title}`
          },
          unit_amount: unitAmountCents
        },
        quantity
      }
    ],
    metadata: {
      buyer_id: buyerId || "",
      buyer_name: params.buyerName,
      excursion_id: excursion.id,
      excursion_slug: excursion.slug,
      order_id: orderId,
      quantity: String(quantity)
    },
    mode: "payment",
    payment_method_options: {
      card: {
        installments: {
          enabled: true
        }
      }
    },
    payment_method_types: paymentMethodTypes,
    success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`
  };

  // If organizer has a verified Stripe Connect Account, route funds to destination
  if (organizerStripeAccountId && !organizerStripeAccountId.startsWith("acct_demo_")) {
    sessionBody.payment_intent_data = {
      application_fee_amount: applicationFeeCents > 0 ? applicationFeeCents : undefined,
      transfer_data: {
        destination: organizerStripeAccountId
      }
    };
  }

  const session = await stripeApiRequest<{ id: string; url: string }>("checkout/sessions", {
    body: sessionBody,
    method: "POST"
  });

  return {
    sessionId: session.id,
    url: session.url
  };
}

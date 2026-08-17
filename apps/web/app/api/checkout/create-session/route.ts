import { NextResponse } from "next/server";
import { getExcursionBySlug } from "../../../../lib/db/excursions";
import { getOrganizerProfile } from "../../../../lib/db/organizers";
import { createOrderWithParticipants } from "../../../../lib/db/orders";
import { createExcursionCheckoutSession } from "../../../../lib/stripe/checkout";
import { getCurrentUserProfile } from "../../../../lib/db/profiles";
import { checkRateLimit, getClientIp } from "../../../../lib/security/rate-limit";
import { sendBookingConfirmation } from "../../../../lib/notifications/email";

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const limitCheck = checkRateLimit(`checkout:${ip}`, { intervalSeconds: 60, maxRequests: 20 });
    if (!limitCheck.success) {
      return NextResponse.json(
        { error: "Muitas tentativas de checkout. Aguarde 1 minuto antes de tentar novamente." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { slug, quantity, participants, buyerEmail, buyerName, paymentMethod = "card" } = body;

    if (!slug || !quantity || !participants || !Array.isArray(participants) || participants.length === 0) {
      return NextResponse.json(
        { error: "Dados incompletos para o checkout: excursão, quantidade e participantes são obrigatórios." },
        { status: 400 }
      );
    }

    // Consult excursion directly from database to guarantee authentic server-side pricing
    const excursion = await getExcursionBySlug(slug);
    if (!excursion) {
      return NextResponse.json({ error: "Excursão não encontrada." }, { status: 404 });
    }

    const numQty = Number(quantity);
    if (numQty <= 0) {
      return NextResponse.json({ error: "Quantidade de ingressos inválida." }, { status: 400 });
    }

    const availableSeats = Math.max(0, excursion.capacity - excursion.sold_seats);
    if (availableSeats < numQty) {
      return NextResponse.json(
        { error: `Restam apenas ${availableSeats} vagas disponíveis para esta excursão.` },
        { status: 400 }
      );
    }

    const userProfile = await getCurrentUserProfile();
    const finalBuyerEmail = buyerEmail || userProfile?.email || participants[0]?.email || "viajante@liete.com.br";
    const finalBuyerName = buyerName || userProfile?.full_name || participants[0]?.fullName || "Aventureiro";

    // Server-side calculation
    const unitPrice = Number(excursion.price_per_seat);
    const totalAmount = unitPrice * numQty;

    // Check organizer Stripe Connect ID
    const organizer = await getOrganizerProfile(excursion.organizer_id);
    const organizerStripeAccountId = organizer?.stripe_account_id;

    // Record order in pending status
    const order = await createOrderWithParticipants(
      {
        buyer_email: finalBuyerEmail,
        buyer_id: userProfile?.id || null,
        buyer_name: finalBuyerName,
        currency: "BRL",
        excursion_id: excursion.id,
        organizer_id: excursion.organizer_id,
        payment_method: paymentMethod,
        payment_status: "pending",
        quantity: numQty,
        status: "pending",
        total_amount: totalAmount,
        unit_price: unitPrice
      },
      participants.map((p: any) => ({
        birth_date: p.birthDate || null,
        document: p.document || "000.000.000-00",
        emergency_contact: p.emergencyContact || null,
        full_name: p.fullName || "Participante"
      }))
    );

    const host = request.headers.get("origin") || request.headers.get("host") || "http://localhost:3000";
    const origin = host.startsWith("http") ? host : `http://${host}`;

    // Create Stripe Checkout Session
    const session = await createExcursionCheckoutSession({
      buyerEmail: finalBuyerEmail,
      buyerId: userProfile?.id,
      buyerName: finalBuyerName,
      cancelUrl: `${origin}/checkout/${excursion.slug}/?canceled=true`,
      excursion,
      orderId: order.id,
      organizerStripeAccountId,
      paymentMethod: paymentMethod === "pix" ? "pix" : "card",
      quantity: numQty,
      successUrl: `${origin}/checkout/${excursion.slug}/sucesso/`
    });

    if (order.voucher_code) {
      sendBookingConfirmation({
        buyerEmail: finalBuyerEmail,
        buyerName: finalBuyerName,
        date: excursion.date,
        departureCity: excursion.departure_city,
        excursionTitle: excursion.title,
        orderId: order.id,
        participants: participants.map((p: any) => ({
          birthDate: p.birthDate,
          document: p.document,
          name: p.fullName
        })),
        totalAmount,
        voucherCode: order.voucher_code
      }).catch(() => {});
    }

    return NextResponse.json({
      orderId: order.id,
      sessionId: session.sessionId,
      url: session.url,
      voucherCode: order.voucher_code
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Erro interno ao processar checkout." },
      { status: 500 }
    );
  }
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getTravelerBooking,
  getTravelerExcursion,
  recordToTravelerExcursion,
  type TravelerBooking,
  type TravelerExcursion
} from "../../_traveler/traveler-data";
import { getOrderBySessionOrId } from "../../../lib/db/orders";
import { getExcursionById, getExcursionBySlug } from "../../../lib/db/excursions";
import { BookingDetails } from "./booking-details";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  description: "Detalhes, voucher e suporte da reserva.",
  title: "Detalhes da reserva — Liete"
};

async function resolveBookingAndExcursion(
  reservaId: string
): Promise<{ booking: TravelerBooking; excursion: TravelerExcursion } | null> {
  const orderRecord = await getOrderBySessionOrId(reservaId);
  if (orderRecord) {
    let excRecord = orderRecord.excursions;
    if (!excRecord) {
      excRecord = (await getExcursionById(orderRecord.excursion_id)) || (await getExcursionBySlug(orderRecord.excursion_id)) || undefined;
    }

    const excursion: TravelerExcursion = excRecord
      ? recordToTravelerExcursion(excRecord)
      : getTravelerExcursion(orderRecord.excursion_id) || {
          availability: "available",
          boardingPoints: ["Embarque Central"],
          cancellationPolicy: "Cancelamento conforme política da plataforma.",
          category: "natureza",
          date: "Data a confirmar",
          dateIso: new Date().toISOString().slice(0, 10),
          departureCity: "São Paulo",
          description: "Excursão confirmada.",
          destination: "Destino da viagem",
          duration: "bate-volta",
          durationLabel: "Bate-volta",
          gallery: ["/home/trip-sakura.jpeg"],
          image: "/home/trip-sakura.jpeg",
          included: ["Transporte", "Seguro viagem"],
          itinerary: [],
          notIncluded: [],
          organizer: "Organizador parceiro",
          participantCount: orderRecord.quantity,
          price: Number(orderRecord.unit_price),
          rating: 5.0,
          seats: 0,
          slug: orderRecord.excursion_id,
          title: "Excursão Liete",
          verified: true
        };

    const isConfirmed = orderRecord.status === "confirmed" || orderRecord.payment_status === "paid";
    const isCancelled = orderRecord.status === "cancelled" || orderRecord.payment_status === "refunded";

    const booking: TravelerBooking = {
      excursionSlug: excursion.slug,
      id: orderRecord.id.startsWith("ord-") ? `LIE-${orderRecord.id.slice(-5).toUpperCase()}` : orderRecord.id,
      orderDate: new Date(orderRecord.created_at).toLocaleDateString("pt-BR"),
      participants: (orderRecord.participants || []).map((p) => ({
        birthDate: p.birth_date || "",
        document: p.document || "•••.•••.•••-••",
        name: p.full_name || "Participante"
      })),
      paymentMethod: orderRecord.payment_method === "pix" ? "Pix" : "Cartão de crédito",
      paymentStatus: isConfirmed ? "Pagamento confirmado" : isCancelled ? "Cancelado" : "Aguardando confirmação",
      status: isConfirmed ? "upcoming" : isCancelled ? "cancelled" : "upcoming",
      statusIntent: isConfirmed ? "confirmed" : isCancelled ? "cancelled" : "pending",
      statusLabel: isConfirmed ? "Confirmada" : isCancelled ? "Cancelada" : "Pendente",
      total: Number(orderRecord.total_amount),
      tripDate: excursion.date,
      voucherCode: orderRecord.voucher_code || "LIE-VOUCHER"
    };

    return { booking, excursion };
  }

  const staticBooking = getTravelerBooking(reservaId);
  if (staticBooking) {
    const staticExcursion = getTravelerExcursion(staticBooking.excursionSlug);
    if (staticExcursion) {
      return { booking: staticBooking, excursion: staticExcursion };
    }
  }

  return null;
}

export default async function BookingDetailsPage({ params }: { params: Promise<{ reserva: string }> }) {
  const { reserva } = await params;
  const result = await resolveBookingAndExcursion(reserva);
  if (!result) notFound();
  return <BookingDetails booking={result.booking} excursion={result.excursion} />;
}

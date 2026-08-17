import { isSupabaseConfigured } from "../supabase/config";
import { createSupabaseServerClient } from "../supabase/server";
import { travelerBookings } from "../../app/_traveler/traveler-data";
import type { OrderParticipantRecord, OrderRecord } from "./types";

export function generateVoucherCode(cityPrefix = "SP"): string {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `LIE-${randomNum}-${cityPrefix.toUpperCase().slice(0, 2)}`;
}

export async function createOrderWithParticipants(
  order: Omit<OrderRecord, "id" | "created_at" | "updated_at">,
  participants: Array<Omit<OrderParticipantRecord, "id" | "order_id" | "created_at">>
): Promise<OrderRecord> {
  const orderId = `ord-${Date.now()}`;
  const voucher = generateVoucherCode();

  if (!isSupabaseConfigured()) {
    return {
      ...order,
      created_at: new Date().toISOString(),
      id: orderId,
      participants: participants.map((p, i) => ({
        ...p,
        created_at: new Date().toISOString(),
        id: `part-${i + 1}`,
        order_id: orderId
      })),
      updated_at: new Date().toISOString(),
      voucher_code: voucher
    };
  }

  const supabase = await createSupabaseServerClient();
  const { data: newOrder, error: orderError } = await supabase
    .from("orders")
    .insert({
      ...order,
      voucher_code: voucher
    })
    .select()
    .single();

  if (orderError || !newOrder) {
    throw new Error(orderError?.message || "Não foi possível registrar o pedido.");
  }

  if (participants.length > 0) {
    const participantsData = participants.map((p) => ({
      ...p,
      order_id: newOrder.id
    }));
    await supabase.from("order_participants").insert(participantsData);
  }

  return {
    ...newOrder,
    participants: participants.map((p, i) => ({
      ...p,
      created_at: new Date().toISOString(),
      id: `part-${i + 1}`,
      order_id: newOrder.id
    }))
  } as OrderRecord;
}

export async function getBuyerOrders(buyerId: string): Promise<OrderRecord[]> {
  if (!isSupabaseConfigured()) {
    return travelerBookings.map((b) => ({
      buyer_email: "ana@email.com",
      buyer_id: buyerId,
      buyer_name: "Ana Oliveira",
      created_at: b.orderDate,
      currency: "BRL",
      excursion_id: b.excursionSlug,
      id: b.id,
      organizer_id: "demo-organizer",
      participants: b.participants.map((p, i) => ({
        birthDate: p.birthDate,
        created_at: new Date().toISOString(),
        document: p.document,
        full_name: p.name,
        id: `part-${i + 1}`,
        order_id: b.id
      })),
      payment_method: b.paymentMethod,
      payment_status: "paid",
      quantity: b.participants.length,
      status: "confirmed",
      total_amount: b.total,
      unit_price: b.total / Math.max(1, b.participants.length),
      updated_at: b.orderDate,
      voucher_code: b.voucherCode
    }));
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("orders")
      .select("*, order_participants(*), excursions(*)")
      .eq("buyer_id", buyerId)
      .order("created_at", { ascending: false });

    if (error || !data) return [];
    return data.map((d: any) => ({
      ...d,
      excursions: d.excursions || undefined,
      participants: d.order_participants || []
    })) as OrderRecord[];
  } catch {
    return [];
  }
}

export async function getOrderBySessionOrId(sessionOrId: string): Promise<OrderRecord | null> {
  if (!isSupabaseConfigured()) {
    const found = travelerBookings.find((b) => b.id === sessionOrId || b.voucherCode === sessionOrId);
    if (!found) return null;
    return {
      buyer_email: "ana@email.com",
      buyer_id: "demo-user-id",
      buyer_name: "Ana Oliveira",
      created_at: found.orderDate,
      currency: "BRL",
      excursion_id: found.excursionSlug,
      id: found.id,
      organizer_id: "demo-organizer",
      participants: found.participants.map((p, i) => ({
        birth_date: p.birthDate,
        created_at: new Date().toISOString(),
        document: p.document,
        emergency_contact: null,
        full_name: p.name,
        id: `part-${i + 1}`,
        order_id: found.id
      })),
      payment_method: found.paymentMethod,
      payment_status: "paid",
      quantity: found.participants.length,
      status: "confirmed",
      total_amount: found.total,
      unit_price: found.total / Math.max(1, found.participants.length),
      updated_at: found.orderDate,
      voucher_code: found.voucherCode
    };
  }

  try {
    const supabase = await createSupabaseServerClient();
    const query = supabase
      .from("orders")
      .select("*, order_participants(*), excursions(*)")
      .or(`id.eq.${sessionOrId},stripe_checkout_session_id.eq.${sessionOrId},voucher_code.eq.${sessionOrId}`)
      .single();

    const { data, error } = await query;
    if (error || !data) return null;
    return {
      ...data,
      excursions: data.excursions || undefined,
      participants: data.order_participants || []
    } as OrderRecord;
  } catch {
    return null;
  }
}

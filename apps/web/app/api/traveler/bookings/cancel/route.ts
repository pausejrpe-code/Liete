import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "../../../../../lib/supabase/config";
import { createSupabaseServerClient } from "../../../../../lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { bookingId, reason } = body;

    if (!bookingId) {
      return NextResponse.json({ error: "Identificador da reserva é obrigatório." }, { status: 400 });
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json({
        message: "Solicitação de cancelamento registrada com sucesso.",
        status: "cancel_requested"
      });
    }

    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
    }

    // Lookup order by id or voucher code
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("id, buyer_id, status")
      .or(`id.eq.${bookingId},voucher_code.eq.${bookingId}`)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: "Reserva não encontrada." }, { status: 404 });
    }

    if (order.buyer_id && order.buyer_id !== user.id) {
      return NextResponse.json({ error: "Acesso não autorizado para esta reserva." }, { status: 403 });
    }

    const { error: updateError } = await supabase
      .from("orders")
      .update({
        status: "cancelled"
      })
      .eq("id", order.id);

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message || "Não foi possível registrar o cancelamento." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Solicitação de cancelamento registrada com sucesso.",
      status: "cancelled"
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Erro ao processar solicitação de cancelamento." },
      { status: 500 }
    );
  }
}

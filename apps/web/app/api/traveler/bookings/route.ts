import { NextResponse } from "next/server";
import { getCurrentUserProfile } from "../../../../lib/db/profiles";
import { getBuyerOrders } from "../../../../lib/db/orders";

export async function GET() {
  try {
    const userProfile = await getCurrentUserProfile();
    if (!userProfile) {
      return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
    }

    const orders = await getBuyerOrders(userProfile.id);
    return NextResponse.json({ bookings: orders });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Erro ao consultar reservas do viajante." },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "../../../../lib/supabase/config";
import { createSupabaseServerClient } from "../../../../lib/supabase/server";

export async function GET() {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({
        metrics: {
          activeExcursions: 12,
          totalExcursions: 18,
          totalGmv: 154200,
          totalOrders: 320,
          totalOrganizers: 15,
          totalTravelers: 280
        },
        recentOrders: [],
        topOrganizers: []
      });
    }

    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error: authError
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Acesso restrito a administradores." }, { status: 403 });
    }

    const [organizersRes, excursionsRes, ordersRes, profilesRes] = await Promise.all([
      supabase.from("organizers").select("id, business_name, verification_status, created_at"),
      supabase.from("excursions").select("id, title, status, sold_seats, capacity, price_per_seat"),
      supabase.from("orders").select("id, total_amount, payment_status, created_at, status"),
      supabase.from("profiles").select("id, role")
    ]);

    const organizers = organizersRes.data || [];
    const excursions = excursionsRes.data || [];
    const orders = ordersRes.data || [];
    const profiles = profilesRes.data || [];

    const paidOrders = orders.filter((o) => o.payment_status === "paid");
    const totalGmv = paidOrders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0);
    const activeExcursions = excursions.filter((e) => e.status === "available" || e.status === "confirmed").length;

    return NextResponse.json({
      metrics: {
        activeExcursions,
        totalExcursions: excursions.length,
        totalGmv,
        totalOrders: orders.length,
        totalOrganizers: organizers.length,
        totalTravelers: profiles.filter((p) => p.role === "traveler").length
      },
      recentOrders: orders.slice(0, 10),
      topOrganizers: organizers.slice(0, 10)
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Erro ao carregar dados administrativos." },
      { status: 500 }
    );
  }
}

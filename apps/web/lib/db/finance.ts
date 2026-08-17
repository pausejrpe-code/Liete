import { isSupabaseConfigured } from "../supabase/config";
import { createSupabaseServerClient } from "../supabase/server";

export type OrganizerFinanceSummary = {
  activeExcursionsCount: number;
  averageOccupancy: number;
  flowByPeriod: Array<{ gross: number; label: string; net: number }>;
  metrics: {
    activeExcursionsCount: number;
    grossVolume: number;
    paidAmount: number;
    pendingRefunds: number;
    receivableBalance: number;
  };
  nextPayout: {
    amount: number;
    arrivalDate: string;
    bankAccount: string;
    description: string;
    firstPayout: number;
    periodLabel: string;
    retainedBalance: number;
    statusIntent: "available" | "pending" | "confirmed";
    statusLabel: string;
    title: string;
  };
  receivableBalance: number;
  records: Array<{
    cardFee: number;
    departureDate: string;
    excursion: string;
    grossSales: number;
    id: string;
    netReceivable: number;
    payoutDate: string;
    platformFee: number;
    refunds: number;
    status: "pendingClosure" | "scheduled" | "paid" | "refundReview";
    statusIntent: "available" | "pending" | "confirmed" | "cancelled";
    statusLabel: string;
  }>;
  releasedPayouts: number;
  retainedGuarantee: number;
  soldSeats: number;
  totalGrossSales: number;
};

export async function getOrganizerFinanceSummary(organizerId: string): Promise<OrganizerFinanceSummary> {
  if (!isSupabaseConfigured()) {
    return {
      activeExcursionsCount: 8,
      averageOccupancy: 83,
      flowByPeriod: [
        { gross: 18400, label: "Sem 1", net: 16560 },
        { gross: 24200, label: "Sem 2", net: 21780 },
        { gross: 31000, label: "Sem 3", net: 27900 },
        { gross: 42800, label: "Sem 4", net: 38520 }
      ],
      metrics: {
        activeExcursionsCount: 8,
        grossVolume: 116400,
        paidAmount: 96000,
        pendingRefunds: 0,
        receivableBalance: 20400
      },
      nextPayout: {
        amount: 14280,
        arrivalDate: "28 ago 2026",
        bankAccount: "Nubank • Ag 0001 • Conta 12345-6",
        description: "1º repasse de saídas confirmadas para cobertura de fornecedores.",
        firstPayout: 14280,
        periodLabel: "Agosto 2026",
        retainedBalance: 6120,
        statusIntent: "confirmed",
        statusLabel: "Agendado",
        title: "Próximo repasse bancário"
      },
      receivableBalance: 20400,
      records: [
        {
          cardFee: 432,
          departureDate: "24 out 2026",
          excursion: "Holambra e Expoflora",
          grossSales: 14400,
          id: "holambra-flores",
          netReceivable: 11328,
          payoutDate: "29 out 2026",
          platformFee: 2160,
          refunds: 480,
          status: "scheduled",
          statusIntent: "available",
          statusLabel: "Programado"
        },
        {
          cardFee: 197.1,
          departureDate: "15 nov 2026",
          excursion: "Capitólio bate-volta",
          grossSales: 6570,
          id: "capitolio",
          netReceivable: 5387.4,
          payoutDate: "20 nov 2026",
          platformFee: 985.5,
          refunds: 0,
          status: "pendingClosure",
          statusIntent: "pending",
          statusLabel: "Em fechamento"
        }
      ],
      releasedPayouts: 96000,
      retainedGuarantee: 6120,
      soldSeats: 268,
      totalGrossSales: 116400
    };
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { data: excursions } = await supabase
      .from("excursions")
      .select("id, title, date, capacity, sold_seats, status, price_per_seat")
      .eq("organizer_id", organizerId);

    const { data: orders } = await supabase
      .from("orders")
      .select("excursion_id, total_amount, quantity, payment_status")
      .eq("organizer_id", organizerId)
      .eq("payment_status", "paid");

    const totalGross = orders?.reduce((acc, o) => acc + Number(o.total_amount), 0) || 0;
    const soldSeats = excursions?.reduce((acc, e) => acc + (e.sold_seats || 0), 0) || 0;
    const totalCapacity = excursions?.reduce((acc, e) => acc + (e.capacity || 0), 0) || 1;
    const activeCount = excursions?.filter((e) => e.status === "available" || e.status === "confirmed").length || 0;

    const occupancy = Math.min(100, Math.round((soldSeats / Math.max(1, totalCapacity)) * 100));
    const firstPayout = totalGross * 0.7;
    const retained = totalGross * 0.3;

    const dynamicRecords = (excursions || []).map((exc) => {
      const excOrders = (orders || []).filter((o) => o.excursion_id === exc.id);
      const excGross = excOrders.reduce((sum, o) => sum + Number(o.total_amount), 0);
      const platformFee = Math.round(excGross * 0.15 * 100) / 100;
      const cardFee = Math.round(excGross * 0.03 * 100) / 100;
      const net = excGross - platformFee - cardFee;
      const isConfirmed = exc.status === "confirmed" || exc.status === "sold_out";

      return {
        cardFee,
        departureDate: exc.date || "Em breve",
        excursion: exc.title,
        grossSales: excGross,
        id: exc.id,
        netReceivable: net,
        payoutDate: exc.date ? `5 dias após ${exc.date}` : "A definir",
        platformFee,
        refunds: 0,
        status: (isConfirmed ? "scheduled" : "pendingClosure") as "scheduled" | "pendingClosure",
        statusIntent: (isConfirmed ? "available" : "pending") as "available" | "pending",
        statusLabel: isConfirmed ? "Programado" : "Em fechamento"
      };
    });

    return {
      activeExcursionsCount: activeCount,
      averageOccupancy: occupancy,
      flowByPeriod: [
        { gross: Math.round(totalGross * 0.2), label: "Sem 1", net: Math.round(totalGross * 0.18) },
        { gross: Math.round(totalGross * 0.25), label: "Sem 2", net: Math.round(totalGross * 0.22) },
        { gross: Math.round(totalGross * 0.25), label: "Sem 3", net: Math.round(totalGross * 0.22) },
        { gross: Math.round(totalGross * 0.3), label: "Sem 4", net: Math.round(totalGross * 0.27) }
      ],
      metrics: {
        activeExcursionsCount: activeCount,
        grossVolume: totalGross,
        paidAmount: Math.max(0, totalGross - retained),
        pendingRefunds: 0,
        receivableBalance: totalGross
      },
      nextPayout: {
        amount: firstPayout,
        arrivalDate: "Próxima sexta-feira",
        bankAccount: "Conta Stripe Connect",
        description: "1º repasse referente a 70% das vendas de saídas confirmadas.",
        firstPayout: firstPayout,
        periodLabel: "Mês corrente",
        retainedBalance: retained,
        statusIntent: firstPayout > 0 ? "confirmed" : "pending",
        statusLabel: firstPayout > 0 ? "Agendado" : "Aguardando confirmação",
        title: "Próximo repasse bancário"
      },
      receivableBalance: totalGross,
      records: dynamicRecords,
      releasedPayouts: Math.max(0, totalGross - retained),
      retainedGuarantee: retained,
      soldSeats,
      totalGrossSales: totalGross
    };
  } catch {
    return {
      activeExcursionsCount: 0,
      averageOccupancy: 0,
      flowByPeriod: [],
      metrics: {
        activeExcursionsCount: 0,
        grossVolume: 0,
        paidAmount: 0,
        pendingRefunds: 0,
        receivableBalance: 0
      },
      nextPayout: {
        amount: 0,
        arrivalDate: "-",
        bankAccount: "Não configurada",
        description: "Nenhum repasse agendado",
        firstPayout: 0,
        periodLabel: "-",
        retainedBalance: 0,
        statusIntent: "pending",
        statusLabel: "Pendente",
        title: "Repasses"
      },
      receivableBalance: 0,
      records: [],
      releasedPayouts: 0,
      retainedGuarantee: 0,
      soldSeats: 0,
      totalGrossSales: 0
    };
  }
}

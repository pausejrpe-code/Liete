import type { StatusChipIntent } from "@liete/ui-web";

export type FinancialPeriod = "30d" | "90d" | "180d";
export type FinancialRecordStatus =
  | "pendingClosure"
  | "scheduled"
  | "paid"
  | "refundReview";

export type FinancialFlowPoint = {
  gross: number;
  label: string;
  net: number;
};

export type FinancialRecord = {
  cardFee: number;
  departureDate: string;
  excursion: string;
  grossSales: number;
  id: string;
  netReceivable: number;
  payoutDate: string;
  platformFee: number;
  refunds: number;
  status: FinancialRecordStatus;
  statusIntent: StatusChipIntent;
  statusLabel: string;
};

export const periodLabels: Record<FinancialPeriod, string> = {
  "30d": "Últimos 30 dias",
  "90d": "Últimos 90 dias",
  "180d": "Últimos 6 meses"
};

export const flowByPeriod: Record<FinancialPeriod, FinancialFlowPoint[]> = {
  "30d": [
    { gross: 6200, label: "Sem 1", net: 4740 },
    { gross: 9100, label: "Sem 2", net: 6920 },
    { gross: 7800, label: "Sem 3", net: 5840 },
    { gross: 12400, label: "Sem 4", net: 9480 }
  ],
  "90d": [
    { gross: 11800, label: "Jun", net: 8820 },
    { gross: 17300, label: "Jul", net: 13120 },
    { gross: 14500, label: "Ago", net: 10870 },
    { gross: 22400, label: "Set", net: 16960 },
    { gross: 19600, label: "Out", net: 14740 },
    { gross: 24100, label: "Nov", net: 18420 }
  ],
  "180d": [
    { gross: 21400, label: "Jun", net: 16240 },
    { gross: 26700, label: "Jul", net: 20110 },
    { gross: 23900, label: "Ago", net: 18020 },
    { gross: 31800, label: "Set", net: 24060 },
    { gross: 29400, label: "Out", net: 22180 },
    { gross: 35200, label: "Nov", net: 26840 }
  ]
};

export const financialRecords: FinancialRecord[] = [
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
  },
  {
    cardFee: 194.4,
    departureDate: "29 nov 2026",
    excursion: "Serra da Canastra",
    grossSales: 6480,
    id: "serra-canastra",
    netReceivable: 5313.6,
    payoutDate: "04 dez 2026",
    platformFee: 972,
    refunds: 0,
    status: "pendingClosure",
    statusIntent: "pending",
    statusLabel: "Em fechamento"
  },
  {
    cardFee: 348,
    departureDate: "12 jul 2026",
    excursion: "Festival de Inverno",
    grossSales: 11600,
    id: "festival-inverno",
    netReceivable: 9512,
    payoutDate: "17 jul 2026",
    platformFee: 1740,
    refunds: 0,
    status: "paid",
    statusIntent: "confirmed",
    statusLabel: "Pago"
  },
  {
    cardFee: 50.4,
    departureDate: "20 dez 2026",
    excursion: "Aparecida em família",
    grossSales: 1680,
    id: "aparecida",
    netReceivable: 0,
    payoutDate: "Aguardando análise",
    platformFee: 0,
    refunds: 1680,
    status: "refundReview",
    statusIntent: "cancelled",
    statusLabel: "Estorno em análise"
  }
];

const receivableStatuses = new Set<FinancialRecordStatus>([
  "pendingClosure",
  "scheduled"
]);

export const financialMetrics = {
  netRevenue: financialRecords.reduce(
    (total, record) => total + record.netReceivable,
    0
  ),
  pendingClosure: financialRecords.filter(
    (record) => record.status === "pendingClosure"
  ).length,
  receivableBalance: financialRecords
    .filter((record) => receivableStatuses.has(record.status))
    .reduce((total, record) => total + record.netReceivable, 0),
  refunds: financialRecords.reduce(
    (total, record) => total + record.refunds,
    0
  )
};

export const nextPayout = financialRecords.find(
  (record) => record.status === "scheduled"
) ?? null;

export function formatCurrency(value: number, showCents = false) {
  return new Intl.NumberFormat("pt-BR", {
    currency: "BRL",
    maximumFractionDigits: showCents ? 2 : 0,
    minimumFractionDigits: showCents ? 2 : 0,
    style: "currency"
  }).format(value);
}

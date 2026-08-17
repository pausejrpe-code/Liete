import type { DataTableRow, StatusChipIntent } from "@liete/ui-web";

export type ExcursionOverview = {
  capacity: number;
  date: string;
  destination: string;
  id: string;
  minimumParticipants: number;
  slug?: string;
  soldSeats: number;
  status: StatusChipIntent;
  statusLabel: string;
  ticketPrice: number;
  title: string;
};

export const excursions: ExcursionOverview[] = [
  {
    capacity: 32,
    date: "24 out 2026",
    destination: "Holambra, SP",
    id: "holambra-flores",
    minimumParticipants: 24,
    soldSeats: 30,
    status: "confirmed",
    statusLabel: "Confirmada",
    ticketPrice: 480,
    title: "Holambra e Expoflora"
  },
  {
    capacity: 30,
    date: "15 nov 2026",
    destination: "Capitólio, MG",
    id: "capitolio",
    minimumParticipants: 24,
    soldSeats: 18,
    status: "available",
    statusLabel: "Publicada",
    ticketPrice: 365,
    title: "Capitólio bate-volta"
  },
  {
    capacity: 25,
    date: "29 nov 2026",
    destination: "São Roque de Minas, MG",
    id: "serra-canastra",
    minimumParticipants: 15,
    soldSeats: 12,
    status: "pending",
    statusLabel: "Rascunho",
    ticketPrice: 540,
    title: "Serra da Canastra"
  },
  {
    capacity: 40,
    date: "12 dez 2026",
    destination: "Campos do Jordão, SP",
    id: "festival-inverno",
    minimumParticipants: 30,
    soldSeats: 40,
    status: "soldOut",
    statusLabel: "Lotada",
    ticketPrice: 290,
    title: "Festival de Inverno"
  },
  {
    capacity: 35,
    date: "20 dez 2026",
    destination: "Aparecida, SP",
    id: "aparecida",
    minimumParticipants: 20,
    soldSeats: 8,
    status: "cancelled",
    statusLabel: "Cancelada",
    ticketPrice: 210,
    title: "Aparecida em família"
  }
];

const activeStatuses = new Set<StatusChipIntent>([
  "available",
  "confirmed",
  "soldOut"
]);

const revenueExcursions = excursions.filter(
  (excursion) => excursion.status !== "cancelled"
);

export const dashboardMetrics = {
  activeExcursions: excursions.filter((excursion) =>
    activeStatuses.has(excursion.status)
  ).length,
  estimatedRevenue: revenueExcursions.reduce(
    (total, excursion) => total + excursion.soldSeats * excursion.ticketPrice,
    0
  ),
  soldSeats: revenueExcursions.reduce(
    (total, excursion) => total + excursion.soldSeats,
    0
  ),
  upcomingDepartures: excursions.filter(
    (excursion) => excursion.status !== "cancelled" && excursion.status !== "pending"
  ).length
};

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    currency: "BRL",
    maximumFractionDigits: 0,
    style: "currency"
  }).format(value);
}

export function toDataTableRow(excursion: ExcursionOverview): DataTableRow {
  return {
    date: excursion.date,
    destination: excursion.destination,
    id: excursion.id,
    price: new Intl.NumberFormat("pt-BR", {
      currency: "BRL",
      minimumFractionDigits: 2,
      style: "currency"
    }).format(excursion.ticketPrice),
    sales: `${excursion.soldSeats}/${excursion.capacity}`,
    status: excursion.status,
    statusLabel: excursion.statusLabel,
    title: excursion.title
  };
}

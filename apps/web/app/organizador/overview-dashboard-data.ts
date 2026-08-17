import type { StatusChipIntent } from "@liete/ui-web";
import {
  dashboardMetrics,
  excursions,
  type ExcursionOverview
} from "./excursoes/excursions-dashboard-data";
import {
  financialMetrics,
  flowByPeriod,
  nextPayout
} from "./financeiro/financial-dashboard-data";

export type OverviewAttentionItem = {
  actionLabel: string;
  description: string;
  href: string;
  id: string;
  statusIntent: StatusChipIntent;
  statusLabel: string;
  title: string;
};

const activeStatuses = new Set<StatusChipIntent>([
  "available",
  "confirmed",
  "soldOut"
]);

const activeExcursions = excursions.filter((excursion) =>
  activeStatuses.has(excursion.status)
);

const activeCapacity = activeExcursions.reduce(
  (total, excursion) => total + excursion.capacity,
  0
);
const activeSoldSeats = activeExcursions.reduce(
  (total, excursion) => total + excursion.soldSeats,
  0
);

export const overviewMetrics = {
  activeExcursions: dashboardMetrics.activeExcursions,
  averageOccupancy: Math.round((activeSoldSeats / activeCapacity) * 100),
  receivableBalance: financialMetrics.receivableBalance,
  soldSeats: dashboardMetrics.soldSeats
};

export const overviewSales = flowByPeriod["30d"].map((point) => ({
  label: point.label,
  value: point.gross
}));

export const overviewNextPayout = nextPayout;

export const overviewAttentionItems: OverviewAttentionItem[] = [
  {
    actionLabel: "Acompanhar vendas",
    description: "Faltam 6 participantes para atingir a meta mínima.",
    href: "/organizador/excursoes/#capitolio",
    id: "minimum-capitolio",
    statusIntent: "pending",
    statusLabel: "Prioridade",
    title: "Capitólio bate-volta"
  },
  {
    actionLabel: "Completar perfil",
    description: "Envie o comprovante para concluir a verificação da conta.",
    href: "/organizador/perfil/#documents",
    id: "address-document",
    statusIntent: "pending",
    statusLabel: "Ação necessária",
    title: "Comprovante de endereço pendente"
  },
  {
    actionLabel: "Ver financeiro",
    description: "O valor devolvido está aguardando conciliação financeira.",
    href: "/organizador/financeiro/",
    id: "refund-review",
    statusIntent: "cancelled",
    statusLabel: "Em análise",
    title: "Estorno de Aparecida"
  }
];

export const overviewUpcomingExcursions: ExcursionOverview[] =
  activeExcursions.slice(0, 3);

export const overviewQuickLinks = [
  {
    description: "Acompanhe vendas, capacidade e próximas saídas.",
    href: "/organizador/excursoes/",
    label: "Ver excursões"
  },
  {
    description: "Consulte repasses, estornos e valores a receber.",
    href: "/organizador/financeiro/",
    label: "Abrir financeiro"
  },
  {
    description: "Atualize cadastro, documentos e dados bancários.",
    href: "/organizador/perfil/",
    label: "Gerenciar perfil"
  }
];

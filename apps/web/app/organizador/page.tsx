import type { Metadata } from "next";
import { OverviewDashboard } from "./overview-dashboard";

export const metadata: Metadata = {
  description:
    "Acompanhe os principais indicadores, pendências e próximas ações do organizador.",
  title: "Visão geral — Liete"
};

export default function OrganizerOverviewPage() {
  return <OverviewDashboard />;
}

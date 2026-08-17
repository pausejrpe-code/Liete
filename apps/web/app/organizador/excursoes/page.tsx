import type { Metadata } from "next";
import { ExcursionsDashboard } from "./excursions-dashboard";

export const metadata: Metadata = {
  description: "Acompanhe excursões, vendas e próximas saídas.",
  title: "Excursões — Liete"
};

export default function ExcursionsPage() {
  return <ExcursionsDashboard />;
}

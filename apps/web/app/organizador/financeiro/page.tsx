import type { Metadata } from "next";
import { FinancialDashboard } from "./financial-dashboard";

export const metadata: Metadata = {
  description: "Acompanhe vendas, estornos, fechamentos e repasses.",
  title: "Financeiro — Liete"
};

export default function FinancialPage() {
  return <FinancialDashboard />;
}

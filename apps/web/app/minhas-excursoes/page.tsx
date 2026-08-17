import type { Metadata } from "next";
import { BookingsDashboard } from "./bookings-dashboard";

export const metadata: Metadata = {
  description: "Acompanhe suas reservas, vouchers, pagamentos e estornos.",
  title: "Minhas excursões — Liete"
};

export default function MyExcursionsPage() { return <BookingsDashboard />; }

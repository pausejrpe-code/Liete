import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getExcursionBySlug } from "../../../lib/db/excursions";
import {
  getTravelerExcursion,
  recordToTravelerExcursion,
  type TravelerExcursion
} from "../../_traveler/traveler-data";
import { CheckoutFlow } from "./checkout-flow";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  description: "Informe os participantes, acesse sua conta e finalize a reserva.",
  title: "Finalizar reserva — Liete"
};

export default async function CheckoutPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const dbRecord = await getExcursionBySlug(slug);
  const fallback = getTravelerExcursion(slug);

  if (!dbRecord && !fallback) notFound();

  const excursion: TravelerExcursion = dbRecord ? recordToTravelerExcursion(dbRecord) : fallback!;

  if (excursion.availability === "sold-out") notFound();

  return <CheckoutFlow excursion={excursion} initialTravelers={1} />;
}

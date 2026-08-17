import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getTravelerExcursion,
  recordToTravelerExcursion,
  type TravelerExcursion
} from "../../../_traveler/traveler-data";
import { getExcursionBySlug } from "../../../../lib/db/excursions";
import { CheckoutSuccess } from "./checkout-success";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  description: "Reserva confirmada com sucesso.",
  title: "Reserva confirmada — Liete"
};

export default async function CheckoutSuccessPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const dbRecord = await getExcursionBySlug(slug);
  const excursion: TravelerExcursion | undefined = dbRecord
    ? recordToTravelerExcursion(dbRecord)
    : getTravelerExcursion(slug);

  if (!excursion) notFound();
  return <CheckoutSuccess excursion={excursion} />;
}

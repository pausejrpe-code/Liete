import type { Metadata } from "next";
import { ExcursionCatalog } from "./excursion-catalog";
import { getPublishedExcursions } from "../../lib/db/excursions";
import { recordToTravelerExcursion, type TravelerExcursion } from "../_traveler/traveler-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  description: "Busque e filtre excursões com organizadores verificados.",
  title: "Explorar excursões — Liete"
};

export default async function ExcursionsPage() {
  let initialExcursions: TravelerExcursion[] = [];
  try {
    const records = await getPublishedExcursions();
    if (records && records.length > 0) {
      initialExcursions = records.map(recordToTravelerExcursion);
    }
  } catch {
    // Fallback
  }

  return <ExcursionCatalog initialExcursions={initialExcursions.length > 0 ? initialExcursions : undefined} />;
}

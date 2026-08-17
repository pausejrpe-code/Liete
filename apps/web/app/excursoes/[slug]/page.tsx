import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getTravelerExcursion,
  recordToTravelerExcursion,
  type TravelerExcursion
} from "../../_traveler/traveler-data";
import { getExcursionBySlug, getPublishedExcursions } from "../../../lib/db/excursions";
import { ExcursionDetails } from "./excursion-details";

export const dynamic = "force-dynamic";

async function resolveExcursion(slug: string): Promise<TravelerExcursion | null> {
  const dbRecord = await getExcursionBySlug(slug);
  if (dbRecord) {
    return recordToTravelerExcursion(dbRecord);
  }
  const fallback = getTravelerExcursion(slug);
  return fallback || null;
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const excursion = await resolveExcursion(slug);
  return {
    description: excursion?.description ?? "Detalhes da excursão.",
    title: excursion ? `${excursion.title} — Liete` : "Excursão — Liete"
  };
}

export default async function ExcursionDetailsPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const excursion = await resolveExcursion(slug);
  if (!excursion) notFound();

  let related: TravelerExcursion[] = [];
  try {
    const published = await getPublishedExcursions({ limit: 6 });
    if (published && published.length > 0) {
      related = published
        .filter((item) => item.slug !== slug)
        .slice(0, 3)
        .map(recordToTravelerExcursion);
    }
  } catch {
    // Fallback handled in component
  }

  return <ExcursionDetails excursion={excursion} relatedExcursions={related.length > 0 ? related : undefined} />;
}

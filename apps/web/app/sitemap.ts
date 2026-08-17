import type { MetadataRoute } from "next";
import { getPublishedExcursions } from "../lib/db/excursions";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://liete.com.br";

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      changeFrequency: "daily",
      lastModified: new Date(),
      priority: 1.0,
      url: `${baseUrl}/`
    },
    {
      changeFrequency: "daily",
      lastModified: new Date(),
      priority: 0.9,
      url: `${baseUrl}/excursoes/`
    },
    {
      changeFrequency: "monthly",
      lastModified: new Date(),
      priority: 0.3,
      url: `${baseUrl}/termos/`
    },
    {
      changeFrequency: "monthly",
      lastModified: new Date(),
      priority: 0.3,
      url: `${baseUrl}/privacidade/`
    }
  ];

  try {
    const excursions = await getPublishedExcursions();
    const excursionRoutes: MetadataRoute.Sitemap = excursions.map((exc) => ({
      changeFrequency: "weekly",
      lastModified: new Date(exc.updated_at || exc.created_at || new Date()),
      priority: 0.8,
      url: `${baseUrl}/excursoes/${exc.slug}/`
    }));

    return [...staticRoutes, ...excursionRoutes];
  } catch {
    return staticRoutes;
  }
}

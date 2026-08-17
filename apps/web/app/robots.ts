import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://liete.com.br";

  return {
    rules: [
      {
        allow: ["/", "/excursoes/", "/termos/", "/privacidade/"],
        disallow: [
          "/organizador/",
          "/minhas-excursoes/",
          "/minha-conta/",
          "/api/",
          "/checkout/*/sucesso/"
        ],
        userAgent: "*"
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`
  };
}

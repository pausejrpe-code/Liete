"use client";

import { BannerHero, PartnerHero, TripCard, type TripCardProps } from "@liete/ui-web";
import { withBasePath } from "../lib/site-path";

export function HomePartnerHero() {
  function handleAction() {
    document.getElementById("rodape")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <PartnerHero
      actionLabel="Quero anunciar"
      aria-label="Convite para organizadores de viagens"
      onAction={handleAction}
    />
  );
}

export function HomeBannerHero() {
  return (
    <BannerHero
      actionLabel="Encontrar uma viagem"
      headingLevel={2}
      imageAlt="Montanhas acima de um campo florido"
      imageSrc={withBasePath("/home/cta-mountains.jpeg")}
      onAction={() => window.location.assign(withBasePath("/excursoes/"))}
    />
  );
}

export function HomeTripCard({ slug, ...props }: TripCardProps & { slug: string }) {
  return (
    <TripCard
      {...props}
      actionLabel="Ver detalhes"
      onReserve={() =>
        window.location.assign(withBasePath(`/excursoes/${slug}/`))
      }
    />
  );
}

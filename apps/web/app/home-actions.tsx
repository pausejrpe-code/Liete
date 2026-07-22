"use client";

import { BannerHero, PartnerHero, TripCard, type TripCardProps } from "@liete/ui-web";
import { withBasePath } from "../lib/site-path";

function focusSearch() {
  document.getElementById("buscar")?.scrollIntoView({ behavior: "smooth", block: "center" });
}

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
      onAction={focusSearch}
    />
  );
}

export function HomeTripCard(props: TripCardProps) {
  return <TripCard {...props} onReserve={focusSearch} />;
}

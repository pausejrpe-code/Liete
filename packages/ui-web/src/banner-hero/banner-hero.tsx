"use client";

import type { ElementType, HTMLAttributes, MouseEventHandler } from "react";
import { Button } from "../button/button";
import { getAssetUrl } from "../internal/asset-url";
import mountainImage from "./assets/mountain.jpg";
import styles from "./banner-hero.module.css";

export type BannerHeroLayout = "responsive" | "desktop" | "mobile";

export type BannerHeroProps = Omit<HTMLAttributes<HTMLElement>, "title"> & {
  actionLabel?: string;
  description?: string;
  heading?: string;
  headingLevel?: 1 | 2 | 3;
  imageAlt?: string;
  imageSrc?: string;
  layout?: BannerHeroLayout;
  onAction?: MouseEventHandler<HTMLButtonElement>;
};

export function BannerHero({
  actionLabel = "Reservar agora",
  className,
  description = "Mais de 1.200 viagens organizadas esperando por você. Bate-volta, fim de semana ou expedição.",
  heading = "Sua próxima aventura começa aqui",
  headingLevel = 1,
  imageAlt = "Montanhas acima de um campo florido",
  imageSrc = getAssetUrl(mountainImage),
  layout = "responsive",
  onAction,
  ...props
}: BannerHeroProps) {
  const classes = [styles.root, styles[layout], className].filter(Boolean).join(" ");
  const Heading = `h${headingLevel}` as ElementType;

  return (
    <section
      {...props}
      className={classes}
      data-figma-node-id="222:92"
      data-layout={layout}
    >
      <img className={styles.image} src={imageSrc} alt={imageAlt} />
      <div aria-hidden="true" className={styles.overlay} />
      <div className={styles.content}>
        <Heading className={styles.heading}>{heading}</Heading>
        <p className={styles.description}>{description}</p>
        <Button onClick={onAction} size="sm">
          {actionLabel}
        </Button>
      </div>
    </section>
  );
}

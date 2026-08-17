"use client";

import type { HTMLAttributes, MouseEventHandler } from "react";
import tripMedia from "./assets/trip-media.png";
import { Badge } from "../badge/badge";
import { Button } from "../button/button";
import { getAssetUrl } from "../internal/asset-url";
import styles from "./trip-card.module.css";

export type TripCardAvailability = "available" | "sold-out";
export type TripCardLayout = "vertical" | "compact";

export type TripCardProps = Omit<HTMLAttributes<HTMLElement>, "title"> & {
  actionLabel?: string;
  availability?: TripCardAvailability;
  departure?: string;
  imageAlt?: string;
  imageSrc?: string;
  layout?: TripCardLayout;
  organizer?: string;
  participantCount?: number;
  price?: string;
  rating?: string;
  seats?: number;
  title?: string;
  verified?: boolean;
  onReserve?: MouseEventHandler<HTMLButtonElement>;
};

export function TripCard({
  actionLabel = "Reservar",
  availability = "available",
  className,
  departure = "Saída: Terminal Tietê · 24 ago · 06:00",
  imageAlt = "",
  imageSrc = getAssetUrl(tripMedia),
  layout = "vertical",
  onReserve,
  organizer = "Organizado por Rota Serra Turismo",
  participantCount = 48,
  price = "R$ 248,90",
  rating = "4.8",
  seats = 12,
  title = "Capitólio bate-volta",
  verified = true,
  ...props
}: TripCardProps) {
  const isSoldOut = availability === "sold-out";
  const classes = [styles.root, styles[layout], className].filter(Boolean).join(" ");

  return (
    <article
      {...props}
      aria-label={title}
      className={classes}
      data-availability={availability}
      data-layout={layout}
    >
      <div className={styles.media}>
        <img alt={imageAlt} src={imageSrc} />
        <div className={styles.mediaBadges}>
          <Badge
            label={isSoldOut ? "Esgotado" : `${seats} vagas`}
            showDot={false}
            tone="dark"
          />
          {verified ? <Badge label="Verificado" showDot={false} tone="pure" /> : null}
        </div>
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.details}>
          <p>{departure}</p>
          <p>{organizer}</p>
        </div>

        <div className={styles.trustRow} aria-label="Confiança da viagem">
          <Badge aria-label={`Avaliação ${rating} de 5`} label={rating} showDot={false} tone="pure" />
          <Badge label={`${participantCount} participantes`} showDot={false} tone="dark" />
        </div>

        <div className={styles.footer}>
          <div className={styles.price}>
            <span>por pessoa</span>
            <strong>{price}</strong>
          </div>
          <Button disabled={isSoldOut} onClick={onReserve} size="sm">
            {isSoldOut ? "Esgotado" : actionLabel}
          </Button>
        </div>
      </div>
    </article>
  );
}

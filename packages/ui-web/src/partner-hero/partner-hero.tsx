"use client";

import type { ElementType, HTMLAttributes, MouseEventHandler } from "react";
import { Button } from "../button/button";
import { getAssetUrl } from "../internal/asset-url";
import dividerDesktop from "./assets/divider-desktop.svg";
import dividerMobile from "./assets/divider-mobile.svg";
import exploreIcon from "./assets/explore.svg";
import mapIcon from "./assets/map.svg";
import orbitInner from "./assets/orbit-inner.svg";
import orbitMiddle from "./assets/orbit-middle.svg";
import orbitOuter from "./assets/orbit-outer.svg";
import peopleIcon from "./assets/people.svg";
import travelIcon from "./assets/travel.svg";
import styles from "./partner-hero.module.css";

export type PartnerHeroLayout = "responsive" | "desktop" | "mobile";

export type PartnerHeroProps = Omit<HTMLAttributes<HTMLElement>, "title"> & {
  actionLabel?: string;
  description?: string;
  eyebrow?: string;
  heading?: string;
  headingLevel?: 1 | 2 | 3;
  highlightedHeading?: string;
  layout?: PartnerHeroLayout;
  onAction?: MouseEventHandler<HTMLButtonElement>;
};

export function PartnerHero({
  actionLabel = "Reservar agora",
  className,
  description = "Cadastre-se gratuitamente, publique roteiros e receba reservas direto na plataforma.",
  eyebrow = "Para organizadores",
  heading = "Anuncie suas viagens.",
  headingLevel = 2,
  highlightedHeading = "Encha seus ônibus.",
  layout = "responsive",
  onAction,
  ...props
}: PartnerHeroProps) {
  const classes = [styles.root, styles[layout], className].filter(Boolean).join(" ");
  const Heading = `h${headingLevel}` as ElementType;

  return (
    <section
      {...props}
      className={classes}
      data-figma-node-id="221:399"
      data-layout={layout}
    >
      <div className={styles.contentPanel}>
        <div className={styles.content}>
          <div className={styles.header}>
            <div className={styles.eyebrow}>
              <img alt="" aria-hidden="true" src={getAssetUrl(exploreIcon)} />
              <span>{eyebrow}</span>
            </div>
            <Heading className={styles.heading}>
              <span>{heading}</span>{" "}
              <span className={styles.highlight}>{highlightedHeading}</span>
            </Heading>
          </div>

          <div className={styles.body}>
            <p>{description}</p>
            <Button onClick={onAction} size="sm">
              {actionLabel}
            </Button>
          </div>
        </div>
      </div>

      <div aria-hidden="true" className={styles.artwork}>
        <img className={styles.orbitOuter} src={getAssetUrl(orbitOuter)} alt="" />
        <img className={styles.orbitMiddle} src={getAssetUrl(orbitMiddle)} alt="" />
        <img className={styles.orbitInner} src={getAssetUrl(orbitInner)} alt="" />

        <span className={`${styles.badge} ${styles.peopleBadge}`}>
          <img src={getAssetUrl(peopleIcon)} alt="" />
        </span>
        <span className={`${styles.badge} ${styles.mapBadge}`}>
          <img src={getAssetUrl(mapIcon)} alt="" />
        </span>
        <img className={styles.travelBadge} src={getAssetUrl(travelIcon)} alt="" />
      </div>

      <span aria-hidden="true" className={styles.divider}>
        <img className={styles.desktopDivider} src={getAssetUrl(dividerDesktop)} alt="" />
        <img className={styles.mobileDivider} src={getAssetUrl(dividerMobile)} alt="" />
      </span>
    </section>
  );
}

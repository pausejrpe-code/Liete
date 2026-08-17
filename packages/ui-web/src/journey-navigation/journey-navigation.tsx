"use client";

import type { HTMLAttributes, MouseEventHandler } from "react";
import { Button } from "../button/button";
import styles from "./journey-navigation.module.css";

export type JourneyNavigationProps = Omit<
  HTMLAttributes<HTMLElement>,
  "onSubmit"
> & {
  backDisabled?: boolean;
  backLabel?: string;
  onBack?: MouseEventHandler<HTMLButtonElement>;
  onPrimaryAction?: MouseEventHandler<HTMLButtonElement>;
  primaryDisabled?: boolean;
  primaryLabel?: string;
  primaryType?: "button" | "submit";
  sticky?: boolean;
};

export function JourneyNavigation({
  "aria-label": ariaLabel = "Navegação da etapa",
  backDisabled = false,
  backLabel = "Voltar",
  className,
  onBack,
  onPrimaryAction,
  primaryDisabled = false,
  primaryLabel = "Reservar agora",
  primaryType = "button",
  sticky = false,
  ...props
}: JourneyNavigationProps) {
  const classes = [styles.root, sticky && styles.sticky, className]
    .filter(Boolean)
    .join(" ");

  return (
    <footer
      {...props}
      aria-label={ariaLabel}
      className={classes}
      data-figma-node-id="347:246"
      data-sticky={sticky || undefined}
    >
      <Button
        className={styles.backAction}
        disabled={backDisabled}
        onClick={onBack}
        size="md"
        variant="ghost"
      >
        {backLabel}
      </Button>
      <Button
        className={styles.primaryAction}
        disabled={primaryDisabled}
        onClick={onPrimaryAction}
        size="sm"
        type={primaryType}
      >
        {primaryLabel}
      </Button>
    </footer>
  );
}

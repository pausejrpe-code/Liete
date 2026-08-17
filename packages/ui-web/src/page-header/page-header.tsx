"use client";

import type {
  ElementType,
  HTMLAttributes,
  MouseEventHandler
} from "react";
import { Button } from "../button/button";
import styles from "./page-header.module.css";

export type PageHeaderLayout = "responsive" | "desktop" | "mobile";

export type PageHeaderProps = Omit<HTMLAttributes<HTMLElement>, "title"> & {
  backLabel?: string;
  headingLevel?: 1 | 2 | 3;
  layout?: PageHeaderLayout;
  onBack?: MouseEventHandler<HTMLButtonElement>;
  onPrimaryAction?: MouseEventHandler<HTMLButtonElement>;
  onSecondaryAction?: MouseEventHandler<HTMLButtonElement>;
  primaryActionLabel?: string;
  secondaryActionLabel?: string;
  showBack?: boolean;
  showPrimaryAction?: boolean;
  showSecondaryAction?: boolean;
  showSubtitle?: boolean;
  subtitle?: string;
  title?: string;
};

export function PageHeader({
  backLabel = "Voltar",
  className,
  headingLevel = 1,
  layout = "responsive",
  onBack,
  onPrimaryAction,
  onSecondaryAction,
  primaryActionLabel = "Nova excursão",
  secondaryActionLabel = "Exportar",
  showBack = true,
  showPrimaryAction = true,
  showSecondaryAction = true,
  showSubtitle = true,
  subtitle = "Gerencie publicações, vendas e repasses.",
  title = "Excursões",
  ...props
}: PageHeaderProps) {
  const classes = [styles.root, styles[layout], className]
    .filter(Boolean)
    .join(" ");
  const Heading = `h${headingLevel}` as ElementType;
  const showActions = showPrimaryAction || showSecondaryAction;

  return (
    <header
      {...props}
      className={classes}
      data-figma-node-id="236:760"
      data-layout={layout}
    >
      <div className={styles.info}>
        {showBack ? (
          <Button
            className={styles.backAction}
            onClick={onBack}
            size="sm"
            variant="ghost"
          >
            <span aria-hidden="true">←</span>
            <span>{backLabel}</span>
          </Button>
        ) : null}

        <Heading className={styles.heading}>{title}</Heading>

        {showSubtitle ? (
          <p className={styles.subtitle}>{subtitle}</p>
        ) : null}
      </div>

      {showActions ? (
        <div aria-label="Ações da página" className={styles.actions} role="group">
          {showSecondaryAction ? (
            <Button
              className={styles.action}
              onClick={onSecondaryAction}
              size="md"
              variant="ghost"
            >
              {secondaryActionLabel}
            </Button>
          ) : null}

          {showPrimaryAction ? (
            <Button
              className={styles.action}
              onClick={onPrimaryAction}
              size="md"
              variant="primary"
            >
              {primaryActionLabel}
            </Button>
          ) : null}
        </div>
      ) : null}
    </header>
  );
}

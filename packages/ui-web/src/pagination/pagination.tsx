"use client";

import type { HTMLAttributes } from "react";
import { getAssetUrl } from "../internal/asset-url";
import arrowLeft from "./assets/arrow-left.svg";
import arrowRight from "./assets/arrow-right.svg";
import styles from "./pagination.module.css";

export type PaginationLayout = "responsive" | "desktop" | "mobile";

export type PaginationProps = Omit<HTMLAttributes<HTMLElement>, "onChange"> & {
  currentPage?: number;
  layout?: PaginationLayout;
  onPageChange?: (page: number) => void;
  resultsLabel?: string;
  showResults?: boolean;
  totalPages?: number;
};

export function Pagination({
  className,
  currentPage = 1,
  layout = "responsive",
  onPageChange,
  resultsLabel = "21–30 de 128 excursões",
  showResults = true,
  totalPages = 10,
  ...props
}: PaginationProps) {
  const safeTotal = Math.max(1, totalPages);
  const safeCurrent = Math.min(Math.max(1, currentPage), safeTotal);
  const position =
    safeCurrent === 1
      ? "first"
      : safeCurrent === safeTotal
        ? "last"
        : "middle";
  const classes = [styles.root, styles[layout], className]
    .filter(Boolean)
    .join(" ");

  return (
    <nav
      {...props}
      aria-label={props["aria-label"] ?? "Paginação"}
      className={classes}
      data-figma-node-id="240:807"
      data-layout={layout}
      data-position={position}
    >
      {showResults ? (
        <span className={styles.results}>{resultsLabel}</span>
      ) : null}

      <div className={styles.navigation}>
        <button
          aria-label="Página anterior"
          className={styles.iconButton}
          disabled={safeCurrent === 1}
          onClick={() => onPageChange?.(safeCurrent - 1)}
          type="button"
        >
          <img alt="" aria-hidden="true" src={getAssetUrl(arrowLeft)} />
        </button>

        <span className={styles.pageLabel}>
          Página {safeCurrent} de {safeTotal}
        </span>

        <button
          aria-label="Próxima página"
          className={styles.iconButton}
          disabled={safeCurrent === safeTotal}
          onClick={() => onPageChange?.(safeCurrent + 1)}
          type="button"
        >
          <img alt="" aria-hidden="true" src={getAssetUrl(arrowRight)} />
        </button>
      </div>
    </nav>
  );
}

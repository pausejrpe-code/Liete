import type { HTMLAttributes } from "react";
import { getAssetUrl } from "../internal/asset-url";
import {
  StatusChip,
  type StatusChipIntent
} from "../status-chip/status-chip";
import trendDown from "./assets/trend-down.svg";
import trendUp from "./assets/trend-up.svg";
import styles from "./metric-card.module.css";

export type MetricCardSize = "regular" | "compact";
export type MetricCardTone = "neutral" | "positive" | "warning";
export type MetricTrendDirection = "up" | "down";

export type MetricCardProps = Omit<HTMLAttributes<HTMLElement>, "title"> & {
  label?: string;
  showStatus?: boolean;
  showSupporting?: boolean;
  showTrend?: boolean;
  size?: MetricCardSize;
  supporting?: string;
  tone?: MetricCardTone;
  trendDirection?: MetricTrendDirection;
  trendLabel?: string;
  value?: string;
};

const statusByTone: Record<MetricCardTone, StatusChipIntent> = {
  neutral: "pending",
  positive: "confirmed",
  warning: "soldOut"
};

export function MetricCard({
  className,
  label = "Vendas confirmadas",
  showStatus = true,
  showSupporting = true,
  showTrend = true,
  size = "regular",
  supporting = "Atualizado há 5 min",
  tone = "neutral",
  trendDirection,
  trendLabel = "+3%",
  value = "R$ 24.500",
  ...props
}: MetricCardProps) {
  const direction =
    trendDirection ?? (size === "compact" && tone === "neutral" ? "down" : "up");
  const classes = [styles.root, styles[size], styles[tone], className]
    .filter(Boolean)
    .join(" ");

  return (
    <article
      {...props}
      className={classes}
      data-figma-node-id="238:792"
      data-size={size}
      data-tone={tone}
    >
      <div className={styles.header}>
        <span className={styles.label}>{label}</span>
        {showStatus ? (
          <StatusChip intent={statusByTone[tone]} size="small" />
        ) : null}
      </div>

      <div className={styles.metric}>
        <strong className={styles.value}>{value}</strong>
        {showSupporting && showTrend ? (
          <span className={styles.trend}>
            <span>{trendLabel}</span>
            <span aria-hidden="true" className={styles.trendIcon}>
              <img
                alt=""
                src={getAssetUrl(direction === "down" ? trendDown : trendUp)}
              />
            </span>
          </span>
        ) : null}
      </div>

      {showSupporting ? (
        <p className={styles.supporting}>{supporting}</p>
      ) : null}
    </article>
  );
}

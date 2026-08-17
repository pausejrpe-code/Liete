import type { HTMLAttributes } from "react";
import styles from "./goal-progress.module.css";

export type GoalProgressLayout = "regular" | "compact";
export type GoalProgressValue = 25 | 50 | 75 | 100;

export type GoalProgressProps = HTMLAttributes<HTMLDivElement> & {
  current?: number;
  label?: string;
  layout?: GoalProgressLayout;
  progress?: GoalProgressValue;
  showRatio?: boolean;
  showSupporting?: boolean;
  supporting?: string;
  total?: number;
};

const currentByProgress: Record<GoalProgressValue, number> = {
  25: 8,
  50: 15,
  75: 23,
  100: 30
};

export function GoalProgress({
  className,
  current,
  label = "Meta mínima de passageiros",
  layout = "regular",
  progress = 25,
  showRatio = true,
  showSupporting = true,
  supporting,
  total = 30,
  ...props
}: GoalProgressProps) {
  const complete = progress === 100;
  const safeTotal = Math.max(1, total);
  const safeCurrent = Math.min(
    Math.max(0, current ?? currentByProgress[progress]),
    safeTotal
  );
  const classes = [styles.root, styles[layout], complete && styles.complete, className]
    .filter(Boolean)
    .join(" ");
  const supportingText =
    supporting ??
    (complete
      ? "Meta mínima atingida. A excursão pode ser confirmada."
      : "Acompanhe as vendas até atingir a quantidade mínima.");

  return (
    <div
      {...props}
      className={classes}
      data-figma-node-id="239:62"
      data-layout={layout}
      data-progress={progress}
    >
      <div className={styles.header}>
        <span className={styles.label}>{label}</span>
        {showRatio ? (
          <strong className={styles.ratio}>
            {safeCurrent} de {safeTotal}
          </strong>
        ) : null}
      </div>

      <div
        aria-label={label}
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={progress}
        aria-valuetext={`${safeCurrent} de ${safeTotal}`}
        className={styles.track}
        role="progressbar"
      >
        <span className={styles.bar} style={{ width: `${progress}%` }} />
      </div>

      {showSupporting ? (
        <p className={styles.supporting}>{supportingText}</p>
      ) : null}
    </div>
  );
}

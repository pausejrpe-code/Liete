import type { HTMLAttributes } from "react";
import styles from "./rating.module.css";

export type RatingSize = "sm" | "md";
export type RatingLabelMode = "none" | "score" | "score-count";

export type RatingProps = HTMLAttributes<HTMLDivElement> & {
  count?: number;
  labelMode?: RatingLabelMode;
  locale?: string;
  max?: number;
  size?: RatingSize;
  value?: number;
};

export function Rating({
  className,
  count = 128,
  labelMode = "score-count",
  locale = "pt-BR",
  max = 5,
  size = "sm",
  value = 4.8,
  ...props
}: RatingProps) {
  const clampedValue = Math.min(max, Math.max(0, value));
  const filled = Math.floor(clampedValue);
  const score = new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(clampedValue);
  const countLabel = new Intl.NumberFormat(locale).format(count);
  const label = `${score} de ${max} estrelas${count ? `, ${countLabel} avaliações` : ""}`;
  const classes = [styles.root, styles[size], className].filter(Boolean).join(" ");

  return (
    <div {...props} aria-label={label} className={classes} data-size={size} role="img">
      <span aria-hidden="true" className={styles.stars}>
        {Array.from({ length: max }, (_, index) => (
          <span key={index}>{index < filled ? "★" : "☆"}</span>
        ))}
      </span>
      {labelMode !== "none" ? <span className={styles.score}>{score}</span> : null}
      {labelMode === "score-count" ? (
        <span className={styles.count}>({countLabel} avaliações)</span>
      ) : null}
    </div>
  );
}

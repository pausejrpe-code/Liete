import type { HTMLAttributes } from "react";
import dotAttention from "./assets/dot-attention.svg";
import dotDisabled from "./assets/dot-disabled.svg";
import dotError from "./assets/dot-error.svg";
import dotSuccess from "./assets/dot-success.svg";
import { getAssetUrl, type AssetSource } from "../internal/asset-url";
import styles from "./badge.module.css";

export type BadgeTone =
  | "success"
  | "attention"
  | "error"
  | "disabled"
  | "pure"
  | "secondary"
  | "dark";

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  label?: string;
  showDot?: boolean;
  tone?: BadgeTone;
};

const dots: Partial<Record<BadgeTone, AssetSource>> = {
  success: dotSuccess,
  attention: dotAttention,
  error: dotError,
  disabled: dotDisabled
};

export function Badge({
  className,
  label = "Disponível",
  showDot = true,
  tone = "success",
  ...props
}: BadgeProps) {
  const dot = showDot ? dots[tone] : undefined;
  const classes = [styles.badge, styles[tone], className].filter(Boolean).join(" ");

  return (
    <span className={classes} data-tone={tone} {...props}>
      {dot ? (
        <img alt="" aria-hidden="true" className={styles.dot} src={getAssetUrl(dot)} />
      ) : null}
      {label}
    </span>
  );
}

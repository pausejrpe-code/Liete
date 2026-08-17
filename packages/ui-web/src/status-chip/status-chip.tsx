import type { HTMLAttributes } from "react";
import { getAssetUrl, type AssetSource } from "../internal/asset-url";
import availableMd from "./assets/available-md.svg";
import availableSm from "./assets/available-sm.svg";
import cancelledMd from "./assets/cancelled-md.svg";
import cancelledSm from "./assets/cancelled-sm.svg";
import confirmedMd from "./assets/confirmed-md.svg";
import confirmedSm from "./assets/confirmed-sm.svg";
import pendingMd from "./assets/pending-md.svg";
import pendingSm from "./assets/pending-sm.svg";
import soldOutMd from "./assets/sold-out-md.svg";
import soldOutSm from "./assets/sold-out-sm.svg";
import verifiedMd from "./assets/verified-md.svg";
import verifiedSm from "./assets/verified-sm.svg";
import styles from "./status-chip.module.css";

export type StatusChipIntent =
  | "available"
  | "pending"
  | "confirmed"
  | "cancelled"
  | "soldOut"
  | "verified";
export type StatusChipSize = "small" | "medium";

export type StatusChipProps = HTMLAttributes<HTMLSpanElement> & {
  intent?: StatusChipIntent;
  label?: string;
  size?: StatusChipSize;
};

const labels: Record<StatusChipIntent, string> = {
  available: "Disponível",
  pending: "Pendente",
  confirmed: "Confirmado",
  cancelled: "Cancelado",
  soldOut: "Esgotado",
  verified: "Verificado"
};

const dots: Record<StatusChipSize, Record<StatusChipIntent, AssetSource>> = {
  small: {
    available: availableSm,
    pending: pendingSm,
    confirmed: confirmedSm,
    cancelled: cancelledSm,
    soldOut: soldOutSm,
    verified: verifiedSm
  },
  medium: {
    available: availableMd,
    pending: pendingMd,
    confirmed: confirmedMd,
    cancelled: cancelledMd,
    soldOut: soldOutMd,
    verified: verifiedMd
  }
};

export function StatusChip({
  className,
  intent = "available",
  label,
  size = "small",
  ...props
}: StatusChipProps) {
  const classes = [styles.root, styles[intent], styles[size], className]
    .filter(Boolean)
    .join(" ");

  return (
    <span
      {...props}
      className={classes}
      data-intent={intent}
      data-size={size}
    >
      <img
        alt=""
        aria-hidden="true"
        className={styles.dot}
        src={getAssetUrl(dots[size][intent])}
      />
      {label ?? labels[intent]}
    </span>
  );
}

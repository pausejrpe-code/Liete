"use client";

import type { CSSProperties, HTMLAttributes } from "react";
import infoIcon from "./assets/info.svg";
import { getAssetUrl } from "../internal/asset-url";
import styles from "./toast-alert.module.css";

export type ToastAlertFormat = "toast" | "inline";
export type ToastAlertTone = "info" | "success" | "warning" | "error";

const defaultContent: Record<ToastAlertTone, { message: string; title: string }> = {
  info: { title: "Novidade na viagem", message: "O organizador adicionou novas fotos." },
  success: { title: "Reserva confirmada", message: "Enviamos os detalhes pelo WhatsApp." },
  warning: { title: "Atenção ao prazo", message: "Revise a política antes de confirmar." },
  error: { title: "Pagamento recusado", message: "Tente outro cartão ou use Pix." }
};

export type ToastAlertProps = HTMLAttributes<HTMLDivElement> & {
  format?: ToastAlertFormat;
  message?: string;
  onDismiss?: () => void;
  title?: string;
  tone?: ToastAlertTone;
};

export function ToastAlert({
  className,
  format = "toast",
  message,
  onDismiss,
  title,
  tone = "info",
  ...props
}: ToastAlertProps) {
  const content = defaultContent[tone];
  const classes = [styles.root, styles[format], styles[tone], className]
    .filter(Boolean)
    .join(" ");
  const iconStyle = {
    "--toast-alert-icon": `url("${getAssetUrl(infoIcon)}")`
  } as CSSProperties;
  const role = tone === "warning" || tone === "error" ? "alert" : "status";

  return (
    <div {...props} className={classes} data-format={format} data-tone={tone} role={role}>
      <span aria-hidden="true" className={styles.iconContainer}>
        <span className={styles.icon} style={iconStyle} />
      </span>
      <div className={styles.content}>
        <strong>{title ?? content.title}</strong>
        <p>{message ?? content.message}</p>
      </div>
      {format === "toast" ? (
        <button aria-label="Fechar aviso" className={styles.dismiss} onClick={onDismiss} type="button">
          ×
        </button>
      ) : null}
    </div>
  );
}

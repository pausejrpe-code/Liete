"use client";

import { useEffect, useId, useRef, type HTMLAttributes, type ReactNode } from "react";
import { Button } from "../button/button";
import styles from "./modal-dialog.module.css";

export type ModalDialogSize = "sm" | "md";
export type ModalDialogIntent = "default" | "destructive";
export type ModalDialogPresentation = "modal" | "inline";

export type ModalDialogProps = Omit<HTMLAttributes<HTMLDialogElement>, "children" | "onClose"> & {
  backLabel?: string;
  children?: ReactNode;
  confirmLabel?: string;
  intent?: ModalDialogIntent;
  onConfirm?: () => void;
  onClose?: () => void;
  open?: boolean;
  presentation?: ModalDialogPresentation;
  size?: ModalDialogSize;
  title?: string;
};

export function ModalDialog({
  backLabel = "Voltar",
  children = "Revise as informações antes de continuar.",
  className,
  confirmLabel = "Confirmar",
  intent = "default",
  onConfirm,
  onClose,
  open = false,
  presentation = "modal",
  size = "sm",
  title = "Confirmar ação",
  ...props
}: ModalDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  const classes = [styles.card, styles[size], styles[intent], className]
    .filter(Boolean)
    .join(" ");

  useEffect(() => {
    if (presentation !== "modal") return;
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      if (typeof dialog.showModal === "function") dialog.showModal();
      else dialog.setAttribute("open", "");
    } else if (!open && dialog.open) {
      if (typeof dialog.close === "function") dialog.close();
      else dialog.removeAttribute("open");
    }
  }, [open, presentation]);

  const content = (
    <>
      <div className={styles.content}>
        <h2 id={titleId}>{title}</h2>
        <div className={styles.body} id={descriptionId}>
          {children}
        </div>
      </div>
      <div className={styles.actions}>
        <Button
          onClick={onClose}
          size="sm"
          variant={intent === "destructive" ? "dangerGhost" : "ghost"}
        >
          {backLabel}
        </Button>
        <Button
          onClick={onConfirm}
          size="sm"
          variant={intent === "destructive" ? "danger" : "primary"}
        >
          {confirmLabel}
        </Button>
      </div>
    </>
  );

  if (presentation === "inline") {
    return (
      <section
        aria-describedby={descriptionId}
        aria-labelledby={titleId}
        className={classes}
        data-intent={intent}
        data-size={size}
        role="dialog"
      >
        {content}
      </section>
    );
  }

  return (
    <dialog
      {...props}
      aria-describedby={descriptionId}
      aria-labelledby={titleId}
      className={classes}
      data-intent={intent}
      data-size={size}
      onCancel={(event) => {
        event.preventDefault();
        onClose?.();
      }}
      onClose={onClose}
      ref={dialogRef}
    >
      {content}
    </dialog>
  );
}

"use client";

import { useId, type HTMLAttributes, type MouseEventHandler } from "react";
import { Button } from "../button/button";
import styles from "./empty-state.module.css";

export type EmptyStateContext = "search" | "reservations" | "admin";

export type EmptyStateProps = Omit<HTMLAttributes<HTMLElement>, "title"> & {
  actionLabel?: string;
  context?: EmptyStateContext;
  description?: string;
  onAction?: MouseEventHandler<HTMLButtonElement>;
  title?: string;
};

const copy: Record<EmptyStateContext, { action: string; description: string; title: string }> = {
  search: {
    action: "Limpar filtros",
    description: "Tente mudar o destino, a data ou o tipo de passeio.",
    title: "Nenhuma viagem encontrada"
  },
  reservations: {
    action: "Explorar viagens",
    description: "Quando reservar uma caravana, seus detalhes aparecem aqui.",
    title: "Você ainda não tem reservas"
  },
  admin: {
    action: "Explorar viagens",
    description: "Novos documentos, reembolsos e denúncias aparecem nesta fila.",
    title: "Nada pendente por aqui"
  }
};

export function EmptyState({
  actionLabel,
  className,
  context = "search",
  description,
  onAction,
  title,
  ...props
}: EmptyStateProps) {
  const titleId = useId();
  const descriptionId = useId();
  const content = copy[context];
  const classes = [styles.root, className].filter(Boolean).join(" ");

  return (
    <section
      {...props}
      aria-describedby={descriptionId}
      aria-labelledby={titleId}
      className={classes}
      data-context={context}
    >
      <h3 className={styles.title} id={titleId}>{title ?? content.title}</h3>
      <p className={styles.description} id={descriptionId}>
        {description ?? content.description}
      </p>
      <Button onClick={onAction} size="sm">{actionLabel ?? content.action}</Button>
    </section>
  );
}

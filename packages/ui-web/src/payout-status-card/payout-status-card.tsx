import type { HTMLAttributes } from "react";
import { Button } from "../button/button";
import {
  StatusChip,
  type StatusChipIntent
} from "../status-chip/status-chip";
import styles from "./payout-status-card.module.css";

export type PayoutStatusCardLayout = "regular" | "compact";
export type PayoutStage =
  | "collecting"
  | "minimumReached"
  | "afterTrip"
  | "paid";

type StageContent = {
  amount: string;
  description: string;
  firstTransfer: string;
  label: string;
  remainingBalance: string;
  status: StatusChipIntent;
};

const contentByStage: Record<PayoutStage, StageContent> = {
  collecting: {
    amount: "R$ 0,00",
    description:
      "O primeiro repasse será liberado quando a meta mínima for atingida.",
    firstTransfer: "Aguardando meta",
    label: "Disponível agora",
    remainingBalance: "Após o passeio",
    status: "pending"
  },
  minimumReached: {
    amount: "R$ 8.500,00",
    description:
      "Valor liberado para contratar transporte e fornecedores.",
    firstTransfer: "Liberado",
    label: "Disponível agora",
    remainingBalance: "Após o passeio",
    status: "available"
  },
  afterTrip: {
    amount: "R$ 2.400,00",
    description:
      "As vendas adicionais estão sendo conciliadas após o passeio.",
    firstTransfer: "Enviado",
    label: "Saldo em processamento",
    remainingBalance: "Em processamento",
    status: "verified"
  },
  paid: {
    amount: "R$ 10.900,00",
    description: "Todos os repasses desta excursão foram concluídos.",
    firstTransfer: "Pago",
    label: "Total repassado",
    remainingBalance: "Pago",
    status: "confirmed"
  }
};

export type PayoutStatusCardProps = Omit<
  HTMLAttributes<HTMLElement>,
  "title"
> & {
  amount?: string;
  description?: string;
  layout?: PayoutStatusCardLayout;
  onDetailsClick?: () => void;
  showAction?: boolean;
  showDetails?: boolean;
  showStatus?: boolean;
  stage?: PayoutStage;
  statusLabel?: string;
  title?: string;
};

export function PayoutStatusCard({
  amount,
  className,
  description,
  layout = "regular",
  onDetailsClick,
  showAction = true,
  showDetails = true,
  showStatus = true,
  stage = "collecting",
  statusLabel,
  title = "Repasse da excursão",
  ...props
}: PayoutStatusCardProps) {
  const content = contentByStage[stage];
  const classes = [
    styles.root,
    styles[layout],
    styles[stage],
    className
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section
      {...props}
      className={classes}
      data-figma-node-id="244:928"
      data-layout={layout}
      data-stage={stage}
    >
      <header className={styles.header}>
        <h2>{title}</h2>
        {showStatus ? (
          <StatusChip
            intent={content.status}
            label={statusLabel}
            size="small"
          />
        ) : null}
      </header>

      <p className={styles.label}>{content.label}</p>
      <strong className={styles.amount}>{amount ?? content.amount}</strong>
      <p className={styles.description}>
        {description ?? content.description}
      </p>

      {showDetails ? (
        <dl className={styles.details}>
          <div>
            <dt>Primeiro repasse</dt>
            <dd>{content.firstTransfer}</dd>
          </div>
          <div>
            <dt>Saldo restante</dt>
            <dd>{content.remainingBalance}</dd>
          </div>
        </dl>
      ) : null}

      {showAction ? (
        <Button onClick={onDetailsClick} size="sm" variant="ghost">
          Ver detalhes
        </Button>
      ) : null}
    </section>
  );
}

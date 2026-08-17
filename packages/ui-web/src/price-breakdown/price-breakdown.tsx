import type { HTMLAttributes } from "react";
import { StatusChip } from "../status-chip/status-chip";
import styles from "./price-breakdown.module.css";

export type PriceBreakdownLayout = "regular" | "compact";

export type PriceBreakdownProps = Omit<
  HTMLAttributes<HTMLElement>,
  "title"
> & {
  cardFeeAmount?: string;
  cardFeeLabel?: string;
  costAmount?: string;
  feeAmount?: string;
  helperText?: string;
  layout?: PriceBreakdownLayout;
  profitAmount?: string;
  showHelper?: boolean;
  showStatus?: boolean;
  subtotalAmount?: string;
  subtitle?: string;
  title?: string;
  totalAmount?: string;
};

export function PriceBreakdown({
  cardFeeAmount,
  cardFeeLabel = "Taxa do cartão",
  className,
  costAmount = "R$ 70,00",
  feeAmount = "R$ 15,00",
  helperText = "Valor final disponível para publicação.",
  layout = "regular",
  profitAmount = "R$ 30,00",
  showHelper = true,
  showStatus = false,
  subtotalAmount = "R$ 100,00",
  subtitle = "Resumo do valor de cada ingresso",
  title = "Composição do preço",
  totalAmount = "R$ 115,00",
  ...props
}: PriceBreakdownProps) {
  const classes = [styles.root, styles[layout], className]
    .filter(Boolean)
    .join(" ");

  return (
    <section
      {...props}
      className={classes}
      data-figma-node-id="242:868"
      data-layout={layout}
    >
      <div className={styles.inner}>
        <header className={styles.header}>
          <div className={styles.titleRow}>
            <h2>{title}</h2>
            {showStatus ? (
              <StatusChip intent="confirmed" size="small" />
            ) : null}
          </div>
          <p>{subtitle}</p>
        </header>

        <div aria-hidden="true" className={styles.divider} />

        <div className={styles.content}>
          <dl className={styles.rows}>
            <div>
              <dt>Custos por passageiro</dt>
              <dd>{costAmount}</dd>
            </div>
            <div>
              <dt>Seu ganho por ingresso</dt>
              <dd>{profitAmount}</dd>
            </div>
            <div>
              <dt>Subtotal do organizador</dt>
              <dd>{subtotalAmount}</dd>
            </div>
            {cardFeeAmount ? (
              <div>
                <dt>{cardFeeLabel}</dt>
                <dd>{cardFeeAmount}</dd>
              </div>
            ) : null}
            <div className={styles.fee}>
              <dt>Taxa da plataforma (15%)</dt>
              <dd>{feeAmount}</dd>
            </div>
          </dl>

          <div className={styles.summary}>
            <div className={styles.total}>
              <span>Viajante paga</span>
              <strong className={styles.totalAmount}>{totalAmount}</strong>
            </div>

            {showHelper ? <p className={styles.helper}>{helperText}</p> : null}
          </div>
        </div>
      </div>
    </section>
  );
}

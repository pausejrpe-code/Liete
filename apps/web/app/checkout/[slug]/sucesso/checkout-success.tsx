"use client";

import { useEffect, useState } from "react";
import { Button, StatusChip } from "@liete/ui-web";
import { formatTravelerCurrency, type TravelerExcursion } from "../../../_traveler/traveler-data";
import { TravelerShell } from "../../../_traveler/traveler-shell";
import { withBasePath } from "../../../../lib/site-path";
import styles from "./checkout-success.module.css";

export function CheckoutSuccess({ excursion }: { excursion: TravelerExcursion }) {
  const [orderId, setOrderId] = useState("LIE-28491");
  const [voucherCode, setVoucherCode] = useState("LIE-28491-SP");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const qOrderId = params.get("order_id") || params.get("session_id");
    const qVoucher = params.get("voucher_code");
    if (qOrderId) setOrderId(qOrderId);
    if (qVoucher) setVoucherCode(qVoucher);
  }, []);

  return (
    <TravelerShell authenticated>
      <div className={styles.pageContent}>
        <section className={styles.successCard}>
          <span aria-hidden="true" className={styles.successIcon}>✓</span>
          <StatusChip intent="confirmed" label="Reserva confirmada" size="medium" />
          <h1>Sua próxima aventura está garantida!</h1>
          <p>Enviamos a confirmação para seu e-mail cadastrado e também pelo WhatsApp.</p>
          <div className={styles.tripSummary}>
            <img alt="" src={withBasePath(excursion.image)} />
            <div>
              <span>Reserva {orderId.startsWith("ord-") ? `LIE-${orderId.slice(-5).toUpperCase()}` : orderId}</span>
              <h2>{excursion.title}</h2>
              <p>{excursion.date} • Saída de {excursion.departureCity}</p>
              <strong>{formatTravelerCurrency(excursion.price)}</strong>
              <p style={{ marginTop: "0.25rem", fontSize: "0.85rem", color: "var(--color-primary-600, #047857)" }}>
                Voucher: <strong>{voucherCode}</strong>
              </p>
            </div>
          </div>
          <div className={styles.nextSteps}>
            <h2>O que acontece agora?</h2>
            <ol>
              <li><strong>1</strong><span>Você recebe a confirmação e os dados da reserva.</span></li>
              <li><strong>2</strong><span>Enviaremos lembretes por e-mail e WhatsApp.</span></li>
              <li><strong>3</strong><span>O voucher ficará disponível em Minhas excursões.</span></li>
            </ol>
          </div>
          <div className={styles.actions}>
            <Button onClick={() => window.location.assign(withBasePath(`/minhas-excursoes/${orderId}/`))} size="lg">
              Ver minha reserva
            </Button>
            <Button onClick={() => window.location.assign(withBasePath("/excursoes/"))} size="lg" variant="ghost">
              Explorar outras excursões
            </Button>
          </div>
        </section>
      </div>
    </TravelerShell>
  );
}

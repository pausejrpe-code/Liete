"use client";

import { useState } from "react";
import { Button, ModalDialog, StatusChip, ToastAlert } from "@liete/ui-web";
import {
  formatTravelerCurrency,
  type TravelerBooking,
  type TravelerExcursion
} from "../../_traveler/traveler-data";
import { TravelerShell } from "../../_traveler/traveler-shell";
import { withBasePath } from "../../../lib/site-path";
import styles from "./booking-details.module.css";

export function BookingDetails({ booking, excursion }: { booking: TravelerBooking; excursion: TravelerExcursion }) {
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelRequested, setCancelRequested] = useState(false);
  const [supportRequested, setSupportRequested] = useState(false);

  return (
    <TravelerShell authenticated>
      <div className={styles.pageContent}>
        <nav aria-label="Navegação estrutural" className={styles.breadcrumb}>
          <a href={withBasePath("/minhas-excursoes/")}>Minhas excursões</a><span>/</span><span aria-current="page">{booking.id}</span>
        </nav>
        <header className={styles.header}>
          <div>
            <span>Reserva {booking.id}</span>
            <h1>{excursion.title}</h1>
            <p>{booking.tripDate ?? excursion.date} • Saída de {excursion.departureCity}</p>
          </div>
          <StatusChip intent={cancelRequested ? "pending" : booking.statusIntent} label={cancelRequested ? "Cancelamento solicitado" : booking.statusLabel} size="medium" />
        </header>

        {cancelRequested ? <ToastAlert format="inline" message="A solicitação foi registrada e será analisada conforme a política da excursão." title="Cancelamento solicitado" tone="success" /> : null}
        {supportRequested ? <ToastAlert format="inline" message="O chamado de atendimento foi registrado. Nossa equipe entrará em contato via e-mail e WhatsApp." title="Suporte solicitado" tone="info" /> : null}

        <div className={styles.layout}>
          <div className={styles.mainColumn}>
            <section className={styles.tripCard}>
              <img alt="" src={withBasePath(excursion.image)} />
              <div>
                <h2>Informações da viagem</h2>
                <dl>
                  <div><dt>Destino</dt><dd>{excursion.destination}</dd></div>
                  <div><dt>Data</dt><dd>{booking.tripDate ?? excursion.date}</dd></div>
                  <div><dt>Duração</dt><dd>{excursion.durationLabel}</dd></div>
                  <div><dt>Organizador</dt><dd>{excursion.organizer}</dd></div>
                </dl>
              </div>
            </section>

            <section className={styles.card}>
              <h2>Embarque</h2>
              <ul>{excursion.boardingPoints.map((point) => <li key={point}>{point}</li>)}</ul>
            </section>

            <section className={styles.card}>
              <h2>Participantes</h2>
              <ul className={styles.participants}>{booking.participants.map((participant) => <li key={participant.document}><strong>{participant.name}</strong><span>{participant.document} • Nascimento: {participant.birthDate}</span></li>)}</ul>
            </section>

            <section className={styles.card} id="support">
              <h2>Ajuda com esta reserva</h2>
              <p>Fale com o suporte para dúvidas sobre embarque, pagamento ou alterações.</p>
              <Button onClick={() => setSupportRequested(true)} size="sm" variant="ghost">Solicitar suporte</Button>
            </section>
          </div>

          <aside className={styles.sideColumn}>
            <section aria-labelledby="voucher-title" className={styles.voucherCard}>
              <div className={styles.voucherHeader}><div><span>Voucher da reserva</span><h2 id="voucher-title">{booking.id}</h2></div><StatusChip intent="verified" label="Válido" /></div>
              <div aria-label={`Código do voucher ${booking.voucherCode}`} className={styles.qrCode} role="img"><span>{booking.voucherCode}</span></div>
              <p>Apresente este voucher no embarque. Ele inclui todos os {booking.participants.length} participantes.</p>
            </section>

            <section className={styles.paymentCard}>
              <h2>Pagamento</h2>
              <dl>
                <div><dt>Status</dt><dd>{booking.paymentStatus}</dd></div>
                <div><dt>Forma</dt><dd>{booking.paymentMethod}</dd></div>
                <div><dt>Compra</dt><dd>{booking.orderDate}</dd></div>
                <div className={styles.total}><dt>Total</dt><dd>{formatTravelerCurrency(booking.total)}</dd></div>
              </dl>
            </section>

            {booking.status === "upcoming" && !cancelRequested ? (
              <Button className={styles.cancelAction} onClick={() => setCancelOpen(true)} variant="dangerGhost">Solicitar cancelamento</Button>
            ) : null}
          </aside>
        </div>
      </div>

      <ModalDialog
        backLabel="Manter reserva"
        confirmLabel="Solicitar cancelamento"
        intent="destructive"
        onClose={() => setCancelOpen(false)}
        onConfirm={async () => {
          setCancelRequested(true);
          setCancelOpen(false);
          try {
            await fetch(withBasePath("/api/traveler/bookings/cancel"), {
              body: JSON.stringify({ bookingId: booking.id }),
              headers: { "Content-Type": "application/json" },
              method: "POST"
            });
          } catch {
            // Handled gracefully
          }
        }}
        open={cancelOpen}
        size="sm"
        title="Cancelar esta reserva?"
      >
        <p>O pedido será analisado conforme a política da excursão. O estorno não é automático.</p>
      </ModalDialog>
    </TravelerShell>
  );
}

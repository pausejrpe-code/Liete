"use client";

import { useEffect, useState } from "react";
import { Button, EmptyState, StatusChip, Tabs } from "@liete/ui-web";
import {
  formatTravelerCurrency,
  getTravelerExcursion,
  type TravelerBooking,
  type TravelerBookingStatus
} from "../_traveler/traveler-data";
import { TravelerShell } from "../_traveler/traveler-shell";
import { withBasePath } from "../../lib/site-path";
import { useAuth } from "../../lib/auth-context";
import styles from "./bookings-dashboard.module.css";

const tabItems = [
  { label: "Próximas", value: "upcoming" },
  { label: "Passadas", value: "past" },
  { label: "Canceladas", value: "cancelled" }
];

export function BookingsDashboard() {
  const { profile, user } = useAuth();
  const [status, setStatus] = useState<TravelerBookingStatus>("upcoming");
  const [bookingsList, setBookingsList] = useState<TravelerBooking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBookings() {
      try {
        const res = await fetch(withBasePath("/api/traveler/bookings"));
        if (res.ok) {
          const data = await res.json();
          if (data.bookings && Array.isArray(data.bookings)) {
            const mapped: TravelerBooking[] = data.bookings.map((b: any) => ({
              excursionSlug: b.excursion_id || "holambra-festival-flores",
              id: b.id,
              orderDate: new Date(b.created_at).toLocaleDateString("pt-BR"),
              participants: (b.participants || []).map((p: any) => ({
                birthDate: p.birth_date || "",
                document: p.document || "•••.•••.•••-••",
                name: p.full_name || "Participante"
              })),
              paymentMethod: b.payment_method === "card" ? "Cartão de crédito" : "Pix",
              paymentStatus:
                b.payment_status === "paid" ? "Pagamento confirmado" : "Aguardando confirmação",
              status:
                b.status === "confirmed"
                  ? "upcoming"
                  : b.status === "cancelled"
                  ? "cancelled"
                  : "upcoming",
              statusIntent:
                b.status === "confirmed"
                  ? "confirmed"
                  : b.status === "cancelled"
                  ? "cancelled"
                  : "pending",
              statusLabel:
                b.status === "confirmed"
                  ? "Confirmada"
                  : b.status === "cancelled"
                  ? "Cancelada"
                  : "Pendente",
              total: Number(b.total_amount),
              voucherCode: b.voucher_code || "LIE-VOUCHER"
            }));
            setBookingsList(mapped);
          }
        }
      } catch {
        // Fallback
      } finally {
        setLoading(false);
      }
    }

    loadBookings();
  }, []);

  const displayName = profile?.full_name || user?.email?.split("@")[0] || "Aventureiro";
  const firstName = displayName.split(" ")[0];

  const visibleBookings = bookingsList.filter((booking) => booking.status === status);

  return (
    <TravelerShell authenticated>
      <div className={styles.pageContent}>
        <header className={styles.header}>
          <div>
            <span>Olá, {firstName}</span>
            <h1>Minhas excursões</h1>
            <p>Acompanhe suas reservas, vouchers, pagamentos e detalhes de embarque.</p>
          </div>
          <Button onClick={() => window.location.assign(withBasePath("/excursoes/"))} size="lg">
            Explorar excursões
          </Button>
        </header>

        <Tabs
          className={styles.tabs}
          items={tabItems}
          label="Status das excursões"
          onValueChange={(value) => setStatus(value as TravelerBookingStatus)}
          value={status}
          variant="pill"
        />

        {visibleBookings.length > 0 ? (
          <section
            aria-label={`${tabItems.find((item) => item.value === status)?.label} excursões`}
            className={styles.bookingList}
          >
            {visibleBookings.map((booking) => {
              const excursion = getTravelerExcursion(booking.excursionSlug) || {
                date: "15 nov 2026",
                departureCity: "São Paulo",
                destination: "Destino incrível",
                durationLabel: "Bate-volta",
                image: "/home/trip-sakura.jpeg",
                organizer: "Organizador parceiro",
                title: "Excursão Liete"
              };

              return (
                <article className={styles.bookingCard} key={booking.id}>
                  <img alt="" src={withBasePath(excursion.image)} />
                  <div className={styles.bookingDetails}>
                    <div className={styles.cardTop}>
                      <div>
                        <span>Reserva {booking.id}</span>
                        <h2>{excursion.title}</h2>
                      </div>
                      <StatusChip intent={booking.statusIntent} label={booking.statusLabel} />
                    </div>
                    <dl className={styles.tripMeta}>
                      <div>
                        <dt>Data</dt>
                        <dd>{booking.tripDate ?? excursion.date}</dd>
                      </div>
                      <div>
                        <dt>Embarque</dt>
                        <dd>{excursion.departureCity}</dd>
                      </div>
                      <div>
                        <dt>Participantes</dt>
                        <dd>{booking.participants.length} pessoa(s)</dd>
                      </div>
                      <div>
                        <dt>Total</dt>
                        <dd>{formatTravelerCurrency(booking.total)}</dd>
                      </div>
                    </dl>
                    <div className={styles.actions}>
                      <a
                        className={styles.voucherLink}
                        href={withBasePath(`/minhas-excursoes/${booking.id}/`)}
                      >
                        Ver voucher e detalhes
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        ) : (
          <EmptyState
            actionLabel="Descobrir novas excursões"
            className={styles.emptyState}
            description="Você não possui nenhuma reserva nesta categoria no momento."
            onAction={() => window.location.assign(withBasePath("/excursoes/"))}
            title="Nenhuma excursão encontrada"
          />
        )}
      </div>
    </TravelerShell>
  );
}

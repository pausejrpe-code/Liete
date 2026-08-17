"use client";

import { useEffect, useMemo, useState } from "react";
import {
  DataTable,
  EmptyState,
  MetricCard,
  ModalDialog,
  OrganizerAppShell
} from "@liete/ui-web";
import { withBasePath } from "../../../lib/site-path";
import { useAuth } from "../../../lib/auth-context";
import { organizerSidebarItemHrefs } from "../organizer-navigation";
import {
  formatCurrency,
  toDataTableRow,
  type ExcursionOverview
} from "./excursions-dashboard-data";
import styles from "./excursions-dashboard.module.css";

const PAGE_SIZE = 4;

function getInitials(name?: string | null): string {
  if (!name) return "OR";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function ExcursionsDashboard() {
  const { profile, user } = useAuth();

  const [currentPage, setCurrentPage] = useState(1);
  const [excursionsList, setExcursionsList] = useState<ExcursionOverview[]>([]);
  const [selectedExcursion, setSelectedExcursion] = useState<ExcursionOverview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadExcursions() {
      try {
        const res = await fetch(withBasePath("/api/organizer/excursions"));
        if (res.ok) {
          const data = await res.json();
          if (data.excursions && Array.isArray(data.excursions)) {
            const mapped: ExcursionOverview[] = data.excursions.map((e: any) => ({
              capacity: e.capacity,
              date: e.date,
              destination: e.destination,
              id: e.id,
              minimumParticipants: e.minimum_group || 20,
              slug: e.slug || e.id,
              soldSeats: e.sold_seats || 0,
              status: e.status,
              statusLabel:
                e.status === "confirmed"
                  ? "Confirmada"
                  : e.status === "sold_out"
                  ? "Esgotada"
                  : "Disponível",
              ticketPrice: Number(e.price_per_seat),
              title: e.title
            }));
            setExcursionsList(mapped);
          }
        }
      } catch {
        // Safe fallback to empty list
      } finally {
        setLoading(false);
      }
    }

    loadExcursions();
  }, []);

  const displayName = profile?.full_name || user?.email?.split("@")[0] || "Organizador";
  const firstName = displayName.split(" ")[0];
  const userInitials = getInitials(displayName);

  const totalPages = Math.max(1, Math.ceil(excursionsList.length / PAGE_SIZE));
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const pageEnd = Math.min(pageStart + PAGE_SIZE, excursionsList.length);
  const visibleExcursions = useMemo(
    () => excursionsList.slice(pageStart, pageEnd),
    [excursionsList, pageEnd, pageStart]
  );

  const activeCount = excursionsList.filter((e) => e.status === "available" || e.status === "confirmed").length;
  const soldSeatsTotal = excursionsList.reduce((acc, e) => acc + e.soldSeats, 0);
  const estimatedRev = excursionsList.reduce((acc, e) => acc + e.soldSeats * e.ticketPrice, 0);

  const goToNewExcursion = () => {
    window.location.assign(withBasePath("/organizador/excursoes/nova/"));
  };

  return (
    <div className={styles.page}>
      <OrganizerAppShell
        accountHref={organizerSidebarItemHrefs.account}
        accountInitials={userInitials}
        accountName={firstName}
        activeSidebarItemId="explore"
        className={styles.shell}
        contentLabel="Painel de excursões"
        navigation="collapsed"
        pageHeaderProps={{
          onPrimaryAction: goToNewExcursion,
          primaryActionLabel: "Nova excursão",
          showBack: false,
          showPrimaryAction: true,
          showSecondaryAction: false,
          subtitle: "Acompanhe suas excursões, vendas e próximas saídas.",
          title: "Excursões"
        }}
        sidebarItemHrefs={organizerSidebarItemHrefs}
      >
        <div className={styles.dashboard}>
          <section aria-labelledby="excursion-summary-title">
            <h2 className={styles.srOnly} id="excursion-summary-title">
              Resumo das excursões
            </h2>
            <div className={styles.metricsGrid}>
              <MetricCard
                className={styles.metricCard}
                label="Excursões ativas"
                showStatus={false}
                size="compact"
                supporting="Publicadas e confirmadas"
                tone="positive"
                trendLabel="Em venda"
                value={String(activeCount)}
              />
              <MetricCard
                className={styles.metricCard}
                label="Próximas saídas"
                showStatus={false}
                size="compact"
                supporting="Viagens programadas"
                tone="neutral"
                trendLabel="Confirmadas"
                value={String(activeCount)}
              />
              <MetricCard
                className={styles.metricCard}
                label="Vagas vendidas"
                showStatus={false}
                size="compact"
                supporting="Excursões não canceladas"
                tone="positive"
                trendLabel="Ingressos"
                value={String(soldSeatsTotal)}
              />
              <MetricCard
                className={styles.metricCard}
                label="Receita estimada"
                showStatus={false}
                showTrend={false}
                size="compact"
                supporting="Total bruto em vendas"
                tone="neutral"
                trendLabel="Em vendas"
                value={formatCurrency(estimatedRev)}
              />
            </div>
          </section>

          {excursionsList.length > 0 ? (
            <DataTable
              className={styles.table}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              onRowAction={(row) => {
                setSelectedExcursion(
                  excursionsList.find((excursion) => excursion.id === row.id) ?? null
                );
              }}
              resultsLabel={`${pageStart + 1}–${pageEnd} de ${excursionsList.length} excursões`}
              rowActionLabel="Acompanhar"
              rows={visibleExcursions.map(toDataTableRow)}
              showPrimaryAction={false}
              title="Suas excursões"
              totalPages={totalPages}
            />
          ) : (
            <EmptyState
              actionLabel="Criar primeira excursão"
              className={styles.emptyState}
              context="admin"
              description="Crie sua primeira excursão para começar a acompanhar vendas e saídas."
              onAction={goToNewExcursion}
              title="Você ainda não criou excursões"
            />
          )}
        </div>
      </OrganizerAppShell>

      <ModalDialog
        backLabel="Fechar"
        confirmLabel="Criar semelhante"
        onClose={() => setSelectedExcursion(null)}
        onConfirm={goToNewExcursion}
        open={Boolean(selectedExcursion)}
        size="sm"
        title={selectedExcursion?.title ?? "Detalhes da excursão"}
      >
        {selectedExcursion ? (
          <dl className={styles.detailsList}>
            <div>
              <dt>Destino</dt>
              <dd>{selectedExcursion.destination}</dd>
            </div>
            <div>
              <dt>Saída</dt>
              <dd>{selectedExcursion.date}</dd>
            </div>
            <div>
              <dt>Vagas vendidas</dt>
              <dd>
                {selectedExcursion.soldSeats}/{selectedExcursion.capacity}
              </dd>
            </div>
            <div>
              <dt>Ingresso</dt>
              <dd>{formatCurrency(selectedExcursion.ticketPrice)}</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>{selectedExcursion.statusLabel}</dd>
            </div>
            <div style={{ marginTop: "1rem", paddingTop: "0.75rem", borderTop: "1px solid var(--color-neutral-200, #e5e7eb)" }}>
              <a
                href={withBasePath(`/excursoes/${selectedExcursion.slug || selectedExcursion.id}/`)}
                style={{
                  color: "var(--color-primary-700, #047857)",
                  display: "inline-flex",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  textDecoration: "none"
                }}
                target="_blank"
              >
                Abrir página pública da excursão ↗
              </a>
            </div>
          </dl>
        ) : null}
      </ModalDialog>
    </div>
  );
}

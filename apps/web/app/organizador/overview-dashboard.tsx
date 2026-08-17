"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Button,
  EmptyState,
  GoalProgress,
  MetricCard,
  OrganizerAppShell,
  PayoutStatusCard,
  StatusChip,
  type GoalProgressValue
} from "@liete/ui-web";
import { withBasePath } from "../../lib/site-path";
import { useAuth } from "../../lib/auth-context";
import { formatCurrency } from "./financeiro/financial-dashboard-data";
import { organizerSidebarItemHrefs } from "./organizer-navigation";
import styles from "./overview-dashboard.module.css";

function navigate(path: string) {
  window.location.assign(withBasePath(path));
}

function progressFor(current: number, total: number): GoalProgressValue {
  const ratio = current / Math.max(1, total);
  if (ratio >= 1) return 100;
  if (ratio >= 0.75) return 75;
  if (ratio >= 0.5) return 50;
  return 25;
}

function getInitials(name?: string | null): string {
  if (!name) return "OR";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

type ExcursionItem = {
  capacity: number;
  date: string;
  destination: string;
  id: string;
  minimumGroup: number;
  soldSeats: number;
  status: any;
  statusLabel: string;
  title: string;
};

export function OverviewDashboard() {
  const { profile, user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [excursionsList, setExcursionsList] = useState<ExcursionItem[]>([]);
  const [financialData, setFinancialData] = useState<{
    grossVolume: number;
    nextPayout: any;
    paidAmount: number;
    pendingRefunds: number;
    receivableBalance: number;
  }>({
    grossVolume: 0,
    nextPayout: null,
    paidAmount: 0,
    pendingRefunds: 0,
    receivableBalance: 0
  });

  const [stripeStatus, setStripeStatus] = useState<{
    onboardingCompleted: boolean;
  }>({ onboardingCompleted: true });

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [excRes, finRes, stripeRes] = await Promise.all([
          fetch(withBasePath("/api/organizer/excursions")),
          fetch(withBasePath("/api/organizer/financial")),
          fetch(withBasePath("/api/organizer/stripe/status"))
        ]);

        if (excRes.ok) {
          const excData = await excRes.json();
          if (excData.excursions && Array.isArray(excData.excursions)) {
            setExcursionsList(
              excData.excursions.map((e: any) => ({
                capacity: e.capacity,
                date: e.date,
                destination: e.destination,
                id: e.id,
                minimumGroup: e.minimum_group,
                soldSeats: e.sold_seats || 0,
                status: e.status,
                statusLabel:
                  e.status === "confirmed"
                    ? "Confirmada"
                    : e.status === "sold_out"
                    ? "Esgotada"
                    : "Disponível",
                title: e.title
              }))
            );
          }
        }

        if (finRes.ok) {
          const finData = await finRes.json();
          if (finData.metrics) {
            setFinancialData({
              grossVolume: finData.metrics.grossVolume || 0,
              nextPayout: finData.nextPayout || null,
              paidAmount: finData.metrics.paidAmount || 0,
              pendingRefunds: finData.metrics.pendingRefunds || 0,
              receivableBalance: finData.metrics.receivableBalance || 0
            });
          }
        }

        if (stripeRes.ok) {
          const sData = await stripeRes.json();
          setStripeStatus(sData);
        }
      } catch {
        // Fallback
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const displayName = profile?.full_name || user?.email?.split("@")[0] || "Organizador";
  const firstName = displayName.split(" ")[0];
  const userInitials = getInitials(displayName);

  const activeExcursions = useMemo(
    () =>
      excursionsList.filter(
        (e) => e.status === "available" || e.status === "confirmed" || e.status === "sold_out"
      ),
    [excursionsList]
  );

  const totalSoldSeats = useMemo(
    () => excursionsList.reduce((sum, e) => sum + (e.soldSeats || 0), 0),
    [excursionsList]
  );

  const totalCapacity = useMemo(
    () => activeExcursions.reduce((sum, e) => sum + (e.capacity || 0), 0),
    [activeExcursions]
  );

  const averageOccupancy = totalCapacity > 0 ? Math.round((totalSoldSeats / totalCapacity) * 100) : 0;

  const upcomingExcursions = activeExcursions.slice(0, 3);

  return (
    <div className={styles.page}>
      <OrganizerAppShell
        accountHref={organizerSidebarItemHrefs.account}
        accountInitials={userInitials}
        accountName={firstName}
        activeSidebarItemId="dashboard"
        className={styles.shell}
        contentLabel="Visão geral do organizador"
        navigation="collapsed"
        pageHeaderProps={{
          onPrimaryAction: () => navigate("/organizador/excursoes/nova/"),
          primaryActionLabel: "Nova excursão",
          showBack: false,
          showSecondaryAction: false,
          subtitle: "Acompanhe seus resultados e gerencie suas próximas saídas.",
          title: `Olá, ${firstName}`
        }}
        sidebarItemHrefs={organizerSidebarItemHrefs}
      >
        <div className={styles.dashboard}>
          {!stripeStatus.onboardingCompleted ? (
            <div style={{ marginBottom: "1.5rem" }}>
              <div
                style={{
                  alignItems: "center",
                  background: "#f0fdf4",
                  border: "1px solid #bbf7d0",
                  borderRadius: "12px",
                  display: "flex",
                  gap: "1rem",
                  justifyContent: "space-between",
                  padding: "1rem 1.25rem"
                }}
              >
                <div>
                  <strong style={{ color: "#166534", display: "block", fontSize: "0.95rem" }}>
                    Configure seus recebimentos no Stripe Connect
                  </strong>
                  <p style={{ color: "#15803d", fontSize: "0.85rem", margin: "0.25rem 0 0" }}>
                    Conecte sua conta bancária para receber repasses automáticos de vendas de excursões.
                  </p>
                </div>
                <Button onClick={() => navigate("/organizador/perfil/")} size="sm">
                  Configurar agora
                </Button>
              </div>
            </div>
          ) : null}

          <section aria-labelledby="overview-summary-title">
            <h2 className={styles.srOnly} id="overview-summary-title">
              Resumo principal
            </h2>
            <div className={styles.metricsGrid}>
              <MetricCard
                className={styles.metricCard}
                label="Saldo a receber"
                showStatus={false}
                showTrend={false}
                size="compact"
                supporting="Repasses e fechamentos previstos"
                tone="positive"
                value={formatCurrency(financialData.receivableBalance)}
              />
              <MetricCard
                className={styles.metricCard}
                label="Ingressos vendidos"
                showStatus={false}
                showTrend={false}
                size="compact"
                supporting="Total acumulado em vendas"
                tone="positive"
                value={String(totalSoldSeats)}
              />
              <MetricCard
                className={styles.metricCard}
                label="Excursões ativas"
                showStatus={false}
                showTrend={false}
                size="compact"
                supporting="Publicadas e em venda"
                tone="neutral"
                value={String(activeExcursions.length)}
              />
              <MetricCard
                className={styles.metricCard}
                label="Ocupação média"
                showStatus={false}
                showTrend={false}
                size="compact"
                supporting="Nas excursões ativas"
                tone="positive"
                value={`${averageOccupancy}%`}
              />
            </div>
          </section>

          <div className={styles.primaryGrid}>
            <section aria-labelledby="overview-attention-title" className={styles.attentionCard}>
              <div className={styles.cardHeader}>
                <div>
                  <h2 id="overview-attention-title">Precisa da sua atenção</h2>
                  <p>Ações prioritárias para o seu negócio.</p>
                </div>
              </div>
              <ul className={styles.attentionList}>
                {activeExcursions.length === 0 ? (
                  <li>
                    <div className={styles.attentionContent}>
                      <div className={styles.attentionTitle}>
                        <h3>Crie sua primeira excursão</h3>
                        <StatusChip intent="pending" label="Comece agora" />
                      </div>
                      <p>Publique um novo roteiro para começar a vender ingressos na Liete.</p>
                    </div>
                    <a href={withBasePath("/organizador/excursoes/nova/")}>Criar excursão</a>
                  </li>
                ) : (
                  <li>
                    <div className={styles.attentionContent}>
                      <div className={styles.attentionTitle}>
                        <h3>Acompanhamento de vendas</h3>
                        <StatusChip intent="available" label="Em andamento" />
                      </div>
                      <p>Acompanhe o preenchimento da meta mínima para confirmar as saídas.</p>
                    </div>
                    <a href={withBasePath("/organizador/excursoes/")}>Ver excursões</a>
                  </li>
                )}
                <li>
                  <div className={styles.attentionContent}>
                    <div className={styles.attentionTitle}>
                      <h3>Perfil e recebimentos</h3>
                      <StatusChip intent="verified" label="Conta ativa" />
                    </div>
                    <p>Mantenha seus dados bancários e cadastrais atualizados.</p>
                  </div>
                  <a href={withBasePath("/organizador/perfil/")}>Gerenciar perfil</a>
                </li>
              </ul>
            </section>

            <PayoutStatusCard
              amount={
                financialData.nextPayout
                  ? formatCurrency(financialData.nextPayout.amount)
                  : "R$ 0,00"
              }
              className={styles.payoutCard}
              description={
                financialData.nextPayout
                  ? `Previsão para ${financialData.nextPayout.scheduled_date}.`
                  : "Não há pagamentos programados no momento."
              }
              onDetailsClick={() => navigate("/organizador/financeiro/")}
              showDetails={false}
              stage="minimumReached"
              statusLabel={financialData.nextPayout ? "Programado" : "Sem pendências"}
              title="Próximo repasse"
            />
          </div>

          <section aria-labelledby="overview-upcoming-title" className={styles.upcomingCard}>
            <div className={styles.cardHeader}>
              <div>
                <h2 id="overview-upcoming-title">Próximas excursões</h2>
                <p>Acompanhe a meta mínima antes das próximas saídas.</p>
              </div>
              {upcomingExcursions.length > 0 ? (
                <Button onClick={() => navigate("/organizador/excursoes/")} size="sm" variant="ghost">
                  Ver todas
                </Button>
              ) : null}
            </div>

            {upcomingExcursions.length === 0 ? (
              <EmptyState
                actionLabel="Criar nova excursão"
                description="Você ainda não possui excursões cadastradas. Crie seu primeiro roteiro agora mesmo."
                onAction={() => navigate("/organizador/excursoes/nova/")}
                title="Nenhuma excursão ativa"
              />
            ) : (
              <div className={styles.upcomingGrid}>
                {upcomingExcursions.map((excursion) => (
                  <article className={styles.excursionCard} key={excursion.id}>
                    <div className={styles.excursionHeader}>
                      <div>
                        <h3>{excursion.title}</h3>
                        <p>
                          {excursion.date} • {excursion.destination}
                        </p>
                      </div>
                      <StatusChip intent={excursion.status} label={excursion.statusLabel} />
                    </div>
                    <GoalProgress
                      className={styles.excursionProgress}
                      current={excursion.soldSeats}
                      label="Meta mínima"
                      layout="compact"
                      progress={progressFor(excursion.soldSeats, excursion.minimumGroup)}
                      supporting={
                        excursion.soldSeats >= excursion.minimumGroup
                          ? "Meta atingida. A excursão pode ser confirmada."
                          : `${excursion.minimumGroup - excursion.soldSeats} vagas para atingir a meta.`
                      }
                      total={excursion.minimumGroup}
                    />
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </OrganizerAppShell>
    </div>
  );
}

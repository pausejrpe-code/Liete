"use client";

import { useEffect, useId, useMemo, useState } from "react";
import {
  Button,
  EmptyState,
  MetricCard,
  ModalDialog,
  OrganizerAppShell,
  Pagination,
  PayoutStatusCard,
  Select,
  StatusChip
} from "@liete/ui-web";
import { withBasePath } from "../../../lib/site-path";
import { useAuth } from "../../../lib/auth-context";
import { organizerSidebarItemHrefs } from "../organizer-navigation";
import {
  financialMetrics as fallbackMetrics,
  financialRecords as fallbackRecords,
  flowByPeriod as fallbackFlow,
  formatCurrency,
  nextPayout as fallbackNextPayout,
  periodLabels,
  type FinancialFlowPoint,
  type FinancialPeriod,
  type FinancialRecord,
  type FinancialRecordStatus
} from "./financial-dashboard-data";
import styles from "./financial-dashboard.module.css";

const PAGE_SIZE = 4;

function FinancialFlowChart({
  period,
  points
}: {
  period: FinancialPeriod;
  points: FinancialFlowPoint[];
}) {
  const titleId = useId();
  const descriptionId = useId();
  const width = 700;
  const height = 240;
  const left = 48;
  const right = 676;
  const top = 20;
  const bottom = 194;
  const maxValue = Math.max(1000, ...points.flatMap((point) => [point.gross, point.net]));
  const roundedMax = Math.ceil(maxValue / 5000) * 5000;
  const pointPosition = (value: number, index: number) => ({
    x: left + ((right - left) * index) / Math.max(1, points.length - 1),
    y: bottom - ((bottom - top) * value) / roundedMax
  });
  const line = (key: "gross" | "net") =>
    points
      .map((point, index) => {
        const position = pointPosition(point[key], index);
        return `${index === 0 ? "M" : "L"} ${position.x} ${position.y}`;
      })
      .join(" ");

  return (
    <figure className={styles.chartCard}>
      <div className={styles.chartHeader}>
        <div>
          <h2>Fluxo financeiro</h2>
          <p>{periodLabels[period]}</p>
        </div>
        <div aria-label="Legenda do gráfico" className={styles.legend}>
          <span><i className={styles.grossLegend} />Vendas brutas</span>
          <span><i className={styles.netLegend} />Valor líquido</span>
        </div>
      </div>

      <svg
        aria-labelledby={`${titleId} ${descriptionId}`}
        className={styles.chart}
        role="img"
        viewBox={`0 0 ${width} ${height}`}
      >
        <title id={titleId}>Vendas brutas e valor líquido</title>
        <desc id={descriptionId}>
          Comparação entre vendas brutas e valor líquido no período de {periodLabels[period].toLowerCase()}.
        </desc>
        {[0, 0.5, 1].map((ratio) => {
          const y = bottom - (bottom - top) * ratio;
          return (
            <g key={ratio}>
              <line className={styles.gridLine} x1={left} x2={right} y1={y} y2={y} />
              <text className={styles.axisLabel} x="0" y={y + 4}>
                {formatCurrency(roundedMax * ratio)}
              </text>
            </g>
          );
        })}
        <path className={styles.grossLine} d={line("gross")} />
        <path className={styles.netLine} d={line("net")} />
        {points.map((point, index) => {
          const gross = pointPosition(point.gross, index);
          const net = pointPosition(point.net, index);
          return (
            <g key={point.label}>
              <circle className={styles.pointGross} cx={gross.x} cy={gross.y} r="4" />
              <circle className={styles.pointNet} cx={net.x} cy={net.y} r="4" />
              <text className={styles.labelX} x={gross.x} y={bottom + 20}>
                {point.label}
              </text>
            </g>
          );
        })}
      </svg>
    </figure>
  );
}

function FinancialRecords({
  currentPage,
  onPageChange,
  onRecordSelect,
  onResetFilter,
  records,
  totalRecords
}: {
  currentPage: number;
  onPageChange: (page: number) => void;
  onRecordSelect: (record: FinancialRecord) => void;
  onResetFilter: () => void;
  records: FinancialRecord[];
  totalRecords: number;
}) {
  const totalPages = Math.max(1, Math.ceil(totalRecords / PAGE_SIZE));
  const start = totalRecords === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const end = Math.min(currentPage * PAGE_SIZE, totalRecords);

  return (
    <section aria-labelledby="financial-records-title" className={styles.recordsCard}>
      <div className={styles.recordsHeader}>
        <div>
          <h2 id="financial-records-title">Financeiro por excursão</h2>
          <p>Valores consolidados de vendas, repasses e reservas.</p>
        </div>
      </div>

      {records.length === 0 ? (
        <EmptyState
          actionLabel="Limpar filtro"
          className={styles.emptyState}
          context="admin"
          description="Não há excursões com esse status financeiro."
          onAction={onResetFilter}
          title="Nenhum resultado encontrado"
        />
      ) : (
        <>
          <div className={styles.desktopRecords}>
            <table className={styles.recordsTable}>
              <thead>
                <tr>
                  <th scope="col">Excursão</th>
                  <th scope="col">Vendas brutas</th>
                  <th scope="col">Taxas</th>
                  <th scope="col">Estornos</th>
                  <th scope="col">Líquido</th>
                  <th scope="col">Previsão</th>
                  <th scope="col">Status</th>
                  <th scope="col">Ação</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => (
                  <tr key={record.id}>
                    <td>
                      <strong>{record.excursion}</strong>
                      <span>{record.departureDate}</span>
                    </td>
                    <td>{formatCurrency(record.grossSales)}</td>
                    <td>{formatCurrency(record.platformFee + record.cardFee)}</td>
                    <td>{formatCurrency(record.refunds)}</td>
                    <td>{formatCurrency(record.netReceivable)}</td>
                    <td>{record.payoutDate}</td>
                    <td>
                      <StatusChip intent={record.statusIntent} label={record.statusLabel} />
                    </td>
                    <td>
                      <Button onClick={() => onRecordSelect(record)} size="sm" variant="ghost">
                        Detalhes
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ul className={styles.mobileRecords}>
            {records.map((record) => (
              <li className={styles.recordCard} key={record.id}>
                <div className={styles.recordCardHeader}>
                  <div>
                    <strong>{record.excursion}</strong>
                    <span>{record.departureDate}</span>
                  </div>
                  <StatusChip intent={record.statusIntent} label={record.statusLabel} />
                </div>
                <dl>
                  <div><dt>Vendas brutas</dt><dd>{formatCurrency(record.grossSales)}</dd></div>
                  <div><dt>Taxas</dt><dd>{formatCurrency(record.platformFee + record.cardFee)}</dd></div>
                  <div><dt>Estornos</dt><dd>{formatCurrency(record.refunds)}</dd></div>
                  <div><dt>Valor líquido</dt><dd>{formatCurrency(record.netReceivable)}</dd></div>
                  <div><dt>Previsão</dt><dd>{record.payoutDate}</dd></div>
                </dl>
                <Button onClick={() => onRecordSelect(record)} size="sm" variant="ghost">
                  Ver detalhes
                </Button>
              </li>
            ))}
          </ul>

          <Pagination
            className={styles.pagination}
            currentPage={currentPage}
            onPageChange={onPageChange}
            resultsLabel={`${start}–${end} de ${totalRecords} excursões`}
            totalPages={totalPages}
          />
        </>
      )}
    </section>
  );
}

export function FinancialDashboard() {
  const { profile, user } = useAuth();
  const [period, setPeriod] = useState<FinancialPeriod>("90d");
  const [status, setStatus] = useState<FinancialRecordStatus | "all">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRecord, setSelectedRecord] = useState<FinancialRecord | null>(null);

  const [metrics, setMetrics] = useState({
    netRevenue: 0,
    pendingClosure: 0,
    receivableBalance: 0,
    refunds: 0
  });
  const [recordsList, setRecordsList] = useState<FinancialRecord[]>([]);

  useEffect(() => {
    async function loadFinance() {
      try {
        const res = await fetch(withBasePath("/api/organizer/financial"));
        if (res.ok) {
          const data = await res.json();
          if (data && data.metrics) {
            setMetrics({
              netRevenue: data.metrics.paidAmount || data.metrics.grossVolume || 0,
              pendingClosure: data.metrics.activeExcursionsCount || 0,
              receivableBalance: data.metrics.receivableBalance || 0,
              refunds: data.metrics.pendingRefunds || 0
            });
            if (data.records && Array.isArray(data.records)) {
              setRecordsList(data.records);
            }
          }
        }
      } catch {
        // Fallback
      }
    }

    loadFinance();
  }, []);

  const displayName = profile?.full_name || user?.email?.split("@")[0] || "Organizador";
  const firstName = displayName.split(" ")[0];
  const userInitials = displayName.slice(0, 2).toUpperCase();

  const filteredRecords = useMemo(
    () => recordsList.filter((record) => status === "all" || record.status === status),
    [recordsList, status]
  );
  const visibleRecords = filteredRecords.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const changeStatus = (nextStatus: FinancialRecordStatus | "all") => {
    setStatus(nextStatus);
    setCurrentPage(1);
  };

  return (
    <div className={styles.page}>
      <OrganizerAppShell
        accountHref={organizerSidebarItemHrefs.account}
        accountInitials={userInitials}
        accountName={firstName}
        activeSidebarItemId="analytics"
        className={styles.shell}
        contentLabel="Painel financeiro"
        navigation="collapsed"
        pageHeaderProps={{
          showBack: false,
          showPrimaryAction: false,
          showSecondaryAction: false,
          subtitle: "Acompanhe vendas, estornos, fechamentos e repasses via Stripe Connect.",
          title: "Financeiro"
        }}
        sidebarItemHrefs={organizerSidebarItemHrefs}
      >
        <div className={styles.dashboard}>
          <section aria-labelledby="financial-filters-title" className={styles.filtersCard}>
            <div>
              <h2 id="financial-filters-title">Visão financeira consolidada</h2>
              <p>Métricas de vendas e previsão de repasses em 2 etapas.</p>
            </div>
            <div className={styles.filterControls}>
              <Select
                className={styles.filter}
                hideHelperText
                label="Período do gráfico"
                onChange={(event) => setPeriod(event.currentTarget.value as FinancialPeriod)}
                value={period}
              >
                <option value="30d">Últimos 30 dias</option>
                <option value="90d">Últimos 90 dias</option>
                <option value="180d">Últimos 6 meses</option>
              </Select>
              <Select
                className={styles.filter}
                hideHelperText
                label="Status financeiro"
                onChange={(event) => changeStatus(event.currentTarget.value as FinancialRecordStatus | "all")}
                value={status}
              >
                <option value="all">Todos os status</option>
                <option value="pendingClosure">Em fechamento</option>
                <option value="scheduled">Programado</option>
                <option value="paid">Pago</option>
                <option value="refundReview">Estorno em análise</option>
              </Select>
            </div>
          </section>

          <section aria-labelledby="financial-summary-title">
            <h2 className={styles.srOnly} id="financial-summary-title">Resumo financeiro</h2>
            <div className={styles.metricsGrid}>
              <MetricCard
                className={styles.metricCard}
                label="Saldo a receber"
                showStatus={false}
                showTrend={false}
                size="compact"
                supporting="Fechamentos e repasses previstos"
                tone="positive"
                value={formatCurrency(metrics.receivableBalance)}
              />
              <MetricCard
                className={styles.metricCard}
                label="Receita bruta de vendas"
                showStatus={false}
                showTrend={false}
                size="compact"
                supporting="Total acumulado em pedidos pagos"
                tone="positive"
                value={formatCurrency(metrics.netRevenue)}
              />
              <MetricCard
                className={styles.metricCard}
                label="Estornos"
                showStatus={false}
                showTrend={false}
                size="compact"
                supporting="Valores devolvidos ou em análise"
                tone="warning"
                value={formatCurrency(metrics.refunds)}
              />
              <MetricCard
                className={styles.metricCard}
                label="Excursões em venda"
                showStatus={false}
                size="compact"
                supporting="Saídas ativas no catálogo"
                tone="neutral"
                trendLabel="Excursões"
                value={String(metrics.pendingClosure)}
              />
            </div>
          </section>

          <div className={styles.insightsGrid}>
            <FinancialFlowChart period={period} points={fallbackFlow[period]} />
            <PayoutStatusCard
              amount={fallbackNextPayout ? formatCurrency(fallbackNextPayout.netReceivable) : "Sem previsão"}
              className={styles.nextPayout}
              description={fallbackNextPayout ? `Previsão para ${fallbackNextPayout.payoutDate}, referente a ${fallbackNextPayout.excursion}.` : "Não há pagamentos programados."}
              onDetailsClick={() => setSelectedRecord(fallbackNextPayout)}
              showDetails={false}
              stage="minimumReached"
              statusLabel="Programado"
              title="Próximo repasse"
            />
          </div>

          <FinancialRecords
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            onRecordSelect={setSelectedRecord}
            onResetFilter={() => changeStatus("all")}
            records={visibleRecords}
            totalRecords={filteredRecords.length}
          />
        </div>
      </OrganizerAppShell>

      <ModalDialog
        backLabel="Fechar"
        confirmLabel="Ver excursões"
        onClose={() => setSelectedRecord(null)}
        onConfirm={() => window.location.assign(organizerSidebarItemHrefs.explore)}
        open={Boolean(selectedRecord)}
        size="sm"
        title={selectedRecord?.excursion ?? "Detalhes financeiros"}
      >
        {selectedRecord ? (
          <dl className={styles.detailsList}>
            <div><dt>Vendas brutas</dt><dd>{formatCurrency(selectedRecord.grossSales, true)}</dd></div>
            <div><dt>Taxa da plataforma</dt><dd>− {formatCurrency(selectedRecord.platformFee, true)}</dd></div>
            <div><dt>Taxa de cartão</dt><dd>− {formatCurrency(selectedRecord.cardFee, true)}</dd></div>
            <div><dt>Estornos</dt><dd>− {formatCurrency(selectedRecord.refunds, true)}</dd></div>
            <div className={styles.detailsTotal}><dt>Valor líquido</dt><dd>{formatCurrency(selectedRecord.netReceivable, true)}</dd></div>
            <div><dt>Previsão</dt><dd>{selectedRecord.payoutDate}</dd></div>
          </dl>
        ) : null}
      </ModalDialog>
    </div>
  );
}

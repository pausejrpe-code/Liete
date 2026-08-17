"use client";

import {
  useId,
  type ElementType,
  type HTMLAttributes,
  type MouseEventHandler
} from "react";
import { Button } from "../button/button";
import { Pagination } from "../pagination/pagination";
import { Skeleton } from "../skeleton/skeleton";
import {
  StatusChip,
  type StatusChipIntent
} from "../status-chip/status-chip";
import styles from "./data-table.module.css";

export type DataTableLayout = "responsive" | "desktop" | "mobile";
export type DataTableState = "default" | "empty" | "loading";

export type DataTableRow = {
  date: string;
  destination?: string;
  id: string;
  price?: string;
  sales: string;
  status: StatusChipIntent;
  statusLabel?: string;
  title: string;
};

export type DataTableProps = Omit<HTMLAttributes<HTMLElement>, "title"> & {
  currentPage?: number;
  emptyActionLabel?: string;
  emptyDescription?: string;
  emptyTitle?: string;
  headingLevel?: 2 | 3;
  layout?: DataTableLayout;
  onPageChange?: (page: number) => void;
  onPrimaryAction?: MouseEventHandler<HTMLButtonElement>;
  onRowAction?: (row: DataTableRow) => void;
  primaryActionLabel?: string;
  resultsLabel?: string;
  rowActionLabel?: string;
  rows?: DataTableRow[];
  showPagination?: boolean;
  showPrimaryAction?: boolean;
  showRowActions?: boolean;
  state?: DataTableState;
  title?: string;
  totalPages?: number;
};

const defaultRows: DataTableRow[] = [
  {
    date: "15 ago 2026",
    destination: "Capitólio, MG",
    id: "capitolio",
    price: "R$ 365,00",
    sales: "24/30",
    status: "available",
    statusLabel: "Publicada",
    title: "Capitólio bate-volta"
  },
  {
    date: "29 ago 2026",
    destination: "São Roque de Minas, MG",
    id: "canastra",
    price: "R$ 540,00",
    sales: "12/25",
    status: "pending",
    statusLabel: "Rascunho",
    title: "Serra da Canastra"
  },
  {
    date: "05 set 2026",
    destination: "Campos do Jordão, SP",
    id: "festival-inverno",
    price: "R$ 290,00",
    sales: "40/40",
    status: "soldOut",
    statusLabel: "Lotada",
    title: "Festival de Inverno"
  }
];

export function DataTable({
  className,
  currentPage = 1,
  emptyActionLabel = "Publicar excursão",
  emptyDescription = "Crie sua primeira excursão para começar a vender.",
  emptyTitle = "Nenhuma excursão publicada",
  headingLevel = 2,
  layout = "responsive",
  onPageChange,
  onPrimaryAction,
  onRowAction,
  primaryActionLabel = "Nova excursão",
  resultsLabel = "21–30 de 128 excursões",
  rowActionLabel = "Detalhes",
  rows = defaultRows,
  showPagination = true,
  showPrimaryAction = true,
  showRowActions = true,
  state = "default",
  title = "Excursões",
  totalPages = 10,
  ...props
}: DataTableProps) {
  const titleId = useId();
  const Heading = `h${headingLevel}` as ElementType;
  const classes = [styles.root, styles[layout], className]
    .filter(Boolean)
    .join(" ");
  const paginationLayout =
    layout === "desktop" ? "desktop" : layout === "mobile" ? "mobile" : "responsive";

  return (
    <section
      {...props}
      aria-busy={state === "loading"}
      aria-labelledby={titleId}
      className={classes}
      data-figma-node-id="249:1030"
      data-layout={layout}
      data-state={state}
    >
      <div className={styles.toolbar}>
        <Heading className={styles.title} id={titleId}>
          {title}
        </Heading>
        {showPrimaryAction ? (
          <Button
            onClick={onPrimaryAction}
            size="md"
            variant="ghost"
          >
            {primaryActionLabel}
          </Button>
        ) : null}
      </div>

      {state === "empty" ? (
        <div className={styles.empty} role="status">
          <h3>{emptyTitle}</h3>
          <p>{emptyDescription}</p>
          {showPrimaryAction ? (
            <Button onClick={onPrimaryAction} size="md">
              {emptyActionLabel}
            </Button>
          ) : null}
        </div>
      ) : null}

      {state === "loading" ? (
        <div
          aria-label="Carregando excursões"
          className={styles.loading}
          role="status"
        >
          {[0, 1, 2].map((item) => (
            <Skeleton
              className={styles.loadingRow}
              key={item}
              type="table-row"
            />
          ))}
        </div>
      ) : null}

      {state === "default" ? (
        <>
          {layout !== "mobile" ? (
            <div className={styles.desktopContent}>
              <table className={styles.table}>
                <colgroup>
                  <col className={styles.titleColumn} />
                  <col />
                  <col />
                  <col />
                  <col />
                  <col />
                  {showRowActions ? <col /> : null}
                </colgroup>
                <thead>
                  <tr>
                    <th scope="col">Excursão</th>
                    <th scope="col">Destino</th>
                    <th scope="col">Saída</th>
                    <th scope="col">Vagas</th>
                    <th scope="col">Ingresso</th>
                    <th scope="col">Status</th>
                    {showRowActions ? <th scope="col">Ação</th> : null}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.id}>
                      <td>{row.title}</td>
                      <td>{row.destination ?? "—"}</td>
                      <td>{row.date}</td>
                      <td>{row.sales}</td>
                      <td>{row.price ?? "—"}</td>
                      <td>
                        <StatusChip
                          intent={row.status}
                          label={row.statusLabel}
                        />
                      </td>
                      {showRowActions ? (
                        <td>
                          <Button
                            onClick={() => onRowAction?.(row)}
                            size="sm"
                            variant="ghost"
                          >
                            {rowActionLabel}
                          </Button>
                        </td>
                      ) : null}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}

          {layout !== "desktop" ? (
            <ul className={styles.mobileContent}>
              {rows.map((row) => (
                <li className={styles.card} key={row.id}>
                  <div className={styles.cardTop}>
                    <strong>{row.title}</strong>
                    <StatusChip
                      intent={row.status}
                      label={row.statusLabel}
                    />
                  </div>
                  <dl className={styles.cardDetails}>
                    <div>
                      <dt>Destino</dt>
                      <dd>{row.destination ?? "—"}</dd>
                    </div>
                    <div>
                      <dt>Saída</dt>
                      <dd>{row.date}</dd>
                    </div>
                    <div>
                      <dt>Vagas</dt>
                      <dd>{row.sales}</dd>
                    </div>
                    <div>
                      <dt>Ingresso</dt>
                      <dd>{row.price ?? "—"}</dd>
                    </div>
                  </dl>
                  {showRowActions ? (
                    <Button
                      onClick={() => onRowAction?.(row)}
                      size="sm"
                      variant="ghost"
                    >
                      {rowActionLabel}
                    </Button>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : null}

          {showPagination ? (
            <Pagination
              className={styles.pagination}
              currentPage={currentPage}
              layout={paginationLayout}
              onPageChange={onPageChange}
              resultsLabel={resultsLabel}
              totalPages={totalPages}
            />
          ) : null}
        </>
      ) : null}
    </section>
  );
}

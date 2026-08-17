"use client";

import type {
  CSSProperties,
  HTMLAttributes,
  MouseEvent,
  ReactNode
} from "react";
import { getAssetUrl, type AssetSource } from "../internal/asset-url";
import accountCircle from "./assets/account-circle.svg";
import barChart from "./assets/bar-chart.svg";
import dashboard from "./assets/dashboard.svg";
import explore from "./assets/explore.svg";
import styles from "./sidebar.module.css";

export type SidebarLayout =
  | "collapsed"
  | "expanded"
  | "mobile"
  | "mobileBar";

export type SidebarItem = {
  href?: string;
  icon?: ReactNode;
  id: string;
  label: string;
};

export type SidebarItemHrefMap = Partial<Record<string, string>>;

type InternalSidebarItem = SidebarItem & {
  iconAsset?: AssetSource;
  iconSize?: number;
};

export type SidebarProps = Omit<HTMLAttributes<HTMLElement>, "onSelect"> & {
  activeItemId?: string;
  ariaLabel?: string;
  itemHrefs?: SidebarItemHrefMap;
  items?: SidebarItem[];
  layout?: SidebarLayout;
  onItemSelect?: (itemId: string) => void;
};

const defaultItems: InternalSidebarItem[] = [
  {
    href: "#dashboard",
    iconAsset: dashboard,
    iconSize: 18,
    id: "dashboard",
    label: "Visão geral"
  },
  {
    href: "#explore",
    iconAsset: explore,
    iconSize: 20,
    id: "explore",
    label: "Excursões"
  },
  {
    href: "#analytics",
    iconAsset: barChart,
    iconSize: 16,
    id: "analytics",
    label: "Financeiro"
  },
  {
    href: "#account",
    iconAsset: accountCircle,
    iconSize: 20,
    id: "account",
    label: "Perfil"
  }
];

function DefaultIcon({
  asset,
  size
}: {
  asset: AssetSource;
  size: number;
}) {
  return (
    <span
      aria-hidden="true"
      className={styles.glyph}
      style={
        {
          "--sidebar-icon": `url("${getAssetUrl(asset)}")`,
          "--sidebar-glyph-size": `${size}px`
        } as CSSProperties
      }
    />
  );
}

export function Sidebar({
  activeItemId,
  ariaLabel = "Navegação principal",
  className,
  itemHrefs,
  items,
  layout = "collapsed",
  onItemSelect,
  ...props
}: SidebarProps) {
  const resolvedItems: InternalSidebarItem[] = (items ?? defaultItems).map(
    (item) => {
      const href = itemHrefs?.[item.id];
      return href === undefined ? item : { ...item, href };
    }
  );
  const resolvedActiveItemId =
    activeItemId ?? resolvedItems.at(0)?.id ?? "";
  const visibleItems =
    layout === "mobileBar"
      ? resolvedItems.filter((item) => item.id === resolvedActiveItemId)
      : resolvedItems;
  const showLabels = layout !== "collapsed";
  const classes = [styles.root, styles[layout], className]
    .filter(Boolean)
    .join(" ");

  const handleSelect = (
    event: MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
    item: InternalSidebarItem
  ) => {
    onItemSelect?.(item.id);

    if (!item.href) {
      event.preventDefault();
    }
  };

  return (
    <nav
      {...props}
      aria-label={ariaLabel}
      className={classes}
      data-figma-node-id="261:356"
      data-layout={layout}
    >
      <ul className={styles.list}>
        {visibleItems.map((item) => {
          const active = item.id === resolvedActiveItemId;
          const content = (
            <>
              {active ? (
                <span aria-hidden="true" className={styles.indicator} />
              ) : null}
              <span className={styles.itemContent}>
                <span aria-hidden="true" className={styles.icon}>
                  {item.icon ??
                    (item.iconAsset ? (
                      <DefaultIcon
                        asset={item.iconAsset}
                        size={item.iconSize ?? 20}
                      />
                    ) : null)}
                </span>
                {showLabels ? (
                  <span className={styles.itemLabel}>{item.label}</span>
                ) : null}
              </span>
            </>
          );
          const controlProps = {
            "aria-current": active ? ("page" as const) : undefined,
            "aria-label": showLabels ? undefined : item.label,
            className: styles.itemControl,
            onClick: (
              event: MouseEvent<HTMLAnchorElement | HTMLButtonElement>
            ) => handleSelect(event, item)
          };

          return (
            <li
              className={[styles.item, active && styles.active]
                .filter(Boolean)
                .join(" ")}
              data-active={active || undefined}
              key={item.id}
            >
              {item.href ? (
                <a {...controlProps} href={item.href}>
                  {content}
                </a>
              ) : (
                <button {...controlProps} type="button">
                  {content}
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

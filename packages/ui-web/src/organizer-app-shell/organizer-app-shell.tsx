"use client";

import type { HTMLAttributes, ReactNode } from "react";
import { Avatar } from "../avatar/avatar";
import { BrandIcon } from "../brand-icon/brand-icon";
import { BrandLogo } from "../brand-logo/brand-logo";
import {
  PageHeader,
  type PageHeaderProps
} from "../page-header/page-header";
import {
  Sidebar,
  type SidebarItem,
  type SidebarItemHrefMap
} from "../sidebar/sidebar";
import styles from "./organizer-app-shell.module.css";

export type OrganizerAppShellLayout = "responsive" | "desktop" | "mobile";
export type OrganizerAppShellNavigation = "collapsed" | "expanded";

export type OrganizerHeaderNavigationItem = {
  href: string;
  id: string;
  label: string;
};

export type OrganizerAppShellProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> & {
  accountHref?: string;
  accountInitials?: string;
  accountName?: string;
  activeSidebarItemId?: string;
  children?: ReactNode;
  contentAriaLabel?: string;
  contentLabel?: string;
  headerNavigationItems?: OrganizerHeaderNavigationItem[];
  layout?: OrganizerAppShellLayout;
  navigation?: OrganizerAppShellNavigation;
  onSidebarItemSelect?: (itemId: string) => void;
  pageHeaderProps?: Omit<PageHeaderProps, "layout">;
  showContentSlot?: boolean;
  showHeader?: boolean;
  showPageHeader?: boolean;
  sidebarAriaLabel?: string;
  sidebarItemHrefs?: SidebarItemHrefMap;
  sidebarItems?: SidebarItem[];
};

const defaultHeaderNavigationItems: OrganizerHeaderNavigationItem[] = [
  { href: "#discover", id: "discover", label: "Descobrir" },
  { href: "#how-it-works", id: "how-it-works", label: "Como funciona" },
  {
    href: "#for-organizers",
    id: "for-organizers",
    label: "Para organizadores"
  }
];

function Brand({
  mobile
}: {
  mobile?: boolean;
}) {
  return mobile ? (
    <BrandIcon decorative size={32} />
  ) : (
    <BrandLogo decorative width={81.897} />
  );
}

function Account({
  href,
  initials,
  name
}: {
  href: string;
  initials: string;
  name: string;
}) {
  return (
    <a
      aria-label={`Abrir conta de ${name}`}
      className={styles.account}
      href={href}
    >
      <Avatar aria-hidden="true" initials={initials} name={name} size="sm" />
      <span className={styles.accountName}>{name}</span>
    </a>
  );
}

function HeaderNavigation({
  items,
  mobile
}: {
  items: OrganizerHeaderNavigationItem[];
  mobile?: boolean;
}) {
  return (
    <nav
      aria-label={mobile ? "Navegação mobile" : "Navegação institucional"}
      className={mobile ? styles.mobileNavigation : styles.desktopNavigation}
    >
      <ul className={styles.navigationList}>
        {items.map((item) => (
          <li key={item.id}>
            <a className={styles.navigationLink} href={item.href}>
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function OrganizerAppShell({
  accountHref = "#account",
  accountInitials = "SA",
  accountName = "Marina",
  activeSidebarItemId,
  children,
  className,
  contentAriaLabel = "Conteúdo principal",
  contentLabel = "Área de conteúdo",
  headerNavigationItems = defaultHeaderNavigationItems,
  layout = "responsive",
  navigation = "expanded",
  onSidebarItemSelect,
  pageHeaderProps,
  showContentSlot = true,
  showHeader = true,
  showPageHeader = true,
  sidebarAriaLabel = "Área do organizador",
  sidebarItemHrefs,
  sidebarItems,
  ...props
}: OrganizerAppShellProps) {
  const classes = [styles.root, styles[layout], className]
    .filter(Boolean)
    .join(" ");
  const pageHeaderLayout =
    layout === "desktop"
      ? "desktop"
      : layout === "mobile"
        ? "mobile"
        : "responsive";

  return (
    <div
      {...props}
      className={classes}
      data-figma-node-id="251:1067"
      data-layout={layout}
      data-navigation={navigation}
    >
      {showHeader ? (
        <header className={styles.header}>
          <div className={styles.desktopHeader}>
            <Brand />
            <HeaderNavigation items={headerNavigationItems} />
            <Account
              href={accountHref}
              initials={accountInitials}
              name={accountName}
            />
          </div>

          <div className={styles.mobileTopbar}>
            <Brand mobile />
            <Account
              href={accountHref}
              initials={accountInitials}
              name={accountName}
            />
          </div>

          {navigation === "expanded" ? (
            <HeaderNavigation items={headerNavigationItems} mobile />
          ) : null}
        </header>
      ) : null}

      <div className={styles.body}>
        <Sidebar
          activeItemId={activeSidebarItemId}
          ariaLabel={sidebarAriaLabel}
          className={styles.sidebar}
          itemHrefs={sidebarItemHrefs}
          items={sidebarItems}
          layout={navigation}
          onItemSelect={onSidebarItemSelect}
        />

        <main aria-label={contentAriaLabel} className={styles.main}>
          <div className={styles.content}>
            {showPageHeader ? (
              <PageHeader
                {...pageHeaderProps}
                className={[
                  styles.pageHeader,
                  pageHeaderProps?.className
                ]
                  .filter(Boolean)
                  .join(" ")}
                layout={pageHeaderLayout}
              />
            ) : null}

            {showContentSlot ? (
              <section
                aria-label={contentLabel}
                className={styles.contentSlot}
                data-has-content={children ? true : undefined}
              >
                {children ?? (
                  <span className={styles.contentLabel}>{contentLabel}</span>
                )}
              </section>
            ) : null}
          </div>
        </main>
      </div>
    </div>
  );
}

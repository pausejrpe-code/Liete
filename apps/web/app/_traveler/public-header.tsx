"use client";

import { Avatar, BrandLogo } from "@liete/ui-web";
import { withBasePath } from "../../lib/site-path";
import { useAuth } from "../../lib/auth-context";
import styles from "./public-header.module.css";

function getInitials(name?: string | null): string {
  if (!name) return "LT";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function PublicHeader({
  accountHref,
  accountInitials,
  accountName,
  accountFullName,
  authenticated,
  home = false
}: {
  accountHref?: string;
  accountInitials?: string;
  accountName?: string;
  accountFullName?: string;
  authenticated?: boolean;
  home?: boolean;
}) {
  const { isAuthenticated: authState, profile, user } = useAuth();

  const isUserAuthenticated = authenticated !== undefined ? authenticated : authState;
  const fullName = accountFullName || profile?.full_name || user?.email?.split("@")[0] || "Usuário";
  const firstName = accountName || fullName.split(" ")[0];
  const initials = accountInitials || getInitials(fullName);
  const targetHref =
    accountHref ||
    (profile?.role === "organizer" ? "/organizador/" : "/minhas-excursoes/");

  const homeSection = (id: string) => (home ? `#${id}` : withBasePath(`/#${id}`));

  return (
    <header className={styles.siteHeader}>
      <a
        aria-label="Liete — página inicial"
        className={styles.logoLink}
        href={home ? "#inicio" : withBasePath("/")}
      >
        <BrandLogo decorative width={82} />
      </a>

      <nav aria-label="Navegação principal" className={styles.primaryNav}>
        <a href={withBasePath("/excursoes/")}>Descobrir</a>
        <a href={homeSection("destinos")}>Destinos</a>
        <a href={homeSection("organizadores")}>Para organizadores</a>
      </nav>

      <div className={styles.accountActions}>
        {isUserAuthenticated ? (
          <a
            aria-label={`Abrir conta de ${firstName}`}
            className={styles.accountLink}
            href={withBasePath(targetHref)}
          >
            <Avatar initials={initials} name={fullName} size="sm" />
            <span>{firstName}</span>
          </a>
        ) : (
          <>
            <a className={styles.registerLink} href={withBasePath("/cadastro/")}>
              Cadastrar
            </a>
            <a className={styles.loginLink} href={withBasePath("/entrar/")}>
              Entrar
            </a>
          </>
        )}
      </div>
    </header>
  );
}

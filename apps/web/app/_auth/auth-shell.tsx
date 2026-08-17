import type { CSSProperties, ReactNode } from "react";
import { withBasePath } from "../../lib/site-path";
import { PublicHeader } from "../_traveler/public-header";
import styles from "./auth-shell.module.css";

export function AuthShell({
  accountHref,
  accountInitials,
  accountName,
  asideDescription = "Uma conta para acessar sua próxima etapa com clareza e segurança.",
  asideTitle = "Sua jornada começa por aqui",
  authenticatedHeader = false,
  children,
  description,
  eyebrow,
  title,
  wide = false
}: {
  accountHref?: string;
  accountInitials?: string;
  accountName?: string;
  asideDescription?: string;
  asideTitle?: string;
  authenticatedHeader?: boolean;
  children: ReactNode;
  description: string;
  eyebrow: string;
  title: string;
  wide?: boolean;
}) {
  return (
    <div className={styles.page}>
      <a className={styles.skipLink} href="#auth-content">Pular para o conteúdo</a>
      <PublicHeader
        accountFullName={accountName}
        accountHref={accountHref}
        accountInitials={accountInitials}
        accountName={accountName}
        authenticated={authenticatedHeader}
      />
      <main className={`${styles.layout} ${wide ? styles.wide : ""}`} id="auth-content">
        {!wide ? (
          <aside
            className={styles.visual}
            style={{
              "--auth-visual-image": `url("${withBasePath("/home/hero-road.jpeg")}")`
            } as CSSProperties}
          >
            <div>
              <span>Liete</span>
              <h2>{asideTitle}</h2>
              <p>{asideDescription}</p>
            </div>
          </aside>
        ) : null}
        <section className={styles.card}>
          <header className={styles.heading}>
            <span>{eyebrow}</span>
            <h1>{title}</h1>
            <p>{description}</p>
          </header>
          {children}
        </section>
      </main>
      <footer className={styles.footer}>
        <span>© 2026 Liete — Viagens em Grupo</span>
        <span>Ambiente Seguro SSL</span>
      </footer>
    </div>
  );
}

import type { ReactNode } from "react";
import { BrandLogo } from "@liete/ui-web";
import { withBasePath } from "../../lib/site-path";
import { PublicHeader } from "./public-header";
import styles from "./traveler-shell.module.css";

export function TravelerShell({
  authenticated = false,
  children,
  compact = false
}: {
  authenticated?: boolean;
  children: ReactNode;
  compact?: boolean;
}) {
  return (
    <div className={styles.page}>
      <a className={styles.skipLink} href="#traveler-content">
        Pular para o conteúdo
      </a>
      {compact ? (
        <header className={styles.header}>
          <div className={styles.headerInner}>
            <a
              aria-label="Liete — página inicial"
              className={styles.logo}
              href={withBasePath("/")}
            >
              <BrandLogo decorative tone="green" width={82} />
            </a>
            <span className={styles.secureLabel}>Ambiente seguro</span>
          </div>
        </header>
      ) : (
        <PublicHeader authenticated={authenticated} />
      )}

      <main id="traveler-content">{children}</main>

      {!compact ? (
        <footer className={styles.footer}>
          <div>
            <BrandLogo decorative tone="green" width={82} />
            <p>Viagens em grupo com confiança, suporte e muita estrada.</p>
          </div>
          <nav aria-label="Links de suporte">
            <a href={withBasePath("/excursoes/")}>Explorar excursões</a>
            <a href={withBasePath("/minhas-excursoes/")}>Minhas excursões</a>
            <a href="#support">Ajuda e suporte</a>
          </nav>
        </footer>
      ) : null}
    </div>
  );
}

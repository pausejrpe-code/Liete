import type { Metadata } from "next";
import { TravelerShell } from "../_traveler/traveler-shell";
import { withBasePath } from "../../lib/site-path";

export const metadata: Metadata = {
  description: "Política de privacidade e proteção de dados pessoais (LGPD) da plataforma Liete.",
  title: "Política de Privacidade — Liete"
};

export default function PrivacidadePage() {
  return (
    <TravelerShell>
      <main
        style={{
          color: "var(--color-neutral-800, #1f2937)",
          lineHeight: 1.7,
          margin: "0 auto",
          maxWidth: "840px",
          padding: "2.5rem 1.5rem 5rem"
        }}
      >
        <nav aria-label="Navegação estrutural" style={{ color: "var(--color-neutral-500, #6b7280)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
          <a href={withBasePath("/")} style={{ color: "inherit", textDecoration: "none" }}>Início</a>
          <span style={{ margin: "0 0.5rem" }}>/</span>
          <span aria-current="page" style={{ color: "var(--color-neutral-900, #111827)", fontWeight: 600 }}>Privacidade</span>
        </nav>

        <header style={{ borderBottom: "1px solid var(--color-neutral-200, #e5e7eb)", marginBottom: "2.5rem", paddingBottom: "1.5rem" }}>
          <h1 style={{ color: "var(--color-neutral-900, #111827)", fontSize: "2.25rem", fontWeight: 800, marginBottom: "0.5rem" }}>
            Política de Privacidade (LGPD)
          </h1>
          <p style={{ color: "var(--color-neutral-500, #6b7280)", fontSize: "0.95rem" }}>
            Última atualização: 17 de agosto de 2026
          </p>
        </header>

        <section style={{ marginBottom: "2rem" }}>
          <h2 style={{ color: "var(--color-neutral-900, #111827)", fontSize: "1.35rem", fontWeight: 700, marginBottom: "0.75rem" }}>
            1. Compromisso com a Privacidade
          </h2>
          <p>
            A <strong>Liete</strong> respeita sua privacidade e atua em estrita conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 — LGPD). Esta política explica como coletamos, utilizamos e protegemos seus dados pessoais.
          </p>
        </section>

        <section style={{ marginBottom: "2rem" }}>
          <h2 style={{ color: "var(--color-neutral-900, #111827)", fontSize: "1.35rem", fontWeight: 700, marginBottom: "0.75rem" }}>
            2. Dados Coletados
          </h2>
          <p>
            Coletamos dados estritamente necessários para a execução dos serviços de turismo e emissão de vouchers, incluindo: nome completo, e-mail, telefone, CPF/documento de identificação, data de nascimento e contato de emergência dos participantes.
          </p>
        </section>

        <section style={{ marginBottom: "2rem" }}>
          <h2 style={{ color: "var(--color-neutral-900, #111827)", fontSize: "1.35rem", fontWeight: 700, marginBottom: "0.75rem" }}>
            3. Compartilhamento Seguro
          </h2>
          <p>
            Os dados dos passageiros são compartilhados exclusivamente com o organizador responsável pela respectiva excursão para fins de lista de embarque, seguro viagem e controle de acesso. Dados de cartão de crédito são processados diretamente pela Stripe sob certificação PCI-DSS e nunca são armazenados em nossos servidores.
          </p>
        </section>

        <section style={{ marginBottom: "2rem" }}>
          <h2 style={{ color: "var(--color-neutral-900, #111827)", fontSize: "1.35rem", fontWeight: 700, marginBottom: "0.75rem" }}>
            4. Seus Direitos como Titular
          </h2>
          <p>
            Você pode solicitar a qualquer momento a confirmação da existência de tratamento, acesso aos seus dados, correção de dados incompletos ou a exclusão de dados pessoais através do nosso canal de privacidade: <strong>privacidade@liete.com.br</strong>.
          </p>
        </section>
      </main>
    </TravelerShell>
  );
}

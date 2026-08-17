import type { Metadata } from "next";
import { TravelerShell } from "../_traveler/traveler-shell";
import { withBasePath } from "../../lib/site-path";

export const metadata: Metadata = {
  description: "Termos e condições de uso da plataforma Liete para organizadores e viajantes.",
  title: "Termos de Uso — Liete"
};

export default function TermosPage() {
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
          <span aria-current="page" style={{ color: "var(--color-neutral-900, #111827)", fontWeight: 600 }}>Termos de Uso</span>
        </nav>

        <header style={{ borderBottom: "1px solid var(--color-neutral-200, #e5e7eb)", marginBottom: "2.5rem", paddingBottom: "1.5rem" }}>
          <h1 style={{ color: "var(--color-neutral-900, #111827)", fontSize: "2.25rem", fontWeight: 800, marginBottom: "0.5rem" }}>
            Termos de Uso da Plataforma Liete
          </h1>
          <p style={{ color: "var(--color-neutral-500, #6b7280)", fontSize: "0.95rem" }}>
            Última atualização: 17 de agosto de 2026
          </p>
        </header>

        <section style={{ marginBottom: "2rem" }}>
          <h2 style={{ color: "var(--color-neutral-900, #111827)", fontSize: "1.35rem", fontWeight: 700, marginBottom: "0.75rem" }}>
            1. Natureza do Serviço
          </h2>
          <p>
            A <strong>Liete</strong> é uma plataforma tecnológica de intermediação que conecta organizadores independentes de viagens em grupo e excursões a viajantes interessados. A Liete não é uma agência de transporte ou operadora de turismo direta, atuando como facilitadora de reservas, pagamentos e gestão operacional.
          </p>
        </section>

        <section style={{ marginBottom: "2rem" }}>
          <h2 style={{ color: "var(--color-neutral-900, #111827)", fontSize: "1.35rem", fontWeight: 700, marginBottom: "0.75rem" }}>
            2. Cadastro e Responsabilidades do Organizador
          </h2>
          <p>
            Organizadores (Pessoas Físicas ou Jurídicas) declaram que todas as informações cadastradas são verdadeiras e que possuem as autorizações legais necessárias para operar as excursões anunciadas. O organizador é o único responsável pela execução do itinerário, contratação de transportes regulamentados e segurança dos passageiros.
          </p>
        </section>

        <section style={{ marginBottom: "2rem" }}>
          <h2 style={{ color: "var(--color-neutral-900, #111827)", fontSize: "1.35rem", fontWeight: 700, marginBottom: "0.75rem" }}>
            3. Reservas, Pagamentos e Repasses
          </h2>
          <p>
            Os pagamentos dos viajantes são processados de forma segura através da infraestrutura Stripe. Os repasses aos organizadores seguem a política em duas etapas da plataforma: 1º repasse liberado na confirmação do quórum mínimo e saldo final liberado após a realização da viagem.
          </p>
        </section>

        <section style={{ marginBottom: "2rem" }}>
          <h2 style={{ color: "var(--color-neutral-900, #111827)", fontSize: "1.35rem", fontWeight: 700, marginBottom: "0.75rem" }}>
            4. Política de Cancelamento e Reembolsos
          </h2>
          <p>
            Em conformidade com o Código de Defesa do Consumidor brasileiro, compras realizadas online contam com direito de arrependimento de 7 (sete) dias corridos após a compra. Cancelamentos posteriores a esse prazo seguem as condições específicas informadas na página de cada excursão.
          </p>
        </section>

        <section style={{ marginBottom: "2rem" }}>
          <h2 style={{ color: "var(--color-neutral-900, #111827)", fontSize: "1.35rem", fontWeight: 700, marginBottom: "0.75rem" }}>
            5. Atendimento e Suporte
          </h2>
          <p>
            Para esclarecimento de dúvidas sobre estes termos ou intermediação de reservas, nosso suporte está disponível pelo e-mail <strong>suporte@liete.com.br</strong>.
          </p>
        </section>
      </main>
    </TravelerShell>
  );
}

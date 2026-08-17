# Arquitetura Técnica — Liete Platform

Este documento descreve a arquitetura real implementada no repositório, fundamentada nas evidências concretas do código.

---

## 1. Topologia Geral do Monorepo

O repositório é gerenciado como um monorepo via `pnpm` workspaces (`pnpm-workspace.yaml`), com TypeScript configurado em cascata a partir de `tsconfig.base.json`.

```text
                                monorepo root (pnpm workspace)
                                              │
                      ┌───────────────────────┼───────────────────────┐
                      ▼                       ▼                       ▼
              @liete/tokens             @liete/ui-web            @liete/web
           (Style Dictionary)         (React UI Library)       (Next.js App)
                      │                       ▲                       ▲
                      └───────────────────────┴───────────────────────┘
                                 (tokens distribuídos)
```

---

## 2. Pacotes e Responsabilidades

### 2.1 `@liete/tokens` (`packages/tokens`)
- **Propósito**: Fonte única da verdade para tokens de design (cores, tipografia, espaçamentos, raios, elevações).
- **Engine**: Style Dictionary v5.5.0 (`style-dictionary.config.mjs`).
- **Fontes**: `src/tokens.json` estruturado em categorias alinhadas às variáveis do Figma (`FIGMA_VARIABLE_AUDIT.md`).
- **Saídas Distribuídas**:
  - `dist/css/tokens.css` (Variáveis CSS `:root`).
  - `dist/javascript/tokens.js` (Exportações JavaScript/TypeScript).

### 2.2 `@liete/ui-web` (`packages/ui-web`)
- **Propósito**: Biblioteca de componentes React reutilizáveis para a web.
- **Stack**: React 19, TypeScript 5.9, CSS Modules locais, Storybook 10.5, Vitest 4.1.
- **Componentes Catalogados**: 35+ componentes atômicos e compostos (`avatar`, `badge`, `banner-hero`, `brand-icon`, `brand-logo`, `button`, `checkbox`, `data-table`, `empty-state`, `field`, `flow-stepper`, `gallery`, `goal-progress`, `journey-navigation`, `media-uploader`, `metric-card`, `modal-dialog`, `organizer-app-shell`, `page-header`, `pagination`, `partner-hero`, `payout-status-card`, `price-breakdown`, `radio`, `rating`, `search`, `select`, `sidebar`, `skeleton`, `status-chip`, `stepper`, `tabs`, `textarea`, `toast-alert`, `trip-card`, `trip-search-bar`).
- **Documentação e Testes**: Cada componente possui especificação local (`*.spec.md`), arquivo de histórias Storybook (`*.stories.tsx`) e testes unitários (`*.test.tsx`).

### 2.3 `@liete/web` (`apps/web`)
- **Propósito**: Aplicação web principal, englobando o portal do viajante, fluxo de autenticação e plataforma do organizador.
- **Stack**: Next.js 16 (App Router), React 19, TypeScript 5.9, `@supabase/supabase-js` v2.110, `@supabase/ssr` v0.12.
- **Estrutura de Roteamento**:
  - `/` (Home pública do viajante com busca, parceiros e cards de viagem).
  - `/excursoes` (Catálogo público de excursões).
  - `/checkout` (Fluxo de reserva e pagamento).
  - `/minhas-excursoes` & `/minha-conta` (Área do viajante autenticado).
  - `/entrar`, `/cadastro`, `/recuperar-senha`, `/verificar-email` (Fluxos de autenticação em `app/_auth`).
  - `/organizador` (Dashboard principal do organizador: métricas, itens de atenção, faturamento e próximas saídas).
  - `/organizador/excursoes` & `/organizador/excursoes/nova` (Gestão de excursões e wizard de criação de nova excursão).
  - `/organizador/financeiro` (Painel financeiro: métricas de repasse, extrato de vendas, retenções e estornos).
  - `/organizador/perfil` & `/organizador/onboarding` (Gestão cadastral PF/PJ, verificação de documentos e onboarding).

---

## 3. Padrão de Integração e Dados

- **Supabase Client / Server Integration**:
  - `apps/web/lib/supabase/client.ts`: Criação do cliente de browser (`createBrowserClient`).
  - `apps/web/lib/supabase/server.ts`: Criação do cliente de servidor com manipulação assíncrona de cookies (`createServerClient`).
  - `apps/web/lib/supabase/config.ts`: Validação de variáveis públicas (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`).
- **Modelos de Estado e Mocks Realistas**:
  - Contratos de estado armazenados em `dsb-state-header-20260719.json`, `dsb-state-organizer-20260725.json`, `dsb-state-travel.json`.
  - Simulação e helpers tipados em `apps/web/app/organizador/*-dashboard-data.ts`.

---

## 4. Pipeline de CI/CD e Build

- **GitHub Actions**: `.github/workflows/deploy-pages.yml` configurado para compilar tokens (`tokens:build`), compilar a aplicação Next.js estática (`next build` para pasta `out`) e realizar deploy automático no GitHub Pages.

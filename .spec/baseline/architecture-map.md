# Architecture Map — Baseline do Sistema

Este mapa estabelece a arquitetura de módulos, dependências entre pacotes, pipelines de build e distribuição da **Liete Platform**.

---

## 1. Módulos e Pacotes do Monorepo

| Pacote / Diretório | Papel | Tecnologias Principais | Consumidores |
|---|---|---|---|
| `packages/tokens` | Design Tokens | Style Dictionary 5.5, JSON Source | `@liete/ui-web`, `@liete/web` |
| `packages/ui-web` | Component Library | React 19, CSS Modules, Storybook 10.5, Vitest 4.1 | `@liete/web` |
| `apps/web` | Web Application | Next.js 16 (App Router), React 19, Supabase JS/SSR | Usuários finais (Web) |
| `docs/` | Documentação de Negócio | Markdown (PRD oficial) | Engenharia, Produto |
| `.agents/` | Antigravity AI Engine | Rules, Skills, Workflows nativos | Antigravity Agent |
| `.spec/` | SDD Source of Truth | Constitution, Baseline, Specs, Decisions | Todo o ecossistema |
| `.sdd/` | SDD Automation Toolkit | Node.js Scripts, Schemas, Templates | CLI Local / Engenharia |

---

## 2. Grafo de Dependências de Código

```text
               @liete/tokens (src/tokens.json)
                      │
                      ├──────────────────────────┐
                      ▼                          ▼
               dist/css/tokens.css        dist/javascript/tokens.js
                      │                          │
                      ├──────────────────────────┤
                      ▼                          │
               @liete/ui-web                     │
             (35+ Componentes)                   │
                      │                          │
                      └───────────┬──────────────┘
                                  ▼
                             @liete/web
                           (Next.js App)
                                  │
                                  ▼
                         Supabase Backend
                     (SSR & Client Auth/Data)
```

---

## 3. Estrutura de Rotas e Páginas (`apps/web`)

```text
apps/web/app/
├── (public / traveler)
│   ├── page.tsx                           # Landing page com busca e destaques
│   ├── excursoes/page.tsx                 # Catálogo público
│   ├── checkout/page.tsx                  # Checkout de compra de ingresso
│   ├── minhas-excursoes/page.tsx          # Gestão de ingressos do viajante
│   └── minha-conta/page.tsx               # Dados cadastrais do viajante
├── (auth)
│   ├── entrar/page.tsx                    # Login unificado
│   ├── cadastro/page.tsx                  # Cadastro PF / PJ
│   ├── recuperar-senha/page.tsx           # Recuperação de senha
│   └── verificar-email/page.tsx           # Confirmação de e-mail
└── organizador/
    ├── page.tsx                           # Overview dashboard
    ├── excursoes/
    │   ├── page.tsx                       # Listagem de excursões
    │   └── nova/page.tsx                  # Wizard de criação (4 passos)
    ├── financeiro/page.tsx                # Dashboard financeiro e repasses
    ├── perfil/page.tsx                    # Perfil do parceiro e documentos
    └── onboarding/page.tsx                # Onboarding inicial
```

---

## 4. Pipeline de CI/CD (GitHub Pages)

- **Workflow**: `.github/workflows/deploy-pages.yml`
- **Etapas**:
  1. Setup Node.js 22 + pnpm 11.9.
  2. Instalação com `--frozen-lockfile`.
  3. Compilação de tokens (`pnpm --filter @liete/tokens build`).
  4. Compilação e exportação Next.js (`pnpm --filter @liete/web build` → `apps/web/out`).
  5. Deploy no GitHub Pages.

# Tarefas de Implementação — FEAT-003: Prontidão para Produção e Dados Reais

---

### TASK-001: Implementação do Middleware de Autenticação SSR
- **Requisito**: REQ-001
- **Critério de Aceitação**: AC-001, AC-002, AC-003
- **Descrição**: Criar `apps/web/middleware.ts` com sincronização de cookies SSR `@supabase/ssr` e proteção de rotas privadas (`/organizador/*`, `/minhas-excursoes/*`, `/minha-conta/*`).
- **Arquivos Previstos**:
  - `apps/web/middleware.ts`
- **Validação Local**: Teste de navegação e renovação de cookie.
- **Status**: `pending`

---

### TASK-002: Criação do Provedor de Autenticação e Cabeçalhos Dinâmicos
- **Requisito**: REQ-002
- **Critério de Aceitação**: AC-004, AC-005
- **Descrição**: Criar `apps/web/lib/auth-context.tsx`, envolver `apps/web/app/layout.tsx` e integrar `apps/web/app/_traveler/public-header.tsx` e `apps/web/app/_traveler/traveler-shell.tsx` com o usuário autenticado real.
- **Arquivos Previstos**:
  - `apps/web/lib/auth-context.tsx`
  - `apps/web/app/layout.tsx`
  - `apps/web/app/_traveler/public-header.tsx`
  - `apps/web/app/_traveler/traveler-shell.tsx`
- **Validação Local**: Renderização dinâmica com e sem usuário autenticado.
- **Status**: `pending`

---

### TASK-003: Limpeza de Mocks, Valores Demo e Textos de Simulação
- **Requisito**: REQ-003
- **Critério de Aceitação**: AC-006, AC-007, AC-008
- **Descrição**: Limpar inputs de login em `apps/web/app/_auth/auth-experience.tsx`, remover avisos de simulação em `apps/web/app/_auth/auth-shell.tsx`, `apps/web/app/checkout/[slug]/checkout-flow.tsx` e `apps/web/app/organizador/excursoes/nova/new-excursion-journey.tsx`.
- **Arquivos Previstos**:
  - `apps/web/app/_auth/auth-experience.tsx`
  - `apps/web/app/_auth/auth-shell.tsx`
  - `apps/web/app/checkout/[slug]/checkout-flow.tsx`
- **Validação Local**: Verificação visual e de código sem strings de simulação.
- **Status**: `pending`

---

### TASK-004: Conexão da Área do Organizador aos Dados Reais
- **Requisito**: REQ-004, REQ-005
- **Critério de Aceitação**: AC-009, AC-010, AC-011, AC-012, AC-013, AC-014, AC-015
- **Descrição**: Conectar `overview-dashboard.tsx`, `profile-dashboard.tsx`, `excursions-dashboard.tsx`, `financial-dashboard.tsx` e `new-excursion-journey.tsx` às APIs do Supabase, removendo fallbacks estáticos e permitindo criação real de excursões e edição de perfil.
- **Arquivos Previstos**:
  - `apps/web/app/organizador/overview-dashboard.tsx`
  - `apps/web/app/organizador/perfil/profile-dashboard.tsx`
  - `apps/web/app/organizador/perfil/profile-dashboard-data.ts`
  - `apps/web/app/organizador/excursoes/excursions-dashboard.tsx`
  - `apps/web/app/organizador/excursoes/nova/new-excursion-journey.tsx`
  - `apps/web/app/organizador/financeiro/financial-dashboard.tsx`
- **Validação Local**: CRUD de excursão e atualização de perfil no Supabase.
- **Status**: `pending`

---

### TASK-005: Conexão do Catálogo, Home e Detalhes de Excursões ao Supabase
- **Requisito**: REQ-006
- **Critério de Aceitação**: AC-016, AC-017, AC-018
- **Descrição**: Atualizar `apps/web/app/page.tsx`, `apps/web/app/excursoes/page.tsx`, `apps/web/app/excursoes/excursion-catalog.tsx`, `apps/web/app/excursoes/[slug]/page.tsx` e `apps/web/app/excursoes/[slug]/excursion-details.tsx` para carregar excursões reais do banco.
- **Arquivos Previstos**:
  - `apps/web/app/page.tsx`
  - `apps/web/app/excursoes/page.tsx`
  - `apps/web/app/excursoes/excursion-catalog.tsx`
  - `apps/web/app/excursoes/[slug]/page.tsx`
  - `apps/web/app/excursoes/[slug]/excursion-details.tsx`
- **Validação Local**: Renderização dinâmica de excursões a partir do banco.
- **Status**: `pending`

---

### TASK-006: Conexão da Área do Viajante e Checkout ao Supabase
- **Requisito**: REQ-007
- **Critério de Aceitação**: AC-019, AC-020, AC-021
- **Descrição**: Atualizar `apps/web/app/minha-conta/traveler-account.tsx` e `apps/web/app/minhas-excursoes/bookings-dashboard.tsx` para carregar e persistir dados do usuário e compras no Supabase.
- **Arquivos Previstos**:
  - `apps/web/app/minha-conta/traveler-account.tsx`
  - `apps/web/app/minhas-excursoes/bookings-dashboard.tsx`
- **Validação Local**: Atualização de perfil de viajante e visualização de reservas.
- **Status**: `pending`

---

### TASK-007: Script e Execução de População Inicial (Seed) do Banco
- **Requisito**: REQ-008
- **Critério de Aceitação**: AC-022
- **Descrição**: Criar e aplicar script de seed seguro no Supabase com catálogo inicial de excursões completas no Brasil.
- **Arquivos Previstos**:
  - `scripts/seed-production-excursions.ts`
- **Validação Local**: Registros presentes na tabela `public.excursions`.
- **Status**: `pending`

---

### TASK-008: Validação Global, Typecheck e Evidências SDD
- **Requisito**: REQ-001 a REQ-008
- **Critério de Aceitação**: Todos os ACs
- **Descrição**: Executar compilação TypeScript, testes automatizados e gerar `verification.md` com 100% de conformidade.
- **Arquivos Previstos**:
  - `.spec/features/FEAT-003-production-readiness/verification.md`
  - `.spec/features/FEAT-003-production-readiness/status.md`
- **Validação Local**: Build limpo e suíte de testes aprovada.
- **Status**: `pending`

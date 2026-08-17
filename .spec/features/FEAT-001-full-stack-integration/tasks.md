# Tarefas de Implementação — FEAT-001: Full-Stack Integration

---

### TASK-001: Schema SQL e Migrations Supabase
- **Requisito**: REQ-001
- **Critério de Aceitação**: AC-001, AC-002, AC-003
- **Descrição**: Criar arquivo de migração SQL `supabase/migrations/20260816000000_init_sdd_schema.sql` com tabelas `profiles`, `organizers`, `organizer_documents`, `excursions`, `orders`, `order_participants`, `payouts`, triggers de capacidade e políticas de RLS.
- **Arquivos Previstos**:
  - `supabase/migrations/20260816000000_init_sdd_schema.sql`
- **Validação Local**: Sintaxe SQL válida e tipagem TypeScript correspondente.
- **Status**: `completed`

---

### TASK-002: Camada de Serviços de Dados e Repositórios Supabase
- **Requisito**: REQ-001, REQ-002
- **Critério de Aceitação**: AC-001, AC-002
- **Descrição**: Criar utilitários de banco de dados e repositórios tipados em `apps/web/lib/db/` (`profiles.ts`, `organizers.ts`, `excursions.ts`, `orders.ts`, `finance.ts`) com suporte a cliente server/browser e fallback seguro para baseline.
- **Arquivos Previstos**:
  - `apps/web/lib/db/types.ts`
  - `apps/web/lib/db/profiles.ts`
  - `apps/web/lib/db/organizers.ts`
  - `apps/web/lib/db/excursions.ts`
  - `apps/web/lib/db/orders.ts`
  - `apps/web/lib/db/finance.ts`
- **Validação Local**: `tsc --noEmit`
- **Status**: `completed`

---

### TASK-003: Módulo de Integração Stripe e Stripe Connect
- **Requisito**: REQ-003, REQ-006, REQ-007
- **Critério de Aceitação**: AC-008, AC-009, AC-015, AC-016, AC-018, AC-019
- **Descrição**: Criar SDK / Client tipado da Stripe em `apps/web/lib/stripe/` (`config.ts`, `connect.ts`, `checkout.ts`, `webhooks.ts`) com suporte a Connected Accounts e Webhooks.
- **Arquivos Previstos**:
  - `apps/web/lib/stripe/config.ts`
  - `apps/web/lib/stripe/connect.ts`
  - `apps/web/lib/stripe/checkout.ts`
  - `apps/web/lib/stripe/webhooks.ts`
- **Validação Local**: `tsc --noEmit`
- **Status**: `completed`

---

### TASK-004: Rotas de API de Autenticação e Autorização Server-Side
- **Requisito**: REQ-002
- **Critério de Aceitação**: AC-004, AC-005, AC-006
- **Descrição**: Implementar rotas `/api/auth/login`, `/api/auth/register`, `/api/auth/logout`, `/api/auth/me`, `/api/auth/recover` com cookies de sessão e RBAC.
- **Arquivos Previstos**:
  - `apps/web/app/api/auth/login/route.ts`
  - `apps/web/app/api/auth/register/route.ts`
  - `apps/web/app/api/auth/logout/route.ts`
  - `apps/web/app/api/auth/me/route.ts`
  - `apps/web/app/api/auth/recover/route.ts`
- **Validação Local**: Testes de rotas HTTP e typecheck.
- **Status**: `completed`

---

### TASK-005: Conexão das Telas de Autenticação ao Backend Real
- **Requisito**: REQ-002
- **Critério de Aceitação**: AC-004, AC-005, AC-006
- **Descrição**: Conectar `apps/web/app/_auth/auth-experience.tsx` às APIs de autenticação, com persistência real, feedback de erro e redirecionamento correto para organizadores e viajantes.
- **Arquivos Previstos**:
  - `apps/web/app/_auth/auth-experience.tsx`
- **Validação Local**: Typecheck e validação de login/cadastro.
- **Status**: `completed`

---

### TASK-006: APIs e Telas do Perfil e Stripe Connect do Organizador
- **Requisito**: REQ-003
- **Critério de Aceitação**: AC-007, AC-008, AC-009
- **Descrição**: Implementar rotas `/api/organizer/profile`, `/api/organizer/stripe/connect`, `/api/organizer/stripe/status` e conectar a tela `profile-dashboard.tsx` para salvar alterações reais e iniciar onboarding do Stripe Connect.
- **Arquivos Previstos**:
  - `apps/web/app/api/organizer/profile/route.ts`
  - `apps/web/app/api/organizer/stripe/connect/route.ts`
  - `apps/web/app/api/organizer/stripe/status/route.ts`
  - `apps/web/app/organizador/perfil/profile-dashboard.tsx`
- **Validação Local**: Typecheck e persistência de dados.
- **Status**: `completed`

---

### TASK-007: APIs e Telas de Criação e Gestão de Excursões
- **Requisito**: REQ-004
- **Critério de Aceitação**: AC-010, AC-011, AC-012
- **Descrição**: Implementar `/api/organizer/excursions` (GET, POST) e `/api/organizer/excursions/[id]` (GET, PUT, DELETE) com validação de ownership e conectar o wizard `new-excursion-journey.tsx` e a listagem `excursions-dashboard.tsx`.
- **Arquivos Previstos**:
  - `apps/web/app/api/organizer/excursions/route.ts`
  - `apps/web/app/api/organizer/excursions/[id]/route.ts`
  - `apps/web/app/organizador/excursoes/nova/new-excursion-journey.tsx`
  - `apps/web/app/organizador/excursoes/excursions-dashboard.tsx`
- **Validação Local**: Testes de validação de custos/capacidade e typecheck.
- **Status**: `completed`

---

### TASK-008: APIs e Conexão de Dados Reais na Home e Catálogo
- **Requisito**: REQ-005
- **Critério de Aceitação**: AC-013, AC-014
- **Descrição**: Implementar `/api/excursions` e `/api/excursions/[slug]` e conectar `apps/web/app/page.tsx`, `apps/web/app/excursoes/page.tsx` e `apps/web/app/excursoes/[slug]/page.tsx` para carregar registros reais do banco.
- **Arquivos Previstos**:
  - `apps/web/app/api/excursions/route.ts`
  - `apps/web/app/api/excursions/[slug]/route.ts`
  - `apps/web/app/page.tsx`
  - `apps/web/app/excursoes/excursion-catalog.tsx`
  - `apps/web/app/excursoes/[slug]/excursion-details.tsx`
- **Validação Local**: Renderização e typecheck.
- **Status**: `completed`

---

### TASK-009: Checkout Real e Webhooks da Stripe
- **Requisito**: REQ-006, REQ-007
- **Critério de Aceitação**: AC-015, AC-016, AC-017, AC-018, AC-019, AC-020
- **Descrição**: Implementar rota `/api/checkout/create-session`, webhook `/api/webhooks/stripe`, e conectar o fluxo `checkout-flow.tsx` e tela de sucesso `checkout-success.tsx` aos pedidos reais.
- **Arquivos Previstos**:
  - `apps/web/app/api/checkout/create-session/route.ts`
  - `apps/web/app/api/webhooks/stripe/route.ts`
  - `apps/web/app/checkout/[slug]/checkout-flow.tsx`
  - `apps/web/app/checkout/[slug]/sucesso/checkout-success.tsx`
- **Validação Local**: Simulação de checkout, validação de webhook e typecheck.
- **Status**: `completed`

---

### TASK-010: Área do Comprador e Dashboards do Organizador com Dados Reais
- **Requisito**: REQ-008, REQ-009
- **Critério de Aceitação**: AC-021, AC-022, AC-023, AC-024
- **Descrição**: Implementar APIs `/api/traveler/bookings`, `/api/traveler/profile`, `/api/organizer/financial` e conectar as telas de reservas do viajante (`bookings-dashboard.tsx`), conta (`traveler-account.tsx`), listagem de excursões (`excursions-dashboard.tsx`) e financeiro (`financial-dashboard.tsx`).
- **Arquivos Previstos**:
  - `apps/web/app/api/traveler/bookings/route.ts`
  - `apps/web/app/api/traveler/profile/route.ts`
  - `apps/web/app/api/organizer/financial/route.ts`
  - `apps/web/app/minhas-excursoes/bookings-dashboard.tsx`
  - `apps/web/app/minha-conta/traveler-account.tsx`
  - `apps/web/app/organizador/financeiro/financial-dashboard.tsx`
- **Validação Local**: Typecheck, testes unitários e validação cruzada.
- **Status**: `completed`

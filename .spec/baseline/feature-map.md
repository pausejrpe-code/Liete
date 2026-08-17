# Feature Map — Baseline de Funcionalidades

Mapeamento exaustivo de todas as funcionalidades identificadas no repositório **Liete Platform**, catalogadas como **Legacy Baseline** (existentes previamente à implantação do SDD).

---

## 1. Módulo: Autenticação & Acesso (AUTH)

### FEAT-LEG-001: Login Unificado
- **Responsabilidade**: Autenticação de credenciais com seleção de personas (Viajante / Organizador).
- **Arquivos Principais**: `apps/web/app/entrar/page.tsx`, `apps/web/app/_auth/auth-experience.tsx`, `apps/web/app/_auth/auth-shell.tsx`.
- **Dependências**: `@supabase/supabase-js`, `@liete/ui-web` (Button, Field).
- **Dados Envolvidos**: E-mail, senha, persona.
- **Testes Existentes**: Validação de build / SSR.

### FEAT-LEG-002: Cadastro de Organizador Pessoa Física (PF)
- **Responsabilidade**: Criação de conta para organizadores autônomos com validação estrita de CPF brasileiro.
- **Arquivos Principais**: `apps/web/app/cadastro/page.tsx`, `apps/web/app/_auth/brazilian-document.ts`.
- **Dependências**: `brazilian-document.ts`, `@supabase/supabase-js`.
- **Dados Envolvidos**: Nome completo, CPF, e-mail, telefone, senha.
- **Testes Existentes**: `apps/web/app/_auth/brazilian-document.test.cjs`.

### FEAT-LEG-003: Cadastro de Organizador Pessoa Jurídica (PJ)
- **Responsabilidade**: Criação de conta para agências/empresas com validação de CNPJ e dados de responsável.
- **Arquivos Principais**: `apps/web/app/cadastro/page.tsx`, `apps/web/app/_auth/brazilian-document.ts`.
- **Dependências**: `brazilian-document.ts`, `@supabase/supabase-js`.
- **Dados Envolvidos**: Razão social, nome fantasia, CNPJ, nome do responsável, e-mail, senha.
- **Testes Existentes**: `apps/web/app/_auth/brazilian-document.test.cjs`.

### FEAT-LEG-004: Recuperação de Senha & Validação de E-mail
- **Responsabilidade**: Fluxo de redefinição de credenciais e confirmação de e-mail por token.
- **Arquivos Principais**: `apps/web/app/recuperar-senha/page.tsx`, `apps/web/app/verificar-email/page.tsx`.
- **Dependências**: Supabase Auth.
- **Dados Envolvidos**: E-mail, tokens de verificação.
- **Testes Existentes**: Validação de SSR.

---

## 2. Módulo: Plataforma do Organizador — Excursões (ORG-EXC)

### FEAT-LEG-005: Painel Geral do Organizador (Overview Dashboard)
- **Responsabilidade**: Visualização de métricas consolidadas (ocupação, receita, itens de atenção, próximas viagens).
- **Arquivos Principais**: `apps/web/app/organizador/page.tsx`, `apps/web/app/organizador/overview-dashboard.tsx`, `overview-dashboard-data.ts`.
- **Dependências**: `@liete/ui-web` (MetricCard, DataTable, StatusChip, Button).
- **Dados Envolvidos**: `overviewMetrics`, `overviewAttentionItems`, `overviewUpcomingExcursions`.
- **Testes Existentes**: `apps/web/app/organizador/overview-dashboard.spec.md`.

### FEAT-LEG-006: Gestão e Listagem de Excursões
- **Responsabilidade**: Tabela gerencial de saídas com filtros por status (`confirmed`, `available`, `soldOut`, `draft`, `cancelled`).
- **Arquivos Principais**: `apps/web/app/organizador/excursoes/page.tsx`, `excursions-dashboard-data.ts`.
- **Dependências**: `@liete/ui-web` (DataTable, GoalProgress, StatusChip, Pagination).
- **Dados Envolvidos**: `excursions` array com capacidade, vagas vendidas, quórum mínimo e receita.
- **Testes Existentes**: `apps/web/app/organizador/excursoes/excursions-dashboard.spec.md`.

### FEAT-LEG-007: Wizard de Nova Excursão — Passo 1: Informações e Roteiro
- **Responsabilidade**: Coleta de título, destino, resumo, itinerário e fotos.
- **Arquivos Principais**: `apps/web/app/organizador/excursoes/nova/page.tsx`, `excursion-draft.ts`.
- **Dependências**: `@liete/ui-web` (FlowStepper, MediaUploader, Field, Textarea).
- **Dados Envolvidos**: `title`, `destination`, `summary`, `photos`.
- **Testes Existentes**: `excursion-draft.test.cjs`.

### FEAT-LEG-008: Wizard de Nova Excursão — Passo 2: Saídas e Capacidade
- **Responsabilidade**: Definição de datas de embarque/retorno, capacidade total e mínimo de passageiros.
- **Arquivos Principais**: `apps/web/app/organizador/excursoes/nova/page.tsx`, `excursion-draft.ts`.
- **Dependências**: `@liete/ui-web` (Field, Select).
- **Dados Envolvidos**: `departureDate`, `returnDate`, `capacity`, `minimumGroup`.
- **Testes Existentes**: `excursion-draft.test.cjs`.

### FEAT-LEG-009: Wizard de Nova Excursão — Passo 3: Precificação e Custos
- **Responsabilidade**: Cálculo automático do preço por ingresso baseado em custos fixos, custos variáveis e margem.
- **Arquivos Principais**: `apps/web/app/organizador/excursoes/nova/page.tsx`, `excursion-draft.ts`.
- **Dependências**: `@liete/ui-web` (PriceBreakdown, Field).
- **Dados Envolvidos**: `transportCost`, `guideCost`, `extraCost`, `variableCostPerPerson`, `desiredMargin`, `calculatedPrice`.
- **Testes Existentes**: `excursion-draft.test.cjs`.

### FEAT-LEG-010: Wizard de Nova Excursão — Passo 4: Revisão e Publicação
- **Responsabilidade**: Sumário de conferência e envio da excursão para publicação.
- **Arquivos Principais**: `apps/web/app/organizador/excursoes/nova/page.tsx`.
- **Dependências**: `@liete/ui-web` (ModalDialog, ToastAlert, Button).
- **Dados Envolvidos**: Estado completo consolidado do rascunho.
- **Testes Existentes**: `excursion-draft.test.cjs`.

---

## 3. Módulo: Plataforma do Organizador — Financeiro (ORG-FIN)

### FEAT-LEG-011: Painel Financeiro e Indicadores
- **Responsabilidade**: Indicadores de receita bruta acumulada, repasses efetuados e saldo a receber.
- **Arquivos Principais**: `apps/web/app/organizador/financeiro/page.tsx`, `financial-dashboard-data.ts`.
- **Dependências**: `@liete/ui-web` (MetricCard, DataTable).
- **Dados Envolvidos**: `financialMetrics`, `flowByPeriod`.
- **Testes Existentes**: `financial-dashboard.spec.md`.

### FEAT-LEG-012: Repasse em Duas Etapas & Retenção de Garantia
- **Responsabilidade**: Exibição detalhada do 1º repasse (liberado na confirmação) e 2º repasse (retido até pós-viagem).
- **Arquivos Principais**: `apps/web/app/organizador/financeiro/page.tsx`, `financial-dashboard-data.ts`.
- **Dependências**: `@liete/ui-web` (PayoutStatusCard, Badge).
- **Dados Envolvidos**: `nextPayout`, `payoutSchedule`.
- **Testes Existentes**: `payout-status-card.test.tsx`.

### FEAT-LEG-013: Conciliação de Estornos e Reembolsos
- **Responsabilidade**: Rastreamento de cancelamentos e solicitações de estorno pendentes.
- **Arquivos Principais**: `apps/web/app/organizador/financeiro/page.tsx`.
- **Dependências**: `@liete/ui-web` (StatusChip, DataTable).
- **Dados Envolvidos**: `refundRequests`.
- **Testes Existentes**: `financial-dashboard.spec.md`.

---

## 4. Módulo: Plataforma do Organizador — Perfil & Onboarding (ORG-PROF)

### FEAT-LEG-014: Perfil do Parceiro & Dados Cadastrais
- **Responsabilidade**: Edição de dados de contato, redes sociais e biografia do organizador.
- **Arquivos Principais**: `apps/web/app/organizador/perfil/page.tsx`.
- **Dependências**: `@liete/ui-web` (Field, Textarea, Avatar).
- **Dados Envolvidos**: `organizerProfile`.
- **Testes Existentes**: `profile-dashboard.spec.md`.

### FEAT-LEG-015: Envio e Verificação de Documentos
- **Responsabilidade**: Upload de comprovante de residência e documento de identidade/contrato social para aprovação.
- **Arquivos Principais**: `apps/web/app/organizador/perfil/page.tsx`.
- **Dependências**: `@liete/ui-web` (MediaUploader, StatusChip).
- **Dados Envolvidos**: `verificationDocuments`.
- **Testes Existentes**: `profile-dashboard.spec.md`.

### FEAT-LEG-016: Onboarding do Organizador
- **Responsabilidade**: Guia passo a passo para o organizador novato publicar sua primeira viagem.
- **Arquivos Principais**: `apps/web/app/organizador/onboarding/page.tsx`.
- **Dependências**: `@liete/ui-web` (FlowStepper, Button).
- **Dados Envolvidos**: `onboardingStep`.
- **Testes Existentes**: SSR build validation.

---

## 5. Módulo: Portal do Viajante (TRAVELER)

### FEAT-LEG-017: Home Pública e Busca de Destinos
- **Responsabilidade**: Apresentação da marca, barra de pesquisa de viagens e banners de destaque.
- **Arquivos Principais**: `apps/web/app/page.tsx`, `apps/web/app/home-search.tsx`, `home-actions.tsx`.
- **Dependências**: `@liete/ui-web` (BannerHero, PartnerHero, TripSearchBar, TripCard).
- **Dados Envolvidos**: Parâmetros de pesquisa (origem, destino, data).
- **Testes Existentes**: `traveler-journey.spec.md`.

### FEAT-LEG-018: Catálogo de Excursões e Filtros
- **Responsabilidade**: Listagem pública de saídas disponíveis com filtros por região e faixa de preço.
- **Arquivos Principais**: `apps/web/app/excursoes/page.tsx`.
- **Dependências**: `@liete/ui-web` (TripCard, Pagination, Search).
- **Dados Envolvidos**: Lista de viagens públicas.
- **Testes Existentes**: `traveler-journey.spec.md`.

### FEAT-LEG-019: Checkout e Reserva de Vagas
- **Responsabilidade**: Fluxo de compra de ingressos com resumo de custos e dados de pagamento.
- **Arquivos Principais**: `apps/web/app/checkout/page.tsx`.
- **Dependências**: `@liete/ui-web` (PriceBreakdown, Field, Button).
- **Dados Envolvidos**: `checkoutSession`, passageiros, total monetário.
- **Testes Existentes**: `traveler-journey.spec.md`.

### FEAT-LEG-020: Painel "Minhas Excursões" do Viajante
- **Responsabilidade**: Acesso aos vouchers, detalhes de embarque e status de confirmação das viagens compradas.
- **Arquivos Principais**: `apps/web/app/minhas-excursoes/page.tsx`.
- **Dependências**: `@liete/ui-web` (StatusChip, Button).
- **Dados Envolvidos**: `bookedTrips`.
- **Testes Existentes**: `traveler-journey.spec.md`.

### FEAT-LEG-021: Minha Conta do Viajante
- **Responsabilidade**: Gestão de dados cadastrais e preferências de notificação do passageiro.
- **Arquivos Principais**: `apps/web/app/minha-conta/page.tsx`.
- **Dependências**: `@liete/ui-web` (Field, Button).
- **Dados Envolvidos**: `userProfile`.
- **Testes Existentes**: `traveler-journey.spec.md`.

---

## 6. Módulo: Design System & Tokens (DS)

### FEAT-LEG-022: Design Tokens Style Dictionary
- **Responsabilidade**: Compilação e distribuição de tokens canônicos de cores, tipografia e espaçamento.
- **Arquivos Principais**: `packages/tokens/src/tokens.json`, `packages/tokens/style-dictionary.config.mjs`.
- **Dependências**: `style-dictionary`.
- **Dados Envolvidos**: Variáveis e tokens de design.
- **Testes Existentes**: `packages/tokens/README.md`.

### FEAT-LEG-023: Biblioteca de Componentes UI Web React
- **Responsabilidade**: Fornecer componentes acessíveis e estilizados com CSS Modules para toda a plataforma.
- **Arquivos Principais**: `packages/ui-web/src/*`.
- **Dependências**: `@liete/tokens`.
- **Dados Envolvidos**: 35+ componentes React.
- **Testes Existentes**: 40+ suítes de teste de componentes em `packages/ui-web/src/**/*.test.tsx`.

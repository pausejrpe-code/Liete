# Requisitos da Especificação — FEAT-001: Full-Stack Integration

Esta especificação governa a transformação do produto existente (mockup/protótipo) em uma aplicação web full-stack funcional conectada a banco de dados (Supabase), autenticação real, Stripe Checkout e Stripe Connect.

---

## Perguntas Abertas / Decisões de Negócio Pendentes

> **PENDÊNCIA DE NEGÓCIO [DEC-PEND-001]**: Taxa de comissão da plataforma sobre o valor da excursão (Application Fee do Stripe Connect).
> - **Situação Atual**: Não há percentual fixo definido no PRD ou no código existente.
> - **Diretriz de Implementação**: O sistema utilizará um valor configurável por variável de ambiente `PLATFORM_FEE_PERCENT` (default: 0%), permitindo que a plataforma opere inicialmente sem comissão ou defina a taxa futuramente sem refatoração de código.

> **PENDÊNCIA DE NEGÓCIO [DEC-PEND-002]**: Política de cancelamento automática e prazos de reembolso.
> - **Situação Atual**: O PRD estabelece que solicitações de estorno são submetidas para análise manual do organizador e conciliação financeira.
> - **Diretriz de Implementação**: O sistema implementará o fluxo de registro e conciliação de estornos sem disparar reembolsos bancários automáticos irreversíveis sem confirmação do organizador ou operador.

---

## Lista de Requisitos

### REQ-001: Modelagem e Persistência em Banco de Dados Relacional
- **Descrição**: Criação de tabelas, tipos enumerados, índices, triggers e políticas RLS no PostgreSQL/Supabase para `profiles`, `organizers`, `organizer_documents`, `excursions`, `orders`, `order_participants` e `payouts`.
- **Motivação**: Eliminar dados hardcoded e fornecer persistência transacional com segurança a nível de linha.
- **Prioridade**: Crítica
- **Dependências**: Nenhuma
- **Acceptance Criteria**: AC-001, AC-002, AC-003

### REQ-002: Autenticação Real e Controle de Acesso Baseado em Papéis (RBAC)
- **Descrição**: Substituição dos mocks em `apps/web/app/_auth` por integração real com Supabase Auth (`signUp`, `signInWithPassword`, `signOut`, `resetPasswordForEmail`, cookies SSR), diferenciando os papéis `traveler` e `organizer`.
- **Motivação**: Garantir que apenas usuários autenticados e autorizados acessem rotas restritas e gerenciem seus próprios recursos.
- **Prioridade**: Crítica
- **Dependências**: REQ-001
- **Acceptance Criteria**: AC-004, AC-005, AC-006

### REQ-003: Perfil e Onboarding do Organizador via Stripe Connect
- **Descrição**: Persistência do cadastro de organizadores (PF/PJ) com documentos e integração ao Stripe Connect para criação de Connected Accounts, geração de links de onboarding e sincronização de status de recebimento (`charges_enabled`, `payouts_enabled`).
- **Motivação**: Habilitar organizadores a receber repasses financeiros de forma auditável e em conformidade regulatória.
- **Prioridade**: Alta
- **Dependências**: REQ-001, REQ-002
- **Acceptance Criteria**: AC-007, AC-008, AC-009

### REQ-004: CRUD e Publicação Real de Excursões pelo Organizador
- **Descrição**: Conexão do wizard de criação de excursões (`/organizador/excursoes/nova`) e da listagem de excursões (`/organizador/excursoes`) ao banco de dados com validação server-side de preços, datas, capacidade e autorização de ownership.
- **Motivação**: Permitir que organizadores publiquem viagens reais com preços calculados matematicamente no servidor.
- **Prioridade**: Crítica
- **Dependências**: REQ-001, REQ-003
- **Acceptance Criteria**: AC-010, AC-011, AC-012

### REQ-005: Alimentação de Dados Reais na Home e Catálogo de Excursões
- **Descrição**: Consulta ao banco de dados para renderizar excursões publicadas, destinos populares e organizadores na Home (`/`) e no catálogo de busca (`/excursoes`), mantendo fallback gracioso para demonstração caso o banco esteja vazio.
- **Motivação**: Exibir informações atualizadas de disponibilidade, preços e vagas para os viajantes.
- **Prioridade**: Alta
- **Dependências**: REQ-004
- **Acceptance Criteria**: AC-013, AC-014

### REQ-006: Checkout Real Integrado com Stripe e Validação Server-Side
- **Descrição**: Criação de sessões de checkout no Stripe a partir do backend, calculando o valor real diretamente do banco (sem confiar no frontend), vinculando o comprador e os participantes.
- **Motivação**: Impedir manipulação de preços pelo cliente e garantir processamento seguro de pagamentos.
- **Prioridade**: Crítica
- **Dependências**: REQ-001, REQ-004, REQ-005
- **Acceptance Criteria**: AC-015, AC-016, AC-017

### REQ-007: Webhooks Seguros da Stripe e Confirmação de Pedidos/Reservas
- **Descrição**: Endpoint de webhook (`/api/webhooks/stripe`) com verificação de assinatura para processar eventos `checkout.session.completed` e `payment_intent.succeeded`, confirmando a reserva, decrementando vagas e gerando o voucher do viajante.
- **Motivação**: Garantir confirmação idempotente e confiável de pagamentos sem depender de redirecionamento no browser.
- **Prioridade**: Crítica
- **Dependências**: REQ-006
- **Acceptance Criteria**: AC-018, AC-019, AC-020

### REQ-008: Área Logada do Viajante (Minhas Excursões e Minha Conta)
- **Descrição**: Visualização e consulta de pedidos reais, vouchers e dados pessoais do viajante autenticado, protegidos por RLS.
- **Motivação**: Entregar ao comprador acesso aos seus vouchers e detalhes de embarque.
- **Prioridade**: Média
- **Dependências**: REQ-002, REQ-007
- **Acceptance Criteria**: AC-021, AC-022

### REQ-009: Dashboard e Gestão Financeira do Organizador com Dados Reais
- **Descrição**: Cálculo dinâmico das métricas de faturamento bruto, vagas vendidas, taxa de ocupação, repasses liberados e saldo retido a partir dos pedidos reais vinculados ao organizador autenticado.
- **Motivação**: Fornecer ao organizador visibilidade precisa sobre suas finanças e operações.
- **Prioridade**: Alta
- **Dependências**: REQ-004, REQ-007
- **Acceptance Criteria**: AC-023, AC-024

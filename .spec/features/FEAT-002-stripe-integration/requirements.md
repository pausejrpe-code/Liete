# Especificação de Requisitos — FEAT-002: Stripe Integration & Live Payments

- **Feature**: FEAT-002 (Stripe Integration & Live Payments)
- **Status**: `PROPOSED`
- **Data**: 2026-08-17
- **Autor**: Antigravity SDD Spec-Writer

---

## 1. Contexto e Objetivo
Habilitar o ecossistema de pagamentos reais/teste da Stripe na plataforma Liete Turismo, conectando o fluxo de checkout dos viajantes e o onboarding de repasses dos organizadores através do **Stripe Connect Express** e **Stripe Checkout**, com confirmação de pedidos via **Webhooks assinados**.

---

## 2. Requisitos Funcionais

### REQ-001: Configuração de Credenciais da Stripe
- O sistema deve ler as chaves de API da Stripe (`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY` e `STRIPE_WEBHOOK_SECRET`) configuradas no arquivo `apps/web/.env.local`.
- Deve haver fallback seguro caso as chaves não estejam configuradas, sem quebrar o ambiente de desenvolvimento.

### REQ-002: Stripe Connect Express para Organizadores
- O sistema deve permitir que um organizador cadastrado inicie o onboarding do Stripe Connect no Brasil (`country: BR`, `currency: BRL`).
- Ao clicar em "Conectar conta Stripe" no perfil do parceiro (`/organizador/perfil/`), deve ser gerado um `account_link` de onboarding Express.
- O status da conta conectada (`charges_enabled`, `payouts_enabled`, `details_submitted`) deve ser sincronizado com a tabela `public.organizers`.

### REQ-003: Sessões de Checkout Server-Side (Stripe Checkout)
- O checkout da excursão deve criar uma sessão no Stripe Checkout (`/api/checkout/create-session`).
- O valor unitário e total deve ser calculado **exclusivamente no servidor** com base no banco de dados.
- O split de pagamento ou transferência direta para a conta Stripe do organizador deve ser aplicado quando o organizador possuir conta conectada ativa.
- Retenção da taxa da plataforma (`PLATFORM_FEE_PERCENT`) configurada no ambiente.

### REQ-004: Processamento de Webhooks e Idempotência
- O endpoint `/api/webhooks/stripe` deve validar criptograficamente o header `stripe-signature` com HMAC SHA-256 e tolerância de tempo.
- O evento `checkout.session.completed` deve atualizar o pedido para `payment_status = 'paid'`, confirmar o voucher e disparar o trigger de atualização de vagas na tabela `public.excursions`.
- O processamento de webhooks deve ser estritamente idempotente.

### REQ-005: Suíte de Testes e Simulação Local
- Disponibilização de roteiro de testes com cartões de teste da Stripe e escuta de webhooks via Stripe CLI.

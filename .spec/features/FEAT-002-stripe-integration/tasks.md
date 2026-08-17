# Tarefas de Implementação — FEAT-002: Stripe Integration & Live Payments

---

### TASK-001: Obtenção e Configuração das Chaves de API de Teste
- **Requisito**: REQ-001
- **Critério de Aceitação**: AC-001
- **Descrição**: Configurar as chaves `pk_test_...` e `sk_test_...` da conta Stripe (`acct_1U4nv0RmGQskRzZD`) no arquivo `apps/web/.env.local`.
- **Status**: `completed`

---

### TASK-002: Habilitação e Configuração do Stripe Connect Express
- **Requisito**: REQ-002
- **Critério de Aceitação**: AC-002, AC-003
- **Descrição**: Validar o fluxo de criação de conta Express e retorno de link de onboarding no endpoint `/api/organizer/stripe/connect`.
- **Status**: `completed`

---

### TASK-003: Validação do Fluxo de Checkout em BRL com Redirecionamento
- **Requisito**: REQ-003
- **Critério de Aceitação**: AC-004, AC-005
- **Descrição**: Testar a geração de sessões no Stripe Checkout oficial a partir de excursões reais cadastradas no Supabase.
- **Status**: `completed`

---

### TASK-004: Configuração e Escuta de Webhooks Locais com Stripe CLI
- **Requisito**: REQ-004
- **Critério de Aceitação**: AC-006, AC-008
- **Descrição**: Configurar o encaminhamento de webhooks locais (`stripe listen`) e validar o segredo `whsec_...` para confirmação automática de pagamentos no Supabase.
- **Status**: `completed`

---

### TASK-005: Teste Ponta a Ponta de Pagamento com Cartão de Teste
- **Requisito**: REQ-005
- **Critério de Aceitação**: AC-006, AC-007
- **Descrição**: Executar compra completa com cartão `4242...`, validar baixa de estoque no Supabase e geração do voucher.
- **Status**: `completed`

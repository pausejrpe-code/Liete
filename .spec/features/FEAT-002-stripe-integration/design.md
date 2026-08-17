# Design Técnico e Arquitetural — FEAT-002: Stripe Integration & Live Payments

---

## 1. Arquitetura da Integração

```mermaid
sequenceDiagram
    autonumber
    actor Viajante
    participant WebApp as Next.js Web App
    participant API as Route Handlers (/api)
    participant DB as Supabase PostgreSQL
    participant Stripe as Stripe API / Checkout
    participant Webhook as Webhook Listener (/api/webhooks/stripe)

    Viajante->>WebApp: Clica em "Confirmar compra" no Checkout
    WebApp->>API: POST /api/checkout/create-session (slug, passageiros)
    API->>DB: Busca preço unitário e dados do organizador
    API->>DB: Cria registro de pedido preliminar (status: 'pending')
    API->>Stripe: POST /v1/checkout/sessions (line_items, metadata, transfer_data)
    Stripe-->>API: Retorna { id: 'cs_...', url: 'https://checkout.stripe.com/...' }
    API-->>WebApp: Retorna URL de checkout
    WebApp->>Stripe: Redireciona navegador para o Stripe Checkout
    Viajante->>Stripe: Insere dados do cartão e confirma pagamento
    Stripe->>Webhook: Dispara webhook POST /api/webhooks/stripe (checkout.session.completed)
    Webhook->>Webhook: Valida assinatura HMAC SHA-256
    Webhook->>DB: Atualiza pedido para 'paid' e dispara trigger de assentos
    Stripe-->>WebApp: Redireciona viajante para /checkout/[slug]/sucesso/?session_id=...
    WebApp->>Viajante: Exibe confirmação com voucher oficial
```

---

## 2. Configurações e Variáveis de Ambiente

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
PLATFORM_FEE_PERCENT="0"
```

---

## 3. Estrutura de Split e Transferências
- **Modelo de Cobrança**: Cobrança direta com transferência de destino (`payment_intent_data.transfer_data.destination = organizer_stripe_account_id`).
- **Comissão da Plataforma**: Retida via `application_fee_amount = total * (PLATFORM_FEE_PERCENT / 100)`.
- **Prevenção de Falhas**: Se o organizador ainda não tiver conta Stripe conectada, a plataforma retém o valor integral e agenda o repasse no painel financeiro para processamento posterior.

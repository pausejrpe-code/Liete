# Design Técnico — FEAT-001: Full-Stack Integration

## 1. Arquitetura da Solução

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                           Next.js App Router (Client & Server)              │
│                                                                             │
│  [Páginas Públicas & Catálogo]     [Fluxos de Autenticação]   [Organizador] │
│  - / & /excursoes/[slug]           - /entrar, /cadastro       - /organizador│
│  - /checkout/[slug]                - /recuperar-senha         - /financeiro │
└───────────────────────┬──────────────────────┬──────────────────────┬───────┘
                        │                      │                      │
                        ▼                      ▼                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                       Next.js Server API Routes (/api/*)                    │
│                                                                             │
│  /api/auth/*          /api/excursions/*       /api/organizer/*              │
│  /api/checkout/*      /api/traveler/*         /api/webhooks/stripe          │
└───────────────────────┬──────────────────────────────────────┬──────────────┘
                        │                                      │
           ┌────────────┴────────────┐            ┌────────────┴────────────┐
           ▼                         ▼            ▼                         ▼
┌──────────────────────┐  ┌────────────────────┐┌───────────────────────────┐
│ Supabase Server / RLS│  │ Supabase Auth (SSR)││ Stripe Connect & Checkout │
│ PostgreSQL Tables:   │  │ Cookie Session     ││ - Direct / Destination Pay│
│ - profiles           │  │ JWT Tokens         ││ - Connected Accounts      │
│ - organizers         │  │ Role Claims        ││ - Webhook Event Verifier  │
│ - excursions         │  └────────────────────┘└───────────────────────────┘
│ - orders & payouts   │
└──────────────────────┘
```

---

## 2. Modelo Relacional e Schemas SQL

### 2.1 Tabela `profiles`
- `id`: UUID (Primary Key, references `auth.users.id` on delete cascade)
- `email`: TEXT NOT NULL
- `full_name`: TEXT
- `role`: TEXT NOT NULL CHECK (role IN ('traveler', 'organizer', 'admin')) DEFAULT 'traveler'
- `phone`: TEXT
- `document`: TEXT
- `birth_date`: TEXT
- `city`: TEXT
- `state`: TEXT
- `avatar_url`: TEXT
- `created_at`: TIMESTAMPTZ DEFAULT now()
- `updated_at`: TIMESTAMPTZ DEFAULT now()

### 2.2 Tabela `organizers`
- `id`: UUID (Primary Key, references `profiles.id` on delete cascade)
- `business_name`: TEXT NOT NULL
- `trade_name`: TEXT
- `legal_type`: TEXT NOT NULL CHECK (legal_type IN ('pf', 'pj')) DEFAULT 'pf'
- `document_number`: TEXT NOT NULL
- `phone`: TEXT
- `email`: TEXT
- `bio`: TEXT
- `instagram`: TEXT
- `website`: TEXT
- `address`: JSONB
- `verification_status`: TEXT CHECK (verification_status IN ('pending', 'in_review', 'verified', 'rejected')) DEFAULT 'pending'
- `stripe_account_id`: TEXT
- `stripe_charges_enabled`: BOOLEAN DEFAULT false
- `stripe_payouts_enabled`: BOOLEAN DEFAULT false
- `stripe_onboarding_completed`: BOOLEAN DEFAULT false
- `bank_account`: JSONB
- `created_at`: TIMESTAMPTZ DEFAULT now()
- `updated_at`: TIMESTAMPTZ DEFAULT now()

### 2.3 Tabela `organizer_documents`
- `id`: UUID PRIMARY KEY DEFAULT gen_random_uuid()
- `organizer_id`: UUID NOT NULL REFERENCES `organizers.id` ON DELETE CASCADE
- `document_type`: TEXT NOT NULL
- `file_url`: TEXT NOT NULL
- `status`: TEXT CHECK (status IN ('pending', 'in_review', 'approved', 'rejected')) DEFAULT 'in_review'
- `created_at`: TIMESTAMPTZ DEFAULT now()
- `updated_at`: TIMESTAMPTZ DEFAULT now()

### 2.4 Tabela `excursions`
- `id`: UUID PRIMARY KEY DEFAULT gen_random_uuid()
- `organizer_id`: UUID NOT NULL REFERENCES `organizers.id` ON DELETE CASCADE
- `slug`: TEXT UNIQUE NOT NULL
- `title`: TEXT NOT NULL
- `summary`: TEXT
- `description`: TEXT
- `category`: TEXT NOT NULL DEFAULT 'natureza'
- `departure_city`: TEXT NOT NULL
- `destination`: TEXT NOT NULL
- `destination_region`: TEXT
- `date`: TEXT NOT NULL
- `date_iso`: TEXT NOT NULL
- `return_date`: TEXT
- `duration_type`: TEXT DEFAULT 'bate-volta'
- `duration_label`: TEXT DEFAULT 'Bate-volta'
- `capacity`: INTEGER NOT NULL CHECK (capacity > 0)
- `minimum_group`: INTEGER NOT NULL CHECK (minimum_group > 0 AND minimum_group <= capacity)
- `sold_seats`: INTEGER NOT NULL DEFAULT 0 CHECK (sold_seats >= 0)
- `price_per_seat`: NUMERIC(10, 2) NOT NULL CHECK (price_per_seat > 0)
- `transport_cost`: NUMERIC(10, 2) DEFAULT 0
- `guide_cost`: NUMERIC(10, 2) DEFAULT 0
- `extra_cost`: NUMERIC(10, 2) DEFAULT 0
- `variable_cost_per_person`: NUMERIC(10, 2) DEFAULT 0
- `desired_margin`: NUMERIC(10, 2) DEFAULT 0
- `image_url`: TEXT
- `gallery`: TEXT[] DEFAULT '{}'
- `boarding_points`: TEXT[] DEFAULT '{}'
- `included`: TEXT[] DEFAULT '{}'
- `not_included`: TEXT[] DEFAULT '{}'
- `itinerary`: JSONB DEFAULT '[]'
- `cancellation_policy`: TEXT
- `status`: TEXT NOT NULL CHECK (status IN ('draft', 'available', 'confirmed', 'sold_out', 'cancelled')) DEFAULT 'available'
- `rating`: NUMERIC(3, 2) DEFAULT 5.0
- `is_featured`: BOOLEAN DEFAULT false
- `created_at`: TIMESTAMPTZ DEFAULT now()
- `updated_at`: TIMESTAMPTZ DEFAULT now()

### 2.5 Tabela `orders`
- `id`: UUID PRIMARY KEY DEFAULT gen_random_uuid()
- `buyer_id`: UUID REFERENCES `profiles.id` ON DELETE SET NULL
- `buyer_email`: TEXT NOT NULL
- `buyer_name`: TEXT NOT NULL
- `excursion_id`: UUID NOT NULL REFERENCES `excursions.id` ON DELETE RESTRICT
- `organizer_id`: UUID NOT NULL REFERENCES `organizers.id` ON DELETE RESTRICT
- `quantity`: INTEGER NOT NULL CHECK (quantity > 0)
- `unit_price`: NUMERIC(10, 2) NOT NULL
- `total_amount`: NUMERIC(10, 2) NOT NULL
- `currency`: TEXT DEFAULT 'BRL'
- `stripe_checkout_session_id`: TEXT UNIQUE
- `stripe_payment_intent_id`: TEXT
- `payment_method`: TEXT DEFAULT 'card'
- `payment_status`: TEXT NOT NULL CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')) DEFAULT 'pending'
- `status`: TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'cancelled')) DEFAULT 'pending'
- `voucher_code`: TEXT UNIQUE
- `created_at`: TIMESTAMPTZ DEFAULT now()
- `updated_at`: TIMESTAMPTZ DEFAULT now()

### 2.6 Tabela `order_participants`
- `id`: UUID PRIMARY KEY DEFAULT gen_random_uuid()
- `order_id`: UUID NOT NULL REFERENCES `orders.id` ON DELETE CASCADE
- `full_name`: TEXT NOT NULL
- `document`: TEXT NOT NULL
- `birth_date`: TEXT
- `emergency_contact`: TEXT
- `created_at`: TIMESTAMPTZ DEFAULT now()

### 2.7 Tabela `payouts`
- `id`: UUID PRIMARY KEY DEFAULT gen_random_uuid()
- `excursion_id`: UUID NOT NULL REFERENCES `excursions.id` ON DELETE RESTRICT
- `organizer_id`: UUID NOT NULL REFERENCES `organizers.id` ON DELETE RESTRICT
- `stage`: TEXT NOT NULL CHECK (stage IN ('first_payout', 'final_payout'))
- `amount`: NUMERIC(10, 2) NOT NULL CHECK (amount > 0)
- `status`: TEXT NOT NULL CHECK (status IN ('pending', 'processing', 'paid', 'retained')) DEFAULT 'pending'
- `scheduled_date`: TIMESTAMPTZ
- `paid_at`: TIMESTAMPTZ
- `stripe_transfer_id`: TEXT
- `created_at`: TIMESTAMPTZ DEFAULT now()

---

## 3. Arquitetura Stripe e Stripe Connect

### 3.1 Stripe Connect Onboarding
1. O organizador solicita conexão no perfil (`/api/organizer/stripe/connect`).
2. O servidor cria uma conta Connect (`accounts.create` do tipo `express` ou `standard`) com país `BR`, capabilities `card_payments` e `transfers`.
3. O servidor gera um `account_links.create` com `type: 'account_onboarding'` e redireciona o usuário.
4. No retorno, a rota `/api/organizer/stripe/callback` consulta `accounts.retrieve` e atualiza `stripe_charges_enabled` e `stripe_payouts_enabled` no banco.

### 3.2 Stripe Checkout com Split / Transferência para o Organizador
1. Ao finalizar o checkout, `/api/checkout/create-session` cria a sessão `checkout.sessions.create`:
   - `mode: 'payment'`
   - `line_items`: Preço unitário da excursão $\times$ quantidade de passageiros
   - Se o organizador tiver `stripe_account_id` configurado e ativo:
     - `payment_intent_data.application_fee_amount`: `total * (PLATFORM_FEE_PERCENT / 100)`
     - `payment_intent_data.transfer_data.destination`: `organizer.stripe_account_id`
   - `metadata`: `{ order_id, excursion_id, buyer_id, quantity }`
   - `success_url`: `/checkout/[slug]/sucesso/?session_id={CHECKOUT_SESSION_ID}`
   - `cancel_url`: `/checkout/[slug]/?canceled=true`

### 3.3 Webhooks Idempotentes
- Endpoint `/api/webhooks/stripe`:
  - Validação de assinatura com `stripe.webhooks.constructEvent(body, signature, secret)`.
  - Tratamento de `checkout.session.completed`:
    - Localiza o pedido por `stripe_checkout_session_id`.
    - Se já estiver `paid`, retorna `200 OK` (idempotência).
    - Se `pending`, atualiza para `paid`, gera `voucher_code` (ex: `LIE-8492-SP`), atualiza status da excursão (`sold_seats += quantity`).
  - Tratamento de `account.updated`:
    - Atualiza os status de verificação da conta do organizador.

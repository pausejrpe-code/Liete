# 📋 Dependências Manuais de Infraestrutura e Lançamento

Este documento detalha todas as configurações manuais necessárias nos painéis do **Supabase**, **Stripe** e **Hospedagem (Vercel/Cloud)** para colocar a plataforma **Liete** em produção real.

---

## 1. Supabase (Banco, Storage e Auth)

### 1.1. Buckets de Storage
Acesse o painel do Supabase -> **Storage** -> **New Bucket**:

1. **Bucket Público: `excursion-images`**
   - **Nome**: `excursion-images`
   - **Public bucket**: ✅ `ON` (público para leitura de fotos das viagens)
   - **File size limit**: 5 MB (recomendado)
   - **Allowed MIME types**: `image/jpeg, image/png, image/webp`
   - **Policy de Escrita**: Permitir `INSERT` e `UPDATE` para usuários com `auth.role() = 'authenticated'`.

2. **Bucket Privado: `kyc-documents`**
   - **Nome**: `kyc-documents`
   - **Public bucket**: ❌ `OFF` (privado para documentos de organizadores)
   - **File size limit**: 10 MB
   - **Allowed MIME types**: `application/pdf, image/jpeg, image/png`
   - **Policy de Acesso**: Permitir apenas ao proprietário do documento (`(storage.foldername(name))[1] = auth.uid()`) e ao `service_role`.

### 1.2. Auth (Confirmação de E-mail)
- Acesse **Authentication** -> **Providers** -> **Email**:
  - **Confirm email**: ❌ `OFF` *(já desativado conforme alinhado para reduzir atrito no cadastro do MVP)*.

### 1.3. Migrations de Banco
- Executar a migration `supabase/migrations/20260816000000_init_sdd_schema.sql` no SQL Editor do projeto de produção.

---

## 2. Stripe (Pagamentos & Connect Brasil)

### 2.1. Métodos de Pagamento
- Acesse **Stripe Dashboard** -> **Configurações** -> **Métodos de Pagamento**:
  - **Cartão de Crédito/Débito**: ✅ Ativado com suporte a parcelamento brasileiro (installments).
  - **PIX**: ✅ Ativado (requer conta Stripe Brasil aprovada).
  - **Boleto**: Opcional.

### 2.2. Stripe Connect (Contas Express no Brasil)
- Acesse **Stripe Dashboard** -> **Connect**:
  - Habilitar contas **Express** para organizadores no Brasil (PF / MEI / PJ).
  - Configurar onboarding com repasse automatizado (`transfers` / `destination charges`).

### 2.3. Webhook de Produção
- Acesse **Stripe Dashboard** -> **Desenvolvedores** -> **Webhooks** -> **Adicionar endpoint**:
  - **URL do endpoint**: `https://seudominio.com.br/api/webhooks/stripe`
  - **Eventos a escutar**:
    - `checkout.session.completed`
    - `payment_intent.succeeded`
    - `payment_intent.payment_failed`
    - `transfer.created`
    - `transfer.paid`
    - `charge.refunded`
    - `account.updated`
  - **Chave Secreta do Webhook**: Copiar o `whsec_...` e preencher em `STRIPE_WEBHOOK_SECRET`.

---

## 3. Variáveis de Ambiente em Produção

Preencher as seguintes variáveis no painel da Vercel / Cloud:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://[SEU_PROJETO].supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=[SUA_CHAVE_ANON]
SUPABASE_SERVICE_ROLE_KEY=[SUA_CHAVE_SERVICE_ROLE]

# Stripe
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PLATFORM_FEE_PERCENT=15

# Domínio
NEXT_PUBLIC_SITE_URL=https://liete.com.br

# E-mails (Opcional - Resend)
RESEND_API_KEY=re_...
EMAIL_FROM=Liete <contato@liete.com.br>
```

---

## 4. Domínio e Deploy

1. Conectar o repositório GitHub `pausejrpe-code/Liete` à **Vercel**.
2. Root Directory: `./apps/web` (ou monorepo settings padrão Turborepo / pnpm).
3. Apontar o domínio `liete.com.br` no DNS (Registros A / CNAME).

# Critérios de Aceitação — FEAT-002: Stripe Integration & Live Payments

---

## Critérios de Aceitação

- [ ] **AC-001**: O arquivo `apps/web/.env.local` contém variáveis `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY` e `STRIPE_WEBHOOK_SECRET` com chaves válidas no modo de teste.
- [ ] **AC-002**: A chamada à API `POST /api/organizer/stripe/connect` cria a conta Express na Stripe e retorna a URL oficial do onboarding da Stripe.
- [ ] **AC-003**: A API `GET /api/organizer/stripe/status` consulta o estado da conta na Stripe e atualiza os campos `stripe_charges_enabled` e `stripe_payouts_enabled` no Supabase.
- [ ] **AC-004**: A chamada à API `POST /api/checkout/create-session` gera uma sessão oficial do Stripe Checkout em BRL e redireciona o navegador para a página de pagamento hospedada da Stripe.
- [ ] **AC-005**: A tentativa de alteração do preço via cliente (browser) é ignorada, mantendo o valor estritamente definido na tabela `public.excursions`.
- [ ] **AC-006**: Ao finalizar o pagamento com o cartão de teste `4242 4242 4242 4242`, o webhook `checkout.session.completed` é recebido, validado via HMAC e o pedido no banco passa para `paid`.
- [ ] **AC-007**: A excursão tem suas vagas vendidas incrementadas automaticamente e o voucher gerado é exibido na tela `/checkout/[slug]/sucesso/` e em `/minhas-excursoes/`.
- [ ] **AC-008**: Envios duplicados do mesmo webhook não geram duplicidade de assentos ou alteração indevida de saldo (Idempotência).

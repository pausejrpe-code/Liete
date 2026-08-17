# Integrations — Baseline de Integrações

Este documento mapeia os pontos de integração externa e bibliotecas de infraestrutura utilizadas na **Liete Platform**, sem expor credenciais reais.

---

## 1. Supabase (Backend as a Service)

- **Papel**: Autenticação de usuários (Auth), gerenciamento de sessão SSR e banco de dados relacional (PostgreSQL).
- **Pacotes Utilizados**:
  - `@supabase/supabase-js` (v2.110.7)
  - `@supabase/ssr` (v0.12.3)
- **Pontos de Acesso na Aplicação**:
  - `apps/web/lib/supabase/client.ts`: Cria o cliente no browser via `createBrowserClient(url, publishableKey)`.
  - `apps/web/lib/supabase/server.ts`: Cria o cliente no servidor Next.js com suporte a cookies assíncronos (`createServerClient(url, publishableKey, { cookies })`).
  - `apps/web/lib/supabase/config.ts`: Centraliza a leitura das variáveis públicas de ambiente.
- **Variáveis de Ambiente Necessárias**:
  - `NEXT_PUBLIC_SUPABASE_URL`: Endpoint da API do projeto Supabase.
  - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: Chave anônima pública (anon key).

---

## 2. Style Dictionary (Compilação de Tokens)

- **Papel**: Transformação do JSON canônico de tokens em variáveis CSS e módulos JavaScript para exportação no monorepo.
- **Pacote Utilizado**: `style-dictionary` (v5.5.0).
- **Configuração**: `packages/tokens/style-dictionary.config.mjs`.
- **Arquivos de Saída Gerados**:
  - `packages/tokens/dist/css/tokens.css`
  - `packages/tokens/dist/javascript/tokens.js`

---

## 3. GitHub Actions & GitHub Pages (Deploy Contínuo)

- **Papel**: Integração Contínua (CI) e Entrega Contínua (CD) da aplicação web estática.
- **Workflow**: `.github/workflows/deploy-pages.yml`.
- **Configurações de Ambiente**:
  - `NEXT_PUBLIC_BASE_PATH`: `/Liete` (para suporte ao caminho de base do GitHub Pages).
- **Artefato de Publicação**: Exportação estática de `apps/web/out`.

---

## 4. Diretrizes de Segurança para Futuras Integrações

1. **Gateways de Pagamento (ex: Stripe, Mercado Pago, Pagar.me)**:
   - Chaves secretas devem ser manipuladas exclusivamente no servidor via rotas seguras / Server Actions.
   - Nenhuma chave secreta deve ser incluída no build estático.
2. **Serviços de E-mail Transacional / Notificações Push**:
   - Devem ser consumidos por serviços de backend ou Edge Functions protegidas por chave de serviço.

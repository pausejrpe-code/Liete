# Architecture Guard Rule

Esta regra protege a integridade estrutural, a separação de responsabilidades e as fronteiras arquiteturais do monorepo **Liete Platform**.

---

## 1. Topologia do Monorepo e Fronteiras de Responsabilidade

O projeto é organizado nos seguintes pacotes canônicos:

```text
c:\Turismo
├── apps/
│   └── web/               # Aplicação Next.js (App Router, rotas públicas e administrativas)
├── packages/
│   ├── tokens/            # Fonte canônica dos Design Tokens (Style Dictionary)
│   └── ui-web/            # Biblioteca de Componentes React (Storybook, Vitest)
└── docs/                  # Documentação de PRD e especificações de negócio
```

### Regras de Dependência entre Pacotes:
1. `packages/tokens`: Não depende de nenhum outro pacote do monorepo. É a fonte primária de verdade de cores, tipografia, espaçamentos e raios.
2. `packages/ui-web`: Depende exclusivamente de `packages/tokens`. Não deve importar nada de `apps/web`.
3. `apps/web`: Pode consumir `@liete/tokens` e `@liete/ui-web`. Não deve conter componentes UI genéricos que deveriam residir em `packages/ui-web`.

---

## 2. Padrões de Design System e Estilização

1. **Tokens Canônicos**: Toda variável CSS ou token deve ser consumida a partir de `@liete/tokens/css` ou `@liete/tokens/javascript`.
2. **CSS Modules**: Os componentes em `packages/ui-web` e as páginas em `apps/web` utilizam CSS Modules com escopo local (`*.module.css`). Não introduza bibliotecas de CSS-in-JS ou frameworks CSS não aprovados (como TailwindCSS) sem uma ADR formal prévia (`DEC-XXX`).
3. **Storybook e Testes**: Todo novo componente criado em `packages/ui-web` deve possuir arquivo de documentação/especificação (`*.spec.md`), arquivo de histórias Storybook (`*.stories.tsx`) e testes de unidade (`*.test.tsx`).

---

## 3. Padrões de Backend e Integrações

1. **Supabase**: Toda comunicação com o banco de dados e autenticação Supabase em `apps/web` deve utilizar os clientes centralizados em `apps/web/lib/supabase/`:
   - `client.ts`: Cliente para Browser/Client Components.
   - `server.ts`: Cliente para Server Components e Server Actions com SSR cookie handling.
   - `config.ts`: Configuração e validação de variáveis de ambiente.
2. **Sem Vazamento de Lógica**: Não exponha chaves secretas ou Service Role keys no bundle do cliente.

---

## 4. Preservação de Abstrações Existentes

1. Não crie arquiteturas paralelas (ex: introduzir Redux ou Zustand se o projeto utiliza React State / Context / Supabase SSR).
2. Respeite as estruturas de dados e contratos existentes (`dsb-state-*.json`, modelos de excursão, modelos de repasse).
3. Havendo necessidade de alteração de schema ou quebra de contrato, uma proposta formal de arquitetura com ADR (`DEC-XXX`) deve ser submetida e aprovada antes de qualquer alteração de código.

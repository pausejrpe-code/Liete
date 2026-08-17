# Convenções de Desenvolvimento — Liete Platform

Este guia estabelece os padrões e convenções de código extraídos do ecossistema existente da plataforma Liete.

---

## 1. Nomenclatura e Estrutura de Arquivos

- **Arquivos e Diretórios**: Use `kebab-case` para nomes de pastas e arquivos (ex: `payout-status-card`, `excursion-draft.ts`, `overview-dashboard.tsx`).
- **Componentes React**: PascalCase para nomes de funções e componentes (ex: `PayoutStatusCard`, `OrganizerAppShell`).
- **Arquivos de Módulo CSS**: Localizados lado a lado com o componente, nomeados como `[componente].module.css`.
- **Arquivos de Histórias Storybook**: `[componente].stories.tsx`.
- **Arquivos de Teste**:
  - Testes Node.js Test Runner: `*.test.cjs` ou `*.test.ts`.
  - Testes React/Vitest: `*.test.tsx`.
- **Especificações Locais**: `*.spec.md`.

---

## 2. Tipagem e TypeScript

- **TypeScript Estrito**: Todos os novos arquivos devem ter tipagem explícita em props, retornos de função e estruturas de dados.
- **Exportação de Tipos**: Use `export type { ... }` para evitar poluição de bundle e permitir tree-shaking limpo.
- **Evitar `any`**: Utilizar tipos estritos, `unknown` com type guards ou uniões discriminadas.

---

## 3. Estilização e Design Tokens

- **Importação de Tokens**:
  ```typescript
  import "@liete/tokens/css";
  ```
- **Consumo de Variáveis CSS**: Use sempre as variáveis geradas pelo Style Dictionary (ex: `var(--color-brand-primary)`, `var(--spacing-4)`, `var(--radius-md)`).
- **Sem Cores Literais Hardcoded**: Não utilize cores hexadecimais soltas no código (`#FF5722`), aponte sempre para a variável de token equivalente.

---

## 4. Padrões de Domínio e Formatação

- **Formatação de Moeda Brasileira (BRL)**:
  - Formatar valores com `Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })`.
  - Entradas monetárias em formulários utilizam normalização de centavos/valores monetários (conforme testado em `excursion-draft.test.cjs`).
- **Validação de Documentos Brasileiros (CPF / CNPJ)**:
  - Utilizar o módulo canônico `apps/web/app/_auth/brazilian-document.ts` (`formatBrazilianDocument`, `validateBrazilianDocument`).

---

## 5. Convenções de Git e Mensagens

- **Padrão de Branch**: `feat/FEAT-XXX-nome`, `fix/BUG-XXX-nome`, `chore/CHANGE-XXX-nome`.
- **Padrão de Mensagem de Commit**:
  ```text
  feat(organizador): [FEAT-001] adicionar cálculo de repasse em duas etapas
  fix(auth): [BUG-002] corrigir máscara de CNPJ no cadastro PJ
  docs(sdd): [CHANGE-003] atualizar baseline de arquitetura
  ```
- **Lembrete Absoluto**: Nunca realizar `git push` ou alterar configurações remotas sem autorização explícita.

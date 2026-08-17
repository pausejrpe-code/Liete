---
name: tester
description: Use this skill to design, write, execute, and report automated and manual test suites (unit, component, integration, and regression) mapped to SDD Acceptance Criteria (AC-XXX).
---

# Skill: Tester

O **Tester** é o especialista em garantia de qualidade responsável por verificar se o código implementado atende com fidelidade matemática e comportamental a todos os Critérios de Aceitação (`AC-XXX`), além de garantir a ausência de regressões no produto existente.

---

## 1. Mapeamento Fundamental: `AC → TEST`

Toda asserção de teste deve responder a um Critério de Aceitação explícito:

```text
AC-001 (Preço deve calcular custos + margem divididos pelo mínimo)
   ↓
TEST-001 (pricing calculation unit test)
   ↓
Asserção: calculateTicketPrice(costs, margin, minGroup) === expectedPrice
```

---

## 2. Ferramentas e Tipos de Teste no Monorepo Liete

1. **Testes Unitários & Lógica de Negócio (Node Test Runner)**:
   - Execução: `node --test apps/web/app/_auth/brazilian-document.test.cjs apps/web/app/organizador/excursoes/nova/excursion-draft.test.cjs`
   - Escopo: Validação de cálculos, regras de validação de CPF/CNPJ, rascunhos de excursão.
2. **Testes de Componentes UI (Vitest / React Testing Library)**:
   - Execução: `vitest` em `packages/ui-web`
   - Escopo: Renderização, acessibilidade (a11y), disparo de eventos e estados visuais.
3. **Verificação Estática (TypeScript Compiler)**:
   - Execução: `pnpm run typecheck` ou `tsc --noEmit`
   - Escopo: Integridade de tipos e ausência de erros em tempo de compilação.
4. **Testes de Regressão Sistêmica**:
   - Executar todas as suítes existentes relacionadas às áreas mapeadas no `Impact Analysis`.

---

## 3. Formato do Relatório de Testes

```markdown
## TEST REPORT

| ID do Teste | AC Coberto | Tipo de Teste | Comando / Arquivo | Resultado |
|---|---|---|---|---|
| TEST-001 | AC-001 | Unit | `brazilian-document.test.cjs` | ✅ PASS |
| TEST-002 | AC-002 | Component | `payout-status-card.test.tsx` | ✅ PASS |
| TEST-003 | AC-003 | Regression | `excursion-draft.test.cjs` | ✅ PASS |

### Resumo
- **Total Executado**: 12
- **Aprovados (PASS)**: 12
- **Reprovados (FAIL)**: 0
- **Ignorados (SKIPPED)**: 0
- **Checagem de Regressão**: ✅ PASS
```

---

## 4. Regras Inegociáveis

1. **NUNCA ALTERE A SPEC PARA O TESTE PASSAR**: Se o teste falhar, o código está incorreto ou a implementação divergiu da especificação. Nunca enfraqueça uma asserção para forçar um resultado positivo.
2. **EVIDÊNCIA OBRIGATÓRIA**: Todo status deve ser acompanhado da saída real de execução do comando de teste.

---
name: reviewer
description: Use this skill to perform cross-dimensional audit (SPEC ↔ DESIGN ↔ CODE ↔ TEST ↔ BASELINE), build traceability matrices, generate verification.md, calculate specification compliance percentage, and gate the final Definition of Done (DoD).
---

# Skill: Reviewer

O **Reviewer** é o auditor independente da conformidade do SDD. Sua função é validar se o que foi entregue atende a 100% dos requisitos, sem introduzir desvios de arquitetura, débitos técnicos não autorizados ou regressões funcionais.

---

## 1. Auditoria Cruzada Multidimensional

O Reviewer compara 5 eixos simultâneos:

```text
SPEC (requirements.md & acceptance.md)
 ↕
DESIGN (design.md & Impact Analysis)
 ↕
CODE (Diffs dos arquivos modificados)
 ↕
TEST (Relatório de testes e evidências)
 ↕
BASELINE (.spec/baseline/)
```

---

## 2. Saídas Geradas

1. `verification.md`: Relatório completo de auditoria da entrega.
2. **Matriz de Rastreabilidade (Traceability Matrix)**: Mapeamento ponta a ponta dos IDs.
3. **Cálculo de Compliance e Status Final**.

---

## 3. Estrutura Padrão de `verification.md`

```markdown
# FEAT-XXX: Verification Report

## 1. Matriz de Rastreabilidade

- **REQ-001**: [Título do Requisito]
  - **AC-001**: [Critério de Aceitação 1] → `TEST-001` (PASS) → `src/...`
  - **AC-002**: [Critério de Aceitação 2] → `TEST-002` (PASS) → `src/...`
  - **Tasks**: `TASK-001`, `TASK-002`
  - **Status do Requisito**: ✅ PASS

- **REQ-002**: [Título do Requisito 2]
  - **AC-003**: [Critério de Aceitação 3] → `TEST-003` (PASS) → `src/...`
  - **Tasks**: `TASK-003`
  - **Status do Requisito**: ✅ PASS

## 2. Auditoria de Código e Escopo
- **Arquivos modificados vs Arquivos previstos no Design**: 100% aderente (nenhum arquivo extra modificado).
- **Refatoração oportunista detectada**: NÃO.
- **Convenções respeitadas**: SIM (CSS Modules, tokens `@liete/tokens`, tipagem estrita).

## 3. Resumo de Conformidade e Evidências
- **Total de Requisitos**: 5
- **Aprovados (PASS)**: 5
- **Reprovados (FAIL)**: 0
- **Parciais (PARTIAL)**: 0
- **Conformidade da Especificação (Spec Compliance)**: 100%
- **Regressões Identificadas**: NENHUMA (0)

## 4. Decisão de Conclusão (Definition of Done)
- [x] Todos os Requisitos obrigatórios aprovados com evidências.
- [x] Todos os Critérios de Aceitação validados.
- [x] Todas as Tasks concluídas.
- [x] Suítes de teste de regressão aprovadas.
- **STATUS FINAL**: `COMPLETE`
```

---

## 4. Critério de Rejeição

- Se **qualquer** requisito obrigatório falhar ou estiver incompleto (`PARTIAL`), o status final **DEVE SER** `NOT COMPLETE`.
- Documente detalhadamente o motivo da não-conformidade para que o Developer faça o ajuste direcionado.

# SDD Core Governance Rule

Esta é a regra fundamental de governança do projeto **Liete Platform**. Ela governa todas as ações dos agentes de IA no repositório e deve ser obedecida incondicionalmente.

---

## 1. Princípios Absolutos

1. **UNDERSTAND BEFORE CHANGE**: Nunca proponha ou aplique modificações de código sem antes entender o comportamento atual, a arquitetura envolvida e o impacto da alteração.
2. **SPEC BEFORE CODE**: Para qualquer mudança não-trivial, os Requisitos (`requirements.md`), Critérios de Aceitação (`acceptance.md`) e Design Técnico (`design.md` / `tasks.md`) devem existir e estar aprovados antes da escrita de código.
3. **PRESERVE BEFORE REFACTOR**: Em um produto existente, funcional e avançado como este, a arquitetura e o comportamento existente são preservados por padrão.
4. **NO OPPORTUNISTIC REFACTORING**: É expressamente proibido refatorar módulos, alterar estilos ou reescrever funções não relacionadas à solicitação do usuário. Altere única e exclusivamente o escopo necessário para cumprir a task designada.
5. **CODE MUST BE VERIFIED AGAINST SPEC**: Uma tarefa nunca é considerada concluída (`COMPLETE`) sem verificação formal de conformidade com os critérios de aceitação e comprovação de ausência de regressões.

---

## 2. Matriz de Classificação Obrigatória

Toda solicitação deve ser primeiramente classificada em uma das seguintes categorias:

| Categoria | Descrição | Fluxo Aplicável | Exigência de SPEC |
|---|---|---|---|
| **TRIVIAL** | Correção de typo em texto visível, ajuste simples de espaçamento, correção de cor literal pontual | Direto (Quick fix + verificação básica) | Não requer SPEC formal |
| **BUG** | Comportamento divergente do esperado em funcionalidade existente | Bug Flow (Reprodução → Causa Raiz → Impacto → Fix → Testes de Regressão → Verificação) | `.spec/bugs/BUG-XXX/` |
| **CHANGE** | Alteração ou extensão de regra de negócio em feature existente | Full SDD Delta (Comportamento Atual → Impact Analysis → SPEC Delta → Design Delta → Tasks → Implement → Test → Verify) | `.spec/changes/CHANGE-XXX/` |
| **NEW_FEATURE** | Nova funcionalidade ou jornada inexistente no baseline | Full SDD (Elicitação → SPEC → Impact Analysis → Design → Tasks → Implement → Test → Verify) | `.spec/features/FEAT-XXX/` |
| **REFACTOR** | Reestruturação interna sem alteração de comportamento externo | Refactor Flow (Baseline → Refactor Design → Tasks → Implement → Testes de Regressão Rigorosos → Verificação) | `.spec/refactors/REF-XXX/` |
| **ARCHITECTURAL** | Mudança estrutural de padrão, banco, tecnologia ou limites entre módulos | Full SDD + ADR (Análise de Impacto Amplo + Architecture Decision Record + Aprovação Humana Obrigatória) | `.spec/decisions/DEC-XXX.md` |
| **TECHNICAL** | Atualização de scripts de automação, pipelines de build, lints ou ferramentas internas | Technical Flow (Impacto no Build → Execução → Validação) | `.spec/changes/CHANGE-XXX/` |

---

## 3. Fluxo de Execução Padrão (Full SDD)

```text
SOLICITAÇÃO
      ↓
CLASSIFICAÇÃO
      ↓
CONTEXTO ATUAL (Consultar .spec/baseline/)
      ↓
IMPACT ANALYSIS
      ↓
SPEC (Requirements REQ-XXX & Acceptance AC-XXX)
      ↓
DESIGN (Solução técnica & interfaces)
      ↓
PLAN (Tarefas atômicas TASK-XXX)
      ↓
IMPLEMENT (Execução estrita task a task)
      ↓
TEST (Mapeamento AC → TEST-XXX)
      ↓
VERIFY (verification.md & Matrix de Rastreabilidade)
      ↓
COMPLETE (Somente se 100% dos REQs obrigatórios passarem)
```

---

## 4. Sistema de Rastreabilidade e IDs

Para manter a linhagem do código ("Por que este código existe?"), os seguintes prefixos padronizados devem ser utilizados:

- `FEAT-XXX`: Features novas (ex: `FEAT-001`)
- `CHANGE-XXX`: Alterações em features existentes (ex: `CHANGE-001`)
- `BUG-XXX`: Correções de defeitos (ex: `BUG-001`)
- `REF-XXX`: Refatorações estruturais (ex: `REF-001`)
- `REQ-XXX`: Requisitos individuais funcionais ou não-funcionais (ex: `REQ-001`)
- `AC-XXX`: Critérios de Aceitação verificáveis (ex: `AC-001`)
- `TASK-XXX`: Tarefas atômicas de implementação (ex: `TASK-001`)
- `TEST-XXX`: Casos de teste automatizados ou de verificação (ex: `TEST-001`)
- `DEC-XXX`: Registros de Decisão Arquitetural / ADR (ex: `DEC-001`)

---

## 5. Proibições Expressas

1. **Nunca** altere arquivos fora do escopo definido em `tasks.md`.
2. **Nunca** adicione novas dependências ao `package.json` sem justificativa formal no `design.md`.
3. **Nunca** declare um requisito como "atendido" sem apresentar evidências concretas (testes executados, build passando, validação visual ou logs).
4. **Nunca** execute comandos Git com `push` ou altere branches remotas sem autorização explícita.
5. **Nunca** invente regras de negócio quando houver ambiguidade; registre como `OPEN QUESTION` no documento de requisitos.

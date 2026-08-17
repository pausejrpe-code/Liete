---
name: spec-writer
description: Use this skill when transforming user requests, business requirements, or feature changes into formal SDD specifications (requirements, acceptance criteria, open questions). This skill does not write or modify production code.
---

# Skill: Spec Writer

O **Spec Writer** é o especialista responsável por traduzir intenções de negócio e solicitações de usuários em especificações formais, verificáveis e rastreáveis antes de qualquer implementação de código.

---

## 1. Entradas Necessárias

- **Solicitação do Usuário** (Pedido de nova feature, alteração de comportamento ou melhoria).
- **Baseline do Produto**: `.spec/baseline/product-map.md`, `.spec/baseline/feature-map.md`, `docs/PRD-Plataforma-Organizador.md`.
- **Constituição e Convenções**: `.spec/constitution.md`, `.spec/conventions.md`.

---

## 2. Saídas Geradas

O Spec Writer produz a seguinte estrutura em `.spec/features/FEAT-XXX/` ou `.spec/changes/CHANGE-XXX/`:

1. `requirements.md`: Lista formal de requisitos numerados (`REQ-001`, `REQ-002`, ...).
2. `acceptance.md`: Critérios de Aceitação inequívocos e testáveis (`AC-001`, `AC-002`, ...).
3. `status.md`: Painel inicial de rastreamento do ciclo de vida da especificação.

---

## 3. Estrutura Padrão de um Requisito (`requirements.md`)

```markdown
### REQ-001: [Título Conciso do Requisito]
- **Descrição**: O que o sistema deve fazer exatamente.
- **Motivação**: Por que esse comportamento é necessário para o usuário ou negócio.
- **Prioridade**: Alta / Média / Baixa.
- **Dependências**: Outros REQs ou features pré-existentes.
- **Acceptance Criteria Relacionados**: AC-001, AC-002.
- **Ambiguidades / Incertezas**: Se houver, registrar explicitamente como `OPEN QUESTION`.
```

---

## 4. Tratamento de Incertezas (`OPEN QUESTION`)

- Nunca assuma silenciosamente uma regra de negócio duvidosa.
- Registre perguntas abertas no formato:
  > **OPEN QUESTION [OQ-001]**: [Descrição da dúvida e opções consideradas].
- Se a incerteza não impedir o planejamento seguro de outros requisitos, prossiga documentando o restante e destacando a pendência para o usuário.

---

## 5. Regras Inegociáveis

1. **NÃO ESCREVA CÓDIGO**: O Spec Writer foca exclusivamente na definição do *o quê* e *por que*, nunca no *como implementar*.
2. **CRITÉRIOS VERIFICÁVEIS**: Todo Critério de Aceitação deve ser passível de verificação objetiva (verdadeiro/falso).

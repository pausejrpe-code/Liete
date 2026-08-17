# Workflow: /change

O workflow `/change` governa a modificação de comportamento de features existentes no baseline ou em especificações anteriores, garantindo que mudanças nunca ocorram sem análise prévia de impacto.

---

## 1. Gatilho e Parâmetros

```text
/change [ID da Mudança, ex: CHANGE-001 ou Nome da Feature Existente]
```

---

## 2. Passos de Execução

1. **Identificação do Comportamento Atual**:
   - Localize a feature afetada no `.spec/baseline/feature-map.md` ou em `.spec/features/`.
   - Documente o comportamento atual antes de propor qualquer alteração.
2. **Análise de Impacto de Mudança (Change Impact Analysis)**:
   - Identifique os requisitos existentes afetados, modificados ou revogados.
   - Avalie efeitos colaterais em módulos dependentes e dados persistidos.
3. **Criação da Especificação Delta**:
   - Crie a pasta `.spec/changes/CHANGE-XXX/`.
   - Gere `delta.md` registrando:
     - Requisitos Adicionados (`REQ-ADD-XXX`)
     - Requisitos Modificados (`REQ-MOD-XXX`)
     - Requisitos Removidos (`REQ-DEL-XXX`)
     - Mudanças de Design e Contrato
4. **Planejamento e Execução**:
   - Gere `tasks.md` com as tarefas atômicas para aplicar o delta.
   - Execute a implementação (`/implement`) e testes (`/test`).
5. **Verificação Delta**:
   - Execute `/verify CHANGE-XXX` para garantir que o comportamento novo foi introduzido sem quebrar os comportamentos preservados.

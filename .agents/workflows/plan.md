# Workflow: /plan

O workflow `/plan` decompõe a especificação e o design aprovados em tarefas atômicas, sequenciais e verificáveis para execução controlada.

---

## 1. Gatilho e Parâmetros

```text
/plan [ID da Feature/Mudança, ex: FEAT-001]
```

---

## 2. Passos de Execução

1. **Entrada de Dados**:
   - Carregue `requirements.md`, `acceptance.md` e `design.md`.
2. **Decomposição em Tarefas (`TASK-XXX`)**:
   - Divida o trabalho em tarefas pequenas (10-30 minutos de esforço estimado por tarefa).
   - Ordene as tarefas respeitando estritamente a árvore de dependências (fundação / tokens / componentes antes de páginas e fluxos integrados).
3. **Formatação de cada Tarefa**:
   - Vincule cada `TASK-XXX` ao `REQ-XXX` e `AC-XXX` correspondente.
   - Especifique a lista exata de arquivos que a tarefa deve tocar.
   - Defina o critério de validação local imediato (ex: teste unitário ou verificação de tipagem).
   - Defina o status inicial como `pending`.
4. **Geração do Arquivo de Tarefas**:
   - Grave `tasks.md` dentro do diretório da feature.
5. **Atualização de Status**:
   - Atualize `status.md` para estágio `PLANNING`.

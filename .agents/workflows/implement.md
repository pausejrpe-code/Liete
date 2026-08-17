# Workflow: /implement

O workflow `/implement` coordena a execução orientada a tarefas do código-fonte, garantindo aderência absoluta ao design e às convenções do projeto.

---

## 1. Gatilho e Parâmetros

```text
/implement [ID da Feature/Mudança, ex: FEAT-001]
```

---

## 2. Passos de Execução

1. **Validação de Pré-requisitos**:
   - Verifique se `requirements.md`, `design.md` e `tasks.md` existem e estão consistentes.
2. **Ativação do Desenvolvedor**:
   - Ative a skill `developer`.
3. **Loop de Execução de Tarefas**:
   - Para cada tarefa em `tasks.md`:
     1. Verifique se as dependências anteriores foram concluídas com sucesso.
     2. Altere o status da tarefa para `in_progress`.
     3. Implemente as alterações estritamente nos arquivos designados.
     4. Execute a verificação estática/local (`pnpm run typecheck` ou teste rápido).
     5. Altere o status da tarefa para `implemented`.
     6. Registre os arquivos editados e eventuais observações técnicas.
4. **Atualização de Status**:
   - Atualize `status.md` para estágio `IMPLEMENTATION`.
5. **Transição**:
   - Ao concluir todas as tasks com status `implemented`, acione automaticamente o workflow `/test`.

# Workflow: /verify

O workflow `/verify` é o portão de controle de qualidade final. Ele realiza a auditoria cruzada multidimensional, constrói a Matriz de Rastreabilidade e emite a decisão de `COMPLETE` ou `NOT COMPLETE`.

---

## 1. Gatilho e Parâmetros

```text
/verify [ID da Feature/Mudança, ex: FEAT-001]
```

---

## 2. Passos de Execução

1. **Ativação do Revisor**:
   - Ative a skill `reviewer`.
2. **Auditoria Cruzada (SPEC ↔ DESIGN ↔ CODE ↔ TEST ↔ BASELINE)**:
   - Verifique cada `REQ-XXX` e `AC-XXX` contra o código modificado e os testes executados.
   - Audite se algum arquivo fora do escopo previsto no `design.md` foi alterado.
   - Verifique se houve refatoração oportunista.
   - Verifique se os padrões de convenção (`.spec/conventions.md`) foram preservados.
3. **Geração da Matriz de Rastreabilidade e `verification.md`**:
   - Gere o relatório completo em `.spec/features/FEAT-XXX/verification.md`.
   - Calcule o percentual de conformidade da especificação (`Spec Compliance`).
4. **Avaliação da Definition of Done (DoD)**:
   - Se todos os requisitos obrigatórios forem `PASS` e os testes de regressão forem `PASS`:
     - Marque o status em `status.md` como `COMPLETE`.
     - Marque todas as tasks verificadas como `verified`.
   - Se houver qualquer falha (`FAIL`) ou pendência (`PARTIAL`):
     - Marque o status como `NOT COMPLETE`.
     - Registre os itens bloqueantes para correção imediata.
5. **Relatório Final**:
   - Apresente o sumário de verificação para o usuário.

# Workflow: /test

O workflow `/test` executa as suítes de teste de unidade, integração, componentes e regressão, vinculando as execuções aos Critérios de Aceitação da especificação.

---

## 1. Gatilho e Parâmetros

```text
/test [ID da Feature/Mudança, ex: FEAT-001]
```

---

## 2. Passos de Execução

1. **Carregamento de Critérios**:
   - Carregue `acceptance.md` e a lista de testes mapeados no `design.md`.
2. **Ativação do Testador**:
   - Ative a skill `tester`.
3. **Execução das Suítes**:
   - **Testes Unitários de Aplicação**:
     ```powershell
     node --test apps/web/app/_auth/brazilian-document.test.cjs apps/web/app/organizador/excursoes/nova/excursion-draft.test.cjs
     ```
   - **Verificação de Tipagem TypeScript**:
     ```powershell
     pnpm run typecheck
     ```
   - **Testes de Componentes UI** (quando aplicável):
     ```powershell
     pnpm --filter @liete/ui-web test
     ```
4. **Mapeamento e Registro de Resultados**:
   - Registre cada resultado associado ao `AC-XXX` correspondente.
   - Capture a saída dos testes como evidência verificável.
5. **Atualização de Status**:
   - Atualize `status.md` com as métricas de testes aprovados, reprovados e checagem de regressão.

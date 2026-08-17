# Workflow: /fix (Bug Flow)

O workflow `/fix` governa a resolução rigorosa e estruturada de bugs no produto, impedindo correções superficiais que mascarem a causa raiz.

---

## 1. Gatilho e Parâmetros

```text
/fix [ID do Bug, ex: BUG-001 ou Descrição do Defeito]
```

---

## 2. Passos de Execução

1. **Criação da Estrutura do Bug**:
   - Aloque o próximo ID disponível (ex: `BUG-001`).
   - Crie a pasta `.spec/bugs/BUG-XXX/`.
2. **Registro do Problema e Reprodução**:
   - Crie `problem.md` descrevendo o sintoma relatado, comportamento esperado vs comportamento real.
   - Crie `reproduction.md` com os passos determinísticos ou teste de reprodução automatizado.
3. **Análise de Causa Raiz e Impacto**:
   - Crie `root-cause.md` identificando o defeito real no código/lógica.
   - Crie `impact.md` listando os módulos e dados afetados pela correção.
4. **Planejamento e Correção**:
   - Crie `tasks.md` com a tarefa atômica de correção e a tarefa de criação do teste de regressão.
   - Execute a implementação da correção cirúrgica.
5. **Teste de Regressão Obrigatório**:
   - O bug só é considerado corrigido quando houver um teste automatizado ou evidência visual inequívoca de que o defeito não se repetirá.
6. **Verificação Final**:
   - Gere `verification.md` e marque `status.md` como `RESOLVED`.

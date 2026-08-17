# Workflow: /status

O workflow `/status` apresenta uma visão consolidada do estado atual das especificações, do baseline, dos itens em andamento e da saúde global do SDD no projeto.

---

## 1. Gatilho e Parâmetros

```text
/status
/status [ID da Feature/Mudança/Bug, ex: FEAT-001]
```

---

## 2. Passos de Execução

1. **Consulta Geral**:
   - Quando chamado sem parâmetros, execute a CLI local determinística:
     ```powershell
     node .sdd/scripts/sdd.cjs status
     ```
   - Apresente a contagem de features em andamento, concluídas, bugs ativos e métricas de conformidade.
2. **Consulta Específica por ID**:
   - Quando chamado com um ID (ex: `/status FEAT-001`), execute:
     ```powershell
     node .sdd/scripts/sdd.cjs feature show FEAT-001
     ```
   - Apresente o resumo de Requisitos, Tasks, Testes e Conformidade da especificação solicitada.

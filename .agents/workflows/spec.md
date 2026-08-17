# Workflow: /spec

O workflow `/spec` é acionado para iniciar a fase de especificação formal de uma nova funcionalidade (`/spec new` ou `FEAT-XXX`) ou modificação relevante de comportamento (`/spec change` ou `CHANGE-XXX`).

---

## 1. Gatilho e Parâmetros

```text
/spec new [Nome da Feature]
/spec change [ID ou Nome da Feature Existente]
```

*(Ou acionado automaticamente pelo agente quando uma solicitação é classificada como `NEW_FEATURE` ou `CHANGE`).*

---

## 2. Passos de Execução

1. **Classificação e Contextualização**:
   - Confirme a categoria da solicitação (`NEW_FEATURE` ou `CHANGE`).
   - Consulte `.spec/baseline/feature-map.md` e `.spec/baseline/product-map.md` para entender a área de negócio envolvida.
2. **Geração do Identificador**:
   - Aloque o próximo ID disponível (ex: `FEAT-001` ou `CHANGE-001`).
   - Crie a pasta correspondente: `.spec/features/FEAT-XXX/` ou `.spec/changes/CHANGE-XXX/`.
3. **Elicitação de Requisitos e Critérios de Aceitação**:
   - Ative a skill `spec-writer`.
   - Crie `requirements.md` listando todos os `REQ-XXX` com descrição, motivação, prioridade e dependências.
   - Crie `acceptance.md` listando todos os `AC-XXX` testáveis.
   - Registre eventuais dúvidas relevantes como `OPEN QUESTION` no topo do documento.
4. **Criação do Painel de Status**:
   - Crie `status.md` com estágio inicial `SPECIFICATION` e compliance `0%`.
5. **Apresentação e Confirmação**:
   - Apresente a especificação para o usuário e solicite alinhamento antes de avançar para a fase de `/design`.

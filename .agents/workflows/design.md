# Workflow: /design

O workflow `/design` é responsável pelo desenho arquitetural da solução e pela análise prévia de impacto para uma especificação aprovada.

---

## 1. Gatilho e Parâmetros

```text
/design [ID da Feature/Mudança, ex: FEAT-001 ou CHANGE-001]
```

---

## 2. Passos de Execução

1. **Leitura da Especificação**:
   - Carregue `requirements.md` e `acceptance.md` da feature indicada.
2. **Ativação do Arquiteto**:
   - Ative a skill `architect`.
3. **Análise de Impacto (Impact Analysis)**:
   - Identifique pacotes afetados (`apps/web`, `packages/tokens`, `packages/ui-web`).
   - Mapeie arquivos a criar, modificar ou excluir.
   - Analise impacto em dados, modelos de estado (`dsb-state-*.json`, Supabase) e APIs.
   - Identifique riscos de regressão e mapeie as suítes de teste de regressão relevantes.
4. **Definição de Contratos e Solução**:
   - Desenhe interfaces TypeScript, props de componentes e fluxos de dados.
   - Verifique se é necessária a criação de um Registro de Decisão Arquitetural (`.spec/decisions/DEC-XXX.md`).
5. **Geração do Arquivo de Design**:
   - Escreva o documento `design.md` dentro da pasta da feature.
6. **Atualização de Status**:
   - Atualize `status.md` para estágio `DESIGN`.
7. **Regra de Transição**:
   - **NÃO ESCREVA CÓDIGO NESTA ETAPA**. Avance para o `/plan` para gerar as tasks de desenvolvimento.

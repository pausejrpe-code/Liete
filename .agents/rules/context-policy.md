# Context Policy & Token Efficiency Rule

Esta regra estabelece a política de isolamento, minimização de contexto e carregamento cirúrgico de informações durante a atuação do agente.

---

## 1. Princípio do Contexto Mínimo Necessário

1. **PROIBIDO CARREGAMENTO INDISCRIMINADO**: O agente NÃO deve ler todos os arquivos do projeto para responder a uma tarefa localizada.
2. **Carregamento Estruturado**: Para qualquer tarefa sob SDD, o contexto deve ser montado estritamente a partir de:
   - Identificador da Feature / Mudança (`FEAT-XXX`, `CHANGE-XXX`, `BUG-XXX`);
   - Baseline relevante em `.spec/baseline/` (ex: `feature-map.md`, `integrations.md`);
   - Requisitos (`requirements.md`) e Critérios de Aceitação (`acceptance.md`);
   - Design técnico (`design.md`) e Tarefa atual em execução (`tasks.md`);
   - Arquivos de código-fonte diretamente impactados pela tarefa.

---

## 2. Redução de Alucinação e Risco

A minimização de contexto tem os seguintes objetivos obrigatórios:
- **Reduzir ruído de contexto** e dispersão de atenção do modelo.
- **Prevenir alterações acidentais** em módulos periféricos.
- **Aumentar a velocidade de raciocínio** e precisão sintática.
- **Garantir rastreabilidade**: cada leitura de arquivo deve ter um motivo claro na análise de impacto da tarefa.

---

## 3. Análise de Impacto sem Perda de Visão Sistêmica

A redução de contexto NÃO deve comprometer a análise de impacto. Quando um módulo compartilhado (ex: `@liete/ui-web` ou `@liete/tokens`) for afetado:
- Consulte a matriz de dependências em `.spec/baseline/architecture-map.md`.
- Identifique os consumidores antes de propor mudanças de API pública ou props de componentes.

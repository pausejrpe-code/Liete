# Auditoria de variáveis — Leite DS

Fonte: arquivo Figma `Leite_DS`, coleções locais revisadas em 29/07/2026.

## Coleções encontradas

| Coleção | Variáveis | Modos |
| --- | ---: | --- |
| Travel / Primitives | 38 | Value |
| Travel / Color | 56 | Light, Dark |
| Travel / Spacing | 18 | Value |
| Travel / Radius | 12 | Value |
| Travel / Size | 11 | Value |
| Travel / Typography | 73 | Value |

## Cobertura adicionada ao código

- Primitivas ausentes de rosa, vermelho, âmbar, azul e neutros.
- Aliases de compatibilidade `white`, `black` e `slate`.
- Superfícies de página, elevada e inversa.
- Texto de marca, borda padrão e borda forte.
- Feedback de aviso e erro.
- Cores de pagamento, destaque de viagem, contraste e ícones.
- Aliases com a sintaxe web usada pelo Figma, incluindo
  `--color-color-border-default` e `--color-color-bg-surface-muted`.
- Escala completa de espaçamento.
- Escala completa de raios.
- Tamanhos de controles, ícones, toque, cards e contêineres.
- Famílias, estilos, pesos, tamanhos, alturas de linha e aliases
  tipográficos ausentes.
- Tokens do `FlowStepper` atualizados para a estrutura vertical no desktop e
  segmentada no mobile.

## Compatibilidade preservada

Os nomes semânticos já consumidos pelo produto continuam disponíveis. Os
nomes web exportados pelo Figma foram adicionados como aliases, evitando uma
migração quebradora nos componentes existentes.

## Conflitos identificados

- `slate/400 2` e `color/bg/surface-muted 2` duplicam nomes de sintaxe web
  existentes com valores diferentes. Foram tratados como duplicatas do
  arquivo de design e não viraram novos tokens.
- O Figma possui modos Light e Dark. O produto atual declara apenas
  `color-scheme: light`; os valores Light alimentam os tokens ativos. A
  ativação de tema escuro exige uma decisão de produto e validação visual
  completa dos componentes.
- O `action/secondary/default` do Figma usa preto/branco, enquanto o produto
  atual usa rosa. O valor existente foi preservado para não alterar todos os
  botões secundários sem uma migração dedicada.
- A altura de linha `display-lg` é 52 px no Figma e 68 px no produto. O valor
  do produto foi preservado até a tipografia Display ser revisada em conjunto.

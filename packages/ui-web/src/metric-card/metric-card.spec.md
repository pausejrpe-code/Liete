# Component Spec: MetricCard

## Objective

Apresentar um KPI administrativo com contexto, tendência e situação operacional.

## Anatomy

- Rótulo.
- `StatusChip` opcional.
- Valor principal.
- Tendência opcional com vetor exportado.
- Texto de apoio opcional.

## Variants

Tons `neutral`, `positive` e `warning`; tamanhos `regular` e `compact`.

## Properties

`label`, `value`, `supporting`, `trendLabel`, `trendDirection`, `tone`, `size`, `showStatus`, `showTrend` e `showSupporting`.

## States

É informativo. Atualizações dinâmicas podem adicionar `role="status"` no uso.

## Tokens

Usa superfície muted, radius 12, tipografia Price/Highlight/Label/Body, status semântico e larguras próprias.

## Responsive Behavior

Regular tem 280 px e compact 224 px, ambos limitados pelo container e com truncamento seguro no cabeçalho.

## Figma

Mapeia `MetricCard` (`238:792`) com `Tone`, `Size`, status e supporting.

## Accessibility

Status permanece textual e o ícone de tendência é decorativo. Valor e rótulo continuam disponíveis sem cor.

## Code API

`MetricCardProps` estende atributos nativos de `article`.

## Do Not Use

Não usar para gráficos históricos nem para ações interativas.

## Tests

Validar mapeamento de status, tons, densidades, visibilidade e conteúdo expandido.

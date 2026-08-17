# Component Spec: Trip Card

## Objective

Apresentar uma caravana ou passeio para descoberta e permitir a reserva quando houver disponibilidade.

## Variants and API

`layout` aceita `vertical` e `compact`; `availability` aceita `available` e `sold-out`. Título, mídia, saída, organizador, vagas, verificação, avaliação, participantes, preço e `actionLabel` são configuráveis.

## Behavior and accessibility

Usa `article` nomeado pelo título, imagem decorativa por padrão, badges com texto explícito e botão nativo. Quando esgotado, o CTA usa `disabled` e não depende apenas de cor.

## Responsive

O layout compacto reorganiza-se verticalmente abaixo de 620 px. Em larguras muito estreitas o preço e a ação empilham.

## Figma

Mapeia `Layout = Vertical | Compact` e `Availability = Available | SoldOut` do nó `8:95`.

## Tests

Anatomia disponível, bloqueio da reserva no esgotado, layouts, cópia customizada, semântica e regressão visual.

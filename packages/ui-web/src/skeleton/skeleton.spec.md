# Component Spec: Skeleton

## Objective

Representar temporariamente texto, card de viagem, avatar ou linha de tabela enquanto o conteúdo carrega.

## Variants and API

`type` aceita `text`, `trip-card`, `avatar` e `table-row`. Propriedades nativas de `div` são aceitas; `aria-label` transforma o componente em um status anunciado.

## Behavior and accessibility

É decorativo por padrão (`aria-hidden`). Quando a região não anuncia o carregamento por outro meio, use um rótulo curto. O shimmer respeita `prefers-reduced-motion`.

## Responsive

Texto e avatar mantêm medidas compactas; o card respeita a largura disponível. Linhas de tabela preservam a anatomia horizontal e devem ficar dentro de uma área com rolagem quando necessário.

## Figma

Mapeia `Type = Text | Trip card | Avatar | Table row` do nó `16:249`.

## Tests

Semântica decorativa ou de status, quatro variantes, movimento reduzido e regressão visual das dimensões.

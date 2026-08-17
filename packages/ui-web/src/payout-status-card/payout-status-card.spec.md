# Component Spec: PayoutStatusCard

## Objective

Acompanhar o repasse financeiro da excursão em quatro etapas compreensíveis para o organizador.

## Anatomy

- Título e `StatusChip`.
- Rótulo financeiro, valor e explicação.
- Detalhes do primeiro repasse e saldo.
- Ação opcional com `Button`.

## Variants

Layouts `regular` (560 px) e `compact` (320 px). Etapas `collecting`, `minimumReached`, `afterTrip` e `paid`.

## Properties

`stage`, `layout`, `amount`, `description`, `showStatus`, `showDetails`, `showAction`, `statusLabel` e `onDetailsClick`.

## States

Cada etapa possui status, textos, valor e detalhes próprios. `paid` usa borda final e valores de detalhe confirmados.

## Tokens

Usa tokens semânticos de status, sucesso, texto, superfície e `component.payoutStatusCard.*`.

## Content

Valores podem ser substituídos, mas rótulo, descrição e detalhes devem continuar coerentes com a etapa.

## Responsive Behavior

Os layouts respeitam 100% do contêiner. Em larguras inferiores a 320 px, cabeçalho e detalhes empilham para evitar corte.

## Accessibility

Status permanece textual via `StatusChip`; valores e etapas não dependem apenas de cor. A ação é um botão nativo com foco visível.

## Code API

`PayoutStatusCardProps` estende atributos nativos de `section`.

## Do Not Use

Não usar como extrato completo, comprovante ou executor de repasse.

## Tests

Validar as quatro etapas, status, valores, detalhes, ação, conteúdo longo, responsividade, teclado e contraste.

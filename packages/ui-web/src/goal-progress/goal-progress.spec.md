# Component Spec: GoalProgress

## Objective

Mostrar o avanço até a quantidade mínima de passageiros necessária para confirmar uma excursão.

## Anatomy

- Rótulo da meta.
- Razão atual/total opcional.
- Barra de progresso.
- Texto de apoio opcional.

## Variants

Layouts `regular` e `compact`; marcos 25, 50, 75 e 100.

## Properties

`progress`, `current`, `total`, `label`, `supporting`, `layout`, `showRatio` e `showSupporting`.

## States

Em 100%, razão, barra e mensagem assumem tratamento de sucesso.

## Tokens

Usa superfícies default/muted, radius 12/full, tipografia Label/Highlight/Body e dimensões próprias.

## Responsive Behavior

Regular tem até 560 px e compact até 320 px; ambos encolhem com o container.

## Figma

Mapeia `GoalProgress` (`239:62`) com `Layout` e `Progress`.

## Accessibility

A barra usa `role="progressbar"`, valores mínimo/máximo/atual e valor textual com a razão de passageiros.

## Code API

O marco visual é controlado por `progress`; `current` e `total` permitem apresentar a razão real.

## Do Not Use

Não usar para etapas sequenciais ou progresso indeterminado.

## Tests

Validar marcos, razão, estado completo, conteúdo opcional e semântica da barra.

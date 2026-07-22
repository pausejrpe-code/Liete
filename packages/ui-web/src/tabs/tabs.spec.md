# Component Spec: Tabs

## Objective

Alternar entre seções equivalentes sem mudar o contexto principal.

## Anatomy and variants

- Lista de tabs e indicador da tab ativa.
- `underline`: espaçamento de 24 px e indicador verde de 2 px.
- `pill`: espaçamento de 6 px, padding 14 × 8 px e fundo neutro na seleção.

## API

`items`, `value`, `defaultValue`, `onValueChange`, `variant` e `label`.

## Behavior and accessibility

Usa `tablist`/`tab`, seleção controlada ou não controlada, roving tabindex e navegação por setas, Home e End. Estados: default, hover, selected, focus-visible e disabled.

## Responsive

A lista preserva uma linha e permite rolagem horizontal quando necessário.

## Figma

Mapeia `Style = Underline | Pill` do nó `14:66`.

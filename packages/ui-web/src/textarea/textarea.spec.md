# Component Spec: Textarea

## Objective

Coletar descrições e observações longas com label persistente, orientação e erro textual.

## Anatomy

- Label associada ao controle.
- `<textarea>` nativo.
- Helper ou mensagem de erro conectado por `aria-describedby`.

## Variants and States

Estados `default`, `filled`, `focus`, `error` e `disabled`. Disabled prevalece; erro pode ser inferido por `errorMessage`; preenchido, por `value` ou `defaultValue`.

## Properties

`label`, `helperText`, `errorMessage`, `showHelper`, `state` e todas as propriedades nativas de `<textarea>`, exceto `children`.

## Tokens

Usa tokens semânticos de texto, superfície, borda, foco, feedback e `component.textarea.*`.

## Content

O helper deve explicar limite ou formato. A mensagem de erro deve orientar a correção. Placeholder não substitui a label.

## Responsive Behavior

Largura-base de 360 px limitada a 100% do contêiner; altura de 112 px. Conteúdo longo rola dentro do controle.

## Accessibility

Label, descrição, erro e disabled usam semântica nativa. Erro define `aria-invalid`; foco visível permanece perceptível além da mudança de cor.

## Code API

`TextareaProps` estende atributos nativos de `<textarea>`.

## Do Not Use

Não usar para respostas curtas de uma linha; nesses casos, use `Input`.

## Tests

Validar associação label/helper, preservação do valor em erro, disabled, foco, conteúdo longo, zoom e contraste.

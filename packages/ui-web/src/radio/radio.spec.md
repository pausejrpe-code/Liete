# Component Spec: Radio

## Objective

Escolher exatamente uma alternativa dentro de um grupo.

## Anatomy

- `<input type="radio">` nativo.
- Controle visual de 20 px exportado do Figma.
- Label clicável.

## Variants

Não selecionado e selecionado, combinados com default, focus e disabled.

## Sizes

Controle de 20 px; alvo mínimo de 44 px em dispositivos de toque.

## Properties

Aceita propriedades nativas de radio, incluindo `name`, `value`, `checked` e `defaultChecked`, mais `label` e `state`.

## States

Focus reforça a borda verde; selected mostra ponto interno; disabled atenua controle e label.

## Tokens

Tipografia e espaçamento vêm de `component.choice.*`; os seis controles visuais são assets do Figma `12:91`.

## Content

Cada label deve ser curta e única dentro do grupo.

## Responsive Behavior

O contêiner do grupo decide distribuição vertical ou horizontal. Em toque, o alvo mínimo cresce sem alterar o controle visual.

## Figma

Mapeia `Selected` e `State = Default | Focus | Disabled`.

## Accessibility

Radios relacionados devem compartilhar `name` e estar dentro de `<fieldset>` com `<legend>` quando houver pergunta de grupo. Navegação e seleção seguem o comportamento nativo.

## Code API

```tsx
<Radio name="pagamento" label="Pix" value="pix" />
```

## Examples

Usar para formas de pagamento, faixas ou opções mutuamente exclusivas.

## Do Not Use

Não usar para escolhas independentes; usar `Checkbox`.

## Tests

- Exclusividade por `name`.
- Teclado, selected e disabled.
- Foco, contraste, zoom e labels longas.

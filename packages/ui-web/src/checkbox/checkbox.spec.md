# Component Spec: Checkbox

## Objective

Representar escolhas independentes ou seleção múltipla.

## Anatomy

- `<input type="checkbox">` nativo.
- Controle visual de 20 px com checkmark.
- Label clicável.

## Variants

Não marcado e marcado, combinados com default, focus e disabled.

## Sizes

Controle de 20 px; alvo mínimo de 44 px em dispositivos de toque.

## Properties

Aceita propriedades nativas de checkbox, mais `label` e `state` para documentação visual.

## States

Focus usa borda rosa; checked usa fundo verde; disabled bloqueia interação e atenua controle e texto.

## Tokens

Usa `component.choice.*` e tokens semânticos de ação, texto, superfície e foco.

## Content

A label deve descrever uma decisão afirmativa. Não esconder informação essencial em tooltip.

## Responsive Behavior

A label acompanha o conteúdo; o consumidor deve permitir quebra para textos extensos.

## Figma

Mapeia `Checked` e `State = Default | Focus | Disabled` do nó `12:61`.

## Accessibility

Semântica, foco, teclado e estado checked são nativos. O checkmark visual é oculto de tecnologias assistivas.

## Code API

```tsx
<Checkbox label="Aceito a política de cancelamento" />
```

## Examples

Usar em consentimentos opcionais ou conjuntos de escolhas independentes.

## Do Not Use

Não usar para escolher exatamente uma opção; usar `Radio`.

## Tests

- Alternância por clique, Espaço e label.
- Checked e disabled nativos.
- Foco, contraste, zoom e labels longas.

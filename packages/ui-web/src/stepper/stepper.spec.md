# Component Spec: Stepper

## Objective

Incrementar ou decrementar valores pequenos e discretos, como quantidade de passageiros.

## Anatomy

- Label do grupo.
- Botão de decremento.
- `<output>` com valor atual.
- Botão de incremento.

## Variants

| Size | Botões | Caixa de valor | Contexto |
| --- | --- | --- | --- |
| `sm` | 32 px | 52 × 36 px | Interfaces compactas |
| `md` | 38 px | 64 × 44 px | Formulários com maior destaque |

## Sizes

Os botões preservam alvo mínimo de 44 px em dispositivos de toque.

## Properties

| Property | Type | Default | Behavior |
| --- | --- | --- | --- |
| `value` | `number` | — | Modo controlado |
| `defaultValue` | `number` | `2` | Valor inicial não controlado |
| `min` / `max` | `number` | `0` / infinito | Limites inclusivos |
| `step` | `number` | `1` | Incremento aplicado |
| `disabled` | `boolean` | `false` | Desabilita os dois botões |
| `onValueChange` | `(value) => void` | — | Notifica alterações |

## States

Default, hover, pressed, focus-visible, limite mínimo/máximo e disabled. Limites desabilitam apenas o botão indisponível; disabled global atenua todo o controle.

## Tokens

Usa `component.stepper.*`, tokens semânticos de ação e tipografia Highlight/MD.

## Content

A label deve nomear a unidade contada. O domínio deve validar limites relevantes.

## Responsive Behavior

Abraça o conteúdo. Em toque, os botões aumentam para 44 px sem reduzir a legibilidade.

## Figma

Mapeia `Size = Small | Medium` e `State = Default | Disabled` do nó `14:43`.

## Accessibility

O controle forma um grupo nomeado. Botões possuem nomes explícitos, respeitam limites com `disabled`, aceitam teclado nativo e o valor é anunciado por `aria-live`.

## Code API

```tsx
<Stepper label="Passageiros" min={1} max={8} />
```

## Examples

Usar para quantidades pequenas com passo previsível.

## Do Not Use

Não usar para valores contínuos, grandes intervalos ou entrada monetária; usar input apropriado.

## Tests

- Incremento, decremento e modo controlado.
- Limites e disabled.
- Teclado, foco, anúncio do valor e touch target.

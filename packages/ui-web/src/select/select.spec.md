# Component Spec: Select

## Objective

Permitir a seleção única de uma opção com label persistente, helper e validação.

## Anatomy

- Campo visual com label, valor e caret exportado do Figma.
- `<select>` nativo cobrindo toda a área interativa.
- Helper ou mensagem corretiva conectado por `aria-describedby`.

## Variants

Uma única variante estrutural; as diferenças são representadas por estado e conteúdo.

## Sizes

Largura-base de 263 px e altura de 60 px. O caret possui 24 px.

## Properties

| Property | Type | Default | Behavior |
| --- | --- | --- | --- |
| `label` | `string` | `Tipo de passeio` | Nome visível e acessível |
| `helperText` | `string` | `Escolha uma opção` | Orientação persistente |
| `errorMessage` | `string` | — | Ativa erro semântico e mensagem corretiva |
| `state` | `FormFieldState` | Inferido | Força uma variante para documentação |
| `placeholder` | `string` | `Selecione` | Opção vazia e valor visual durante o foco |

As demais propriedades de `<select>`, exceto `size`, são aceitas.

## States

Default usa label grande; focus e filled mostram label compacta e valor; error usa borda e conteúdo vermelhos; disabled bloqueia a seleção nativamente.

## Tokens

Consome tokens `component.field.*`, `component.select.*` e cores semânticas. Os carets são assets do Figma `12:31`.

## Content

Usar labels curtas e opções inequívocas. Não usar o placeholder como única label.

## Responsive Behavior

A largura pode ser alterada com `--component-select-width`. O valor selecionado é truncado visualmente, permanecendo completo no `<select>` nativo.

## Figma

Mapeia `State = Default | Focus | Error | Disabled | Filled`; o foco real é controlado pelo navegador.

## Accessibility

Usa `<select>` nativo, navegação por teclado, nome acessível, `aria-invalid`, descrição conectada e foco visível independente da cor do estado.

## Code API

```tsx
<Select label="Tipo de passeio">
  <option value="bate-volta">Bate-volta</option>
</Select>
```

## Examples

Usar para listas curtas e conhecidas de seleção única.

## Do Not Use

Não usar para seleção múltipla, busca avançada ou listas muito extensas; nesses casos, escolher controles especializados.

## Tests

- Seleção nativa por teclado e ponteiro.
- Associação entre label, helper e erro.
- Estados disabled e focus-visible.
- Labels e opções longas, zoom e contraste.

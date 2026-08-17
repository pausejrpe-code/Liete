# Component Spec: Form fields

## Objective

Coletar texto, localização, data e valor monetário com label persistente, helper e feedback de validação.

## Anatomy

- `<label>` visível e associado ao controle.
- `<input>` nativo para edição, teclado e tecnologias assistivas.
- Helper ou mensagem de erro conectado por `aria-describedby`.

## Variants

| Component | Purpose | Native input mode |
| --- | --- | --- |
| `Input` | Texto comum ou localização | Textual |
| `DateInput` | Data com apresentação brasileira | Numeric |
| `MoneyInput` | Valor monetário formatado pelo consumidor | Decimal |

## Sizes

Altura de 60 px, largura-base de 200 px, raio de 12 px e padding 8/12. A classe externa pode alterar a largura.

## Properties

| Property | Type | Default | Behavior |
| --- | --- | --- | --- |
| `label` | `string` | Conforme o componente | Nome visível e acessível |
| `helperText` | `string` | `Obrigatório` | Orientação persistente |
| `errorMessage` | `string` | — | Ativa erro semântico quando `state` não foi forçado |
| `state` | `FormFieldState` | Inferido | Permite documentar as variantes do Figma |
| `hideHelperText` | `boolean` | `false` | Oculta o helper sem remover a label |
| `inputType` | `email \| password \| tel \| text` | `text` | Preserva o tipo nativo sem alterar a anatomia do campo |
| `disabled` | `boolean` | `false` | Desabilita o input nativo |

As demais propriedades nativas de `<input>`, exceto `type` e `size`, são aceitas. Use `inputType` para escolher um tipo nativo suportado.

## States

| State | Visual treatment | Behavior | Semantics |
| --- | --- | --- | --- |
| Default | Borda neutra | Editável | Input nativo |
| Focus | Borda verde e foco rosa para teclado | Recebe entrada | `:focus-visible` |
| Filled | Label compacta e valor primário | Editável | Valor nativo |
| Error | Borda, conteúdo e helper vermelhos | Permanece editável | `aria-invalid=true` |
| Disabled | Conteúdo e borda atenuados | Sem edição | `disabled` nativo |

Disabled prevalece sobre estados inferidos. Erro é inferido por `errorMessage`; preenchido, por `value` ou `defaultValue`.

## Tokens

Usa tokens semânticos `color.text`, `color.feedback`, `color.action` e tokens `component.field.*`, derivados dos nós Figma `7:180`, `94:111` e `94:135`.

## Content

Labels devem ser curtas e persistentes. Mensagens de erro devem explicar a correção. Máscara e formatação de data ou dinheiro pertencem à camada de produto e podem ser conectadas via propriedades nativas.

## Responsive Behavior

A largura-base é 200 px. Formulários responsivos podem definir `--component-field-width: 100%` no contêiner. Textos longos não devem ser truncados quando forem essenciais.

## Accessibility

Label, descrição, erro, foco visível e disabled usam semântica nativa. O foco por teclado mantém contorno independente da cor do estado. Inputs de data e dinheiro solicitam teclados móveis adequados sem impedir tecnologias de máscara.

## Code API

```tsx
<Input label="Nome do passeio" />
<DateInput label="Data da viagem" />
<MoneyInput label="Valor" />
```

## Do Not Use

Não usar `DateInput` como calendário completo nem `MoneyInput` como responsável por moeda, arredondamento ou regras financeiras.

## Tests

- Associação entre label, input e helper.
- Erro anunciado por `aria-invalid` e descrição.
- Disabled nativo.
- Teclados móveis adequados.
- Foco, contraste, zoom, labels longos e responsividade em teste visual.

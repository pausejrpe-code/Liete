# Component Spec: JourneyNavigation

## Objective

Agrupar as ações anterior e principal no rodapé de jornadas mobile, com prioridade visual clara e alvos de toque acessíveis.

## Anatomy

- Rodapé branco.
- Botão ghost para voltar.
- Botão primário com largura estável.

## Variants

| Variante | Objetivo | Usar quando | Evitar quando |
| --- | --- | --- | --- |
| Padrão | Encerrar naturalmente o conteúdo. | Páginas com ações ao final. | Ações precisam permanecer sempre visíveis. |
| `sticky` | Permanecer na base depois de alcançar o rodapé. | Formulários longos no mobile. | Modais ou conteúdos com outro rodapé fixo. |

## Sizes

Largura máxima de 393 px, altura mínima de 164 px, padding de 16 px e ação principal de 135 px.

## Properties

`backLabel`, `primaryLabel`, `backDisabled`, `primaryDisabled`, `onBack`, `onPrimaryAction`, `primaryType` e `sticky`.

## States

Botões herdam default, hover, pressed, focus-visible e disabled do `Button`. O modo sticky adiciona separação visual superior.

## Tokens

Usa `Button`, tokens de superfície, borda, espaçamento e `component.journeyNavigation.*`.

## Content

Labels devem ser verbos claros. A ação principal pode mudar para refletir continuação, confirmação ou publicação.

## Responsive Behavior

Abaixo de 360 px, as duas ações dividem igualmente a largura disponível.

## Figma

Mapeia `Nav_Botton`, nó `347:246`, e reutiliza o componente `Button` do nó `7:61`.

## Accessibility

Usa `<footer>` nomeado e botões nativos. Alvos touch têm no mínimo 44 px em ponteiros coarse. Disabled utiliza semântica nativa.

## Code API

`JourneyNavigationProps` estende atributos nativos de `<footer>` e permite que a ação principal seja `type="submit"`.

## Examples

Use `primaryType="submit"` dentro de formulários e altere `primaryLabel` para “Publicar excursão” na etapa final.

## Do Not Use

Não usar como navegação global, tabs ou barra de ações de tabela.

## Tests

Validar clique, submit, disabled, sticky, labels longas, foco, teclado, zoom, largura reduzida e forced colors.

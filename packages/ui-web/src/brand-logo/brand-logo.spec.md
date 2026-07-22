# Component Spec: Brand Logo

## Objective

Aplicar o logotipo completo da Liete com proporção, construção e cores oficiais preservadas.

## Anatomy and variants

Lockup horizontal vetorial composto pelas sete partes exportadas do Figma. `tone` aceita `default`, `green` e `pink`.

## API

`tone`, `width`, `label` e `decorative`, além de atributos nativos de `span`. O canvas mantém a razão original de 993 × 388 e limita-se à largura disponível.

## Behavior and accessibility

Por padrão expõe uma imagem nomeada “Liete”. Em links para a página inicial, o link deve receber o nome da navegação e o logo pode ser decorativo. Não repetir “logo” no texto alternativo.

## Responsive and content

Escala proporcionalmente sem trocar a composição. Não recompor letras, alterar espaçamento, esticar, aplicar contornos, sombras ou cores não oficiais.

## Figma

Mapeia `Property 1 = Default | Green | Pink` do nó `194:744` e usa somente os SVGs exportados desse componente.

## Status and tests

Status `stable`. Testar três tons, largura responsiva, sete partes, nome acessível, uso decorativo e regressão visual em diferentes densidades.

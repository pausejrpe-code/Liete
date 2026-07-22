# Component Spec: Gallery

## Objective

Apresentar uma coleção visual da viagem com uma imagem principal ou distribuição uniforme.

## Anatomy and variants

`hero`: imagem principal de 388 × 312 px e quatro miniaturas; a última informa fotos restantes. `grid`: quatro células uniformes em 724 × 156 px.

## API

`layout`, `images`, `remainingCount` e `label`.

## Behavior and accessibility

Usa semântica de lista, alternativas individuais nas imagens e texto explícito para a quantidade restante.

## Responsive

No mobile, Hero empilha a principal sobre a grade 2 × 2; Grid torna-se 2 × 2.

## Figma

Mapeia `Layout = Hero | Grid` do nó `16:210`.

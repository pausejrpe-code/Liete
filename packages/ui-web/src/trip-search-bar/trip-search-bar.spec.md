# Component Spec: Trip Search Bar

## Objective

Reunir destino, data, saída e quantidade de viajantes em uma busca única de viagens.

## Anatomy and variants

Compõe `Input`, `DateInput`, `Select` e `Button`. `layout` aceita `desktop` e `mobile`; `state` aceita `default`, `focused` e `filled` para documentação dos estados do Figma.

## Behavior and accessibility

Usa formulário e controles nativos com labels persistentes. Enter ou o botão envia um objeto tipado com os quatro valores. Foco individual permanece visível e a ordem segue a leitura.

## Responsive

Desktop ocupa até 980 px. Mobile ocupa até 360 px e empilha campos e CTA. O desktop também reorganiza automaticamente abaixo de 760 px.

## Figma

Mapeia `Layout = Desktop | Mobile` e `State = Default | Focused | filled` do nó `17:65`, reutilizando os componentes de formulário do Design System.

## Tests

Labels e elementos nativos, envio tipado, estados, dois layouts, teclado, zoom e regressão visual responsiva.

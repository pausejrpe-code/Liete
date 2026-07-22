# Component Spec: Rating

## Objective

Exibir avaliação média e, quando útil, o volume de avaliações.

## Anatomy and variants

Cinco estrelas em tom warning, score e contagem opcionais. Tamanhos `sm` e `md`; labels `none`, `score` e `score-count`.

## API

`value`, `max`, `count`, `size`, `labelMode` e `locale`.

## Behavior and accessibility

É somente leitura, limita o valor ao intervalo e fornece nome acessível completo mesmo sem label visual.

## Figma

Mapeia `Size = Small | Medium` e `Label = None | Score | Score and count` do nó `16:182`.

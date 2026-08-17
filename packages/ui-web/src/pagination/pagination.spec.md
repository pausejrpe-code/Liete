# Component Spec: Pagination

## Objective

Navegar entre páginas de listagens administrativas e comunicar a posição atual.

## Anatomy

- Resumo opcional de resultados.
- Ação de página anterior.
- Rótulo de página atual e total.
- Ação de próxima página.

## Variants

`responsive`, `desktop` e `mobile`. A posição `first`, `middle` ou `last` é derivada dos valores numéricos e exposta em `data-position`.

## Properties

`currentPage`, `totalPages`, `resultsLabel`, `showResults`, `layout` e `onPageChange`.

## States

Anterior fica desabilitado na primeira página e próximo na última. Foco permanece visível nos controles disponíveis.

## Tokens

Usa superfície padrão, radius 12, espaçamentos 8/16, tipografia Body/SM e Label/MD, além de largura e ícone próprios.

## Responsive Behavior

Desktop tem até 720 px; mobile até 360 px. Abaixo de 360 px, resumo e navegação são empilhados.

## Figma

Mapeia `Pagination` (`240:807`) com `Layout` e posições First, Middle e Last.

## Accessibility

Usa `nav` nomeado, botões nativos com nomes acessíveis, estados disabled reais e rótulo textual da página.

## Code API

O componente recebe números reais e solicita mudanças por `onPageChange`, sem possuir o estado da página consumidora.

## Do Not Use

Não usar para carrosséis nem como substituto de carregamento incremental.

## Tests

Validar limites, callbacks, nomes acessíveis, layout e expansão de conteúdo.

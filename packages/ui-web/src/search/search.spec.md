# Component Spec: Search

## Objective

Permitir uma busca rápida por destinos com ação habilitada somente quando houver consulta.

## Anatomy and API

Formulário de busca, lupa decorativa, input rotulado e botão. Aceita valor controlado ou inicial, callbacks de alteração e busca, placeholder e labels.

## Behavior and accessibility

Usa `role=search`, `input type=search`, label persistente para leitores de tela e botão nativo. Enter envia a consulta; valor vazio mantém a ação desabilitada.

## Responsive

Ocupa até 631 px e reduz gaps e tipografia abaixo de 520 px sem remover a ação.

## Figma

Mapeia os estados vazio e preenchido do nó `96:132`, incluindo o asset local `MagnifyingGlass/Regular`.

## Tests

Semântica, estado disabled, digitação, envio por botão/teclado, valor controlado e regressão visual responsiva.

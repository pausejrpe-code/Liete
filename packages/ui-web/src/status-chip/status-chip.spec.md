# Component Spec: StatusChip

## Objective

Comunicar estados operacionais compactos em viagens, reservas e parceiros.

## Anatomy

- Ponto de status exportado do Figma.
- Rótulo textual obrigatório.

## Variants

`available`, `pending`, `confirmed`, `cancelled`, `soldOut` e `verified`, nos tamanhos `small` e `medium`.

## Properties

`intent`, `size` e `label`. O rótulo padrão é derivado do intent e pode ser substituído sem perder o tratamento semântico.

## States

É informativo e não possui estados interativos. Mudanças dinâmicas importantes podem adicionar `role="status"` no uso.

## Tokens

Usa tokens semânticos `color.status.*`, tipografia Label/SM ou Label/MD, raio full e espaçamentos próprios do componente.

## Responsive Behavior

Abraça o conteúdo e não quebra o rótulo. O container consumidor controla wrap entre chips.

## Figma

Mapeia `StatusChip` (`102:289`) com `Intent` e `Size`.

## Accessibility

O significado é sempre textual; o ponto é decorativo e oculto de tecnologias assistivas.

## Code API

`StatusChipProps` estende atributos nativos de `span`.

## Do Not Use

Não usar como botão, filtro selecionável ou único anúncio de uma mudança crítica.

## Tests

Validar rótulos, intents, tamanhos, ativos exportados e contraste.

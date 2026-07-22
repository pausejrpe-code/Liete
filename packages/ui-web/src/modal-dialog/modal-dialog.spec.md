# Component Spec: Modal Dialog

## Objective

Solicitar confirmação ou decisão sem perder o contexto atual.

## Anatomy and variants

Título, mensagem e ações alinhadas à direita. Tamanhos `sm` (420 px) e `md` (560 px); intents `default` e `destructive`.

## API

`open`, `title`, `children`, `size`, `intent`, labels de ação, `onClose`, `onConfirm` e `presentation`. `inline` existe apenas para documentação e pré-visualização.

## Behavior and accessibility

Em produção usa `<dialog>` modal nativo, nome e descrição associados, fechamento via Escape controlado por `onClose`, foco e bloqueio de interação fornecidos pelo navegador. A ação destrutiva usa botões semânticos vermelhos.

## Responsive

Respeita 32 px de margem lateral; em telas estreitas as ações ocupam a largura e empilham.

## Figma

Mapeia `Size = Small | Medium` e `Intent = Default | Destructive` do nó `14:104`.

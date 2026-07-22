# Component Spec: Toast / Alert

## Objective

Comunicar feedback contextual de informação, sucesso, atenção ou erro.

## Anatomy and variants

Ícone oficial de 24 px em container de 28 px, título, mensagem e fechamento opcional. `toast` possui conteúdo de 250 px e botão fechar; `inline` possui conteúdo de 430 px.

## API

`format`, `tone`, `title`, `message` e `onDismiss`.

## Behavior and accessibility

Info e sucesso usam `status`; atenção e erro usam `alert`. O botão de fechar possui nome acessível e alvo ampliado em toque.

## Responsive

As larguras são máximas e se ajustam ao viewport sem truncar conteúdo.

## Figma

Mapeia `Format = Toast | Inline` e `Type = Info | Success | Warning | Error` do nó `16:113`.

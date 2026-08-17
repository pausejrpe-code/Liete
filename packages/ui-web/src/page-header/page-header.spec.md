# Component Spec: PageHeader

## Objective

Apresentar o contexto de uma página administrativa e suas ações principais em um cabeçalho responsivo.

## Anatomy

- Ação opcional de retorno.
- Título semântico configurável.
- Subtítulo opcional.
- Grupo opcional com ação secundária e ação primária.

## Variants

| Variant | Purpose | Use when | Avoid when |
| --- | --- | --- | --- |
| `responsive` | Alterna automaticamente entre as composições | Páginas reais | Capturas com dimensão fixa |
| `desktop` | Mantém conteúdo e ações lado a lado | Documentação desktop | Containers estreitos |
| `mobile` | Empilha o contexto e divide as ações igualmente | Documentação e previews mobile | Layouts desktop |

## Sizes

Desktop: até 1200 px de largura. Mobile: até 360 px de largura. O componente aceita containers menores sem provocar rolagem horizontal.

## Properties

`title`, `subtitle`, `headingLevel`, `layout`, rótulos e callbacks das três ações, além dos controles `showBack`, `showSubtitle`, `showSecondaryAction` e `showPrimaryAction`.

## States

Os estados de hover, foco, pressionado e desabilitado pertencem ao `Button` reutilizado. O `PageHeader` controla apenas presença, conteúdo e arranjo das ações.

## Tokens

Consome tokens semânticos de superfície e texto, tipografia de heading/body/title, `radius.12`, espaçamentos 8, 16 e 24, além das larguras de referência próprias do componente.

## Content

Usar um título curto e específico. O subtítulo deve explicar o escopo da página em uma frase. A ação primária descreve o próximo passo mais importante; a secundária não deve competir visualmente com ela.

## Responsive Behavior

Acima de 680 px, o conteúdo cresce e as ações permanecem alinhadas à base. Em até 680 px, o bloco é empilhado, o heading muda de 32/36 para 24/30 e as ações visíveis dividem a largura disponível.

## Figma

Mapeia o componente `PageHeader` (`236:760`) e suas instâncias desktop (`236:6`) e mobile (`236:17`).

## Accessibility

Usa `header`, heading real entre `h1` e `h3`, botões nativos e um grupo nomeado para as ações. A seta de retorno é decorativa e não altera o nome acessível do botão.

## Code API

`PageHeaderProps` estende atributos nativos de `header`, omitindo `title` para evitar conflito com o título visual.

## Examples

Use em páginas de excursões, reservas, vendas e repasses. Conecte os callbacks à navegação e às regras da aplicação consumidora.

## Do Not Use

Não usar como cabeçalho global de navegação, hero promocional ou substituto de breadcrumbs complexos.

## Tests

Validar hierarquia do heading, nomes acessíveis, variantes e tamanhos dos botões reutilizados, callbacks, propriedades de visibilidade e contratos de layout.

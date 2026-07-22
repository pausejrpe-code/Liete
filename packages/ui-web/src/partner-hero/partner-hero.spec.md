# Component Spec: PartnerHero

## Objective

Apresentar a proposta de valor para organizadores e conduzir à ação principal sem misturar regras de cadastro no componente.

## Anatomy

- Eyebrow com ícone decorativo.
- Título com trecho de destaque semântico.
- Descrição curta.
- `Button` primário.
- Ilustração decorativa original do Figma.

## Variants

| Variant | Purpose | Use when | Avoid when |
| --- | --- | --- | --- |
| `responsive` | Adapta-se à viewport | Uso em páginas reais | Capturas com dimensão fixa |
| `desktop` | Preserva a composição Web | Documentação desktop | Containers estreitos |
| `mobile` | Preserva a composição Mobile | Documentação e previews mobile | Layouts desktop |

## Sizes

Desktop: até 1202 × 439 px. Mobile: até 390 px, com conteúdo e arte empilhados.

## Properties

`eyebrow`, `heading`, `highlightedHeading`, `description`, `actionLabel`, `onAction`, `headingLevel` e `layout`.

## States

O hero é estático. Hover, foco, pressionado e desabilitado pertencem ao `Button` aninhado.

## Tokens

Consome tokens semânticos de texto e superfície, tipografia de heading/body, `radius.24`, espaçamentos e `shadow.overlay`.

## Content

Usar uma frase curta por trecho do título e descrição de até três linhas. O texto deve continuar compreensível sem a ilustração.

## Responsive Behavior

Em até 680 px, conteúdo e arte são empilhados; o título muda de 32/36 para 24/30 e a ação permanece acessível.

## Figma

Mapeia `Property1 = Web | Mobile` do nó `221:399`. Os ativos são exportações originais e locais.

## Accessibility

Título semântico configurável entre `h1` e `h3`; ação é um botão nativo; toda a arte é decorativa e ignorada por leitores de tela.

## Code API

`PartnerHeroProps` estende atributos de `section`, omitindo o atributo nativo `title` para evitar ambiguidade.

## Examples

Use em uma landing page para aquisição de organizadores, ligando `onAction` ao fluxo de cadastro ou reserva.

## Do Not Use

Não usar como banner informativo genérico nem inserir conteúdo essencial dentro da ilustração.

## Tests

Validar título e CTA acessíveis, callback da ação, modos de layout, expansão de conteúdo, contraste e ausência da arte decorativa na árvore acessível.

# Component Spec: BannerHero

## Objective

Comunicar a principal proposta de descoberta de viagens com imagem imersiva, mensagem curta e ação direta.

## Anatomy

- Imagem de fundo configurável.
- Overlay de contraste responsivo.
- Título, descrição e `Button` primário.

## Variants

| Variant | Purpose | Use when | Avoid when |
| --- | --- | --- | --- |
| `responsive` | Adapta-se à viewport | Uso em páginas reais | Capturas fixas |
| `desktop` | Preserva a composição Web | Documentação desktop | Containers estreitos |
| `mobile` | Preserva a composição Mobile | Documentação mobile | Layouts desktop |

## Sizes

Desktop: até 1200 × 460 px. Mobile: até 390 × 620 px.

## Properties

`heading`, `description`, `actionLabel`, `imageSrc`, `imageAlt`, `onAction`, `headingLevel` e `layout`.

## States

O container é estático. Os estados interativos são fornecidos pelo `Button` reutilizado.

## Tokens

Consome tipografia de display/heading/body, cor de texto inversa, espaçamento 24 e raio 24.

## Content

Título recomendado em até duas linhas no desktop e três no mobile. A descrição deve permanecer legível sobre a fotografia.

## Responsive Behavior

No desktop, o contraste cresce da direita para a esquerda. No mobile, o overlay escurece a base e o conteúdo é ancorado abaixo.

## Figma

Mapeia `Property1 = Web | Mobile` do nó `222:92`. A fotografia é o arquivo original exportado do Figma.

## Accessibility

Permite escolher o nível do heading. `imageAlt` descreve imagens informativas e pode ser vazio quando a fotografia for decorativa. A ação é um botão nativo com foco visível.

## Code API

`BannerHeroProps` estende atributos de `section`, com conteúdo e mídia configuráveis e sem acoplar navegação ou regras de negócio.

## Examples

Use como hero principal de descoberta. Passe `onAction` para abrir busca, catálogo ou fluxo de reserva.

## Do Not Use

Não usar para alertas, promoções temporárias ou imagens cuja área de contraste impeça a leitura do texto.

## Tests

Validar heading, nome da imagem, CTA, callback, modos de layout, conteúdo longo, zoom, contraste e foco por teclado.

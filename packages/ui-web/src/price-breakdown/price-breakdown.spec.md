# Component Spec: PriceBreakdown

## Objective

Explicar de forma transparente a composição do preço por passageiro e o valor final pago.

## Anatomy

- Superfície única com borda, raio de 12 px e padding de 24 px.
- Cabeçalho com título, subtítulo e status opcional.
- Divisor entre cabeçalho e composição.
- Lista semântica de custos, ganho, subtotal, taxa de pagamento opcional e taxa da plataforma.
- Bloco de total destacado e helper opcional.

## Variants

| Variante | Objetivo | Usar quando | Evitar quando |
| --- | --- | --- | --- |
| `regular` | Apresentar o resumo em 560 px e título de 24 px. | Painéis, formulários e áreas de conteúdo amplas. | O contêiner tiver largura compacta persistente. |
| `compact` | Apresentar o resumo em 320 px e título de 20 px. | Colunas laterais e telas estreitas. | Houver espaço para a leitura mais confortável do layout regular. |

## Sizes

| Tamanho | Dimensões/tokens | Contexto |
| --- | --- | --- |
| `regular` | `component.priceBreakdown.width.regular` (560 px) | Desktop e grids amplos. |
| `compact` | `component.priceBreakdown.width.compact` (320 px) | Mobile e colunas compactas. |

## Properties

| Propriedade | Tipo | Padrão | Comportamento |
| --- | --- | --- | --- |
| `layout` | `"regular" \| "compact"` | `"regular"` | Controla largura e tipografia do título. |
| `title`, `subtitle` | `string` | Textos do componente | Personalizam o cabeçalho. |
| `costAmount`, `profitAmount`, `subtotalAmount`, `feeAmount`, `totalAmount` | `string` | Valores de exemplo | Recebem valores monetários já formatados. |
| `cardFeeAmount` | `string` | Ausente | Inclui a taxa de pagamento antes da taxa da plataforma. |
| `cardFeeLabel` | `string` | `"Taxa do cartão"` | Nomeia a taxa de pagamento opcional. |
| `showHelper` | `boolean` | `true` | Exibe ou oculta o texto auxiliar. |
| `helperText` | `string` | Texto de publicação | Personaliza a explicação final. |
| `showStatus` | `boolean` | `false` | Compõe `StatusChip` ao lado do título para usos de produto. |

## States

Componente informativo e sem interação própria. Suporta conteúdo padrão e partes opcionais; estados de hover, foco, pressed, disabled, loading e error não se aplicam.

## Tokens

Usa tokens semânticos de superfície, borda, texto e sucesso; tipografia `heading.md`, `heading.sm`, `heading.lg`, `body.sm` e `label.sm`; espaçamentos 8, 12, 16 e 24; raios 8 e 12; e `component.priceBreakdown.width.*`.

## Content

Valores devem chegar formatados pela camada de produto. A porcentagem da taxa exibida deve corresponder ao cálculo fornecido. Rótulos podem quebrar linha, mas valores monetários permanecem inteiros e alinhados à direita.

## Responsive Behavior

Larguras limitadas a 100% do contêiner. A variante compacta preserva o padding de 24 px na largura canônica de 320 px. Abaixo de 280 px, o componente reduz o padding e empilha o total para não ocultar conteúdo.

## Figma

Nó `242:868`, modo `Final`, com variantes `Default` e `Compact`. A implementação corresponde à superfície única, ao divisor após o cabeçalho, ao gap de 24 px entre composição e resumo e ao total com altura mínima de 68 px. `regular` mapeia para `Default`; `compact`, para `Compact`.

## Accessibility

Seção com `<h2>`, composição em `<dl>` e pares `<dt>/<dd>`. O divisor é decorativo e oculto da árvore de acessibilidade. A informação financeira não depende apenas de cor, e o conteúdo continua disponível com zoom e em larguras reduzidas.

## Code API

`PriceBreakdownProps` estende atributos nativos de `section`. O componente apenas apresenta dados; cálculo, moeda, arredondamento e regras de negócio permanecem na camada de produto.

## Examples

- Resumo final sem taxa de cartão, equivalente ao exemplo canônico do Figma.
- Simulação da jornada com taxa de cartão de 5%, taxa da plataforma de 15% e preço final calculado.

## Do Not Use

Não usar para executar cálculos, arredondamento ou regras fiscais; o componente apresenta valores já calculados.

## Tests

Validar rótulos/valores, ordem da composição, formatos longos, variantes, status, helper, responsividade, zoom, contraste e forced colors.

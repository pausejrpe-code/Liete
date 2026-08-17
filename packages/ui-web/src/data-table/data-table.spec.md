# Component Spec: DataTable

## Objective

Listar excursões e outros registros administrativos com leitura responsiva, ações e estados de sistema.

## Anatomy

- Toolbar com título e `Button` ghost opcional.
- Tabela semântica desktop ou cartões mobile.
- `StatusChip` por registro.
- `Button` ghost opcional por linha.
- `Pagination` opcional.
- Estado vazio com ação primária.
- Estado carregando composto com `Skeleton`.

## Variants

Layouts `responsive`, `desktop` e `mobile`; estados `default`, `empty` e `loading`.

## Properties

Dados em `rows`, incluindo destino, saída, vagas, ingresso e rótulo de status; textos configuráveis; controles de visibilidade; callbacks de ação e paginação; `headingLevel`, `layout` e `state`.

## States

Default apresenta os registros, Empty explica o próximo passo e Loading anuncia o carregamento sem expor conteúdo falso.

## Tokens

Usa superfície default/muted, border neutral 200, radius 8/12, tipografia Title/Label/Body e dimensões próprias.

## Responsive Behavior

Desktop tem até 1200 px com seis colunas informativas e ação opcional. Em até 900 px, ocupa toda a largura disponível e troca a tabela por cartões empilhados, sem rolagem horizontal.

## Figma

Mapeia `DataTable` (`249:1030`) e reutiliza `Pagination` (`240:807`), `StatusChip` (`102:289`) e `Button` (`7:61`).

## Accessibility

Usa section nomeada por heading, tabela com headers reais, lista semântica no mobile, botões nativos, status textuais, `aria-busy` e anúncio do carregamento.

## Code API

O componente recebe registros tipados e emite ações; busca, ordenação, persistência e regras de permissão ficam na aplicação.

## Do Not Use

Não usar para planilhas editáveis, grids com centenas de colunas ou dados sem estrutura tabular.

## Tests

Validar semântica desktop/mobile, mapeamento de status, callbacks, paginação, estados vazio/carregando e conteúdo expandido.

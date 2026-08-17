# Component Spec: Sidebar

## Objective

Oferecer navegação persistente para áreas administrativas em layouts condensado, aberto e mobile.

## Anatomy

- Contêiner `<nav>` com nome acessível.
- Lista de destinos.
- Indicador do destino atual.
- Ícone exportado do Figma.
- Label visível nos layouts abertos.

## Variants

| Layout | Purpose | Behavior |
| --- | --- | --- |
| `collapsed` | Navegação desktop econômica | Exibe apenas ícones |
| `expanded` | Navegação desktop descritiva | Exibe ícone e label |
| `mobile` | Painel mobile | Exibe a lista completa em 390 px |
| `mobileBar` | Barra mobile compacta | Exibe somente o destino atual |

## Properties

`layout`, `items`, `itemHrefs`, `activeItemId`, `ariaLabel` e `onItemSelect`. Cada item aceita `id`, `label`, `href` e um slot `icon`. `itemHrefs` permite que a aplicação substitua rotas sem recriar os itens e ícones padrão.

## States

Destino atual usa `aria-current="page"`, superfície muted e indicador verde. Hover, pressed e foco visível são definidos para ponteiro e teclado.

## Tokens

Usa tokens semânticos de texto, ação, superfície, borda e `component.sidebar.*`.

## Content

Labels devem ser únicas, curtas e orientadas ao destino. Os textos `Lavebel` das histórias reproduzem os placeholders do Figma e devem ser substituídos no produto.

## Responsive Behavior

Desktop possui altura de referência de 828 px. O painel mobile mede 390 × 245 px, limitado a 100% do contêiner. A barra compacta ocupa a largura mobile e mostra apenas o item ativo.

## Figma

Mapeia `Condensado`, `Open`, `Mobile` e `Variant4` do nó `261:356` para `collapsed`, `expanded`, `mobile` e `mobileBar`.

## Accessibility

Usa `<nav>`, `<ul>`, links ou botões nativos. Destinos icon-only recebem nome por `aria-label`; ícones são decorativos; o item atual usa `aria-current`; alvos touch têm pelo menos 44 px.

## Code API

`SidebarProps` estende atributos nativos de `<nav>`. Itens com `href` geram links; sem `href`, geram botões.

## Examples

Use `activeItemId` para refletir a rota atual e forneça labels únicas no produto.

## Do Not Use

Não usar como menu de ações contextuais, breadcrumb ou navegação global de marketing.

## Tests

Validar as quatro apresentações, item atual, seleção, links/botões, nomes acessíveis, foco, teclado, zoom, labels longas e alto contraste.

# Component Spec: Brand Icon

## Objective

Representar o símbolo institucional da Liete em aplicações compactas nas quais o logotipo completo não cabe.

## Anatomy and variants

Canvas quadrado com o símbolo `e` centralizado. `tone` aceita `default`, `green` e `pink`, usando exclusivamente os SVGs oficiais do Figma.

## API

`tone`, `size`, `label` e `decorative`, além de atributos nativos de `span`. O tamanho padrão vem do token `component.brandIcon.size` e pode ser sobrescrito sem alterar a proporção.

## Behavior and accessibility

Por padrão expõe uma imagem nomeada “Liete”. Use `decorative` somente quando texto adjacente já identificar a marca. Não usar este componente como ícone de ação ou navegação.

## Responsive and content

É vetorial e escala proporcionalmente. Não distorcer, rotacionar, recortar, aplicar sombra ou trocar suas cores fora das três variantes oficiais.

## Figma

Mapeia `Property 1 = Default | Green | Pink` do nó `194:773`.

## Status and tests

Status `stable`. Testar tons, tamanho customizado, nome acessível, modo decorativo e regressão visual em fundos aprovados.

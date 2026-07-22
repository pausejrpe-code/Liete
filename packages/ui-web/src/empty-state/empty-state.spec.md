# Component Spec: Empty State

## Objective

Explicar a ausência de resultados, reservas ou itens administrativos e oferecer uma próxima ação clara.

## Anatomy and variants

Título, descrição e botão principal. `context` aceita `search`, `reservations` e `admin`; toda a cópia pode ser sobrescrita.

## Behavior and accessibility

Usa uma região nomeada pelo título e descrita pelo texto de apoio. A ação é um botão nativo com foco visível e área mínima ampliada em dispositivos de toque.

## Responsive

Largura máxima de 360 px e redução do padding lateral em telas estreitas.

## Figma

Mapeia `Context = Search | Reservations | Admin` do nó `16:298`.

## Tests

Nome e descrição acessíveis, cópia de cada contexto, callback da ação e conteúdo customizado.

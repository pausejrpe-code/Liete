# Pattern Spec: TravelerShell

## Objective

Fornecer cabeçalho, navegação, acesso à conta, conteúdo principal, salto de acessibilidade e rodapé compartilhados pelas páginas do aventureiro.

## Variants

- Padrão público: reutiliza o `PublicHeader` oficial da home e mantém o rodapé da jornada.
- Autenticado: reutiliza o mesmo header, substituindo cadastro e entrada por avatar e acesso à conta.
- Compacto: logo e indicação de ambiente seguro durante o checkout.

## Properties

`authenticated`, `compact` e `children`.

## Responsive Behavior

No mobile, a navegação ocupa uma segunda linha e preserva os destinos principais. Em larguras muito estreitas, o link para organizadores é ocultado, mantendo descoberta, reservas e conta.

O fundo estrutural usa `color-background-surface-default`; tons suaves ficam restritos a cards e destaques com significado próprio.

## Accessibility

Usa header, main, footer e nav nativos, link para pular ao conteúdo, destinos semânticos e foco visível. O avatar possui nome acessível e o logotipo retorna à página inicial.

## Do Not Use

Não usar na área do organizador, que possui navegação, permissões e estrutura próprias em `OrganizerAppShell`.

# Pattern Spec: PublicHeader

## Objective

Manter a mesma identidade, navegação e ações de conta da home em todas as páginas públicas do aventureiro.

## Variants

- Público: exibe `Cadastrar` e `Entrar`.
- Autenticado: substitui as ações pelo avatar e acesso à conta.
- Home: usa âncoras locais; nas demais rotas, os mesmos links retornam às seções correspondentes da home.

## Responsive Behavior

Em telas de até 1040 px, a navegação central é ocultada e as ações de conta permanecem disponíveis. Até 760 px, `Cadastrar` é ocultado e `Entrar` preserva alvo mínimo de 44 px.

## Accessibility

Usa `header` e `nav` nativos, nome acessível no logotipo e na conta, foco visível e alvos interativos mínimos de 44 px.

## Do Not Use

Não usar no checkout, que possui cabeçalho compacto de ambiente seguro, nem na área administrativa do organizador.

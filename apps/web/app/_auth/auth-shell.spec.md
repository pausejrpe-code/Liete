# Pattern Spec: AuthShell

## Objective

Fornecer estrutura consistente para login, cadastro, recuperação, verificação e onboarding, conectada ao header público oficial.

## Anatomy

- `PublicHeader`: navegação e ações globais.
- Painel visual: contexto e confiança em desktop.
- Cabeçalho da etapa: categoria, título e orientação.
- Conteúdo: formulários e estados específicos.
- Rodapé: aviso de simulação e privacidade.

## Variants

- Padrão: painel visual e formulário lado a lado.
- `wide`: conteúdo amplo para onboarding com progresso lateral.
- Header público ou autenticado, conforme o ponto da jornada.

## Responsive Behavior

Abaixo de 820 px o painel visual é removido. Abaixo de 560 px bordas externas são eliminadas e o formulário ocupa toda a largura, com alvos mínimos de 44 px.

## Accessibility

Inclui salto para conteúdo, landmarks nativos, um único `h1`, labels persistentes, foco visível herdado do DS e texto que não depende de cor.

## Do Not Use

Não usar em dashboards ou no checkout, que possuem shells e navegação próprios.

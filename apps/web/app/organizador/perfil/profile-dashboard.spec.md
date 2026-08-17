# Jornada: Perfil do organizador

## Objetivo

Centralizar os dados gerenciais usados pela plataforma, pela operação e pela experiência pública do organizador.

## Estrutura

- Resumo da conta com identidade, status e progresso do cadastro.
- Perfil público com foto ou logo, nome, descrição e canais sociais.
- Cadastro fiscal e endereço.
- Contatos de operação, suporte e emergência.
- Dados bancários mascarados para repasse.
- Documentos e status de verificação.
- Política operacional e notificações.
- Visão estrutural de segurança e acesso.

## Comportamento

Todos os campos são locais e mockados. `Salvar alterações`, `Descartar alterações`, seleção de imagem e `Simular envio` atualizam somente o estado da página, sem upload, autenticação, pagamento ou persistência externa.

## Responsive Behavior

A página parte de uma coluna, evita rolagem horizontal e transforma campos, documentos, preferências e ações em grades maiores conforme o espaço disponível. A barra de ações permanece visível sem criar rolagem interna.

## Accessibility

As seções possuem títulos programáticos, a navegação local usa âncoras, campos preservam rótulos nativos, documentos expõem status textual, alterações são anunciadas por região viva e todos os alvos interativos mantêm pelo menos 44 px.

## Componentes do Design System

`OrganizerAppShell`, `Avatar`, `Button`, `Checkbox`, `GoalProgress`, `Input`, `MediaUploader`, `Select`, `StatusChip`, `Textarea` e `ToastAlert`.

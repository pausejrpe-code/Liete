# Critérios de Aceitação — FEAT-003: Prontidão para Produção e Dados Reais

- **Feature**: FEAT-003 (Production Readiness & Live Data Finalization)
- **Status**: `APPROVED`
- **Data**: 2026-08-17

---

## Critérios de Aceitação Verificáveis

### AC-001 (REQ-001): Middleware SSR Funcional
- Dado um usuário autenticado no sistema via `/api/auth/login`, quando ele navega entre diferentes páginas ou recarrega a aplicação (F5), os cookies de sessão devem ser renovados e mantidos no cabeçalho sem que a sessão seja encerrada.

### AC-002 (REQ-001): Proteção de Rotas Privadas
- Dado um visitante não autenticado, quando tentar acessar diretamente `/organizador/*` ou `/minhas-excursoes/`, o middleware deve redirecioná-lo para `/entrar/?returnTo=[rota]`.

### AC-003 (REQ-001): Isolamento de Papéis (RBAC)
- Dado um usuário com perfil `traveler`, quando tentar acessar a área de `/organizador/*`, deve ser redirecionado para `/minhas-excursoes/` ou exibir aviso de acesso não autorizado.

### AC-004 (REQ-002): AuthProvider Reativo
- O contexto de autenticação deve expor `user`, `profile`, `isLoading`, `signOut` e atualizar o estado de forma reativa após login ou logout.

### AC-005 (REQ-002): Cabeçalhos com Dados Reais
- Dado um usuário autenticado com o nome "Carlos Silva", o `PublicHeader` e `OrganizerAppShell` devem exibir "Carlos", as iniciais "CS" e links contextuais para o perfil correto.

### AC-006 (REQ-003): Formulários Limpos sem Mocks
- Ao acessar a página `/entrar/`, os campos de e-mail e senha devem iniciar vazios, prontos para preenchimento real pelo usuário.

### AC-007 (REQ-003): Remoção de Textos de Simulação
- Nenhum rodapé, modal ou banner em `apps/web` conterá mensagens como "Experiência simulada", "Ambiente de demonstração" ou "A aprovação será simulada".

### AC-008 (REQ-003): Estados Vazios Consistentes
- Quando o banco de dados não contiver registros para o usuário (ex: sem reservas ou sem excursões), a interface deve renderizar componentes `EmptyState` com chamadas para ação reais.

### AC-009 (REQ-004): Visão Geral do Organizador com Dados Reais
- `/organizador/` deve consultar dados reais da conta logada, calculando saldo a receber, ingressos vendidos e listando as próximas excursões cadastradas.

### AC-010 (REQ-004): Gestão de Perfil Real
- Ao editar os dados do organizador em `/organizador/perfil/` e clicar em salvar, os dados (telefone, razão social, nome fantasia, documento, bio, dados bancários) devem ser gravados em `public.organizers` e persistir após recarregamento.

### AC-011 (REQ-004): Listagem de Excursões do Organizador
- `/organizador/excursoes/` deve listar exclusivamente as excursões criadas pelo `organizer_id` logado.

### AC-012 (REQ-004): Painel Financeiro Real
- `/organizador/financeiro/` deve exibir extrato real baseado na tabela `public.orders` e `public.payouts`.

### AC-013 (REQ-004): Início de Perfil Limpo para Novo Organizador
- Um novo organizador cadastrado não deve ver dados de empresas de exemplo ("Viagens Horizonte").

### AC-014 (REQ-005): Publicação de Excursão em Banco
- Ao preencher o fluxo em `/organizador/excursoes/nova/` e clicar em publicar, a excursão deve ser inserida em `public.excursions` com slug único e status `available`.

### AC-015 (REQ-005): Redirecionamento Pós-Publicação
- Após salvar a nova excursão, o usuário deve ser redirecionado para a listagem `/organizador/excursoes/` com mensagem de sucesso.

### AC-016 (REQ-006): Catálogo Dinâmico
- A página `/excursoes/` deve exibir as excursões ativas vindas do Supabase, com suporte a filtros de destino e categoria.

### AC-017 (REQ-006): Detalhes de Excursão Conectados
- A rota `/excursoes/[slug]/` deve buscar os dados da excursão diretamente pelo slug no banco de dados.

### AC-018 (REQ-006): Home Page com Excursões Reais
- A página principal (`/`) deve carregar as excursões em destaque diretamente do banco de dados.

### AC-019 (REQ-007): Minhas Excursões do Viajante
- `/minhas-excursoes/` deve listar as compras do usuário a partir da tabela `public.orders`.

### AC-020 (REQ-007): Minha Conta do Viajante
- `/minha-conta/` deve carregar e salvar dados na tabela `public.profiles`.

### AC-021 (REQ-007): Criação de Pedido no Checkout
- O fluxo `/checkout/[slug]/` deve registrar o pedido no Supabase com participantes reais.

### AC-022 (REQ-008): Seed de Produção
- O script de seed deve popular com sucesso excursões no banco do Supabase.

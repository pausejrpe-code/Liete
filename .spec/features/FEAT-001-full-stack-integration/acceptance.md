# Critérios de Aceitação — FEAT-001: Full-Stack Integration

---

### AC-001: Schema SQL e Estrutura de Tabelas
- **Requisito**: REQ-001
- **Dado que**: As migrations Supabase são aplicadas.
- **Quando**: O banco de dados é inspecionado.
- **Então**: As tabelas `profiles`, `organizers`, `organizer_documents`, `excursions`, `orders`, `order_participants` e `payouts` existem com constraints de integridade referencial e colunas tipadas.

### AC-002: Row Level Security (RLS)
- **Requisito**: REQ-001
- **Dado que**: Um usuário comum (traveler) tenta acessar dados privados de outro usuário ou editar uma excursão de outro organizador.
- **Quando**: A query ao Supabase é executada.
- **Então**: As políticas de RLS bloqueiam a operação e retornam apenas os registros de propriedade do usuário autenticado.

### AC-003: Automação de Timestamp e Capacidade
- **Requisito**: REQ-001
- **Dado que**: Um pedido é confirmado e pago para uma excursão.
- **Quando**: O status do pedido muda para `paid`.
- **Então**: A contagem de `sold_seats` da excursão é incrementada automaticamente e o status é atualizado para `confirmed` (se `sold_seats >= minimum_group`) ou `sold_out` (se `sold_seats >= capacity`).

### AC-004: Cadastro Real de Usuário
- **Requisito**: REQ-002
- **Dado que**: O usuário preenche o formulário de cadastro com e-mail, senha e tipo de conta (`traveler` ou `organizer`).
- **Quando**: O formulário é submetido.
- **Então**: O usuário é criado no Supabase Auth, uma linha é inserida na tabela `profiles` com a role correspondente e a sessão é iniciada.

### AC-005: Login e Tratamento de Erros
- **Requisito**: REQ-002
- **Dado que**: O usuário insere credenciais no formulário de login.
- **Quando**: As credenciais forem inválidas.
- **Então**: O sistema exibe mensagem de erro adequada sem redirecionamento.
- **Quando**: As credenciais forem válidas.
- **Então**: O sistema autentica a sessão e redireciona o organizador para `/organizador/` e o viajante para `/minhas-excursoes/` ou para o destino solicitado em `returnTo`.

### AC-006: Proteção de Rotas Administrativas
- **Requisito**: REQ-002
- **Dado que**: Um usuário não autenticado ou com perfil de viajante tenta acessar diretamente rotas `/organizador/*`.
- **Quando**: A requisição é processada.
- **Então**: O sistema bloqueia o acesso e redireciona para `/entrar/?returnTo=/organizador/`.

### AC-007: Persistência do Perfil do Organizador
- **Requisito**: REQ-003
- **Dado que**: O organizador edita seus dados cadastrais, biografia ou chave Pix em `/organizador/perfil`.
- **Quando**: Clica em "Salvar alterações".
- **Então**: Os dados são gravados na tabela `organizers` associada ao usuário autenticado e mensagem de sucesso é exibida.

### AC-008: Onboarding do Stripe Connect
- **Requisito**: REQ-003
- **Dado que**: O organizador clica em "Conectar conta Stripe para recebimentos".
- **Quando**: A API `/api/organizer/stripe/connect` é acionada.
- **Então**: Uma Connected Account é criada/vinculada e um link seguro de Account Onboarding é gerado e retornado para redirecionamento.

### AC-009: Consulta de Status do Stripe Connect
- **Requisito**: REQ-003
- **Dado que**: O organizador retorna do fluxo da Stripe.
- **Quando**: O dashboard é carregado.
- **Então**: O status de `charges_enabled`, `payouts_enabled` e `onboarding_completed` é consultado e exibido no painel do parceiro.

### AC-010: Criação e Validação de Excursões no Servidor
- **Requisito**: REQ-004
- **Dado que**: O organizador preenche os 4 passos do wizard de criação de excursão.
- **Quando**: Confirma a publicação.
- **Então**: A API `/api/organizer/excursions` valida no backend todos os custos, datas (data de volta >= data de ida), capacidade (capacidade >= mínimo) e persiste o registro na tabela `excursions` com o `organizer_id` da sessão.

### AC-011: Prevenção de IDOR na Edição de Excursões
- **Requisito**: REQ-004
- **Dado que**: Um organizador A tenta editar ou excluir uma excursão pertencente ao organizador B via endpoint `/api/organizer/excursions/[id]`.
- **Quando**: A requisição é executada.
- **Então**: O servidor retorna `403 Forbidden` ou `404 Not Found` e impede a alteração.

### AC-012: Listagem de Excursões do Organizador
- **Requisito**: REQ-004
- **Dado que**: O organizador acessa `/organizador/excursoes`.
- **Quando**: A página é renderizada.
- **Então**: São exibidas apenas as excursões pertencentes ao organizador logado, com contadores de vagas vendidas e progresso de quórum atualizados.

### AC-013: Exibição de Excursões Reais na Home
- **Requisito**: REQ-005
- **Dado que**: O viajante acessa a página inicial (`/`).
- **Quando**: A página é renderizada.
- **Então**: As seções de viagens imperdíveis e destinos populares exibem os registros publicados no banco de dados.

### AC-014: Catálogo com Busca e Filtros Dinâmicos
- **Requisito**: REQ-005
- **Dado que**: O viajante pesquisa por destino ou aplica filtro de categoria em `/excursoes`.
- **Quando**: Os parâmetros de query são enviados.
- **Então**: A listagem retorna os registros correspondentes filtrados no banco.

### AC-015: Cálculo de Preço Server-Side no Checkout
- **Requisito**: REQ-006
- **Dado que**: O viajante inicia o checkout para N ingressos de uma excursão.
- **Quando**: O backend cria a sessão de pagamento.
- **Então**: O valor total é calculado estritamente como `excursion.price_per_seat * quantity` obtido da tabela `excursions` no banco de dados, ignorando qualquer valor informado pelo cliente.

### AC-016: Criação de Checkout Session na Stripe
- **Requisito**: REQ-006
- **Dado que**: A rota `/api/checkout/create-session` é chamada com dados válidos de participantes.
- **Quando**: A Stripe API é chamada.
- **Então**: Uma sessão de Checkout é criada com metadados (`order_id`, `excursion_id`, `buyer_id`, `quantity`) e a URL de redirecionamento é retornada.

### AC-017: Registro Preliminar do Pedido
- **Requisito**: REQ-006
- **Dado que**: A sessão de checkout é criada.
- **Quando**: O registro é gravado.
- **Então**: Um pedido com status `pending` e os dados dos participantes são salvos nas tabelas `orders` e `order_participants`.

### AC-018: Verificação Criptográfica do Webhook Stripe
- **Requisito**: REQ-007
- **Dado que**: A Stripe envia um evento para `/api/webhooks/stripe`.
- **Quando**: O payload e o header `stripe-signature` são recebidos.
- **Então**: A assinatura é validada contra `STRIPE_WEBHOOK_SECRET`. Se inválida, retorna `400 Bad Request`.

### AC-019: Confirmação de Pagamento Idempotente
- **Requisito**: REQ-007
- **Dado que**: O evento `checkout.session.completed` é recebido.
- **Quando**: O webhook processa o evento.
- **Então**: O pedido correspondente é atualizado para status `paid`, o voucher alfanumérico é gerado e as vagas da excursão são atualizadas.

### AC-020: Tratamento de Eventos Repetidos
- **Requisito**: REQ-007
- **Dado que**: O mesmo evento de pagamento é enviado mais de uma vez pela Stripe.
- **Quando**: O webhook é acionado novamente.
- **Então**: O sistema reconhece que o pedido já está pago e responde `200 OK` sem duplicar contagem de vagas.

### AC-021: Visualização de Ingressos pelo Comprador
- **Requisito**: REQ-008
- **Dado que**: O viajante acessa `/minhas-excursoes`.
- **Quando**: A página é carregada.
- **Então**: São listadas as compras e vouchers do usuário autenticado.

### AC-022: Detalhes do Voucher e Embarque
- **Requisito**: REQ-008
- **Dado que**: O viajante acessa `/minhas-excursoes/[reserva]`.
- **Quando**: A página é carregada.
- **Então**: São exibidos o código do voucher, lista de passageiros com documentos, ponto de encontro e instruções de embarque.

### AC-023: Métricas Consolidadas do Organizador
- **Requisito**: REQ-009
- **Dado que**: O organizador acessa `/organizador/`.
- **Quando**: O dashboard é carregado.
- **Então**: Os indicadores de faturamento acumulado, assentos vendidos e taxa de ocupação refletem a soma dos pedidos pagos de suas excursões.

### AC-024: Extrato e Repasses Financeiros
- **Requisito**: REQ-009
- **Dado que**: O organizador acessa `/organizador/financeiro/`.
- **Quando**: A página é carregada.
- **Então**: São exibidos os valores recebíveis, repasses agendados e extrato detalhado por excursão.

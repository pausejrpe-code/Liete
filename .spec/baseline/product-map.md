# Product Map — Baseline do Produto

Este mapa descreve as áreas funcionais, jornadas de usuário e módulos de negócio comprovados pela base de código existente da **Liete Platform**.

---

## 1. Visão Geral das Áreas Funcionais

```text
                                LIETE PLATFORM
                                       │
        ┌──────────────────────────────┼──────────────────────────────┐
        ▼                              ▼                              ▼
  PORTAL VIAJANTE              AUTENTICAÇÃO & ACESSO        PAINEL DO ORGANIZADOR
  - Descoberta & Busca         - Login Unificado            - Overview Dashboard
  - Catálogo de Excursões      - Cadastro (PF & PJ)         - Gestão de Excursões
  - Detalhe & Roteiro          - Recuperação de Senha       - Wizard Nova Excursão
  - Checkout & Reserva         - Confirmação de E-mail      - Gestão Financeira
  - Minhas Excursões                                        - Perfil & Documentos
  - Minha Conta                                             - Onboarding do Parceiro
```

---

## 2. Detalhamento das Jornadas

### 2.1 Jornada do Viajante (Traveler Journey)
- **Descoberta**: Acessa a Home (`/`), visualiza banners institucionais (`BannerHero`, `PartnerHero`), utiliza a barra de pesquisa (`TripSearchBar`) por destino/data e visualiza cards em destaque (`TripCard`).
- **Navegação no Catálogo**: Acessa `/excursoes`, filtra viagens por estado/categoria, avaliações (`Rating`) e status de disponibilidade (`StatusChip`).
- **Checkout e Reserva**: Acessa `/checkout`, confere detalhamento de valores (`PriceBreakdown`), preenche dados dos passageiros e finaliza o pedido.
- **Gestão de Ingressos**: Acessa `/minhas-excursoes` e `/minha-conta` para visualizar confirmação de saídas e vouchers de embarque.

### 2.2 Jornada de Autenticação (Auth Journey)
- **Login**: `/entrar` com seleção de perfil (Viajante ou Organizador).
- **Cadastro**: `/cadastro` com suporte dinâmico a Pessoa Física (CPF) e Pessoa Jurídica (CNPJ, Razão Social, Responsável).
- **Recuperação e Validação**: `/recuperar-senha` e `/verificar-email`.

### 2.3 Jornada do Organizador (Organizer Journey)
- **Visão Geral (`/organizador`)**: Painel central com métricas-chave (`MetricCard`), gráfico de vendas recentes, itens com ação pendente/atenção (`overviewAttentionItems`) e próximas saídas.
- **Gestão de Excursões (`/organizador/excursoes`)**: Tabela com filtros de status (`confirmed`, `available`, `soldOut`, `draft`, `cancelled`), progresso até a meta mínima (`GoalProgress`) e ocupação de assentos.
- **Criação de Excursão (`/organizador/excursoes/nova`)**: Wizard em 4 etapas (`FlowStepper`):
  1. *Identificação e Roteiro*: Título, destino, itinerário, galeria de fotos (`MediaUploader`).
  2. *Saídas e Capacidade*: Datas de ida/volta, capacidade do ônibus, quórum mínimo.
  3. *Precificação e Custos*: Custos fixos, custos variáveis por pessoa, margem/lucro desejado e simulação em tempo real do preço final do ingresso.
  4. *Revisão e Publicação*: Resumo dos dados e submissão para publicação.
- **Financeiro (`/organizador/financeiro`)**: Indicadores de faturamento bruto, valores a receber, repasses liberados, retenção para segundo repasse (`PayoutStatusCard`) e histórico de lançamentos/estornos.
- **Perfil e Documentos (`/organizador/perfil`)**: Cadastro institucional, envio de comprovantes de endereço/documentos e cadastro de chave Pix / conta bancária.

# Jornada: acompanhamento de excursões

## Objetivo

Permitir que o organizador acompanhe suas excursões, vendas, próximas saídas e receita estimada, além de iniciar a criação de uma nova excursão.

## Estrutura

- `OrganizerAppShell` mantém header e sidebar do administrativo.
- `PageHeader` apresenta o contexto e o CTA “Nova excursão”.
- Quatro `MetricCard` resumem excursões ativas, próximas saídas, vagas vendidas e receita estimada.
- `DataTable` apresenta destino, data, ocupação, ingresso, status e ação de acompanhamento.
- `Pagination` divide a listagem mockada.
- `ModalDialog` mostra os principais detalhes da excursão selecionada.
- `EmptyState` cobre o primeiro uso e direciona para a criação.

## Comportamento responsivo

- Desktop: indicadores em quatro colunas e tabela semântica.
- Tablet: indicadores em duas colunas e listagem em cartões até 900 px.
- Mobile: navegação administrativa compacta, CTA em largura total, indicadores em duas colunas e cartões empilhados.
- A interface não cria rolagem horizontal em 393 px.

## Navegação

O CTA principal e a ação “Criar semelhante” abrem `/organizador/excursoes/nova/`, respeitando o `basePath` configurado no site.

## Dados

Esta entrega usa dados simulados. Integração com persistência, filtros e indicadores financeiros reais permanece fora do escopo.

## Acessibilidade

Há um único `h1`, landmarks nomeados, tabela semântica no desktop, lista semântica no mobile, status textuais, botões nativos e diálogo nomeado.

# Jornada: acompanhamento financeiro

## Objetivo

Permitir que o organizador entenda o valor que tem a receber, acompanhe fechamentos e estornos e saiba quando ocorrerá o próximo pagamento.

## Entrada e saída

- Entrada pelo item “Financeiro” da navegação administrativa.
- Saída para “Excursões” pelo menu ou pelo detalhe financeiro.
- Dados simulados nesta entrega; nenhum pagamento ou informação bancária real é consultado.

## Estrutura

- `OrganizerAppShell` com `PageHeader` e sidebar persistentes.
- Filtros com `Select` para período do gráfico e status financeiro.
- Quatro `MetricCard`: saldo a receber, receita líquida, estornos e excursões em fechamento.
- Gráfico local de vendas brutas versus valor líquido.
- `PayoutStatusCard` para o próximo pagamento.
- Tabela desktop e cartões mobile por excursão.
- `StatusChip`, `Pagination`, `ModalDialog` e `EmptyState` para estados e ações.

## Regras de conteúdo

- Receita líquida representa vendas menos taxa da plataforma, taxa de cartão e estornos.
- Saldo a receber inclui excursões em fechamento ou com repasse programado.
- Status nunca depende apenas de cor.
- Valores simulados são informados no contexto dos filtros e da tabela.

## Responsividade

- Desktop: quatro indicadores, gráfico e próximo pagamento lado a lado quando houver espaço, tabela semântica.
- Tablet: indicadores em duas colunas, gráfico e pagamento empilhados, registros em cartões até 900 px.
- Mobile: filtros empilhados, indicadores em duas colunas e todos os registros sem rolagem horizontal.

## Estados

- Default com dados financeiros.
- Filtro sem resultado usa `EmptyState` e permite limpar o filtro.
- Estados de loading e erro ficam previstos para a futura integração com backend.

## Acessibilidade

- Um único `h1`, regiões nomeadas, tabela semântica e lista mobile.
- Gráfico com título, descrição e alternativa textual por período.
- Controles nativos, foco visível, status textuais e diálogo nomeado.

## Fora do escopo

- Integração bancária, conciliação real, emissão de comprovantes, exportação, impostos e execução de repasses.

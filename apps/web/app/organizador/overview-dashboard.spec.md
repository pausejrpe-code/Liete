# Jornada: Visão geral do organizador

## Objetivo

Oferecer uma leitura rápida da operação para que o organizador identifique resultados, pendências e próximos passos sem navegar primeiro por outras áreas.

## Entrada e saída

A rota `/organizador/` é a entrada principal do painel. As saídas levam a criar uma excursão, acompanhar excursões, consultar o financeiro ou completar o perfil.

## Estrutura

- Indicadores de saldo a receber, ingressos vendidos, excursões ativas e ocupação média.
- Lista priorizada de ações que exigem atenção.
- Próximo pagamento programado.
- Vendas brutas das últimas quatro semanas.
- Acessos rápidos para as áreas gerenciais.
- Próximas excursões com progresso da meta mínima.

## Dados e estados

Os valores são derivados das mesmas simulações usadas nas páginas de Excursões e Financeiro. Nesta entrega não existem carregamento remoto, autenticação, permissões ou persistência. Futuras integrações devem prever carregamento, vazio, erro parcial e atualização dos indicadores.

## Responsive Behavior

A composição começa em uma coluna. Indicadores, gráficos e cartões ganham múltiplas colunas apenas quando há espaço, sem tabela ou rolagem horizontal no mobile.

## Accessibility

Indicadores mantêm rótulo textual, o gráfico oferece descrição equivalente, pendências usam status além da cor, links preservam destino semântico, progressos expõem valores ARIA e alvos interativos mantêm ao menos 44 px.

## Componentes do Design System

`OrganizerAppShell`, `Button`, `GoalProgress`, `MetricCard`, `PayoutStatusCard` e `StatusChip`.

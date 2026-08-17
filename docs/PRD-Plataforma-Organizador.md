# PRD — Plataforma do Organizador

| Campo | Valor |
|---|---|
| Produto | SaaS para organizadores de excursões |
| Documento | Product Requirements Document |
| Versão | 0.1 |
| Status | Base para início de UX/UI e desenvolvimento |
| Data | 25/07/2026 |
| Público | Produto, Design, Engenharia, Operações e Financeiro |

## 1. Resumo executivo

A Plataforma do Organizador é o ambiente administrativo usado por pessoas físicas e jurídicas para criar, publicar, vender e administrar excursões.

O produto deve permitir que o organizador:

1. cadastre uma excursão reutilizável;
2. crie uma ou mais saídas com data, capacidade e mínimo de passageiros;
3. informe custos e lucro desejado por ingresso;
4. receba do sistema o preço calculado para o viajante;
5. publique e acompanhe as vendas;
6. saiba quanto vendeu, quanto recebeu e quanto ainda tem a receber;
7. acompanhe quando a saída atinge o mínimo e passa a estar confirmada;
8. receba os valores em duas etapas, conforme as regras deste documento.

Este PRD fixa apenas as regras já confirmadas. Decisões que ainda precisam de validação estão reunidas na seção **Pendências de produto** e não devem ser tratadas como regras definitivas durante o design ou a implementação.

## 2. Contexto e problema

Organizadores de excursões precisam montar ofertas que sejam financeiramente viáveis, acompanhar a formação de grupos e receber recursos a tempo de contratar transporte e fornecedores. Quando esse processo é feito por planilhas, mensagens e cálculos manuais, surgem riscos de:

- preço calculado incorretamente;
- falta de clareza sobre a margem do organizador;
- venda acima da capacidade;
- excursão confirmada sem atingir o mínimo;
- dificuldade para distinguir vendas, repasses e valores pendentes;
- retrabalho ao publicar a mesma excursão em novas datas;
- ausência de histórico financeiro e operacional confiável.

A plataforma deve centralizar esse trabalho e oferecer uma visão simples do ciclo completo de cada saída.

## 3. Visão do produto

Ser o sistema principal de operação e geração de receita dos organizadores que anunciam excursões na plataforma de turismo.

### 3.1 Proposta de valor

O organizador consegue transformar os custos de uma excursão em uma oferta publicável, acompanhar o preenchimento do grupo e controlar sua operação financeira em um único lugar.

### 3.2 Resultado principal para o usuário

> “Consigo publicar uma excursão com preço sustentável e saber, a qualquer momento, quantas vagas vendi, se a viagem está confirmada e quanto tenho para receber.”

## 4. Objetivos do MVP

- Permitir o cadastro de organizadores pessoa física e pessoa jurídica.
- Permitir a criação de excursões reutilizáveis.
- Permitir a criação de saídas associadas a uma excursão.
- Calcular automaticamente o preço por ingresso.
- Publicar vagas individuais.
- Acompanhar vendas e progresso até o mínimo de passageiros.
- Confirmar a saída quando o mínimo for atingido.
- Apresentar os indicadores administrativos e financeiros essenciais.
- Exibir o primeiro repasse e o saldo retido para o repasse final.
- Manter histórico suficiente para auditoria de preços, vendas e repasses.

## 5. Fora do escopo inicial

Os itens abaixo não são necessários para iniciar o MVP:

- precificação dinâmica;
- venda de pacotes por casal, família, quarto ou categoria de ingresso;
- mapa ou escolha de assentos no transporte;
- programa de fidelidade;
- cupons e campanhas promocionais;
- gestão completa de fornecedores;
- contabilidade e emissão fiscal completas;
- múltiplos membros e permissões avançadas na equipe do organizador;
- definição automatizada de políticas de cancelamento ainda não aprovadas;
- aplicativo exclusivo para o organizador;
- detalhes da experiência de compra do viajante, exceto os dados necessários para a gestão das reservas.

## 6. Perfis de usuário

### 6.1 Organizador pessoa física

Pessoa que cria e opera excursões em nome próprio. Precisa cadastrar seus dados, informações de contato e conta para recebimento.

### 6.2 Organizador pessoa jurídica

Empresa responsável pela criação e operação das excursões. Precisa cadastrar os dados da empresa, um responsável e uma conta para recebimento.

### 6.3 Operação interna da plataforma

Perfil administrativo da empresa responsável por suporte, análise de publicações, acompanhamento financeiro e tratamento de exceções. A interface interna completa não faz parte deste PRD, mas o modelo deve permitir intervenções auditáveis.

## 7. Glossário

| Termo | Definição |
|---|---|
| Excursão | Cadastro reutilizável da experiência, contendo informações que podem ser reaproveitadas em diferentes datas. |
| Saída | Ocorrência de uma excursão em uma data específica, com capacidade, mínimo, custos, preço e vendas próprios. |
| Vaga | Unidade individual vendida a um passageiro. |
| Mínimo de passageiros | Quantidade necessária para que a saída seja confirmada. |
| Capacidade | Quantidade máxima de vagas disponíveis em uma saída. |
| Valor-base | Valor que cobre a parcela do transporte, o custo por passageiro e o lucro desejado pelo organizador. |
| Acréscimo da plataforma | Valor correspondente a 15% do valor-base, adicionado ao preço pago pelo viajante. |
| Preço final | Valor-base somado ao acréscimo da plataforma. |
| Primeiro repasse | Valor liberado ao organizador quando a saída atinge o mínimo. |
| Repasse final | Saldo das vendas posteriores, liberado após a realização da excursão. |

## 8. Regras de negócio confirmadas

### RN-001 — Tipos de organizador

Pessoas físicas e pessoas jurídicas podem publicar excursões.

### RN-002 — Excursão reutilizável

O cadastro principal da excursão deve ser reutilizável. O organizador não deve precisar recriar todas as informações para disponibilizar uma nova data.

Cada nova data deve ser representada por uma **saída**, mantendo dados operacionais e financeiros próprios.

### RN-003 — Unidade de venda

O MVP comercializa vagas individuais.

### RN-004 — Composição de custos

O cálculo deve considerar:

- custo total do transporte;
- custo do passeio por passageiro;
- lucro desejado pelo organizador por ingresso.

O custo do passeio por passageiro deve contemplar, quando aplicável:

- ingresso;
- hospedagem;
- alimentação;
- guia;
- seguro;
- taxas;
- outros custos por passageiro.

Na interface, esses itens podem ser apresentados como uma composição detalhada, mas devem formar um único total de custo por passageiro para o cálculo.

### RN-005 — Lucro do organizador

O organizador informa quanto deseja ganhar em cada ingresso.

### RN-006 — Formação do preço

O custo fixo do transporte é dividido pelo mínimo de passageiros da saída.

Considere:

- `T`: custo total do transporte;
- `N`: mínimo de passageiros;
- `C`: custo do passeio por passageiro;
- `L`: lucro desejado pelo organizador por ingresso;
- `B`: valor-base por ingresso;
- `A`: acréscimo da plataforma;
- `P`: preço final para o viajante.

Fórmulas:

```text
B = (T ÷ N) + C + L
A = B × 0,15
P = B + A
P = B × 1,15
```

### RN-007 — Natureza dos 15%

Os 15% são acrescentados sobre o valor-base. Quando o organizador precisa receber R$ 100,00 de valor-base, o viajante paga R$ 115,00.

Esse modelo não equivale a reter 15% do preço final. No exemplo de R$ 115,00, os R$ 15,00 representam aproximadamente 13,04% do valor pago pelo viajante. Textos da interface, relatórios e contratos devem usar a expressão **“acréscimo de 15% sobre o valor-base”** para evitar ambiguidade.

### RN-008 — Custos de pagamento

As taxas de cartão, Pix e parcelamento estão incluídas no acréscimo da plataforma. Elas não devem ser descontadas novamente do valor-base apresentado ao organizador.

### RN-009 — Confirmação da saída

A saída é confirmada quando atinge o mínimo de passageiros com pagamento válido.

Reservas pendentes, pagamentos recusados, cancelados ou estornados não contam para o mínimo.

### RN-010 — Primeiro repasse

Ao atingir o mínimo:

- a saída passa para o estado **Confirmada**;
- a plataforma mantém o acréscimo de 15% sobre o valor-base;
- o valor-base elegível das vendas realizadas até a confirmação é disponibilizado para o primeiro repasse ao organizador;
- o organizador utiliza esse recurso para contratar transporte, locais e demais fornecedores.

O prazo bancário e as condições operacionais exatas do repasse ainda dependem da solução de pagamentos escolhida.

### RN-011 — Vendas após a confirmação

A plataforma continua vendendo vagas após o mínimo ser atingido, respeitando a capacidade da saída.

### RN-012 — Repasse final

O valor-base das vendas realizadas após o marco do primeiro repasse fica retido e é liberado ao organizador após a realização da excursão.

### RN-013 — Histórico de preço

Cada venda deve manter um retrato imutável da composição de preço usada no momento da compra. Mudanças posteriores na excursão ou na saída não podem alterar transações já realizadas.

### RN-014 — Controle de capacidade

O sistema não pode confirmar mais vagas do que a capacidade total da saída.

## 9. Exemplo de cálculo

### 9.1 Dados informados

| Item | Valor |
|---|---:|
| Transporte | R$ 6.000,00 |
| Mínimo de passageiros | 30 |
| Custo do passeio por passageiro | R$ 150,00 |
| Lucro desejado por ingresso | R$ 50,00 |

### 9.2 Resultado por ingresso

| Componente | Cálculo | Valor |
|---|---|---:|
| Transporte por passageiro | R$ 6.000 ÷ 30 | R$ 200,00 |
| Custo por passageiro | informado | R$ 150,00 |
| Lucro por ingresso | informado | R$ 50,00 |
| Valor-base | 200 + 150 + 50 | R$ 400,00 |
| Acréscimo da plataforma | 400 × 15% | R$ 60,00 |
| Preço final | 400 + 60 | R$ 460,00 |

### 9.3 Resultado ao atingir o mínimo

| Indicador | Valor |
|---|---:|
| Vagas vendidas | 30 |
| Total pago pelos viajantes | R$ 13.800,00 |
| Valor-base do organizador | R$ 12.000,00 |
| Acréscimo total da plataforma | R$ 1.800,00 |

Os valores exibidos devem ser calculados com precisão monetária no servidor. A interface deve apresentar valores arredondados em centavos.

## 10. Arquitetura da informação

### 10.1 Navegação principal do organizador

1. **Visão geral**
2. **Excursões**
3. **Saídas**
4. **Reservas**
5. **Financeiro**
6. **Perfil e recebimento**

### 10.2 Mapa de telas do MVP

| Área | Tela | Finalidade |
|---|---|---|
| Acesso | Entrar / criar conta | Autenticar e iniciar o cadastro. |
| Onboarding | Tipo de organizador | Escolher pessoa física ou jurídica. |
| Onboarding | Dados do organizador | Cadastrar informações essenciais. |
| Onboarding | Dados de recebimento | Informar conta ou destino dos repasses. |
| Visão geral | Dashboard | Exibir operação, vendas, recebimentos e alertas. |
| Excursões | Lista de excursões | Consultar, filtrar, criar e reutilizar excursões. |
| Excursões | Criar/editar excursão | Cadastrar o conteúdo reutilizável. |
| Excursões | Detalhe da excursão | Ver informações e saídas relacionadas. |
| Saídas | Nova saída | Definir data, vagas, mínimo, custos e preço. |
| Saídas | Simulação de preço | Mostrar a formação do preço antes da publicação. |
| Saídas | Revisão e publicação | Revisar o anúncio e publicar. |
| Saídas | Detalhe da saída | Acompanhar progresso, vendas e situação financeira. |
| Reservas | Lista de reservas | Consultar compradores, passageiros e pagamentos. |
| Reservas | Detalhe da reserva | Consultar dados e histórico de uma compra. |
| Financeiro | Visão financeira | Exibir vendido, recebido e a receber. |
| Financeiro | Detalhe do repasse | Explicar composição, status e data do repasse. |
| Perfil | Dados cadastrais | Manter dados de PF ou PJ. |
| Perfil | Conta de recebimento | Manter informações usadas nos repasses. |

## 11. Jornada principal

### 11.1 Cadastro do organizador

1. Usuário cria uma conta.
2. Escolhe pessoa física ou pessoa jurídica.
3. Preenche dados cadastrais e de contato.
4. Informa os dados necessários para recebimento.
5. Acessa o dashboard.

O nível de verificação documental necessário antes da primeira publicação permanece pendente.

### 11.2 Criação de uma excursão reutilizável

1. Organizador seleciona **Nova excursão**.
2. Informa título, destino e descrição.
3. Adiciona imagens.
4. Informa roteiro, duração e o que está incluído.
5. Informa orientações importantes ao viajante.
6. Salva como rascunho ou avança para criar uma saída.

### 11.3 Criação de uma saída

1. Organizador escolhe uma excursão existente.
2. Informa data e horários.
3. Informa ponto ou pontos de embarque.
4. Informa capacidade total.
5. Informa o mínimo de passageiros.
6. Informa o custo total do transporte.
7. Informa os custos por passageiro.
8. Informa o lucro desejado por ingresso.
9. Visualiza a composição e o preço final.
10. Revisa as informações.
11. Publica a saída.

### 11.4 Acompanhamento das vendas

1. A saída publicada aparece como **Aguardando mínimo**.
2. Cada pagamento válido atualiza vagas vendidas, receita e progresso.
3. O organizador acompanha quantas vagas faltam para a confirmação.
4. Ao atingir o mínimo, a saída muda para **Confirmada**.
5. O primeiro repasse passa a ser acompanhado na área financeira.
6. A venda de vagas continua até a capacidade.

### 11.5 Encerramento e repasse final

1. A excursão é marcada como realizada.
2. A saída passa para **Concluída**.
3. O saldo elegível das vendas posteriores é preparado para o repasse final.
4. O organizador acompanha o processamento e a conclusão do pagamento.

O evento ou a validação que comprovará a realização da excursão ainda precisa ser definido.

## 12. Fluxo de publicação

O fluxo deve ser apresentado como um assistente dividido em etapas, com salvamento de rascunho.

### Etapa 1 — Informações da excursão

- título;
- destino principal;
- descrição;
- duração;
- roteiro;
- imagens;
- itens incluídos;
- itens não incluídos;
- orientações ao viajante.

### Etapa 2 — Data e operação da saída

- data de partida;
- horário de partida;
- previsão de retorno;
- ponto ou pontos de embarque;
- capacidade;
- mínimo de passageiros.

### Etapa 3 — Custos e lucro

- custo total do transporte;
- custos por passageiro;
- lucro desejado por ingresso.

A interface deve permitir adicionar linhas de custo por passageiro, com nome e valor, e apresentar o total consolidado.

### Etapa 4 — Simulação de preço

Apresentar de forma separada:

- transporte por passageiro;
- custos por passageiro;
- lucro por ingresso;
- valor-base do organizador;
- acréscimo da plataforma;
- preço final do ingresso;
- valor previsto para o organizador ao atingir o mínimo;
- valor previsto para a plataforma ao atingir o mínimo.

### Etapa 5 — Revisão

Apresentar uma prévia do anúncio e um resumo financeiro antes da publicação.

### Etapa 6 — Publicação

Confirmar a publicação e direcionar o organizador para o detalhe da saída.

## 13. Dashboard

### 13.1 Indicadores principais

O dashboard deve apresentar, no mínimo:

- vendas no período;
- valor total pago pelos viajantes;
- receita-base do organizador;
- valor já recebido;
- valor a receber;
- valor retido até a realização das excursões;
- quantidade de vagas vendidas;
- próximas saídas;
- saídas aguardando mínimo;
- saídas confirmadas.

### 13.2 Cards de acompanhamento das saídas

Cada saída ativa deve apresentar:

- nome da excursão;
- data;
- vagas vendidas e capacidade;
- mínimo de passageiros;
- progresso até o mínimo;
- status;
- preço por ingresso;
- valor vendido;
- próximo marco operacional ou financeiro.

### 13.3 Alertas

O sistema deve destacar situações que exigem atenção:

- dados de recebimento incompletos;
- saída próxima que ainda não atingiu o mínimo;
- saída que acabou de ser confirmada;
- repasse em processamento ou com falha;
- capacidade esgotada;
- informação obrigatória pendente.

### 13.4 Filtros

- período;
- excursão;
- saída;
- status.

## 14. Estados do produto

### 14.1 Estados da excursão reutilizável

| Estado | Significado |
|---|---|
| Rascunho | Cadastro ainda não finalizado. |
| Ativa | Pode receber novas saídas. |
| Arquivada | Não aparece entre as excursões ativas, mas mantém o histórico. |

### 14.2 Estados da saída

| Estado | Significado |
|---|---|
| Rascunho | Ainda não publicada. |
| Aguardando mínimo | Publicada e aceitando vendas, mas ainda não confirmada. |
| Confirmada | Atingiu o mínimo de passageiros. |
| Esgotada | Atingiu a capacidade total. |
| Em realização | Data/horário da experiência em andamento. |
| Concluída | Excursão realizada. |
| Cancelada | Saída encerrada sem realização. A política ainda será definida. |

### 14.3 Estados da reserva

| Estado | Conta para o mínimo? |
|---|---|
| Aguardando pagamento | Não |
| Paga | Sim |
| Cancelada | Não |
| Reembolsada | Não |
| Pagamento recusado | Não |

### 14.4 Estados do repasse

| Estado | Significado |
|---|---|
| Não elegível | Marco necessário ainda não atingido. |
| Disponível | Valor apto a ser repassado. |
| Em processamento | Transferência iniciada. |
| Pago | Transferência concluída. |
| Retido | Valor aguardando a realização da excursão ou análise. |
| Falhou | Transferência não concluída e requer ação. |

## 15. Requisitos funcionais

### 15.1 Cadastro e acesso

| ID | Prioridade | Requisito |
|---|---|---|
| RF-001 | Obrigatório | Permitir cadastro como pessoa física ou jurídica. |
| RF-002 | Obrigatório | Manter os dados cadastrais separados conforme o tipo de organizador. |
| RF-003 | Obrigatório | Permitir o cadastro de dados para recebimento. |
| RF-004 | Obrigatório | Impedir repasses enquanto os dados mínimos de recebimento estiverem incompletos ou inválidos. |
| RF-005 | Desejável | Exibir o progresso de conclusão do cadastro. |

### 15.2 Excursões

| ID | Prioridade | Requisito |
|---|---|---|
| RF-010 | Obrigatório | Criar, editar, consultar e arquivar uma excursão reutilizável. |
| RF-011 | Obrigatório | Salvar uma excursão como rascunho. |
| RF-012 | Obrigatório | Criar novas saídas a partir de uma excursão existente. |
| RF-013 | Obrigatório | Preservar o histórico das saídas de uma excursão. |
| RF-014 | Desejável | Duplicar uma saída anterior para acelerar uma nova publicação. |

### 15.3 Saídas e preço

| ID | Prioridade | Requisito |
|---|---|---|
| RF-020 | Obrigatório | Cadastrar data, horários, capacidade e mínimo da saída. |
| RF-021 | Obrigatório | Validar que o mínimo seja maior que zero e não ultrapasse a capacidade. |
| RF-022 | Obrigatório | Cadastrar o custo total do transporte. |
| RF-023 | Obrigatório | Cadastrar um ou mais custos por passageiro. |
| RF-024 | Obrigatório | Cadastrar o lucro desejado por ingresso. |
| RF-025 | Obrigatório | Calcular automaticamente o valor-base, o acréscimo e o preço final. |
| RF-026 | Obrigatório | Atualizar a simulação imediatamente quando um valor de entrada mudar. |
| RF-027 | Obrigatório | Exibir a memória de cálculo de forma compreensível. |
| RF-028 | Obrigatório | Criar um retrato da composição do preço ao publicar e ao vender. |
| RF-029 | Obrigatório | Impedir valores negativos e entradas monetárias inválidas. |
| RF-030 | Obrigatório | Impedir vendas acima da capacidade. |

### 15.4 Publicação

| ID | Prioridade | Requisito |
|---|---|---|
| RF-040 | Obrigatório | Validar os campos obrigatórios antes da publicação. |
| RF-041 | Obrigatório | Apresentar uma revisão do anúncio e do preço. |
| RF-042 | Obrigatório | Permitir salvar e continuar posteriormente. |
| RF-043 | Obrigatório | Registrar data, autor e versão da publicação. |
| RF-044 | Desejável | Apresentar uma prévia próxima da experiência do viajante. |

### 15.5 Reservas e passageiros

| ID | Prioridade | Requisito |
|---|---|---|
| RF-050 | Obrigatório | Listar reservas por saída. |
| RF-051 | Obrigatório | Exibir comprador, quantidade de vagas, valor e status do pagamento. |
| RF-052 | Obrigatório | Exibir os passageiros associados à reserva, quando disponíveis. |
| RF-053 | Obrigatório | Contabilizar apenas reservas pagas no progresso até o mínimo. |
| RF-054 | Obrigatório | Atualizar a disponibilidade após a confirmação do pagamento. |
| RF-055 | Desejável | Exportar uma lista operacional de passageiros. |

### 15.6 Confirmação

| ID | Prioridade | Requisito |
|---|---|---|
| RF-060 | Obrigatório | Exibir o progresso de vagas pagas até o mínimo. |
| RF-061 | Obrigatório | Confirmar automaticamente a saída ao atingir o mínimo. |
| RF-062 | Obrigatório | Registrar o momento exato da confirmação. |
| RF-063 | Obrigatório | Notificar o organizador quando a saída for confirmada. |
| RF-064 | Obrigatório | Continuar as vendas após a confirmação, até a capacidade. |

### 15.7 Financeiro e repasses

| ID | Prioridade | Requisito |
|---|---|---|
| RF-070 | Obrigatório | Separar o total pago pelo viajante, o valor-base e o acréscimo da plataforma. |
| RF-071 | Obrigatório | Exibir valores vendidos, recebidos, disponíveis e retidos. |
| RF-072 | Obrigatório | Tornar o primeiro repasse elegível após a confirmação da saída. |
| RF-073 | Obrigatório | Reter o valor-base das vendas posteriores para o repasse final. |
| RF-074 | Obrigatório | Tornar o saldo final elegível após a realização da excursão. |
| RF-075 | Obrigatório | Exibir o histórico e o status de cada repasse. |
| RF-076 | Obrigatório | Registrar cada movimento em um histórico financeiro imutável. |
| RF-077 | Obrigatório | Evitar repasses duplicados em caso de reprocessamento. |
| RF-078 | Obrigatório | Exibir de forma clara qualquer falha ou retenção. |

## 16. Critérios de aceite essenciais

### CA-001 — Cálculo do preço

Dado um transporte de R$ 6.000, mínimo de 30 passageiros, custo por passageiro de R$ 150 e lucro de R$ 50, o sistema deve apresentar:

- transporte por passageiro: R$ 200;
- valor-base: R$ 400;
- acréscimo da plataforma: R$ 60;
- preço final: R$ 460.

### CA-002 — Reutilização

Dada uma excursão já cadastrada, o organizador deve conseguir criar uma nova saída sem preencher novamente título, descrição, imagens, roteiro e itens incluídos.

### CA-003 — Progresso do mínimo

Uma saída com mínimo de 30 e 18 vagas pagas deve apresentar `18 de 30` e `60% do mínimo`.

### CA-004 — Confirmação

Quando a trigésima vaga válida for paga, a saída deve passar uma única vez para **Confirmada**, registrar o horário e iniciar o fluxo do primeiro repasse.

### CA-005 — Pagamento inválido

Uma reserva com pagamento pendente, recusado, cancelado ou reembolsado não deve ser contabilizada no mínimo.

### CA-006 — Capacidade

Se a saída estiver com todas as vagas comprometidas conforme a política de reserva, o sistema deve impedir uma nova venda e evitar sobreposição causada por compras simultâneas.

### CA-007 — Transparência financeira

Para cada venda, o organizador deve conseguir identificar:

- valor pago pelo viajante;
- valor-base destinado ao organizador;
- acréscimo da plataforma;
- etapa de repasse do valor-base;
- status do pagamento e do repasse.

### CA-008 — Histórico

Uma alteração futura em custos ou preço não deve modificar a composição financeira de vendas anteriores.

## 17. Estados de interface

Todas as telas com dados remotos devem prever:

- carregamento;
- conteúdo disponível;
- lista vazia;
- erro recuperável com ação de tentar novamente;
- indisponibilidade temporária;
- ausência de permissão;
- confirmação de ação concluída.

### 17.1 Estados vazios prioritários

- organizador ainda não criou excursões;
- excursão sem saídas;
- saída sem vendas;
- nenhum repasse realizado;
- nenhum valor a receber no período;
- filtro sem resultados.

### 17.2 Mensagens críticas

As mensagens devem explicar:

- o que aconteceu;
- qual valor ou registro foi afetado;
- se os dados foram salvos;
- o que o organizador pode fazer em seguida;
- como pedir suporte quando não houver recuperação automática.

## 18. Modelo de dados conceitual

Esta seção orienta o desenvolvimento, sem impor uma tecnologia de banco de dados.

| Entidade | Responsabilidade |
|---|---|
| Organizador | Identidade principal do usuário publicador. |
| Perfil PF | Dados específicos de pessoa física. |
| Perfil PJ | Dados da empresa e do responsável. |
| Conta de recebimento | Destino e situação cadastral dos repasses. |
| Excursão | Conteúdo reutilizável da experiência. |
| Saída | Data, capacidade, mínimo, operação e status. |
| Item de custo | Componente do custo por passageiro. |
| Composição de preço | Entradas e resultado de uma versão do cálculo. |
| Reserva | Compra de uma ou mais vagas individuais. |
| Passageiro | Pessoa associada a uma vaga. |
| Pagamento | Transação e estado do pagamento do viajante. |
| Lançamento financeiro | Registro imutável de crédito, retenção, ajuste ou débito. |
| Repasse | Transferência de valor ao organizador. |
| Evento de auditoria | Histórico de alterações e transições relevantes. |

### 18.1 Relações principais

- um organizador possui muitas excursões;
- uma excursão possui muitas saídas;
- uma saída possui sua própria composição de preço;
- uma saída possui muitas reservas;
- uma reserva possui uma ou mais vagas e passageiros;
- pagamentos geram lançamentos financeiros;
- lançamentos elegíveis compõem repasses.

## 19. Requisitos não funcionais

### 19.1 Segurança e privacidade

- Proteger dados pessoais e financeiros em trânsito e em repouso.
- Aplicar acesso por organizador, impedindo consulta a dados de terceiros.
- Não armazenar dados sensíveis de cartão fora do provedor de pagamento.
- Manter trilha de auditoria para mudanças financeiras e operacionais.
- Atender aos princípios aplicáveis de proteção de dados e submeter os fluxos a validação jurídica antes do lançamento.

### 19.2 Confiabilidade financeira

- Usar representação monetária exata, sem cálculos financeiros com ponto flutuante impreciso.
- Processar confirmações de pagamento e repasses de forma idempotente.
- Conciliar eventos do provedor de pagamento com o histórico interno.
- Registrar ajustes sem apagar ou sobrescrever lançamentos anteriores.

### 19.3 Desempenho

- O dashboard deve apresentar o conteúdo essencial rapidamente, mesmo com histórico crescente.
- Listas devem suportar paginação, busca e filtros.
- Cálculos de simulação devem responder imediatamente às alterações do formulário.

### 19.4 Acessibilidade e responsividade

- O painel deve funcionar em desktop e celular, priorizando desktop para a operação administrativa.
- Formulários devem possuir rótulos, instruções e mensagens de erro acessíveis.
- Status não devem depender apenas de cor.
- Navegação por teclado e contraste devem ser considerados desde os primeiros protótipos.

### 19.5 Observabilidade

- Registrar falhas de pagamento, mudança de status, confirmação, repasse e publicação.
- Permitir correlação entre reserva, pagamento, lançamento e repasse.
- Alertar a operação sobre falhas financeiras que exigem intervenção.

## 20. Métricas do produto

### 20.1 Ativação

- percentual de organizadores que concluem o cadastro;
- percentual que cria a primeira excursão;
- percentual que publica a primeira saída;
- tempo entre cadastro e primeira publicação.

### 20.2 Operação

- quantidade de saídas publicadas;
- percentual de saídas que atingem o mínimo;
- tempo médio para atingir o mínimo;
- ocupação média das saídas;
- quantidade de reservas por saída.

### 20.3 Receita

- valor total vendido;
- valor-base destinado aos organizadores;
- acréscimo total da plataforma;
- receita média por saída;
- valor médio do ingresso.

### 20.4 Financeiro

- tempo médio até o primeiro repasse;
- tempo médio até o repasse final;
- taxa de falha de repasse;
- valores retidos;
- divergências de conciliação.

## 21. Pendências de produto

As decisões abaixo não bloqueiam o início da arquitetura da informação, dos protótipos e do desenvolvimento dos cadastros básicos. Elas devem ser resolvidas antes da entrada em produção dos fluxos afetados.

| ID | Decisão pendente | Impacto |
|---|---|---|
| PD-001 | O preço pode mudar depois da publicação ou da primeira venda? | Edição da saída, histórico e comunicação aos compradores. |
| PD-002 | O que acontece se o mínimo não for atingido? | Cancelamento, reembolso e estados da saída. |
| PD-003 | Existe uma data-limite para atingir o mínimo? | Alertas, confirmação e experiência do viajante. |
| PD-004 | Como serão garantidos reembolsos depois do primeiro repasse? | Risco financeiro, reserva de segurança e contrato. |
| PD-005 | Quem fica com a margem adicional quando as vendas ultrapassam o mínimo? | Previsão de lucro e repasse final. |
| PD-006 | Quais documentos de PF e PJ devem ser verificados antes da publicação? | Onboarding, conformidade e aprovação. |
| PD-007 | Impostos estão incluídos ou são responsabilidade do organizador? | Comunicação financeira e contratos. |
| PD-008 | Quais são as políticas de cancelamento pelo viajante e pelo organizador? | Reembolsos, suporte e financeiro. |
| PD-009 | Haverá moderação antes da publicação? | Status, prazo e operação interna. |
| PD-010 | Uma nova saída pode ter custos e preço diferentes da saída anterior? | Reutilização e experiência de duplicação. |
| PD-011 | Como a realização da excursão será confirmada para liberar o saldo? | Repasse final e prevenção de fraude. |
| PD-012 | Qual provedor de pagamento e quais prazos de liquidação serão usados? | Viabilidade do split, repasses e conciliação. |
| PD-013 | Quais dados dos passageiros serão obrigatórios? | Checkout, lista de embarque e privacidade. |
| PD-014 | Será permitida lista de espera quando a capacidade esgotar? | Reservas e recuperação de cancelamentos. |

## 22. Riscos principais

| Risco | Consequência | Direção de mitigação |
|---|---|---|
| O acréscimo de 15% não cobre taxas e perdas | Margem negativa da plataforma | Simular cenários de meios de pagamento antes do lançamento. |
| Cancelamento após primeiro repasse | Falta de recursos para reembolsos | Definir reserva, garantia, débito futuro ou política contratual. |
| Concorrência na última vaga | Venda acima da capacidade | Usar controle transacional de disponibilidade. |
| Eventos duplicados do pagamento | Confirmação ou repasse duplicado | Implementar idempotência e conciliação. |
| Preço alterado sem histórico | Divergências financeiras | Manter composição imutável por venda. |
| Dados cadastrais insuficientes | Bloqueio regulatório ou de pagamento | Definir verificação de identidade com jurídico e provedor. |
| Regras de cancelamento indefinidas | Fluxos incompletos e suporte manual | Resolver antes de liberar vendas reais. |

## 23. Sequência recomendada de entrega

### Fase 1 — Fundação e cadastro

- acesso;
- cadastro PF/PJ;
- perfil;
- dados de recebimento;
- estrutura básica de navegação.

### Fase 2 — Excursão, saída e preço

- excursão reutilizável;
- criação de saída;
- composição de custos;
- simulador de preço;
- rascunho, revisão e publicação.

### Fase 3 — Operação

- dashboard;
- reservas;
- progresso até o mínimo;
- confirmação;
- capacidade e encerramento de vendas.

### Fase 4 — Financeiro

- histórico financeiro;
- primeiro repasse;
- retenção das vendas posteriores;
- repasse final;
- conciliação e tratamento de falhas.

### Fase 5 — Pendências críticas e preparação para produção

- cancelamentos e reembolsos;
- verificação documental;
- regras jurídicas e fiscais;
- moderação;
- segurança, observabilidade e testes completos.

## 24. Prioridade para os primeiros protótipos

Para iniciar a interface, recomenda-se prototipar nesta ordem:

1. dashboard com saídas e resumo financeiro;
2. lista de excursões;
3. fluxo de criação da excursão reutilizável;
4. criação de saída;
5. etapa de custos e simulação de preço;
6. revisão e publicação;
7. detalhe da saída com progresso até o mínimo;
8. reservas;
9. visão financeira e detalhe de repasse;
10. onboarding PF/PJ e dados de recebimento.

O fluxo de simulação de preço e o detalhe da saída devem ser testados com organizadores antes de refinar as demais telas, pois concentram a principal proposta de valor do produto.

## 25. Definição de pronto do MVP

O MVP estará funcionalmente pronto quando:

- um organizador PF ou PJ conseguir concluir seu cadastro;
- conseguir criar uma excursão reutilizável;
- conseguir criar uma saída com capacidade e mínimo;
- o sistema calcular corretamente o preço final;
- a saída puder ser revisada e publicada;
- vendas pagas atualizarem disponibilidade e progresso;
- a saída for confirmada ao atingir o mínimo;
- o dashboard diferenciar vendido, recebido, retido e a receber;
- o primeiro repasse e o repasse final possuírem status rastreável;
- não for possível vender acima da capacidade;
- preços, pagamentos e lançamentos financeiros possuírem histórico auditável;
- as pendências críticas de cancelamento, reembolso, identidade e pagamento forem resolvidas antes das vendas em produção.

## 26. Premissas para design e desenvolvimento

- Cada excursão pode ter várias saídas.
- Cada saída tem capacidade, mínimo, custos, preço, vendas e situação financeira próprios.
- O preço apresentado pelo sistema é uma simulação até a publicação.
- O servidor é a fonte de verdade para preço, disponibilidade, confirmação e valores financeiros.
- O dashboard deve distinguir valores do viajante, do organizador e da plataforma.
- Regras pendentes devem ser modeladas de modo que possam ser adicionadas sem reconstruir o cadastro principal da excursão.
- Nenhuma pendência deste documento deve ser preenchida silenciosamente com uma regra definitiva sem validação do produto.


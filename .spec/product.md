# Visão do Produto — Liete Platform

Documento canônico de produto, alinhado ao PRD oficial (`docs/PRD-Plataforma-Organizador.md`) e ao código implementado na plataforma.

---

## 1. Resumo Executivo

A **Liete Platform** é um ecossistema digital para o turismo rodoviário e regional que conecta **Organizadores de Excursões** e **Viajantes**, estruturado em duas experiências integradas:

1. **Plataforma do Organizador (SaaS B2B/B2Pro)**: Ambiente administrativo onde organizadores pessoa física (PF) e pessoa jurídica (PJ) cadastram excursões reutilizáveis, configuram saídas com capacidade e mínimo de passageiros, simulam custos e margens, publicam vagas, acompanham o preenchimento de grupos em tempo real e gerenciam repasses financeiros em duas etapas.
2. **Portal do Viajante (B2C / Marketplace)**: Catálogo público de excursões, busca por destino/data, visualização de detalhes do roteiro, fotos e inclusões, fluxo de checkout/reserva e painel "Minhas Excursões" para visualização de ingressos e vouchers.

---

## 2. Personas e Perfis de Usuário

### 2.1 Organizador Pessoa Física (PF)
- Empreendedor individual ou guia autônomo que organiza viagens em nome próprio.
- Necessita de cadastro com CPF, contato direto e conta bancária para recebimento dos repasses.

### 2.2 Organizador Pessoa Jurídica (PJ)
- Agência de viagens, operadora receptiva ou transportadora turística.
- Necessita de cadastro com CNPJ, razão social, responsável legal e conta bancária de pessoa jurídica.

### 2.3 Viajante (Consumidor Final)
- Turista interessado em viagens de bate-volta, feriados e fins de semana.
- Busca clareza sobre inclusões no pacote, confiança na confirmação da saída e facilidade de pagamento.

### 2.4 Operação Interna da Plataforma
- Equipe de moderação, análise de conformidade de publicações, conciliação financeira e suporte a cancelamentos/estornos.

---

## 3. Principais Propostas de Valor

1. **Precificação Transparente e Automatizada**: O organizador informa custos fixos, custos variáveis e margem desejada; o sistema calcula o preço de venda necessário com base no quórum mínimo.
2. **Confirmação Baseada em Quórum Mínimo**: A excursão passa do estado *Disponível* para *Confirmada* assim que a meta mínima de participantes é atingida, dando segurança ao organizador e ao viajante.
3. **Fluxo de Repasses em Duas Etapas**:
   - **1º Repasse**: Liberação de parcela inicial após a confirmação da saída para adiantamento de custos operacionais (transporte, hospedagem, guias).
   - **2º Repasse (Final)**: Liberação do saldo restante retido após a realização da viagem.

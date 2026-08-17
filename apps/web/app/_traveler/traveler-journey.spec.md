# Jornada: Aventureiro

## Objetivo

Permitir que uma pessoa descubra excursões, compare informações, reserve vários ingressos, informe participantes, acesse ou crie uma conta, simule o pagamento e acompanhe a viagem até o pós-compra.

## Rotas

- `/excursoes/`: busca, filtros, ordenação, resultados e estado vazio.
- `/excursoes/[slug]/`: galeria, roteiro, embarque, organização, políticas e reserva.
- `/checkout/[slug]/`: ingressos, participantes, acesso, pagamento e revisão.
- `/checkout/[slug]/sucesso/`: confirmação e próximos passos.
- `/minhas-excursoes/`: próximas, passadas e canceladas.
- `/minhas-excursoes/[reserva]/`: voucher, participantes, pagamento, suporte e cancelamento.
- `/minha-conta/`: dados pessoais, segurança e notificações.

## Regras simuladas

- Uma reserva aceita de um a cinco ingressos.
- Cada participante informa nome, documento, nascimento e contato de emergência.
- O checkout permite preenchimento antes do login e exige acesso antes do pagamento.
- Acesso por e-mail e senha, com cadastro e recuperação simulados.
- Pagamento por Pix ou cartão em até 12 parcelas. Juros ainda não são calculados nem prometidos.
- Preço e disponibilidade permanecem estáveis durante o checkout.
- Cancelamento é solicitado pela área logada e não implica estorno automático.
- O voucher representa toda a reserva e identifica individualmente os participantes.

## Estados

- Busca com resultados e sem resultados.
- Excursão disponível, últimas vagas e esgotada.
- Participantes incompletos.
- Conta conectada, criada ou recuperação solicitada.
- Pix, cartão, pagamento simulado e confirmação.
- Reserva próxima, passada, cancelada e cancelamento solicitado.
- Suporte solicitado e preferências salvas localmente.

## Responsive Behavior

No mobile, todas as páginas começam em uma coluna. Filtros são recolhíveis, detalhes usam CTA fixo, reservas viram cartões verticais e nenhum fluxo depende de tabela ou rolagem horizontal. No desktop, o checkout distribui progresso, conteúdo e resumo em colunas laterais; abaixo de 900 px, o progresso volta para o topo e o resumo fica depois da etapa.

## Accessibility

Há navegação de salto, landmarks, títulos hierárquicos, labels persistentes, estado textual além da cor, controles nativos, foco visível, alvos de 44 px, progressos anunciados, erros programáticos e equivalência textual para galeria, avaliação e voucher.

## Limites

Não existem autenticação, persistência, disponibilidade em tempo real, processamento financeiro, QR Code real, envio de notificações ou integração com suporte. Todas as ações permanecem locais e simuladas.

## Componentes do Design System

`Avatar`, `Badge`, `BrandLogo`, `Button`, `Checkbox`, `DateInput`, `EmptyState`, `FlowStepper`, `Gallery`, `Input`, `JourneyNavigation`, `ModalDialog`, `Pagination`, `Radio`, `Rating`, `Search`, `Select`, `StatusChip`, `Stepper`, `Tabs`, `ToastAlert` e `TripCard`.

# Especificação de Requisitos — FEAT-003: Prontidão para Produção e Dados Reais

- **Feature**: FEAT-003 (Production Readiness & Live Data Finalization)
- **Status**: `APPROVED`
- **Data**: 2026-08-17
- **Autor**: Antigravity SDD Spec-Writer

---

## 1. Contexto e Justificativa

A plataforma Liete possui suas estruturas de dados e contratos de backend definidos, porém apresentava vestígios da fase de prototipagem (textos de simulação, dados fictícios pré-populados e ausência de middleware SSR para sincronização contínua de sessão). Esta feature estabelece os requisitos mandatórios para fechar o sistema e deixá-lo 100% apto para o ambiente de produção.

---

## 2. Requisitos Funcionais

### REQ-001: Middleware de Autenticação SSR e Persistência de Sessão
- **Descrição**: O sistema deve implementar o middleware oficial do Next.js integrado ao `@supabase/ssr` para atualizar e sincronizar os cookies de autenticação em todas as rotas da aplicação.
- **Motivação**: Garantir que o login permaneça ativo durante navegações, recarregamento de página e chamadas Server Components.
- **Prioridade**: Alta.
- **Acceptance Criteria**: AC-001, AC-002, AC-003.

### REQ-002: Contexto Global de Autenticação no Cliente
- **Descrição**: Criar um `AuthProvider` e hook `useAuth` no frontend para sincronizar dinamicamente o estado do usuário logado (nome, avatar, perfil, papel) em todos os cabeçalhos (`PublicHeader`, `TravelerShell`, `OrganizerAppShell`).
- **Motivação**: Refletir imediatamente as credenciais reais do usuário autenticado e permitir logout seguro.
- **Prioridade**: Alta.
- **Acceptance Criteria**: AC-004, AC-005.

### REQ-003: Limpeza de Valores Demo e Textos de Simulação
- **Descrição**: Remover todos os dados pré-preenchidos de teste nos formulários de login/cadastro e eliminar todos os avisos de "Experiência simulada" ou "Ambiente de demonstração".
- **Motivação**: Oferecer uma experiência de produto final e profissional pronta para o usuário final.
- **Prioridade**: Alta.
- **Acceptance Criteria**: AC-006, AC-007, AC-008.

### REQ-004: Conexão Total da Área do Organizador com o Supabase
- **Descrição**: As páginas de Visão Geral (`/organizador/`), Excursões (`/organizador/excursoes/`), Nova Excursão (`/organizador/excursoes/nova/`), Financeiro (`/organizador/financeiro/`) e Perfil (`/organizador/perfil/`) devem carregar e persistir dados reais exclusivamente no Supabase.
- **Motivação**: Permitir que organizadores reais gerenciem seus negócios sem interferência de dados mockados.
- **Prioridade**: Alta.
- **Acceptance Criteria**: AC-009, AC-010, AC-011, AC-012, AC-013.

### REQ-005: Publicação Real de Excursões sem Trava Simulada
- **Descrição**: O assistente de criação de excursões deve permitir publicação direta no banco de dados com feedback de sucesso e redirecionamento para a listagem.
- **Motivação**: Fluxo operacional de ponta a ponta para organizadores.
- **Prioridade**: Alta.
- **Acceptance Criteria**: AC-014, AC-015.

### REQ-006: Catálogo e Detalhes de Excursões Conectados ao Banco
- **Descrição**: A Home (`/`), o Catálogo (`/excursoes/`) e os Detalhes (`/excursoes/[slug]/`) devem consultar registros reais de excursões publicadas na tabela `public.excursions`.
- **Motivação**: Apresentar catálogo dinâmico e consistente com os dados cadastrados.
- **Prioridade**: Alta.
- **Acceptance Criteria**: AC-016, AC-017, AC-018.

### REQ-007: Área do Viajante e Checkout Integrados
- **Descrição**: A página `/minha-conta/` e `/minhas-excursoes/` devem refletir os dados e reservas reais do usuário logado. O checkout deve registrar pedidos na tabela `public.orders`.
- **Motivação**: Garantir a jornada completa do comprador de ingressos.
- **Prioridade**: Alta.
- **Acceptance Criteria**: AC-019, AC-020, AC-021.

### REQ-008: População Inicial (Seed) de Excursões de Produção
- **Descrição**: Disponibilizar e executar script de seed com excursões iniciais de alta qualidade para enriquecer a base de dados em produção.
- **Motivação**: O ambiente em produção deve inaugurar com opções disponíveis para navegação e compra.
- **Prioridade**: Média.
- **Acceptance Criteria**: AC-022.

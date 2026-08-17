# Technical Debt & Baseline Limitations

Este documento registra limitações técnicas conhecidas, débitos técnicos herdados e pendências de validação identificadas durante o discovery do repositório existente.

> [!NOTE]
> Conforme o princípio **PRESERVE BEFORE REFACTOR**, estes itens são catalogados para conscientização da equipe e governança de futuras alterações, e **NÃO** devem ser refatorados de forma oportunista sem uma SPEC ou solicitação formal do usuário.

---

## 1. Pendências e Limitações Catalogadas

### DEBT-001: Execução Isolada de Testes de Componentes no Ambiente Windows
- **Contexto**: A suíte de testes de `apps/web` (Node Test Runner) executa com sucesso total (100% pass), enquanto a suíte Vitest em `packages/ui-web` depende de resolução de symlinks pnpm no Windows ou execução via container CI.
- **Impacto**: A validação em ambiente Windows local deve utilizar prioritariamente a suíte Node Test Runner e TypeScript Typecheck, enquanto o Vitest roda no CI Linux.
- **Ação Recomendada**: Criar task específica caso seja solicitado suporte aprimorado a runners alternativos.

### DEBT-002: Persistência Real Supabase vs Mock Data em Dashboards
- **Contexto**: Diversas telas administrativas (`/organizador`, `/organizador/financeiro`, `/organizador/excursoes`) utilizam mocks realistas tipados (`*-dashboard-data.ts`) enquanto os clientes Supabase (`apps/web/lib/supabase`) já estão integrados.
- **Impacto**: Transição progressiva para leitura de tabelas Supabase reais deve ser governada via fluxo de mudança (`CHANGE-XXX`).
- **Ação Recomendada**: Especificar migrations e schemas Supabase à medida que as telas forem conectadas ao banco em produção.

### DEBT-003: Validação de Upload de Imagens no Wizard de Excursões
- **Contexto**: O componente `MediaUploader` em `packages/ui-web` simula o upload visualmente, mas o armazenamento final em bucket de Storage (ex: Supabase Storage) ainda está desacoplado.
- **Impacto**: Necessário criar política de bucket e upload assíncrono quando a feature de storage for solicitada.

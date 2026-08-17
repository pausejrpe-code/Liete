# Constituição do Projeto — Liete Platform

Esta Constituição estabelece as regras imutáveis e de mais alta prioridade para o desenvolvimento, manutenção e evolução da plataforma Liete. Todas as contribuições humanas e automatizadas devem respeitar estes mandamentos.

---

## 1. Desenvolvimento e Governança

1. **Toda nova feature relevante possui SPEC**: Nenhuma funcionalidade substantiva é escrita diretamente sem Requisitos (`requirements.md`) e Critérios de Aceitação (`acceptance.md`).
2. **Mudanças relevantes de comportamento possuem SPEC**: Qualquer modificação em regras de negócio ou contratos de dados existentes deve ser documentada via fluxo de mudança (`CHANGE-XXX`).
3. **Proibição de Requisitos Não Especificados**: Nenhum agente ou desenvolvedor pode inventar ou implementar requisitos que não tenham sido validados e formalizados na SPEC.
4. **Vínculo Obrigatório de Tarefas**: Toda `TASK-XXX` deve estar explicitamente associada a um `REQ-XXX` e a um `AC-XXX`.
5. **Critérios de Aceitação Verificáveis**: Todo `AC-XXX` deve ser testável e objetivo (verdadeiro ou falso).
6. **Não Modificar Código Não Relacionado**: Proibido tocar em arquivos, funções ou estilos que não façam parte do escopo explícito da tarefa.
7. **Proibição de Refatoração Oportunista**: Proibido alterar códigos legados funcionais por mera preferência estilística enquanto se trabalha em outra tarefa.
8. **Justificativa de Dependências**: Proibido adicionar novas dependências externas sem justificativa formal aprovada em `design.md`.
9. **Preservação de Compatibilidade**: Preservar compatibilidade de contratos de dados existentes (`dsb-state-*.json`, modelos de excursão, interfaces Supabase).

---

## 2. Arquitetura e Engenharia

1. **Respeito à Topologia do Monorepo**: Manter a separação estrita entre `@liete/tokens` (Style Dictionary), `@liete/ui-web` (React UI Library) e `@liete/web` (Next.js Application).
2. **Não Redesenhar Módulos sem Necessidade**: Respeitar as implementações existentes e evoluir o sistema incrementalmente.
3. **Preservar Separação de Responsabilidades**:
   - Componentes visuais genéricos residem em `packages/ui-web`.
   - Páginas, roteamento e fluxos de negócio integrados residem em `apps/web`.
   - Tokens de design residem em `packages/tokens`.
4. **Evitar Arquiteturas Paralelas**: Utilizar as bibliotecas e utilitários já adotados no projeto (CSS Modules, Supabase Client/Server, Node Test Runner, Vitest).

---

## 3. Segurança e Privacidade

1. **Proteção Absoluta de Segredos**: Nunca expor tokens, chaves privadas ou credenciais reais no código-fonte ou no controle de versão.
2. **Sem Logs de Dados Sensíveis**: Proibido registrar senhas, tokens de autenticação ou documentos em logs de aplicação ou console.
3. **Operações Não Destrutivas**: Proibido executar comandos destrutivos no banco de dados (`DROP`, `TRUNCATE`, `DELETE` sem filtro) sem confirmação humana explícita.
4. **Zero Telemetria Oculta**: O sistema não conterá serviços de telemetria ou rastreamento não autorizados.

---

## 4. Qualidade e Definition of Done

1. **Evidência Obrigatória**: Nenhuma verificação é aceita de forma autodeclaratória; toda asserção requer testes executados, builds bem-sucedidos ou evidências verificáveis.
2. **Prevenção de Regressões**: Toda mudança deve executar as suítes de teste existentes das áreas correlatas.
3. **Critério de Conclusão**: Uma entrega só atinge o status `COMPLETE` quando 100% dos requisitos obrigatórios estiverem validados como `PASS` e a verificação de regressões for bem-sucedida.

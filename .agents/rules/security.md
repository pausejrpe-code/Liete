# Security & Data Protection Rule

Esta regra define os padrões inegociáveis de segurança, proteção de dados e integridade de ambiente para os agentes no projeto **Liete Platform**.

---

## 1. Gestão de Segredos e Credenciais

1. **PROIBIÇÃO DE CREDENCIAIS NO CÓDIGO**: Nunca insira senhas, chaves privadas, Service Role Keys do Supabase, tokens de API de terceiros ou credenciais reais em arquivos rastreados pelo Git.
2. **Uso Exclusivo de Variáveis de Ambiente**: Utilize exclusivamente variáveis de ambiente (`.env.local` não comitado) acessadas via `process.env`.
3. **Logs Seguros**: Nunca logue dados sensíveis, tokens de autenticação (JWT), senhas em texto puro ou documentos sensíveis (CPF, CNPJ, dados bancários) nos consoles ou outputs.

---

## 2. Operações no Banco de Dados e Destrutivas

1. **PROIBIÇÃO DE OPERAÇÕES DESTRUTIVAS AUTOMÁTICAS**: Nenhuma operação do tipo `DROP TABLE`, `DROP DATABASE`, `TRUNCATE` ou `DELETE` em massa sem cláusula `WHERE` estrita pode ser proposta ou executada sem autorização humana explícita.
2. **Migrations Seguras**: Migrations que envolvam deleção de colunas ou migração de tipos devem ser não-destrutivas (adicionar coluna nova → migrar dados → descontinuar coluna antiga em fases).

---

## 3. Privacidade e Conformidade (LGPD)

1. **Dados de Teste e Mocks**: Utilize apenas dados sintéticos/anônimos em mocks, fixtures e testes.
2. **Validação de Documentos**: Respeite os algoritmos oficiais de validação e formatação de CPF e CNPJ (`brazilian-document.ts`) sem armazenar documentos desnecessários.
3. **Zero Telemetria Externa Não Autorizada**: Nenhuma ferramenta ou script introduzido pelo SDD conterá envio de telemetria, rastreamento de dados de usuário ou requisições de rede para servidores externos não homologados.

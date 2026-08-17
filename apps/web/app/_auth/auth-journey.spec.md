# Jornada: Cadastro e acesso

## Actors

- Aventureiro: compra ingressos, informa participantes e acompanha reservas.
- Organizador: cria excursões, acompanha vendas e recebe valores após aprovação.

## Rules

- Cada e-mail pertence exclusivamente a um tipo de conta.
- O login é único, mas exige que a pessoa indique o tipo de conta criado.
- Cadastro do aventureiro começa com nome, e-mail, senha e termos.
- Cadastro do organizador começa com responsável, CPF ou CNPJ, e-mail, senha, termos e escolha PF/PJ.
- Aventureiro pode explorar sem verificar e-mail, mas precisa validá-lo antes do pagamento.
- Organizador pode explorar o painel e criar rascunhos sem validar a identidade no onboarding.
- A validação da identidade é solicitada somente quando o organizador tenta publicar pela primeira vez.
- Publicar exige identidade validada; recebimentos continuam sujeitos aos dados bancários e à análise da plataforma.

## Routes

- `/entrar/`: login único e distinção do tipo de conta.
- `/cadastro/`: escolha do objetivo.
- `/cadastro/aventureiro/`: cadastro inicial do comprador.
- `/cadastro/organizador/`: cadastro inicial PF/PJ.
- `/recuperar-senha/`: recuperação por tipo de conta.
- `/verificar-email/`: verificação simulada e saídas seguras.
- `/organizador/onboarding/`: perfil, endereço, dados fiscais, recebimentos e revisão, sem bloqueio de identidade.

## States

- Conta de aventureiro ou organizador reconhecida.
- Senha incorreta.
- E-mail pertencente ao outro tipo de conta.
- Termos pendentes e senhas divergentes.
- Recuperação e reenvio solicitados.
- E-mail pendente ou verificado.
- Organizador PF/PJ, documento informado, identidade não verificada e dados bancários em análise.

## Accessibility

Labels persistentes, mensagens de correção, foco visível, tabs navegáveis por teclado, status com texto, landmarks nativos, um `h1` por página e alvos mínimos de 44 px.

## Limits

Não há autenticação, persistência, envio de e-mail, verificação documental, validação bancária ou autorização reais. Nenhum dado informado sai do navegador.

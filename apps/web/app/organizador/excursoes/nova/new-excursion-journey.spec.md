# Jornada: Nova excursão (mock)

## Objetivo

Permitir que um organizador individual percorra e valide a criação de uma
excursão antes da integração com Supabase, pagamentos e regras financeiras.

O organizador pode explorar a ferramenta e salvar rascunhos sem validar a
identidade. A tentativa de publicar apresenta o bloqueio de segurança, explica
o selo de conta verificada e conduz à validação simulada sem descartar o
rascunho. A publicação só é liberada depois dessa validação.

## Etapas da jornada

1. Informações básicas.
2. Destino, roteiro e fotos.
3. Datas e embarque.
4. Preço, taxas e capacidade.
5. Revisão e publicação.

Cada item do progresso corresponde a uma única tela. No desktop, o progresso
fica em uma coluna lateral; no mobile, vira uma barra segmentada acima do
formulário.

## Estados

- Rascunho vazio.
- Rascunho parcialmente preenchido.
- Etapa com erro.
- Etapa concluída.
- Identidade não verificada com publicação bloqueada.
- Validação de identidade simulada.
- Confirmação de publicação.
- Publicação simulada com sucesso.

## Regras simuladas

- Uma única saída por excursão.
- Uma categoria de passageiro e preço calculado automaticamente.
- Mínimo de participantes maior que zero.
- Capacidade total igual ou maior que o mínimo.
- Transporte dividido pelo mínimo de participantes.
- Custo por participante e lucro mínimo total informados pelo organizador.
- Pelo menos uma imagem para avançar.
- Taxa administrativa de 5% e acréscimo de 15% calculados separadamente sobre o valor-base, sem efeito financeiro real.
- A política de cancelamento é apresentada na revisão.
- Nenhum dado é persistido ou enviado ao Supabase.

## Componentes reutilizados

- OrganizerAppShell e PageHeader.
- FlowStepper responsivo para as cinco etapas de publicação.
- JourneyNavigation para as ações inferiores no mobile.
- Input, DateInput, MoneyInput, Select e Textarea.
- Stepper para mínimo e capacidade.
- PriceBreakdown para apresentar a composição calculada do ingresso.
- MediaUploader para imagens.
- Gallery para a conferência das fotos na revisão.
- StatusChip, ToastAlert e ModalDialog para estados e feedback.
- Button para ações.

## Acessibilidade

- No desktop, o progresso usa uma lista ordenada com `aria-current="step"`.
- No mobile, o progresso usa `role="progressbar"` com nome, valor atual, mínimo e máximo.
- O botão de retorno do cabeçalho mobile possui nome acessível.
- Títulos recebem foco quando a etapa muda.
- Erros aparecem no campo e em aviso geral.
- Atualizações do rascunho usam região `aria-live`.
- Controles indisponíveis são desabilitados, não apenas escondidos por cor.
- Publicação exige confirmação em diálogo modal.
- A jornada usa a rolagem natural da página, sem áreas internas de rolagem.
- No mobile, o indicador de etapa permanece visível abaixo do cabeçalho fixo.

## Fora do escopo

- Supabase, persistência e autenticação.
- Pagamentos, reservas, reembolsos e repasses.
- Upload real de imagens.
- Aprovação ou moderação da plataforma.

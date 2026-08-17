# Component Spec: MediaUploader

## Objective

Selecionar e acompanhar o envio de imagens de capa ou galeria, com alternativas de clique e arrastar/soltar.

## Anatomy

- Título opcional.
- Zona de upload.
- Input de arquivo nativo.
- Mensagem, helper e ação com `Button`.
- Barra de progresso ou prévias, conforme o estado.

## Variants

Layouts `regular` (560 px) e `compact` (320 px). Estados `empty`, `uploading`, `success` e `error`.

## Properties

`layout`, `state`, `progress`, `previewItems`, `heading`, `actionLabel`, `showTitle`, `showHelper`, `showAction`, `onFilesSelected` e propriedades nativas do input de arquivo.

## Tokens

Usa superfícies, feedback, foco, tipografia e `component.mediaUploader.*`.

## Content

Informe formatos e limites aceitos. `heading` e `actionLabel` permitem adaptar o texto ao tipo de mídia sem alterar o comportamento do componente. Erros devem oferecer recuperação. As prévias devem ter alternativa textual quando forem imagens reais.

## Responsive Behavior

Ambos os layouts são limitados a 100% do contêiner. A faixa compacta reduz padding, progresso e miniaturas.

## Accessibility

Input nativo rotulado, ação por `Button`, progresso com valores ARIA, `aria-busy` durante o envio e erro anunciado como alerta. Clique e arrastar/soltar são equivalentes.

## Code API

`MediaUploaderProps` estende atributos nativos de `<input type="file">`.

## Do Not Use

Não usar como galeria de visualização nem para arquivos genéricos sem revisar formatos, textos e prévias.

## Tests

Validar seleção, drop, formatos, progresso, disabled durante envio, sucesso, erro, foco, teclado e responsividade.

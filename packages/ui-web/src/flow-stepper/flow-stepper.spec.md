# Component Spec: FlowStepper

## Objective

Apresentar o progresso de criação de uma excursão em cinco etapas, com leitura vertical no desktop e compacta no mobile.

## Anatomy

- Cabeçalho desktop com título e razão da etapa.
- Cinco indicadores, labels e conectores verticais no desktop.
- Cabeçalho mobile com ação de voltar e título da jornada.
- Barra segmentada, etapa atual e razão no mobile.

## Variants

| Variante | Objetivo | Usar quando | Evitar quando |
| --- | --- | --- | --- |
| `responsive` | Alternar automaticamente entre desktop e mobile. | Jornadas reais. | Testes visuais determinísticos. |
| `desktop` | Exibir etapas, estados e conectores. | Contêineres acima de 760 px. | Telas estreitas. |
| `mobile` | Reduzir a progressão a segmentos e etapa atual. | Celulares e colunas estreitas. | Quando os cinco labels precisam ficar simultaneamente visíveis. |

## Sizes

| Tamanho | Dimensões/tokens | Contexto |
| --- | --- | --- |
| Desktop | 268 px, padding controlado pelo contêiner | Coluna lateral da jornada administrativa. |
| Mobile | 393 px, padding 16 px | Jornada mobile-first. |

## Properties

`current`, `steps`, `layout`, `title`, `mobileTitle`, `showHeader`, `onBack` e `backLabel`.

## States

Etapas desktop podem estar `complete`, `current` ou `upcoming`. No mobile, segmentos até a etapa atual ficam completos. Valores fora do intervalo são normalizados.

## Tokens

Usa tokens semânticos de ação, sucesso, texto, borda e superfície; escalas tipográficas Title/MD, Label/MD e Label/SM; e `component.flowStepper.*`.

## Content

Use cinco labels orientadas a tarefas. O título mobile deve identificar a jornada, não a etapa. Labels longas quebram linha sem criar rolagem horizontal.

## Responsive Behavior

`responsive` troca para a apresentação mobile em 900 px. O componente nunca cria scroll horizontal.

## Figma

Mapeia o nó `102:607` e sua variante mobile: propriedades `Current`, `Layout`, `Show Header`, labels das cinco etapas e `Title`.

## Accessibility

Usa `<nav>` com nome acessível, lista ordenada no desktop, `aria-current="step"` e `progressbar` com valor atual, total e descrição textual no mobile. A ação de voltar é um botão de 44 px com nome configurável.

## Code API

`FlowStepperProps` estende atributos nativos de `<nav>`. `steps` recebe objetos `{ id, label }` e `current` é baseado em 1.

## Examples

Use `layout="responsive"` com `current={3}` para apresentar o estágio Preço em uma jornada real.

## Do Not Use

Não usar para progresso percentual, upload ou metas numéricas. Para esses casos, use `GoalProgress` ou o progresso do `MediaUploader`.

## Tests

Validar os três layouts, cinco estados, valores fora do intervalo, labels customizadas, ação de voltar, semântica de progresso, zoom, alto contraste e textos longos.

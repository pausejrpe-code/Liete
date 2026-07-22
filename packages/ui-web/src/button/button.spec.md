# Component Spec: Button

## Objective

Representar ações de interface para reserva, criação e gestão de viagens.

## Anatomy

- Container semântico `<button>`: interação, foco e estado desabilitado.
- Rótulo: nome acessível e descrição direta da ação.

## Variants

| Variant | Purpose | Use when | Avoid when |
| --- | --- | --- | --- |
| `primary` | Ação principal | Há uma ação prioritária clara | Em várias ações concorrentes |
| `secondary` | Ação complementar destacada | A ação merece destaque sem competir com a primária | Para navegação discreta |
| `ghost` | Ação de baixa ênfase | A ação é contextual ou terciária | Quando a descoberta da ação é crítica |

## Sizes

| Size | Height | Typography | Intended context |
| --- | --- | --- | --- |
| `sm` | 36 px | Title/SM, 14/20 | Interfaces compactas; 44 px em dispositivos de toque |
| `md` | 44 px | Title/MD, 16/22 | Formulários e fluxos comuns |
| `lg` | 52 px | Title/MD, 16/22 | CTAs e áreas de destaque |

## Properties

| Property | Type | Default | Behavior |
| --- | --- | --- | --- |
| `variant` | `primary \| secondary \| ghost` | `primary` | Define a hierarquia da ação |
| `size` | `sm \| md \| lg` | `sm` | Define altura e tipografia |
| `disabled` | `boolean` | `false` | Usa a semântica nativa e bloqueia a ação |
| `children` | `ReactNode` | obrigatório | Fornece o rótulo visível e acessível |

Todas as demais propriedades nativas de `<button>` são aceitas. O tipo padrão é `button` para evitar envio acidental de formulários.

## States

| State | Visual treatment | Behavior | Semantics |
| --- | --- | --- | --- |
| Default | Cor da variante | Interativo | Botão nativo |
| Hover | Tom mais escuro | Apenas apontador | Sem alteração semântica |
| Focus visible | Contorno rosa com afastamento | Teclado | Foco nativo preservado |
| Pressed | Mesmo tom forte do hover | Durante ativação | Comportamento nativo |
| Disabled | Fundo neutro ou texto neutro no ghost | Sem eventos | Atributo `disabled` |

`disabled` tem precedência sobre hover, pressed e focus.

## Tokens

O componente consome somente tokens semânticos e tokens `component.button.*`. Os valores originais vieram das variáveis do nó Figma `7:61`.

## Content

Usar verbos objetivos, como “Reservar agora”. O rótulo não quebra linha; textos maiores aumentam a largura. Não usar rótulo vazio.

## Responsive Behavior

O botão abraça o conteúdo por padrão. A classe externa pode controlar sua largura. Em apontadores de toque, `sm` sobe para uma área mínima de 44 px de altura.

## Figma

Correspondência com `Style = Primary | Secondary | Ghost` e `Size = Small | Medium | Large`. Hover é comportamento CSS; disabled é uma propriedade booleana nativa no código.

## Accessibility

Usa elemento nativo, ativação por Enter/Espaço e foco visível. O texto fornece o nome acessível. Para ação icon-only, criar uma extensão futura com `aria-label`, sem remover o rótulo desta API prematuramente.

## Code API

```tsx
<Button variant="primary" size="lg">
  Reservar agora
</Button>
```

## Do Not Use

Não usar para navegação entre páginas; nesse caso, utilizar um componente Link com aparência correspondente. Não usar várias ações `primary` no mesmo grupo.

## Tests

- Renderização e nome acessível.
- Variantes e tamanhos.
- Estado disabled bloqueando eventos.
- Hover, foco e contraste em teste visual.
- Labels longos, zoom e touch target.


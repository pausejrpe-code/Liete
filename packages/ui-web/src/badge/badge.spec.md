# Component Spec: Badge

## Objective

Representar estados compactos de viagem, reserva, pagamento e verificação.

## Anatomy

- Container textual não interativo.
- Ponto opcional e decorativo para reforçar o estado sem depender apenas da cor.
- Rótulo visível que comunica o significado.

## Variants

| Tone | Purpose |
| --- | --- |
| `success` | Estado disponível ou concluído |
| `attention` | Estado pendente que exige atenção |
| `error` | Falha ou cancelamento |
| `disabled` | Estado indisponível |
| `pure` | Destaque positivo de alta intensidade |
| `secondary` | Destaque da marca secundária |
| `dark` | Badge sobre fundos claros com alto contraste |

## Properties

| Property | Type | Default | Behavior |
| --- | --- | --- | --- |
| `tone` | `BadgeTone` | `success` | Define significado e tratamento visual |
| `label` | `string` | `Disponível` | Fornece a informação legível |
| `showDot` | `boolean` | `true` | Exibe o reforço visual quando a variante o possui |

## States

O badge é informativo e não possui hover, pressed ou disabled interativo. Mudanças dinâmicas importantes devem usar `role="status"` no uso, conforme o contexto.

## Tokens

Usa tipografia Label/SM, espaçamentos 6/12 e cores semânticas de feedback. Os pontos são os vetores exportados do Figma `7:94`.

## Responsive Behavior

Abraça o conteúdo e não quebra a linha. Em espaços estreitos, o contêiner pai deve permitir wrap entre badges.

## Accessibility

O rótulo comunica o estado em texto; o ponto é decorativo e oculto de tecnologias assistivas. Não usar apenas o tom para diferenciar estados com o mesmo rótulo.

## Code API

```tsx
<Badge label="Pagamento pendente" tone="attention" />
```

## Do Not Use

Não usar como botão, filtro selecionável ou único anúncio de uma alteração crítica.

## Tests

- Rótulo visível e variante estável.
- Ponto decorativo e opcional.
- Contraste, zoom e labels longos em teste visual.

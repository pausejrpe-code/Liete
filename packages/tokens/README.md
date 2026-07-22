# Liete tokens

`src/tokens.json` é a fonte canônica, organizada em três camadas:

1. primitivas (`color.green.500`);
2. semânticas (`color.action.primary.default`);
3. específicas de componente (`component.button.background.primary.default`).

O build gera CSS e JavaScript. Futuras saídas para React Native e Flutter devem ser geradas a partir da mesma fonte, sem copiar valores manualmente.

## Motion

As durações, curvas, escalas de feedback e distâncias de deslocamento ficam no grupo `motion` da fonte canônica. Componentes devem consumir esses tokens, manter movimentos curtos e preservar uma alternativa sem deslocamento para `prefers-reduced-motion`.

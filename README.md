# Liete Platform

Monorepo do MVP web e do Liete Design System.

## Estrutura

- `apps/web`: aplicação pública em Next.js.
- `packages/tokens`: fonte canônica dos tokens e saídas por plataforma.
- `packages/ui-web`: componentes React documentados no Storybook.

## Comandos

```bash
pnpm install
pnpm dev
pnpm storybook
pnpm test
pnpm build
```

Os tokens são a camada compartilhável com futuras bibliotecas React Native ou Flutter. Os componentes visuais permanecem específicos de cada plataforma.


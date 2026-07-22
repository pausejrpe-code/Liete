# Component Spec: Avatar

## Objective

Representar uma pessoa por iniciais ou fotografia e indicar verificação.

## Anatomy and variants

Conteúdo circular de 32, 48 ou 72 px; tipos `initials` e `photo`; badge de verificação opcional. Sem foto, usa os assets oficiais de cabeça e ombros do Figma.

## API

`size`, `type`, `initials`, `name`, `src`, `alt` e `verified`.

## Behavior and accessibility

O avatar possui papel de imagem e nome acessível. O estado verificado faz parte do nome anunciado; os elementos decorativos ficam ocultos.

## Figma

Mapeia `Size = Small | Medium | Large`, `Type = Initials | Photo` e `Verified` do nó `16:160`.

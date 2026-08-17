# Component Spec: OrganizerAppShell

## Objective

Provide the responsive structural frame for authenticated organizer pages,
combining the Liete header, desktop sidebar, page context and a product-content
slot without embedding journey-specific business logic. Header and desktop
sidebar remain visible while the document content scrolls.

## Anatomy

- Authenticated header with brand, institutional navigation and account access.
- Desktop sidebar for organizer destinations.
- Main landmark containing `PageHeader`.
- Flexible content slot for the page owned by the consuming application.

## Variants

| Variant | Purpose | Use when | Avoid when |
| --- | --- | --- | --- |
| `layout=responsive` | Switch at the system breakpoint | Product pages | Deterministic visual snapshots |
| `layout=desktop` | Full header and sidebar | Wide administrative layouts | Narrow viewports |
| `layout=mobile` | Compact brand/account topbar | Narrow viewports | Wide administrative layouts |
| `navigation=expanded` | Expanded sidebar or open mobile navigation | Navigation context should be visible | Content needs maximum width |
| `navigation=collapsed` | Icon sidebar or closed mobile navigation | Focus is on content | Users need persistent labels |

## Sizes

| Size | Dimensions/tokens | Intended context |
| --- | --- | --- |
| Desktop | 1280 × 900 | Figma reference and wide shells |
| Mobile | 390 × 844 | Figma reference and compact shells |

## Properties

| Property | Type | Default | Behavior |
| --- | --- | --- | --- |
| `layout` | responsive, desktop, mobile | responsive | Selects responsive structure |
| `navigation` | expanded, collapsed | expanded | Maps to sidebar or mobile navigation |
| `showHeader` | boolean | true | Includes the global authenticated header |
| `showPageHeader` | boolean | true | Includes page title and actions |
| `showContentSlot` | boolean | true | Includes the flexible product-content area |
| `children` | ReactNode | label placeholder | Replaces the slot placeholder |
| `pageHeaderProps` | PageHeader props | component defaults | Configures page context and actions |

## States

| State | Visual treatment | Behavior | Semantics |
| --- | --- | --- | --- |
| Expanded desktop | 200 px labeled sidebar | All organizer destinations visible | Navigation landmark |
| Collapsed desktop | 72 px icon sidebar | Labels remain accessible by name | Current page uses `aria-current` |
| Expanded mobile | Institutional links below topbar | Adds 180 px navigation region | Named navigation landmark |
| Collapsed mobile | Topbar only | Navigation region is removed | No hidden focus targets |
| Scrolling desktop | Header and sidebar remain pinned | Only document content changes position | Landmarks remain available without moving focus |

## Tokens

Uses semantic background, border, text and action tokens; shared spacing,
radius and typography scales; OrganizerAppShell size/header tokens; and the
Sidebar width/height tokens.

## Content

Keep account names and navigation labels concise. The slot accepts arbitrary
application content and expands with it; scrolling belongs to the document, not
to the slot. Page title, subtitle and actions follow `PageHeader` content rules.

## Responsive Behavior

`responsive` switches to the mobile structure at 680 px. The desktop sidebar is
removed and the institutional navigation becomes the expandable header region.
Page actions become equal-width controls through `PageHeader`. The header uses
sticky positioning in both structures. On desktop, the sidebar is pinned below
the header and occupies the remaining viewport height. At high zoom or short
viewports, only the sidebar itself may scroll so every destination remains
reachable.

## Figma

Maps to `OrganizerAppShell` node `251:1067`:

| Contract | Figma | Code |
| --- | --- | --- |
| Layout | Desktop / Mobile | `layout` |
| Navigation | Expanded / Collapsed | `navigation` |
| Header visibility | Show Header | `showHeader` |
| Page context | Show Page Header | `showPageHeader` |
| Content placeholder | Show Content Slot | `showContentSlot` |
| Placeholder copy | Content Label | `contentLabel` |

## Accessibility

- Uses native header, nav, main, section, link and button semantics.
- Every navigation landmark has a distinct accessible name.
- Icon-only collapsed sidebar items retain accessible labels.
- Focus remains visible on links and composed controls.
- Mobile navigation links and account access meet a 44 px target height.
- Removing collapsed mobile navigation also removes its focus targets.
- Persistent regions do not create an additional scroll container around page
  content.

## Code API

Use `children` for product content, `pageHeaderProps` for page actions and
`sidebarItems` for application destinations. `navigation` is controlled by the
consumer so product state and URL behavior remain outside the design system.

## Examples

```tsx
<OrganizerAppShell
  activeSidebarItemId="explore"
  navigation="expanded"
  pageHeaderProps={{ title: "Excursões" }}
>
  <ExcursionList />
</OrganizerAppShell>
```

## Do Not Use

Do not use as a marketing-page layout, a guest checkout shell or a replacement
for local page grids. Use it only for authenticated organizer application
pages.

## Tests

- Desktop and mobile structure for both navigation states.
- Landmark names, current destination and account access.
- Optional header, page header and content regions.
- Children replacing placeholder content.
- Visual regression at 1280 × 900 and 390 × 844.
- Document scrolling with persistent header/sidebar and no nested content scroll.
- Keyboard, zoom, long-label and forced-colors checks.

## Governance

- Status: stable
- Owner: Liete Design System
- Figma source: `251:1067`
- Related components: BrandLogo, BrandIcon, Avatar, Sidebar, PageHeader, Button

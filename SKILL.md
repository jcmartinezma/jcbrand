---
name: jcbrand
description: >-
  Applies JC's personal brand (@jcmartinezma/jcbrand), installed as a direct
  GitHub dependency. Use it when creating or editing UI, CSS, SCSS, Tailwind,
  Next.js, Astro or React; when installing or updating the dependency; and when
  auditing hardcoded colors, sizes or fonts. It does not copy dist/ or fonts/
  into the target project.
---

# jcbrand

JC's brand (José Carlos Martínez). The target project **installs** it as a GitHub dependency (`@jcmartinezma/jcbrand`). Do not copy `dist/` or `fonts/` into its code.

Before writing styles, open:

- [reference/guide.md](reference/guide.md): installation and imports per stack, plus the brand rules (palette, contrast, type, spacing).
- [reference/tokens.md](reference/tokens.md): every semantic token and its value.
- [reference/checklist.md](reference/checklist.md): go through it before calling the integration done.
- [CHANGELOG.md](CHANGELOG.md): when changing version.

If a value in `reference/` does not match `dist/`, `dist/` wins. Do not invent hex values, px values, fonts or tokens that are not in those tables.

## Install

```bash
npm install github:jcmartinezma/jcbrand#semver:^0.2.0
```

- Always use `#semver:…` or `#v<version>`. Without `#`, npm installs `main`, which changes without a version. Check the latest tag in Releases to write the range.
- Import in the global entry, in this order: fonts first, then tokens (use the recipe for the stack).
- Dark theme is the default: do not set any attribute. Light is opt-in with `data-theme="light"` on `<html>`. Do not use `prefers-color-scheme`.
- Update: `npm update @jcmartinezma/jcbrand` (within the range). For another version, change the range. Read the CHANGELOG: if it renamed or removed tokens, run the audit.

## Tokens in components

Use only **semantic** tokens:

- Color: `--color-bg-*`, `--color-surface-*`, `--color-text-*`, `--color-icon-*`, `--color-border-*`.
- Type: `--text-style-*`, `--text-size-*`, `--text-weight-*`, `--text-line-height-*`, `--text-letter-spacing-*`.
- Spacing: `--spacing-2xs` … `--spacing-5xl` (the named ones, not `--spacing-100`).
- Radius: `--border-radius-xs|sm|md|lg|full`.
- Shadow: `--shadow-xs|sm|md|lg|xl`.
- Motion: `--motion-duration-*`, `--motion-delay-*`, `--motion-easing-*`.
- Blur: `--blur-xs|sm|md|lg|xl|2xl`.

Forbidden in components: hex, `rgb(`, `hsl(`, brand px values, a hand-written `font-family`, primitives (`--color-gray-*`, `--color-green-*`, `--color-red-*`, `--color-blue-*`, `--color-white`, `--color-black`, `--font-size-*`, `--spacing-100`, …) and utilities from another scale (Tailwind's gray, indigo or `rounded-md`).

Opacity only exists as a primitive (`--opacity-*`). For a scrim use `--color-bg-overlay`.

## Typography

There are no type classes in the HTML (`text-xl`, `font-bold`…) and no composite token. Compose the role in the component's stylesheet (a rule or a mixin with family, size, weight, line height and tracking). The mixin lives in the target project, not in `node_modules`. The class describes the component (`.card-title`), not the scale.

Families: `--text-style-display` and `--text-style-base` (Rethink Sans), `--text-style-decor` (IBM Plex Mono). Weights and pairs with insufficient contrast: [reference/guide.md](reference/guide.md#brand-rules).

## What not to do

- Copy `dist/` or `fonts/` into the target repo.
- A generic UI: Inter, system-ui as the main family, link blue, shadows or radii from another system.
- Accent (green) in large blocks or on every link: one emphasis per view. In the light theme, `--color-text-accent` is not readable on the background.
- Text below WCAG AA 4.5:1, or border, icon and focus below 3:1.
- Removing the keyboard ring. Use `:focus-visible`, not only `:hover`.
- Duplicating colors in a `.light` class: the light theme is already inherited through `data-theme="light"`.
- Modifying `node_modules/@jcmartinezma/jcbrand`.

## Audit

Run it when integrating the brand into existing UI, after updating if the CHANGELOG renames or removes tokens, or when asked to review hardcoded values. Search outside `node_modules`:

- **Color:** `#[0-9a-fA-F]{3,8}`, `rgb(`, `hsl(`, `oklch(`, named colors used as design, Tailwind arbitrary values (`bg-[#`, `text-[#`).
- **Type:** any `font-family` that is not `var(--text-style-…)`; loose `font-size`, `font-weight`, `line-height` or `letter-spacing`; Google Fonts or `next/font/google`.
- **Measure:** px in padding, margin, gap, radius, blur or shadow; durations that are not `var(--motion-…)`.
- **Primitives** in components (`var(--color-gray-`, `var(--color-green-`, `var(--spacing-100)`, `var(--opacity-`…).
- **Names** that the CHANGELOG marks as renamed or removed.

`transparent`, `currentColor` and a reset `0` can stay.

For each finding, propose **one** semantic token from [reference/tokens.md](reference/tokens.md), chosen by property (background → `--color-bg-*`/`--color-surface-*`, text → `--color-text-*`, border → `--color-border-*`…).

- If the hex or px value is not on the scale, do not round it to another one: say so and use the token for the **role**.
- If the old token no longer exists, use the CHANGELOG's replacement; if there is none, the semantic token for the same role.
- If you do not know the role, ask or leave it marked. Do not delete blindly.

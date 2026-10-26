# Usage guide

How to integrate jcbrand into a project and how to apply the brand. The name and value of each token are in [tokens.md](tokens.md); they are not repeated here.

> License ([LICENSE](../LICENSE)): the **Integration** part (installation and per-stack recipes) is MIT. The **Brand rules** part (palette, contrast, typography and use of the values) belongs to JC: all rights reserved.

## Integration

### Install

```bash
npm install github:jcmartinezma/jcbrand#semver:^0.2.0
```

The repo is public: no `.npmrc`, token or registry is needed. Always use `#semver:…` or `#v<version>`; without `#` it installs `main`, which has no version. If the project still has the old GitHub Packages `.npmrc`, uninstall the package, install with the command above and delete those lines.

What gets installed lives in `node_modules/@jcmartinezma/jcbrand/` (`dist/` and `fonts/`). Do not edit it or copy its files: the next `npm install` overwrites it. Mixins and component CSS live in the target project.

### Import and base

Fonts first, tokens after, **once** in the global entry. In a CSS Module the bundler may encapsulate the `@import`, and the variables will not reach the rest of the page.

```js
import '@jcmartinezma/jcbrand/fonts.css';
import '@jcmartinezma/jcbrand/dist/css/tokens.css';
```

```css
@import "@jcmartinezma/jcbrand/fonts.css";
@import "@jcmartinezma/jcbrand/dist/css/tokens.css";
```

The `body` cannot keep the Tailwind or browser preflight. This is the base, and it goes **after** any preflight:

```css
body {
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
  font-family: var(--text-style-base);
  font-size: var(--text-size-sm);
  font-weight: var(--text-weight-normal);
  line-height: var(--text-line-height-md);
  letter-spacing: var(--text-letter-spacing-normal);
}
```

Without an attribute the theme is dark. Light, only if the project asks for it: `<html data-theme="light">`.

### Plain CSS

A component has no type utility: the rule gathers the tokens.

```css
.card {
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
  padding: var(--spacing-md);
  border-radius: var(--border-radius-sm);
  box-shadow: var(--shadow-sm);
}

.card-title {
  font-family: var(--text-style-display);
  font-size: var(--text-size-xl);
  font-weight: var(--text-weight-semibold);
  line-height: var(--text-line-height-2xl);
  letter-spacing: var(--text-letter-spacing-normal);
}

.card a {
  color: var(--color-text-primary);
  transition: color var(--motion-duration-fast) var(--motion-easing-standard);
}

.card a:hover {
  color: var(--color-text-secondary-hover);
}
```

```html
<article class="card">
  <h2 class="card-title">Title</h2>
</article>
```

The HTML does not say `text-xl` or `font-semibold`.

### SCSS

`@use … as jcbrand` does not change the name of the custom properties: they are still `--color-bg-primary`. Fonts are not in the generated SCSS: import them separately (above).

```scss
@use "@jcmartinezma/jcbrand/dist/scss" as jcbrand;

@mixin text-title {
  font-family: var(--text-style-display);
  font-size: var(--text-size-xl);
  font-weight: var(--text-weight-semibold);
  line-height: var(--text-line-height-2xl);
  letter-spacing: var(--text-letter-spacing-normal);
}

.card-title {
  @include text-title;
}
```

Mixins live in the target project (`src/styles/type.scss` or next to the component), not in `node_modules`. Vite, webpack and Next's Sass resolve the `@use` against the package export. Plain Sass does not look in `node_modules`: in that case use the CSS import.

### Tailwind

Map **only** semantic tokens to the theme, always with `var(--token)` and never with the hex. The `jc-` prefix avoids overriding Tailwind's default scale. The pattern is the same for every token in [tokens.md](tokens.md): the Tailwind name is the token name with `jc-` in front of the rest.

| jcbrand family | Tailwind 4 (`@theme inline`) | Tailwind 3 (`extend`) |
|---|---|---|
| `--color-bg-*`, `surface`, `text`, `icon`, `border` | `--color-jc-bg-primary` | `colors` → `"jc-bg-primary"` |
| `--spacing-*` | `--spacing-jc-md` | `spacing` → `"jc-md"` |
| `--border-radius-*` | `--radius-jc-sm` | `borderRadius` → `"jc-sm"` |
| `--shadow-*` | `--shadow-jc-sm` | `boxShadow` → `"jc-sm"` |
| `--blur-*` | `--blur-jc-md` | not mapped |
| `--motion-easing-*` | `--ease-jc-standard` | `transitionTimingFunction` → `"jc-standard"` |
| `--motion-duration-*` | not mapped: goes in the component CSS | `transitionDuration` → `"jc-fast"` |

Do not create type utilities (`text-jc-xl`, `font-jc-bold`) or add `fontSize` or `fontFamily` to the theme: type is composed in CSS, as above. Even if you map `bg-jc-bg-primary`, do not use `bg-zinc-900`, `text-white`, `rounded-md` or `shadow-md`: those scales are not jcbrand.

#### Tailwind 4

`@theme inline` makes the utility point to jcbrand's `var(--color-…)`. Without `inline`, the theme may keep a copy that does not react to `[data-theme="light"]`. `tokens.css` goes before `@import "tailwindcss"`.

```css
@import "@jcmartinezma/jcbrand/fonts.css";
@import "@jcmartinezma/jcbrand/dist/css/tokens.css";
@import "tailwindcss";

@theme inline {
  --color-jc-bg-primary: var(--color-bg-primary);
  --color-jc-text-primary: var(--color-text-primary);
  --spacing-jc-md: var(--spacing-md);
  --radius-jc-sm: var(--border-radius-sm);
  --shadow-jc-sm: var(--shadow-sm);
  --blur-jc-md: var(--blur-md);
  --ease-jc-standard: var(--motion-easing-standard);
  /* … one line for each token of each family */
}

/* here, after the preflight, the `body` from above */
```

It gives utilities such as `bg-jc-bg-primary`, `text-jc-text-primary`, `p-jc-md`, `rounded-jc-sm`, `shadow-jc-sm`.

#### Tailwind 3

Same idea in `tailwind.config.js`, with `var()` so the light theme keeps working. The entry CSS imports the sheets and then the Tailwind directives; the `body` goes in a layer after `base`.

```js
/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
      colors: { "jc-bg-primary": "var(--color-bg-primary)" /* … */ },
      spacing: { "jc-md": "var(--spacing-md)" /* … */ },
      borderRadius: { "jc-sm": "var(--border-radius-sm)" /* … */ },
      boxShadow: { "jc-sm": "var(--shadow-sm)" /* … */ },
      transitionTimingFunction: { "jc-standard": "var(--motion-easing-standard)" /* … */ },
      transitionDuration: { "jc-fast": "var(--motion-duration-fast)" /* … */ },
    },
  },
};
```

```css
@import "@jcmartinezma/jcbrand/fonts.css";
@import "@jcmartinezma/jcbrand/dist/css/tokens.css";

@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Next.js and React

Do not use `next/font/google` or `next/font/local` for these families: you would declare the `@font-face` rules again and lose the weights and the `font-display: swap` from `fonts.css`. Import the sheets.

App Router, in the root layout so it covers every route:

```tsx
import "@jcmartinezma/jcbrand/fonts.css";
import "@jcmartinezma/jcbrand/dist/css/tokens.css";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

`globals.css` holds the `body` and the [focus](#focus) rule. The light theme, if it exists, is the attribute on `<html>`, not a provider that rewrites hex values.

Pages Router: the same `import` lines in `pages/_app.tsx`. With Vite + React, in `main.tsx`, before the render. The `url('./files/...')` entries in `fonts.css` are resolved by the bundler inside `node_modules`: do not copy the `.woff2` files to `public/`.

### Astro

In the base layout, so every page inherits the variables. Do not put `tokens.css` in a single page: the next route would come out without the brand.

```astro
---
import "@jcmartinezma/jcbrand/fonts.css";
import "@jcmartinezma/jcbrand/dist/css/tokens.css";
import "../styles/global.css";
---
<html lang="en">
  <body>
    <slot />
  </body>
</html>
```

`global.css` is the `body` and the focus rule. If the project uses Tailwind, add the Tailwind 4 recipe (with `@tailwindcss/vite`) or the Tailwind 3 one, without duplicating the `tokens.css` import.

## Brand rules

They come from [tokens.md](tokens.md) and [FONTS.md](../FONTS.md). Contrast ratios were calculated with WCAG 2 relative luminance from the hex values in `dist/css/core/color.css`. They are not tokens: they exist so you do not pair existing tokens badly.

### Palette and use

The brand is a warm-neutral gray, an almost-black background and an acid green accent. Red is danger. Blue exists in core and has no semantic alias at all: it is not a link, focus or accent color.

| Role | Tokens | How it is used |
|---|---|---|
| Canvas | `--color-bg-primary`, `secondary`, `tertiary` | Page, sections, bands. Primary is the default background. |
| Inverse | `--color-bg-secondary-inverse`, `--color-bg-tertiary-inverse`, `--color-surface-*-inverse` | Blocks that invert. They stay light in the dark theme. |
| Surface | `--color-surface-*` | Cards, chips, filled controls, above the canvas. |
| Accent | `--color-surface-accent`, `--color-text-accent`, `--color-icon-accent`, `--color-border-accent` | One emphasis per view. No large fills or every link. |
| Danger | `--color-*-danger` | Error, destructive action. Not as a second accent. |
| Text | `--color-text-primary` body; `secondary` supporting; `tertiary` only if contrast allows | Tertiary is weak metadata, not a paragraph. |
| Icon | `--color-icon-*` | If an icon token of the same level exists, do not reuse the text one. |
| Border | `--color-border-primary` the most visible; `secondary` and `tertiary` are soft dividers | The border hover is `--color-border-secondary-hover`. |
| Scrim | `--color-bg-overlay` | Modal and scrim. |

### Contrast

Threshold (WCAG AA): text 4.5:1; border, icon and focus 3:1. A pair that does not reach it is not used for that role, and it is not "fixed" with a primitive (`--color-green-700`, `--color-gray-800`, …).

| Foreground | On | Dark | Light |
|---|---|---|---|
| `--color-text-primary` | `--color-bg-primary` | 16.02 yes | 15.52 yes |
| `--color-text-primary` | `--color-bg-secondary` | 13.50 yes | 13.50 yes |
| `--color-text-primary` | `--color-bg-tertiary` | 7.71 yes | 10.58 yes |
| `--color-text-primary` | `--color-surface-accent` | 6.98 yes | 12.45 yes |
| `--color-text-primary` | `--color-surface-danger` | 13.97 yes | 8.98 yes |
| `--color-text-primary` | `--color-surface-secondary` | 7.71 yes | 6.68 yes |
| `--color-text-primary` | `--color-surface-tertiary` | 13.50 yes | 10.58 yes |
| `--color-text-primary` | `--color-surface-primary` | ~3.0 no | — |
| `--color-text-secondary` | `--color-bg-primary` | 5.34 yes | 6.01 yes |
| `--color-text-secondary` | `--color-bg-secondary` | 4.50 no (4.497) | 5.22 yes |
| `--color-text-secondary-hover` | `--color-bg-primary` | 12.55 yes | 3.45 no |
| `--color-text-tertiary` | `--color-bg-primary` | 3.07 no | 3.45 no |
| `--color-text-tertiary` | `--color-bg-secondary` | 2.58 no | — |
| `--color-text-accent` | `--color-bg-primary` | 10.75 yes | 2.12 no |
| `--color-text-accent` | `--color-bg-secondary` | 9.06 yes | 1.84 no |
| `--color-text-danger` | `--color-bg-primary` | 4.58 yes | 6.71 yes |
| `--color-text-danger` | `--color-bg-secondary` | 3.86 no | — |
| `--color-text-secondary-inverse` | `--color-bg-secondary-inverse` | 18.42 yes | 1.15 no |
| `--color-icon-accent` | `--color-bg-primary` | — | 2.12 no |
| `--color-border-primary` | `--color-bg-primary` | 16.02 yes | 3.45 yes |
| `--color-border-accent` | `--color-bg-primary` | 5.38 yes | 1.71 no |
| `--color-border-secondary` | `--color-bg-primary` | 2.08 no | 2.32 no |
| `--color-border-tertiary` | `--color-bg-primary` | 1.19 no | 1.47 no |
| `--color-border-danger` | `--color-bg-primary` | 2.08 no | — |

What to do about the "no" rows:

- `--color-text-secondary` on `--color-bg-secondary` in dark stays at 4.497: for body text use `--color-text-primary`.
- `--color-text-tertiary` in dark (3.07) is fine as a non-text stroke, not as a paragraph. `--color-text-primary` on `--color-surface-primary` in dark is not a text background.
- In light, the readable accent is `--color-text-primary` on top of `--color-surface-accent`; for an icon, `--color-icon-primary` or the accent icon on an accent surface.
- The text inverse is designed for the dark theme: in light, do not pair `--color-text-secondary-inverse` with `--color-bg-secondary-inverse`.
- `--color-border-secondary` and `--color-border-tertiary` are soft dividers: they do not mark a boundary that must be seen to understand the UI, and they are not focus.

### Focus

In the target's global stylesheet. There is no ring-thickness token: color and offset are tokens, and `outline: solid` leaves the browser's thickness. In dark, focus is `--color-border-accent` (5.38); in light it does not reach 3:1, so it switches to `--color-border-primary`.

```css
:focus:not(:focus-visible) {
  outline: none;
}

:focus-visible {
  outline: solid var(--color-border-accent);
  outline-offset: var(--spacing-2xs);
}

[data-theme="light"] :focus-visible {
  outline-color: var(--color-border-primary);
}
```

### Typography

Two families, loaded by `fonts/fonts.css`. Components use the tokens, not the family string.

| Role | Family | Size | Weight | Line height | Tracking |
|---|---|---|---|---|---|
| Body | `--text-style-base` | `--text-size-sm` | `--text-weight-normal` | `--text-line-height-md` | `--text-letter-spacing-normal` |
| Supporting, meta | `--text-style-base` or `--text-style-decor` | `--text-size-xs` or `--text-size-xxs` | normal | `--text-line-height-sm`; with xxs, `--text-line-height-xs` | normal; in decor, `wide` or `wider` |
| Title | `--text-style-display` | `--text-size-xl` or `--text-size-2xl` | `--text-weight-semibold` or `bold` | `--text-line-height-2xl` | normal, or `tight` if it is a short display |
| Display | `--text-style-display` | `--text-size-3xl` or `--text-size-4xl` | `--text-weight-extrabold` or `bold` | `--text-line-height-3xl` | `--text-letter-spacing-tight` |
| Code, mono label | `--text-style-decor` | xxs or xs | normal; `light` only here | sm or xs | `wide` or `wider` |

This is a composition guide, not composite tokens: write it in a mixin or in the component rule, never as classes in the HTML. Two things change the composition:

- The weights that exist in each family are in [FONTS.md](../FONTS.md): `light` (300) only in `--text-style-decor`; `extrabold` (800) only in Rethink Sans.
- `--text-line-height-xl` (30px) is smaller than `--text-size-xl` (32px): pairing them by name leaves the line height tight. For an xl title use `--text-line-height-2xl`.

### Spacing, radius, shadow and motion

The values are in [tokens.md](tokens.md). This is the usage criteria:

- **Spacing:** inside a control, from `--spacing-2xs` to `--spacing-lg`; from `--spacing-xl` up it is section spacing.
- **Radius:** `xs` on small controls, `sm` on cards, `md` and `lg` on large pieces, `full` on pills.
- **Shadow:** from `--shadow-xs` to `--shadow-xl`, as they are. Do not draw another one with a loose `rgb()`. In the dark theme a black shadow is barely visible: do not replace it with a glow of another color.
- **Motion:** enter with `--motion-duration-enter` and `--motion-easing-enter`; leave with `--motion-duration-exit` and `--motion-easing-exit`; the hover change with `--motion-duration-fast` and `--motion-easing-standard`. A staggered list uses `--motion-delay-stagger`; something that must wait, `--motion-delay-deferred`. Do not invent another curve.

For people who ask for reduced motion, the duration is `--motion-duration-instant`:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: var(--motion-duration-instant) !important;
    transition-duration: var(--motion-duration-instant) !important;
  }
}
```

# Semantic tokens

> Token names and structure are MIT. The values (hex, sizes, families, etc.) belong to JC's brand: all rights reserved. See [LICENSE](../LICENSE).

Source: `tokens/semantic/*.json` and the resolved value in `dist/css/` (hex values come from `dist/css/core/color.css`). Each alias is emitted as `var(--primitive)`, not as the already-substituted hex. In components, write the semantic name.

The dark theme is in `:root`. The light theme only redefines what appears in the "Light" column; if that cell says "inherits", it follows the dark value.

## Color

### Background `--color-bg-*`

| Token | Dark | Light | Dark hex | Light hex |
|---|---|---|---|---|
| `--color-bg-primary` | `--color-gray-800` | `--color-white` | `#141414` | `#FFFFFF` |
| `--color-bg-secondary` | `--color-gray-700` | `--color-gray-100` | `#242424` | `#EFEFEF` |
| `--color-bg-tertiary` | `--color-gray-600` | `--color-gray-200` | `#4A4A4A` | `#D5D5D5` |
| `--color-bg-secondary-inverse` | `--color-white` | inherits | `#FFFFFF` | `#FFFFFF` |
| `--color-bg-tertiary-inverse` | `--color-white` | inherits | `#FFFFFF` | `#FFFFFF` |
| `--color-bg-overlay` | `--color-gray-800-80` | `--color-gray-100-80` | `#141414` at 80% | `#EFEFEF` at 80% |

The overlay is `rgb(from var(--color-gray-…) r g b / 80%)`. There is no semantic token for the 60% variants (`--color-gray-100-60`, `--color-gray-800-60`).

### Surface `--color-surface-*`

| Token | Dark | Light | Dark hex | Light hex |
|---|---|---|---|---|
| `--color-surface-primary` | `--color-gray-400` | inherits | `#8A8A8A` | `#8A8A8A` |
| `--color-surface-primary-hover` | `--color-gray-400` | inherits | `#8A8A8A` | `#8A8A8A` |
| `--color-surface-secondary` | `--color-gray-600` | `--color-gray-300` | `#4A4A4A` | `#AAAAAA` |
| `--color-surface-secondary-inverse` | `--color-gray-200` | inherits | `#D5D5D5` | `#D5D5D5` |
| `--color-surface-tertiary` | `--color-gray-700` | `--color-gray-200` | `#242424` | `#D5D5D5` |
| `--color-surface-tertiary-inverse` | `--color-gray-100` | `--color-white` | `#EFEFEF` | `#FFFFFF` |
| `--color-surface-accent` | `--color-green-700` | `--color-green-200` | `#485612` | `#DEEEA0` |
| `--color-surface-danger` | `--color-red-700` | `--color-red-200` | `#420F0F` | `#EDB8B8` |

`--color-surface-primary` and `--color-surface-primary-hover` point to the same primitive in the JSON. There is no hover change.

### Text `--color-text-*`

| Token | Dark | Light | Dark hex | Light hex |
|---|---|---|---|---|
| `--color-text-primary` | `--color-gray-100` | `--color-gray-700` | `#EFEFEF` | `#242424` |
| `--color-text-secondary` | `--color-gray-400` | `--color-gray-500` | `#8A8A8A` | `#636363` |
| `--color-text-secondary-hover` | `--color-gray-200` | `--color-gray-400` | `#D5D5D5` | `#8A8A8A` |
| `--color-text-secondary-inverse` | `--color-gray-800` | `--color-gray-100` | `#141414` | `#EFEFEF` |
| `--color-text-tertiary` | `--color-gray-500` | `--color-gray-400` | `#636363` | `#8A8A8A` |
| `--color-text-accent` | `--color-green-400` | `--color-green-500` | `#B4D249` | `#A1BE2C` |
| `--color-text-danger` | `--color-red-400` | `--color-red-500` | `#CB5C5C` | `#A83030` |

### Icon `--color-icon-*`

| Token | Dark | Light | Dark hex | Light hex |
|---|---|---|---|---|
| `--color-icon-primary` | `--color-gray-200` | `--color-gray-500` | `#D5D5D5` | `#636363` |
| `--color-icon-secondary` | `--color-gray-400` | `--color-gray-600` | `#8A8A8A` | `#4A4A4A` |
| `--color-icon-tertiary` | `--color-gray-500` | `--color-gray-400` | `#636363` | `#8A8A8A` |
| `--color-icon-accent` | `--color-green-400` | `--color-green-500` | `#B4D249` | `#A1BE2C` |

### Border `--color-border-*`

| Token | Dark | Light | Dark hex | Light hex |
|---|---|---|---|---|
| `--color-border-primary` | `--color-gray-100` | `--color-gray-400` | `#EFEFEF` | `#8A8A8A` |
| `--color-border-secondary` | `--color-gray-600` | `--color-gray-300` | `#4A4A4A` | `#AAAAAA` |
| `--color-border-tertiary` | `--color-gray-700` | `--color-gray-200` | `#242424` | `#D5D5D5` |
| `--color-border-secondary-hover` | `--color-gray-300` | `--color-gray-400` | `#AAAAAA` | `#8A8A8A` |
| `--color-border-accent` | `--color-green-600` | `--color-green-400` | `#7D9420` | `#B4D249` |
| `--color-border-danger` | `--color-red-600` | `--color-red-400` | `#8C2222` | `#CB5C5C` |

Use of each role and contrast: [guide.md](guide.md#brand-rules).

## Typography

There is no token that combines family, size, weight and line height. They are composed in the target's CSS.

### Family `--text-style-*`

| Token | Alias | Resolved value |
|---|---|---|
| `--text-style-display` | `--font-families-sans-1` | `"Rethink Sans", sans-serif` |
| `--text-style-base` | `--font-families-sans-1` | `"Rethink Sans", sans-serif` |
| `--text-style-decor` | `--font-families-monospace-1` | `"IBM Plex Mono", monospace` |

### Size `--text-size-*`

| Token | Alias | px |
|---|---|---|
| `--text-size-xxs` | `--font-size-100` | 12px |
| `--text-size-xs` | `--font-size-200` | 14px |
| `--text-size-sm` | `--font-size-300` | 16px |
| `--text-size-md` | `--font-size-400` | 20px |
| `--text-size-lg` | `--font-size-500` | 24px |
| `--text-size-xl` | `--font-size-600` | 32px |
| `--text-size-2xl` | `--font-size-700` | 40px |
| `--text-size-3xl` | `--font-size-800` | 64px |
| `--text-size-4xl` | `--font-size-900` | 72px |

### Weight `--text-weight-*`

| Token | Alias | Number |
|---|---|---|
| `--text-weight-light` | `--font-weights-100` | 300 |
| `--text-weight-normal` | `--font-weights-200` | 400 |
| `--text-weight-semibold` | `--font-weights-400` | 600 |
| `--text-weight-bold` | `--font-weights-500` | 700 |
| `--text-weight-extrabold` | `--font-weights-600` | 800 |

There is no semantic token for 500 (`--font-weights-300`) or for 900 (`--font-weights-700`).

### Line height `--text-line-height-*`

The semantic name does not follow the same index as the size. `--text-line-height-lg` is 31px and `--text-line-height-xl` is 30px.

| Token | Alias | px |
|---|---|---|
| `--text-line-height-xs` | `--font-line-height-100` | 14px |
| `--text-line-height-sm` | `--font-line-height-200` | 18px |
| `--text-line-height-md` | `--font-line-height-300` | 21px |
| `--text-line-height-lg` | `--font-line-height-500` | 31px |
| `--text-line-height-xl` | `--font-line-height-400` | 30px |
| `--text-line-height-2xl` | `--font-line-height-600` | 44px |
| `--text-line-height-3xl` | `--font-line-height-700` | 76px |

There is no `--text-line-height-4xl`.

### Tracking `--text-letter-spacing-*`

| Token | Alias | px |
|---|---|---|
| `--text-letter-spacing-tight` | `--font-letter-spacings-minus-100` | -1px |
| `--text-letter-spacing-normal` | `--font-letter-spacings-100` | 0px |
| `--text-letter-spacing-wide` | `--font-letter-spacings-200` | 1px |
| `--text-letter-spacing-wider` | `--font-letter-spacings-300` | 2px |

## Spacing `--spacing-*`

From `--spacing-lg` (32px) it jumps to 64px. From there up it is a section scale, not control padding.

| Token | Alias | px |
|---|---|---|
| `--spacing-2xs` | `--spacing-100` | 4px |
| `--spacing-xs` | `--spacing-200` | 8px |
| `--spacing-sm` | `--spacing-300` | 16px |
| `--spacing-md` | `--spacing-400` | 24px |
| `--spacing-lg` | `--spacing-500` | 32px |
| `--spacing-xl` | `--spacing-600` | 64px |
| `--spacing-2xl` | `--spacing-700` | 128px |
| `--spacing-3xl` | `--spacing-800` | 256px |
| `--spacing-4xl` | `--spacing-900` | 320px |
| `--spacing-5xl` | `--spacing-1000` | 400px |

## Radius `--border-radius-*`

| Token | Alias | px |
|---|---|---|
| `--border-radius-xs` | `--border-radius-100` | 4px |
| `--border-radius-sm` | `--border-radius-300` | 16px |
| `--border-radius-md` | `--border-radius-400` | 32px |
| `--border-radius-lg` | `--border-radius-500` | 64px |
| `--border-radius-full` | `--border-radius-600` | 400px |

No semantic alias: `--border-radius-0` (0px) and `--border-radius-200` (8px).

## Shadow `--shadow-*`

Literal values in `dist/css/semantic/shadow.css` (they are not aliases):

| Token | Value |
|---|---|
| `--shadow-xs` | `0 1px 2px rgb(0 0 0 / 0.16)` |
| `--shadow-sm` | `0 2px 4px rgb(0 0 0 / 0.16), 0 1px 2px rgb(0 0 0 / 0.12)` |
| `--shadow-md` | `0 6px 12px rgb(0 0 0 / 0.18), 0 2px 4px rgb(0 0 0 / 0.12)` |
| `--shadow-lg` | `0 12px 24px rgb(0 0 0 / 0.2), 0 4px 8px rgb(0 0 0 / 0.12)` |
| `--shadow-xl` | `0 24px 48px rgb(0 0 0 / 0.22), 0 8px 16px rgb(0 0 0 / 0.14)` |

There are no shadows in `tokens/core/shadow.core.json`.

## Motion

### Duration `--motion-duration-*`

| Token | Alias | Value |
|---|---|---|
| `--motion-duration-instant` | `--motion-duration-0` | 0s |
| `--motion-duration-fast` | `--motion-duration-100` | 0.1s |
| `--motion-duration-exit` | `--motion-duration-200` | 0.15s |
| `--motion-duration-normal` | `--motion-duration-300` | 0.2s |
| `--motion-duration-enter` | `--motion-duration-400` | 0.3s |
| `--motion-duration-slow` | `--motion-duration-500` | 0.4s |
| `--motion-duration-emphasis` | `--motion-duration-600` | 0.6s |

### Delay `--motion-delay-*`

| Token | Alias | Value |
|---|---|---|
| `--motion-delay-none` | `--motion-delay-0` | 0s |
| `--motion-delay-stagger` | `--motion-delay-100` | 0.05s |
| `--motion-delay-deferred` | `--motion-delay-300` | 0.15s |

No semantic alias: `--motion-delay-200` (0.1s).

### Easing `--motion-easing-*`

| Token | Alias | Value |
|---|---|---|
| `--motion-easing-linear` | `--motion-easing-0` | `cubic-bezier(0, 0.0009, 1, 1)` |
| `--motion-easing-standard` | `--motion-easing-100` | `cubic-bezier(0.2, 0, 0, 1)` |
| `--motion-easing-enter` | `--motion-easing-200` | `cubic-bezier(0, 0, 0.2, 1)` |
| `--motion-easing-exit` | `--motion-easing-300` | `cubic-bezier(0.4, 0, 1, 1)` |

## Blur `--blur-*`

| Token | Alias | px |
|---|---|---|
| `--blur-xs` | `--blur-100` | 4px |
| `--blur-sm` | `--blur-200` | 8px |
| `--blur-md` | `--blur-300` | 16px |
| `--blur-lg` | `--blur-400` | 24px |
| `--blur-xl` | `--blur-500` | 40px |
| `--blur-2xl` | `--blur-600` | 64px |

Used as `backdrop-filter: blur(var(--blur-md))`. There is no translucent color token apart from the overlay.

## Opacity (core only)

There is no semantic opacity in `tokens/semantic`. The only values: `--opacity-00` 0%, `--opacity-100` 20%, `--opacity-200` 40%, `--opacity-300` 60%, `--opacity-400` 80%. There is no 100%.

## Primitives without a semantic role

Do not use them in components. If they show up in an audit, there is no hex-based replacement:

- The whole blue scale: `--color-blue-100` `#DADCDF`, `--color-blue-200` `#B7CDED`, `--color-blue-300` `#89ABDE`, `--color-blue-400` `#5B88CB`, `--color-blue-500` `#305FA8`, `--color-blue-600` `#214C8C`, `--color-blue-700` `#0F2342`, `--color-blue-800` `#030B18`.
- `--color-black` `#000000`.
- Greens without an alias: `--color-green-100` `#F3F8DE`, `--color-green-300` `#C8E169`, `--color-green-800` `#0D1003`.
- Reds without an alias: `--color-red-100` `#DFDADA`, `--color-red-300` `#DE8A8A`, `--color-red-800` `#0E0202`.
- Alpha without an alias: `--color-gray-100-60`, `--color-gray-800-60`.

## Hex index for the audit

Match the hex you found. If there are several tokens, choose by CSS property and theme, as each row indicates. px values and times do not need an index: look them up in the value column of their category table. If they do not appear, there is no semantic token.

| Hex | Semantic tokens |
|---|---|
| `#FFFFFF` | `--color-bg-secondary-inverse`, `--color-bg-tertiary-inverse`; in light also `--color-bg-primary`, `--color-surface-tertiary-inverse` |
| `#EFEFEF` | dark `--color-text-primary`, `--color-border-primary`, `--color-surface-tertiary-inverse`; light `--color-bg-secondary`, `--color-text-secondary-inverse` |
| `#D5D5D5` | dark `--color-text-secondary-hover`, `--color-icon-primary`, `--color-surface-secondary-inverse`; light `--color-bg-tertiary`, `--color-surface-tertiary`, `--color-border-tertiary` |
| `#AAAAAA` | dark `--color-border-secondary-hover`; light `--color-surface-secondary`, `--color-border-secondary` |
| `#8A8A8A` | dark `--color-surface-primary`, `--color-surface-primary-hover`, `--color-text-secondary`, `--color-icon-secondary`; light `--color-text-secondary-hover`, `--color-text-tertiary`, `--color-icon-tertiary`, `--color-border-primary`, `--color-border-secondary-hover` |
| `#636363` | dark `--color-text-tertiary`, `--color-icon-tertiary`; light `--color-text-secondary`, `--color-icon-primary` |
| `#4A4A4A` | dark `--color-bg-tertiary`, `--color-surface-secondary`, `--color-border-secondary`; light `--color-icon-secondary` |
| `#242424` | dark `--color-bg-secondary`, `--color-surface-tertiary`, `--color-border-tertiary`; light `--color-text-primary` |
| `#141414` | dark `--color-bg-primary`, `--color-text-secondary-inverse` |
| `#B4D249` | dark `--color-text-accent`, `--color-icon-accent`; light `--color-border-accent` |
| `#A1BE2C` | light `--color-text-accent`, `--color-icon-accent` |
| `#7D9420` | dark `--color-border-accent` |
| `#485612` | dark `--color-surface-accent` |
| `#DEEEA0` | light `--color-surface-accent` |
| `#CB5C5C` | dark `--color-text-danger`; light `--color-border-danger` |
| `#A83030` | light `--color-text-danger` |
| `#8C2222` | dark `--color-border-danger` |
| `#420F0F` | dark `--color-surface-danger` |
| `#EDB8B8` | light `--color-surface-danger` |

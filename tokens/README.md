# Tokens · format and CSS mapping

This repo is public, it is the Cursor skill (`SKILL.md`) and the source of the `@jcmartinezma/jcbrand` dependency, which is installed directly from GitHub (`npm install github:jcmartinezma/jcbrand#semver:^0.2.0`). Whoever applies the brand installs the dependency; they do not copy `dist/`. `dist/` is generated from these JSON files, committed, and is what gets installed. Do not edit it by hand.

**License.** The JSON files in `tokens/` (and the `dist/` generated from them) mix two things. The structure (format, layers, paths, token and CSS variable names, aliases, build) is MIT: you can reuse it. The **values** (colors, typefaces, scales) are JC's brand identity and have all rights reserved: if you use this skeleton, put your own. See [LICENSE](../LICENSE).

JSON in **W3C DTCG** format (`$value`, `$type`, `$description`; aliases `"{token.path}"`). It is a **1:1 structural conversion** of the original SCSS: no token or value has been added, renamed or fixed.

## Files

| JSON | SCSS origin | Selector |
|---|---|---|
| `core/color.core.json` · `typography.core.json` · `spacing.core.json` · `radius.core.json` · `motion.core.json` · `blur.core.json` · `opacity.core.json` | `core/_*.core.scss` | `:root` |
| `core/shadow.core.json` | `core/_shadow.core.scss` (empty in the original) | — (metadata only, no tokens) |
| `semantic/color.semantic.dark.json` | `semantic/_color.semantic.scss` | `:root` (default theme, dark) |
| `semantic/color.semantic.light.json` | `semantic/_color.semantic.scss` | `[data-theme="light"]`: **only the 26 overrides**; the rest inherits `:root` |
| `semantic/typography.semantic.json` · `spacing.semantic.json` · `radius.semantic.json` · `motion.semantic.json` · `blur.semantic.json` · `shadow.semantic.json` | `semantic/_*.semantic.scss` | `:root` |

**Core** files are named `<name>.core.json` and **semantic** files `<name>.semantic.json` (`color.semantic.dark.json` and `color.semantic.light.json` for the two themes). Both layers have this structure:

- `$schema` at the root.
- A root group (`color`, `font`, `spacing`, …) with `$description`. Each subgroup also has its own `$description`.
- `$type` is declared only once, on the highest group where all tokens share a type (`color` in `color.core.json` and in both color theme files; in `typography`, one per subgroup). Tokens inherit that type and do not repeat it.
- Each token has just `$value`, written on one line. Only tokens that need one add `$extensions["com.jcbrand"]` (`alpha`, `cssFormat`). There is no `cssVar`: the CSS name comes from the path.
- No `$extensions` at the root. The selector comes from the file name: `*.semantic.light.json` → `[data-theme="light"]`, everything else → `:root`.

## CSS name

No token has a `cssVar`: the name is the path joined with `-` and prefixed with `--` (`color.gray.100` → `--color-gray-100`, `font.size.100` → `--font-size-100`). The light theme uses the same paths as the dark one, so it gets the same names. A token could still override its name with `$extensions["com.jcbrand"].cssVar`, but none does. Aliases are emitted as `var(<name of the target>)`.

## Path scheme (path → variable)

| CSS variable | JSON path | `$type` |
|---|---|---|
| `--color-gray-100` … `--color-blue-800` | `color.<hue>.<step>` (`color.gray.100`) | color |
| `--color-white` / `--color-black` | `color.white` / `color.black` | color |
| `--color-gray-100-60` | `color.gray.100-60` | color (alias + alpha, see below) |
| `--font-families-sans-1` | `font.families.sans-1` | fontFamily |
| `--font-size-100` | `font.size.100` | dimension |
| `--font-weights-100` | `font.weights.100` | fontWeight |
| `--font-line-height-100` | `font.line-height.100` | dimension |
| `--font-letter-spacings-minus-100` | `font.letter-spacings.minus-100` | dimension |
| `--spacing-100` / `--spacing-2xs` | `spacing.100` / `spacing.2xs` | dimension |
| `--border-radius-100` / `--border-radius-xs` | `border-radius.100` / `border-radius.xs` | dimension |
| `--motion-duration-100` / `--motion-duration-fast` | `motion.duration.100` / `motion.duration.fast` | duration |
| `--motion-delay-*` | `motion.delay.*` | duration |
| `--motion-easing-0` / `--motion-easing-linear` | `motion.easing.0` / `motion.easing.linear` | cubicBezier |
| `--blur-100` / `--blur-xs` | `blur.100` / `blur.xs` | dimension |
| `--opacity-00` | `opacity.00` | number |
| `--color-<bg\|surface\|text\|icon\|border>-<rest>` | `color.<group>.<rest>` (`--color-surface-primary-hover` → `color.surface.primary-hover`) | color |
| `--text-style-*` | `text.style.*` | fontFamily |
| `--text-size-*` · `--text-line-height-*` · `--text-letter-spacing-*` | `text.size.*` · `text.line-height.*` · `text.letter-spacing.*` | dimension |
| `--text-weight-*` | `text.weight.*` | fontWeight |
| `--shadow-xs` | `shadow.xs` | shadow |

Core and semantic share root groups (`color`, `spacing`, `border-radius`, `motion`, `blur`) without collisions (`spacing.100` versus `spacing.2xs`).

## Value representation (faithful to the original)

- **dimension / duration** as a string with a unit (`"12px"`, `"0.15s"`, `"0px"`), the classic DTCG form used by Style Dictionary v4. The DTCG 2025.10 `{value, unit}` objects are not used, so the CSS comes out byte for byte the same.
- **fontFamily** as an array (`["Rethink Sans", "sans-serif"]`) → CSS `"Rethink Sans", sans-serif` (names with spaces are quoted).
- **cubicBezier** as an array; `motion.easing.0` keeps `[0, 0.0009, 1, 1]` as is.
- **opacity**: `$type: number` as a fraction (`0.2`) + `cssFormat: "percent"` → `20%`. `opacity.00` → `0%`.
- **Colors with alpha** (`--color-gray-100-60` = `rgb(from var(--color-gray-100) r g b / 60%)`): `$value: "{color.gray.100}"` + `$extensions["com.jcbrand"].alpha: 0.6`. The build must emit `rgb(from var(<cssVar>) r g b / <alpha·100>%)`. A tool that ignores the extension will resolve the **opaque** color.
- **shadow**: DTCG 2025.10 objects `{color, offsetX, offsetY, blur, spread}`. The color is `{colorSpace: "srgb", components: [0, 0, 0], alpha: 0.16}` and each dimension is `{value, unit}`. Multiple layers go as an array. `spread` is always `{value: 0, unit: "px"}` because the schema requires it, and the build **omits a zero spread** so the CSS stays `0 1px 2px rgb(0 0 0 / 0.16)`. A zero offset is written as `0`.
- **Order**: custom properties do not depend on order, and JS reorders numeric keys (`"100"`), so key order is not significant.

## Build with Style Dictionary

The configuration is in `sd.config.mjs` (Style Dictionary 5). It reads `tokens/core/*.core.json` and `tokens/semantic/*.json` and writes `dist/`. The output name is always derived from the token path.

`color.semantic.light.json` uses the same paths as `color.semantic.dark.json` (`color.bg.primary`, …). The parser nests them under `theme-light` only so Style Dictionary does not overwrite the dark theme. That prefix does not reach the CSS: the variable is still `--color-bg-primary`, inside `[data-theme="light"]`.

```bash
npm run build:tokens   # generates dist/ and checks names and values
npm run clean:tokens   # deletes dist/css and dist/scss
```

Node 22 or higher is required. `dist/` is committed: whoever uses the repo gets the CSS and SCSS without running the build. Do not edit it by hand; if a JSON changes, regenerate and commit `dist/`.

The `dist/scss/` partials are loaded with `@use` (see the root README). An alias comes out as `var(--reference)`, just like in the original SCSS. Colors with alpha come out as `rgb(from var(--…) r g b / N%)`.

## Validation

Without the original SCSS, the script only validates the JSON (parsing, `$type`, aliases that resolve without cycles and with the same type, and light overrides that exist in `:root`):

```
node scripts/check-tokens.mjs
npm run check:tokens
```

With the folder of the original SCSS, it also regenerates the custom properties and compares them 1:1, file by file and selector by selector:

```
node scripts/check-tokens.mjs <original-scss-folder> [--emit regenerated.css]
```

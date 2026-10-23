# Tokens · formato y mapeo a CSS

Este repo es la skill de Cursor (`SKILL.md`) y el origen del paquete privado `@jcmartinezma/jcbrand`. Quien aplique la marca instala el paquete; no copia `dist/`. `dist/` se genera desde estos JSON, se commitea y entra en el paquete. No lo edites a mano.

JSON en formato **W3C DTCG** (`$value`, `$type`, `$description`; alias `"{ruta.del.token}"`). Es una conversión **estructural 1:1** de los SCSS originales: no se ha añadido, renombrado ni corregido ningún token ni valor.

## Archivos
| JSON | Origen SCSS | Selector |
|---|---|---|
| `core/color.json` · `typography.json` · `spacing.json` · `radius.json` · `motion.json` · `blur.json` · `opacity.json` | `core/_*.core.scss` | `:root` |
| `core/shadow.json` | `core/_shadow.core.scss` (vacío en el original) | — (solo metadatos, sin tokens) |
| `semantic/color.dark.json` | `semantic/_color.semantic.scss` | `:root` (tema por defecto, oscuro) |
| `semantic/color.light.json` | `semantic/_color.semantic.scss` | `[data-theme="light"]`: **solo los 26 overrides**; el resto hereda `:root` |
| `semantic/typography.json` · `spacing.json` · `radius.json` · `motion.json` · `blur.json` · `shadow.json` | `semantic/_*.semantic.scss` | `:root` |

Cada archivo lleva en la raíz `$extensions["com.jcbrand"] = { source, selector[, theme] }`.

## Nombre CSS: sin pérdidas
**Todos** los tokens llevan su variable original en `$extensions["com.jcbrand"].cssVar` (p. ej. `"--gray-800"`). Un build (Style Dictionary, etc.) debe usar ese campo como nombre: así se reproducen exactamente los nombres actuales, aunque la ruta no se derive igual. Los alias se emiten como `var(<cssVar del destino>)`, igual que en el SCSS.

## Esquema de rutas (ruta → variable)
| Variable CSS | Ruta JSON | `$type` |
|---|---|---|
| `--gray-100` … `--blue-800` | `color.<tono>.<paso>` (`color.gray.100`) | color |
| `--white` / `--black` | `color.white` / `color.black` | color |
| `--gray-100-60` | `color.gray.100-60` | color (alias + alpha, ver abajo) |
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
| `--color-<bg\|surface\|text\|icon\|border>-<resto>` | `color.<grupo>.<resto>` (`--color-surface-primary-hover` → `color.surface.primary-hover`) | color |
| `--text-style-*` | `text.style.*` | fontFamily |
| `--text-size-*` · `--text-line-height-*` · `--text-letter-spacing-*` | `text.size.*` · `text.line-height.*` · `text.letter-spacing.*` | dimension |
| `--text-weight-*` | `text.weight.*` | fontWeight |
| `--shadow-xs` | `shadow.xs` | shadow |

Core y semantic comparten grupos raíz (`color`, `spacing`, `border-radius`, `motion`, `blur`) sin colisiones (`spacing.100` frente a `spacing.2xs`).

## Representación de valores (fiel al original)
- **dimension / duration** como string con unidad (`"12px"`, `"0.15s"`, `"0px"`), la forma clásica de DTCG que usa Style Dictionary v4. No se usan los objetos `{value, unit}` de DTCG 2025.10, para que el CSS salga byte a byte igual.
- **fontFamily** como array (`["Rethink Sans", "sans-serif"]`) → CSS `"Rethink Sans", sans-serif` (se entrecomillan los nombres con espacios).
- **cubicBezier** como array; `motion.easing.0` conserva `[0, 0.0009, 1, 1]` tal cual.
- **opacity**: `$type: number` en fracción (`0.2`) + `cssFormat: "percent"` → `20%`. `opacity.00` → `0%`.
- **Colores con alpha** (`--gray-100-60` = `rgb(from var(--gray-100) r g b / 60%)`): `$value: "{color.gray.100}"` + `$extensions["com.jcbrand"].alpha: 0.6`. El build tiene que emitir `rgb(from var(<cssVar>) r g b / <alpha·100>%)`. Una herramienta que ignore la extensión resolverá el color **opaco**.
- **shadow**: objetos DTCG `{color, offsetX, offsetY, blur}` con los strings originales (`"0"`, `"1px"`, `"rgb(0 0 0 / 0.16)"`). Las capas múltiples van como array. **`spread` se omite** porque el original no lo declara: DTCG lo exige, pero añadir `0` cambiaría el CSS generado.
- **Orden**: las custom properties no dependen del orden, y JS reordena las claves numéricas (`"100"`), así que el orden de las claves no es significativo.

## Build con Style Dictionary

La configuración está en `sd.config.mjs` (Style Dictionary 5). Lee `tokens/core/*.json` y `tokens/semantic/*.json` y escribe `dist/`. El nombre de salida es siempre `$extensions["com.jcbrand"].cssVar`; el build no inventa nombres a partir de la ruta.

`color.light.json` usa las mismas rutas que `color.dark.json` (`color.bg.primary`, …). El parser las anida bajo `theme-light` solo para que Style Dictionary no pise el tema oscuro. Ese prefijo no llega al CSS: la variable sigue siendo `--color-bg-primary`, dentro de `[data-theme="light"]`.

```bash
npm run build:tokens   # genera dist/ y comprueba nombres y valores
npm run clean:tokens   # borra dist/css y dist/scss
```

Hace falta Node 22 o superior. `dist/` se commitea: quien use el repo obtiene el CSS y el SCSS sin correr el build. No lo edites a mano; si cambia un JSON, regenera y commitea `dist/`.

Los parciales de `dist/scss/` se cargan con `@use` (ver el README de la raíz). Un alias sale como `var(--referencia)`, igual que en el SCSS original. Los colores con alpha salen como `rgb(from var(--…) r g b / N%)`.

## Validación
Sin el SCSS original, el script solo valida el JSON (parseo, `$type`, `cssVar`, alias que resuelven sin ciclos y con el mismo tipo, y overrides de light que existen en `:root`):

```
node scripts/check-tokens.mjs
npm run check:tokens
```

Con la carpeta de los SCSS originales, además regenera las custom properties y las compara 1:1, archivo por archivo y selector por selector:

```
node scripts/check-tokens.mjs <carpeta-scss-original> [--emit regenerated.css]
```

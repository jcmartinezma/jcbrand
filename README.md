# jcbrand

Sistema de diseño de marca **centralizado** de JC (José Carlos Martínez). Hoy contiene los **tokens** y las **fuentes** de marca; más adelante, componentes y otros assets.

## Estructura
```
jcbrand/
├── tokens/            # fuente de verdad, JSON (W3C DTCG) · ver tokens/README.md
│   ├── core/          # primitivos: color, typography, spacing, radius, motion, blur, opacity, shadow (vacío)
│   └── semantic/      # intención: color.dark (por defecto), color.light, typography, spacing, radius, motion, blur, shadow
├── sd.config.mjs      # Style Dictionary: JSON → CSS y SCSS
├── dist/              # salida generada y commiteada (no editar a mano)
│   ├── css/           # custom properties: core/, semantic/ y tokens.css
│   └── scss/          # parciales para @use / @forward
├── scripts/           # check-tokens.mjs y la comprobación del build
├── fonts/             # fuentes de marca · ver FONTS.md
│   ├── fonts.css      # @font-face (Rethink Sans, IBM Plex Mono)
│   ├── files/         # .woff2
│   └── licenses/      # SIL Open Font License 1.1
├── FONTS.md           # pesos, licencias y huecos
├── components/        # (futuro)
└── assets/            # (futuro) logos, iconos
```

## Fuentes

Dos familias: **Rethink Sans** (texto) e **IBM Plex Mono** (mono). Los `@font-face` están en `fonts/fonts.css`, con rutas relativas a `fonts/files/`.

Cuando el paquete esté instalado, este import usa el export `./fonts.css` (también está `./fonts/*`). `files` incluye `dist` y `fonts`, y `sideEffects` es `*.css`, para que el bundler no descarte la hoja:

```js
import '@jcmartinezma/jcbrand/fonts.css';
```

Mientras no haya publish, enlaza el archivo del repo: `fonts/fonts.css`.

Pesos, licencias y huecos (Rethink Sans no trae 300; IBM Plex Mono no trae 800) están en [FONTS.md](FONTS.md).

## Capas
1. **Core**: valores en crudo (`--gray-800`, `--spacing-300`…).
2. **Semantic**: alias de core con intención de uso (`--color-bg-primary` → `--gray-800`).
3. **Temas**: **oscuro** por defecto (`:root`, `color.dark.json`) y **claro** por override (`[data-theme="light"]`, `color.light.json`, solo los tokens que cambian).

Los nombres de variable CSS originales se conservan en cada token (`$extensions["com.jcbrand"].cssVar`).

## Build

El paquete sigue siendo **privado**: no se publica a npm. `dist/` sí se commitea, para que quien copie el repo tenga el CSS y el SCSS sin instalar Style Dictionary ni lanzar el build.

Hace falta **Node 22 o más** (lo pide Style Dictionary 5). Desde la raíz:

```bash
npm install
npm run build:tokens
```

`build:tokens` genera `dist/` y después compara cada variable con el JSON. Si un nombre o un valor no coincide con `cssVar`, el comando falla. `npm run clean:tokens` borra solo esos archivos generados.

No edites `dist/` a mano. Si cambias un JSON, vuelve a lanzar el build y commitea `dist/` junto con el token.

### Qué sale

| Ruta | Contenido |
|---|---|
| `dist/css/core/*.css` | primitivos en `:root` (`color`, `typography`, `spacing`, `radius`, `motion`, `blur`, `opacity`; `shadow.css` queda vacío, como el SCSS original) |
| `dist/css/semantic/color.css` | `:root` (oscuro) y, debajo, solo los overrides de `[data-theme="light"]` |
| `dist/css/semantic/*.css` | el resto de semánticos en `:root` |
| `dist/css/tokens.css` | todo lo anterior en un solo archivo |
| `dist/scss/**/_*.scss` | los mismos custom properties, como parciales Sass |
| `dist/scss/_index.scss` | `@forward` de `core` y `semantic` |

El nombre de cada variable es el `cssVar` del token (`--gray-800`, `--color-bg-primary`). Un alias semántico se escribe `var(--gray-800)`, no el color ya resuelto.

### Cómo lo usará un proyecto

Estos parciales no crean variables Sass (`$gray-800`). Escriben **custom properties** de CSS dentro de `:root`. Sass las copia al CSS final; en el componente se usan con `var(...)`.

Mientras el paquete no esté publicado, apunta al directorio local:

```scss
@use "../ruta/a/jcbrand/dist/scss" as jcbrand;

.card {
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
}
```

`as jcbrand` solo nombra el espacio de miembros Sass (mixins, funciones, `$variables`). No renombra `--color-bg-primary`: las custom properties siguen siendo globales.

El tema claro son 26 overrides. El resto se hereda de `:root`. En el HTML:

```html
<html data-theme="light">
```

Sin Sass, enlaza la hoja única:

```html
<link rel="stylesheet" href="dist/css/tokens.css">
```

Las fuentes ya tienen `exports` (`./fonts.css` y `./fonts/*`). Publicar el paquete en GitHub Packages, y añadir exports de `dist` (para `@use "@jcmartinezma/jcbrand/dist/scss"`), queda para cuando se publique. Hoy no hay export de `dist` ni de `.`.

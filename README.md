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

Con el paquete instalado, el import usa el export `./fonts.css` (también está `./fonts/*`). `files` incluye `dist` y `fonts`, y `sideEffects` es `*.css`, para que el bundler no descarte la hoja:

```js
import '@jcmartinezma/jcbrand/fonts.css';
```

Dentro de este repo, sin instalar el paquete, el archivo es `fonts/fonts.css`.

Pesos, licencias y huecos (Rethink Sans no trae 300; IBM Plex Mono no trae 800) están en [FONTS.md](FONTS.md).

## Capas
1. **Core**: valores en crudo (`--gray-800`, `--spacing-300`…).
2. **Semantic**: alias de core con intención de uso (`--color-bg-primary` → `--gray-800`).
3. **Temas**: **oscuro** por defecto (`:root`, `color.dark.json`) y **claro** por override (`[data-theme="light"]`, `color.light.json`, solo los tokens que cambian).

Los nombres de variable CSS originales se conservan en cada token (`$extensions["com.jcbrand"].cssVar`).

## Build

El paquete es **privado en GitHub Packages**, no en npmjs.com. `dist/` sí se commitea, para que quien copie el repo tenga el CSS y el SCSS sin instalar Style Dictionary ni lanzar el build.

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

## Instalar el paquete (GitHub Packages)

`@jcmartinezma/jcbrand` se publica **solo** en el registro npm de GitHub (`https://npm.pkg.github.com`), ligado al repo privado `jcmartinezma/jcbrand`. No está en npmjs.com y no se ve sin acceso a ese repo.

`"private": true` se quitó a propósito. Ese campo hace que `npm publish` se niegue en **cualquier** registro, también en el de GitHub. La privacidad no sale de ahí: la da el repo privado. El primer publish en GitHub Packages nace privado y, como `repository` apunta a este repo, el paquete hereda sus permisos.

### Token y `.npmrc` del proyecto que lo instala

Hace falta un personal access token **classic**. GitHub Packages no autentica con un token fine-grained. Scopes:

- `read:packages` para descargar el paquete.
- `repo`, porque el repositorio es privado. Sin `repo`, `read:packages` no basta.

Tu usuario de GitHub tiene que poder leer `jcmartinezma/jcbrand`. No subas el token al repo. En el **proyecto consumidor**, crea un `.npmrc`:

```
@jcmartinezma:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

Ese archivo solo desvía el scope `@jcmartinezma`. El resto de dependencias sigue saliendo de npmjs.com. Luego:

```bash
export GITHUB_TOKEN=ghp_tu_token
npm install @jcmartinezma/jcbrand
```

En GitHub Actions de **otro** repo, `GITHUB_TOKEN` solo puede leer este paquete si el paquete le da acceso. En local, o en un proyecto que no es este repo, usa el PAT classic de arriba.

### Imports

Fuentes:

```js
import '@jcmartinezma/jcbrand/fonts.css';
```

Tokens en un solo CSS (`dist/css/tokens.css`):

```js
import '@jcmartinezma/jcbrand/dist/css/tokens.css';
```

Una hoja concreta que exista bajo `dist/css/` (por ejemplo el color semántico):

```js
import '@jcmartinezma/jcbrand/dist/css/semantic/color.css';
```

SCSS. El export `./dist/scss` apunta a `dist/scss/_index.scss` (`@forward` de core y semantic). `./dist/scss/core` y `./dist/scss/semantic` apuntan a sus `_index.scss`:

```scss
@use "@jcmartinezma/jcbrand/dist/scss" as jcbrand;

.card {
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
}
```

Estos parciales no crean variables Sass (`$gray-800`). Escriben **custom properties** dentro de `:root`. Sass las copia al CSS final. `as jcbrand` solo nombra el espacio de miembros Sass (mixins, funciones, `$variables`). No renombra `--color-bg-primary`: las custom properties siguen siendo globales y se usan con `var(...)`.

El tema claro son 26 overrides. El resto se hereda de `:root`:

```html
<html data-theme="light">
```

Sin empaquetador, el CSS instalado está en `node_modules/@jcmartinezma/jcbrand/dist/css/tokens.css`. Dentro de este repo, sin instalar, sigue valiendo `dist/css/tokens.css` o `@use "../ruta/a/jcbrand/dist/scss"`.

### Publicar una versión

No se publica en cada push a `main`. El workflow `.github/workflows/publish.yml` corre al **publicar un Release** (no un borrador), o si lo lanzas a mano en Actions.

1. Sube `version` en `package.json`. npm no deja repetir una versión.
2. Merge a `main` con el `dist/` ya generado.
3. Crea un Release con tag `v` + esa versión (`v0.1.0` si `package.json` dice `0.1.0`) y publícalo. El workflow comprueba que coinciden y hace `npm publish` con el `GITHUB_TOKEN` del repo (`packages: write`).

La primera vez el paquete aún no existe: hay que publicar ese Release, o pulsar **Run workflow** sobre `main`. No uses `--access public` ni `registry.npmjs.org`.

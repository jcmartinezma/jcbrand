# jcbrand

Sistema de diseño de la marca de JC (José Carlos Martínez), la de [jcmartinez.net](https://jcmartinez.net). Hoy contiene los **tokens** y las **fuentes**. El repo es privado. Se publica como paquete privado `@jcmartinezma/jcbrand` en GitHub Packages, y el mismo repo es la **skill de Cursor** que explica cómo usarlo.

La skill no manda copiar `dist/` ni `fonts/` a cada proyecto. Se instala el paquete y, cuando cambie, `npm update` lo trae entero. Así no quedan copias sueltas y, cuando haya componentes, saldrán por el mismo sitio.

## Usarla como skill

Cursor trata como skill de usuario cualquier carpeta de `~/.cursor/skills/` que tenga un `SKILL.md` en la raíz:

```bash
git clone git@github.com:jcmartinezma/jcbrand.git ~/.cursor/skills/jcbrand
```

Hace falta permiso de lectura sobre este repo. Abre un chat nuevo para que Cursor la detecte. Al pedir la marca de JC, el estilo de jcmartinez.net o los tokens jcbrand, el agente sigue `SKILL.md`: configura el `.npmrc`, instala el paquete e importa las hojas. El detalle por stack está en `reference/`.

La skill vive en el git. El tarball de npm lleva `dist/` y `fonts/`, no el `SKILL.md`.

## Estructura

```
jcbrand/
├── SKILL.md           # guía de uso del paquete, para el agente
├── reference/         # tokens, reglas de marca, recetas por stack, checklist
├── CHANGELOG.md       # qué cambió en cada versión publicada
├── tokens/            # fuente de verdad, JSON (W3C DTCG) · ver tokens/README.md
│   ├── core/          # primitivos: color, typography, spacing, radius, motion, blur, opacity, shadow (vacío)
│   └── semantic/      # intención: color.dark (por defecto), color.light, typography, spacing, radius, motion, blur, shadow
├── sd.config.mjs      # Style Dictionary: JSON → CSS y SCSS
├── dist/              # salida generada y commiteada (no editar a mano); entra en el paquete
│   ├── css/           # custom properties: core/, semantic/ y tokens.css
│   └── scss/          # parciales para @use / @forward
├── scripts/           # check-tokens.mjs y la comprobación del build
├── fonts/             # fuentes de marca · ver FONTS.md; entran en el paquete
│   ├── fonts.css      # @font-face (Rethink Sans, IBM Plex Mono)
│   ├── files/         # .woff2
│   └── licenses/      # SIL Open Font License 1.1
├── FONTS.md           # pesos, licencias y huecos
├── components/        # (futuro) piezas de UI; hoy vacío, no se publica
└── assets/            # (futuro) logos, iconos
```

## Fuentes

Dos familias: **Rethink Sans** (texto) e **IBM Plex Mono** (mono). Los `@font-face` están en `fonts/fonts.css`, con rutas relativas a `fonts/files/`. Con el paquete instalado:

```js
import '@jcmartinezma/jcbrand/fonts.css';
```

`files` incluye `dist` y `fonts`, y `sideEffects` es `*.css`, para que el bundler no descarte la hoja. Pesos, licencias y huecos (Rethink Sans no trae 300; IBM Plex Mono no trae 800) están en [FONTS.md](FONTS.md).

## Capas

1. **Core**: valores en crudo (`--gray-800`, `--spacing-100`…).
2. **Semantic**: alias de core con intención de uso (`--color-bg-primary` → `--gray-800`).
3. **Temas**: **oscuro** por defecto (`:root`, `color.dark.json`) y **claro** por override (`[data-theme="light"]`, `color.light.json`, solo los tokens que cambian).

Los nombres de variable CSS originales se conservan en cada token (`$extensions["com.jcbrand"].cssVar`). En un componente se usa el nombre semántico. El core se carga igual, porque el alias apunta a él con `var(...)`.

## Instalar el paquete (GitHub Packages)

`@jcmartinezma/jcbrand` se publica **solo** en el registro npm de GitHub (`https://npm.pkg.github.com`), ligado al repo privado `jcmartinezma/jcbrand`. No está en npmjs.com. El primer publish nace privado y, como `repository` apunta a este repo, el paquete hereda sus permisos. No lleva `"private": true`: ese campo haría que `npm publish` se negara también en GitHub. La privacidad la da el repo, no ese campo.

### Token y `.npmrc` del proyecto que lo instala

Hace falta un personal access token **classic**. GitHub Packages no autentica con un token fine-grained. Scopes:

- `read:packages` para descargar el paquete.
- `repo`, porque el repositorio es privado. Sin `repo`, `read:packages` no basta.

Tu usuario de GitHub tiene que poder leer `jcmartinezma/jcbrand`. No escribas el token en el repo. En el **proyecto consumidor**, crea un `.npmrc` (este archivo sí se puede commitear):

```
@jcmartinezma:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

Ese archivo solo desvía el scope `@jcmartinezma`. El resto de dependencias sigue saliendo de npmjs.com. La variable `GITHUB_TOKEN` tiene que existir en local y en el CI o el hosting:

```bash
export GITHUB_TOKEN="tu PAT classic"
npm install @jcmartinezma/jcbrand
```

En GitHub Actions de **otro** repo, el `GITHUB_TOKEN` automático del workflow no lee este paquete. Guarda el PAT classic como secret y asígnaselo a `GITHUB_TOKEN` en el paso que instala.

### Imports

Fuentes y tokens, desde el paquete:

```js
import '@jcmartinezma/jcbrand/fonts.css';
import '@jcmartinezma/jcbrand/dist/css/tokens.css';
```

SCSS. El export `./dist/scss` apunta a `dist/scss/_index.scss` (`@forward` de core y semantic):

```scss
@use "@jcmartinezma/jcbrand/dist/scss" as jcbrand;

.card {
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
}
```

`as jcbrand` solo nombra el espacio de miembros Sass. No renombra `--color-bg-primary`: las custom properties siguen siendo globales y se usan con `var(...)`. Las fuentes se importan aparte; el SCSS no trae los `@font-face`.

El tema claro son 26 overrides. El resto se hereda de `:root`:

```html
<html data-theme="light">
```

Recetas de CSS plano, Tailwind, Next.js y Astro: `reference/stack-recipes.md`.

### Actualizar

```bash
npm update @jcmartinezma/jcbrand
```

Lee [CHANGELOG.md](CHANGELOG.md). Si una versión renombró o eliminó un token, hay que cambiar esos usos. La skill tiene un modo auditoría para encontrarlos.

## Build

`dist/` se commitea. El workflow de publicación vuelve a generarlo antes de `npm publish`, y quien clone el repo ve el CSS sin lanzar el build. El build solo hace falta aquí, cuando cambia un JSON.

Hace falta **Node 22 o más** (lo pide Style Dictionary 5). Desde la raíz de este repo:

```bash
npm install
npm run build:tokens
npm run check:tokens
```

`build:tokens` genera `dist/` y después compara cada variable con el JSON. Si un nombre o un valor no coincide con `cssVar`, el comando falla. `npm run clean:tokens` borra solo esos archivos generados. `check:tokens` valida el JSON sin regenerar.

No edites `dist/` a mano. Si cambias un JSON, vuelve a lanzar el build y commitea `dist/` junto con el token. Si cambió un valor descrito en `reference/`, actualiza esa tabla.

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

## Publicar una versión

No se publica en cada push a `main`. El workflow `.github/workflows/publish.yml` corre al **publicar un Release** (no un borrador), o si lo lanzas a mano en Actions.

1. Sube `version` en `package.json` (patch si solo cambia un valor, minor si añades tokens o componentes, major si renombras o eliminas). npm no deja repetir una versión.
2. Anótalo en [CHANGELOG.md](CHANGELOG.md). Si rompe nombres, di el viejo y el nuevo.
3. Merge a `main` con el `dist/` ya generado.
4. Crea un Release con tag `v` + esa versión (`v0.1.0` si `package.json` dice `0.1.0`) y publícalo. El workflow comprueba que coinciden y hace `npm publish` con el `GITHUB_TOKEN` del repo (`packages: write`).

No uses `--access public` ni `registry.npmjs.org`.

## Componentes, más adelante

`components/` está en el repo y vacío. No forma parte de `files` ni de `exports`, así que hoy no se puede importar. Cuando haya piezas de UI, vivirán en esa carpeta, se añadirán a `files` y a `exports` (por ejemplo `"./components/*"` o un export por componente) y se documentarán en la skill y en el CHANGELOG. Por dentro usarán los tokens semánticos. Quien consuma el paquete las importará; no las copiará.

# jcbrand

Sistema de diseño de la marca de JC (José Carlos Martínez), la de [jcmartinez.net](https://jcmartinez.net). Aquí están los **tokens** y las **fuentes**. El repo es privado y se usa como **skill de Cursor**: un agente la lee y aplica la marca en cualquier otro proyecto copiando `dist/` y `fonts/`.

No es un paquete npm. No se instala con `npm install`, no hace falta `.npmrc` ni un `GITHUB_TOKEN`, y no se publica en GitHub Packages ni en npmjs.com.

## Usarla como skill

Cursor trata como skill de usuario cualquier carpeta de `~/.cursor/skills/` que tenga un `SKILL.md` en la raíz. Este repo ya lo tiene, así que el clon entra directo:

```bash
git clone git@github.com:jcmartinezma/jcbrand.git ~/.cursor/skills/jcbrand
```

Hace falta permiso de lectura sobre este repo (sigue siendo privado). Abre un chat nuevo para que Cursor la detecte. A partir de ahí, al pedir que una interfaz use la marca de JC, el estilo de jcmartinez.net o los tokens jcbrand, el agente sigue `SKILL.md`.

Qué hace esa skill, en corto:

1. Copia `dist/` y `fonts/` al proyecto destino, por ejemplo a `src/styles/jcbrand/`.
2. Importa las fuentes y `dist/css/tokens.css` (o el SCSS) en el entry global.
3. En los componentes usa solo tokens semánticos (`--color-bg-primary`, `--text-size-sm`, …), nunca un hex ni un primitivo (`--gray-800`).
4. Compone la tipografía en CSS o en un mixin. No deja clases de tipo en el HTML.
5. Deja el tema oscuro por defecto. El claro es `data-theme="light"` en `<html>`.

El detalle por stack (CSS, SCSS, Tailwind, Next.js, Astro), las reglas de marca y el checklist están en `SKILL.md` y en `reference/`.

Cuando cambien los tokens en este repo: `git pull` dentro de `~/.cursor/skills/jcbrand` y vuelve a copiar `dist/` y `fonts/` a cada proyecto. Esos proyectos no reciben la marca solos.

## Estructura

```
jcbrand/
├── SKILL.md           # instrucciones para el agente
├── reference/         # tokens, reglas de marca, recetas por stack, checklist
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

Dos familias: **Rethink Sans** (texto) e **IBM Plex Mono** (mono). Los `@font-face` están en `fonts/fonts.css`, con rutas relativas a `fonts/files/`. Quien copie la carpeta `fonts/` entera no tiene que reescribir esas rutas.

Pesos, licencias y huecos (Rethink Sans no trae 300; IBM Plex Mono no trae 800) están en [FONTS.md](FONTS.md).

## Capas

1. **Core**: valores en crudo (`--gray-800`, `--spacing-100`…).
2. **Semantic**: alias de core con intención de uso (`--color-bg-primary` → `--gray-800`).
3. **Temas**: **oscuro** por defecto (`:root`, `color.dark.json`) y **claro** por override (`[data-theme="light"]`, `color.light.json`, solo los tokens que cambian).

Los nombres de variable CSS originales se conservan en cada token (`$extensions["com.jcbrand"].cssVar`). En un componente se usa el nombre semántico. El core se carga igual, porque el alias apunta a él con `var(...)`.

## Build

`dist/` se commitea para poder copiar el CSS y el SCSS sin instalar Style Dictionary en el proyecto destino. El build solo hace falta aquí, cuando cambia un JSON.

Hace falta **Node 22 o más** (lo pide Style Dictionary 5). Desde la raíz de este repo:

```bash
npm install
npm run build:tokens
npm run check:tokens
```

`build:tokens` genera `dist/` y después compara cada variable con el JSON. Si un nombre o un valor no coincide con `cssVar`, el comando falla. `npm run clean:tokens` borra solo esos archivos generados. `check:tokens` valida el JSON (alias, tipos, overrides del tema claro) sin regenerar.

No edites `dist/` a mano. Si cambias un JSON, vuelve a lanzar el build y commitea `dist/` junto con el token. Si cambió un valor que esté descrito en `reference/`, actualiza esa tabla: si no, la skill se queda con un número viejo. Ante un conflicto, manda `dist/`.

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

`package.json` tiene `"private": true`. Ese campo hace que `npm publish` se niegue. Los scripts de arriba siguen siendo los de generar y comprobar tokens.

## Paquete antiguo en GitHub Packages

La versión 0.1.0 se publicó en GitHub Packages (`@jcmartinezma/jcbrand`) con el release `v0.1.0`. Este repo ya no publica. Si el paquete sigue en tu cuenta, bórralo tú: el token con el que se trabaja este repo desde un agente no tiene permiso `delete:packages`, y la API responde 404 tanto si el paquete no está como si el token no puede ver un paquete privado.

En la web, con tu usuario:

1. Abre [los paquetes de tu perfil](https://github.com/jcmartinezma?tab=packages) (o la sección Packages del repo).
2. Entra en `@jcmartinezma/jcbrand`.
3. **Package settings**, al fondo, **Delete this package**. Confirma escribiendo el nombre del paquete.

Por línea de comandos, la sesión de `gh` tiene que ser la tuya y el token necesita `delete:packages` y `repo` (el paquete nació privado, ligado a este repo). No guardes el token en el repo:

```bash
gh auth refresh -s delete:packages,repo,read:packages
gh api -X DELETE /user/packages/npm/jcbrand
```

Un borrado hecho devuelve **204** y el cuerpo vacío. Un 404 no cuenta como borrado. Para quitar solo la versión 0.1.0, lista antes los ids y borra ese:

```bash
gh api /user/packages/npm/jcbrand/versions
gh api -X DELETE /user/packages/npm/jcbrand/versions/VERSION_ID
```

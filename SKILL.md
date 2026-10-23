---
name: jcbrand
description: >-
  Aplica la marca personal de JC (estilo del portfolio jcmartinez.net, tokens
  jcbrand, Rethink Sans e IBM Plex Mono) a cualquier proyecto. Úsala al crear
  o retocar UI, CSS, SCSS, Tailwind, Next.js, Astro o React para que usen esos
  tokens; al auditar colores, tamaños o fuentes hardcodeados; y al regenerar
  dist/ cuando cambien los tokens de este repo. No publica paquetes ni cambia
  la visibilidad del repo.
---

# jcbrand

Marca de JC (José Carlos Martínez), la de [jcmartinez.net](https://jcmartinez.net). Este directorio es la skill: los tokens viven en `tokens/`, el CSS y el SCSS ya generados en `dist/`, las fuentes en `fonts/`. El proyecto destino **no** instala un paquete npm. Copia archivos.

Antes de escribir estilos, abre el archivo que toque:

- [reference/stack-recipes.md](reference/stack-recipes.md) — cómo copiar e importar según el stack.
- [reference/tokens.md](reference/tokens.md) — cada token semántico, a qué primitivo apunta y el valor resuelto.
- [reference/brand-rules.md](reference/brand-rules.md) — paleta, tipo, espacio, radio, sombra, motion y contraste.
- [reference/checklist.md](reference/checklist.md) — ciérralo antes de dar la integración por hecha.
- [FONTS.md](FONTS.md) — pesos reales de los `.woff2` y la licencia OFL.

Si un número de `reference/` no coincide con `dist/`, manda `dist/` (sale de `tokens/`). No inventes hex, px, fuentes ni tokens que no estén en esas tablas.

## Integrar

1. Copia, desde la raíz de esta skill, `dist/` y `fonts/` (incluye `fonts/fonts.css`, `fonts/files/` y `fonts/licenses/`) a una carpeta del proyecto destino, por ejemplo `src/styles/jcbrand/`. No copies `tokens/`, `node_modules/` ni `package.json`.
2. Importa **las dos** hojas en el entry global del destino, en este orden: primero `fonts/fonts.css`, luego `dist/css/tokens.css`. `tokens.css` trae core y semantic. Hace falta el core porque cada alias semántico es un `var(--primitivo)`; en los componentes no uses ese primitivo.
3. En SCSS, `@use` del índice `dist/scss` (hace `@forward` de core y semantic) y, aparte, la hoja de fuentes. `as jcbrand` solo nombra el espacio Sass: **no** renombra las custom properties.
4. Adapta el import al stack con [reference/stack-recipes.md](reference/stack-recipes.md). No dejes la página con el preflight genérico: el `body` lleva fondo, texto y tipo semánticos.
5. Tema por defecto: no pongas atributo. `:root` ya es el tema oscuro. El claro es opt-in con `data-theme="light"` en `<html>`. No hay `prefers-color-scheme` en los tokens; no lo inventes.
6. Pasa la auditoría de abajo si el destino ya tiene UI.

Las rutas de `fonts.css` son `url('./files/...')` relativas a esa hoja. No las reescribas, no subas las fuentes a un CDN y no declares otro `@font-face` para estas familias.

## Tokens en los componentes

En el CSS del componente (o en un mixin Sass del destino) usa solo tokens **semánticos**:

- Color: `--color-bg-*`, `--color-surface-*`, `--color-text-*`, `--color-icon-*`, `--color-border-*`.
- Tipo: `--text-style-*`, `--text-size-*`, `--text-weight-*`, `--text-line-height-*`, `--text-letter-spacing-*`.
- Espacio: `--spacing-2xs` … `--spacing-5xl` (los de nombre, no `--spacing-100`).
- Radio: `--border-radius-xs|sm|md|lg|full`.
- Sombra: `--shadow-xs|sm|md|lg|xl`.
- Motion: `--motion-duration-*`, `--motion-delay-*`, `--motion-easing-*`.
- Desenfoque: `--blur-xs|sm|md|lg|xl|2xl`.

Prohibido en componentes: hex, `rgb(`, `hsl(`, px de marca, `font-family` con el nombre de la fuente escrito a mano, primitivos (`--gray-*`, `--green-*`, `--red-*`, `--blue-*`, `--white`, `--black`, `--font-size-*`, `--font-weights-*`, `--spacing-100`, `--border-radius-100`, `--opacity-*`, …) y utilidades de otra escala (el gris, el índigo o el `rounded-md` por defecto de Tailwind).

Excepción documentada: la opacidad solo existe como primitivo (`--opacity-00` 0%, `--opacity-100` 20%, `--opacity-200` 40%, `--opacity-300` 60%, `--opacity-400` 80%). No hay 100% ni capa semántica. Para un velo usa `--color-bg-overlay`, que ya lleva alpha. No inventes un `--color-opacity-*`.

## Tipografía

No hay clases de tipo en el HTML (`text-xl`, `font-bold`, `text-jc-lg`, …) ni un token compuesto en el JSON. Compón el rol en la hoja del componente: una regla o un mixin con familia, tamaño, peso, interlineado y tracking. El nombre de la clase describe el componente (`.card-title`), no la escala.

Los tres estilos de familia son `--text-style-display`, `--text-style-base` (los dos, Rethink Sans) y `--text-style-decor` (IBM Plex Mono). El peso `--text-weight-light` (300) solo es real en Plex Mono; Rethink Sans empieza en 400. `--text-weight-extrabold` (800) solo es real en Rethink Sans. Detalle y pares que no llegan a contraste en [reference/brand-rules.md](reference/brand-rules.md).

## Tema

Oscuro en `:root` (`tokens/semantic/color.dark.json`). Claro: 26 overrides en `[data-theme="light"]` (`color.light.json`); el resto se hereda. Esos 26 están listados en [reference/tokens.md](reference/tokens.md). No dupliques colores en una clase `.light`.

## Qué no hacer

- Un UI genérico: Inter, system-ui como familia principal, azul de enlace, sombras o radios de otro sistema.
- Acento (verde) en bloques grandes o en cada enlace. Un énfasis por vista. En tema claro `--color-text-accent` no se lee sobre el fondo; el acento legible es `--color-text-primary` sobre `--color-surface-accent`.
- Texto por debajo de WCAG AA 4.5:1, o borde, icono y foco por debajo de 3:1. Los pares que ya fallan con estos tokens están en [reference/brand-rules.md](reference/brand-rules.md): no los uses para ese rol.
- Quitar el anillo de teclado. El foco visible va con `:focus-visible` (receta en las reglas de marca). No pintes el foco solo en `:hover`.
- Publicar este repo, añadir `publishConfig`, o cambiar su visibilidad. Sigue siendo privado.

## Auditoría

Hazla al integrar marca en UI que ya existe, o si te piden revisar hardcodes. No modifiques la copia de `src/styles/jcbrand/`: ahí los primitivos y los hex son la salida del build.

Busca fuera de esa carpeta y de `node_modules`:

- Color: `#[0-9a-fA-F]{3,8}`, `rgb(`, `rgba(`, `hsl(`, `hsla(`, `oklch(`, `hwb(`, colores con nombre (`white`, `black`, `gray`, `green`, `red`, …) usados como diseño, y arbitrarios de Tailwind (`bg-[#`, `text-[#`, `border-[#`, `from-[#`).
- Tipo: `font-family` que no sea `var(--text-style-…)`, `font-size` / `font-weight` / `line-height` / `letter-spacing` en px, rem o número suelto, enlaces a Google Fonts o `next/font/google`.
- Medida: px en padding, margin, gap, radio, blur o sombra; duraciones en `s` o `ms` que no sean un `var(--motion-…)`.
- Primitivos jcbrand en componentes: `var(--gray-`, `var(--green-`, `var(--red-`, `var(--blue-`, `var(--white)`, `var(--black)`, `var(--font-size-`, `var(--font-weights-`, `var(--font-families-`, `var(--font-line-height-`, `var(--font-letter-spacings-`, `var(--spacing-100)`, `var(--border-radius-100)`, `var(--blur-100)`, `var(--opacity-`.
- `transparent` y `currentColor` pueden quedarse. Un `0` de reset (margen de body, `border: 0`) no es un token de marca.

Para cada hallazgo, propone **un** token semántico mirando [reference/tokens.md](reference/tokens.md):

- Empareja el hex o el px con el índice de esa referencia.
- Si varios tokens semánticos resuelven al mismo valor, elige por propiedad: fondo → `--color-bg-*` o `--color-surface-*`; texto → `--color-text-*`; icono → `--color-icon-*`; borde → `--color-border-*`; sombra → `--shadow-*`.
- Si el hex no está en la paleta (el azul entero, por ejemplo), no lo acerques a otro hex. Diló y sustituye por el token del **rol** (fondo, texto, borde, acento, peligro).
- Si el px no está en la escala (radio 8px, peso 500, peso 900), no hay token semántico: diló y usa el peldaño semántico más cercano solo si el cambio visual es aceptable; no uses el primitivo.

No borres un color a ciegas si no sabes el rol. Pregunta el rol o déjalo marcado.

## Regenerar dist/

Solo en esta skill, cuando cambie un JSON de `tokens/`. Hace falta Node 22 o superior (Style Dictionary 5.7).

```bash
npm install
npm run build:tokens
npm run check:tokens
```

`build:tokens` escribe `dist/` y falla si un nombre o un valor no coincide con el `cssVar` del JSON. No edites `dist/` a mano. Commitea `tokens/` y `dist/` juntos, actualiza `reference/` si cambió algún valor resuelto, y vuelve a copiar `dist/` y `fonts/` a cada proyecto destino.

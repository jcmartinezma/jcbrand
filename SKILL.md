---
name: jcbrand
description: >-
  Aplica la marca personal de JC (estilo del portfolio jcmartinez.net, paquete
  privado @jcmartinezma/jcbrand, Rethink Sans e IBM Plex Mono) instalándolo
  desde GitHub Packages. Úsala al crear o retocar UI, CSS, SCSS, Tailwind,
  Next.js, Astro o React; al configurar .npmrc y el token de lectura; al
  auditar colores, tamaños o fuentes hardcodeados; al mirar la Storybook del
  repo como referencia visual; y al publicar o actualizar una versión del
  paquete. No copia dist/ ni fonts/ al proyecto destino. No hace público el
  repo ni el paquete. No despliega Storybook.
---

# jcbrand

Marca de JC (José Carlos Martínez), la de [jcmartinez.net](https://jcmartinez.net). El proyecto destino **instala** el paquete privado `@jcmartinezma/jcbrand`. No copies `dist/` ni `fonts/` a su código: una copia se queda vieja y, cuando haya componentes, se descontrola. La actualización es `npm update`.

Esta carpeta es la skill (el manual). El paquete publicado solo lleva `dist/` y `fonts/` (`package.json` → `files`). La skill no viaja dentro del tarball.

Antes de escribir estilos, abre:

- [reference/stack-recipes.md](reference/stack-recipes.md) — `.npmrc`, install e imports por stack.
- [reference/tokens.md](reference/tokens.md) — cada token semántico, su primitivo y el valor resuelto.
- [reference/brand-rules.md](reference/brand-rules.md) — paleta, tipo, espacio, radio, sombra, motion y contraste.
- [reference/checklist.md](reference/checklist.md) — ciérralo antes de dar la integración por hecha.
- [CHANGELOG.md](CHANGELOG.md) — al subir o bajar de versión.
- [FONTS.md](FONTS.md) — pesos reales de los `.woff2` y la licencia OFL.

Si un número de `reference/` no coincide con `dist/`, manda `dist/` (sale de `tokens/`). No inventes hex, px, fuentes ni tokens que no estén en esas tablas.

## Instalar el paquete

En el proyecto destino, crea un `.npmrc` en la raíz. Es seguro de commitear: el token no está escrito, solo el nombre de la variable.

```
@jcmartinezma:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

Ese archivo solo desvía el scope `@jcmartinezma`. El resto de dependencias sigue en npmjs.com.

Hace falta un personal access token **classic** (GitHub Packages no autentica uno fine-grained) con `read:packages` y `repo`. Sin `repo`, un paquete privado no se descarga. El usuario de GitHub tiene que poder leer `jcmartinezma/jcbrand`.

Ponlo en la variable de entorno `GITHUB_TOKEN`, en local y en el CI o el hosting. No lo escribas en el repo, ni en `.npmrc`, ni en el código. En GitHub Actions el `GITHUB_TOKEN` automático del workflow **no** lee este paquete: guarda el PAT classic como secret y pásalo a la variable `GITHUB_TOKEN` del paso de install.

```bash
export GITHUB_TOKEN="el PAT classic; no lo pegues en un archivo"
npm install @jcmartinezma/jcbrand
```

Luego importa tokens y fuentes desde el paquete, en el entry global, con la receta del stack. `sideEffects` incluye `*.css` para que el bundler no descarte la hoja. Orden: fuentes, después `tokens.css`. Hace falta el core porque cada alias semántico es un `var(--primitivo)`; en los componentes no uses ese primitivo.

Tema por defecto: no pongas atributo. `:root` ya es el tema oscuro. El claro es opt-in con `data-theme="light"` en `<html>`. No hay `prefers-color-scheme` en los tokens; no lo inventes.

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

No hay clases de tipo en el HTML (`text-xl`, `font-bold`, `text-jc-lg`, …) ni un token compuesto en el JSON. Compón el rol en la hoja del componente: una regla o un mixin con familia, tamaño, peso, interlineado y tracking. El nombre de la clase describe el componente (`.card-title`), no la escala. El mixin vive en el proyecto destino, no dentro de `node_modules`.

Los tres estilos de familia son `--text-style-display`, `--text-style-base` (los dos, Rethink Sans) y `--text-style-decor` (IBM Plex Mono). El peso `--text-weight-light` (300) solo es real en Plex Mono; Rethink Sans empieza en 400. `--text-weight-extrabold` (800) solo es real en Rethink Sans. Detalle y pares que no llegan a contraste en [reference/brand-rules.md](reference/brand-rules.md).

## Tema

Oscuro en `:root` (`tokens/semantic/color.dark.json`). Claro: 26 overrides en `[data-theme="light"]` (`color.light.json`); el resto se hereda. Esos 26 están listados en [reference/tokens.md](reference/tokens.md). No dupliques colores en una clase `.light`.

## Qué no hacer

- Copiar `dist/` o `fonts/` al repo destino, ni venderlos desde `node_modules`.
- Un UI genérico: Inter, system-ui como familia principal, azul de enlace, sombras o radios de otro sistema.
- Acento (verde) en bloques grandes o en cada enlace. Un énfasis por vista. En tema claro `--color-text-accent` no se lee sobre el fondo; el acento legible es `--color-text-primary` sobre `--color-surface-accent`.
- Texto por debajo de WCAG AA 4.5:1, o borde, icono y foco por debajo de 3:1. Los pares que ya fallan con estos tokens están en [reference/brand-rules.md](reference/brand-rules.md): no los uses para ese rol.
- Quitar el anillo de teclado. El foco visible va con `:focus-visible` (receta en las reglas de marca). No pintes el foco solo en `:hover`.
- Publicar el paquete en npmjs.org, usar `--access public`, o cambiar la visibilidad del repo o del paquete. Los dos siguen privados.
- Escribir un token real en cualquier archivo.

## Auditoría

Hazla al integrar la marca en UI que ya existe, después de un `npm update` si el CHANGELOG renombra o quita tokens, o si te piden revisar hardcodes. No modifiques `node_modules/@jcmartinezma/jcbrand`: ahí los primitivos y los hex son la salida del build.

Busca en el proyecto destino, fuera de `node_modules`:

- Color: `#[0-9a-fA-F]{3,8}`, `rgb(`, `rgba(`, `hsl(`, `hsla(`, `oklch(`, `hwb(`, colores con nombre (`white`, `black`, `gray`, `green`, `red`, …) usados como diseño, y arbitrarios de Tailwind (`bg-[#`, `text-[#`, `border-[#`, `from-[#`).
- Tipo: `font-family` que no sea `var(--text-style-…)`, `font-size` / `font-weight` / `line-height` / `letter-spacing` en px, rem o número suelto, enlaces a Google Fonts o `next/font/google`.
- Medida: px en padding, margin, gap, radio, blur o sombra; duraciones en `s` o `ms` que no sean un `var(--motion-…)`.
- Primitivos jcbrand en componentes: `var(--gray-`, `var(--green-`, `var(--red-`, `var(--blue-`, `var(--white)`, `var(--black)`, `var(--font-size-`, `var(--font-weights-`, `var(--font-families-`, `var(--font-line-height-`, `var(--font-letter-spacings-`, `var(--spacing-100)`, `var(--border-radius-100)`, `var(--blur-100)`, `var(--opacity-`.
- Nombres que el CHANGELOG marque como renombrados o eliminados.
- `transparent` y `currentColor` pueden quedarse. Un `0` de reset (margen de body, `border: 0`) no es un token de marca.

Para cada hallazgo, propone **un** token semántico mirando [reference/tokens.md](reference/tokens.md):

- Empareja el hex o el px con el índice de esa referencia.
- Si varios tokens semánticos resuelven al mismo valor, elige por propiedad: fondo → `--color-bg-*` o `--color-surface-*`; texto → `--color-text-*`; icono → `--color-icon-*`; borde → `--color-border-*`; sombra → `--shadow-*`.
- Si el hex no está en la paleta (el azul entero, por ejemplo), no lo acerques a otro hex. Diló y sustituye por el token del **rol** (fondo, texto, borde, acento, peligro).
- Si el px no está en la escala (radio 8px, peso 500, peso 900), no hay token semántico: diló y usa el peldaño semántico más cercano solo si el cambio visual es aceptable; no uses el primitivo.
- Si el token viejo ya no existe, el sustituto es el que diga el CHANGELOG. Si no nombra sustituto, elige el semántico del mismo rol y dilo.

No borres un color a ciegas si no sabes el rol. Pregunta el rol o déjalo marcado.

## Publicar una versión nueva

Solo en **este** repo, cuando cambien tokens (y, más adelante, componentes). El paquete lo publica `.github/workflows/publish.yml` al publicar un Release (no un borrador), o a mano desde Actions. Solo GitHub Packages. npm rechaza repetir una versión.

1. Cambia los JSON en `tokens/`. Hace falta Node 22 o superior.
2. `npm install`, `npm run build:tokens` y `npm run check:tokens`. El build escribe `dist/` y falla si un nombre o un valor no coincide con el `cssVar`. No edites `dist/` a mano.
3. Si cambió un valor resuelto, actualiza `reference/` en el mismo cambio. Ante un conflicto, manda `dist/`.
4. Sube `version` en `package.json` y anota el cambio arriba del [CHANGELOG.md](CHANGELOG.md):
   - **patch** (`0.1.0` → `0.1.1`): el mismo nombre, otro valor. Quien actualice no renombra; sí mira el resultado.
   - **minor** (`0.1.0` → `0.2.0`): tokens o componentes nuevos. Lo ya instalado sigue valiendo.
   - **major** (`0.1.0` → `1.0.0`): un token se renombra o se elimina, o cambia la API de un componente. El CHANGELOG tiene que decir el nombre viejo, el nuevo, o que se elimina.
5. Merge a `main` con `tokens/`, `dist/` y el CHANGELOG juntos.
6. Crea un Release con tag `v` + esa versión (`v0.2.0` si `package.json` dice `0.2.0`) y publícalo. El workflow comprueba que coinciden y hace `npm publish` con el `GITHUB_TOKEN` del repo (`packages: write`). No uses `--access public` ni `registry.npmjs.org`.

## Actualizar un proyecto que ya lo usa

```bash
npm update @jcmartinezma/jcbrand
```

Lee el [CHANGELOG.md](CHANGELOG.md) de la versión a la que saltas. Si renombró o eliminó tokens, pasa la auditoría y sustituye cada uso. Un patch no obliga a renombrar; aun así mira las pantallas, porque un hex puede haber cambiado debajo del mismo nombre.

## Storybook

En este repo, `npm run storybook` abre la referencia visual de los tokens (Foundations). No es un sitio público y no forma parte del paquete: `files` sigue siendo `dist/` y `fonts/`. No la despliegues a GitHub Pages. `npm run build-storybook` solo escribe `storybook-static/` en local.

Los valores de esas páginas se leen de `tokens/`. Si no coinciden con `reference/`, manda `dist/` (sale de `tokens/`).

## Componentes, más adelante

Hoy el paquete es tokens y fuentes. La carpeta `components/` del repo está reservada y vacía. Las piezas de UI, cuando existan, serán **React**. El CSS de cada pieza usa tokens semánticos. Un proyecto Astro las monta como islas; no hace falta reescribirlas en `.astro`. Se documentan en la Storybook de este repo.

- El código vive en `components/`.
- Entran en el paquete por `files` y por `exports` de `package.json` (por ejemplo `"./components/*"` o un export por pieza). Hasta entonces no hay export: no inventes `import '@jcmartinezma/jcbrand/components/...'`.
- Por dentro usan los mismos tokens semánticos. El proyecto destino los importa del paquete, no los copia.
- Una versión que los añada sin romper imports es minor. Un cambio de su API es major y va al CHANGELOG.

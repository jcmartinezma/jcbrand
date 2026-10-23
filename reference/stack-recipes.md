# Cómo integrarlo en un proyecto

No copies `dist/` ni `fonts/`. El proyecto destino instala el paquete privado. En su raíz, un `.npmrc` que sí se puede commitear (el token no va escrito):

```
@jcmartinezma:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

`GITHUB_TOKEN` es un PAT **classic** con `read:packages` y `repo`, en el entorno local y en el CI o el hosting. No lo guardes en un archivo del repo. En GitHub Actions el token automático del workflow no lee este paquete: el secret con el PAT classic se asigna a esa variable en el paso de install.

```bash
export GITHUB_TOKEN="el PAT classic"
npm install @jcmartinezma/jcbrand
```

Lo instalado queda en `node_modules/@jcmartinezma/jcbrand/`. Ahí están `dist/css/tokens.css` (core + semantic) y `fonts/fonts.css` (`url('./files/...')`, con las licencias OFL al lado). No edites esa carpeta: el siguiente `npm update` la pisa. Los mixins y el CSS de los componentes viven en el proyecto destino.

Imports que usa el resto de esta página:

```js
import '@jcmartinezma/jcbrand/fonts.css';
import '@jcmartinezma/jcbrand/dist/css/tokens.css';
```

`fonts.css` y los tokens se importan **una vez**, en el entry global. En un CSS Module el bundler puede encapsular el `@import` y las variables no llegan al resto de la página. `sideEffects: ["*.css"]` del paquete evita que un bundler tire la hoja por no ver JS exportado.

El `body` no puede quedarse con el preflight de Tailwind o del navegador. Esta base es el cuerpo de [brand-rules.md](brand-rules.md):

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

Tema claro, solo si el proyecto lo pide. Sin atributo, el tema es el oscuro:

```html
<html lang="es" data-theme="light">
```

## CSS plano

En el CSS global. El bundler resuelve el nombre del paquete desde `node_modules`:

```css
@import "@jcmartinezma/jcbrand/fonts.css";
@import "@jcmartinezma/jcbrand/dist/css/tokens.css";
```

Un componente no lleva utilidad de tipo. La regla junta los tokens:

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
  <h2 class="card-title">Título</h2>
</article>
```

Ese HTML no dice `text-xl` ni `font-semibold`. Si hace falta un acento, una sola pieza usa `--color-text-accent` (en oscuro) o `--color-surface-accent` con `--color-text-primary` encima (en claro).

## SCSS

El índice emite las custom properties. `@use … as jcbrand` no les cambia el nombre: siguen siendo `--color-bg-primary`.

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

Los mixins viven en el proyecto destino (`src/styles/type.scss` o junto al componente), no dentro de `node_modules`.

Vite, webpack y el Sass de Next resuelven `@use "@jcmartinezma/jcbrand/dist/scss"` contra el export del paquete. Sass lanzado a pelo, sin ese resolver, no mira `node_modules`: en ese caso usa el import CSS de arriba.

Las fuentes no van en el SCSS generado. En el entry JS o en el CSS global:

```js
import '@jcmartinezma/jcbrand/fonts.css';
```

No redeclares los `@font-face`.

## Tailwind

Mapea al theme **solo** tokens semánticos, y siempre con `var(--token)`, nunca con el hex. El prefijo `jc-` evita pisar la escala por defecto de Tailwind y también evita una variable que se referencia a sí misma.

No crees utilidades de tipo (`text-jc-xl`, `font-jc-bold`). Esas se componen en CSS, como arriba. El theme de Tailwind, para esta marca, es color, espacio, radio, sombra, blur y easing.

Aunque mapees `bg-jc-bg-primary`, no uses `bg-zinc-900`, `text-white`, `rounded-md` ni `shadow-md`. Esas escalas no son jcbrand.

### Tailwind 4

`@theme inline` hace que la utilidad apunte al `var(--color-…)` de jcbrand. Sin `inline`, el theme puede quedarse con una copia que no oye `[data-theme="light"]`.

`tokens.css` tiene que cargarse para que esas variables existan. Va antes de `@import "tailwindcss"`. El `body` va **después** del preflight, o el fondo y la fuente vuelven a ser los genéricos.

```css
@import "@jcmartinezma/jcbrand/fonts.css";
@import "@jcmartinezma/jcbrand/dist/css/tokens.css";
@import "tailwindcss";

@theme inline {
  --color-jc-bg-primary: var(--color-bg-primary);
  --color-jc-bg-secondary: var(--color-bg-secondary);
  --color-jc-bg-tertiary: var(--color-bg-tertiary);
  --color-jc-bg-secondary-inverse: var(--color-bg-secondary-inverse);
  --color-jc-bg-tertiary-inverse: var(--color-bg-tertiary-inverse);
  --color-jc-bg-overlay: var(--color-bg-overlay);

  --color-jc-surface-primary: var(--color-surface-primary);
  --color-jc-surface-primary-hover: var(--color-surface-primary-hover);
  --color-jc-surface-secondary: var(--color-surface-secondary);
  --color-jc-surface-secondary-inverse: var(--color-surface-secondary-inverse);
  --color-jc-surface-tertiary: var(--color-surface-tertiary);
  --color-jc-surface-tertiary-inverse: var(--color-surface-tertiary-inverse);
  --color-jc-surface-accent: var(--color-surface-accent);
  --color-jc-surface-danger: var(--color-surface-danger);

  --color-jc-text-primary: var(--color-text-primary);
  --color-jc-text-secondary: var(--color-text-secondary);
  --color-jc-text-secondary-hover: var(--color-text-secondary-hover);
  --color-jc-text-secondary-inverse: var(--color-text-secondary-inverse);
  --color-jc-text-tertiary: var(--color-text-tertiary);
  --color-jc-text-accent: var(--color-text-accent);
  --color-jc-text-danger: var(--color-text-danger);

  --color-jc-icon-primary: var(--color-icon-primary);
  --color-jc-icon-secondary: var(--color-icon-secondary);
  --color-jc-icon-tertiary: var(--color-icon-tertiary);
  --color-jc-icon-accent: var(--color-icon-accent);

  --color-jc-border-primary: var(--color-border-primary);
  --color-jc-border-secondary: var(--color-border-secondary);
  --color-jc-border-tertiary: var(--color-border-tertiary);
  --color-jc-border-secondary-hover: var(--color-border-secondary-hover);
  --color-jc-border-accent: var(--color-border-accent);
  --color-jc-border-danger: var(--color-border-danger);

  --spacing-jc-2xs: var(--spacing-2xs);
  --spacing-jc-xs: var(--spacing-xs);
  --spacing-jc-sm: var(--spacing-sm);
  --spacing-jc-md: var(--spacing-md);
  --spacing-jc-lg: var(--spacing-lg);
  --spacing-jc-xl: var(--spacing-xl);
  --spacing-jc-2xl: var(--spacing-2xl);
  --spacing-jc-3xl: var(--spacing-3xl);
  --spacing-jc-4xl: var(--spacing-4xl);
  --spacing-jc-5xl: var(--spacing-5xl);

  --radius-jc-xs: var(--border-radius-xs);
  --radius-jc-sm: var(--border-radius-sm);
  --radius-jc-md: var(--border-radius-md);
  --radius-jc-lg: var(--border-radius-lg);
  --radius-jc-full: var(--border-radius-full);

  --shadow-jc-xs: var(--shadow-xs);
  --shadow-jc-sm: var(--shadow-sm);
  --shadow-jc-md: var(--shadow-md);
  --shadow-jc-lg: var(--shadow-lg);
  --shadow-jc-xl: var(--shadow-xl);

  --blur-jc-xs: var(--blur-xs);
  --blur-jc-sm: var(--blur-sm);
  --blur-jc-md: var(--blur-md);
  --blur-jc-lg: var(--blur-lg);
  --blur-jc-xl: var(--blur-xl);
  --blur-jc-2xl: var(--blur-2xl);

  --ease-jc-standard: var(--motion-easing-standard);
  --ease-jc-enter: var(--motion-easing-enter);
  --ease-jc-exit: var(--motion-easing-exit);
  --ease-jc-linear: var(--motion-easing-linear);
}

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

Eso deja utilidades `bg-jc-bg-primary`, `text-jc-text-primary`, `p-jc-md`, `rounded-jc-sm`, `shadow-jc-sm`, `blur-jc-md`, `ease-jc-standard`. La duración no tiene clave de theme aquí: va en el CSS del componente con `var(--motion-duration-fast)` y el resto de duraciones de [tokens.md](tokens.md).

### Tailwind 3

Misma idea en `tailwind.config.js`, con `var()` para que el tema claro siga funcionando. El CSS de entrada importa las hojas y luego las directivas de Tailwind. El bloque `body` va en una capa posterior a `base`.

```js
/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
      colors: {
        "jc-bg-primary": "var(--color-bg-primary)",
        "jc-bg-secondary": "var(--color-bg-secondary)",
        "jc-bg-tertiary": "var(--color-bg-tertiary)",
        "jc-bg-secondary-inverse": "var(--color-bg-secondary-inverse)",
        "jc-bg-tertiary-inverse": "var(--color-bg-tertiary-inverse)",
        "jc-bg-overlay": "var(--color-bg-overlay)",
        "jc-surface-primary": "var(--color-surface-primary)",
        "jc-surface-primary-hover": "var(--color-surface-primary-hover)",
        "jc-surface-secondary": "var(--color-surface-secondary)",
        "jc-surface-secondary-inverse": "var(--color-surface-secondary-inverse)",
        "jc-surface-tertiary": "var(--color-surface-tertiary)",
        "jc-surface-tertiary-inverse": "var(--color-surface-tertiary-inverse)",
        "jc-surface-accent": "var(--color-surface-accent)",
        "jc-surface-danger": "var(--color-surface-danger)",
        "jc-text-primary": "var(--color-text-primary)",
        "jc-text-secondary": "var(--color-text-secondary)",
        "jc-text-secondary-hover": "var(--color-text-secondary-hover)",
        "jc-text-secondary-inverse": "var(--color-text-secondary-inverse)",
        "jc-text-tertiary": "var(--color-text-tertiary)",
        "jc-text-accent": "var(--color-text-accent)",
        "jc-text-danger": "var(--color-text-danger)",
        "jc-icon-primary": "var(--color-icon-primary)",
        "jc-icon-secondary": "var(--color-icon-secondary)",
        "jc-icon-tertiary": "var(--color-icon-tertiary)",
        "jc-icon-accent": "var(--color-icon-accent)",
        "jc-border-primary": "var(--color-border-primary)",
        "jc-border-secondary": "var(--color-border-secondary)",
        "jc-border-tertiary": "var(--color-border-tertiary)",
        "jc-border-secondary-hover": "var(--color-border-secondary-hover)",
        "jc-border-accent": "var(--color-border-accent)",
        "jc-border-danger": "var(--color-border-danger)",
      },
      spacing: {
        "jc-2xs": "var(--spacing-2xs)",
        "jc-xs": "var(--spacing-xs)",
        "jc-sm": "var(--spacing-sm)",
        "jc-md": "var(--spacing-md)",
        "jc-lg": "var(--spacing-lg)",
        "jc-xl": "var(--spacing-xl)",
        "jc-2xl": "var(--spacing-2xl)",
        "jc-3xl": "var(--spacing-3xl)",
        "jc-4xl": "var(--spacing-4xl)",
        "jc-5xl": "var(--spacing-5xl)",
      },
      borderRadius: {
        "jc-xs": "var(--border-radius-xs)",
        "jc-sm": "var(--border-radius-sm)",
        "jc-md": "var(--border-radius-md)",
        "jc-lg": "var(--border-radius-lg)",
        "jc-full": "var(--border-radius-full)",
      },
      boxShadow: {
        "jc-xs": "var(--shadow-xs)",
        "jc-sm": "var(--shadow-sm)",
        "jc-md": "var(--shadow-md)",
        "jc-lg": "var(--shadow-lg)",
        "jc-xl": "var(--shadow-xl)",
      },
      transitionTimingFunction: {
        "jc-standard": "var(--motion-easing-standard)",
        "jc-enter": "var(--motion-easing-enter)",
        "jc-exit": "var(--motion-easing-exit)",
        "jc-linear": "var(--motion-easing-linear)",
      },
      transitionDuration: {
        "jc-instant": "var(--motion-duration-instant)",
        "jc-fast": "var(--motion-duration-fast)",
        "jc-exit": "var(--motion-duration-exit)",
        "jc-normal": "var(--motion-duration-normal)",
        "jc-enter": "var(--motion-duration-enter)",
        "jc-slow": "var(--motion-duration-slow)",
        "jc-emphasis": "var(--motion-duration-emphasis)",
      },
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

No añadas `fontSize` ni `fontFamily` a ese `extend` si el resultado son clases que luego se ponen en el HTML. La familia y el tamaño se quedan en la regla del componente.

## Next.js y React

No uses `next/font/google` ni `next/font/local` para estas familias: volverías a declarar los `@font-face` y perderías los pesos y el `font-display: swap` de `fonts.css`. Importa las hojas.

App Router, en el layout raíz para que cubra todas las rutas:

```tsx
import "@jcmartinezma/jcbrand/fonts.css";
import "@jcmartinezma/jcbrand/dist/css/tokens.css";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
```

`globals.css` lleva el `body` de arriba y el `:focus-visible` de [brand-rules.md](brand-rules.md). El tema claro, si existe, es el atributo en `<html>`, no un provider que reescriba hex.

Pages Router: los mismos `import` en `pages/_app.tsx`.

Con Vite + React, los mismos `import` en `main.tsx`, antes del render. Las `url('./files/...')` de `fonts.css` las resuelve el bundler dentro de `node_modules/@jcmartinezma/jcbrand/fonts/`. No copies los `.woff2` a `public/`.

## Astro

En el layout base, para que cada página herede las variables:

```astro
---
import "@jcmartinezma/jcbrand/fonts.css";
import "@jcmartinezma/jcbrand/dist/css/tokens.css";
import "../styles/global.css";
---
<html lang="es">
  <body>
    <slot />
  </body>
</html>
```

`global.css` es el `body` y el foco. No pongas `tokens.css` solo en una página: la siguiente ruta saldría sin marca.

Si el proyecto Astro usa Tailwind, suma la receta de Tailwind 4 (Astro con `@tailwindcss/vite`) o la de Tailwind 3, sin duplicar el import de `tokens.css`.

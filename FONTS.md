# Fuentes de @jcmartinezma/jcbrand

El paquete incluye las fuentes de marca. Se instalan con `@jcmartinezma/jcbrand`, sin Google Fonts ni un CDN, y sin copiar `fonts/` al proyecto.

## Familias y pesos

| Familia | Archivo(s) | Pesos | Estilos |
|---|---|---|---|
| **Rethink Sans** | `RethinkSans-Variable.woff2`, `RethinkSans-Italic-Variable.woff2` | 400–800 (variable, eje `wght`) | normal, cursiva |
| **IBM Plex Mono** | `IBMPlexMono-{Light,Regular,Medium,SemiBold,Bold}.woff2` | 300, 400, 500, 600, 700 | normal |

### Cobertura de los pesos de los tokens (300, 400, 500, 600, 700, 800)

- **Rethink Sans**: la fuente original solo existe de 400 a 800. **No hay peso 300.** Si un token pide `300` con Rethink Sans, el navegador usará 400 (el más cercano disponible). Recomendación: usar 300 solo con IBM Plex Mono, o subir ese token a 400. En la práctica, `--text-weight-light` va con `--text-style-decor`, no con `--text-style-base` ni `--text-style-display`.
- **IBM Plex Mono**: 300–700 incluidos. **No hay 800**; un `800` se resolverá como 700 (Bold). `--text-weight-extrabold` no es real en la mono.
- No se incluyen las cursivas de IBM Plex Mono (no aparecen en los tokens). Se pueden añadir más adelante desde la misma fuente.
- El peso 500 existe en el archivo Medium de IBM Plex Mono y como primitivo `--font-weights-300`, pero **no** hay token semántico para 500. Tampoco lo hay para 900.

## Estructura en el paquete

```
fonts/
├── fonts.css              # @font-face con rutas relativas (./files/...)
├── files/                 # .woff2
└── licenses/
    ├── OFL-RethinkSans.txt
    └── OFL-IBMPlexMono.txt
```

Todas las rutas de `fonts.css` son relativas (`url('./files/...')`). Una vez instalado el paquete en `node_modules`, esas rutas las resuelve Vite, Next.js, webpack o Astro. No copies la carpeta a otro sitio.

## Uso en un proyecto

El `.npmrc` y el `GITHUB_TOKEN` están en el README. Con el paquete instalado, en el entry de la app (`main.ts`, `layout.tsx`, el layout de Astro, el CSS global):

```js
import '@jcmartinezma/jcbrand/fonts.css';
import '@jcmartinezma/jcbrand/dist/css/tokens.css';
```

o desde CSS:

```css
@import '@jcmartinezma/jcbrand/fonts.css';
@import '@jcmartinezma/jcbrand/dist/css/tokens.css';
```

La familia no se escribe a mano en los componentes. Los tokens ya traen el nombre y el fallback:

```css
body {
  font-family: var(--text-style-base);   /* "Rethink Sans", sans-serif */
}

code, pre, .meta {
  font-family: var(--text-style-decor);  /* "IBM Plex Mono", monospace */
}
```

`--text-style-display` usa la misma pila que `--text-style-base`. Cómo componer tamaño, peso e interlineado está en `SKILL.md` y en `reference/brand-rules.md`.

## `package.json`

Estos campos hacen que las fuentes entren en el paquete:

- `"files": ["dist", "fonts"]`.
- `exports`: `./fonts.css` → `./fonts/fonts.css`, y `./fonts/*` → `./fonts/*`. Los tokens (`./dist/css/tokens.css`, `./dist/scss`, …) están documentados en el README.
- `"sideEffects": ["*.css"]` para que los bundlers no eliminen el import.

`components/` no está en `files` ni en `exports`. Cuando haya componentes, se añadirán ahí; las fuentes no cambian de export.

## Origen y licencia

- Origen: repositorio oficial de Google Fonts (`github.com/google/fonts`, rutas `ofl/rethinksans` y `ofl/ibmplexmono`). Rethink Sans v1.001, IBM Plex Mono v2.3.
- Conversión TTF → WOFF2 con `fontTools` (solo compresión, sin subsetting ni cambios en los glifos ni en los nombres).
- Licencia: **SIL Open Font License 1.1**. Se pueden redistribuir dentro del paquete siempre que se incluyan los archivos de licencia (`fonts/licenses/`). No se pueden vender por separado. "Plex" es un Reserved Font Name de IBM: no renombrar ni modificar la fuente bajo ese nombre.

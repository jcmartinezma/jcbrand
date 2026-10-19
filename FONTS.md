# Fuentes de @jcmartinezma/jcbrand

El paquete incluye las fuentes de marca para que se instalen junto con el paquete npm, sin depender de Google Fonts ni de un CDN.

## Familias y pesos

| Familia | Archivo(s) | Pesos | Estilos |
|---|---|---|---|
| **Rethink Sans** | `RethinkSans-Variable.woff2`, `RethinkSans-Italic-Variable.woff2` | 400–800 (variable, eje `wght`) | normal, cursiva |
| **IBM Plex Mono** | `IBMPlexMono-{Light,Regular,Medium,SemiBold,Bold}.woff2` | 300, 400, 500, 600, 700 | normal |

### Cobertura de los pesos de los tokens (300, 400, 500, 600, 700, 800)

- **Rethink Sans**: la fuente original solo existe de 400 a 800. **No hay peso 300.** Si un token pide `300` con Rethink Sans, el navegador usará 400 (el más cercano disponible). Recomendación: usar 300 solo con IBM Plex Mono, o subir ese token a 400.
- **IBM Plex Mono**: 300–700 incluidos. **No hay 800**; un `800` se resolverá como 700 (Bold).
- No se incluyen las cursivas de IBM Plex Mono (no aparecen en los tokens). Se pueden añadir más adelante desde la misma fuente.

## Estructura en el paquete

```
fonts/
├── fonts.css              # @font-face con rutas relativas (./files/...)
├── files/                 # .woff2
└── licenses/
    ├── OFL-RethinkSans.txt
    └── OFL-IBMPlexMono.txt
```

Todas las rutas de `fonts.css` son relativas (`url('./files/...')`), así que funcionan una vez instalado el paquete en `node_modules`, con Vite, Next.js, webpack, etc.

## Uso en un proyecto

```js
// en el entry de la app (main.ts, _app.tsx, layout.tsx…)
import '@jcmartinezma/jcbrand/fonts.css';
```

o desde CSS:

```css
@import '@jcmartinezma/jcbrand/fonts.css';
```

Y luego:

```css
body { font-family: 'Rethink Sans', system-ui, sans-serif; }
code, pre { font-family: 'IBM Plex Mono', ui-monospace, monospace; }
```

(Los nombres de familia coinciden con los de los tokens de tipografía: `Rethink Sans` e `IBM Plex Mono`.)

## `package.json`

Estos campos ya están aplicados:

- `"files": ["dist", "fonts"]` para que `fonts/` entre en el paquete cuando se publique.
- `exports`: `./fonts.css` → `./fonts/fonts.css`, y `./fonts/*` → `./fonts/*`. Los tokens (`./dist/css/tokens.css`, `./dist/scss`, …) están documentados en el README.
- `"sideEffects": ["*.css"]` para que los bundlers no eliminen el import.

## Origen y licencia

- Origen: repositorio oficial de Google Fonts (`github.com/google/fonts`, rutas `ofl/rethinksans` y `ofl/ibmplexmono`). Rethink Sans v1.001, IBM Plex Mono v2.3.
- Conversión TTF → WOFF2 con `fontTools` (solo compresión, sin subsetting ni cambios en los glifos ni en los nombres).
- Licencia: **SIL Open Font License 1.1**. Se pueden redistribuir dentro del paquete siempre que se incluyan los archivos de licencia (`fonts/licenses/`). No se pueden vender por separado. "Plex" es un Reserved Font Name de IBM: no renombrar ni modificar la fuente bajo ese nombre.

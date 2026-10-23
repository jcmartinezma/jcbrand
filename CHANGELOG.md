# Changelog

Cambios del paquete `@jcmartinezma/jcbrand` que se publica en GitHub Packages. La versión es la de `package.json`. El tag del Release es `v` más esa versión.

Este archivo sigue en el repo. El tarball publicado incluye `dist/` y `fonts/` (`files` en `package.json`), no la skill ni este changelog. Quien actualiza con `npm update` tiene que leerlo aquí, o en el Release, para ver tokens renombrados o eliminados.

Un cambio que solo toca la skill o el README no publica versión nueva.

## 0.1.0 — 2026-10-19

Primera versión publicada. Release `v0.1.0`.

### Añadido

- Tokens DTCG en `tokens/core` (primitivos) y `tokens/semantic` (tema oscuro en `:root`, 26 overrides en `[data-theme="light"]`).
- `dist/`: CSS (`tokens.css`, hojas `core/` y `semantic/`) y parciales SCSS, generados con Style Dictionary 5.
- Fuentes de marca en `fonts/`: Rethink Sans (variable, 400–800, normal y cursiva) e IBM Plex Mono (300, 400, 500, 600, 700), con `fonts.css` y las licencias SIL OFL 1.1.
- Exports de paquete: `./fonts.css`, `./fonts/*`, `./dist/css/tokens.css`, `./dist/css/*`, `./dist/scss`, `./dist/scss/core`, `./dist/scss/semantic`, `./dist/scss/*`.

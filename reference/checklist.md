# Checklist de integración

Márcalo en el proyecto destino. La copia de `src/styles/jcbrand/` no se edita: es la salida de esta skill.

- [ ] `dist/` y `fonts/` están en el destino (`fonts/files/` y `fonts/licenses/` incluidos). No se copió `tokens/` ni `node_modules/`.
- [ ] El entry global importa `fonts/fonts.css` y después `dist/css/tokens.css` (o `@use` de `dist/scss` más la hoja de fuentes). No hay `@font-face` nuevo ni Google Fonts.
- [ ] `body` usa `--color-bg-primary`, `--color-text-primary` y el tipo base (`--text-style-base`, `--text-size-sm`, `--text-weight-normal`, `--text-line-height-md`, `--text-letter-spacing-normal`).
- [ ] Los componentes solo nombran tokens semánticos. No hay hex, primitivos (`--gray-*`, `--green-*`, `--font-size-*`, …) ni px de la escala escritos a mano.
- [ ] La tipografía está en mixins o en reglas del componente. El HTML no lleva clases de escala (`text-xl`, `font-bold`, `text-jc-lg`).
- [ ] Sin atributo, la página es oscura. El claro, si existe, es `data-theme="light"` en `<html>`, no una clase con colores copiados ni `prefers-color-scheme`.
- [ ] El foco de teclado se ve con `:focus-visible`. En oscuro el color es `--color-border-accent`; en claro, `--color-border-primary`. El offset es `--spacing-2xs`.
- [ ] El verde de acento aparece como mucho en un énfasis por vista. En claro, el texto acento no va sobre el fondo de página: el par legible es `--color-text-primary` sobre `--color-surface-accent`.
- [ ] Los pares de [brand-rules.md](brand-rules.md) que no llegan a 4.5:1 (texto) o 3:1 (borde, icono, foco) no se usan para ese rol.
- [ ] La auditoría de `SKILL.md` se ha pasado fuera de la carpeta copiada. Cada hardcode tiene un token semántico propuesto, o queda marcado porque el valor no está en la paleta.
- [ ] Este repo sigue privado. No se ha añadido publicación npm ni un token en ningún archivo.

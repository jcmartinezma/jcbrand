# Checklist de integración

Márcalo en el proyecto destino. No se edita `node_modules/@jcmartinezma/jcbrand`: es el paquete instalado.

- [ ] Hay un `.npmrc` en la raíz con `@jcmartinezma:registry=https://npm.pkg.github.com` y `//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}`. No hay un token escrito en el archivo.
- [ ] `GITHUB_TOKEN` es un PAT classic con `read:packages` y `repo`, en el entorno local y en el CI o el hosting. En Actions no se usa el token automático del workflow.
- [ ] `@jcmartinezma/jcbrand` está en las dependencias. No se ha copiado `dist/` ni `fonts/` al código del proyecto.
- [ ] El entry global importa `@jcmartinezma/jcbrand/fonts.css` y `@jcmartinezma/jcbrand/dist/css/tokens.css` (o `@use` de `@jcmartinezma/jcbrand/dist/scss` más la hoja de fuentes). No hay `@font-face` nuevo ni Google Fonts.
- [ ] `body` usa `--color-bg-primary`, `--color-text-primary` y el tipo base (`--text-style-base`, `--text-size-sm`, `--text-weight-normal`, `--text-line-height-md`, `--text-letter-spacing-normal`).
- [ ] Los componentes solo nombran tokens semánticos. No hay hex, primitivos (`--gray-*`, `--green-*`, `--font-size-*`, …) ni px de la escala escritos a mano.
- [ ] La tipografía está en mixins o en reglas del componente, en el proyecto destino. El HTML no lleva clases de escala (`text-xl`, `font-bold`, `text-jc-lg`).
- [ ] Sin atributo, la página es oscura. El claro, si existe, es `data-theme="light"` en `<html>`, no una clase con colores duplicados ni `prefers-color-scheme`.
- [ ] El foco de teclado se ve con `:focus-visible`. En oscuro el color es `--color-border-accent`; en claro, `--color-border-primary`. El offset es `--spacing-2xs`.
- [ ] El verde de acento aparece como mucho en un énfasis por vista. En claro, el texto acento no va sobre el fondo de página: el par legible es `--color-text-primary` sobre `--color-surface-accent`.
- [ ] Los pares de [brand-rules.md](brand-rules.md) que no llegan a 4.5:1 (texto) o 3:1 (borde, icono, foco) no se usan para ese rol.
- [ ] La auditoría de `SKILL.md` se ha pasado fuera de `node_modules`. Cada hardcode tiene un token semántico propuesto, o queda marcado porque el valor no está en la paleta.
- [ ] Si hubo `npm update`, el CHANGELOG de esa versión está revisado y los tokens renombrados o eliminados ya no se usan.
- [ ] El repo y el paquete siguen privados. No se ha publicado en npmjs.org ni se ha escrito un token en el repo.

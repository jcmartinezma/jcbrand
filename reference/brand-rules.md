# Reglas de marca

Salen de los tokens de [tokens.md](tokens.md) y de los archivos de `fonts/`. Los contrastes de abajo se calcularon con la luminancia relativa de WCAG 2 a partir de los hex de `dist/css/core/color.css`. No son tokens: sirven para no emparejar mal los que ya existen.

## Paleta y uso

La marca es gris cálido-neutro, casi negro de fondo (`#141414`) y un verde ácido como acento. El rojo es peligro. El azul existe en core y no tiene ni un alias semántico: no es color de enlace, de foco ni de acento.

| Rol | Tokens | Cómo se usa |
|---|---|---|
| Lienzo | `--color-bg-primary`, `secondary`, `tertiary` | Página, secciones, bandas. El primary es el fondo por defecto. |
| Inverse | `--color-bg-secondary-inverse`, `--color-bg-tertiary-inverse`, `--color-surface-*-inverse` | Bloques que se invierten. Siguen claros en el tema oscuro (`#FFFFFF`, `#EFEFEF`, `#D5D5D5`). |
| Superficie | `--color-surface-*` | Tarjetas, chips, controles rellenos, por encima del lienzo. |
| Acento | `--color-surface-accent`, `--color-text-accent`, `--color-icon-accent`, `--color-border-accent` | Un énfasis por vista. No rellenos grandes ni todos los enlaces. |
| Peligro | `--color-*-danger` | Error, acción destructiva. No como segundo acento. |
| Texto | `--color-text-primary` cuerpo; `secondary` apoyo; `tertiary` solo si el contraste de abajo lo permite | El tertiary es metadato débil, no un párrafo. |
| Icono | `--color-icon-*` | No reutilices el token de texto para un icono si existe el de icono del mismo nivel. |
| Borde | `--color-border-primary` el más visible; `secondary` y `tertiary` son separadores suaves | El hover de borde es `--color-border-secondary-hover`. |
| Velo | `--color-bg-overlay` | Modal y scrim. Ya lleva 80% de alpha. |

`--color-surface-primary` y su hover son el mismo `#8A8A8A` en los dos temas. No inventes un hover más claro. El hover que sí cambia de token es el de texto secundario y el de borde secundario.

## Contraste

Umbral: texto 4.5:1, y 3:1 para borde, icono y foco (WCAG AA). Si un par de esta lista no llega, no lo uses para ese rol. No lo «arregles» con un primitivo (`--green-700`, `--gray-800`, …).

### Texto que sí llega a 4.5:1

Tema oscuro:

- `--color-text-primary` sobre `--color-bg-primary` (16.02), sobre `--color-bg-secondary` (13.50) y sobre `--color-bg-tertiary` (7.71).
- `--color-text-secondary` sobre `--color-bg-primary` (5.34). Sobre `--color-bg-secondary` se queda en 4.50 (el cálculo da 4.497): no lo uses para cuerpo; usa `--color-text-primary`.
- `--color-text-secondary-hover` sobre `--color-bg-primary` (12.55).
- `--color-text-accent` sobre `--color-bg-primary` (10.75) y sobre `--color-bg-secondary` (9.06).
- `--color-text-danger` sobre `--color-bg-primary` (4.58). Sobre `--color-bg-secondary` baja a 3.86: no.
- `--color-text-secondary-inverse` (`#141414`) sobre `--color-bg-secondary-inverse` (`#FFFFFF`): 18.42. Este par es el del bloque inverse en oscuro.
- `--color-text-primary` sobre `--color-surface-accent` (6.98), `--color-surface-danger` (13.97), `--color-surface-tertiary` (13.50) y `--color-surface-secondary` (7.71).

Tema claro:

- `--color-text-primary` sobre `--color-bg-primary` (15.52), `--color-bg-secondary` (13.50) y `--color-bg-tertiary` (10.58).
- `--color-text-secondary` sobre `--color-bg-primary` (6.01) y sobre `--color-bg-secondary` (5.22).
- `--color-text-danger` sobre `--color-bg-primary` (6.71).
- `--color-text-primary` sobre `--color-surface-accent` (12.45), `--color-surface-danger` (8.98), `--color-surface-secondary` (6.68) y `--color-surface-tertiary` (10.58).

### Texto o icono que no llega

- Oscuro, `--color-text-tertiary` sobre `--color-bg-primary`: 3.07. Vale como trazo no textual; no como párrafo. Sobre `--color-bg-secondary`: 2.58, ni siquiera 3:1.
- Oscuro, `--color-text-primary` sobre `--color-surface-primary`: alrededor de 3.0. Esa superficie no es fondo de texto en oscuro.
- Claro, `--color-text-tertiary` y `--color-text-secondary-hover` sobre `--color-bg-primary`: 3.45. No son color de texto quieto.
- Claro, `--color-text-accent` sobre `--color-bg-primary`: 2.12. Sobre `--color-bg-secondary`: 1.84. No se lee. El acento legible en claro es `--color-text-primary` encima de `--color-surface-accent` (12.45).
- Claro, `--color-icon-accent` sobre `--color-bg-primary`: 2.12. Mismo criterio: icono acento sobre superficie acento, o `--color-icon-primary`.
- Claro, `--color-text-secondary-inverse` (`#EFEFEF`) sobre `--color-bg-secondary-inverse` (`#FFFFFF`): 1.15. En claro no emparejes esos dos. El inverse de texto está pensado para el tema oscuro.

### Bordes y foco (3:1 contra el fondo de al lado)

- Oscuro, `--color-border-accent` sobre `--color-bg-primary`: 5.38. Es el color de foco del tema oscuro.
- Oscuro, `--color-border-primary` sobre `--color-bg-primary`: 16.02.
- Oscuro, `--color-border-secondary` sobre `--color-bg-primary`: 2.08. Separador suave, no un límite que haya que ver para entender la UI, y no un foco.
- Oscuro, `--color-border-tertiary` sobre `--color-bg-primary`: 1.19. Aún más suave.
- Oscuro, `--color-border-danger` sobre `--color-bg-primary`: 2.08. No llega a 3:1.
- Claro, `--color-border-accent` sobre `--color-bg-primary`: 1.71. No sirve de foco.
- Claro, `--color-border-primary` sobre `--color-bg-primary`: 3.45. Sí llega. También vale `--color-text-primary` (15.52) si el anillo tiene que leerse como trazo fuerte.
- Claro, `--color-border-secondary` (2.32) y `--color-border-tertiary` (1.47) sobre blanco: separadores suaves.

Foco, en la hoja global del destino. No hay token de grosor de anillo: el color y el offset sí lo son. `outline: solid` deja el grosor del navegador.

```css
:focus:not(:focus-visible) {
  outline: none;
}

:focus-visible {
  outline: solid var(--color-border-accent);
  outline-offset: var(--spacing-2xs);
}

[data-theme="light"] :focus-visible {
  outline-color: var(--color-border-primary);
}
```

No uses `--color-border-accent` como foco en claro: no llega a 3:1 sobre `--color-bg-primary`.

## Tipografía

Dos familias, cargadas por `fonts/fonts.css`. Los nombres que hay que usar son los tokens, no el string de la familia.

| Rol del componente | Familia | Tamaño | Peso | Interlineado | Tracking |
|---|---|---|---|---|---|
| Cuerpo | `--text-style-base` | `--text-size-sm` (16px) | `--text-weight-normal` (400) | `--text-line-height-md` (21px) | `--text-letter-spacing-normal` (0) |
| Apoyo, meta | `--text-style-base` o `--text-style-decor` | `--text-size-xs` (14px) o `--text-size-xxs` (12px) | normal | `--text-line-height-sm` (18px); con xxs, `--text-line-height-xs` (14px) | normal; en decor, `--text-letter-spacing-wide` (1px) o `wider` (2px) |
| Título | `--text-style-display` | `--text-size-xl` (32px) o `--text-size-2xl` (40px) | `--text-weight-semibold` (600) o `bold` (700) | `--text-line-height-2xl` (44px) | normal, o `tight` si es display corto |
| Display | `--text-style-display` | `--text-size-3xl` (64px) o `--text-size-4xl` (72px) | `--text-weight-extrabold` (800) o `bold` (700) | `--text-line-height-3xl` (76px) | `--text-letter-spacing-tight` (-1px) |
| Código, etiqueta mono | `--text-style-decor` | xxs o xs | normal; `light` (300) solo aquí | sm o xs | wide o wider |

Esta tabla es una guía de composición. No son tokens compuestos: escríbela en un mixin o en la regla del componente, nunca como clases en el HTML.

Hechos de los archivos que cambian esa composición:

- Rethink Sans (`fonts/fonts.css`) solo cubre 400–800. `--text-weight-light` (300) en display o base cae a 400. Reserva el 300 para `--text-style-decor`.
- IBM Plex Mono cubre 300, 400, 500, 600 y 700. No tiene 800: `--text-weight-extrabold` en decor cae a 700. No hay cursiva de Plex en `fonts/files/` (Rethink Sans sí tiene itálica variable).
- `--text-line-height-xl` es 30px y `--text-size-xl` es 32px. Juntarlos por el nombre deja el interlineado más bajo que el cuerpo. Para un título xl usa `--text-line-height-2xl` (44px).
- No hay peso semántico 500 ni 900. No escribas `font-weight: 500`.

## Espacio, radio, sombra, motion

- Dentro de un control: `--spacing-2xs` (4) a `--spacing-lg` (32). `--spacing-xl` (64) y lo que sigue es separación de sección. `--spacing-5xl` es 400px.
- Radio: `--border-radius-xs` (4px) en controles pequeños, `sm` (16px) en tarjetas, `md` (32px) y `lg` (64px) en piezas grandes, `full` (400px) en píldoras. No hay semántico para 8px ni para 0.
- Sombra: de `--shadow-xs` a `--shadow-xl`, tal cual están en [tokens.md](tokens.md). No dibujes otra con `rgb()` suelto. En el tema oscuro una sombra negra se ve poco sobre `#141414`; no la sustituyas por un glow de otro color.
- Motion: entra con `--motion-duration-enter` (0.3s) y `--motion-easing-enter`; sal con `--motion-duration-exit` (0.15s) y `--motion-easing-exit`; el cambio de hover con `--motion-duration-fast` (0.1s) y `--motion-easing-standard`. Una lista en cascada usa `--motion-delay-stagger` (0.05s). Algo que deba esperar, `--motion-delay-deferred` (0.15s).
- Quien pida poco movimiento: duración `--motion-duration-instant` (0s). No inventes otra curva.

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: var(--motion-duration-instant) !important;
    transition-duration: var(--motion-duration-instant) !important;
  }
}
```

## Qué no hacer

- UI genérica: otra sans, azul de enlace, indigo o zinc de Tailwind, `rounded-md` y `shadow-md` de su escala por defecto.
- Acento verde en el fondo de la página o en cada botón. Un momento de acento.
- Hardcodear el hex «porque ya sé que el fondo es `#141414`». Mañana el token puede cambiar; el componente sigue diciendo `--color-bg-primary`.
- Clases tipográficas en el HTML.
- Tema claro por `prefers-color-scheme` o por una clase `.light` con colores copiados. El contrato es `data-theme="light"`.
- Cargar las fuentes desde Google Fonts. Van en `fonts/`, con la licencia OFL al lado (`fonts/licenses/`). «Plex» es un Reserved Font Name: no renombres el archivo ni la familia.

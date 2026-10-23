# Tokens semánticos

Fuente: `tokens/semantic/*.json` y el valor resuelto en `dist/css/` (los hex salen de `dist/css/core/color.css`). Cada alias se emite como `var(--primitivo)`, no como el hex ya sustituido. En componentes se escribe el nombre semántico.

El tema oscuro está en `:root`. El claro solo redefine lo que aparece en la columna «Claro»; si esa celda dice «hereda», sigue el valor oscuro.

## Color

### Fondo `--color-bg-*`

| Token | Oscuro | Claro | Hex oscuro | Hex claro |
|---|---|---|---|---|
| `--color-bg-primary` | `--gray-800` | `--white` | `#141414` | `#FFFFFF` |
| `--color-bg-secondary` | `--gray-700` | `--gray-100` | `#242424` | `#EFEFEF` |
| `--color-bg-tertiary` | `--gray-600` | `--gray-200` | `#4A4A4A` | `#D5D5D5` |
| `--color-bg-secondary-inverse` | `--white` | hereda | `#FFFFFF` | `#FFFFFF` |
| `--color-bg-tertiary-inverse` | `--white` | hereda | `#FFFFFF` | `#FFFFFF` |
| `--color-bg-overlay` | `--gray-800-80` | `--gray-100-80` | `#141414` al 80% | `#EFEFEF` al 80% |

El overlay es `rgb(from var(--gray-…) r g b / 80%)`. No hay token semántico para las variantes al 60% (`--gray-100-60`, `--gray-800-60`).

### Superficie `--color-surface-*`

| Token | Oscuro | Claro | Hex oscuro | Hex claro |
|---|---|---|---|---|
| `--color-surface-primary` | `--gray-400` | hereda | `#8A8A8A` | `#8A8A8A` |
| `--color-surface-primary-hover` | `--gray-400` | hereda | `#8A8A8A` | `#8A8A8A` |
| `--color-surface-secondary` | `--gray-600` | `--gray-300` | `#4A4A4A` | `#AAAAAA` |
| `--color-surface-secondary-inverse` | `--gray-200` | hereda | `#D5D5D5` | `#D5D5D5` |
| `--color-surface-tertiary` | `--gray-700` | `--gray-200` | `#242424` | `#D5D5D5` |
| `--color-surface-tertiary-inverse` | `--gray-100` | `--white` | `#EFEFEF` | `#FFFFFF` |
| `--color-surface-accent` | `--green-700` | `--green-200` | `#485612` | `#DEEEA0` |
| `--color-surface-danger` | `--red-700` | `--red-200` | `#420F0F` | `#EDB8B8` |

`--color-surface-primary` y `--color-surface-primary-hover` apuntan al mismo primitivo en el JSON. No hay salto de hover.

### Texto `--color-text-*`

| Token | Oscuro | Claro | Hex oscuro | Hex claro |
|---|---|---|---|---|
| `--color-text-primary` | `--gray-100` | `--gray-700` | `#EFEFEF` | `#242424` |
| `--color-text-secondary` | `--gray-400` | `--gray-500` | `#8A8A8A` | `#636363` |
| `--color-text-secondary-hover` | `--gray-200` | `--gray-400` | `#D5D5D5` | `#8A8A8A` |
| `--color-text-secondary-inverse` | `--gray-800` | `--gray-100` | `#141414` | `#EFEFEF` |
| `--color-text-tertiary` | `--gray-500` | `--gray-400` | `#636363` | `#8A8A8A` |
| `--color-text-accent` | `--green-400` | `--green-500` | `#B4D249` | `#A1BE2C` |
| `--color-text-danger` | `--red-400` | `--red-500` | `#CB5C5C` | `#A83030` |

### Icono `--color-icon-*`

| Token | Oscuro | Claro | Hex oscuro | Hex claro |
|---|---|---|---|---|
| `--color-icon-primary` | `--gray-200` | `--gray-500` | `#D5D5D5` | `#636363` |
| `--color-icon-secondary` | `--gray-400` | `--gray-600` | `#8A8A8A` | `#4A4A4A` |
| `--color-icon-tertiary` | `--gray-500` | `--gray-400` | `#636363` | `#8A8A8A` |
| `--color-icon-accent` | `--green-400` | `--green-500` | `#B4D249` | `#A1BE2C` |

### Borde `--color-border-*`

| Token | Oscuro | Claro | Hex oscuro | Hex claro |
|---|---|---|---|---|
| `--color-border-primary` | `--gray-100` | `--gray-400` | `#EFEFEF` | `#8A8A8A` |
| `--color-border-secondary` | `--gray-600` | `--gray-300` | `#4A4A4A` | `#AAAAAA` |
| `--color-border-tertiary` | `--gray-700` | `--gray-200` | `#242424` | `#D5D5D5` |
| `--color-border-secondary-hover` | `--gray-300` | `--gray-400` | `#AAAAAA` | `#8A8A8A` |
| `--color-border-accent` | `--green-600` | `--green-400` | `#7D9420` | `#B4D249` |
| `--color-border-danger` | `--red-600` | `--red-400` | `#8C2222` | `#CB5C5C` |

Uso de cada rol: [brand-rules.md](brand-rules.md).

## Tipografía

No hay un token que junte familia, tamaño, peso e interlineado. Se componen en el CSS del destino.

### Familia `--text-style-*`

| Token | Alias | Valor resuelto |
|---|---|---|
| `--text-style-display` | `--font-families-sans-1` | `"Rethink Sans", sans-serif` |
| `--text-style-base` | `--font-families-sans-1` | `"Rethink Sans", sans-serif` |
| `--text-style-decor` | `--font-families-monospace-1` | `"IBM Plex Mono", monospace` |

### Tamaño `--text-size-*`

| Token | Alias | px |
|---|---|---|
| `--text-size-xxs` | `--font-size-100` | 12px |
| `--text-size-xs` | `--font-size-200` | 14px |
| `--text-size-sm` | `--font-size-300` | 16px |
| `--text-size-md` | `--font-size-400` | 20px |
| `--text-size-lg` | `--font-size-500` | 24px |
| `--text-size-xl` | `--font-size-600` | 32px |
| `--text-size-2xl` | `--font-size-700` | 40px |
| `--text-size-3xl` | `--font-size-800` | 64px |
| `--text-size-4xl` | `--font-size-900` | 72px |

### Peso `--text-weight-*`

| Token | Alias | Número |
|---|---|---|
| `--text-weight-light` | `--font-weights-100` | 300 |
| `--text-weight-normal` | `--font-weights-200` | 400 |
| `--text-weight-semibold` | `--font-weights-400` | 600 |
| `--text-weight-bold` | `--font-weights-500` | 700 |
| `--text-weight-extrabold` | `--font-weights-600` | 800 |

No hay token semántico para 500 (`--font-weights-300`) ni para 900 (`--font-weights-700`).

### Interlineado `--text-line-height-*`

El nombre semántico no sigue el mismo índice que el tamaño. `--text-line-height-lg` es 31px y `--text-line-height-xl` es 30px.

| Token | Alias | px |
|---|---|---|
| `--text-line-height-xs` | `--font-line-height-100` | 14px |
| `--text-line-height-sm` | `--font-line-height-200` | 18px |
| `--text-line-height-md` | `--font-line-height-300` | 21px |
| `--text-line-height-lg` | `--font-line-height-500` | 31px |
| `--text-line-height-xl` | `--font-line-height-400` | 30px |
| `--text-line-height-2xl` | `--font-line-height-600` | 44px |
| `--text-line-height-3xl` | `--font-line-height-700` | 76px |

No hay `--text-line-height-4xl`.

### Tracking `--text-letter-spacing-*`

| Token | Alias | px |
|---|---|---|
| `--text-letter-spacing-tight` | `--font-letter-spacings-minus-100` | -1px |
| `--text-letter-spacing-normal` | `--font-letter-spacings-100` | 0px |
| `--text-letter-spacing-wide` | `--font-letter-spacings-200` | 1px |
| `--text-letter-spacing-wider` | `--font-letter-spacings-300` | 2px |

## Espacio `--spacing-*`

De `--spacing-lg` (32px) se salta a 64px. De ahí hacia arriba es escala de sección, no de padding de control.

| Token | Alias | px |
|---|---|---|
| `--spacing-2xs` | `--spacing-100` | 4px |
| `--spacing-xs` | `--spacing-200` | 8px |
| `--spacing-sm` | `--spacing-300` | 16px |
| `--spacing-md` | `--spacing-400` | 24px |
| `--spacing-lg` | `--spacing-500` | 32px |
| `--spacing-xl` | `--spacing-600` | 64px |
| `--spacing-2xl` | `--spacing-700` | 128px |
| `--spacing-3xl` | `--spacing-800` | 256px |
| `--spacing-4xl` | `--spacing-900` | 320px |
| `--spacing-5xl` | `--spacing-1000` | 400px |

## Radio `--border-radius-*`

| Token | Alias | px |
|---|---|---|
| `--border-radius-xs` | `--border-radius-100` | 4px |
| `--border-radius-sm` | `--border-radius-300` | 16px |
| `--border-radius-md` | `--border-radius-400` | 32px |
| `--border-radius-lg` | `--border-radius-500` | 64px |
| `--border-radius-full` | `--border-radius-600` | 400px |

Sin alias semántico: `--border-radius-0` (0px) y `--border-radius-200` (8px).

## Sombra `--shadow-*`

Valores literales en `dist/css/semantic/shadow.css` (no son alias):

| Token | Valor |
|---|---|
| `--shadow-xs` | `0 1px 2px rgb(0 0 0 / 0.16)` |
| `--shadow-sm` | `0 2px 4px rgb(0 0 0 / 0.16), 0 1px 2px rgb(0 0 0 / 0.12)` |
| `--shadow-md` | `0 6px 12px rgb(0 0 0 / 0.18), 0 2px 4px rgb(0 0 0 / 0.12)` |
| `--shadow-lg` | `0 12px 24px rgb(0 0 0 / 0.2), 0 4px 8px rgb(0 0 0 / 0.12)` |
| `--shadow-xl` | `0 24px 48px rgb(0 0 0 / 0.22), 0 8px 16px rgb(0 0 0 / 0.14)` |

No hay sombras en `tokens/core/shadow.json`.

## Motion

### Duración `--motion-duration-*`

| Token | Alias | Valor |
|---|---|---|
| `--motion-duration-instant` | `--motion-duration-0` | 0s |
| `--motion-duration-fast` | `--motion-duration-100` | 0.1s |
| `--motion-duration-exit` | `--motion-duration-200` | 0.15s |
| `--motion-duration-normal` | `--motion-duration-300` | 0.2s |
| `--motion-duration-enter` | `--motion-duration-400` | 0.3s |
| `--motion-duration-slow` | `--motion-duration-500` | 0.4s |
| `--motion-duration-emphasis` | `--motion-duration-600` | 0.6s |

### Espera `--motion-delay-*`

| Token | Alias | Valor |
|---|---|---|
| `--motion-delay-none` | `--motion-delay-0` | 0s |
| `--motion-delay-stagger` | `--motion-delay-100` | 0.05s |
| `--motion-delay-deferred` | `--motion-delay-300` | 0.15s |

Sin alias semántico: `--motion-delay-200` (0.1s).

### Curva `--motion-easing-*`

| Token | Alias | Valor |
|---|---|---|
| `--motion-easing-linear` | `--motion-easing-0` | `cubic-bezier(0, 0.0009, 1, 1)` |
| `--motion-easing-standard` | `--motion-easing-100` | `cubic-bezier(0.2, 0, 0, 1)` |
| `--motion-easing-enter` | `--motion-easing-200` | `cubic-bezier(0, 0, 0.2, 1)` |
| `--motion-easing-exit` | `--motion-easing-300` | `cubic-bezier(0.4, 0, 1, 1)` |

## Desenfoque `--blur-*`

| Token | Alias | px |
|---|---|---|
| `--blur-xs` | `--blur-100` | 4px |
| `--blur-sm` | `--blur-200` | 8px |
| `--blur-md` | `--blur-300` | 16px |
| `--blur-lg` | `--blur-400` | 24px |
| `--blur-xl` | `--blur-500` | 40px |
| `--blur-2xl` | `--blur-600` | 64px |

Se usa como `backdrop-filter: blur(var(--blur-md))`. No hay token de color translúcido aparte del overlay.

## Opacidad (solo core)

No hay `tokens/semantic` de opacidad. Únicos valores: `--opacity-00` 0%, `--opacity-100` 20%, `--opacity-200` 40%, `--opacity-300` 60%, `--opacity-400` 80%. No existe un 100%.

## Primitivos sin rol semántico

No los uses en componentes. Si aparecen en una auditoría, no tienen sustituto por hex:

- Azul entero: `--blue-100` `#DADCDF`, `--blue-200` `#B7CDED`, `--blue-300` `#89ABDE`, `--blue-400` `#5B88CB`, `--blue-500` `#305FA8`, `--blue-600` `#214C8C`, `--blue-700` `#0F2342`, `--blue-800` `#030B18`.
- `--black` `#000000`.
- Verdes sin alias: `--green-100` `#F3F8DE`, `--green-300` `#C8E169`, `--green-800` `#0D1003`.
- Rojos sin alias: `--red-100` `#DFDADA`, `--red-300` `#DE8A8A`, `--red-800` `#0E0202`.
- Alpha sin alias: `--gray-100-60`, `--gray-800-60`.

## Índice para la auditoría

Empareja el valor hallado. Si hay varios tokens, elige por la propiedad CSS y el tema, como indica cada fila.

### Hex que sí tienen token semántico

| Hex | Tokens semánticos |
|---|---|
| `#FFFFFF` | `--color-bg-secondary-inverse`, `--color-bg-tertiary-inverse`; en claro también `--color-bg-primary`, `--color-surface-tertiary-inverse` |
| `#EFEFEF` | oscuro `--color-text-primary`, `--color-border-primary`, `--color-surface-tertiary-inverse`; claro `--color-bg-secondary`, `--color-text-secondary-inverse` |
| `#D5D5D5` | oscuro `--color-text-secondary-hover`, `--color-icon-primary`, `--color-surface-secondary-inverse`; claro `--color-bg-tertiary`, `--color-surface-tertiary`, `--color-border-tertiary` |
| `#AAAAAA` | oscuro `--color-border-secondary-hover`; claro `--color-surface-secondary`, `--color-border-secondary` |
| `#8A8A8A` | oscuro `--color-surface-primary`, `--color-surface-primary-hover`, `--color-text-secondary`, `--color-icon-secondary`; claro `--color-text-secondary-hover`, `--color-text-tertiary`, `--color-icon-tertiary`, `--color-border-primary`, `--color-border-secondary-hover` |
| `#636363` | oscuro `--color-text-tertiary`, `--color-icon-tertiary`; claro `--color-text-secondary`, `--color-icon-primary` |
| `#4A4A4A` | oscuro `--color-bg-tertiary`, `--color-surface-secondary`, `--color-border-secondary`; claro `--color-icon-secondary` |
| `#242424` | oscuro `--color-bg-secondary`, `--color-surface-tertiary`, `--color-border-tertiary`; claro `--color-text-primary` |
| `#141414` | oscuro `--color-bg-primary`, `--color-text-secondary-inverse` |
| `#B4D249` | oscuro `--color-text-accent`, `--color-icon-accent`; claro `--color-border-accent` |
| `#A1BE2C` | claro `--color-text-accent`, `--color-icon-accent` |
| `#7D9420` | oscuro `--color-border-accent` |
| `#485612` | oscuro `--color-surface-accent` |
| `#DEEEA0` | claro `--color-surface-accent` |
| `#CB5C5C` | oscuro `--color-text-danger`; claro `--color-border-danger` |
| `#A83030` | claro `--color-text-danger` |
| `#8C2222` | oscuro `--color-border-danger` |
| `#420F0F` | oscuro `--color-surface-danger` |
| `#EDB8B8` | claro `--color-surface-danger` |

### px y tiempos

| Hallazgo | Token semántico |
|---|---|
| 4px de espacio | `--spacing-2xs` |
| 8px de espacio | `--spacing-xs` |
| 16px de espacio | `--spacing-sm` |
| 24px de espacio | `--spacing-md` |
| 32px de espacio | `--spacing-lg` |
| 64px de espacio | `--spacing-xl` |
| 128px de espacio | `--spacing-2xl` |
| 256px de espacio | `--spacing-3xl` |
| 320px de espacio | `--spacing-4xl` |
| 400px de espacio | `--spacing-5xl` |
| radio 4 / 16 / 32 / 64 / 400 px | `--border-radius-xs` / `sm` / `md` / `lg` / `full` |
| radio 0 o 8 px | no hay semántico |
| blur 4 / 8 / 16 / 24 / 40 / 64 px | `--blur-xs` / `sm` / `md` / `lg` / `xl` / `2xl` |
| 12, 14, 16, 20, 24, 32, 40, 64, 72 px de tamaño | `--text-size-xxs` … `--text-size-4xl`, en ese orden |
| line-height 14, 18, 21, 31, 30, 44, 76 px | `--text-line-height-xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl` |
| tracking -1, 0, 1, 2 px | `--text-letter-spacing-tight`, `normal`, `wide`, `wider` |
| peso 300, 400, 600, 700, 800 | `--text-weight-light`, `normal`, `semibold`, `bold`, `extrabold` |
| peso 500 o 900 | no hay semántico |
| 0s, 0.1s, 0.15s, 0.2s, 0.3s, 0.4s, 0.6s de duración | `--motion-duration-instant`, `fast`, `exit`, `normal`, `enter`, `slow`, `emphasis` |
| delay 0s, 0.05s, 0.15s | `--motion-delay-none`, `stagger`, `deferred` |
| delay 0.1s | no hay semántico (`--motion-delay-200` es primitivo) |

`0.15s` es a la vez `--motion-duration-exit` y `--motion-delay-deferred`: elige duración o delay según la propiedad.

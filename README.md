# jcbrand

Sistema de diseño de marca **centralizado** de JC (José Carlos Martínez). Hoy contiene los **tokens**; más adelante, componentes y otros assets.

## Estructura
```
jcbrand/
├── tokens/            # design tokens en JSON (W3C DTCG) · ver tokens/README.md
│   ├── core/          # primitivos: color, typography, spacing, radius, motion, blur, opacity, shadow (vacío)
│   └── semantic/      # intención: color.dark (por defecto), color.light, typography, spacing, radius, motion, blur, shadow
├── scripts/           # check-tokens.mjs: valida y demuestra la paridad 1:1 con el CSS actual
├── components/        # (futuro)
└── assets/            # (futuro) logos, iconos, fuentes…
```

## Capas
1. **Core**: valores en crudo (`--gray-800`, `--spacing-300`…).
2. **Semantic**: alias de core con intención de uso (`--color-bg-primary` → `--gray-800`).
3. **Temas**: **oscuro** por defecto (`:root`, `color.dark.json`) y **claro** por override (`[data-theme="light"]`, `color.light.json`, solo los tokens que cambian).

Los nombres de variable CSS originales se conservan en cada token (`$extensions["com.jcbrand"].cssVar`).

## Pendiente
Build y empaquetado (p. ej. Style Dictionary → CSS/SCSS/JS, paquete npm, versionado) en una fase posterior.

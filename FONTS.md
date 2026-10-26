# Fonts in @jcmartinezma/jcbrand

The dependency includes the brand fonts. They are installed with `@jcmartinezma/jcbrand`, with no Google Fonts or CDN, and without copying `fonts/` into the project.

## Families and weights

| Family | File(s) | Weights | Styles |
|---|---|---|---|
| **Rethink Sans** | `RethinkSans-Variable.woff2`, `RethinkSans-Italic-Variable.woff2` | 400–800 (variable, `wght` axis) | normal, italic |
| **IBM Plex Mono** | `IBMPlexMono-{Light,Regular,Medium,SemiBold,Bold}.woff2` | 300, 400, 500, 600, 700 | normal |

### Coverage of the token weights (300, 400, 500, 600, 700, 800)

- **Rethink Sans**: the original font only exists from 400 to 800. **There is no 300 weight.** If a token asks for `300` with Rethink Sans, the browser will use 400 (the closest available). Recommendation: use 300 only with IBM Plex Mono, or raise that token to 400. In practice, `--text-weight-light` goes with `--text-style-decor`, not with `--text-style-base` or `--text-style-display`.
- **IBM Plex Mono**: 300–700 included. **There is no 800**; an `800` resolves to 700 (Bold). `--text-weight-extrabold` is not real in the mono font.
- IBM Plex Mono italics are not included (they do not appear in the tokens). They can be added later from the same source.
- Weight 500 exists in the IBM Plex Mono Medium file and as the primitive `--font-weights-300`, but there is **no** semantic token for 500. There is none for 900 either.

## Structure in the package

```
fonts/
├── fonts.css              # @font-face with relative paths (./files/...)
├── files/                 # .woff2
└── licenses/
    ├── OFL-RethinkSans.txt
    └── OFL-IBMPlexMono.txt
```

All paths in `fonts.css` are relative (`url('./files/...')`). Once the package is installed in `node_modules`, Vite, Next.js, webpack or Astro resolve those paths. Do not copy the folder anywhere else.

## Use in a project

Installation is in the README (`npm install github:jcmartinezma/jcbrand#semver:^0.2.0`, no `.npmrc` or token). With the dependency installed, in the app entry (`main.ts`, `layout.tsx`, the Astro layout, the global CSS):

```js
import '@jcmartinezma/jcbrand/fonts.css';
import '@jcmartinezma/jcbrand/dist/css/tokens.css';
```

or from CSS:

```css
@import '@jcmartinezma/jcbrand/fonts.css';
@import '@jcmartinezma/jcbrand/dist/css/tokens.css';
```

The family is not written by hand in components. The tokens already carry the name and the fallback:

```css
body {
  font-family: var(--text-style-base);   /* "Rethink Sans", sans-serif */
}

code, pre, .meta {
  font-family: var(--text-style-decor);  /* "IBM Plex Mono", monospace */
}
```

`--text-style-display` uses the same stack as `--text-style-base`. How to compose size, weight and line height is in `SKILL.md` and in `reference/guide.md`.

## `package.json`

These fields make the fonts part of the package:

- `"files": ["dist", "fonts"]`.
- `exports`: `./fonts.css` → `./fonts/fonts.css`, and `./fonts/*` → `./fonts/*`. The tokens (`./dist/css/tokens.css`, `./dist/scss`, …) are documented in the README.
- `"sideEffects": ["*.css"]` so bundlers do not remove the import.

`components/` is not in `files` or `exports`. When components exist, they will be added there; the fonts do not change export.

## Origin and license

- Origin: the official Google Fonts repository (`github.com/google/fonts`, paths `ofl/rethinksans` and `ofl/ibmplexmono`). Rethink Sans v1.001, IBM Plex Mono v2.3.
- TTF → WOFF2 conversion with `fontTools` (compression only, no subsetting and no changes to glyphs or names).
- The fonts are not covered by the MIT license of the code or by the brand-identity reservation in [LICENSE](LICENSE): they keep their own license. What does belong to JC is the choice and combination of families in the tokens, not the files.
- License: **SIL Open Font License 1.1**. They can be redistributed inside the package as long as the license files are included (`fonts/licenses/`). They cannot be sold on their own. "Plex" is a Reserved Font Name of IBM: do not rename or modify the font under that name.

# Changelog

Changes to `@jcmartinezma/jcbrand`, which is installed directly from this public GitHub repo. The version is the one in `package.json`. The Release tag is `v` plus that version, and it is what `#semver:` and `#v…` see in the projects that install it.

A change that only touches the skill or the README does not need a new version.

## Unreleased

### Changed

- **Breaking:** the core color variables now include the group name, derived from the token path: `--gray-100` → `--color-gray-100`, `--red-*`, `--green-*`, `--blue-*`, `--white` → `--color-white`, `--black` → `--color-black`. Semantic names (`--color-bg-primary`, …) and all non-color core names are unchanged.
- Core token files renamed to `<name>.core.json` (e.g. `tokens/core/color.core.json`) with the new structure: `$schema`, `$description` per group, `$type` declared once per group, and no `cssVar` per token.
- Semantic token files renamed to `<name>.semantic.json` (`color.semantic.dark.json` and `color.semantic.light.json` for the themes) with the same structure. The per-token `cssVar` and the root `$extensions` (`source`, `selector`, `theme`) are gone: names come from the path and the light selector from the file name. The published CSS is unchanged.
- `shadow.semantic.json` now uses DTCG 2025.10 values (color object, `{value, unit}` dimensions, explicit zero `spread`). The generated CSS is identical.

## 0.2.0 — 2026-10-26

First public version. Release `v0.2.0`.

### Changed

- The repo goes from private to **public** and is installed as a direct GitHub dependency: `npm install github:jcmartinezma/jcbrand#semver:^0.2.0`.
- `.github/workflows/publish.yml` replaced by `ci.yml`: it no longer publishes; it checks that `dist/` matches `tokens/` and, on a Release, that the tag is `v<version>`.
- `package.json`: `publishConfig` removed.
- `.npmignore` removed.

### Added

- `LICENSE` with a mixed license: the skeleton (code, tooling, token structure, variable names and technical documentation) under MIT; the brand (names, logos, token values and brand rules) with all rights reserved; fonts under their original SIL OFL 1.1. `package.json` declares `"license": "SEE LICENSE IN LICENSE"`.
- Storybook 10 with React and Vite, as a devDependency only, to view the tokens. `storybook` and `build-storybook` scripts. Before opening or building, `prestorybook` / `prebuild-storybook` run `build:tokens`.
- Theme switch in the toolbar: dark by default (`data-theme="dark"` on the canvas and the docs) and light (`data-theme="light"`).
- Foundations pages read from `tokens/`: introduction, color, typography, spacing, radius, shadow, motion, blur, opacity, and a contrast story for the accessibility addon.
- `@storybook/addon-a11y`. Pairs that do not reach WCAG AA are documented; the token values do not change.

## 0.1.0 — 2026-10-19

First published version. Release `v0.1.0`.

### Added

- DTCG tokens in `tokens/core` (primitives) and `tokens/semantic` (dark theme in `:root`, 26 overrides in `[data-theme="light"]`).
- `dist/`: CSS (`tokens.css`, `core/` and `semantic/` sheets) and SCSS partials, generated with Style Dictionary 5.
- Brand fonts in `fonts/`: Rethink Sans (variable, 400–800, normal and italic) and IBM Plex Mono (300, 400, 500, 600, 700), with `fonts.css` and the SIL OFL 1.1 licenses.
- Package exports: `./fonts.css`, `./fonts/*`, `./dist/css/tokens.css`, `./dist/css/*`, `./dist/scss`, `./dist/scss/core`, `./dist/scss/semantic`, `./dist/scss/*`.

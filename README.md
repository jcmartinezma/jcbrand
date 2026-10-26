# jcbrand

Design system for the brand of José Carlos Martínez, [jcmartinez.net](https://jcmartinez.net). It includes **tokens** (CSS and SCSS, generated from JSON with [Style Dictionary](https://styledictionary.com)), **fonts** (Rethink Sans and IBM Plex Mono) and a **Storybook** as a visual reference.

## Install

```bash
npm install github:jcmartinezma/jcbrand#semver:^0.2.0
```

## Use

```js
import '@jcmartinezma/jcbrand/fonts.css';
import '@jcmartinezma/jcbrand/dist/css/tokens.css';
```

```css
.card {
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
}
```

With SCSS: `@use "@jcmartinezma/jcbrand/dist/scss" as jcbrand;`. Fonts are imported separately.

The theme is **dark** by default. For the light theme:

```html
<html data-theme="light">
```

Recipes for Tailwind, Next.js and Astro: [`reference/guide.md`](reference/guide.md).

## Update

```bash
npm update @jcmartinezma/jcbrand
```

To move to another minor or major version, change the range in the install command. Check the [CHANGELOG](CHANGELOG.md) in case a token was renamed.

## Use it as a Cursor skill

```bash
git clone https://github.com/jcmartinezma/jcbrand.git ~/.cursor/skills/jcbrand
```

Open a new chat. When you ask for JC's brand or the jcbrand tokens, the agent follows [`SKILL.md`](SKILL.md). To update it, run `git pull` in that folder.

## Development

Requires Node 22 or higher.

```bash
npm install
npm run build:tokens   # Style Dictionary: generates dist/ (CSS and SCSS) from tokens/
npm run storybook      # opens Storybook at http://localhost:6006
```

- The JSON files in `tokens/` are the source of truth. Style Dictionary (configured in `sd.config.mjs`) turns them into the styles in `dist/`. Don't edit `dist/` by hand: commit it together with the token that changed.

## License

Mixed license: structure and code under MIT, brand values reserved, and fonts under SIL OFL 1.1. Full details in [LICENSE](LICENSE).

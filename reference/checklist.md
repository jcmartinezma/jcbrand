# Integration checklist

Check it in the target project. Never edit `node_modules/@jcmartinezma/jcbrand`. The detail for each item is in the [guide](guide.md).

- [ ] The dependency is installed with `#semver:^<version>` or `#v<version>`, and `dist/` and `fonts/` have not been copied into the project code. There is no `.npmrc` or token for it.
- [ ] The global entry imports fonts and tokens (see [Import and base](guide.md#import-and-base)). There is no new `@font-face` and no Google Fonts.
- [ ] The `body` uses the base from the guide.
- [ ] Components only name semantic tokens: no hand-written hex, primitives or scale px values. The audit in `SKILL.md` has been run outside `node_modules`, and every hardcoded value has a proposed token or is flagged because the value is not in the palette.
- [ ] Typography lives in mixins or component rules. The HTML has no scale classes (`text-xl`, `font-bold`).
- [ ] Without an attribute the page is dark; light, if it exists, is `data-theme="light"` on `<html>`. There is no `prefers-color-scheme` and no class with duplicated colors.
- [ ] Keyboard focus is visible with `:focus-visible` (see [Focus](guide.md#focus)).
- [ ] The accent appears at most once per view, and no pair marked "no" in the [contrast table](guide.md#contrast) is used.
- [ ] If `npm update` was run, the CHANGELOG for that version has been reviewed and renamed or removed tokens are no longer used.

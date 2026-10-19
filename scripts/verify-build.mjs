// Compares dist CSS/SCSS with the token JSON. Independent of the Style Dictionary formatter:
// expected values are computed here from the JSON, the same way check-tokens.mjs would emit them.
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const NS = 'com.jcbrand';
const ALIAS = /^\{([^}]+)\}$/;
let errors = 0;
const fail = (message) => {
  errors += 1;
  console.error(`✗ ${message}`);
};

const files = [];
for (const layer of ['core', 'semantic']) {
  for (const name of readdirSync(join(root, 'tokens', layer)).filter((name) => name.endsWith('.json')).sort()) {
    files.push({
      rel: `${layer}/${name}`,
      json: JSON.parse(readFileSync(join(root, 'tokens', layer, name), 'utf8')),
    });
  }
}

const flatten = (node, path = [], out = []) => {
  for (const [key, value] of Object.entries(node)) {
    if (key.startsWith('$') || typeof value !== 'object' || value === null) continue;
    if ('$value' in value) out.push({ path: [...path, key].join('.'), tok: value });
    else flatten(value, [...path, key], out);
  }
  return out;
};

const byPath = new Map();
const byFile = new Map();
for (const file of files) {
  const selector = file.json.$extensions?.[NS]?.selector ?? ':root';
  const tokens = flatten(file.json).map((token) => ({ ...token, selector, file: file.rel }));
  byFile.set(file.rel, tokens);
  for (const token of tokens) {
    if (byPath.has(token.path) && selector === ':root') fail(`duplicate :root path ${token.path}`);
    if (selector === ':root') byPath.set(token.path, token);
  }
}

function cssValue(token) {
  const ext = token.tok.$extensions?.[NS] ?? {};
  const value = token.tok.$value;
  const match = typeof value === 'string' && value.match(ALIAS);
  if (match) {
    const target = byPath.get(match[1]);
    if (!target) {
      fail(`${token.path}: alias {${match[1]}} does not resolve`);
      return '';
    }
    const ref = `var(${target.tok.$extensions[NS].cssVar})`;
    return ext.alpha != null ? `rgb(from ${ref} r g b / ${Math.round(ext.alpha * 100)}%)` : ref;
  }
  switch (token.tok.$type) {
    case 'fontFamily':
      return [].concat(value).map((family) => (/\s/.test(family) ? `"${family}"` : family)).join(', ');
    case 'fontWeight':
      return String(value);
    case 'cubicBezier':
      return `cubic-bezier(${value.join(', ')})`;
    case 'number':
      return ext.cssFormat === 'percent' ? `${Math.round(value * 100)}%` : String(value);
    case 'shadow':
      return [].concat(value)
        .map((layer) => [layer.offsetX, layer.offsetY, layer.blur, layer.spread, layer.color].filter((part) => part != null).join(' '))
        .join(', ');
    default:
      return String(value);
  }
}

function expectedFrom(tokens) {
  const out = new Map();
  for (const token of tokens) {
    const selector = token.selector;
    if (!out.has(selector)) out.set(selector, new Map());
    const name = token.tok.$extensions?.[NS]?.cssVar;
    if (!name) fail(`${token.path}: missing cssVar`);
    else out.get(selector).set(name, cssValue(token));
  }
  return out;
}

function parseCss(text) {
  const out = new Map();
  const stripped = text.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '');
  for (const match of stripped.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const selector = match[1].trim();
    const decls = new Map();
    for (const decl of match[2].matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
      decls.set(decl[1], decl[2].split(/\s+/).join(' ').trim());
    }
    if (!out.has(selector)) out.set(selector, new Map());
    for (const [name, value] of decls) out.get(selector).set(name, value);
  }
  return out;
}

function compare(label, actualText, expected) {
  const actual = parseCss(actualText);
  const selectors = new Set([...expected.keys(), ...actual.keys()]);
  let count = 0;
  for (const selector of selectors) {
    const want = expected.get(selector) ?? new Map();
    const got = actual.get(selector) ?? new Map();
    for (const [name, value] of want) {
      count += 1;
      const norm = value.split(/\s+/).join(' ').trim();
      if (!got.has(name)) fail(`${label} ${selector}: missing ${name}`);
      else if (got.get(name) !== norm) fail(`${label} ${selector} ${name}: "${got.get(name)}" ≠ "${norm}"`);
    }
    for (const name of got.keys()) {
      if (!want.has(name)) fail(`${label} ${selector}: extra ${name}`);
    }
  }
  return count;
}

const fileToOutput = new Map([
  ['core/color.json', 'core/color'],
  ['core/typography.json', 'core/typography'],
  ['core/spacing.json', 'core/spacing'],
  ['core/radius.json', 'core/radius'],
  ['core/motion.json', 'core/motion'],
  ['core/blur.json', 'core/blur'],
  ['core/opacity.json', 'core/opacity'],
  ['core/shadow.json', 'core/shadow'],
  ['semantic/typography.json', 'semantic/typography'],
  ['semantic/spacing.json', 'semantic/spacing'],
  ['semantic/radius.json', 'semantic/radius'],
  ['semantic/motion.json', 'semantic/motion'],
  ['semantic/blur.json', 'semantic/blur'],
  ['semantic/shadow.json', 'semantic/shadow'],
]);

let compared = 0;
const allExpected = new Map();
for (const [rel, tokens] of byFile) {
  const expected = expectedFrom(tokens);
  for (const [selector, decls] of expected) {
    if (!allExpected.has(selector)) allExpected.set(selector, new Map());
    for (const [name, value] of decls) {
      if (allExpected.get(selector).has(name)) fail(`duplicate ${name} in ${selector} (${rel})`);
      allExpected.get(selector).set(name, value);
    }
  }
  if (rel === 'semantic/color.dark.json' || rel === 'semantic/color.light.json') continue;
  const stem = fileToOutput.get(rel);
  const cssPath = join(root, 'dist/css', `${stem}.css`);
  const scssPath = join(root, 'dist/scss', `${stem.slice(0, stem.indexOf('/'))}/_${stem.slice(stem.indexOf('/') + 1)}.scss`);
  const css = readFileSync(cssPath, 'utf8');
  const scssText = readFileSync(scssPath, 'utf8');
  compared += compare(`dist/css/${stem}.css`, css, expected);
  compared += compare(`dist/scss/${stem.replace('/', '/_')}.scss`, scssText, expected);
}

const colorExpected = new Map();
for (const rel of ['semantic/color.dark.json', 'semantic/color.light.json']) {
  for (const [selector, decls] of expectedFrom(byFile.get(rel))) {
    colorExpected.set(selector, decls);
  }
}
compared += compare('dist/css/semantic/color.css', readFileSync(join(root, 'dist/css/semantic/color.css'), 'utf8'), colorExpected);
compared += compare('dist/scss/semantic/_color.scss', readFileSync(join(root, 'dist/scss/semantic/_color.scss'), 'utf8'), colorExpected);
compared += compare('dist/css/tokens.css', readFileSync(join(root, 'dist/css/tokens.css'), 'utf8'), allExpected);

const forwardChecks = [
  ['dist/scss/_index.scss', ['@forward "core";', '@forward "semantic";']],
  ['dist/scss/core/_index.scss', ['@forward "color";', '@forward "typography";', '@forward "spacing";', '@forward "radius";', '@forward "motion";', '@forward "blur";', '@forward "opacity";', '@forward "shadow";']],
  ['dist/scss/semantic/_index.scss', ['@forward "color";', '@forward "typography";', '@forward "spacing";', '@forward "radius";', '@forward "motion";', '@forward "blur";', '@forward "shadow";']],
];
for (const [rel, lines] of forwardChecks) {
  const text = readFileSync(join(root, rel), 'utf8');
  for (const line of lines) if (!text.includes(line)) fail(`${rel}: missing ${line}`);
}

const bundle = parseCss(readFileSync(join(root, 'dist/css/tokens.css'), 'utf8'));
const spot = (selector, name) => bundle.get(selector)?.get(name);
const expectSpot = (selector, name, value) => {
  const got = spot(selector, name);
  if (got !== value) fail(`spot ${selector} ${name}: "${got}" ≠ "${value}"`);
};
expectSpot(':root', '--motion-easing-0', 'cubic-bezier(0, 0.0009, 1, 1)');
expectSpot(':root', '--gray-100-60', 'rgb(from var(--gray-100) r g b / 60%)');
expectSpot(':root', '--opacity-00', '0%');
expectSpot(':root', '--opacity-100', '20%');
expectSpot(':root', '--font-families-sans-1', '"Rethink Sans", sans-serif');
expectSpot(':root', '--shadow-xs', '0 1px 2px rgb(0 0 0 / 0.16)');
expectSpot(':root', '--color-bg-primary', 'var(--gray-800)');
expectSpot('[data-theme="light"]', '--color-bg-primary', 'var(--white)');
expectSpot(':root', '--text-line-height-lg', 'var(--font-line-height-500)');
expectSpot(':root', '--text-line-height-xl', 'var(--font-line-height-400)');

const rootCount = allExpected.get(':root')?.size ?? 0;
const lightCount = allExpected.get('[data-theme="light"]')?.size ?? 0;
console.log(`compared ${compared} declarations · :root ${rootCount} · light ${lightCount}`);
console.log(errors ? `FAILED: ${errors} error(s)` : 'OK: dist CSS/SCSS matches every cssVar name and value');
process.exit(errors ? 1 : 0);

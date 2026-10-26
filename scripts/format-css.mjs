// Turns DTCG tokens into CSS custom properties.
// Names come from the token path (color.gray.100 -> --color-gray-100).
// Alias values stay as var(--referenced-css-var), matching the original SCSS.
import { fileHeader } from 'style-dictionary/utils';

const NS = 'com.jcbrand';
const ALIAS = /^\{([^}]+)\}$/;

/** Output groups, in the order a bundle and the SCSS indexes should list them. */
export const OUTPUTS = [
  { id: 'core/color', layer: 'core', name: 'color', test: (filePath) => ends(filePath, '/core/color.core.json') },
  { id: 'core/typography', layer: 'core', name: 'typography', test: (filePath) => ends(filePath, '/core/typography.core.json') },
  { id: 'core/spacing', layer: 'core', name: 'spacing', test: (filePath) => ends(filePath, '/core/spacing.core.json') },
  { id: 'core/radius', layer: 'core', name: 'radius', test: (filePath) => ends(filePath, '/core/radius.core.json') },
  { id: 'core/motion', layer: 'core', name: 'motion', test: (filePath) => ends(filePath, '/core/motion.core.json') },
  { id: 'core/blur', layer: 'core', name: 'blur', test: (filePath) => ends(filePath, '/core/blur.core.json') },
  { id: 'core/opacity', layer: 'core', name: 'opacity', test: (filePath) => ends(filePath, '/core/opacity.core.json') },
  {
    id: 'core/shadow',
    layer: 'core',
    name: 'shadow',
    test: (filePath) => ends(filePath, '/core/shadow.core.json'),
    emptyNote: '/* core/shadow: el SCSS original no define tokens de sombra en core. */',
  },
  {
    id: 'semantic/color',
    layer: 'semantic',
    name: 'color',
    test: (filePath) => ends(filePath, '/semantic/color.semantic.dark.json') || ends(filePath, '/semantic/color.semantic.light.json'),
  },
  { id: 'semantic/typography', layer: 'semantic', name: 'typography', test: (filePath) => ends(filePath, '/semantic/typography.semantic.json') },
  { id: 'semantic/spacing', layer: 'semantic', name: 'spacing', test: (filePath) => ends(filePath, '/semantic/spacing.semantic.json') },
  { id: 'semantic/radius', layer: 'semantic', name: 'radius', test: (filePath) => ends(filePath, '/semantic/radius.semantic.json') },
  { id: 'semantic/motion', layer: 'semantic', name: 'motion', test: (filePath) => ends(filePath, '/semantic/motion.semantic.json') },
  { id: 'semantic/blur', layer: 'semantic', name: 'blur', test: (filePath) => ends(filePath, '/semantic/blur.semantic.json') },
  { id: 'semantic/shadow', layer: 'semantic', name: 'shadow', test: (filePath) => ends(filePath, '/semantic/shadow.semantic.json') },
];

function ends(filePath, suffix) {
  return String(filePath).replaceAll('\\', '/').endsWith(suffix);
}

export function tokenExt(token) {
  return token.$extensions?.[NS] ?? token.original?.$extensions?.[NS] ?? {};
}

export function tokenPath(token) {
  return token.path.join('.');
}

// The name always comes from the path (color.gray.100 -> --color-gray-100).
// The parser nests the light theme under `theme-light` (see sd.config.mjs); that prefix is not part of the name.
// A token can still override the name with $extensions["com.jcbrand"].cssVar (no token does today).
export function cssVarName(token) {
  const name = tokenExt(token).cssVar;
  if (name === undefined) {
    const path = token.path[0] === 'theme-light' ? token.path.slice(1) : token.path;
    return `--${path.join('-')}`;
  }
  if (typeof name !== 'string' || !name.startsWith('--')) {
    throw new Error(`Token ${tokenPath(token)} has an invalid $extensions.${NS}.cssVar`);
  }
  return name;
}

function rawValue(token) {
  const original = token.original ?? token;
  return original.$value !== undefined ? original.$value : original.value;
}

function rawType(token) {
  return token.$type ?? token.original?.$type ?? token.type ?? token.original?.type;
}

export function selectorFor(filePath) {
  return ends(filePath, '/semantic/color.semantic.light.json') ? '[data-theme="light"]' : ':root';
}

// DTCG shadow -> CSS box-shadow. Dimensions are {value, unit}; colors are {colorSpace: "srgb", components, alpha}.
// A zero spread is left out, so `0 1px 2px rgb(0 0 0 / 0.16)` stays exactly as authored.
const dimCss = (d) => (typeof d === 'string' ? d : d.value === 0 ? '0' : `${d.value}${d.unit}`);
const colorCss = (c) => {
  if (typeof c === 'string') return c;
  if (c.colorSpace !== 'srgb') throw new Error(`shadow color space "${c.colorSpace}" is not supported`);
  const rgb = c.components.map((part) => Math.round(part * 255)).join(' ');
  return `rgb(${rgb}${c.alpha != null && c.alpha < 1 ? ` / ${c.alpha}` : ''})`;
};
const shadowCss = (value) => [].concat(value)
  .map((layer) => {
    const spread = layer.spread == null || (typeof layer.spread === 'object' && layer.spread.value === 0) ? null : dimCss(layer.spread);
    return [dimCss(layer.offsetX), dimCss(layer.offsetY), dimCss(layer.blur), spread, colorCss(layer.color)].filter((part) => part != null).join(' ');
  })
  .join(', ');

/**
 * CSS value for one token. `byPath` maps a DTCG path (color.gray.800) to its token
 * so an alias can point at that token's cssVar without resolving to the raw value.
 */
export function cssValue(token, byPath) {
  const ext = tokenExt(token);
  const value = rawValue(token);
  const type = rawType(token);
  const match = typeof value === 'string' && value.match(ALIAS);
  if (match) {
    const target = byPath.get(match[1]);
    if (!target) throw new Error(`${tokenPath(token)}: alias {${match[1]}} does not resolve`);
    const ref = `var(${cssVarName(target)})`;
    if (ext.alpha != null) return `rgb(from ${ref} r g b / ${Math.round(ext.alpha * 100)}%)`;
    return ref;
  }
  switch (type) {
    case 'fontFamily':
      return [].concat(value).map((family) => (/\s/.test(family) ? `"${family}"` : family)).join(', ');
    case 'fontWeight':
      return String(value);
    case 'cubicBezier':
      return `cubic-bezier(${value.join(', ')})`;
    case 'number':
      return ext.cssFormat === 'percent' ? `${Math.round(value * 100)}%` : String(value);
    case 'shadow':
      return shadowCss(value);
    default:
      return String(value);
  }
}

export function indexByPath(tokens) {
  const map = new Map();
  for (const token of tokens) map.set(tokenPath(token), token);
  return map;
}

export function renderBlocks(tokens, byPath) {
  const groups = new Map();
  for (const token of tokens) {
    const selector = selectorFor(token.filePath);
    if (!groups.has(selector)) groups.set(selector, []);
    groups.get(selector).push(token);
  }
  const order = [':root', '[data-theme="light"]'];
  const selectors = [...groups.keys()].sort((a, b) => {
    const ai = order.indexOf(a);
    const bi = order.indexOf(b);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });
  return selectors
    .map((selector) => {
      const seen = new Set();
      const lines = groups
        .get(selector)
        .slice()
        .sort((a, b) => cssVarName(a).localeCompare(cssVarName(b)))
        .map((token) => {
          const name = cssVarName(token);
          if (seen.has(name)) throw new Error(`Duplicate ${name} in ${selector}`);
          seen.add(name);
          return `  ${name}: ${cssValue(token, byPath)};`;
        });
      return `${selector} {\n${lines.join('\n')}\n}`;
    })
    .join('\n\n');
}

export async function formatJcbrand({ dictionary, options, file }) {
  const header = await fileHeader({ file });
  const all = dictionary.unfilteredAllTokens ?? dictionary.allTokens;
  const byPath = indexByPath(all);

  if (options.kind === 'forward') {
    const body = options.forwards.map((name) => `@forward "${name}";`).join('\n');
    return `${header}${body}\n`;
  }

  if (options.bundle) {
    const parts = [];
    for (const group of OUTPUTS) {
      const groupTokens = all.filter((token) => group.test(token.filePath));
      if (!groupTokens.length) {
        if (group.emptyNote) parts.push(group.emptyNote);
        continue;
      }
      parts.push(`/* ${group.id} */\n${renderBlocks(groupTokens, byPath)}`);
    }
    return `${header}${parts.join('\n\n')}\n`;
  }

  const tokens = dictionary.allTokens;
  if (!tokens.length) {
    return `${header}${options.emptyNote ?? '/* Este archivo no define tokens. */'}\n`;
  }
  return `${header}${renderBlocks(tokens, byPath)}\n`;
}

// Lee los JSON DTCG de tokens/ y los aplana.
// Las páginas de Storybook pintan esto: no hay hex ni px copiados a mano.
import coreBlur from "../../tokens/core/blur.core.json" with { type: "json" };
import coreColor from "../../tokens/core/color.core.json" with { type: "json" };
import coreMotion from "../../tokens/core/motion.core.json" with { type: "json" };
import coreOpacity from "../../tokens/core/opacity.core.json" with { type: "json" };
import coreRadius from "../../tokens/core/radius.core.json" with { type: "json" };
import coreShadow from "../../tokens/core/shadow.core.json" with { type: "json" };
import coreSpacing from "../../tokens/core/spacing.core.json" with { type: "json" };
import coreTypography from "../../tokens/core/typography.core.json" with { type: "json" };
import semanticBlur from "../../tokens/semantic/blur.semantic.json" with { type: "json" };
import semanticColorDark from "../../tokens/semantic/color.semantic.dark.json" with { type: "json" };
import semanticColorLight from "../../tokens/semantic/color.semantic.light.json" with { type: "json" };
import semanticMotion from "../../tokens/semantic/motion.semantic.json" with { type: "json" };
import semanticRadius from "../../tokens/semantic/radius.semantic.json" with { type: "json" };
import semanticShadow from "../../tokens/semantic/shadow.semantic.json" with { type: "json" };
import semanticSpacing from "../../tokens/semantic/spacing.semantic.json" with { type: "json" };
import semanticTypography from "../../tokens/semantic/typography.semantic.json" with { type: "json" };

const NS = "com.jcbrand";
const ALIAS = /^\{([^}]+)\}$/;

const FILES = [
  { category: "color", layer: "core", path: "tokens/core/color.core.json", data: coreColor },
  { category: "color", layer: "semantic", path: "tokens/semantic/color.semantic.dark.json", data: semanticColorDark },
  { category: "typography", layer: "core", path: "tokens/core/typography.core.json", data: coreTypography },
  { category: "typography", layer: "semantic", path: "tokens/semantic/typography.semantic.json", data: semanticTypography },
  { category: "spacing", layer: "core", path: "tokens/core/spacing.core.json", data: coreSpacing },
  { category: "spacing", layer: "semantic", path: "tokens/semantic/spacing.semantic.json", data: semanticSpacing },
  { category: "radius", layer: "core", path: "tokens/core/radius.core.json", data: coreRadius },
  { category: "radius", layer: "semantic", path: "tokens/semantic/radius.semantic.json", data: semanticRadius },
  { category: "shadow", layer: "core", path: "tokens/core/shadow.core.json", data: coreShadow },
  { category: "shadow", layer: "semantic", path: "tokens/semantic/shadow.semantic.json", data: semanticShadow },
  { category: "motion", layer: "core", path: "tokens/core/motion.core.json", data: coreMotion },
  { category: "motion", layer: "semantic", path: "tokens/semantic/motion.semantic.json", data: semanticMotion },
  { category: "blur", layer: "core", path: "tokens/core/blur.core.json", data: coreBlur },
  { category: "blur", layer: "semantic", path: "tokens/semantic/blur.semantic.json", data: semanticBlur },
  { category: "opacity", layer: "core", path: "tokens/core/opacity.core.json", data: coreOpacity },
];

const GROUP_LABELS = {
  "color.base": "Blanco y negro",
  "color.gray": "Gris",
  "color.red": "Rojo",
  "color.green": "Verde",
  "color.blue": "Azul",
  "color.bg": "Fondo",
  "color.surface": "Superficie",
  "color.text": "Texto",
  "color.icon": "Icono",
  "color.border": "Borde",
  "font.families": "Familias",
  "font.size": "Tamaños",
  "font.weights": "Pesos",
  "font.line-height": "Interlineado",
  "font.letter-spacings": "Tracking",
  "text.style": "Familia de estilo",
  "text.size": "Tamaño",
  "text.weight": "Peso",
  "text.line-height": "Interlineado",
  "text.letter-spacing": "Tracking",
  spacing: "Espaciado",
  "border-radius": "Radio",
  shadow: "Sombra",
  blur: "Desenfoque",
  opacity: "Opacidad",
  "motion.duration": "Duración",
  "motion.delay": "Retraso",
  "motion.easing": "Curva",
};

function isToken(value) {
  return Boolean(value) && typeof value === "object" && "$value" in value;
}

// Un token sin $type propio hereda el del grupo padre más cercano (DTCG).
function flatten(node, path = [], type = node?.$type) {
  const tokens = [];
  for (const [key, value] of Object.entries(node ?? {})) {
    if (key.startsWith("$") || !value || typeof value !== "object") continue;
    const next = [...path, key];
    if (isToken(value)) tokens.push(normalize(next, { ...value, $type: value.$type ?? type }));
    else tokens.push(...flatten(value, next, value.$type ?? type));
  }
  return tokens;
}

function normalize(path, token) {
  const ext = token.$extensions?.[NS] ?? {};
  const raw = token.$value;
  const alias = typeof raw === "string" && ALIAS.test(raw) ? raw.slice(1, -1) : null;
  return {
    path: path.join("."),
    name: path[path.length - 1],
    group: path.length > 2 ? path.slice(0, -1).join(".") : path.length === 2 && path[0] === "color" ? "color.base" : path.slice(0, -1).join(".") || path[0],
    type: token.$type ?? null,
    raw,
    alias,
    alpha: typeof ext.alpha === "number" ? ext.alpha : null,
    cssVar: ext.cssVar ?? `--${path.join("-")}`,
    cssFormat: ext.cssFormat ?? null,
  };
}

// Sombra DTCG -> CSS. Dimensiones {value, unit}; colores {colorSpace: "srgb", components, alpha}.
// Un spread de 0 se omite, igual que en el CSS publicado.
function dimCss(d) {
  return typeof d === "string" ? d : d.value === 0 ? "0" : `${d.value}${d.unit}`;
}

function colorCss(c) {
  if (typeof c === "string") return c;
  const rgb = c.components.map((part) => Math.round(part * 255)).join(" ");
  return `rgb(${rgb}${c.alpha != null && c.alpha < 1 ? ` / ${c.alpha}` : ""})`;
}

function formatShadow(value) {
  const layers = Array.isArray(value) ? value : [value];
  return layers
    .map((layer) => {
      const spread = layer.spread == null || (typeof layer.spread === "object" && layer.spread.value === 0) ? "" : ` ${dimCss(layer.spread)}`;
      return `${dimCss(layer.offsetX)} ${dimCss(layer.offsetY)} ${dimCss(layer.blur)}${spread} ${colorCss(layer.color)}`;
    })
    .join(", ");
}

function formatLeaf(token) {
  if (!token) return "";
  const { raw, type, cssFormat } = token;
  if (type === "fontFamily") {
    return [].concat(raw).map((family) => (/\s/.test(family) ? `"${family}"` : family)).join(", ");
  }
  if (type === "cubicBezier") return `cubic-bezier(${raw.join(", ")})`;
  if (type === "shadow") return formatShadow(raw);
  if (type === "number" && cssFormat === "percent") return `${Math.round(Number(raw) * 100)}%`;
  if (raw && typeof raw === "object") return JSON.stringify(raw);
  return String(raw);
}

const byPath = new Map();
for (const file of FILES) {
  for (const token of flatten(file.data)) {
    if (!byPath.has(token.path)) byPath.set(token.path, token);
  }
}

function resolveLeaf(token, seen = new Set()) {
  if (!token?.alias) return token;
  if (seen.has(token.path)) return token;
  seen.add(token.path);
  const target = byPath.get(token.alias);
  if (!target) return token;
  return resolveLeaf(target, seen);
}

function chainedAlpha(token, seen = new Set()) {
  if (!token) return null;
  if (typeof token.alpha === "number") return token.alpha;
  if (!token.alias || seen.has(token.path)) return null;
  seen.add(token.path);
  return chainedAlpha(byPath.get(token.alias), seen);
}

function cssValue(token) {
  if (token.alias) {
    const target = byPath.get(token.alias);
    const ref = target?.cssVar ? `var(${target.cssVar})` : `{${token.alias}}`;
    if (token.alpha != null) return `rgb(from ${ref} r g b / ${Math.round(token.alpha * 100)}%)`;
    return ref;
  }
  return formatLeaf(token);
}

export function paint(token) {
  const leaf = resolveLeaf(token);
  const hex = typeof leaf?.raw === "string" && /^#[0-9a-fA-F]{6}$/.test(leaf.raw) ? leaf.raw : null;
  if (!hex) return null;
  const alpha = chainedAlpha(token);
  if (alpha == null) return hex;
  const r = Number.parseInt(hex.slice(1, 3), 16);
  const g = Number.parseInt(hex.slice(3, 5), 16);
  const b = Number.parseInt(hex.slice(5, 7), 16);
  return `rgb(${r} ${g} ${b} / ${alpha})`;
}

function present(token) {
  const leaf = resolveLeaf(token);
  return {
    ...token,
    alphaResolved: chainedAlpha(token),
    cssValue: cssValue(token),
    resolved: formatLeaf(leaf),
    paint: paint(token),
  };
}

const lightByPath = new Map(flatten(semanticColorLight).map((token) => [token.path, token]));

function tokensFor(category, layer) {
  const file = FILES.find((entry) => entry.category === category && entry.layer === layer);
  if (!file) return [];
  return flatten(file.data).map((token) => {
    const view = present(token);
    if (category === "color" && layer === "semantic") {
      const light = lightByPath.get(token.path);
      view.light = light
        ? present(light)
        : { inherits: true, cssValue: view.cssValue, resolved: view.resolved, paint: view.paint, alias: view.alias };
    }
    return view;
  });
}

export function sourceOf(category, layer) {
  if (category === "color" && layer === "semantic") {
    return {
      path: "tokens/semantic/color.semantic.dark.json + color.semantic.light.json",
      description: `${semanticColorDark.$description ?? ""} ${semanticColorLight.$description ?? ""}`.trim(),
    };
  }
  const file = FILES.find((entry) => entry.category === category && entry.layer === layer);
  return {
    path: file?.path ?? "",
    description: file?.data?.$description ?? "",
  };
}

function numericRank(name) {
  if (/^\d+$/.test(name)) return Number(name);
  const stepped = name.match(/^(\d+)-(\d+)$/);
  if (stepped) return Number(stepped[1]) + Number(stepped[2]) / 1000;
  const minus = name.match(/^minus-(\d+)$/);
  if (minus) return -Number(minus[1]);
  return null;
}

// Object.entries saca las claves numéricas ordenadas y deja "00" o "minus-100" al final.
// Si todo el grupo es numérico, se reordena por el número. Si hay nombres (xs, primary), se respeta el JSON.
function orderTokens(tokens) {
  const ranks = tokens.map((token) => numericRank(token.name));
  if (ranks.some((rank) => rank == null)) return tokens;
  return tokens
    .map((token, index) => ({ token, index, rank: ranks[index] }))
    .sort((a, b) => a.rank - b.rank || a.index - b.index)
    .map((entry) => entry.token);
}

export function groupsOf(category, layer) {
  const groups = [];
  for (const token of tokensFor(category, layer)) {
    let group = groups.find((entry) => entry.id === token.group);
    if (!group) {
      group = {
        id: token.group,
        label: GROUP_LABELS[token.group] ?? token.group,
        tokens: [],
      };
      groups.push(group);
    }
    group.tokens.push(token);
  }
  for (const group of groups) group.tokens = orderTokens(group.tokens);
  return groups;
}

export function specimenKind(token) {
  if (token.type === "color") return "color";
  if (token.type === "fontFamily") return "family";
  if (token.type === "fontWeight") return "weight";
  if (token.type === "shadow") return "shadow";
  if (token.type === "cubicBezier") return "easing";
  if (token.type === "duration") return token.group.includes("delay") ? "delay" : "duration";
  if (token.type === "number") return "opacity";
  if (token.group.includes("line-height")) return "line-height";
  if (token.group.includes("letter-spacing")) return "letter-spacing";
  if (token.path.startsWith("border-radius")) return "radius";
  if (token.path.startsWith("blur")) return "blur";
  if (token.path.startsWith("spacing")) return "spacing";
  if (token.group.includes("size")) return "size";
  return "text";
}

export function allSemanticColors() {
  return tokensFor("color", "semantic");
}

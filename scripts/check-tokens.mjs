#!/usr/bin/env node
// Validates the DTCG token JSON and proves it regenerates JC's original CSS custom properties 1:1.
// Usage: node scripts/check-tokens.mjs [path/to/original/scss/tokens] [--emit out.css]
// No dependencies (Node >= 18).
import { readFileSync, readdirSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "tokens");
const args = process.argv.slice(2);
const emitIdx = args.indexOf("--emit");
const emit = emitIdx >= 0 ? args.splice(emitIdx, 2)[1] : null;
const ORIG = args[0];
const NS = "com.jcbrand";
let errors = 0;
const fail = (m) => { errors++; console.error("✗ " + m); };

// ---------- load + flatten
const files = [];
for (const layer of ["core", "semantic"])
  for (const f of readdirSync(join(ROOT, layer)).filter((f) => f.endsWith(".json")).sort()) {
    const p = join(ROOT, layer, f);
    try { files.push({ rel: `${layer}/${f}`, json: JSON.parse(readFileSync(p, "utf8")) }); }
    catch (e) { fail(`${layer}/${f}: invalid JSON (${e.message})`); }
  }
// A token without its own $type inherits the nearest parent group's $type (DTCG).
const flatten = (node, path = [], out = [], type = node.$type) => {
  for (const [k, v] of Object.entries(node)) {
    if (k.startsWith("$") || typeof v !== "object" || v === null) continue;
    if ("$value" in v) out.push({ path: [...path, k].join("."), tok: { ...v, $type: v.$type ?? type } });
    else flatten(v, [...path, k], out, v.$type ?? type);
  }
  return out;
};
// Files are named <name>.core.json, <name>.semantic.json or <name>.semantic.<theme>.json.
// The original SCSS is _<name>.core.scss / _<name>.semantic.scss (both themes share one SCSS).
const sourceOf = (f) => `${f.rel.split("/")[0]}/_${f.rel.split("/").pop().replace(/\.(dark|light)(?=\.json$)/, "").replace(/\.json$/, ".scss")}`;
const base = new Map();   // core + semantic default (:root)
const light = new Map();  // [data-theme="light"] overrides
for (const f of files) {
  // <name>.semantic.light.json holds only the light-theme overrides; every other file is :root.
  const sel = f.rel.endsWith(".semantic.light.json") ? '[data-theme="light"]' : ":root";
  const target = sel === ":root" ? base : light;
  for (const t of flatten(f.json)) {
    t.file = f.rel; t.selector = sel;
    if (target.has(t.path)) fail(`duplicate path ${t.path} (${f.rel})`);
    target.set(t.path, t);
    // cssVar is optional: without it the name is derived from the path (see cssVarOf).
    if (!t.tok.$type) fail(`${t.path}: missing $type`);
  }
}
for (const [p, t] of light) if (!base.has(p)) fail(`light override ${p} has no :root counterpart`);

// ---------- aliases
const ALIAS = /^\{([^}]+)\}$/;
const resolve = (t, seen = new Set()) => {
  const m = typeof t.tok.$value === "string" && t.tok.$value.match(ALIAS);
  if (!m) return t;
  if (seen.has(t.path)) { fail(`alias cycle at ${t.path}`); return t; }
  seen.add(t.path);
  const target = base.get(m[1]);
  if (!target) { fail(`${t.path}: alias {${m[1]}} does not resolve`); return t; }
  if (target.tok.$type !== t.tok.$type) fail(`${t.path}: type ${t.tok.$type} ≠ alias target ${target.tok.$type}`);
  return resolve(target, seen);
};
let aliasCount = 0;
for (const t of [...base.values(), ...light.values()]) {
  if (typeof t.tok.$value === "string" && ALIAS.test(t.tok.$value)) aliasCount++;
  resolve(t);
}

// No token has a cssVar: the name comes from the path (color.gray.100 -> --color-gray-100).
const cssVarOf = (t) => t.tok.$extensions?.[NS]?.cssVar ?? `--${t.path.replaceAll(".", "-")}`;

// DTCG shadow -> CSS box-shadow. Dimensions are {value, unit}; colors are {colorSpace: "srgb", components, alpha}.
// A zero spread is left out, so `0 1px 2px rgb(0 0 0 / 0.16)` stays exactly as authored.
const dimCss = (d) => (typeof d === "string" ? d : d.value === 0 ? "0" : `${d.value}${d.unit}`);
const colorCss = (c) => {
  if (typeof c === "string") return c;
  if (c.colorSpace !== "srgb") throw new Error(`shadow color space "${c.colorSpace}" is not supported`);
  const rgb = c.components.map((part) => Math.round(part * 255)).join(" ");
  return `rgb(${rgb}${c.alpha != null && c.alpha < 1 ? ` / ${c.alpha}` : ""})`;
};
const shadowCss = (value) => [].concat(value)
  .map((layer) => {
    const spread = layer.spread == null || (typeof layer.spread === "object" && layer.spread.value === 0) ? null : dimCss(layer.spread);
    return [dimCss(layer.offsetX), dimCss(layer.offsetY), dimCss(layer.blur), spread, colorCss(layer.color)].filter((part) => part != null).join(" ");
  })
  .join(", ");

// ---------- CSS formatter (reproduces JC's authored values)
const cssValue = (t) => {
  const v = t.tok.$value, ext = t.tok.$extensions?.[NS] ?? {};
  const m = typeof v === "string" && v.match(ALIAS);
  if (m) {
    const ref = `var(${cssVarOf(base.get(m[1]))})`;
    return ext.alpha != null ? `rgb(from ${ref} r g b / ${Math.round(ext.alpha * 100)}%)` : ref;
  }
  switch (t.tok.$type) {
    case "fontFamily": return [].concat(v).map((f) => (/\s/.test(f) ? `"${f}"` : f)).join(", ");
    case "fontWeight": return String(v);
    case "cubicBezier": return `cubic-bezier(${v.join(", ")})`;
    case "number": return ext.cssFormat === "percent" ? `${Math.round(v * 100)}%` : String(v);
    case "shadow": return shadowCss(v);
    default: return String(v);
  }
};
const generated = new Map(); // key "source|selector" -> [[var, value]]
for (const t of [...base.values(), ...light.values()]) {
  const f = files.find((f) => f.rel === t.file);
  const key = `${sourceOf(f)}|${t.selector}`;
  if (!generated.has(key)) generated.set(key, []);
  generated.get(key).push([cssVarOf(t), cssValue(t)]);
}
if (emit) {
  const css = [...generated].map(([k, d]) => `/* ${k.split("|")[0]} */\n${k.split("|")[1]} {\n${d.map(([n, v]) => `  ${n}: ${v};`).join("\n")}\n}`).join("\n\n");
  writeFileSync(emit, css + "\n");
}

// ---------- diff against the original SCSS
let compared = 0;
if (ORIG) {
  const parse = (txt) => {
    txt = txt.replace(/\/\/[^\n]*/g, "").replace(/#\{"([^"]*)"\}/g, "$1");
    const out = new Map();
    for (const [, sel, body] of txt.matchAll(/([^{}]+)\{([^{}]*)\}/g))
      out.set(sel.trim(), [...body.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)].map((d) => [d[1], d[2].split(/\s+/).join(" ").trim()]));
    return out;
  };
  const seenKeys = new Set();
  for (const layer of ["core", "semantic"])
    for (const f of readdirSync(join(ORIG, layer)).filter((f) => f.endsWith(".scss") && !f.startsWith("_index"))) {
      for (const [sel, decls] of parse(readFileSync(join(ORIG, layer, f), "utf8"))) {
        const key = `${layer}/${f}|${sel}`; seenKeys.add(key);
        const gen = generated.get(key) ?? [];
        if (gen.length !== decls.length) fail(`${key}: ${decls.length} original vars vs ${gen.length} generated`);
        // Custom properties are order-independent (and JS objects reorder integer-like keys such as "100"),
        // so the comparison is by name: same set of names, identical value for each.
        const genMap = new Map(gen);
        for (const [n, v] of decls) {
          compared++;
          if (!genMap.has(n)) fail(`${key}: missing ${n}`);
          else if (genMap.get(n) !== v) fail(`${key} ${n}: "${genMap.get(n)}" ≠ original "${v}"`);
          genMap.delete(n);
        }
        for (const n of genMap.keys()) fail(`${key}: extra generated var ${n}`);
      }
    }
  for (const k of generated.keys()) if (!seenKeys.has(k)) fail(`generated block ${k} not in original`);
}

console.log(`files ${files.length} · tokens ${base.size} (:root) + ${light.size} (light) · aliases ${aliasCount}` +
  (ORIG ? ` · compared ${compared} vars against ${ORIG}` : " · (pass original SCSS dir to diff)"));
console.log(errors ? `FAILED: ${errors} error(s)` : "OK: all JSON valid, all aliases resolve" + (ORIG ? ", CSS regenerated 1:1" : ""));
process.exit(errors ? 1 : 0);

// Contraste WCAG 2 a partir de los hex resueltos en tokens.mjs.
// No cambia tokens: solo dice qué pares no llegan al umbral.
import { allSemanticColors } from "./tokens.mjs";

function channel(value) {
  const s = value / 255;
  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

function luminance(hex) {
  const r = Number.parseInt(hex.slice(1, 3), 16);
  const g = Number.parseInt(hex.slice(3, 5), 16);
  const b = Number.parseInt(hex.slice(5, 7), 16);
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

export function contrastRatio(foreground, background) {
  if (!/^#[0-9a-fA-F]{6}$/.test(foreground) || !/^#[0-9a-fA-F]{6}$/.test(background)) return null;
  const lighter = Math.max(luminance(foreground), luminance(background));
  const darker = Math.min(luminance(foreground), luminance(background));
  return (lighter + 0.05) / (darker + 0.05);
}

function roleOf(token) {
  if (token.path.startsWith("color.text.")) return { id: "text", threshold: 4.5, label: "texto" };
  if (token.path.startsWith("color.icon.")) return { id: "icon", threshold: 3, label: "icono" };
  if (token.path.startsWith("color.border.")) return { id: "border", threshold: 3, label: "borde" };
  return null;
}

function isBackground(token) {
  return token.path.startsWith("color.bg.") || token.path.startsWith("color.surface.");
}

function opaque(token) {
  return token.alpha == null && /^#[0-9a-fA-F]{6}$/.test(token.paint ?? "");
}

function themePaint(token, theme) {
  if (theme === "light" && token.light && !token.light.inherits) return token.light.paint;
  return token.paint;
}

export function contrastPairs() {
  const colors = allSemanticColors();
  const foregrounds = colors.filter(roleOf);
  const backgrounds = colors.filter((token) => isBackground(token));
  const pairs = [];

  for (const theme of ["dark", "light"]) {
    for (const foreground of foregrounds) {
      const role = roleOf(foreground);
      const fg = themePaint(foreground, theme);
      if (!/^#[0-9a-fA-F]{6}$/.test(fg ?? "")) continue;
      for (const background of backgrounds) {
        if (role.id === "border" && !background.path.startsWith("color.bg.")) continue;
        const bg = themePaint(background, theme);
        if (!opaque({ ...background, paint: bg })) continue;
        const ratio = contrastRatio(fg, bg);
        if (ratio == null) continue;
        pairs.push({
          theme,
          role: role.id,
          roleLabel: role.label,
          threshold: role.threshold,
          ratio,
          pass: ratio >= role.threshold,
          foreground: foreground.cssVar,
          background: background.cssVar,
          foregroundPath: foreground.path,
          backgroundPath: background.path,
          foregroundValue: fg,
          backgroundValue: bg,
        });
      }
    }
  }

  return pairs.sort((a, b) => a.ratio - b.ratio);
}

const PAGE_BACKGROUNDS = new Set([
  "--color-bg-primary",
  "--color-bg-secondary",
  "--color-bg-tertiary",
  "--color-surface-primary",
  "--color-surface-secondary",
  "--color-surface-tertiary",
  "--color-surface-accent",
  "--color-surface-danger",
]);

// La página no lista cada combinación posible: solo pares de uso (texto, icono y borde
// sobre el fondo de página o una superficie) y el par inverse con inverse.
export function contrastFailures() {
  return contrastPairs().filter((pair) => {
    if (pair.pass || pair.ratio === 1) return false;
    const inverse = pair.foreground.includes("inverse") || pair.background.includes("inverse");
    if (inverse) return pair.foreground.includes("inverse") && pair.background.includes("inverse");
    if (pair.role === "border" || pair.role === "icon") return pair.background === "--color-bg-primary";
    return PAGE_BACKGROUNDS.has(pair.background);
  });
}

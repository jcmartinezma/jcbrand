import { groupsOf, sourceOf, specimenKind } from "../lib/tokens.mjs";
import { contrastFailures } from "../lib/contrast.mjs";

function formatRatio(ratio, threshold) {
  const rounded = ratio.toFixed(2);
  if (Number(rounded) >= threshold && ratio < threshold) return ratio.toFixed(3);
  return rounded;
}

function SourceNote({ category, layer }) {
  const source = sourceOf(category, layer);
  if (!source.path) return null;
  return (
    <p className="jc-source">
      Leído de <code>{source.path}</code>
      {source.description ? `. ${source.description}` : null}
    </p>
  );
}

function Meta({ token, extra }) {
  return (
    <div className="jc-meta">
      <strong>{token.name}</strong>
      <code>{token.cssVar}</code>
      <span>{token.alias ? token.cssValue : token.resolved}</span>
      {token.alias ? <span className="jc-resolved">resuelve a {token.resolved}</span> : null}
      {extra}
    </div>
  );
}

function Swatch({ label, color, alpha }) {
  return (
    <div className={alpha != null ? "jc-swatch jc-swatch-alpha" : "jc-swatch"} title={label}>
      <div className="jc-swatch-fill" style={{ background: color }} />
      <span>{label}</span>
    </div>
  );
}

function ColorCard({ token, live = true }) {
  const themed = Boolean(token.light);
  return (
    <article className="jc-color-card">
      <div className="jc-swatches">
        <Swatch
          label={themed ? "Oscuro" : "Muestra"}
          color={token.paint ?? `var(${token.cssVar})`}
          alpha={token.alphaResolved}
        />
        {themed ? (
          <Swatch label="Claro" color={token.light.paint ?? token.paint} alpha={token.light.alphaResolved ?? token.alphaResolved} />
        ) : null}
        {live ? <Swatch label="Activo" color={`var(${token.cssVar})`} alpha={token.alphaResolved} /> : null}
      </div>
      <Meta
        token={token}
        extra={
          token.light ? (
            <span>
              {token.light.inherits
                ? "claro: hereda el oscuro"
                : `claro: ${token.light.alias ? token.light.cssValue : token.light.resolved} → ${token.light.resolved}`}
            </span>
          ) : null
        }
      />
    </article>
  );
}

function Specimen({ token }) {
  const kind = specimenKind(token);
  const style = {};
  if (token.cssVar) {
    if (kind === "family") style.fontFamily = `var(${token.cssVar})`;
    if (kind === "size") style.fontSize = `var(${token.cssVar})`;
    if (kind === "weight") style.fontWeight = `var(${token.cssVar})`;
    if (kind === "line-height") style.lineHeight = `var(${token.cssVar})`;
    if (kind === "letter-spacing") style.letterSpacing = `var(${token.cssVar})`;
    if (kind === "spacing") style.width = `var(${token.cssVar})`;
    if (kind === "radius") style.borderRadius = `var(${token.cssVar})`;
    if (kind === "shadow") style.boxShadow = `var(${token.cssVar})`;
    if (kind === "blur") style.backdropFilter = `blur(var(${token.cssVar}))`;
    if (kind === "opacity") style.opacity = `var(${token.cssVar})`;
    if (kind === "duration" || kind === "easing" || kind === "delay") {
      style.animationDuration = kind === "delay" ? "var(--motion-duration-slow)" : `var(${token.cssVar})`;
      style.animationTimingFunction = kind === "easing" ? `var(${token.cssVar})` : "var(--motion-easing-standard)";
      style.animationDelay = kind === "delay" ? `var(${token.cssVar})` : "0s";
    }
  }

  let preview = null;
  if (kind === "family" || kind === "weight" || kind === "letter-spacing") {
    preview = (
      <p className={`jc-type-sample jc-type-${kind}`} style={style}>
        La marca de JC
      </p>
    );
  } else if (kind === "size") {
    preview = (
      <p className="jc-type-sample jc-type-size" style={style}>
        Aa
      </p>
    );
  } else if (kind === "line-height") {
    preview = (
      <p className="jc-type-sample jc-type-leading" style={style}>
        Primera línea del bloque.
        <br />
        Segunda línea, para ver el interlineado.
      </p>
    );
  } else if (kind === "spacing") {
    preview = (
      <div className="jc-bar-track">
        <div className="jc-bar" style={style} />
      </div>
    );
  } else if (kind === "radius") {
    preview = <div className="jc-radius" style={style} />;
  } else if (kind === "shadow") {
    preview = <div className="jc-shadow" style={style} />;
  } else if (kind === "blur") {
    preview = (
      <div className="jc-blur">
        <div className="jc-blur-art" />
        <div className="jc-blur-pane" style={style} />
      </div>
    );
  } else if (kind === "opacity") {
    preview = (
      <div className="jc-opacity">
        <div className="jc-opacity-chip" style={style} />
      </div>
    );
  } else if (kind === "duration" || kind === "easing" || kind === "delay") {
    preview = (
      <div className="jc-motion">
        <div className="jc-motion-dot" style={style} />
      </div>
    );
  }

  return (
    <article className="jc-specimen">
      {preview}
      <Meta token={token} />
    </article>
  );
}

export function TokenSpecimens({ category, layer }) {
  const groups = groupsOf(category, layer);
  return (
    <section className="jc-foundation">
      <SourceNote category={category} layer={layer} />
      {groups.length === 0 ? (
        <p className="jc-empty">Este archivo no define tokens. La descripción de arriba es la del JSON.</p>
      ) : (
        groups.map((group) => (
          <div key={group.id} className="jc-group">
            <h3>{group.label}</h3>
            <div className={group.tokens[0]?.type === "color" ? "jc-color-grid" : "jc-specimen-grid"}>
              {group.tokens.map((token) =>
                token.type === "color" ? (
                  <ColorCard key={token.path} token={token} live={layer === "semantic" || token.alpha != null} />
                ) : (
                  <Specimen key={token.path} token={token} />
                ),
              )}
            </div>
          </div>
        ))
      )}
    </section>
  );
}

export function ContrastReport() {
  const failures = contrastFailures();
  return (
    <section className="jc-foundation">
      <p className="jc-source">
        Calculado con la luminancia relativa de WCAG 2 sobre los hex a los que apunta cada alias. Texto sobre fondo o
        superficie: 4.5:1. Icono y borde sobre el fondo de página: 3:1. El par inverse solo se mira contra un fondo
        inverse. El velo no entra, porque lleva alpha. Esta lista no cambia los tokens.
      </p>
      <div className="jc-table-wrap">
        <table className="jc-table">
          <thead>
            <tr>
              <th>Tema</th>
              <th>Rol</th>
              <th>Primer plano</th>
              <th>Fondo</th>
              <th>Ratio</th>
              <th>Umbral</th>
            </tr>
          </thead>
          <tbody>
            {failures.map((pair) => (
              <tr key={`${pair.theme}-${pair.foreground}-${pair.background}`}>
                <td>{pair.theme === "light" ? "claro" : "oscuro"}</td>
                <td>{pair.roleLabel}</td>
                <td>
                  <code>{pair.foreground}</code>
                  <span className="jc-resolved">{pair.foregroundValue}</span>
                </td>
                <td>
                  <code>{pair.background}</code>
                  <span className="jc-resolved">{pair.backgroundValue}</span>
                </td>
                <td>{formatRatio(pair.ratio, pair.threshold)}</td>
                <td>{pair.threshold.toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function ContrastCanvas() {
  const colors = groupsOf("color", "semantic").flatMap((group) => group.tokens);
  const texts = colors.filter((token) => token.path.startsWith("color.text."));
  const backgrounds = colors.filter(
    (token) => token.path.startsWith("color.bg.") && token.alpha == null,
  );
  return (
    <div className="jc-contrast-canvas">
      <p className="jc-source">
        El texto de cada bloque usa el token de texto sobre el token de fondo, así el panel Accessibility mide el par
        real. El bloque fijo de abajo es el verde primitivo sobre blanco: en el tema claro, el texto de acento y el
        fondo de página resuelven a ese par.
      </p>
      {backgrounds.map((background) => (
        <section key={background.path} className="jc-contrast-section">
          <h3>
            {background.cssVar}
          </h3>
          <div className="jc-contrast-row">
            {texts.map((text) => (
              <p
                key={`${background.path}-${text.path}`}
                className="jc-contrast-sample"
                style={{ background: `var(${background.cssVar})`, color: `var(${text.cssVar})` }}
              >
                {text.cssVar} sobre {background.cssVar}. La marca de JC se lee así.
              </p>
            ))}
          </div>
        </section>
      ))}
      <p className="jc-contrast-sample jc-contrast-known" style={{ background: "var(--white)", color: "var(--green-500)" }}>
        var(--green-500) sobre var(--white). Es el acento de texto del tema claro encima del fondo de página claro.
      </p>
    </div>
  );
}

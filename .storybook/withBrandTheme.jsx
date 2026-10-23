import { useEffect, useState } from "react";
import { DocsContainer } from "@storybook/addon-docs/blocks";
import { addons } from "storybook/preview-api";
import { GLOBALS_UPDATED } from "storybook/internal/core-events";

function themeName(value) {
  return value === "light" ? "light" : "dark";
}

export function applyBrandTheme(theme) {
  const value = themeName(theme);
  document.documentElement.setAttribute("data-theme", value);
  document.body?.setAttribute("data-theme", value);
}

function themeFromPayload(payload) {
  return themeName(payload?.globals?.theme);
}

export function readBrandTheme() {
  const channel = addons.getChannel();
  const last = typeof channel.last === "function" ? channel.last(GLOBALS_UPDATED) : null;
  return themeFromPayload(last?.[0]);
}

export function BrandDocsContainer({ children, context, ...props }) {
  const [theme, setTheme] = useState(readBrandTheme);

  useEffect(() => {
    const channel = addons.getChannel();
    const onGlobals = (payload) => setTheme(themeFromPayload(payload));
    channel.on(GLOBALS_UPDATED, onGlobals);
    setTheme(readBrandTheme());
    return () => channel.off(GLOBALS_UPDATED, onGlobals);
  }, []);

  useEffect(() => {
    applyBrandTheme(theme);
  }, [theme]);

  return (
    <div className="jcbrand-docs" data-theme={theme}>
      <DocsContainer context={context} {...props}>
        {children}
      </DocsContainer>
    </div>
  );
}

export function withBrandTheme(Story, context) {
  const override = context.parameters?.themes?.themeOverride;
  const theme = themeName(override || context.globals?.theme);

  useEffect(() => {
    applyBrandTheme(theme);
  }, [theme]);

  return (
    <div className="jcbrand-preview" data-theme={theme}>
      <Story />
    </div>
  );
}

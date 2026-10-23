/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
  stories: ["../stories/**/*.mdx", "../stories/**/*.stories.@(js|jsx)"],
  addons: ["@storybook/addon-docs", "@storybook/addon-a11y"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  core: {
    disableTelemetry: true,
  },
  docs: {
    defaultName: "Docs",
  },
  async viteFinal(config) {
    // Storybook compila el JSX de .storybook/ y stories/ con el runtime clásico
    // (React.createElement). Sin este import, el navegador dice "React is not defined".
    config.esbuild = {
      ...config.esbuild,
      jsxInject: `import React from 'react'`,
    };
    return config;
  },
};

export default config;

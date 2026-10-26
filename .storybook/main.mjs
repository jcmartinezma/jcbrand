/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
  stories: ["../stories/**/*.mdx", "../stories/**/*.stories.@(js|jsx)"],
  addons: ["@storybook/addon-docs", "@storybook/addon-a11y"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  async viteFinal(config) {
    // Necesario para que los .jsx sin `import React` funcionen (runtime clásico).
    config.esbuild = {
      ...config.esbuild,
      jsxInject: `import React from 'react'`,
    };
    return config;
  },
};

export default config;

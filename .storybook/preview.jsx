import "../fonts/fonts.css";
import "../dist/css/tokens.css";
import "./preview.css";
import { BrandDocsContainer, withBrandTheme } from "./withBrandTheme";

/** @type { import('@storybook/react-vite').Preview } */
const preview = {
  decorators: [withBrandTheme],
  globalTypes: {
    theme: {
      description: "Oscuro es el tema de :root. Claro escribe data-theme=light en la vista y en la documentación.",
      toolbar: {
        title: "Tema",
        icon: "circlehollow",
        items: [
          { value: "dark", title: "Oscuro", icon: "moon" },
          { value: "light", title: "Claro", icon: "sun" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: "dark",
  },
  parameters: {
    layout: "padded",
    backgrounds: { disable: true },
    controls: { disable: true },
    actions: { disable: true },
    a11y: {
      test: "todo",
    },
    options: {
      storySort: {
        order: [
          "Foundations",
          [
            "Introducción",
            "Color",
            "Tipografía",
            "Espaciado",
            "Radio",
            "Sombra",
            "Motion",
            "Desenfoque",
            "Opacidad",
            "Contraste",
          ],
        ],
      },
    },
    docs: {
      container: BrandDocsContainer,
      toc: {
        headingSelector: "h2, h3",
        title: "En esta página",
      },
    },
  },
};

export default preview;

import type { Preview } from "@storybook/react-vite";
import "@liete/tokens/css";
import "../src/storybook.css";

const preview: Preview = {
  parameters: {
    a11y: {
      test: "error"
    },
    controls: {
      expanded: true
    }
  },
  tags: ["autodocs"]
};

export default preview;

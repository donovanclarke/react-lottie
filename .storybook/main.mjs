/** @type { import('@storybook/react-webpack5').StorybookConfig } */
const config = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-webpack5-compiler-swc",
    "@chromatic-com/storybook",
    "@storybook/addon-docs"
  ],
  framework: {
    name: "@storybook/react-webpack5",
    options: {},
  },
};
export default config;

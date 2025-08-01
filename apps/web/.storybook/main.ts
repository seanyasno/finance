import type { StorybookConfig } from "@storybook/react-vite";

import { join, dirname } from "path";

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string): string {
  return dirname(require.resolve(join(value, "package.json")));
}
const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    getAbsolutePath("@storybook/addon-docs"),
    getAbsolutePath("@storybook/addon-a11y"),
  ],
  framework: {
    name: getAbsolutePath("@storybook/react-vite"),
    options: {},
  },
  viteFinal: async (config) => {
    config.define = {
      ...config.define,
      global: "globalThis",
    };

    // Enable module mocking for Storybook
    config.resolve = {
      ...config.resolve,
      alias: {
        ...config.resolve?.alias,
        "@tanstack/react-router": require.resolve("./mocks/react-router.ts"),
        "@/features": require.resolve("./mocks/features.tsx"),
        "@/components": require.resolve("./mocks/components.tsx"),
        "@/hooks": require.resolve("./mocks/hooks.ts"),
        "@/hooks/use-mouse-position": require.resolve(
          "./mocks/use-mouse-position.ts",
        ),
        "@/types": require.resolve("./mocks/types.ts"),
        "@poke-playbook/libs": require.resolve("./mocks/libs.ts"),
        // Mock for authentication hooks directory
        [require.resolve("../src/features/authentication/hooks/index.ts")]:
          require.resolve("./mocks/authentication-hooks.ts"),
      },
    };

    return config;
  },
};
export default config;

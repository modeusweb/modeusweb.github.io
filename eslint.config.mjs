import next from "eslint-config-next";

/**
 * Flat ESLint configuration.
 *
 * Next.js 16 ships `eslint-config-next` as native flat-config objects. We add
 * our extra TypeScript rules to the config object that already registers the
 * `@typescript-eslint` plugin (flat config does not cascade plugins between
 * separate objects).
 */
const eslintConfig = [
  ...next.map((config) => {
    // The TypeScript-scoped config (index 1) is where @typescript-eslint lives.
    if (config.plugins && "@typescript-eslint" in config.plugins) {
      return {
        ...config,
        rules: {
          ...config.rules,
          "@typescript-eslint/no-explicit-any": "error",
          "@typescript-eslint/consistent-type-imports": [
            "warn",
            { prefer: "type-imports", fixStyle: "inline-type-imports" },
          ],
        },
      };
    }
    return config;
  }),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "coverage/**",
      "playwright-report/**",
      "test-results/**",
      "next-env.d.ts",
      "npm-install*.log",
      "*.log",
    ],
  },
];

export default eslintConfig;




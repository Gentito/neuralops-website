import nextVitals from "eslint-config-next/core-web-vitals";

/**
 * Flat ESLint config for ESLint 9 / Next 16.
 * Replaces the legacy .eslintrc.json, as `next lint` was removed in Next 16.
 */
const config = [
  { ignores: ["agency-agents/**", ".next/**", "node_modules/**"] },
  ...nextVitals,
  {
    files: ["**/*.d.ts"],
    rules: {
      "@typescript-eslint/no-empty-object-type": "off"
    }
  },
  {
    // Rules introduced with eslint-config-next 16 (React Compiler aware).
    // They flag pre-existing, intentional patterns in this codebase, so they
    // are kept as warnings until the affected components are refactored.
    rules: {
      "react-hooks/purity": "warn",
      "react-hooks/set-state-in-effect": "warn"
    }
  }
];

export default config;

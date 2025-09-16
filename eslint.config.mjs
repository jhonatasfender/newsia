import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
  {
    files: ["cypress/**/*.{ts,tsx}", "cypress.config.ts"],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: __dirname,
        project: ["./cypress/tsconfig.json"],
      },
      globals: {
        Cypress: "readonly",
        cy: "readonly",
        beforeEach: "readonly",
      },
    },
    rules: {
      "@typescript-eslint/no-namespace": "off",
    },
  },
];

export default eslintConfig;

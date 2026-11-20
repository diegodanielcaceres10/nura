// @ts-check
const eslint = require("@eslint/js");
const { defineConfig } = require("eslint/config");
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");

module.exports = defineConfig([
  {
    files: ["**/*.ts"],
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommended,
      tseslint.configs.stylistic,
      angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: "app",
          style: "camelCase",
        },
      ],
      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: "app",
          style: "kebab-case",
        },
      ],
    },
  },
  {
    files: ["**/*.html"],
    extends: [
      angular.configs.templateRecommended,
      angular.configs.templateAccessibility,
    ],
    rules: {},
  },
  {
    files: ["src/app/core/**/*.ts"],
    rules: {
      "no-restricted-imports": ["error", { patterns: ["**/shared/**", "**/features/**"] }],
    },
  },
  {
    files: ["src/app/shared/**/*.ts"],
    rules: {
      "no-restricted-imports": ["error", { patterns: ["**/features/**"] }],
    },
  },
  {
    files: ["src/app/features/**/*.ts"],
    rules: {
      "no-restricted-imports": ["error", { patterns: ["../portfolio/**", "../work/**", "../case-study/**", "../language-selector/**"] }],
    },
  }
]);

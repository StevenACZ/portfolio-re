module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: ["eslint:recommended", "plugin:vue/recommended", "prettier"],
  ignorePatterns: ["dist", "node_modules", ".eslintrc.cjs"],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  overrides: [
    {
      files: ["vite.config.js"],
      env: { node: true },
    },
    {
      files: ["src/components/icons/TechIcon.vue"],
      rules: { "vue/no-v-html": "off" },
    },
  ],
  rules: {
    "no-console": "warn",
    "no-debugger": "error",
    "prefer-const": "error",
    "no-var": "error",
    "no-unused-vars": [
      "warn",
      { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
    ],
    "no-duplicate-imports": "error",
    "vue/multi-word-component-names": "off",
  },
};

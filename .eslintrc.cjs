module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    // Performance rules
    'react-hooks/exhaustive-deps': 'error',
    'no-console': 'warn',
    'no-debugger': 'error',
    // Code quality
    'prefer-const': 'error',
    'no-var': 'error',
    'no-unused-vars': 'warn',
    'no-duplicate-imports': 'error',
    'react/prop-types': 'off', // Since we're not using TypeScript
  },
  settings: {
    react: { version: '18.2' },
  },
};
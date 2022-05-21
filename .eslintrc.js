module.exports = {
  env: {
    browser: true,
    es2015: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
  ],
  parserOptions: {
    ecmaVersion: 6,
    sourceType: "module",
  },
  parser: '@typescript-eslint/parser',
  eslintIgnore: ['dist'],
  rules: {
  },
};
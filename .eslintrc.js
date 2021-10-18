module.exports = {
  env: {
    commonjs: true,
    es6: true,
    node: true,
    mocha: true
  },
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parserOptions: {
    ecmaVersion: 2018
  },
  extends: ['eslint:recommended', 'prettier'],
  plugins: ['prettier'],
  rules: {
    // Add Custom ESLint linting rules here, add/remove, disable/enable as your team agreed upon
    // strict: ['error', 'global'],
    'no-var': 'error',
    'no-console': 'off',
    'no-unused-vars': 'warn',
    quotes: ['error', 'single', { avoidEscape: true }],
    'require-atomic-updates': 'off',
    'comma-dangle': 'error',
    'new-cap': 'off',
    'comma-style': 'error',
    'max-len': ['warn', { code: 140 }],
    'object-curly-spacing': ['error', 'always'],
    semi: 'error',
    camelcase: 'off', // temporary
    'quote-props': ['error', 'as-needed'],
    'no-tabs': 0
  }
};

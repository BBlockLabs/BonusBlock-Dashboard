module.exports = {
  root: true,
  env: {
    es2020: true,
    node: true
  },
  'extends': [
    'plugin:vue/vue3-recommended',
    'eslint:recommended'
  ],
  parserOptions: {
    parser: '@babel/eslint-parser'
  },
  rules: {
    'vue/html-indent': 'error',
    "vue/component-name-in-template-casing": ["error", "kebab-case", {registeredComponentsOnly: false}],
    "vue/html-comment-content-spacing": ["error", "always"],
    "vue/no-static-inline-styles": ["error"],
    "vue/padding-line-between-blocks": ["error", "always"],
    "vue/require-direct-export": ["error"],
    'vue/static-class-names-order': 'error',
    // "vue/sort-keys": ["error", "asc"], // Would be nice, but this does not have an --fix option
    'indent': ["error", 2, {"SwitchCase": 1}],
    'semi': ["error", "always"],
    'no-console': process.env.NODE_ENV === 'local' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'local' ? 'warn' : 'off'
  },
};

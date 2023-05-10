/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  env: {
    es2020: true,
    browser: true,
    node: true,
  },
  root: true,
  extends: [
    "plugin:vue/vue3-recommended",
    "eslint:recommended",
    "@vue/eslint-config-typescript",
    "@vue/eslint-config-prettier",
  ],
  rules: {
    // Commented out due to conflicts with prettier/prettier package
    // resulting in an infinite loop of add/remove comma in some places
    // "comma-dangle": ["error", {
    //   "arrays": "always-multiline",
    //   "objects": "always-multiline",
    //   "imports": "never",
    //   "exports": "never",
    //   "functions": "only-multiline",
    // }],
    "vue/max-len": [
      "warn",
      {
        code: 150,
        template: 150,
        tabWidth: 2,
        comments: 150,
        ignorePattern: "",
        ignoreComments: true,
        ignoreTrailingComments: false,
        ignoreUrls: false,
        ignoreStrings: true,
        ignoreTemplateLiterals: false,
        ignoreRegExpLiterals: false,
        ignoreHTMLAttributeValues: true,
        ignoreHTMLTextContents: false,
      },
    ],
  },
  parserOptions: {
    ecmaVersion: "latest",
  },
};

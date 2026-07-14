const reactPlugin = require('eslint-plugin-react');
const globals = require('globals');

module.exports = [
  {
    plugins: {
      react: reactPlugin,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error',
    },
    ignores: ["node_modules/**", "dist/**"]
  }
];

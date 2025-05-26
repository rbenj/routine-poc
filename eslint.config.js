import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist', 'coverage'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react': react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'arrow-parens': ['error', 'as-needed', { 'requireForBlockBody': true }],
      'comma-dangle': ['error', 'always-multiline'],
      'curly': ['error', 'all'],
      'no-console': 'error',
      'quotes': ['error', 'single', { 'avoidEscape': true, 'allowTemplateLiterals': false }],
      'react/jsx-one-expression-per-line': ['error', { allow: 'literal' }],
      'react/jsx-max-props-per-line': ['error', { 'maximum': 3 }],
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },
)

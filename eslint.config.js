import js from '@eslint/js'
import prettierConfig from 'eslint-config-prettier'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist', 'node_modules', 'coverage'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2023,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'jsx-a11y': jsxA11y,
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'no-restricted-globals': [
        'error',
        {
          name: 'localStorage',
          message:
            'Do not access localStorage directly. Use the auth storage abstraction in src/services/auth/authStorage.ts.',
        },
        {
          name: 'sessionStorage',
          message:
            'Do not access sessionStorage directly. Use the auth storage abstraction in src/services/auth/authStorage.ts.',
        },
      ],
    },
  },
  {
    files: ['src/services/auth/authStorage.ts'],
    rules: {
      'no-restricted-globals': 'off',
    },
  },
  prettierConfig,
)

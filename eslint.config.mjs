import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import prettierConfig from 'eslint-config-prettier';

const REACT_APPS = ['apps/partner', 'apps/client', 'apps/admin'];
const reactFiles = REACT_APPS.flatMap((app) => [`${app}/src/**/*.ts`, `${app}/src/**/*.tsx`]);
const apiFiles = ['apps/api/src/**/*.ts', 'apps/api/test/**/*.ts'];
const typesFiles = ['packages/types/src/**/*.ts'];

export default tseslint.config(
  { ignores: ['**/dist/**', '**/node_modules/**'] },

  // Base rules for all TypeScript source
  {
    files: [...apiFiles, ...reactFiles, ...typesFiles],
    extends: [js.configs.recommended, ...tseslint.configs.recommended, prettierConfig],
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
    },
  },

  // React-specific rules
  {
    files: reactFiles,
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
    },
  },
);

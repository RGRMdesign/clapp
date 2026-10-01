// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const prettierConfig = require('eslint-config-prettier');

/**
 * Architecture rules (see CLAUDE.md → "Architecture"):
 * - routes (src/app) may import a feature only via its public index: `@/features/<name>`
 * - features never import other features; share code via src/components or src/lib
 * - shared layers (components, lib, theme) never import features or routes
 */
const noDeepFeatureImports = {
  group: ['@/features/*/*'],
  message: 'Import features via their public index: `@/features/<name>`.',
};
const noFeatureImports = {
  group: ['@/features/*', '@/features/*/*'],
  message: 'This layer may not depend on features. Move shared code to src/components or src/lib.',
};
const noRouteImports = {
  group: ['@/app/*', '@/app'],
  message: 'Never import from route files; move the code to a feature or shared layer.',
};

module.exports = defineConfig([
  expoConfig,
  prettierConfig,
  {
    ignores: [
      'dist/*',
      'web-build/*',
      '.expo/*',
      'ios/*',
      'android/*',
      'coverage/*',
      'playwright-report/*',
      'test-results/*',
      'expo-env.d.ts',
    ],
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/consistent-type-imports': ['error', { fixStyle: 'inline-type-imports' }],
      'import/no-default-export': 'off',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'react/no-unescaped-entities': 'off',
    },
  },
  {
    files: ['src/app/**'],
    rules: { 'no-restricted-imports': ['error', { patterns: [noDeepFeatureImports] }] },
  },
  {
    files: ['src/features/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/features/*', '@/features/*/*'],
              message:
                'Features may not import other features. Use relative imports inside a feature; move shared code to src/components or src/lib.',
            },
            noRouteImports,
          ],
        },
      ],
    },
  },
  {
    files: ['src/components/**', 'src/hooks/**', 'src/lib/**', 'src/theme/**'],
    rules: { 'no-restricted-imports': ['error', { patterns: [noFeatureImports, noRouteImports] }] },
  },
]);

import {
  dxCodeStyle,
  dxIgnore,
  fwDocusaurus,
  langJavascript,
  langMdx,
  langTypescript,
  novaRules,
  runtimeBrowser,
} from '@cbnventures/nova/presets/eslint';

/**
 * ESLint Configuration.
 *
 * Composes Nova's browser, TypeScript, MDX, and Docusaurus contracts.
 *
 * @since 0.0.0
 */
export default [
  ...dxIgnore,
  ...dxCodeStyle,
  ...langJavascript,
  ...langMdx,
  ...langTypescript,
  ...fwDocusaurus,
  ...runtimeBrowser,
  {
    name: 'custom-tsconfig',
    files: [
      '**/*.cts',
      '**/*.mts',
      '**/*.ts',
      '**/*.tsx',
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.json'],
      },
    },
  },
  ...novaRules,
  {
    name: 'custom-nova-rules',
    files: [
      '**/*.cjs',
      '**/*.cts',
      '**/*.js',
      '**/*.jsx',
      '**/*.mjs',
      '**/*.mts',
      '**/*.ts',
      '**/*.tsx',
    ],
    rules: {
      '@cbnventures/nova/require-kebab-case-filename': [
        'error',
        {
          extraExtensions: [],
          ignoreFiles: [
            './docusaurus.config.ts',
            './eslint.config.mts',
            './vitest.config.mts',
            './vitest.setup.ts',
          ],
        },
      ],
    },
  },
];

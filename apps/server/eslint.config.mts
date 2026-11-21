import {
  dxCodeStyle,
  dxIgnore,
  fwExpressjs,
  fwReact,
  langJavascript,
  langTypescript,
  novaRules,
  runtimeBrowser,
  runtimeNode,
  toolVite,
} from '@cbnventures/nova/presets/eslint';

/**
 * ESLint Configuration.
 *
 * Composes Nova's Node.js, TypeScript, and Express contracts.
 * The dashboard under src/web adds Nova's React and browser contracts.
 *
 * @since 0.0.0
 */
export default [
  ...dxIgnore,
  ...dxCodeStyle,
  ...langJavascript,
  ...langTypescript,
  ...fwExpressjs,
  ...runtimeNode.map((config) => ({
    ...config,
    ignores: [
      'src/types/web/**',
      'src/web/**',
    ],
  })),
  ...fwReact.map((config) => ({
    ...config,
    files: [
      'src/web/**/*.ts',
      'src/web/**/*.tsx',
    ],
  })),
  ...runtimeBrowser.map((config) => ({
    ...config,
    files: [
      'src/web/**/*.ts',
      'src/web/**/*.tsx',
    ],
  })),
  ...toolVite,
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
        project: [
          './tsconfig.source.json',
          './tsconfig.config.json',
          './tsconfig.tests.json',
          './tsconfig.web.json',
        ],
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
      '@cbnventures/nova/no-regex-literals': [
        'error',
        {
          ignoreFiles: [],
          regexFile: './src/regex.ts',
        },
      ],
      '@cbnventures/nova/require-kebab-case-filename': [
        'error',
        {
          extraExtensions: [],
          ignoreFiles: [
            './eslint.config.mts',
            './vite.config.mts',
            './vitest.config.mts',
          ],
        },
      ],
    },
  },
  {
    // Server files under src/lib and src/routes are named from src, as the sibling apps do (Lib - State, Routes - Auth).
    name: 'server-jsdoc-hierarchy',
    files: ['src/**/*.ts'],
    ignores: [
      'src/types/web/**',
      'src/web/**',
    ],
    rules: {
      '@cbnventures/nova/require-jsdoc-hierarchy': [
        'error',
        {
          anchorDirectories: ['src'],
          ignoreFiles: ['./eslint.config.mts'],
          knownNames: {},
          stripDirectories: ['types'],
        },
      ],
    },
  },
  {
    // The dashboard and its mock API keep their patterns beside the dashboard code, apart from the server's patterns.
    name: 'dashboard-regex-file',
    files: [
      'mock-api.mts',
      'src/web/**/*.ts',
      'src/web/**/*.tsx',
    ],
    rules: {
      '@cbnventures/nova/no-regex-literals': [
        'error',
        {
          ignoreFiles: [],
          regexFile: './src/web/regex.ts',
        },
      ],
    },
  },
];

import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vitest/config';

/**
 * Vitest - Current File Path.
 *
 * Runs the documentation conformance suites from @cbnventures/nova/rules/vitest
 * against this site. The suites scan from the project root (process.cwd()), so
 * vitest must run from this workspace directory.
 *
 * @since 0.20.0
 */
const currentFilePath = fileURLToPath(import.meta.url);

/**
 * Vitest - Root Directory.
 *
 * Resolves the generated documentation workspace for the @site alias.
 * This keeps the conformance suites independent from the caller's shell path.
 *
 * @since 0.20.0
 */
const rootDirectory = dirname(currentFilePath);

export default defineConfig({
  resolve: {
    alias: {
      '@site': rootDirectory,
    },
  },
  test: {
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/tests/**/*.test.ts'],
    globals: false,
    testTimeout: 30000, // 30 seconds.
    sequence: {
      concurrent: false,
    },
  },
});

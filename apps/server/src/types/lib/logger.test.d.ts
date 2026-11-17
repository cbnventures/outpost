import type { MockInstance } from 'vitest';

/**
 * Lib - Logger - Test - Stderr.
 *
 * @since 1.2.0
 */
export type Lib_LoggerTest_Stderr = MockInstance<typeof process.stderr.write>;

/**
 * Lib - Logger - Test - Stdout.
 *
 * @since 1.2.0
 */
export type Lib_LoggerTest_Stdout = MockInstance<typeof process.stdout.write>;

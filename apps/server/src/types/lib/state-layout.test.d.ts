import type { MockInstance } from 'vitest';

/**
 * Lib - State Layout - Test - Directory.
 *
 * @since 1.2.0
 */
export type Lib_StateLayoutTest_Directory = string | undefined;

/**
 * Lib - State Layout - Test - Get Directory.
 *
 * @since 1.2.0
 */
export type Lib_StateLayoutTest_GetDirectory_Returns = string;

/**
 * Lib - State Layout - Test - Normalizes Raw Key Bytes.
 *
 * @since 1.2.0
 */
export type Lib_StateLayoutTest_NormalizesRawKeyBytes_DirectoryMode = string;

export type Lib_StateLayoutTest_NormalizesRawKeyBytes_KeyBytes = Buffer;

export type Lib_StateLayoutTest_NormalizesRawKeyBytes_KeyMode = string;

/**
 * Lib - State Layout - Test - Moves Flat SQLite Files.
 *
 * @since 1.2.0
 */
export type Lib_StateLayoutTest_MovesFlatSqliteFiles_Stdout = MockInstance<typeof process.stdout.write>;

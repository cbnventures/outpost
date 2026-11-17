import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { prepareStateLayout } from './state-layout.js';

import type {
  Lib_StateLayoutTest_Directory,
  Lib_StateLayoutTest_GetDirectory_Returns,
  Lib_StateLayoutTest_MovesFlatSqliteFiles_Stdout,
  Lib_StateLayoutTest_NormalizesRawKeyBytes_DirectoryMode,
  Lib_StateLayoutTest_NormalizesRawKeyBytes_KeyBytes,
  Lib_StateLayoutTest_NormalizesRawKeyBytes_KeyMode,
} from '../types/lib/state-layout.test.d.ts';

/**
 * Lib - State Layout - Directory.
 *
 * Holds the isolated state directory for the current test.
 * Cleanup never reaches a repository path.
 *
 * @since 1.2.0
 */
let directory: Lib_StateLayoutTest_Directory = undefined;

/**
 * Lib - State Layout - Get Directory.
 *
 * Returns the current isolated directory or fails when setup did not run.
 * The beforeEach hook always initializes it before a test uses it.
 *
 * @returns {Lib_StateLayoutTest_GetDirectory_Returns}
 *
 * @since 1.2.0
 */
function getDirectory(): Lib_StateLayoutTest_GetDirectory_Returns {
  if (directory === undefined) {
    throw new Error('The state layout test directory is not initialized.');
  }

  return directory;
}

describe('state layout', () => {
  beforeEach(() => {
    directory = mkdtempSync(join(tmpdir(), 'outpost-state-layout-'));

    return;
  });

  afterEach(() => {
    vi.restoreAllMocks();

    rmSync(getDirectory(), {
      force: true,
      recursive: true,
    });

    directory = undefined;

    return;
  });

  it('moves every flat SQLite file into an empty database directory', () => {
    const stdout: Lib_StateLayoutTest_MovesFlatSqliteFiles_Stdout = vi.spyOn(process.stdout, 'write').mockReturnValue(true);

    writeFileSync(join(getDirectory(), 'outpost.sqlite3'), 'database');
    writeFileSync(join(getDirectory(), 'outpost.sqlite3-shm'), 'shared memory');
    writeFileSync(join(getDirectory(), 'outpost.sqlite3-wal'), 'write ahead log');

    prepareStateLayout(getDirectory(), join(getDirectory(), 'database'), join(getDirectory(), 'keys', 'installation.key'));

    expect(existsSync(join(getDirectory(), 'outpost.sqlite3'))).toBe(false);

    expect(existsSync(join(getDirectory(), 'outpost.sqlite3-shm'))).toBe(false);

    expect(existsSync(join(getDirectory(), 'outpost.sqlite3-wal'))).toBe(false);

    expect(readFileSync(join(getDirectory(), 'database', 'outpost.sqlite3'), 'utf8')).toBe('database');

    expect(readFileSync(join(getDirectory(), 'database', 'outpost.sqlite3-shm'), 'utf8')).toBe('shared memory');

    expect(readFileSync(join(getDirectory(), 'database', 'outpost.sqlite3-wal'), 'utf8')).toBe('write ahead log');

    expect(stdout).toHaveBeenCalledTimes(3);

    expect(stdout).toHaveBeenCalledWith(expect.stringContaining(` INFO state-migration: Moved ${join(getDirectory(), 'outpost.sqlite3')} to ${join(getDirectory(), 'database', 'outpost.sqlite3')}.\n`));

    expect(stdout).toHaveBeenCalledWith(expect.stringContaining(` INFO state-migration: Moved ${join(getDirectory(), 'outpost.sqlite3-shm')} to ${join(getDirectory(), 'database', 'outpost.sqlite3-shm')}.\n`));

    expect(stdout).toHaveBeenCalledWith(expect.stringContaining(` INFO state-migration: Moved ${join(getDirectory(), 'outpost.sqlite3-wal')} to ${join(getDirectory(), 'database', 'outpost.sqlite3-wal')}.\n`));

    return;
  });

  it('refuses conflicting or partial database layouts without changing them', () => {
    mkdirSync(join(getDirectory(), 'database'));
    writeFileSync(join(getDirectory(), 'outpost.sqlite3'), 'old database');
    writeFileSync(join(getDirectory(), 'database', 'outpost.sqlite3'), 'new database');

    expect(() => prepareStateLayout(getDirectory(), join(getDirectory(), 'database'), join(getDirectory(), 'keys', 'installation.key'))).toThrow('SQLite files in both');

    expect(readFileSync(join(getDirectory(), 'outpost.sqlite3'), 'utf8')).toBe('old database');

    expect(readFileSync(join(getDirectory(), 'database', 'outpost.sqlite3'), 'utf8')).toBe('new database');

    rmSync(join(getDirectory(), 'outpost.sqlite3'));
    rmSync(join(getDirectory(), 'database', 'outpost.sqlite3'));
    writeFileSync(join(getDirectory(), 'outpost.sqlite3-wal'), 'orphaned write ahead log');

    expect(() => prepareStateLayout(getDirectory(), join(getDirectory(), 'database'), join(getDirectory(), 'keys', 'installation.key'))).toThrow('SQLite companions without');

    expect(readFileSync(join(getDirectory(), 'outpost.sqlite3-wal'), 'utf8')).toBe('orphaned write ahead log');

    return;
  });

  it('normalizes raw key bytes and enforces owner-only modes', () => {
    const keyBytes: Lib_StateLayoutTest_NormalizesRawKeyBytes_KeyBytes = Buffer.from(Array.from({ length: 32 }, (_value, index) => index));

    vi.spyOn(process.stdout, 'write').mockReturnValue(true);

    mkdirSync(join(getDirectory(), 'keys'));
    writeFileSync(join(getDirectory(), 'keys', 'installation.key'), keyBytes, { mode: parseInt('644', 8) });

    prepareStateLayout(getDirectory(), join(getDirectory(), 'database'), join(getDirectory(), 'keys', 'installation.key'));

    const directoryMode: Lib_StateLayoutTest_NormalizesRawKeyBytes_DirectoryMode = (statSync(join(getDirectory(), 'keys')).mode % 512).toString(8);
    const keyMode: Lib_StateLayoutTest_NormalizesRawKeyBytes_KeyMode = (statSync(join(getDirectory(), 'keys', 'installation.key')).mode % 512).toString(8);

    expect(readFileSync(join(getDirectory(), 'keys', 'installation.key'), 'utf8')).toBe(`${keyBytes.toString('hex')}\n`);

    expect(directoryMode).toBe('700');

    expect(keyMode).toBe('600');

    return;
  });

  it('normalizes existing hexadecimal key text to lowercase with one newline', () => {
    vi.spyOn(process.stdout, 'write').mockReturnValue(true);

    mkdirSync(join(getDirectory(), 'keys'));

    writeFileSync(join(getDirectory(), 'keys', 'installation.key'), 'AB'.repeat(32));

    prepareStateLayout(getDirectory(), join(getDirectory(), 'database'), join(getDirectory(), 'keys', 'installation.key'));

    expect(readFileSync(join(getDirectory(), 'keys', 'installation.key'), 'utf8')).toBe(`${'ab'.repeat(32)}\n`);

    return;
  });

  it('leaves a flat database untouched when the existing key is invalid', () => {
    mkdirSync(join(getDirectory(), 'keys'));
    writeFileSync(join(getDirectory(), 'keys', 'installation.key'), 'not a key');
    writeFileSync(join(getDirectory(), 'outpost.sqlite3'), 'old database');

    expect(() => prepareStateLayout(getDirectory(), join(getDirectory(), 'database'), join(getDirectory(), 'keys', 'installation.key'))).toThrow('not 32 raw bytes or 64 hexadecimal characters');

    expect(readFileSync(join(getDirectory(), 'outpost.sqlite3'), 'utf8')).toBe('old database');

    expect(existsSync(join(getDirectory(), 'database', 'outpost.sqlite3'))).toBe(false);

    return;
  });

  return;
});

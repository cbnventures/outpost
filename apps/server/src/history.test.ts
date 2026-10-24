import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import {
  afterAll,
  describe,
  expect,
  it,
} from 'vitest';

import { Runner as History } from './history.js';

import type {
  History_Directory,
  History_History_KeepsTheNewestReportsAcrossRestarts_History,
  History_History_KeepsTheNewestReportsAcrossRestarts_Reloaded,
} from './types/history.test.d.ts';

/**
 * History - Directory.
 *
 * Temporary data directory standing in for the /data volume, removed
 * after the suite.
 *
 * @since 0.0.1
 */
const directory: History_Directory = mkdtempSync(join(tmpdir(), 'outpost-history-'));

/**
 * History - History.
 *
 * Checks the newest-first order, the size limit, and that a new
 * instance reads back what an earlier one saved.
 *
 * @since 0.0.1
 */
describe('history', () => {
  afterAll(() => {
    rmSync(directory, {
      recursive: true,
      force: true,
    });

    return;
  });

  it('keeps the newest reports across restarts', () => {
    const history: History_History_KeepsTheNewestReportsAcrossRestarts_History = new History(join(directory, 'nested', 'history.json'), 2);

    for (const hour of [
      '01',
      '02',
      '03',
    ]) {
      history.add({
        startedAt: `2026-10-24T${hour}:00:00.000Z`,
        finishedAt: `2026-10-24T${hour}:00:05.000Z`,
        results: [],
      });
    }

    const reloaded: History_History_KeepsTheNewestReportsAcrossRestarts_Reloaded = new History(join(directory, 'nested', 'history.json'), 2);

    expect(reloaded.list().map((report) => report['startedAt'])).toStrictEqual([
      '2026-10-24T03:00:00.000Z',
      '2026-10-24T02:00:00.000Z',
    ]);

    expect(readFileSync(join(directory, 'nested', 'history.json'), 'utf-8')).toContain('03:00:05');

    expect(new History(join(directory, 'missing.json'), 2).list()).toStrictEqual([]);

    return;
  });

  return;
});

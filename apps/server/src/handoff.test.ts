import {
  existsSync,
  mkdtempSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import {
  afterAll,
  describe,
  expect,
  it,
} from 'vitest';

import { Runner as Handoff } from './handoff.js';

import type {
  Handoff_Directory,
  Handoff_Handoff_IgnoresDamagedOrUnknownFiles_FilePath,
  Handoff_Handoff_IgnoresDamagedOrUnknownFiles_Handoff,
  Handoff_Handoff_KeepsAndSettlesAnUpdateInProgress_FilePath,
  Handoff_Handoff_KeepsAndSettlesAnUpdateInProgress_Handoff,
  Handoff_Handoff_KeepsAndSettlesAnUpdateInProgress_Pending,
} from './types/handoff.test.d.ts';

/**
 * Handoff - Directory.
 *
 * Temporary data directory for the self-update file tests. Each test run
 * gets its own folder.
 *
 * @since 1.0.0
 */
const directory: Handoff_Directory = mkdtempSync(join(tmpdir(), 'outpost-handoff-'));

/**
 * Handoff - Handoff.
 *
 * Covers the self-update file the outgoing Outpost, the helper, and the
 * Outpost running afterwards share.
 *
 * @since 1.0.0
 */
describe('handoff', () => {
  afterAll(() => {
    rmSync(directory, {
      recursive: true,
      force: true,
    });

    return;
  });

  it('keeps and settles an update in progress', () => {
    const filePath: Handoff_Handoff_KeepsAndSettlesAnUpdateInProgress_FilePath = join(directory, 'progress.json');
    const handoff: Handoff_Handoff_KeepsAndSettlesAnUpdateInProgress_Handoff = new Handoff(filePath);
    const pending: Handoff_Handoff_KeepsAndSettlesAnUpdateInProgress_Pending = {
      containerId: 'a'.repeat(64),
      containerName: 'outpost',
      deadline: '2026-10-25T04:05:00.000Z',
      helperName: 'outpost-outpost-self-update',
      newImageId: 'sha256:new',
      previousImageId: 'sha256:old',
      reference: 'cbnventures/outpost:latest',
      results: [{
        container: 'web',
        image: 'nginx:1',
        status: 'up-to-date',
        detail: 'sha256:remote',
      }],
      startedAt: '2026-10-25T04:00:00.000Z',
      trigger: 'schedule',
    };

    handoff.write({
      version: 1,
      pending,
    });

    expect(handoff.read()).toStrictEqual({
      version: 1,
      pending,
    });

    // Only Outpost's own user can read the file.
    expect(statSync(filePath)['mode'].toString(8).slice(-3)).toBe('600');

    handoff.recordOutcome({
      detail: 'Recreated with cbnventures/outpost:latest',
      finishedAt: '2026-10-25T04:01:00.000Z',
      status: 'updated',
    });

    expect(handoff.read()).toMatchObject({ pending: { outcome: { status: 'updated' } } });

    handoff.settle('sha256:new');

    expect(handoff.read()).toStrictEqual({
      version: 1,
      failedImageId: 'sha256:new',
    });

    handoff.settle(undefined);

    expect(existsSync(filePath)).toBe(false);

    expect(handoff.read()).toBeUndefined();

    return;
  });

  it('ignores damaged or unknown files', () => {
    const filePath: Handoff_Handoff_IgnoresDamagedOrUnknownFiles_FilePath = join(directory, 'damaged.json');
    const handoff: Handoff_Handoff_IgnoresDamagedOrUnknownFiles_Handoff = new Handoff(filePath);

    writeFileSync(filePath, '{ not json');

    expect(handoff.read()).toBeUndefined();

    writeFileSync(filePath, JSON.stringify({ version: 2 }));

    expect(handoff.read()).toBeUndefined();

    handoff.clear();

    // Without an update in progress, recording an outcome writes nothing.
    handoff.recordOutcome({
      detail: 'Recreated with cbnventures/outpost:latest',
      finishedAt: '2026-10-25T04:01:00.000Z',
      status: 'updated',
    });

    expect(existsSync(filePath)).toBe(false);

    return;
  });

  return;
});

import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import {
  afterAll,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { Runner as History } from './history.js';
import { Runner as Scheduler } from './scheduler.js';

import type {
  Scheduler_Directory,
  Scheduler_Scheduler_PersistsWholeCycleFailures_History,
  Scheduler_Scheduler_PersistsWholeCycleFailures_Reloaded,
  Scheduler_Scheduler_PersistsWholeCycleFailures_Scheduler,
  Scheduler_Scheduler_PersistsWholeCycleFailures_Stderr,
  Scheduler_Scheduler_ResumesAHandedOverCheckOnceAndHoldsTheLock_Finished,
  Scheduler_Scheduler_ResumesAHandedOverCheckOnceAndHoldsTheLock_Gate,
  Scheduler_Scheduler_ResumesAHandedOverCheckOnceAndHoldsTheLock_History,
  Scheduler_Scheduler_ResumesAHandedOverCheckOnceAndHoldsTheLock_Report,
  Scheduler_Scheduler_ResumesAHandedOverCheckOnceAndHoldsTheLock_Scheduler,
  Scheduler_Scheduler_ResumesAHandedOverCheckOnceAndHoldsTheLock_Stdout,
  Scheduler_Scheduler_TellsListenersWhenACheckStartsAndFinishes_Cycle,
  Scheduler_Scheduler_TellsListenersWhenACheckStartsAndFinishes_Events,
  Scheduler_Scheduler_TellsListenersWhenACheckStartsAndFinishes_History,
  Scheduler_Scheduler_TellsListenersWhenACheckStartsAndFinishes_RunCycle,
  Scheduler_Scheduler_TellsListenersWhenACheckStartsAndFinishes_Scheduler,
  Scheduler_Scheduler_TellsListenersWhenACheckStartsAndFinishes_Stdout,
  Scheduler_Scheduler_TellsListenersWhenACheckStartsAndFinishes_Unsubscribe,
} from './types/scheduler.test.d.ts';

/**
 * Scheduler - Directory.
 *
 * Temporary persistent history directory for the scheduler test.
 * Each test run receives an isolated file tree.
 *
 * @since 1.0.0
 */
const directory: Scheduler_Directory = mkdtempSync(join(tmpdir(), 'outpost-scheduler-'));

/**
 * Scheduler - Scheduler.
 *
 * Ensures a runner-level rejection cannot disappear from persistent history,
 * that each report keeps what started it, and that listeners hear each change.
 *
 * @since 1.0.0
 */
describe('scheduler', () => {
  afterAll(() => {
    rmSync(directory, {
      recursive: true,
      force: true,
    });

    return;
  });

  it('persists whole-cycle failures', async () => {
    const history: Scheduler_Scheduler_PersistsWholeCycleFailures_History = new History(join(directory, 'failures.json'), 50);
    const scheduler: Scheduler_Scheduler_PersistsWholeCycleFailures_Scheduler = new Scheduler(async () => Promise.reject(new Error('Docker socket is unreachable')), history, () => undefined);
    const stderr: Scheduler_Scheduler_PersistsWholeCycleFailures_Stderr = vi.spyOn(process.stderr, 'write').mockImplementation(() => true);

    expect(scheduler.trigger('schedule')).toBe(true);

    await vi.waitFor(() => {
      expect(scheduler.getState()['running']).toBe(false);

      return;
    });

    const reloaded: Scheduler_Scheduler_PersistsWholeCycleFailures_Reloaded = new History(join(directory, 'failures.json'), 50);

    expect(reloaded.list()[0]).toMatchObject({
      error: 'Docker socket is unreachable',
      results: [{ status: 'failed' }],
      trigger: 'schedule',
    });

    stderr.mockRestore();

    return;
  });

  it('resumes a handed-over check once and holds the lock', async () => {
    const history: Scheduler_Scheduler_ResumesAHandedOverCheckOnceAndHoldsTheLock_History = new History(join(directory, 'resume.json'), 50);
    const scheduler: Scheduler_Scheduler_ResumesAHandedOverCheckOnceAndHoldsTheLock_Scheduler = new Scheduler(async () => Promise.reject(new Error('No cycle should start while one is resumed.')), history, () => undefined);
    const stdout: Scheduler_Scheduler_ResumesAHandedOverCheckOnceAndHoldsTheLock_Stdout = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);
    const report: Scheduler_Scheduler_ResumesAHandedOverCheckOnceAndHoldsTheLock_Report = {
      startedAt: '2026-10-25T04:00:00.000Z',
      finishedAt: '2026-10-25T04:01:00.000Z',
      results: [{
        container: 'outpost',
        image: 'cbnventures/outpost:latest',
        status: 'updated',
        detail: 'Recreated with cbnventures/outpost:latest',
      }],
    };
    const gate: Scheduler_Scheduler_ResumesAHandedOverCheckOnceAndHoldsTheLock_Gate = { release: undefined };
    const finished: Scheduler_Scheduler_ResumesAHandedOverCheckOnceAndHoldsTheLock_Finished = new Promise((resolve) => {
      Reflect.set(gate, 'release', resolve);

      return;
    });

    expect(scheduler.resume('schedule', report['startedAt'], async () => {
      await finished;

      return report;
    })).toBe(true);

    expect(scheduler.getState()).toMatchObject({
      running: true,
      startedAt: '2026-10-25T04:00:00.000Z',
    });

    expect(scheduler.trigger('api')).toBe(false);

    if (gate['release'] !== undefined) {
      gate.release();
    }

    await vi.waitFor(() => {
      expect(scheduler.getState()['running']).toBe(false);

      return;
    });

    // Finishing the same check again, as after another restart, doesn't record it twice.
    expect(scheduler.resume('schedule', report['startedAt'], async () => report)).toBe(true);

    await vi.waitFor(() => {
      expect(scheduler.getState()['running']).toBe(false);

      return;
    });

    expect(history.list()).toHaveLength(1);

    expect(history.list()[0]).toMatchObject({
      startedAt: '2026-10-25T04:00:00.000Z',
      trigger: 'schedule',
    });

    stdout.mockRestore();

    return;
  });

  it('tells listeners when a check starts and finishes', async () => {
    const history: Scheduler_Scheduler_TellsListenersWhenACheckStartsAndFinishes_History = new History(join(directory, 'listeners.json'), 50);
    const runCycle: Scheduler_Scheduler_TellsListenersWhenACheckStartsAndFinishes_RunCycle = vi.fn<Scheduler_Scheduler_TellsListenersWhenACheckStartsAndFinishes_Cycle>(async () => ({
      startedAt: '2026-10-25T04:00:00.000Z',
      finishedAt: '2026-10-25T04:00:05.000Z',
      results: [{
        container: 'web',
        image: 'nginx:1',
        status: 'updated',
        detail: 'Recreated with nginx:1',
      }],
    }));
    const scheduler: Scheduler_Scheduler_TellsListenersWhenACheckStartsAndFinishes_Scheduler = new Scheduler(runCycle, history, () => undefined);
    const events: Scheduler_Scheduler_TellsListenersWhenACheckStartsAndFinishes_Events = [];
    const stdout: Scheduler_Scheduler_TellsListenersWhenACheckStartsAndFinishes_Stdout = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);

    // A listener that throws, like a closed stream, must not stop the listeners after it or the check.
    scheduler.subscribe((event) => {
      if (event['type'] === 'check') {
        throw new Error('The stream is closed.');
      }

      return;
    });

    const unsubscribe: Scheduler_Scheduler_TellsListenersWhenACheckStartsAndFinishes_Unsubscribe = scheduler.subscribe((event) => {
      events.push(event);

      return;
    });

    expect(scheduler.trigger('dashboard', ['aaaaaaaaaaaa'])).toBe(true);

    expect(scheduler.trigger('api')).toBe(false);

    expect(scheduler.getState()['running']).toBe(true);

    expect(events).toStrictEqual([{ type: 'state' }]);

    await vi.waitFor(() => {
      expect(scheduler.getState()['running']).toBe(false);

      return;
    });

    expect(runCycle).toHaveBeenCalledExactlyOnceWith(['aaaaaaaaaaaa'], 'dashboard');

    expect(events).toStrictEqual([
      { type: 'state' },
      {
        type: 'check',
        report: {
          startedAt: '2026-10-25T04:00:00.000Z',
          finishedAt: '2026-10-25T04:00:05.000Z',
          results: [{
            container: 'web',
            image: 'nginx:1',
            status: 'updated',
            detail: 'Recreated with nginx:1',
          }],
          trigger: 'dashboard',
        },
      },
      { type: 'state' },
    ]);

    expect(scheduler.getState()).toMatchObject({
      lastReport: { trigger: 'dashboard' },
      totals: {
        cycles: 1,
        updated: 1,
        failed: 0,
      },
    });

    unsubscribe();

    expect(scheduler.trigger('schedule')).toBe(true);

    await vi.waitFor(() => {
      expect(scheduler.getState()['running']).toBe(false);

      return;
    });

    expect(events).toHaveLength(3);

    expect(history.list().map((report) => report['trigger'])).toStrictEqual([
      'schedule',
      'dashboard',
    ]);

    stdout.mockRestore();

    return;
  });

  return;
});

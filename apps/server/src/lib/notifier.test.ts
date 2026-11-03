import {
  mkdtempSync,
  rmSync,
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

import { Runner as Notifier } from './notifier.js';
import { Runner as State } from './state.js';

import type {
  Lib_Notifier_DataDirectory,
  Lib_Notifier_GetDataDirectory_Returns,
  Lib_Notifier_UpdateReportsAndAlerts_ReportsALockedAddressOncePerWindow_Notifier,
  Lib_Notifier_UpdateReportsAndAlerts_ReportsALockedAddressOncePerWindow_Send,
  Lib_Notifier_UpdateReportsAndAlerts_ReportsALockedAddressOncePerWindow_State,
  Lib_Notifier_UpdateReportsAndAlerts_ReportsSecretsALostKeyRemoved_Notifier,
  Lib_Notifier_UpdateReportsAndAlerts_ReportsSecretsALostKeyRemoved_Send,
  Lib_Notifier_UpdateReportsAndAlerts_ReportsSecretsALostKeyRemoved_State,
  Lib_Notifier_UpdateReportsAndAlerts_ReportsWhatAnUpdateCheckDidOncePerKindOfResult_Notifier,
  Lib_Notifier_UpdateReportsAndAlerts_ReportsWhatAnUpdateCheckDidOncePerKindOfResult_Send,
  Lib_Notifier_UpdateReportsAndAlerts_ReportsWhatAnUpdateCheckDidOncePerKindOfResult_State,
  Lib_Notifier_UpdateReportsAndAlerts_StopsDestinationLookupFailuresFromReachingCallers_Lookup,
  Lib_Notifier_UpdateReportsAndAlerts_StopsDestinationLookupFailuresFromReachingCallers_Notifier,
  Lib_Notifier_UpdateReportsAndAlerts_StopsDestinationLookupFailuresFromReachingCallers_State,
  Lib_Notifier_UpdateReportsAndAlerts_StopsDestinationLookupFailuresFromReachingCallers_Stderr,
} from '../types/lib/notifier.test.d.ts';

/**
 * Lib - Notifier - Data Directory.
 *
 * Points each test at its own operating-system temporary directory.
 * Cleanup never targets a repository or shared application directory.
 *
 * @since 1.0.0
 */
let dataDirectory: Lib_Notifier_DataDirectory = undefined;

/**
 * Lib - Notifier - Get Data Directory.
 *
 * Narrows the lifecycle-owned temporary path before a test uses it.
 * A missing setup hook fails loudly instead of falling back to a shared path.
 *
 * @returns {Lib_Notifier_GetDataDirectory_Returns}
 *
 * @since 1.0.0
 */
function getDataDirectory(): Lib_Notifier_GetDataDirectory_Returns {
  if (dataDirectory === undefined) {
    throw new Error('The notifier test data directory is not initialized.');
  }

  return dataDirectory;
}

/**
 * Lib - Notifier - Update Reports And Alerts.
 *
 * Checks that an update check turns into at most one notification per kind of result,
 * and that lockouts and a lost key reach only the destinations that chose them.
 *
 * @since 1.0.0
 */
describe('update reports and alerts', () => {
  beforeEach(() => {
    dataDirectory = mkdtempSync(join(tmpdir(), 'outpost-notifier-'));

    return;
  });

  afterEach(() => {
    rmSync(getDataDirectory(), {
      force: true,
      recursive: true,
    });

    dataDirectory = undefined;

    return;
  });

  it('reports what an update check did once per kind of result', async () => {
    const state: Lib_Notifier_UpdateReportsAndAlerts_ReportsWhatAnUpdateCheckDidOncePerKindOfResult_State = new State(getDataDirectory());
    const send: Lib_Notifier_UpdateReportsAndAlerts_ReportsWhatAnUpdateCheckDidOncePerKindOfResult_Send = vi.fn(async () => ({ delivered: true as const }));
    const notifier: Lib_Notifier_UpdateReportsAndAlerts_ReportsWhatAnUpdateCheckDidOncePerKindOfResult_Notifier = new Notifier(state, { send });

    state.createNotificationTarget({
      events: [
        'updates-applied',
        'updates-available',
        'update-failed',
      ],
      name: 'Phone',
      secrets: {},
      service: 'ntfy',
      settings: { url: 'https://ntfy.sh/outpost-updates' },
    });

    notifier.notifyUpdateReport({
      finishedAt: '2026-10-26T04:00:30.000Z',
      results: [{
        container: 'web',
        detail: 'sha256:1',
        image: 'nginx:1',
        status: 'up-to-date',
      }],
      startedAt: '2026-10-26T04:00:00.000Z',
    });

    notifier.notifyUpdateReport({
      finishedAt: '2026-10-26T04:01:00.000Z',
      results: [
        {
          container: 'pihole',
          detail: 'Updated to sha256:2.',
          image: 'pihole/pihole:latest',
          status: 'updated',
        },
        {
          container: 'homeassistant',
          detail: 'Updated to sha256:3.',
          image: 'ghcr.io/home-assistant/home-assistant:stable',
          status: 'updated',
        },
        {
          container: 'plex',
          detail: 'sha256:4 is available.',
          image: 'plexinc/pms-docker:latest',
          status: 'available',
        },
        {
          container: 'grafana',
          detail: 'The new container exited with code 1.',
          image: 'grafana/grafana:11',
          status: 'rolled-back',
        },
      ],
      startedAt: '2026-10-26T04:00:00.000Z',
    });

    await vi.waitFor(() => {
      expect(send).toHaveBeenCalledTimes(3);

      return;
    });

    expect(send).toHaveBeenNthCalledWith(1, {
      key: 'outpost',
      name: 'Outpost',
    }, expect.objectContaining({ service: 'ntfy' }), expect.objectContaining({
      event: 'updates-applied',
      message: 'Updated 2 containers: pihole (pihole/pihole:latest), homeassistant (ghcr.io/home-assistant/home-assistant:stable).',
      title: 'Containers updated',
    }));

    expect(send).toHaveBeenNthCalledWith(2, expect.anything(), expect.anything(), expect.objectContaining({
      event: 'updates-available',
      message: 'New images are ready for 1 container: plex (plexinc/pms-docker:latest).',
    }));

    expect(send).toHaveBeenNthCalledWith(3, expect.anything(), expect.anything(), expect.objectContaining({
      event: 'update-failed',
      message: 'Couldn\'t update 1 container: grafana (grafana/grafana:11) was rolled back: The new container exited with code 1.',
      priority: 'high',
    }));

    notifier.notifyUpdateReport({
      error: 'Docker socket is unreachable',
      finishedAt: '2026-10-26T05:00:01.000Z',
      results: [{
        container: 'Outpost',
        detail: 'Update cycle failed: Docker socket is unreachable',
        image: 'update cycle',
        status: 'failed',
      }],
      startedAt: '2026-10-26T05:00:00.000Z',
    });

    await vi.waitFor(() => {
      expect(send).toHaveBeenCalledTimes(4);

      return;
    });

    expect(send).toHaveBeenLastCalledWith(expect.anything(), expect.anything(), expect.objectContaining({
      event: 'update-failed',
      message: 'The update check couldn\'t run: Docker socket is unreachable',
    }));

    state.close();

    return;
  });

  it('reports a locked address once per window', async () => {
    const state: Lib_Notifier_UpdateReportsAndAlerts_ReportsALockedAddressOncePerWindow_State = new State(getDataDirectory());
    const send: Lib_Notifier_UpdateReportsAndAlerts_ReportsALockedAddressOncePerWindow_Send = vi.fn(async () => ({ delivered: true as const }));
    const notifier: Lib_Notifier_UpdateReportsAndAlerts_ReportsALockedAddressOncePerWindow_Notifier = new Notifier(state, { send });

    state.createNotificationTarget({
      events: ['sign-in-locked'],
      name: 'Phone',
      secrets: {},
      service: 'ntfy',
      settings: { url: 'https://ntfy.sh/outpost-updates' },
    });

    notifier.notifySignInLimit('setup:198.51.100.7');

    notifier.notifySignInLimit('sign-in:198.51.100.7');

    notifier.notifySignInLimit('sign-in:198.51.100.7');

    await vi.waitFor(() => {
      expect(send).toHaveBeenCalledTimes(1);

      return;
    });

    expect(send).toHaveBeenCalledWith(expect.anything(), expect.anything(), expect.objectContaining({
      event: 'sign-in-locked',
      message: 'Ten failed sign-ins from 198.51.100.7. Sign-in from it is paused for 15 minutes.',
    }));

    state.close();

    return;
  });

  it('reports secrets a lost key removed', async () => {
    const state: Lib_Notifier_UpdateReportsAndAlerts_ReportsSecretsALostKeyRemoved_State = new State(getDataDirectory());
    const send: Lib_Notifier_UpdateReportsAndAlerts_ReportsSecretsALostKeyRemoved_Send = vi.fn(async () => ({ delivered: true as const }));
    const notifier: Lib_Notifier_UpdateReportsAndAlerts_ReportsSecretsALostKeyRemoved_Notifier = new Notifier(state, { send });

    state.createNotificationTarget({
      events: ['secrets-removed'],
      name: 'Phone',
      secrets: {},
      service: 'ntfy',
      settings: { url: 'https://ntfy.sh/outpost-updates' },
    });

    notifier.notifySecretsRemoved([]);

    notifier.notifySecretsRemoved(['the Homelab chat notification']);

    await vi.waitFor(() => {
      expect(send).toHaveBeenCalledTimes(1);

      return;
    });

    expect(send).toHaveBeenCalledWith(expect.anything(), expect.anything(), expect.objectContaining({
      event: 'secrets-removed',
      message: expect.stringContaining('the Homelab chat notification'),
    }));

    state.close();

    return;
  });

  it('stops destination lookup failures from reaching callers', () => {
    const state: Lib_Notifier_UpdateReportsAndAlerts_StopsDestinationLookupFailuresFromReachingCallers_State = new State(getDataDirectory());
    const lookup: Lib_Notifier_UpdateReportsAndAlerts_StopsDestinationLookupFailuresFromReachingCallers_Lookup = vi.spyOn(state, 'getNotificationDeliveries').mockImplementation(() => expect.unreachable('The destination row is damaged.'));
    const stderr: Lib_Notifier_UpdateReportsAndAlerts_StopsDestinationLookupFailuresFromReachingCallers_Stderr = vi.spyOn(process.stderr, 'write').mockImplementation(() => true);
    const notifier: Lib_Notifier_UpdateReportsAndAlerts_StopsDestinationLookupFailuresFromReachingCallers_Notifier = new Notifier(state);

    expect(() => notifier.notifySignInLimit('sign-in:198.51.100.7')).not.toThrow();

    expect(() => notifier.notifyUpdateReport({
      finishedAt: '2026-10-27T04:00:30.000Z',
      results: [{
        container: 'grafana',
        detail: 'The replacement stopped.',
        image: 'grafana/grafana:latest',
        status: 'failed',
      }],
      startedAt: '2026-10-27T04:00:00.000Z',
    })).not.toThrow();

    expect(stderr).toHaveBeenCalledTimes(2);

    expect(stderr).toHaveBeenCalledWith(expect.stringContaining('Notification destinations could not be loaded'));

    lookup.mockRestore();

    stderr.mockRestore();

    state.close();

    return;
  });

  return;
});

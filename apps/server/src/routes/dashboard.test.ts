import {
  describe,
  expect,
  it,
} from 'vitest';

import { loadConfig } from '../config.js';
import { buildContainerRows, buildSettings } from './dashboard.js';

import type {
  Routes_Dashboard_BuildContainerRows_ManagesOutpostItselfAndExplainsAutomaticRemoval_Containers,
  Routes_Dashboard_BuildContainerRows_ManagesOutpostItselfAndExplainsAutomaticRemoval_Rows,
  Routes_Dashboard_BuildContainerRows_MarksManagedAndExcludedContainers_Rows,
  Routes_Dashboard_BuildSettings_KeepsRuntimeAndSystemConfigSeparate_Settings,
  Routes_Dashboard_BuildSettings_KeepsRuntimeAndSystemConfigSeparate_TimeZone,
} from '../types/routes/dashboard.test.d.ts';

/**
 * Routes - Dashboard - Build Container Rows.
 *
 * Checks the managed flag, the explanatory note, and that the last
 * report's result is attached to the right container.
 *
 * @since 0.0.1
 */
describe('buildContainerRows', () => {
  it('marks managed and excluded containers', () => {
    const rows: Routes_Dashboard_BuildContainerRows_MarksManagedAndExcludedContainers_Rows = buildContainerRows([
      {
        Id: 'aaaaaaaaaaaa1111',
        Names: ['/web'],
        Image: 'nginx:1',
        ImageID: 'sha256:1',
        Labels: {},
        HostConfig: {
          NetworkMode: 'bridge',
          AutoRemove: false,
        },
        State: 'running',
      },
      {
        Id: 'bbbbbbbbbbbb2222',
        Names: ['/db'],
        Image: 'postgres:17',
        ImageID: 'sha256:2',
        Labels: { 'io.cbnventures.outpost.enable': 'false' },
        HostConfig: {
          NetworkMode: 'bridge',
          AutoRemove: false,
        },
        State: 'running',
      },
      {
        Id: 'cccccccccccc3333',
        Names: ['/pinned'],
        Image: 'redis:7',
        ImageID: 'sha256:3',
        Labels: {},
        HostConfig: {
          NetworkMode: 'bridge',
          AutoRemove: false,
        },
        State: 'running',
      },
      {
        Id: 'dddddddddddd4444',
        Names: ['/shared'],
        Image: 'example/shared:1',
        ImageID: 'sha256:4',
        Labels: {},
        HostConfig: {
          NetworkMode: 'container:outside',
          AutoRemove: false,
        },
        State: 'running',
      },
    ], {
      labelMode: 'opt-out',
      selfId: undefined,
      monitorOnly: false,
    }, [
      {
        startedAt: '2026-10-24T05:00:00.000Z',
        finishedAt: '2026-10-24T05:00:05.000Z',
        results: [{
          container: 'db',
          image: 'postgres:17',
          status: 'up-to-date',
          detail: 'sha256:db',
        }],
        trigger: 'schedule',
      },
      {
        startedAt: '2026-10-24T04:00:00.000Z',
        finishedAt: '2026-10-24T04:00:05.000Z',
        results: [{
          container: 'web',
          image: 'nginx:1',
          status: 'updated',
          detail: 'Recreated with nginx:1',
        }],
      },
    ], [
      {
        Id: 'aaaaaaaaaaaa1111',
        Name: '/web',
        Image: 'sha256:1',
        Config: { Image: 'nginx:1' },
        HostConfig: {
          NetworkMode: 'bridge',
          AutoRemove: false,
        },
        NetworkSettings: { Networks: { bridge: {} } },
        Mounts: [],
        State: {
          Running: true,
          Status: 'running',
        },
      },
      {
        Id: 'bbbbbbbbbbbb2222',
        Name: '/db',
        Image: 'sha256:2',
        Config: { Image: 'postgres:17' },
        HostConfig: {
          NetworkMode: 'bridge',
          AutoRemove: false,
        },
        NetworkSettings: { Networks: { bridge: {} } },
        Mounts: [],
        State: {
          Running: true,
          Status: 'running',
        },
      },
      {
        Id: 'cccccccccccc3333',
        Name: '/pinned',
        Image: 'sha256:3',
        Config: { Image: 'redis@sha256:abc' },
        HostConfig: {
          NetworkMode: 'bridge',
          AutoRemove: false,
        },
        NetworkSettings: { Networks: { bridge: {} } },
        Mounts: [],
        State: {
          Running: true,
          Status: 'running',
        },
      },
      {
        Id: 'dddddddddddd4444',
        Name: '/shared',
        Image: 'sha256:4',
        Config: { Image: 'example/shared:1' },
        HostConfig: {
          NetworkMode: 'container:outside',
          AutoRemove: false,
        },
        NetworkSettings: { Networks: {} },
        Mounts: [],
        State: {
          Running: true,
          Status: 'running',
        },
      },
    ]);

    expect(rows.map((row) => [
      row['name'],
      row['managed'],
      row['note'],
      row['lastStatus'],
      row['lastCheckedAt'],
    ])).toStrictEqual([
      [
        'db',
        false,
        'Opted out by label',
        'up-to-date',
        '2026-10-24T05:00:05.000Z',
      ],
      [
        'pinned',
        false,
        'Pinned image',
        undefined,
        undefined,
      ],
      [
        'shared',
        false,
        'Shared network namespace',
        undefined,
        undefined,
      ],
      [
        'web',
        true,
        'Managed',
        'updated',
        '2026-10-24T04:00:05.000Z',
      ],
    ]);

    return;
  });

  it('manages Outpost itself and explains automatic removal', () => {
    const containers: Routes_Dashboard_BuildContainerRows_ManagesOutpostItselfAndExplainsAutomaticRemoval_Containers = [
      {
        Id: 'eeeeeeeeeeee5555',
        Names: ['/outpost'],
        Image: 'ghcr.io/cbnventures/outpost:latest',
        ImageID: 'sha256:5',
        Labels: {},
        HostConfig: {
          NetworkMode: 'bridge',
          AutoRemove: false,
        },
        State: 'running',
      },
      {
        Id: 'ffffffffffff6666',
        Names: ['/cleanup'],
        Image: 'alpine:3',
        ImageID: 'sha256:6',
        Labels: {},
        HostConfig: {
          NetworkMode: 'bridge',
          AutoRemove: true,
        },
        State: 'running',
      },
    ];
    const rows: Routes_Dashboard_BuildContainerRows_ManagesOutpostItselfAndExplainsAutomaticRemoval_Rows = buildContainerRows(containers, {
      labelMode: 'opt-out',
      selfId: 'eeeeeeeeeeee',
      monitorOnly: true,
    }, [], []);
    const unknownSelfRows: Routes_Dashboard_BuildContainerRows_ManagesOutpostItselfAndExplainsAutomaticRemoval_Rows = buildContainerRows(containers, {
      labelMode: 'opt-out',
      selfId: undefined,
      monitorOnly: false,
    }, [], []);

    expect(rows.map((row) => [
      row['name'],
      row['managed'],
      row['note'],
      row['self'],
      row['monitorOnly'],
    ])).toStrictEqual([
      [
        'cleanup',
        false,
        'Automatic removal enabled',
        false,
        true,
      ],
      [
        'outpost',
        true,
        'Managed',
        true,
        true,
      ],
    ]);

    expect(unknownSelfRows.find((row) => row['name'] === 'outpost')).toMatchObject({
      managed: false,
      note: 'Outpost container',
      self: false,
    });

    return;
  });

  return;
});

/**
 * Routes - Dashboard - Build Settings.
 *
 * Ensures editable behavior stays separate from bootstrap paths.
 * This keeps the public response safe for both the dashboard and scoped API clients.
 *
 * @since 1.0.0
 */
describe('buildSettings', () => {
  it('keeps runtime and system config separate', () => {
    const settings: Routes_Dashboard_BuildSettings_KeepsRuntimeAndSystemConfigSeparate_Settings = buildSettings(loadConfig({
      DOCKER_HOST: 'tcp://docker:2375',
      OUTPOST_DATA_DIRECTORY: '/var/lib/outpost',
    }));

    // The schedule runs in the time zone of this process, which TZ sets.
    const timeZone: Routes_Dashboard_BuildSettings_KeepsRuntimeAndSystemConfigSeparate_TimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    expect(settings).toEqual({
      runtime: {
        cleanup: true,
        healthTimeoutSeconds: 120,
        labelMode: 'opt-out',
        monitorOnly: false,
        runOnStart: false,
        schedule: '0 0 4 * * *',
        settleSeconds: 10,
        stopTimeoutSeconds: 30,
      },
      system: {
        dataDirectory: '/var/lib/outpost',
        dockerHost: 'tcp://docker:2375',
        timeZone,
      },
    });

    return;
  });

  return;
});

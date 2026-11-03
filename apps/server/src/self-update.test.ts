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

import { Runner as Handoff } from './handoff.js';
import {
  finishSelfUpdate,
  handOver,
  HELPER_LABEL,
  planHelper,
  removeExitedHelpers,
} from './self-update.js';

import type {
  SelfUpdate_CreateContext_Clock,
  SelfUpdate_CreateContext_FileName,
  SelfUpdate_CreateContext_HelperExitCode,
  SelfUpdate_CreateContext_Returns,
  SelfUpdate_Directory,
  SelfUpdate_FinishSelfUpdate_FinishesAnUpdateAndRemovesThePreviousImage_Context,
  SelfUpdate_FinishSelfUpdate_FinishesAnUpdateAndRemovesThePreviousImage_Report,
  SelfUpdate_FinishSelfUpdate_KeepsTheHelperWhenItNeverFinished_Context,
  SelfUpdate_FinishSelfUpdate_KeepsTheHelperWhenItNeverFinished_Report,
  SelfUpdate_FinishSelfUpdate_RemembersAnImageThatWasRolledBack_Context,
  SelfUpdate_FinishSelfUpdate_RemembersAnImageThatWasRolledBack_Report,
  SelfUpdate_HandOver_HandsOverAndReportsAHelperThatStopsEarly_Context,
  SelfUpdate_HandOver_HandsOverAndReportsAHelperThatStopsEarly_Pending,
  SelfUpdate_HandOver_HandsOverAndReportsAHelperThatStopsEarly_Result,
  SelfUpdate_HandOver_SkipsAnImageThatFailedToStartLastTime_Context,
  SelfUpdate_HandOver_SkipsAnImageThatFailedToStartLastTime_Result,
  SelfUpdate_OutpostContainer,
  SelfUpdate_Pending,
  SelfUpdate_PlanHelper_PlansAHelperWithTheDataAndSocketMounts_Plan,
  SelfUpdate_PlanHelper_RefusesWithoutADataVolumeOrSocketMount_WithoutData,
  SelfUpdate_PlanHelper_RefusesWithoutADataVolumeOrSocketMount_WithoutSocket,
  SelfUpdate_RemoveExitedHelpers_RemovesOnlyStoppedHelpers_Engine,
  SelfUpdate_Request,
  SelfUpdate_Settings,
} from './types/self-update.test.d.ts';

/**
 * Self Update - Directory.
 *
 * Temporary data directory for the self-update tests. Each context gets
 * its own self-update file inside it.
 *
 * @since 1.0.0
 */
const directory: SelfUpdate_Directory = mkdtempSync(join(tmpdir(), 'outpost-self-update-'));

/**
 * Self Update - Settings.
 *
 * Outpost on the default socket with its data on a volume, running as
 * 1000:1000 with the socket's group 999.
 *
 * @since 1.0.0
 */
const settings: SelfUpdate_Settings = {
  cleanup: true,
  dataDirectory: '/data',
  dockerHost: 'unix:///var/run/docker.sock',
  healthTimeoutSeconds: 120,
  identity: {
    gid: 1000,
    groups: [
      1000,
      999,
    ],
    uid: 1000,
  },
  stopTimeoutSeconds: 30,
};

/**
 * Self Update - Outpost Container.
 *
 * Outpost's own container as Docker reports it, from a Compose project
 * with a data volume and the Docker socket mounted.
 *
 * @since 1.0.0
 */
const outpostContainer: SelfUpdate_OutpostContainer = {
  Id: 'a'.repeat(64),
  Name: '/outpost',
  Image: 'sha256:old',
  Config: {
    Image: 'cbnventures/outpost:latest',
    Env: [
      'TZ=UTC',
      'OUTPOST_SELF_UPDATE_REFERENCE=stale',
    ],
  },
  HostConfig: { NetworkMode: 'outpost_default' },
  NetworkSettings: { Networks: { outpost_default: {} } },
  Mounts: [
    {
      Type: 'volume',
      Name: 'outpost_outpost-data',
      Source: '/var/lib/docker/volumes/outpost_outpost-data/_data',
      Destination: '/data',
      RW: true,
    },
    {
      Type: 'bind',
      Source: '/var/run/docker.sock',
      Destination: '/var/run/docker.sock',
      RW: true,
    },
  ],
  State: {
    Running: true,
    Status: 'running',
  },
};

/**
 * Self Update - Request.
 *
 * Outpost's turn in a check, after "web" was found up to date
 * earlier in the same check.
 *
 * @since 1.0.0
 */
const request: SelfUpdate_Request = {
  container: outpostContainer,
  newImageId: 'sha256:new',
  reference: 'cbnventures/outpost:latest',
  results: [{
    container: 'web',
    image: 'nginx:1',
    status: 'up-to-date',
    detail: 'sha256:remote',
  }],
  startedAt: '2026-10-25T04:00:00.000Z',
};

/**
 * Self Update - Pending.
 *
 * The same check as saved in the self-update file for the Outpost
 * running after the swap.
 *
 * @since 1.0.0
 */
const pending: SelfUpdate_Pending = {
  containerId: 'a'.repeat(64),
  containerName: 'outpost',
  deadline: '2026-10-25T04:05:00.000Z',
  helperName: 'outpost-outpost-self-update',
  newImageId: 'sha256:new',
  previousImageId: 'sha256:old',
  reference: 'cbnventures/outpost:latest',
  results: request['results'],
  startedAt: '2026-10-25T04:00:00.000Z',
  trigger: 'schedule',
};

/**
 * Self Update - Create Context.
 *
 * Builds a fake engine, a real self-update file, and a clock that moves on
 * every sleep. The helper reports the given exit code, or is gone.
 *
 * @param {SelfUpdate_CreateContext_FileName}       fileName       - File name.
 * @param {SelfUpdate_CreateContext_HelperExitCode} helperExitCode - Helper exit code.
 *
 * @returns {SelfUpdate_CreateContext_Returns}
 *
 * @since 1.0.0
 */
function createContext(fileName: SelfUpdate_CreateContext_FileName, helperExitCode: SelfUpdate_CreateContext_HelperExitCode): SelfUpdate_CreateContext_Returns {
  let clock: SelfUpdate_CreateContext_Clock = Date.parse('2026-10-25T04:00:00.000Z');

  return {
    engine: {
      createContainer: vi.fn(async () => 'helper-id'),
      inspectContainer: vi.fn(async (id) => {
        if (helperExitCode === undefined) {
          throw new Error(`No such container: ${id}`);
        }

        return {
          ...outpostContainer,
          Id: id,
          State: {
            Running: false,
            Status: 'exited',
            ExitCode: helperExitCode,
          },
        };
      }),
      removeContainer: vi.fn(async () => undefined),
      removeImage: vi.fn(async () => true),
      startContainer: vi.fn(async () => undefined),
      stopContainer: vi.fn(async () => undefined),
    },
    handoff: new Handoff(join(directory, fileName)),
    now: () => new Date(clock),
    settings,
    sleep: vi.fn(async (milliseconds) => {
      clock += milliseconds;

      return;
    }),
  };
}

/**
 * Self Update - Self Update.
 *
 * Covers the helper plan, the hand-over in the outgoing Outpost, and the
 * finishing step in the Outpost running afterwards.
 *
 * @since 1.0.0
 */
describe('self update', () => {
  afterAll(() => {
    rmSync(directory, {
      recursive: true,
      force: true,
    });

    return;
  });

  it('plans a helper with the data and socket mounts', () => {
    const plan: SelfUpdate_PlanHelper_PlansAHelperWithTheDataAndSocketMounts_Plan = planHelper(outpostContainer, 'cbnventures/outpost:latest', settings);

    expect(plan).toStrictEqual({
      name: 'outpost-outpost-self-update',
      body: {
        Image: 'sha256:old',
        Entrypoint: [
          'node',
          'build/self-update-helper.js',
        ],
        Cmd: [],
        WorkingDir: '/app/apps/server',
        User: '1000:1000',
        Env: [
          'TZ=UTC',
          `OUTPOST_SELF_UPDATE_CONTAINER=${'a'.repeat(64)}`,
          'OUTPOST_SELF_UPDATE_REFERENCE=cbnventures/outpost:latest',
        ],
        Labels: {
          'io.cbnventures.outpost.enable': 'false',
          [HELPER_LABEL]: 'a'.repeat(64),
        },
        Healthcheck: { Test: ['NONE'] },
        HostConfig: {
          AutoRemove: false,
          Binds: [
            'outpost_outpost-data:/data',
            '/var/run/docker.sock:/var/run/docker.sock',
          ],
          GroupAdd: ['999'],
          Init: true,
          NetworkMode: 'outpost_default',
          RestartPolicy: { Name: 'no' },
        },
      },
    });

    return;
  });

  it('refuses without a data volume or socket mount', () => {
    const withoutData: SelfUpdate_PlanHelper_RefusesWithoutADataVolumeOrSocketMount_WithoutData = planHelper({
      ...outpostContainer,
      Mounts: [],
    }, 'cbnventures/outpost:latest', settings);
    const withoutSocket: SelfUpdate_PlanHelper_RefusesWithoutADataVolumeOrSocketMount_WithoutSocket = planHelper({
      ...outpostContainer,
      Mounts: (outpostContainer['Mounts'] ?? []).filter((mount) => mount['Destination'] === '/data'),
    }, 'cbnventures/outpost:latest', settings);

    expect(withoutData).toBe('Outpost can\'t update itself because /data isn\'t on a volume, so its account and history would be lost');

    expect(withoutSocket).toBe('Outpost can\'t update itself because the Docker socket at /var/run/docker.sock isn\'t mounted from the host');

    return;
  });

  it('hands over and reports a helper that stops early', async () => {
    const context: SelfUpdate_HandOver_HandsOverAndReportsAHelperThatStopsEarly_Context = createContext('early.json', 1);
    let savedPending: SelfUpdate_HandOver_HandsOverAndReportsAHelperThatStopsEarly_Pending = undefined;

    // The helper fails before it stops Outpost, so this process lives to read what it wrote.
    context['engine']['startContainer'].mockImplementation(async () => {
      savedPending = (context['handoff'].read() ?? { version: 1 })['pending'];

      context['handoff'].recordOutcome({
        detail: 'Conflict: the container name "/outpost-outpost-previous" is already in use',
        finishedAt: '2026-10-25T04:00:02.000Z',
        status: 'failed',
      });

      return;
    });

    const result: SelfUpdate_HandOver_HandsOverAndReportsAHelperThatStopsEarly_Result = await handOver(request, 'schedule', context);

    expect(savedPending).toMatchObject({
      containerName: 'outpost',
      helperName: 'outpost-outpost-self-update',
      results: request['results'],
      startedAt: '2026-10-25T04:00:00.000Z',
      trigger: 'schedule',
    });

    expect(result).toStrictEqual({
      container: 'outpost',
      image: 'cbnventures/outpost:latest',
      status: 'failed',
      detail: 'Conflict: the container name "/outpost-outpost-previous" is already in use',
    });

    expect(context['engine']['removeContainer']).toHaveBeenLastCalledWith('helper-id');

    expect(context['handoff'].read()).toBeUndefined();

    return;
  });

  it('skips an image that failed to start last time', async () => {
    const context: SelfUpdate_HandOver_SkipsAnImageThatFailedToStartLastTime_Context = createContext('skipped.json', 0);

    context['handoff'].write({
      version: 1,
      failedImageId: 'sha256:new',
    });

    const result: SelfUpdate_HandOver_SkipsAnImageThatFailedToStartLastTime_Result = await handOver(request, 'schedule', context);

    expect(result).toMatchObject({
      status: 'skipped',
      detail: 'The new image (new) didn\'t start last time, so Outpost waits for a newer one',
    });

    expect(context['engine']['createContainer']).not.toHaveBeenCalled();

    return;
  });

  it('finishes an update and removes the previous image', async () => {
    const context: SelfUpdate_FinishSelfUpdate_FinishesAnUpdateAndRemovesThePreviousImage_Context = createContext('updated.json', 0);

    context['handoff'].write({
      version: 1,
      pending: {
        ...pending,
        outcome: {
          detail: 'Recreated with cbnventures/outpost:latest',
          finishedAt: '2026-10-25T04:01:00.000Z',
          status: 'updated',
        },
      },
    });

    const report: SelfUpdate_FinishSelfUpdate_FinishesAnUpdateAndRemovesThePreviousImage_Report = await finishSelfUpdate(pending, context);

    expect(report).toStrictEqual({
      startedAt: '2026-10-25T04:00:00.000Z',
      finishedAt: '2026-10-25T04:01:00.000Z',
      results: [
        ...request['results'],
        {
          container: 'outpost',
          image: 'cbnventures/outpost:latest',
          status: 'updated',
          detail: 'Recreated with cbnventures/outpost:latest',
        },
      ],
    });

    expect(context['engine']['removeContainer']).toHaveBeenCalledWith('outpost-outpost-self-update');

    expect(context['engine']['removeImage']).toHaveBeenCalledWith('sha256:old');

    expect(context['handoff'].read()).toBeUndefined();

    return;
  });

  it('remembers an image that was rolled back', async () => {
    const context: SelfUpdate_FinishSelfUpdate_RemembersAnImageThatWasRolledBack_Context = createContext('rolled-back.json', 1);

    context['handoff'].write({
      version: 1,
      pending: {
        ...pending,
        outcome: {
          detail: 'New container is unhealthy; rolled back to the previous container',
          finishedAt: '2026-10-25T04:02:00.000Z',
          status: 'rolled-back',
        },
      },
    });

    const report: SelfUpdate_FinishSelfUpdate_RemembersAnImageThatWasRolledBack_Report = await finishSelfUpdate(pending, context);

    expect(report['results'].at(-1)).toMatchObject({
      status: 'rolled-back',
      detail: 'New container is unhealthy; rolled back to the previous container',
    });

    expect(context['engine']['removeImage']).not.toHaveBeenCalled();

    expect(context['handoff'].read()).toStrictEqual({
      version: 1,
      failedImageId: 'sha256:new',
    });

    return;
  });

  it('keeps the helper when it never finished', async () => {
    const context: SelfUpdate_FinishSelfUpdate_KeepsTheHelperWhenItNeverFinished_Context = createContext('unfinished.json', undefined);

    context['handoff'].write({
      version: 1,
      pending,
    });

    const report: SelfUpdate_FinishSelfUpdate_KeepsTheHelperWhenItNeverFinished_Report = await finishSelfUpdate(pending, context);

    expect(report['results'].at(-1)).toMatchObject({
      status: 'failed',
      detail: 'The self-update helper stopped before it finished; see docker logs outpost-outpost-self-update',
    });

    expect(context['engine']['removeContainer']).not.toHaveBeenCalled();

    expect(context['handoff'].read()).toBeUndefined();

    return;
  });

  it('removes only stopped helpers', async () => {
    const engine: SelfUpdate_RemoveExitedHelpers_RemovesOnlyStoppedHelpers_Engine = {
      listContainersByLabel: vi.fn(async () => [
        {
          Id: 'stopped-helper',
          Names: ['/outpost-outpost-self-update'],
          Image: 'sha256:old',
          ImageID: 'sha256:old',
          Labels: { [HELPER_LABEL]: 'a'.repeat(64) },
          State: 'exited',
        },
        {
          Id: 'running-helper',
          Names: ['/other-outpost-self-update'],
          Image: 'sha256:old',
          ImageID: 'sha256:old',
          Labels: { [HELPER_LABEL]: 'b'.repeat(64) },
          State: 'running',
        },
      ]),
      removeContainer: vi.fn(async () => undefined),
    };

    await removeExitedHelpers(engine);

    expect(engine['listContainersByLabel']).toHaveBeenCalledWith(HELPER_LABEL);

    expect(engine['removeContainer']).toHaveBeenCalledExactlyOnceWith('stopped-helper');

    return;
  });

  return;
});

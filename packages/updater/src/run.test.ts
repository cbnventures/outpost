import {
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { runUpdateCycle } from './run.js';

import type {
  Run_CreateDependencies_Clock,
  Run_CreateDependencies_Returns,
  Run_CreateDependencies_RunningAfterStart,
  Run_CreateDependencies_State,
  Run_FetchFunction,
  Run_InspectContainer,
  Run_InspectImage,
  Run_Options,
  Run_RunUpdateCycle_RollsBackWhenTheNewContainerStops_Dependencies,
  Run_RunUpdateCycle_RollsBackWhenTheNewContainerStops_Report,
  Run_RunUpdateCycle_SkipsPullingWhenTheDigestMatches_Dependencies,
  Run_RunUpdateCycle_SkipsPullingWhenTheDigestMatches_Report,
  Run_RunUpdateCycle_UpdatesAndCleansUpWhenANewImageExists_Dependencies,
  Run_RunUpdateCycle_UpdatesAndCleansUpWhenANewImageExists_Report,
  Run_Sleep,
} from './types/run.test.d.ts';

/**
 * Run - Options.
 *
 * Update everything, clean up old images, and use a short settle period
 * so the fake clock finishes quickly.
 *
 * @since 0.0.1
 */
const options: Run_Options = {
  labelMode: 'opt-out',
  monitorOnly: false,
  cleanup: true,
  stopTimeoutSeconds: 10,
  healthTimeoutSeconds: 30,
  settleSeconds: 2,
  selfId: undefined,
  dockerConfigPath: '/nonexistent/config.json',
  notificationTargets: {
    ntfyUrl: 'https://ntfy.test/outpost',
    ntfyToken: undefined,
    webhookUrl: undefined,
  },
};

/**
 * Run - Create Dependencies.
 *
 * Builds a fake engine with one running "web" container, a registry that
 * reports the given digest, and a clock that advances on every sleep.
 *
 * @param {Run_CreateDependencies_State}             state             - State.
 * @param {Run_CreateDependencies_RunningAfterStart} runningAfterStart - Running after start.
 *
 * @returns {Run_CreateDependencies_Returns}
 *
 * @since 0.0.1
 */
function createDependencies(state: Run_CreateDependencies_State, runningAfterStart: Run_CreateDependencies_RunningAfterStart): Run_CreateDependencies_Returns {
  let clock: Run_CreateDependencies_Clock = 0;

  return {
    engine: {
      listContainers: vi.fn(async () => [{
        Id: 'old-id',
        Names: ['/web'],
        Image: 'nginx:1',
        ImageID: 'sha256:old',
        Labels: {},
        State: 'running',
      }]),
      inspectContainer: vi.fn<Run_InspectContainer>(async (id) => ({
        Id: id,
        Name: '/web',
        Image: 'sha256:old',
        Config: { Image: 'nginx:1' },
        HostConfig: { NetworkMode: 'bridge' },
        NetworkSettings: { Networks: { bridge: {} } },
        Mounts: [],
        State: {
          Running: id === 'old-id' || runningAfterStart === true,
          Status: (id === 'old-id' || runningAfterStart === true) ? 'running' : 'exited',
        },
      })),
      inspectImage: vi.fn<Run_InspectImage>(async (reference) => ({
        Id: (reference === 'sha256:old') ? 'sha256:old' : 'sha256:new',
        RepoDigests: (reference === 'sha256:old') ? [`nginx@${state['localDigest']}`] : ['nginx@sha256:remote'],
        Config: {},
      })),
      pullImage: vi.fn(async () => undefined),
      stopContainer: vi.fn(async () => undefined),
      startContainer: vi.fn(async () => undefined),
      renameContainer: vi.fn(async () => undefined),
      removeContainer: vi.fn(async () => undefined),
      createContainer: vi.fn(async () => 'new-id'),
      connectNetwork: vi.fn(async () => undefined),
      removeImage: vi.fn(async () => true),
    },
    fetchFunction: vi.fn<Run_FetchFunction>(async (input) => {
      if (input.startsWith('https://registry-1.docker.io') === true) {
        return new Response(null, { headers: { 'Docker-Content-Digest': 'sha256:remote' } });
      }

      return new Response('ok');
    }),
    sleep: vi.fn<Run_Sleep>(async (milliseconds) => {
      clock += milliseconds;

      return;
    }),
    now: () => new Date(Date.parse('2026-10-24T00:00:00.000Z') + clock),
    findCredentials: () => undefined,
  };
}

/**
 * Run - Update Cycle.
 *
 * Exercises the full cycle against the fake engine: up to date, updated
 * with cleanup, and rolled back after the new container stops.
 *
 * @since 0.0.1
 */
describe('runUpdateCycle', () => {
  it('skips pulling when the digest matches', async () => {
    const dependencies: Run_RunUpdateCycle_SkipsPullingWhenTheDigestMatches_Dependencies = createDependencies({ localDigest: 'sha256:remote' }, true);
    const report: Run_RunUpdateCycle_SkipsPullingWhenTheDigestMatches_Report = await runUpdateCycle(options, dependencies);

    expect(report['results'].map((result) => result['status'])).toStrictEqual(['up-to-date']);

    expect(dependencies['engine']['pullImage']).not.toHaveBeenCalled();

    return;
  });

  it('updates and cleans up when a new image exists', async () => {
    const dependencies: Run_RunUpdateCycle_UpdatesAndCleansUpWhenANewImageExists_Dependencies = createDependencies({ localDigest: 'sha256:local' }, true);
    const report: Run_RunUpdateCycle_UpdatesAndCleansUpWhenANewImageExists_Report = await runUpdateCycle(options, dependencies);

    expect(report['results'].map((result) => result['status'])).toStrictEqual(['updated']);

    expect(dependencies['engine']['removeContainer']).toHaveBeenCalledWith('old-id');

    expect(dependencies['engine']['removeImage']).toHaveBeenCalledWith('sha256:old');

    expect(dependencies['fetchFunction']).toHaveBeenCalledWith('https://ntfy.test/outpost', expect.objectContaining({ method: 'POST' }));

    return;
  });

  it('rolls back when the new container stops', async () => {
    const dependencies: Run_RunUpdateCycle_RollsBackWhenTheNewContainerStops_Dependencies = createDependencies({ localDigest: 'sha256:local' }, false);
    const report: Run_RunUpdateCycle_RollsBackWhenTheNewContainerStops_Report = await runUpdateCycle(options, dependencies);

    expect(report['results'].map((result) => result['status'])).toStrictEqual(['rolled-back']);

    expect(dependencies['engine']['removeContainer']).toHaveBeenCalledWith('new-id');

    expect(dependencies['engine']['renameContainer']).toHaveBeenLastCalledWith('old-id', 'web');

    expect(dependencies['engine']['startContainer']).toHaveBeenLastCalledWith('old-id');

    expect(dependencies['engine']['removeImage']).not.toHaveBeenCalled();

    return;
  });

  return;
});

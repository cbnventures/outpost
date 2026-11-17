import {
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { runUpdateCycle } from './run.js';

import type {
  Run_CreateDependencies_Clock,
  Run_CreateDependencies_IsCreated,
  Run_CreateDependencies_NewInspectCount,
  Run_CreateDependencies_Returns,
  Run_CreateDependencies_RunningAfterStart,
  Run_CreateDependencies_State,
  Run_CreateSelfDependencies_Clock,
  Run_CreateSelfDependencies_Returns,
  Run_CreateSelfDependencies_WithUpdateSelf,
  Run_FetchFunction,
  Run_InspectContainer,
  Run_InspectImage,
  Run_Options,
  Run_RunUpdateCycle_BypassesARolledBackImageOnlyWithoutRollback_Dependencies,
  Run_RunUpdateCycle_BypassesARolledBackImageOnlyWithoutRollback_Report,
  Run_RunUpdateCycle_ChecksPulledImagesOnTheContainerdImageStore_Dependencies,
  Run_RunUpdateCycle_ChecksPulledImagesOnTheContainerdImageStore_OlderDependencies,
  Run_RunUpdateCycle_ChecksPulledImagesOnTheContainerdImageStore_OlderReport,
  Run_RunUpdateCycle_ChecksPulledImagesOnTheContainerdImageStore_Report,
  Run_RunUpdateCycle_ChecksPulledImagesOnTheContainerdImageStore_RolledBackDependencies,
  Run_RunUpdateCycle_ChecksPulledImagesOnTheContainerdImageStore_RolledBackReport,
  Run_RunUpdateCycle_ChecksPulledImagesOnTheContainerdImageStore_UntaggedDependencies,
  Run_RunUpdateCycle_ChecksPulledImagesOnTheContainerdImageStore_UntaggedReport,
  Run_RunUpdateCycle_ChecksWithoutPullingOrRecreating_Dependencies,
  Run_RunUpdateCycle_ChecksWithoutPullingOrRecreating_Report,
  Run_RunUpdateCycle_HandsOutpostToUpdateSelfAfterTheOtherContainers_Dependencies,
  Run_RunUpdateCycle_HandsOutpostToUpdateSelfAfterTheOtherContainers_Report,
  Run_RunUpdateCycle_HoldsARejectedImageDuringChecks_Dependencies,
  Run_RunUpdateCycle_HoldsARejectedImageDuringChecks_Report,
  Run_RunUpdateCycle_KeepsAnUnhealthyReplacementWhenTheOldContainerWasUnhealthy_Dependencies,
  Run_RunUpdateCycle_KeepsAnUnhealthyReplacementWhenTheOldContainerWasUnhealthy_Report,
  Run_RunUpdateCycle_KeepsAnUnhealthyReplacementWithoutRollback_Dependencies,
  Run_RunUpdateCycle_KeepsAnUnhealthyReplacementWithoutRollback_Report,
  Run_RunUpdateCycle_KeepsAReplacementWhoseHealthcheckAnswersAfterTheTimeout_Dependencies,
  Run_RunUpdateCycle_KeepsAReplacementWhoseHealthcheckAnswersAfterTheTimeout_Report,
  Run_RunUpdateCycle_KeepsCheckingPulledImagesThatTheRegistryTurnsAway_Dependencies,
  Run_RunUpdateCycle_KeepsCheckingPulledImagesThatTheRegistryTurnsAway_Report,
  Run_RunUpdateCycle_LooksUpEachRegistrySignInOncePerCycle_Dependencies,
  Run_RunUpdateCycle_RefusesDisabledRollbackForOutpost_Dependencies,
  Run_RunUpdateCycle_RefusesDisabledRollbackForOutpost_Report,
  Run_RunUpdateCycle_RemembersAnImageThatRollsBack_Dependencies,
  Run_RunUpdateCycle_RemembersAnImageThatRollsBack_Report,
  Run_RunUpdateCycle_ReportsACycleFailure_Dependencies,
  Run_RunUpdateCycle_ReportsACycleFailure_Report,
  Run_RunUpdateCycle_ReportsMissingImageMetadata_Dependencies,
  Run_RunUpdateCycle_ReportsMissingImageMetadata_Report,
  Run_RunUpdateCycle_ReportsUpdatedWhenCleanupFails_Dependencies,
  Run_RunUpdateCycle_ReportsUpdatedWhenCleanupFails_Report,
  Run_RunUpdateCycle_RollsBackAnUnhealthyReplacementOfAHealthyContainer_Dependencies,
  Run_RunUpdateCycle_RollsBackAnUnhealthyReplacementOfAHealthyContainer_Report,
  Run_RunUpdateCycle_RollsBackAReplacementStillStartingWhenItsHealthcheckShouldHaveAnswered_Dependencies,
  Run_RunUpdateCycle_RollsBackAReplacementStillStartingWhenItsHealthcheckShouldHaveAnswered_Report,
  Run_RunUpdateCycle_RollsBackWhenTheNewContainerStops_Dependencies,
  Run_RunUpdateCycle_RollsBackWhenTheNewContainerStops_Report,
  Run_RunUpdateCycle_RollsBackWhenTheReplacementRestarts_Dependencies,
  Run_RunUpdateCycle_RollsBackWhenTheReplacementRestarts_Report,
  Run_RunUpdateCycle_SkipsAnImageThatWasRolledBack_Dependencies,
  Run_RunUpdateCycle_SkipsAnImageThatWasRolledBack_Report,
  Run_RunUpdateCycle_SkipsImagesOfUnknownOriginThatTheRegistryLacks_Dependencies,
  Run_RunUpdateCycle_SkipsImagesOfUnknownOriginThatTheRegistryLacks_RefusedDependencies,
  Run_RunUpdateCycle_SkipsImagesOfUnknownOriginThatTheRegistryLacks_RefusedReport,
  Run_RunUpdateCycle_SkipsImagesOfUnknownOriginThatTheRegistryLacks_Report,
  Run_RunUpdateCycle_SkipsImagesThatDockerBuiltOnThisHost_ClassicDependencies,
  Run_RunUpdateCycle_SkipsImagesThatDockerBuiltOnThisHost_ClassicReport,
  Run_RunUpdateCycle_SkipsImagesThatDockerBuiltOnThisHost_Dependencies,
  Run_RunUpdateCycle_SkipsImagesThatDockerBuiltOnThisHost_Report,
  Run_RunUpdateCycle_SkipsOutpostWhenNothingCanUpdateIt_Dependencies,
  Run_RunUpdateCycle_SkipsOutpostWhenNothingCanUpdateIt_Report,
  Run_RunUpdateCycle_SkipsPullingWhenTheDigestMatches_Dependencies,
  Run_RunUpdateCycle_SkipsPullingWhenTheDigestMatches_Report,
  Run_RunUpdateCycle_UpdatesAndCleansUpWhenANewImageExists_Dependencies,
  Run_RunUpdateCycle_UpdatesAndCleansUpWhenANewImageExists_Report,
  Run_RunUpdateCycle_UsesCachedImageDefaults_CreateBody,
  Run_RunUpdateCycle_UsesCachedImageDefaults_CreateCall,
  Run_RunUpdateCycle_UsesCachedImageDefaults_Dependencies,
  Run_RunUpdateCycle_UsesCachedImageDefaults_Report,
  Run_Sleep,
  Run_UpdateSelf,
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
};

/**
 * Run - Create Dependencies.
 *
 * Builds a fake engine with one running "web" container, a registry that
 * answers as the state says, and a clock that advances on every sleep.
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
  let newInspectCount: Run_CreateDependencies_NewInspectCount = 0;

  return {
    engine: {
      listContainers: vi.fn(async () => {
        if (state['listError'] !== undefined) {
          throw state['listError'];
        }

        return [{
          Id: 'old-id',
          Names: ['/web'],
          Image: 'nginx:1',
          ImageID: 'sha256:old',
          Labels: {},
          HostConfig: {
            NetworkMode: 'bridge',
            AutoRemove: false,
          },
          State: 'running',
        }];
      }),
      inspectContainer: vi.fn<Run_InspectContainer>(async (id) => {
        if (id === 'web-outpost-previous') {
          throw new Error(`Docker Engine API returned HTTP 404: No such container: ${id}`);
        }

        if (id === 'new-id') {
          const isCreated: Run_CreateDependencies_IsCreated = newInspectCount === 0;

          newInspectCount += 1;

          return {
            Id: id,
            Name: '/web',
            Image: 'sha256:new',
            Config: {
              Image: 'nginx:1',
              ...((state['newHealthcheck'] !== undefined) ? { Healthcheck: state['newHealthcheck'] } : {}),
            },
            HostConfig: {
              NetworkMode: 'bridge',
              AutoRemove: false,
            },
            NetworkSettings: { Networks: { bridge: {} } },
            Mounts: [],
            RestartCount: (isCreated === true) ? 0 : (state['newRestartCount'] ?? 0),
            State: {
              Running: (isCreated === false) && runningAfterStart === true,
              Restarting: (isCreated === false) && state['newRestarting'] === true,
              Status: (isCreated === true) ? 'created' : (state['newStatus'] ?? ((runningAfterStart === true) ? 'running' : 'exited')),
              ...((isCreated === false && state['newHealth'] !== undefined) ? { Health: { Status: state['newHealth'] } } : {}),
            },
          };
        }

        return {
          Id: id,
          Name: '/web',
          Image: 'sha256:old',
          Config: state['currentContainerConfig'] ?? { Image: 'nginx:1' },
          HostConfig: {
            NetworkMode: 'bridge',
            AutoRemove: false,
          },
          NetworkSettings: { Networks: { bridge: {} } },
          Mounts: [],
          RestartCount: 0,
          State: {
            Running: true,
            Restarting: false,
            Status: 'running',
            ...((state['oldHealth'] !== undefined) ? { Health: { Status: state['oldHealth'] } } : {}),
          },
        };
      }),
      inspectImage: vi.fn<Run_InspectImage>(async (reference) => {
        if (reference === 'sha256:old' && state['currentImageMissing'] === true) {
          return undefined;
        }

        return {
          Id: (reference === 'sha256:old') ? 'sha256:old' : 'sha256:new',
          RepoDigests: (reference === 'sha256:old') ? (state['currentRepoDigests'] ?? [`nginx@${state['localDigest']}`]) : ['nginx@sha256:remote'],
          Config: (reference === 'sha256:old') ? (state['currentImageConfig'] ?? {}) : (state['newImageConfig'] ?? {}),
          ...((reference === 'sha256:old' && state['identity'] !== undefined) ? { Identity: state['identity'] } : {}),
          ...((reference === 'sha256:old' && state['descriptor'] === true) ? { Descriptor: { digest: 'sha256:old' } } : {}),
        };
      }),
      pullImage: vi.fn(async () => undefined),
      stopContainer: vi.fn(async () => undefined),
      startContainer: vi.fn(async () => undefined),
      renameContainer: vi.fn(async () => undefined),
      removeContainer: vi.fn(async () => undefined),
      createContainer: vi.fn(async () => 'new-id'),
      connectNetwork: vi.fn(async () => undefined),
      removeImage: vi.fn(async () => {
        if (state['cleanupError'] !== undefined) {
          throw state['cleanupError'];
        }

        return true;
      }),
    },
    fetchFunction: vi.fn<Run_FetchFunction>(async (input) => {
      if (input.startsWith('https://registry-1.docker.io') === true) {
        return new Response(null, {
          status: state['remoteStatus'] ?? 200,
          headers: { 'Docker-Content-Digest': state['remoteDigest'] ?? 'sha256:remote' },
        });
      }

      return new Response('ok');
    }),
    sleep: vi.fn<Run_Sleep>(async (milliseconds) => {
      clock += milliseconds;

      return;
    }),
    now: () => new Date(Date.parse('2026-10-24T00:00:00.000Z') + clock),
    findCredentials: vi.fn(() => undefined),
    findRejectedImage: vi.fn(() => undefined),
    rememberRejectedImage: vi.fn(() => undefined),
    forgetRejectedImage: vi.fn(() => undefined),
    findImageConfig: vi.fn(() => undefined),
    rememberImageConfig: vi.fn(() => undefined),
    pruneImageConfigs: vi.fn(async () => undefined),
  };
}

/**
 * Run - Create Self Dependencies.
 *
 * Builds a fake engine listing Outpost's own container before an
 * up-to-date "web" container, with a newer Outpost image in the registry.
 *
 * @param {Run_CreateSelfDependencies_WithUpdateSelf} withUpdateSelf - With update self.
 *
 * @returns {Run_CreateSelfDependencies_Returns}
 *
 * @since 1.0.0
 */
function createSelfDependencies(withUpdateSelf: Run_CreateSelfDependencies_WithUpdateSelf): Run_CreateSelfDependencies_Returns {
  let clock: Run_CreateSelfDependencies_Clock = 0;

  return {
    engine: {
      listContainers: vi.fn(async () => [
        {
          Id: 'self-id',
          Names: ['/outpost'],
          Image: 'cbnventures/outpost:latest',
          ImageID: 'sha256:outpost-old',
          Labels: {},
          State: 'running',
        },
        {
          Id: 'web-id',
          Names: ['/web'],
          Image: 'nginx:1',
          ImageID: 'sha256:web',
          Labels: {},
          State: 'running',
        },
      ]),
      inspectContainer: vi.fn<Run_InspectContainer>(async (id) => ({
        Id: id,
        Name: (id === 'self-id') ? '/outpost' : '/web',
        Image: (id === 'self-id') ? 'sha256:outpost-old' : 'sha256:web',
        Config: { Image: (id === 'self-id') ? 'cbnventures/outpost:latest' : 'nginx:1' },
        HostConfig: { NetworkMode: 'bridge' },
        NetworkSettings: { Networks: { bridge: {} } },
        Mounts: [],
        State: {
          Running: true,
          Status: 'running',
        },
      })),
      inspectImage: vi.fn<Run_InspectImage>(async (reference) => {
        if (reference === 'sha256:outpost-old') {
          return {
            Id: 'sha256:outpost-old',
            RepoDigests: ['cbnventures/outpost@sha256:outpost-local'],
            Config: {},
          };
        }

        if (reference === 'cbnventures/outpost:latest') {
          return {
            Id: 'sha256:outpost-new',
            RepoDigests: ['cbnventures/outpost@sha256:outpost-remote'],
            Config: {},
          };
        }

        return {
          Id: 'sha256:web',
          RepoDigests: ['nginx@sha256:web-remote'],
          Config: {},
        };
      }),
      pullImage: vi.fn(async () => undefined),
      stopContainer: vi.fn(async () => undefined),
      startContainer: vi.fn(async () => undefined),
      renameContainer: vi.fn(async () => undefined),
      removeContainer: vi.fn(async () => undefined),
      createContainer: vi.fn(async () => 'new-id'),
      connectNetwork: vi.fn(async () => undefined),
      removeImage: vi.fn(async () => true),
    },
    fetchFunction: vi.fn<Run_FetchFunction>(async (input) => new Response(null, { headers: { 'Docker-Content-Digest': (input.includes('cbnventures/outpost') === true) ? 'sha256:outpost-remote' : 'sha256:web-remote' } })),
    sleep: vi.fn<Run_Sleep>(async (milliseconds) => {
      clock += milliseconds;

      return;
    }),
    now: () => new Date(Date.parse('2026-10-24T00:00:00.000Z') + clock),
    findCredentials: vi.fn(() => undefined),
    findRejectedImage: vi.fn(() => undefined),
    rememberRejectedImage: vi.fn(() => undefined),
    forgetRejectedImage: vi.fn(() => undefined),
    findImageConfig: vi.fn(() => undefined),
    rememberImageConfig: vi.fn(() => undefined),
    pruneImageConfigs: vi.fn(async () => undefined),
    ...((withUpdateSelf === true) ? {
      updateSelf: vi.fn<Run_UpdateSelf>(async (request) => ({
        container: 'outpost',
        image: request['reference'],
        status: 'updated',
        detail: 'Handed to the self-update helper',
      })),
    } : {}),
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
  it('checks without pulling or recreating', async () => {
    const dependencies: Run_RunUpdateCycle_ChecksWithoutPullingOrRecreating_Dependencies = createSelfDependencies(true);
    const report: Run_RunUpdateCycle_ChecksWithoutPullingOrRecreating_Report = await runUpdateCycle({
      ...options,
      selfId: 'self-id',
    }, dependencies, undefined, 'check');

    expect(report['results']).toMatchObject([
      { status: 'up-to-date' },
      {
        status: 'available',
        detail: 'New digest sha256:outpost-remote',
      },
    ]);

    expect(dependencies['fetchFunction']).toHaveBeenCalled();

    expect(dependencies['engine']['pullImage']).not.toHaveBeenCalled();

    expect(dependencies['engine']['stopContainer']).not.toHaveBeenCalled();

    expect(dependencies['engine']['startContainer']).not.toHaveBeenCalled();

    expect(dependencies['engine']['renameContainer']).not.toHaveBeenCalled();

    expect(dependencies['engine']['removeContainer']).not.toHaveBeenCalled();

    expect(dependencies['engine']['createContainer']).not.toHaveBeenCalled();

    expect(dependencies['engine']['connectNetwork']).not.toHaveBeenCalled();

    expect(dependencies['engine']['removeImage']).not.toHaveBeenCalled();

    expect(dependencies['updateSelf']).not.toHaveBeenCalled();

    return;
  });

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

    return;
  });

  it('uses cached image defaults when Docker removed the old image record', async () => {
    const dependencies: Run_RunUpdateCycle_UsesCachedImageDefaults_Dependencies = createDependencies({
      currentContainerConfig: {
        Image: 'nginx:1',
        Cmd: ['old-default'],
        Env: [
          'IMAGE_DEFAULT=old',
          'USER_OVERRIDE=kept',
        ],
        Labels: {
          'io.example.default': 'old',
          'io.example.user': 'kept',
        },
        User: 'old-user',
      },
      currentImageMissing: true,
      localDigest: 'sha256:local',
    }, true);

    dependencies['findImageConfig'].mockReturnValue({
      Cmd: ['old-default'],
      Env: ['IMAGE_DEFAULT=old'],
      Labels: { 'io.example.default': 'old' },
      User: 'old-user',
    });

    const report: Run_RunUpdateCycle_UsesCachedImageDefaults_Report = await runUpdateCycle(options, dependencies);
    const createCall: Run_RunUpdateCycle_UsesCachedImageDefaults_CreateCall = dependencies['engine']['createContainer'].mock.calls.at(0);

    if (createCall === undefined) {
      throw new Error('The replacement container was not created.');
    }

    const createBody: Run_RunUpdateCycle_UsesCachedImageDefaults_CreateBody = createCall[1];

    expect(report['results']).toMatchObject([{
      status: 'updated',
      detail: expect.not.stringContaining('previous image metadata was unavailable'),
    }]);

    expect(createBody['Env']).toStrictEqual(['USER_OVERRIDE=kept']);

    expect(createBody['Labels']).toStrictEqual({ 'io.example.user': 'kept' });

    expect(createBody).not.toHaveProperty('Cmd');

    expect(createBody).not.toHaveProperty('User');

    expect(dependencies['findImageConfig']).toHaveBeenCalledWith('sha256:old');

    return;
  });

  it('reports when live and cached image metadata are both unavailable', async () => {
    const dependencies: Run_RunUpdateCycle_ReportsMissingImageMetadata_Dependencies = createDependencies({
      currentImageMissing: true,
      localDigest: 'sha256:local',
    }, true);
    const report: Run_RunUpdateCycle_ReportsMissingImageMetadata_Report = await runUpdateCycle(options, dependencies);

    expect(report['results']).toMatchObject([{
      status: 'updated',
      detail: expect.stringContaining('(previous image metadata was unavailable, so its defaults were carried over)'),
    }]);

    return;
  });

  it('rolls back when the new container stops', async () => {
    const dependencies: Run_RunUpdateCycle_RollsBackWhenTheNewContainerStops_Dependencies = createDependencies({ localDigest: 'sha256:local' }, false);
    const report: Run_RunUpdateCycle_RollsBackWhenTheNewContainerStops_Report = await runUpdateCycle(options, dependencies, undefined, 'update', true);

    expect(report['results'].map((result) => result['status'])).toStrictEqual(['rolled-back']);

    expect(dependencies['engine']['removeContainer']).toHaveBeenCalledWith('new-id');

    expect(dependencies['engine']['renameContainer']).toHaveBeenLastCalledWith('old-id', 'web');

    expect(dependencies['engine']['startContainer']).toHaveBeenLastCalledWith('old-id');

    expect(dependencies['engine']['removeImage']).not.toHaveBeenCalled();

    return;
  });

  it('keeps an unhealthy replacement without rollback', async () => {
    const dependencies: Run_RunUpdateCycle_KeepsAnUnhealthyReplacementWithoutRollback_Dependencies = createDependencies({
      localDigest: 'sha256:local',
      newHealth: 'unhealthy',
      oldHealth: 'healthy',
    }, true);
    const report: Run_RunUpdateCycle_KeepsAnUnhealthyReplacementWithoutRollback_Report = await runUpdateCycle(options, dependencies, ['old-id'], 'update', false);

    expect(report['results']).toMatchObject([{
      status: 'kept-unhealthy',
      detail: expect.stringContaining('rollback was disabled for this run'),
    }]);

    expect(report['results']).toMatchObject([{
      detail: expect.stringContaining('previous image ID: sha256:old'),
    }]);

    expect(report['results']).toMatchObject([{
      detail: expect.stringContaining('"configuredImage":"nginx:1"'),
    }]);

    expect(dependencies['engine']['removeContainer']).not.toHaveBeenCalled();

    expect(dependencies['engine']['startContainer']).toHaveBeenCalledExactlyOnceWith('new-id');

    expect(dependencies['engine']['removeImage']).not.toHaveBeenCalled();

    expect(dependencies['rememberRejectedImage']).toHaveBeenCalledWith('web', 'sha256:new');

    return;
  });

  it('rolls back when the replacement restarts', async () => {
    const dependencies: Run_RunUpdateCycle_RollsBackWhenTheReplacementRestarts_Dependencies = createDependencies({
      localDigest: 'sha256:local',
      newRestartCount: 1,
    }, true);
    const report: Run_RunUpdateCycle_RollsBackWhenTheReplacementRestarts_Report = await runUpdateCycle(options, dependencies);

    expect(report['results']).toMatchObject([{
      status: 'rolled-back',
      detail: expect.stringContaining('restart count rose from 0 to 1'),
    }]);

    expect(dependencies['engine']['removeImage']).not.toHaveBeenCalled();

    return;
  });

  it('keeps a replacement whose healthcheck answers after the timeout', async () => {
    // Like an image that checks its health every 15 minutes, which a 30-second timeout can never wait for.
    const dependencies: Run_RunUpdateCycle_KeepsAReplacementWhoseHealthcheckAnswersAfterTheTimeout_Dependencies = createDependencies({
      localDigest: 'sha256:local',
      oldHealth: 'starting',
      newHealth: 'starting',
      newHealthcheck: {
        Test: [
          'CMD-SHELL',
          'curl http://127.0.0.1/health',
        ],
        Interval: 900_000_000_000,
        StartPeriod: 5_000_000_000,
      },
    }, true);
    const report: Run_RunUpdateCycle_KeepsAReplacementWhoseHealthcheckAnswersAfterTheTimeout_Report = await runUpdateCycle(options, dependencies);

    expect(report['results']).toMatchObject([{
      status: 'updated',
      detail: expect.stringContaining('first answers about 905s after start, past the 30s health timeout'),
    }]);

    expect(dependencies['engine']['removeContainer']).toHaveBeenCalledWith('old-id');

    return;
  });

  it('rolls back a replacement still starting when its healthcheck should have answered', async () => {
    const dependencies: Run_RunUpdateCycle_RollsBackAReplacementStillStartingWhenItsHealthcheckShouldHaveAnswered_Dependencies = createDependencies({
      localDigest: 'sha256:local',
      newHealth: 'starting',
      newHealthcheck: {
        Test: [
          'CMD-SHELL',
          'curl http://127.0.0.1/health',
        ],
        Interval: 10_000_000_000,
      },
    }, true);
    const report: Run_RunUpdateCycle_RollsBackAReplacementStillStartingWhenItsHealthcheckShouldHaveAnswered_Report = await runUpdateCycle(options, dependencies);

    expect(report['results']).toMatchObject([{
      status: 'rolled-back',
      detail: expect.stringContaining('did not become healthy within 30s'),
    }]);

    return;
  });

  it('keeps an unhealthy replacement when the old container was unhealthy', async () => {
    const dependencies: Run_RunUpdateCycle_KeepsAnUnhealthyReplacementWhenTheOldContainerWasUnhealthy_Dependencies = createDependencies({
      localDigest: 'sha256:local',
      oldHealth: 'unhealthy',
      newHealth: 'unhealthy',
    }, true);
    const report: Run_RunUpdateCycle_KeepsAnUnhealthyReplacementWhenTheOldContainerWasUnhealthy_Report = await runUpdateCycle(options, dependencies);

    expect(report['results']).toMatchObject([{
      status: 'updated',
      detail: expect.stringContaining('kept while unhealthy'),
    }]);

    expect(dependencies['engine']['removeContainer']).toHaveBeenCalledWith('old-id');

    expect(dependencies['forgetRejectedImage']).toHaveBeenCalledWith('web');

    return;
  });

  it('rolls back an unhealthy replacement of a healthy container', async () => {
    const dependencies: Run_RunUpdateCycle_RollsBackAnUnhealthyReplacementOfAHealthyContainer_Dependencies = createDependencies({
      localDigest: 'sha256:local',
      oldHealth: 'healthy',
      newHealth: 'unhealthy',
    }, true);
    const report: Run_RunUpdateCycle_RollsBackAnUnhealthyReplacementOfAHealthyContainer_Report = await runUpdateCycle(options, dependencies);

    expect(report['results']).toMatchObject([{
      status: 'rolled-back',
      detail: expect.stringContaining('New container is unhealthy'),
    }]);

    return;
  });

  it('remembers an image that rolls back', async () => {
    const dependencies: Run_RunUpdateCycle_RemembersAnImageThatRollsBack_Dependencies = createDependencies({ localDigest: 'sha256:local' }, false);
    const report: Run_RunUpdateCycle_RemembersAnImageThatRollsBack_Report = await runUpdateCycle(options, dependencies);

    expect(report['results'].map((result) => result['status'])).toStrictEqual(['rolled-back']);

    expect(dependencies['rememberRejectedImage']).toHaveBeenCalledWith('web', 'sha256:new');

    expect(dependencies['forgetRejectedImage']).not.toHaveBeenCalled();

    return;
  });

  it('holds an image that was rolled back during an update', async () => {
    const dependencies: Run_RunUpdateCycle_SkipsAnImageThatWasRolledBack_Dependencies = createDependencies({ localDigest: 'sha256:local' }, true);

    dependencies['findRejectedImage'].mockReturnValue({
      imageId: 'sha256:new',
      rejectedAt: '2026-10-23T04:00:00.000Z',
    });

    const report: Run_RunUpdateCycle_SkipsAnImageThatWasRolledBack_Report = await runUpdateCycle(options, dependencies);

    expect(report['results']).toMatchObject([{
      status: 'held',
      detail: expect.stringContaining('Rolled back last time; waiting for a newer image'),
    }]);

    expect(dependencies['engine']['stopContainer']).not.toHaveBeenCalled();

    expect(dependencies['engine']['pullImage']).not.toHaveBeenCalled();

    return;
  });

  it('holds a rejected remote image during checks without pulling it', async () => {
    const dependencies: Run_RunUpdateCycle_HoldsARejectedImageDuringChecks_Dependencies = createDependencies({ localDigest: 'sha256:local' }, true);

    dependencies['findRejectedImage'].mockReturnValue({
      imageId: 'sha256:new',
      rejectedAt: '2026-10-23T04:00:00.000Z',
    });

    const report: Run_RunUpdateCycle_HoldsARejectedImageDuringChecks_Report = await runUpdateCycle(options, dependencies, undefined, 'check');

    expect(report['results']).toMatchObject([{
      status: 'held',
      detail: expect.stringContaining('Update this container with rollback disabled'),
    }]);

    expect(dependencies['engine']['inspectImage']).toHaveBeenCalledWith('nginx:1');

    expect(dependencies['engine']['pullImage']).not.toHaveBeenCalled();

    expect(dependencies['engine']['stopContainer']).not.toHaveBeenCalled();

    return;
  });

  it('bypasses a rolled-back image only without rollback', async () => {
    const dependencies: Run_RunUpdateCycle_BypassesARolledBackImageOnlyWithoutRollback_Dependencies = createDependencies({ localDigest: 'sha256:local' }, true);
    const overrideDependencies: Run_RunUpdateCycle_BypassesARolledBackImageOnlyWithoutRollback_Dependencies = createDependencies({ localDigest: 'sha256:local' }, true);

    dependencies['findRejectedImage'].mockReturnValue({
      imageId: 'sha256:new',
      rejectedAt: '2026-10-23T04:00:00.000Z',
    });

    overrideDependencies['findRejectedImage'].mockReturnValue({
      imageId: 'sha256:new',
      rejectedAt: '2026-10-23T04:00:00.000Z',
    });

    const report: Run_RunUpdateCycle_BypassesARolledBackImageOnlyWithoutRollback_Report = await runUpdateCycle(options, dependencies, ['old-id']);
    const overrideReport: Run_RunUpdateCycle_BypassesARolledBackImageOnlyWithoutRollback_Report = await runUpdateCycle(options, overrideDependencies, ['old-id'], 'update', false);

    expect(report['results'].map((result) => result['status'])).toStrictEqual(['held']);

    expect(dependencies['engine']['stopContainer']).not.toHaveBeenCalled();

    expect(overrideReport['results'].map((result) => result['status'])).toStrictEqual(['updated']);

    expect(overrideDependencies['forgetRejectedImage']).toHaveBeenCalledWith('web');

    return;
  });

  it('refuses disabled rollback for Outpost', async () => {
    const dependencies: Run_RunUpdateCycle_RefusesDisabledRollbackForOutpost_Dependencies = createSelfDependencies(true);
    const report: Run_RunUpdateCycle_RefusesDisabledRollbackForOutpost_Report = await runUpdateCycle({
      ...options,
      selfId: 'self-id',
    }, dependencies, ['self-id'], 'update', false);

    expect(report['results']).toMatchObject([{
      status: 'failed',
      detail: 'Rollback cannot be disabled when updating Outpost itself',
    }]);

    expect(dependencies['engine']['pullImage']).not.toHaveBeenCalled();

    expect(dependencies['updateSelf']).not.toHaveBeenCalled();

    return;
  });

  it('skips images that Docker built on this host', async () => {
    // Docker 29 records the build, even when a registry has an image under the same name.
    const dependencies: Run_RunUpdateCycle_SkipsImagesThatDockerBuiltOnThisHost_Dependencies = createDependencies({
      localDigest: 'sha256:old',
      currentRepoDigests: ['nginx@sha256:old'],
      identity: { Build: [{ Ref: 'build-ref' }] },
      descriptor: true,
    }, true);

    // Classic Docker records no registry digest for a local build.
    const classicDependencies: Run_RunUpdateCycle_SkipsImagesThatDockerBuiltOnThisHost_ClassicDependencies = createDependencies({
      localDigest: 'sha256:local',
      currentRepoDigests: [],
    }, true);
    const report: Run_RunUpdateCycle_SkipsImagesThatDockerBuiltOnThisHost_Report = await runUpdateCycle(options, dependencies);
    const classicReport: Run_RunUpdateCycle_SkipsImagesThatDockerBuiltOnThisHost_ClassicReport = await runUpdateCycle(options, classicDependencies);

    expect(report['results']).toMatchObject([{
      status: 'skipped',
      detail: 'Image is locally built or has no published registry digest',
    }]);

    expect(classicReport['results']).toMatchObject([{
      status: 'skipped',
      detail: 'Image is locally built or has no published registry digest',
    }]);

    expect(dependencies['fetchFunction']).not.toHaveBeenCalled();

    expect(classicDependencies['fetchFunction']).not.toHaveBeenCalled();

    expect(dependencies['engine']['pullImage']).not.toHaveBeenCalled();

    return;
  });

  it('skips images of unknown origin that the registry lacks', async () => {
    // Before Docker 29, the containerd image store lists an image's own ID as its digest, pulled or built.
    const dependencies: Run_RunUpdateCycle_SkipsImagesOfUnknownOriginThatTheRegistryLacks_Dependencies = createDependencies({
      localDigest: 'sha256:old',
      currentRepoDigests: ['nginx@sha256:old'],
      remoteStatus: 404,
    }, true);

    // Docker Hub refuses a name it doesn't have, the same as a private one.
    const refusedDependencies: Run_RunUpdateCycle_SkipsImagesOfUnknownOriginThatTheRegistryLacks_RefusedDependencies = createDependencies({
      localDigest: 'sha256:old',
      currentRepoDigests: ['nginx@sha256:old'],
      remoteStatus: 401,
    }, true);
    const report: Run_RunUpdateCycle_SkipsImagesOfUnknownOriginThatTheRegistryLacks_Report = await runUpdateCycle(options, dependencies);
    const refusedReport: Run_RunUpdateCycle_SkipsImagesOfUnknownOriginThatTheRegistryLacks_RefusedReport = await runUpdateCycle(options, refusedDependencies);

    expect(report['results']).toMatchObject([{
      status: 'skipped',
      detail: 'Image is locally built or has no published registry digest',
    }]);

    expect(refusedReport['results']).toMatchObject([{
      status: 'skipped',
      detail: 'Image is locally built, or its registry needs credentials Outpost doesn\'t have',
    }]);

    expect(dependencies['engine']['pullImage']).not.toHaveBeenCalled();

    expect(refusedDependencies['engine']['pullImage']).not.toHaveBeenCalled();

    return;
  });

  it('checks pulled images on the containerd image store', async () => {
    // A pulled image lists its own ID as its digest.
    const dependencies: Run_RunUpdateCycle_ChecksPulledImagesOnTheContainerdImageStore_Dependencies = createDependencies({
      localDigest: 'sha256:old',
      currentRepoDigests: ['nginx@sha256:old'],
      remoteDigest: 'sha256:old',
      identity: { Pull: [{ Repository: 'docker.io/library/nginx' }] },
      descriptor: true,
    }, true);

    // An image that lost its tag still matches the registry by ID.
    const untaggedDependencies: Run_RunUpdateCycle_ChecksPulledImagesOnTheContainerdImageStore_UntaggedDependencies = createDependencies({
      localDigest: 'sha256:old',
      currentRepoDigests: [],
      remoteDigest: 'sha256:old',
      identity: { Pull: [{ Repository: 'docker.io/library/nginx' }] },
      descriptor: true,
    }, true);

    // After a rollback, the restored image has no tag or digest left, and a newer one is still out.
    const rolledBackDependencies: Run_RunUpdateCycle_ChecksPulledImagesOnTheContainerdImageStore_RolledBackDependencies = createDependencies({
      localDigest: 'sha256:old',
      currentRepoDigests: [],
      identity: { Pull: [{ Repository: 'docker.io/library/nginx' }] },
      descriptor: true,
    }, true);

    // Before Docker 29 there is no identity, so the registry decides.
    const olderDependencies: Run_RunUpdateCycle_ChecksPulledImagesOnTheContainerdImageStore_OlderDependencies = createDependencies({
      localDigest: 'sha256:old',
      currentRepoDigests: [],
      descriptor: true,
    }, true);
    const report: Run_RunUpdateCycle_ChecksPulledImagesOnTheContainerdImageStore_Report = await runUpdateCycle(options, dependencies);
    const untaggedReport: Run_RunUpdateCycle_ChecksPulledImagesOnTheContainerdImageStore_UntaggedReport = await runUpdateCycle(options, untaggedDependencies);
    const rolledBackReport: Run_RunUpdateCycle_ChecksPulledImagesOnTheContainerdImageStore_RolledBackReport = await runUpdateCycle(options, rolledBackDependencies);
    const olderReport: Run_RunUpdateCycle_ChecksPulledImagesOnTheContainerdImageStore_OlderReport = await runUpdateCycle(options, olderDependencies);

    expect(report['results']).toMatchObject([{
      status: 'up-to-date',
      detail: 'sha256:old',
    }]);

    expect(untaggedReport['results']).toMatchObject([{
      status: 'up-to-date',
      detail: 'sha256:old',
    }]);

    expect(rolledBackReport['results']).toMatchObject([{ status: 'updated' }]);

    expect(olderReport['results']).toMatchObject([{ status: 'updated' }]);

    expect(dependencies['engine']['pullImage']).not.toHaveBeenCalled();

    expect(untaggedDependencies['engine']['pullImage']).not.toHaveBeenCalled();

    return;
  });

  it('keeps checking pulled images that the registry turns away', async () => {
    // Classic Docker recorded where this image came from, so a refusal is a registry problem, not a local build.
    const dependencies: Run_RunUpdateCycle_KeepsCheckingPulledImagesThatTheRegistryTurnsAway_Dependencies = createDependencies({
      localDigest: 'sha256:local',
      remoteStatus: 404,
    }, true);
    const report: Run_RunUpdateCycle_KeepsCheckingPulledImagesThatTheRegistryTurnsAway_Report = await runUpdateCycle(options, dependencies);

    expect(report['results']).toMatchObject([{ status: 'updated' }]);

    expect(dependencies['engine']['pullImage']).toHaveBeenCalled();

    return;
  });

  it('reports a cycle failure', async () => {
    const dependencies: Run_RunUpdateCycle_ReportsACycleFailure_Dependencies = createDependencies({
      localDigest: 'sha256:local',
      listError: new Error('Docker socket is unreachable'),
    }, true);
    const report: Run_RunUpdateCycle_ReportsACycleFailure_Report = await runUpdateCycle(options, dependencies);

    expect(report).toMatchObject({
      error: 'Docker socket is unreachable',
      results: [{
        status: 'failed',
        detail: 'Update cycle failed: Docker socket is unreachable',
      }],
    });

    return;
  });

  it('reports updated when cleanup fails', async () => {
    const dependencies: Run_RunUpdateCycle_ReportsUpdatedWhenCleanupFails_Dependencies = createDependencies({
      localDigest: 'sha256:local',
      cleanupError: new Error('daemon storage error'),
    }, true);
    const report: Run_RunUpdateCycle_ReportsUpdatedWhenCleanupFails_Report = await runUpdateCycle(options, dependencies);

    expect(report['results']).toMatchObject([{
      status: 'updated',
      detail: expect.stringContaining('warning: could not remove the previous image: daemon storage error'),
    }]);

    expect(dependencies['engine']['removeContainer']).toHaveBeenCalledWith('old-id');

    return;
  });

  it('hands Outpost to updateSelf after the other containers', async () => {
    const dependencies: Run_RunUpdateCycle_HandsOutpostToUpdateSelfAfterTheOtherContainers_Dependencies = createSelfDependencies(true);
    const report: Run_RunUpdateCycle_HandsOutpostToUpdateSelfAfterTheOtherContainers_Report = await runUpdateCycle({
      ...options,
      selfId: 'self-id',
    }, dependencies);

    expect(report['results'].map((result) => [
      result['container'],
      result['status'],
    ])).toStrictEqual([
      [
        'web',
        'up-to-date',
      ],
      [
        'outpost',
        'updated',
      ],
    ]);

    expect(dependencies['updateSelf']).toHaveBeenCalledWith({
      container: expect.objectContaining({ Id: 'self-id' }),
      newImageId: 'sha256:outpost-new',
      newImageReference: 'cbnventures/outpost@sha256:outpost-remote',
      reference: 'cbnventures/outpost:latest',
      results: [expect.objectContaining({
        container: 'web',
        status: 'up-to-date',
      })],
      startedAt: report['startedAt'],
    });

    expect(dependencies['engine']['stopContainer']).not.toHaveBeenCalled();

    expect(dependencies['engine']['removeImage']).not.toHaveBeenCalled();

    return;
  });

  it('skips Outpost when nothing can update it', async () => {
    const dependencies: Run_RunUpdateCycle_SkipsOutpostWhenNothingCanUpdateIt_Dependencies = createSelfDependencies(false);
    const report: Run_RunUpdateCycle_SkipsOutpostWhenNothingCanUpdateIt_Report = await runUpdateCycle({
      ...options,
      selfId: 'self-id',
    }, dependencies);

    expect(report['results'].at(-1)).toStrictEqual({
      container: 'outpost',
      image: 'cbnventures/outpost:latest',
      status: 'skipped',
      detail: 'Outpost doesn\'t update itself in this setup',
    });

    expect(dependencies['engine']['stopContainer']).not.toHaveBeenCalled();

    return;
  });

  it('looks up each registry sign-in once per cycle', async () => {
    const dependencies: Run_RunUpdateCycle_LooksUpEachRegistrySignInOncePerCycle_Dependencies = createSelfDependencies(true);

    dependencies['findCredentials'].mockReturnValue({
      username: 'outpost',
      password: 'dckr_pat_example',
    });

    await runUpdateCycle({
      ...options,
      selfId: 'self-id',
    }, dependencies);

    // Both images come from Docker Hub, so its sign-in is read only for the first one.
    expect(dependencies['findCredentials']).toHaveBeenCalledTimes(1);

    expect(dependencies['findCredentials']).toHaveBeenCalledWith('registry-1.docker.io');

    expect(dependencies['engine']['pullImage']).toHaveBeenCalledWith('cbnventures/outpost:latest', expect.any(String));

    return;
  });

  return;
});

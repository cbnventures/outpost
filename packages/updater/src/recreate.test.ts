import {
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { recreateContainer } from './recreate.js';

import type {
  Recreate_CreateDependencies_Returns,
  Recreate_InspectContainer,
  Recreate_RecreateContainer_FailsBeforeStoppingWhenTheReservedNameExists_Dependencies,
  Recreate_RecreateContainer_FailsBeforeStoppingWhenTheReservedNameExists_Leftover,
  Recreate_RecreateContainer_FailsBeforeStoppingWhenTheReservedNameExists_Outcome,
  Recreate_RecreateContainer_FreesTheReservedNameForTheNextUpdate_Container,
  Recreate_RecreateContainer_FreesTheReservedNameForTheNextUpdate_Dependencies,
  Recreate_RecreateContainer_FreesTheReservedNameForTheNextUpdate_FirstOutcome,
  Recreate_RecreateContainer_FreesTheReservedNameForTheNextUpdate_Replacement,
  Recreate_RecreateContainer_FreesTheReservedNameForTheNextUpdate_SecondOutcome,
} from './types/recreate.test.d.ts';

/**
 * Recreate - Create Dependencies.
 *
 * Builds a fully mocked Engine boundary for exercising the container swap.
 * Each test supplies the ordered inspect answers for its Docker scenario.
 *
 * @returns {Recreate_CreateDependencies_Returns}
 *
 * @since 1.1.0
 */
function createDependencies(): Recreate_CreateDependencies_Returns {
  return {
    engine: {
      connectNetwork: vi.fn(async () => undefined),
      createContainer: vi.fn(async () => 'new-id'),
      inspectContainer: vi.fn<Recreate_InspectContainer>(),
      inspectImage: vi.fn(async () => undefined),
      listContainers: vi.fn(async () => []),
      pullImage: vi.fn(async () => undefined),
      removeContainer: vi.fn(async () => undefined),
      removeImage: vi.fn(async () => true),
      renameContainer: vi.fn(async () => undefined),
      startContainer: vi.fn(async () => undefined),
      stopContainer: vi.fn(async () => undefined),
    },
    now: () => new Date('2026-10-24T00:00:00.000Z'),
    sleep: vi.fn(async () => undefined),
  };
}

/**
 * Recreate - Container.
 *
 * Verifies kept originals vacate the reserved rollback name and that a crash
 * leftover stops an update before Outpost mutates any container.
 *
 * @since 1.1.0
 */
describe('recreateContainer', () => {
  it('frees the reserved name for the next update', async () => {
    const container: Recreate_RecreateContainer_FreesTheReservedNameForTheNextUpdate_Container = {
      Id: 'old-id',
      Name: '/web',
      Image: 'sha256:old',
      Config: { Image: 'nginx:1' },
      HostConfig: { NetworkMode: 'bridge' },
      NetworkSettings: { Networks: { bridge: {} } },
      Mounts: [],
      State: {
        Running: true,
        Status: 'running',
      },
    };
    const replacement: Recreate_RecreateContainer_FreesTheReservedNameForTheNextUpdate_Replacement = {
      ...container,
      Id: 'new-id',
      Image: 'sha256:new',
      Config: { Image: 'nginx:2' },
      State: {
        Health: { Status: 'unhealthy' },
        Running: true,
        Status: 'running',
      },
    };
    const dependencies: Recreate_RecreateContainer_FreesTheReservedNameForTheNextUpdate_Dependencies = createDependencies();

    dependencies['engine']['inspectContainer']
      .mockRejectedValueOnce(new Error('Docker Engine API returned HTTP 404: No such container: web-outpost-previous'))
      .mockResolvedValueOnce({
        ...replacement,
        State: {
          Running: false,
          Status: 'created',
        },
      })
      .mockResolvedValueOnce(replacement)
      .mockRejectedValueOnce(new Error('Docker Engine API returned HTTP 404: No such container: web-outpost-previous'))
      .mockResolvedValueOnce({
        ...replacement,
        Id: 'newer-id',
        Image: 'sha256:newer',
        State: {
          Running: false,
          Status: 'created',
        },
      })
      .mockResolvedValueOnce({
        ...replacement,
        Id: 'newer-id',
        Image: 'sha256:newer',
        State: {
          Health: { Status: 'healthy' },
          Running: true,
          Status: 'running',
        },
      });

    dependencies['engine']['createContainer']
      .mockResolvedValueOnce('new-id')
      .mockResolvedValueOnce('newer-id');

    const firstOutcome: Recreate_RecreateContainer_FreesTheReservedNameForTheNextUpdate_FirstOutcome = await recreateContainer(container, undefined, 'nginx:2', {
      healthTimeoutSeconds: 30,
      settleSeconds: 2,
      stopTimeoutSeconds: 10,
    }, dependencies, false);

    expect(firstOutcome).toMatchObject({
      status: 'kept-unhealthy',
      detail: expect.stringContaining('web-outpost-kept-20261024T000000Z'),
    });

    expect(firstOutcome['detail']).toContain('old-id');

    expect(firstOutcome['detail']).toContain('sha256:old');

    expect(dependencies['engine']['renameContainer']).toHaveBeenNthCalledWith(1, 'old-id', 'web-outpost-previous');

    expect(dependencies['engine']['renameContainer']).toHaveBeenNthCalledWith(2, 'old-id', 'web-outpost-kept-20261024T000000Z');

    const secondOutcome: Recreate_RecreateContainer_FreesTheReservedNameForTheNextUpdate_SecondOutcome = await recreateContainer(replacement, undefined, 'nginx:3', {
      healthTimeoutSeconds: 30,
      settleSeconds: 2,
      stopTimeoutSeconds: 10,
    }, dependencies);

    expect(secondOutcome['status']).toBe('updated');

    expect(dependencies['engine']['renameContainer']).toHaveBeenNthCalledWith(3, 'new-id', 'web-outpost-previous');

    expect(dependencies['engine']['removeContainer']).toHaveBeenCalledExactlyOnceWith('new-id');

    return;
  });

  it('fails before stopping when the reserved name exists', async () => {
    const dependencies: Recreate_RecreateContainer_FailsBeforeStoppingWhenTheReservedNameExists_Dependencies = createDependencies();
    const leftover: Recreate_RecreateContainer_FailsBeforeStoppingWhenTheReservedNameExists_Leftover = {
      Id: 'leftover-id',
      Name: '/web-outpost-previous',
      Image: 'sha256:leftover',
      Config: { Image: 'nginx:old' },
      HostConfig: { NetworkMode: 'bridge' },
      NetworkSettings: { Networks: { bridge: {} } },
      Mounts: [],
      State: {
        Running: false,
        Status: 'exited',
      },
    };

    dependencies['engine']['inspectContainer'].mockResolvedValueOnce(leftover);

    const outcome: Recreate_RecreateContainer_FailsBeforeStoppingWhenTheReservedNameExists_Outcome = await recreateContainer({
      ...leftover,
      Id: 'current-id',
      Name: '/web',
      Image: 'sha256:current',
      Config: { Image: 'nginx:1' },
      State: {
        Running: true,
        Status: 'running',
      },
    }, undefined, 'nginx:2', {
      healthTimeoutSeconds: 30,
      settleSeconds: 2,
      stopTimeoutSeconds: 10,
    }, dependencies);

    expect(outcome).toMatchObject({
      status: 'failed',
      detail: expect.stringContaining('leftover container web-outpost-previous (leftover-id)'),
    });

    expect(outcome['detail']).toContain('Remove or rename web-outpost-previous');

    expect(dependencies['engine']['stopContainer']).not.toHaveBeenCalled();

    expect(dependencies['engine']['renameContainer']).not.toHaveBeenCalled();

    expect(dependencies['engine']['removeContainer']).not.toHaveBeenCalled();

    expect(dependencies['engine']['createContainer']).not.toHaveBeenCalled();

    return;
  });

  return;
});

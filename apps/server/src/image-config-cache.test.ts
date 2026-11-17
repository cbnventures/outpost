import {
  mkdtempSync,
  rmSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import {
  afterAll,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import {
  pruneImageConfigs,
  resolveImageConfig,
  Runner as ImageConfigCache,
} from './image-config-cache.js';

import type {
  ImageConfigCache_Cache,
  ImageConfigCache_Directory,
  ImageConfigCache_Engine,
  ImageConfigCache_ImageConfig,
  ImageConfigCache_PruneEngine,
  ImageConfigCache_PruneHandoff,
} from './types/image-config-cache.test.d.ts';

/**
 * Image Config Cache - Directory.
 *
 * Temporary data directory for the persisted cache tests.
 * Every test file uses a separate cache document inside it.
 *
 * @since 1.1.0
 */
const directory: ImageConfigCache_Directory = mkdtempSync(join(tmpdir(), 'outpost-image-config-cache-'));

/**
 * Image Config Cache - Image Config Cache.
 *
 * Verifies live image metadata refreshes the persisted fallback and pruning
 * keeps only configs referenced by managed containers.
 *
 * @since 1.1.0
 */
describe('image config cache', () => {
  afterAll(() => {
    rmSync(directory, {
      recursive: true,
      force: true,
    });

    return;
  });

  it('uses the live config first and the persisted config after the image disappears', async () => {
    const cache: ImageConfigCache_Cache = new ImageConfigCache(join(directory, 'resolve.json'));
    const liveConfig: ImageConfigCache_ImageConfig = {
      Cmd: ['serve'],
      Env: ['IMAGE_DEFAULT=live'],
    };
    const engine: ImageConfigCache_Engine = {
      inspectImage: vi.fn(async () => ({
        Id: 'sha256:live',
        Config: liveConfig,
      })),
    };

    expect(await resolveImageConfig('sha256:live', engine, cache)).toStrictEqual(liveConfig);

    engine['inspectImage'].mockResolvedValue(undefined);

    expect(await resolveImageConfig('sha256:live', engine, cache)).toStrictEqual(liveConfig);

    return;
  });

  it('prunes configs not referenced by managed containers', () => {
    const cache: ImageConfigCache_Cache = new ImageConfigCache(join(directory, 'prune.json'));

    cache.remember('sha256:kept', { Env: ['KEPT=true'] });
    cache.remember('sha256:removed', { Env: ['REMOVED=true'] });

    cache.prune(['sha256:kept']);

    expect(cache.find('sha256:kept')).toStrictEqual({ Env: ['KEPT=true'] });

    expect(cache.find('sha256:removed')).toBeUndefined();

    return;
  });

  it('keeps configs referenced by stopped managed containers', async () => {
    const cache: ImageConfigCache_Cache = new ImageConfigCache(join(directory, 'stopped.json'));
    const engine: ImageConfigCache_PruneEngine = {
      listContainers: vi.fn(async () => [{
        Id: 'stopped-id',
        Names: ['/stopped-managed'],
        Image: 'example/stopped:latest',
        ImageID: 'sha256:stopped',
        Labels: { 'io.cbnventures.outpost.enable': 'true' },
        State: 'exited',
      }]),
    };
    const handoff: ImageConfigCache_PruneHandoff = {
      read: vi.fn(() => undefined),
    };

    cache.remember('sha256:stopped', { Env: ['STOPPED=true'] });
    cache.remember('sha256:unused', { Env: ['UNUSED=true'] });

    await pruneImageConfigs(cache, engine, handoff);

    expect(engine['listContainers']).toHaveBeenCalledWith(true);

    expect(cache.find('sha256:stopped')).toStrictEqual({ Env: ['STOPPED=true'] });

    expect(cache.find('sha256:unused')).toBeUndefined();

    return;
  });

  it('keeps the previous Outpost image during rollback startup', async () => {
    const cache: ImageConfigCache_Cache = new ImageConfigCache(join(directory, 'rollback.json'));
    const engine: ImageConfigCache_PruneEngine = {
      listContainers: vi.fn(async () => [{
        Id: 'previous-id',
        Names: ['/outpost-outpost-previous'],
        Image: 'sha256:previous',
        ImageID: 'sha256:previous',
        Labels: {},
        State: 'exited',
      }]),
    };
    const handoff: ImageConfigCache_PruneHandoff = {
      read: vi.fn(() => undefined),
    };

    cache.remember('sha256:previous', { Env: ['OUTPOST_PREVIOUS=true'] });

    await pruneImageConfigs(cache, engine, handoff);

    expect(cache.find('sha256:previous')).toStrictEqual({ Env: ['OUTPOST_PREVIOUS=true'] });

    return;
  });

  it('keeps the old image for a container kept after failure', async () => {
    const cache: ImageConfigCache_Cache = new ImageConfigCache(join(directory, 'kept.json'));
    const engine: ImageConfigCache_PruneEngine = {
      listContainers: vi.fn(async () => [{
        Id: 'kept-id',
        Names: ['/app-outpost-kept-20261106T040413Z'],
        Image: 'sha256:kept',
        ImageID: 'sha256:kept',
        Labels: {},
        State: 'exited',
      }]),
    };
    const handoff: ImageConfigCache_PruneHandoff = {
      read: vi.fn(() => undefined),
    };

    cache.remember('sha256:kept', { Env: ['KEPT_AFTER_FAILURE=true'] });

    await pruneImageConfigs(cache, engine, handoff);

    expect(cache.find('sha256:kept')).toStrictEqual({ Env: ['KEPT_AFTER_FAILURE=true'] });

    return;
  });

  it('does not prune while a self-update swap is pending', async () => {
    const cache: ImageConfigCache_Cache = new ImageConfigCache(join(directory, 'pending.json'));
    const engine: ImageConfigCache_PruneEngine = {
      listContainers: vi.fn(async () => []),
    };
    const handoff: ImageConfigCache_PruneHandoff = {
      read: vi.fn(() => ({
        version: 1,
        pending: {
          containerId: 'outpost-id',
          containerName: 'outpost',
          deadline: '2026-11-06T04:05:00.000Z',
          helperName: 'outpost-outpost-self-update',
          newImageId: 'sha256:new',
          previousImageId: 'sha256:previous',
          reference: 'cbnventures/outpost:latest',
          results: [],
          startedAt: '2026-11-06T04:00:00.000Z',
          trigger: 'startup',
        },
      })),
    };

    cache.remember('sha256:previous', { Env: ['OUTPOST_PREVIOUS=true'] });

    await pruneImageConfigs(cache, engine, handoff);

    expect(engine['listContainers']).not.toHaveBeenCalled();

    expect(cache.find('sha256:previous')).toStrictEqual({ Env: ['OUTPOST_PREVIOUS=true'] });

    return;
  });

  return;
});

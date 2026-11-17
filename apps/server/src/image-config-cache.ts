import {
  chmodSync,
  mkdirSync,
  readFileSync,
  renameSync,
  writeFileSync,
} from 'node:fs';
import { dirname } from 'node:path';

import { containerConfigSchema } from 'outpost-package-docker-engine';
import { z } from 'zod';

import type {
  ImageConfigCache_PruneImageConfigs_Cache,
  ImageConfigCache_PruneImageConfigs_Containers,
  ImageConfigCache_PruneImageConfigs_Current,
  ImageConfigCache_PruneImageConfigs_Engine,
  ImageConfigCache_PruneImageConfigs_Handoff,
  ImageConfigCache_PruneImageConfigs_ImageIds,
  ImageConfigCache_PruneImageConfigs_Returns,
  ImageConfigCache_ResolveImageConfig_Cache,
  ImageConfigCache_ResolveImageConfig_Config,
  ImageConfigCache_ResolveImageConfig_Engine,
  ImageConfigCache_ResolveImageConfig_Image,
  ImageConfigCache_ResolveImageConfig_ImageId,
  ImageConfigCache_ResolveImageConfig_Returns,
  ImageConfigCache_Runner_Constructor_FilePath,
  ImageConfigCache_Runner_FilePath,
  ImageConfigCache_Runner_Find_Cache,
  ImageConfigCache_Runner_Find_ImageId,
  ImageConfigCache_Runner_Find_Returns,
  ImageConfigCache_Runner_Prune_Cache,
  ImageConfigCache_Runner_Prune_ImageIds,
  ImageConfigCache_Runner_Prune_Kept,
  ImageConfigCache_Runner_Prune_Referenced,
  ImageConfigCache_Runner_Prune_Returns,
  ImageConfigCache_Runner_Read_Parsed,
  ImageConfigCache_Runner_Read_Returns,
  ImageConfigCache_Runner_Remember_Cache,
  ImageConfigCache_Runner_Remember_Config,
  ImageConfigCache_Runner_Remember_ImageId,
  ImageConfigCache_Runner_Remember_Returns,
  ImageConfigCache_Runner_Write_Cache,
  ImageConfigCache_Runner_Write_FileMode,
  ImageConfigCache_Runner_Write_Returns,
  ImageConfigCache_Runner_Write_TemporaryPath,
} from './types/image-config-cache.d.ts';

/**
 * Image Config Cache - Image Config Cache Schema.
 *
 * Validates the image defaults saved on the data volume. Unknown container
 * config keys stay intact because recreation must compare them verbatim.
 *
 * @since 1.1.0
 */
const imageConfigCacheSchema = z.object({
  version: z.literal(1),
  images: z.record(z.string(), containerConfigSchema),
});

/**
 * Image Config Cache.
 *
 * Persists the image defaults needed to distinguish a container's user
 * settings after Docker removes its old image record.
 *
 * @since 1.1.0
 */
export class Runner {
  /**
   * Image Config Cache - File Path.
   *
   * The cache lives on Outpost's data volume so a self-update helper and the
   * replacement Outpost can read the metadata saved by the outgoing process.
   *
   * @private
   *
   * @since 1.1.0
   */
  readonly #filePath: ImageConfigCache_Runner_FilePath;

  /**
   * Image Config Cache - Constructor.
   *
   * Remembers the cache path. Reads remain lazy so every process sees the
   * newest atomic write from another Outpost process or helper.
   *
   * @param {ImageConfigCache_Runner_Constructor_FilePath} filePath - File path.
   *
   * @since 1.1.0
   */
  public constructor(filePath: ImageConfigCache_Runner_Constructor_FilePath) {
    this.#filePath = filePath;

    return;
  }

  /**
   * Image Config Cache - Find.
   *
   * Returns the saved defaults for one exact image ID.
   * A missing entry means Docker's current behavior remains the fallback.
   *
   * @param {ImageConfigCache_Runner_Find_ImageId} imageId - Image id.
   *
   * @returns {ImageConfigCache_Runner_Find_Returns}
   *
   * @since 1.1.0
   */
  public find(imageId: ImageConfigCache_Runner_Find_ImageId): ImageConfigCache_Runner_Find_Returns {
    const cache: ImageConfigCache_Runner_Find_Cache = this.#read();

    return cache['images'][imageId];
  }

  /**
   * Image Config Cache - Remember.
   *
   * Saves the live image defaults under the immutable image ID.
   * Later processes can therefore recreate from the same baseline.
   *
   * @param {ImageConfigCache_Runner_Remember_ImageId} imageId - Image id.
   * @param {ImageConfigCache_Runner_Remember_Config}  config  - Config.
   *
   * @returns {ImageConfigCache_Runner_Remember_Returns}
   *
   * @since 1.1.0
   */
  public remember(imageId: ImageConfigCache_Runner_Remember_ImageId, config: ImageConfigCache_Runner_Remember_Config): ImageConfigCache_Runner_Remember_Returns {
    const cache: ImageConfigCache_Runner_Remember_Cache = this.#read();

    this.#write({
      ...cache,
      images: {
        ...cache['images'],
        [imageId]: config,
      },
    });

    return;
  }

  /**
   * Image Config Cache - Prune.
   *
   * Keeps metadata only for images still referenced by the complete managed
   * container set, bounding the cache independently of update history.
   *
   * @param {ImageConfigCache_Runner_Prune_ImageIds} imageIds - Image ids.
   *
   * @returns {ImageConfigCache_Runner_Prune_Returns}
   *
   * @since 1.1.0
   */
  public prune(imageIds: ImageConfigCache_Runner_Prune_ImageIds): ImageConfigCache_Runner_Prune_Returns {
    const cache: ImageConfigCache_Runner_Prune_Cache = this.#read();
    const referenced: ImageConfigCache_Runner_Prune_Referenced = new Set(imageIds);
    const kept: ImageConfigCache_Runner_Prune_Kept = {};

    for (const entry of Object.entries(cache['images'])) {
      if (referenced.has(entry[0]) === true) {
        Reflect.set(kept, entry[0], entry[1]);
      }
    }

    this.#write({
      version: 1,
      images: kept,
    });

    return;
  }

  /**
   * Image Config Cache - Read.
   *
   * Returns an empty cache when the file is absent, damaged, or from a newer
   * format, leaving update behavior backward compatible.
   *
   * @private
   *
   * @returns {ImageConfigCache_Runner_Read_Returns}
   *
   * @since 1.1.0
   */
  #read(): ImageConfigCache_Runner_Read_Returns {
    try {
      const parsed: ImageConfigCache_Runner_Read_Parsed = imageConfigCacheSchema.safeParse(JSON.parse(readFileSync(this.#filePath, 'utf-8')));

      if (parsed['success'] === true) {
        return parsed['data'];
      }
    } catch {
      // A missing or damaged cache is equivalent to no saved image metadata.
    }

    return {
      version: 1,
      images: {},
    };
  }

  /**
   * Image Config Cache - Write.
   *
   * Replaces the cache through a mode-0600 temporary file and rename so the
   * helper never reads a partial document during a self-update.
   *
   * @param {ImageConfigCache_Runner_Write_Cache} cache - Cache.
   *
   * @private
   *
   * @returns {ImageConfigCache_Runner_Write_Returns}
   *
   * @since 1.1.0
   */
  #write(cache: ImageConfigCache_Runner_Write_Cache): ImageConfigCache_Runner_Write_Returns {
    const temporaryPath: ImageConfigCache_Runner_Write_TemporaryPath = `${this.#filePath}.tmp`;
    const fileMode: ImageConfigCache_Runner_Write_FileMode = parseInt('600', 8);

    mkdirSync(dirname(this.#filePath), { recursive: true });

    writeFileSync(temporaryPath, `${JSON.stringify(cache, null, 2)}\n`, { mode: fileMode });

    chmodSync(temporaryPath, fileMode);

    renameSync(temporaryPath, this.#filePath);

    return;
  }
}

/**
 * Image Config Cache - Prune Image Configs.
 *
 * Keeps every image referenced by Docker, including stopped rollback and
 * kept containers. A pending self-update owns an in-flight container swap.
 *
 * @param {ImageConfigCache_PruneImageConfigs_Cache}   cache   - Cache.
 * @param {ImageConfigCache_PruneImageConfigs_Engine}  engine  - Engine.
 * @param {ImageConfigCache_PruneImageConfigs_Handoff} handoff - Handoff.
 *
 * @returns {ImageConfigCache_PruneImageConfigs_Returns}
 *
 * @since 1.1.0
 */
export async function pruneImageConfigs(cache: ImageConfigCache_PruneImageConfigs_Cache, engine: ImageConfigCache_PruneImageConfigs_Engine, handoff: ImageConfigCache_PruneImageConfigs_Handoff): ImageConfigCache_PruneImageConfigs_Returns {
  const current: ImageConfigCache_PruneImageConfigs_Current = handoff.read();

  if (current !== undefined && current['pending'] !== undefined) {
    return;
  }

  const containers: ImageConfigCache_PruneImageConfigs_Containers = await engine.listContainers(true);
  const imageIds: ImageConfigCache_PruneImageConfigs_ImageIds = containers.map((container) => container['ImageID']);

  cache.prune(imageIds);

  return;
}

/**
 * Image Config Cache - Resolve Image Config.
 *
 * Uses Docker's live image config when available and refreshes the cache. If
 * Docker already removed that image record, returns the persisted config.
 *
 * @param {ImageConfigCache_ResolveImageConfig_ImageId} imageId - Image id.
 * @param {ImageConfigCache_ResolveImageConfig_Engine}  engine  - Engine.
 * @param {ImageConfigCache_ResolveImageConfig_Cache}   cache   - Cache.
 *
 * @returns {ImageConfigCache_ResolveImageConfig_Returns}
 *
 * @since 1.1.0
 */
export async function resolveImageConfig(imageId: ImageConfigCache_ResolveImageConfig_ImageId, engine: ImageConfigCache_ResolveImageConfig_Engine, cache: ImageConfigCache_ResolveImageConfig_Cache): ImageConfigCache_ResolveImageConfig_Returns {
  const image: ImageConfigCache_ResolveImageConfig_Image = await engine.inspectImage(imageId);
  const config: ImageConfigCache_ResolveImageConfig_Config = (image !== undefined) ? (image['Config'] ?? undefined) : undefined;

  if (config !== undefined) {
    cache.remember(imageId, config);

    return config;
  }

  return cache.find(imageId);
}

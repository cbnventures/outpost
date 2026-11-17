import type {
  DockerContainerConfig,
  DockerContainerSummary,
  DockerEngine,
  DockerImageInspect,
} from 'outpost-package-docker-engine';
import type { z } from 'zod';

import type { Runner as Handoff } from '../handoff.js';
import type { Runner } from '../image-config-cache.js';

/**
 * Image Config Cache.
 *
 * @since 1.1.0
 */
export type ImageConfigCache_File_Version = 1;

export type ImageConfigCache_File_Images = Record<string, DockerContainerConfig>;

export type ImageConfigCache_File = {
  version: ImageConfigCache_File_Version;
  images: ImageConfigCache_File_Images;
};

export type ImageConfigCache_Runner_FilePath = string;

/**
 * Image Config Cache - Runner - Constructor.
 *
 * @since 1.1.0
 */
export type ImageConfigCache_Runner_Constructor_FilePath = string;

/**
 * Image Config Cache - Runner - Find.
 *
 * @since 1.1.0
 */
export type ImageConfigCache_Runner_Find_ImageId = string;

export type ImageConfigCache_Runner_Find_Returns = DockerContainerConfig | undefined;

export type ImageConfigCache_Runner_Find_Cache = ImageConfigCache_File;

/**
 * Image Config Cache - Runner - Prune.
 *
 * @since 1.1.0
 */
export type ImageConfigCache_Runner_Prune_ImageIds = string[];

export type ImageConfigCache_Runner_Prune_Returns = void;

export type ImageConfigCache_Runner_Prune_Cache = ImageConfigCache_File;

export type ImageConfigCache_Runner_Prune_Kept = ImageConfigCache_File_Images;

export type ImageConfigCache_Runner_Prune_Referenced = Set<string>;

/**
 * Image Config Cache - Runner - Read.
 *
 * @since 1.1.0
 */
export type ImageConfigCache_Runner_Read_Returns = ImageConfigCache_File;

export type ImageConfigCache_Runner_Read_Parsed = z.ZodSafeParseResult<ImageConfigCache_File>;

/**
 * Image Config Cache - Runner - Remember.
 *
 * @since 1.1.0
 */
export type ImageConfigCache_Runner_Remember_ImageId = string;

export type ImageConfigCache_Runner_Remember_Config = DockerContainerConfig;

export type ImageConfigCache_Runner_Remember_Returns = void;

export type ImageConfigCache_Runner_Remember_Cache = ImageConfigCache_File;

/**
 * Image Config Cache - Runner - Write.
 *
 * @since 1.1.0
 */
export type ImageConfigCache_Runner_Write_Cache = ImageConfigCache_File;

export type ImageConfigCache_Runner_Write_Returns = void;

export type ImageConfigCache_Runner_Write_TemporaryPath = string;

export type ImageConfigCache_Runner_Write_FileMode = number;

/**
 * Image Config Cache - Prune Image Configs.
 *
 * @since 1.1.0
 */
export type ImageConfigCache_PruneImageConfigs_Cache = Pick<Runner, 'prune'>;

export type ImageConfigCache_PruneImageConfigs_Engine = Pick<DockerEngine, 'listContainers'>;

export type ImageConfigCache_PruneImageConfigs_Handoff = Pick<Handoff, 'read'>;

export type ImageConfigCache_PruneImageConfigs_Returns = Promise<void>;

export type ImageConfigCache_PruneImageConfigs_Current_Pending = object | undefined;

export type ImageConfigCache_PruneImageConfigs_Current = {
  pending?: ImageConfigCache_PruneImageConfigs_Current_Pending;
} | undefined;

export type ImageConfigCache_PruneImageConfigs_Containers = DockerContainerSummary[];

export type ImageConfigCache_PruneImageConfigs_ImageIds = string[];

/**
 * Image Config Cache - Resolve Image Config.
 *
 * @since 1.1.0
 */
export type ImageConfigCache_ResolveImageConfig_ImageId = string;

export type ImageConfigCache_ResolveImageConfig_Engine = Pick<DockerEngine, 'inspectImage'>;

export type ImageConfigCache_ResolveImageConfig_Cache = Pick<Runner, 'find' | 'remember'>;

export type ImageConfigCache_ResolveImageConfig_Returns = Promise<DockerContainerConfig | undefined>;

export type ImageConfigCache_ResolveImageConfig_Image = DockerImageInspect | undefined;

export type ImageConfigCache_ResolveImageConfig_Config = DockerContainerConfig | undefined;

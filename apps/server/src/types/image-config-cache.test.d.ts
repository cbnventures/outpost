import type {
  DockerContainerConfig,
  DockerEngine,
} from 'outpost-package-docker-engine';
import type { Mock } from 'vitest';

import type { Runner as Handoff } from '../handoff.js';
import type { Runner } from '../image-config-cache.js';

/**
 * Image Config Cache.
 *
 * @since 1.1.0
 */
export type ImageConfigCache_Directory = string;

export type ImageConfigCache_ImageConfig = DockerContainerConfig;

export type ImageConfigCache_Cache = Runner;

export type ImageConfigCache_Engine = {
  inspectImage: Mock<DockerEngine['inspectImage']>;
};

export type ImageConfigCache_PruneEngine = {
  listContainers: Mock<DockerEngine['listContainers']>;
};

export type ImageConfigCache_PruneHandoff = {
  read: Mock<Handoff['read']>;
};

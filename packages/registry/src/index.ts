export { encodeRegistryAuth, findCredentials } from './credentials.js';
export { fetchRemoteDigest } from './digest.js';
export { DOCKER_HUB_REGISTRY, parseImageReference } from './reference.js';

export type {
  Shared_Credentials as RegistryCredentials,
  Shared_ImageReference as ImageReference,
} from './types/shared.d.ts';

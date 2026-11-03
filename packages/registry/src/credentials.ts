import { DOCKER_HUB_REGISTRY } from './reference.js';

import type {
  Credentials_EncodeRegistryAuth_Credentials,
  Credentials_EncodeRegistryAuth_Registry,
  Credentials_EncodeRegistryAuth_Returns,
  Credentials_NormalizeRegistryHost_Host,
  Credentials_NormalizeRegistryHost_Registry,
  Credentials_NormalizeRegistryHost_Returns,
  Credentials_NormalizeRegistryHost_SlashIndex,
} from './types/credentials.d.ts';

/**
 * Credentials - Docker Hub Hosts.
 *
 * Names Docker Hub goes by in image references, "docker login", and its
 * registry API. A sign-in saved under any of them belongs to Docker Hub.
 *
 * @since 1.0.0
 */
const dockerHubHosts = [
  'docker.io',
  'index.docker.io',
  DOCKER_HUB_REGISTRY,
];

/**
 * Credentials - Encode Registry Auth.
 *
 * Builds the X-Registry-Auth header value the Docker Engine expects when
 * pulling from a private registry: base64url-encoded JSON credentials.
 *
 * @param {Credentials_EncodeRegistryAuth_Credentials} credentials - Credentials.
 * @param {Credentials_EncodeRegistryAuth_Registry}    registry    - Registry.
 *
 * @returns {Credentials_EncodeRegistryAuth_Returns}
 *
 * @since 0.0.1
 */
export function encodeRegistryAuth(credentials: Credentials_EncodeRegistryAuth_Credentials, registry: Credentials_EncodeRegistryAuth_Registry): Credentials_EncodeRegistryAuth_Returns {
  if (credentials === undefined) {
    return undefined;
  }

  return Buffer.from(JSON.stringify({
    username: credentials['username'],
    password: credentials['password'],
    serveraddress: (registry === DOCKER_HUB_REGISTRY) ? 'https://index.docker.io/v1/' : registry,
  })).toString('base64url');
}

/**
 * Credentials - Normalize Registry Host.
 *
 * Reduces a registry, as typed for a sign-in or parsed from an image name, to
 * the host its sign-in is saved under. Letter case, a scheme, and any path
 * are dropped, and every Docker Hub name becomes docker.io.
 *
 * @param {Credentials_NormalizeRegistryHost_Registry} registry - Registry.
 *
 * @returns {Credentials_NormalizeRegistryHost_Returns}
 *
 * @since 1.0.0
 */
export function normalizeRegistryHost(registry: Credentials_NormalizeRegistryHost_Registry): Credentials_NormalizeRegistryHost_Returns {
  let host: Credentials_NormalizeRegistryHost_Host = registry.trim().toLowerCase();

  if (host.startsWith('https://') === true) {
    host = host.slice('https://'.length);
  } else if (host.startsWith('http://') === true) {
    host = host.slice('http://'.length);
  }

  // A path such as the "/v1/" in Docker Hub's legacy index URL isn't part of the host.
  const slashIndex: Credentials_NormalizeRegistryHost_SlashIndex = host.indexOf('/');

  if (slashIndex !== -1) {
    host = host.slice(0, slashIndex);
  }

  return (dockerHubHosts.includes(host) === true) ? 'docker.io' : host;
}

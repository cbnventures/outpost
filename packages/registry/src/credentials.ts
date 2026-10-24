import { existsSync, readFileSync } from 'node:fs';

import { DOCKER_HUB_REGISTRY } from './reference.js';
import { dockerConfigSchema } from './schema.js';

import type {
  Credentials_EncodeRegistryAuth_Credentials,
  Credentials_EncodeRegistryAuth_Registry,
  Credentials_EncodeRegistryAuth_Returns,
  Credentials_FindCredentials_Auths,
  Credentials_FindCredentials_Candidates,
  Credentials_FindCredentials_ConfigPath,
  Credentials_FindCredentials_Decoded,
  Credentials_FindCredentials_Entry,
  Credentials_FindCredentials_Registry,
  Credentials_FindCredentials_Returns,
  Credentials_FindCredentials_SeparatorIndex,
} from './types/credentials.d.ts';

/**
 * Credentials - Find Credentials.
 *
 * Looks up the username and password for a registry in a Docker client
 * config.json, the same file "docker login" writes. Returns undefined for
 * anonymous access or when the file is missing.
 *
 * @param {Credentials_FindCredentials_ConfigPath} configPath - Config path.
 * @param {Credentials_FindCredentials_Registry}   registry   - Registry.
 *
 * @returns {Credentials_FindCredentials_Returns}
 *
 * @since 0.0.1
 */
export function findCredentials(configPath: Credentials_FindCredentials_ConfigPath, registry: Credentials_FindCredentials_Registry): Credentials_FindCredentials_Returns {
  if (existsSync(configPath) === false) {
    return undefined;
  }

  const auths: Credentials_FindCredentials_Auths = dockerConfigSchema.parse(JSON.parse(readFileSync(configPath, 'utf-8')))['auths'] ?? {};

  // Docker Hub logins are stored under the legacy index URL.
  const candidates: Credentials_FindCredentials_Candidates = (registry === DOCKER_HUB_REGISTRY) ? [
    'https://index.docker.io/v1/',
    'index.docker.io',
    'docker.io',
    registry,
  ] : [
    registry,
    `https://${registry}`,
    `https://${registry}/`,
  ];

  for (const candidate of candidates) {
    const entry: Credentials_FindCredentials_Entry = auths[candidate];

    if (entry === undefined) {
      continue;
    }

    if (entry['username'] !== undefined && entry['password'] !== undefined) {
      return {
        username: entry['username'],
        password: entry['password'],
      };
    }

    if (entry['auth'] !== undefined) {
      const decoded: Credentials_FindCredentials_Decoded = Buffer.from(entry['auth'], 'base64').toString('utf-8');
      const separatorIndex: Credentials_FindCredentials_SeparatorIndex = decoded.indexOf(':');

      if (separatorIndex > 0) {
        return {
          username: decoded.slice(0, separatorIndex),
          password: decoded.slice(separatorIndex + 1),
        };
      }
    }
  }

  return undefined;
}

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

import {
  describe,
  expect,
  it,
} from 'vitest';

import { normalizeRegistryHost } from './credentials.js';
import { DOCKER_HUB_REGISTRY } from './reference.js';

import type {
  Credentials_NormalizeRegistryHost_FilesEveryDockerHubNameUnderDockerIo_Host,
  Credentials_NormalizeRegistryHost_KeepsTheHostAndPortOfAnyOtherRegistry_Host,
} from './types/credentials.test.d.ts';

/**
 * Credentials - Normalize Registry Host.
 *
 * Confirms a typed registry and an image's registry reduce to the same host,
 * so a sign-in saved under one name is found for images that use another.
 *
 * @since 1.0.0
 */
describe('normalizeRegistryHost', () => {
  it('keeps the host and port of any other registry', () => {
    const host: Credentials_NormalizeRegistryHost_KeepsTheHostAndPortOfAnyOtherRegistry_Host = normalizeRegistryHost('  https://Registry.Example.com:5000/v2/  ');

    expect(host).toBe('registry.example.com:5000');

    expect(normalizeRegistryHost('http://localhost:5000')).toBe('localhost:5000');

    expect(normalizeRegistryHost('GHCR.io/')).toBe('ghcr.io');

    expect(normalizeRegistryHost('ghcr.io')).toBe('ghcr.io');

    return;
  });

  it('files every Docker Hub name under docker.io', () => {
    const host: Credentials_NormalizeRegistryHost_FilesEveryDockerHubNameUnderDockerIo_Host = normalizeRegistryHost(DOCKER_HUB_REGISTRY);

    expect(host).toBe('docker.io');

    for (const registry of [
      'docker.io',
      'Index.Docker.io',
      'registry-1.docker.io',
      'https://index.docker.io/v1/',
    ]) {
      expect(normalizeRegistryHost(registry)).toBe('docker.io');
    }

    return;
  });

  return;
});

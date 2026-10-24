import {
  describe,
  expect,
  it,
} from 'vitest';

import { parseImageReference } from './reference.js';

import type {
  Reference_ParseImageReference_AppliesDockerHubDefaults_Reference,
  Reference_ParseImageReference_KeepsRegistryHostsAndDigests_Reference,
} from './types/reference.test.d.ts';

/**
 * Reference - Parse Image Reference.
 *
 * Covers Docker Hub defaults, explicit registry hosts with ports, and
 * digest-pinned references.
 *
 * @since 0.0.1
 */
describe('parseImageReference', () => {
  it('applies Docker Hub defaults', () => {
    const reference: Reference_ParseImageReference_AppliesDockerHubDefaults_Reference = parseImageReference('nginx');

    expect(reference).toStrictEqual({
      registry: 'registry-1.docker.io',
      repository: 'library/nginx',
      tag: 'latest',
      digest: undefined,
    });

    expect(parseImageReference('docker.io/grafana/grafana:11')['repository']).toBe('grafana/grafana');

    return;
  });

  it('keeps registry hosts and digests', () => {
    const reference: Reference_ParseImageReference_KeepsRegistryHostsAndDigests_Reference = parseImageReference('localhost:5000/team/app:2.1@sha256:abc');

    expect(reference).toStrictEqual({
      registry: 'localhost:5000',
      repository: 'team/app',
      tag: '2.1',
      digest: 'sha256:abc',
    });

    expect(parseImageReference('ghcr.io/cbnventures/outpost')['tag']).toBe('latest');

    return;
  });

  return;
});

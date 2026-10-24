import {
  describe,
  expect,
  it,
} from 'vitest';

import { selectContainers, sortByDependencies } from './select.js';

import type {
  Select_Containers,
  Select_SelectContainers_AppliesLabelModesAndSkipsSelf_Selection,
  Select_SortByDependencies_UpdatesDependenciesFirst_Names,
} from './types/select.test.d.ts';

/**
 * Select - Containers.
 *
 * Running containers covering each selection rule: plain, opted out,
 * opted in, digest-pinned, Outpost itself, and a Compose pair.
 *
 * @since 0.0.1
 */
const containers: Select_Containers = [
  {
    Id: 'aaa1',
    Names: ['/app'],
    Image: 'example/app:1',
    ImageID: 'sha256:1',
    Labels: {
      'com.docker.compose.project': 'shop',
      'com.docker.compose.service': 'app',
      'com.docker.compose.depends_on': 'db:service_healthy:false',
    },
    State: 'running',
  },
  {
    Id: 'bbb2',
    Names: ['/db'],
    Image: 'postgres:17',
    ImageID: 'sha256:2',
    Labels: {
      'com.docker.compose.project': 'shop',
      'com.docker.compose.service': 'db',
      'io.cbnventures.outpost.enable': 'true',
    },
    State: 'running',
  },
  {
    Id: 'ccc3',
    Names: ['/legacy'],
    Image: 'legacy:1',
    ImageID: 'sha256:3',
    Labels: { 'io.cbnventures.outpost.enable': 'false' },
    State: 'running',
  },
  {
    Id: 'ddd4',
    Names: ['/pinned'],
    Image: 'redis@sha256:abc',
    ImageID: 'sha256:4',
    Labels: {},
    State: 'running',
  },
  {
    Id: 'eee5',
    Names: ['/outpost'],
    Image: 'cbnventures/outpost:latest',
    ImageID: 'sha256:5',
    Labels: {},
    State: 'running',
  },
];

/**
 * Select - Containers.
 *
 * Checks both label modes against the same container list, plus the
 * skip for Outpost's own container.
 *
 * @since 0.0.1
 */
describe('selectContainers', () => {
  it('applies label modes and skips self', () => {
    const selection: Select_SelectContainers_AppliesLabelModesAndSkipsSelf_Selection = selectContainers(containers, {
      labelMode: 'opt-out',
      selfId: 'eee5',
    });

    expect(selection['candidates'].map((candidate) => candidate['Id'])).toStrictEqual([
      'aaa1',
      'bbb2',
      'ddd4',
    ]);

    expect(selection['skipped'].map((skipped) => skipped['container'])).toStrictEqual(['outpost']);

    expect(selectContainers(containers, {
      labelMode: 'opt-in',
      selfId: undefined,
    })['candidates'].map((candidate) => candidate['Id'])).toStrictEqual(['bbb2']);

    return;
  });

  return;
});

/**
 * Select - Sort By Dependencies.
 *
 * Checks that a Compose dependency is updated before the service that
 * depends on it.
 *
 * @since 0.0.1
 */
describe('sortByDependencies', () => {
  it('updates dependencies first', () => {
    const names: Select_SortByDependencies_UpdatesDependenciesFirst_Names = sortByDependencies(containers.slice(0, 2)).map((container) => container['Names'][0] ?? '');

    expect(names).toStrictEqual([
      '/db',
      '/app',
    ]);

    return;
  });

  return;
});

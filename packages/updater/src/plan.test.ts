import {
  describe,
  expect,
  it,
} from 'vitest';

import { buildCreatePlan } from './plan.js';

import type {
  Plan_BuildCreatePlan_CarriesUserSettingsAndDropsImageDefaults_Plan,
  Plan_BuildCreatePlan_Container,
  Plan_BuildCreatePlan_ImageConfig,
} from './types/plan.test.d.ts';

/**
 * Plan - Container.
 *
 * Inspected container with user-set env, an anonymous volume, a named
 * bind, and two Compose networks.
 *
 * @since 0.0.1
 */
const container: Plan_BuildCreatePlan_Container = {
  Id: 'abcdef1234567890',
  Name: '/web',
  Image: 'sha256:old',
  Config: {
    Image: 'nginx:1',
    Hostname: 'abcdef123456',
    Env: [
      'PATH=/usr/bin',
      'NGINX_VERSION=1.0',
      'SITE=example',
    ],
    Labels: {
      'maintainer': 'nginx',
      'com.docker.compose.service': 'web',
    },
    Cmd: [
      'nginx',
      '-g',
      'daemon off;',
    ],
    ExposedPorts: { '80/tcp': {} },
  },
  HostConfig: {
    NetworkMode: 'app_default',
    Binds: ['/srv/site:/usr/share/nginx/html:ro'],
  },
  NetworkSettings: {
    Networks: {
      app_default: {
        Aliases: [
          'web',
          'abcdef123456',
        ],
      },
      app_backend: { Aliases: ['web'] },
    },
  },
  Mounts: [
    {
      Type: 'bind',
      Source: '/srv/site',
      Destination: '/usr/share/nginx/html',
      RW: false,
    },
    {
      Type: 'volume',
      Name: 'f00dcafe',
      Destination: '/var/cache/nginx',
      RW: true,
    },
  ],
  State: {
    Running: true,
    Status: 'running',
  },
};

/**
 * Plan - Image Config.
 *
 * Defaults of the image the container currently runs, which the plan
 * must drop so the new image's defaults take over.
 *
 * @since 0.0.1
 */
const imageConfig: Plan_BuildCreatePlan_ImageConfig = {
  Env: [
    'PATH=/usr/bin',
    'NGINX_VERSION=1.0',
  ],
  Labels: { maintainer: 'nginx' },
  Cmd: [
    'nginx',
    '-g',
    'daemon off;',
  ],
  ExposedPorts: { '80/tcp': {} },
};

/**
 * Plan - Build Create Plan.
 *
 * Confirms recreation keeps user intent, reattaches anonymous volumes,
 * and lets the new image's defaults apply.
 *
 * @since 0.0.1
 */
describe('buildCreatePlan', () => {
  it('carries user settings and drops image defaults', () => {
    const plan: Plan_BuildCreatePlan_CarriesUserSettingsAndDropsImageDefaults_Plan = buildCreatePlan(container, imageConfig, 'nginx:1');

    expect(plan['name']).toBe('web');

    expect(plan['body']).toMatchObject({
      Image: 'nginx:1',
      Env: ['SITE=example'],
      Labels: { 'com.docker.compose.service': 'web' },
      ExposedPorts: {},
      HostConfig: {
        Binds: [
          '/srv/site:/usr/share/nginx/html:ro',
          'f00dcafe:/var/cache/nginx',
        ],
      },
      NetworkingConfig: { EndpointsConfig: { app_default: { Aliases: ['web'] } } },
    });

    expect(plan['body']).not.toHaveProperty('Hostname');

    expect(plan['body']).not.toHaveProperty('Cmd');

    expect(plan['extraNetworks']).toStrictEqual([{
      name: 'app_backend',
      endpoint: { Aliases: ['web'] },
    }]);

    return;
  });

  return;
});

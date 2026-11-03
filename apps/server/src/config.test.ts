import {
  describe,
  expect,
  it,
} from 'vitest';

import {
  applyRuntimeSettings,
  loadConfig,
  readSelfId,
  runtimeSettingsFromConfig,
} from './config.js';

import type {
  Config_LoadConfig_AppliesDefaults_Config,
  Config_LoadConfig_ReadsBootstrapOverrides_Config,
  Config_ReadSelfId_UsesProcessMetadata_ContainerId,
  Config_RuntimeSettings_AppliesDatabaseBackedValues_Config,
  Config_RuntimeSettings_AppliesDatabaseBackedValues_Settings,
} from './types/config.test.d.ts';

/**
 * Config - Load Config.
 *
 * Checks defaults for a bare environment, overrides, and that invalid
 * values stop startup instead of being ignored.
 *
 * @since 0.0.1
 */
describe('loadConfig', () => {
  it('applies defaults', () => {
    const config: Config_LoadConfig_AppliesDefaults_Config = loadConfig({});

    expect(config).toMatchObject({
      port: 22601,
      dockerHost: 'unix:///var/run/docker.sock',
      schedule: '0 0 4 * * *',
      runOnStart: false,
      dataDirectory: '/data',
      updater: {
        labelMode: 'opt-out',
        monitorOnly: false,
        cleanup: true,
      },
    });

    return;
  });

  it('reads bootstrap overrides', () => {
    const config: Config_LoadConfig_ReadsBootstrapOverrides_Config = loadConfig({
      DOCKER_HOST: 'tcp://docker:2375',
      HOSTNAME: 'abcdef123456',
      OUTPOST_DATA_DIRECTORY: '/var/lib/outpost',
      PORT: '8080',
    });

    expect(config).toMatchObject({
      dataDirectory: '/var/lib/outpost',
      dockerHost: 'tcp://docker:2375',
      port: 8080,
      updater: {
        selfId: 'abcdef123456',
      },
    });

    expect(() => loadConfig({ PORT: '-1' })).toThrow('PORT must be a positive integer');

    return;
  });

  return;
});

/**
 * Config - Runtime Settings.
 *
 * Confirms database values mutate the live config and round-trip without
 * bootstrap paths.
 * Bootstrap-only values remain outside the persisted behavior document.
 *
 * @since 1.0.0
 */
describe('runtime settings', () => {
  it('applies database-backed values', () => {
    const config: Config_RuntimeSettings_AppliesDatabaseBackedValues_Config = loadConfig({});
    const settings: Config_RuntimeSettings_AppliesDatabaseBackedValues_Settings = {
      cleanup: false,
      healthTimeoutSeconds: 240,
      labelMode: 'opt-in',
      monitorOnly: true,
      runOnStart: true,
      schedule: '0 30 3 * * *',
      settleSeconds: 20,
      stopTimeoutSeconds: 45,
    };

    applyRuntimeSettings(config, settings);

    expect(runtimeSettingsFromConfig(config)).toEqual(settings);

    return;
  });

  return;
});

/**
 * Config - Read Self ID.
 *
 * Ensures process metadata wins over HOSTNAME so host networking or a
 * custom hostname cannot hide Outpost from its own selection guard.
 *
 * @since 1.0.0
 */
describe('readSelfId', () => {
  it('uses process metadata before the hostname fallback', () => {
    const containerId: Config_ReadSelfId_UsesProcessMetadata_ContainerId = 'a'.repeat(64);

    expect(readSelfId('host-name', (path) => (path.endsWith('cgroup') === true) ? `0::/docker/${containerId}` : '')).toBe(containerId);

    expect(readSelfId('abcdef123456', () => '')).toBe('abcdef123456');

    expect(readSelfId('host-name', () => '')).toBeUndefined();

    return;
  });

  return;
});

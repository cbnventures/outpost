import {
  describe,
  expect,
  it,
} from 'vitest';

import { loadConfig } from './config.js';

import type {
  Config_LoadConfig_AppliesDefaults_Config,
  Config_LoadConfig_ReadsOverridesAndRejectsTypos_Config,
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
      port: 3000,
      dockerHost: 'unix:///var/run/docker.sock',
      schedule: '0 0 4 * * *',
      runOnStart: false,
      apiToken: undefined,
      trustProxy: false,
      updater: {
        labelMode: 'opt-out',
        monitorOnly: false,
        cleanup: true,
        dockerConfigPath: '/config/config.json',
      },
    });

    return;
  });

  it('reads overrides and rejects typos', () => {
    const config: Config_LoadConfig_ReadsOverridesAndRejectsTypos_Config = loadConfig({
      OUTPOST_LABEL_MODE: 'opt-in',
      OUTPOST_MONITOR_ONLY: 'true',
      OUTPOST_STOP_TIMEOUT: '60',
      OUTPOST_NTFY_URL: 'https://ntfy.test/outpost',
      HOSTNAME: 'abc123',
    });

    expect(config['updater']).toMatchObject({
      labelMode: 'opt-in',
      monitorOnly: true,
      stopTimeoutSeconds: 60,
      selfId: 'abc123',
      notificationTargets: { ntfyUrl: 'https://ntfy.test/outpost' },
    });

    expect(() => loadConfig({ OUTPOST_CLEANUP: 'yes' })).toThrow('OUTPOST_CLEANUP must be "true" or "false"');

    expect(() => loadConfig({ OUTPOST_STOP_TIMEOUT: '-1' })).toThrow('OUTPOST_STOP_TIMEOUT must be a positive integer');

    expect(() => loadConfig({ OUTPOST_LABEL_MODE: 'all' })).toThrow('OUTPOST_LABEL_MODE');

    return;
  });

  return;
});

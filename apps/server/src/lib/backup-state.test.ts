import {
  mkdtempSync,
  rmSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
/* eslint-disable-next-line n/no-unsupported-features/node-builtins -- The image's Node.js release ships node:sqlite, but the rule still marks it experimental. */
import { DatabaseSync } from 'node:sqlite';

import {
  afterEach,
  describe,
  expect,
  it,
} from 'vitest';

import { sha256HashPattern } from '../regex.js';
import { Runner as State } from './state.js';

import type {
  Lib_BackupStateTest_CreatedToken,
  Lib_BackupStateTest_Database,
  Lib_BackupStateTest_Directory,
  Lib_BackupStateTest_Document,
  Lib_BackupStateTest_Result,
  Lib_BackupStateTest_Serialized,
  Lib_BackupStateTest_Settings,
  Lib_BackupStateTest_SetupClaim,
  Lib_BackupStateTest_State,
} from '../types/lib/backup-state.test.d.ts';

/**
 * Lib - Backup State - Current Settings.
 *
 * Supplies the baseline runtime configuration for export and import tests.
 * Individual cases copy it before changing selected values.
 *
 * @since 1.1.0
 */
const currentSettings: Lib_BackupStateTest_Settings = {
  cleanup: true,
  healthTimeoutSeconds: 120,
  labelMode: 'opt-out',
  monitorOnly: false,
  runOnStart: false,
  schedule: '0 0 4 * * *',
  settleSeconds: 10,
  stopTimeoutSeconds: 30,
};

/**
 * Lib - Backup State - Directory.
 *
 * Tracks the temporary database owned by the active test.
 * Cleanup removes it after every case, including failures.
 *
 * @since 1.1.0
 */
let directory: Lib_BackupStateTest_Directory = '';

afterEach(() => {
  if (directory !== '') {
    rmSync(directory, {
      force: true,
      recursive: true,
    });
    directory = '';
  }

  return;
});

describe('backup state', () => {
  it('exports selected configuration with secrets and no account data', async () => {
    directory = mkdtempSync(join(tmpdir(), 'outpost-backup-export-'));
    const state: Lib_BackupStateTest_State = new State(directory);
    const setupClaim: Lib_BackupStateTest_SetupClaim = state.prepareSetupClaim();

    if (setupClaim === undefined) {
      throw new Error('The state did not issue a setup claim.');
    }

    await state.claimInstallation(setupClaim['code'], 'backup-admin', 'fixture administrator secret');

    state.setRuntimeSettings(currentSettings);

    state.createRegistry({
      password: 'registry secret',
      registry: 'registry.example.net',
      username: 'registry-user',
    });

    state.createNotificationTarget({
      events: ['update-failed'],
      name: 'Ops alerts',
      secrets: { url: 'https://hooks.example.net/outpost' },
      service: 'webhook',
      settings: {},
    });
    const createdToken: Lib_BackupStateTest_CreatedToken = state.createToken({
      name: 'Backup automation',
      scopes: ['status:read'],
    });

    if (createdToken === undefined) {
      throw new Error('The state did not create an access token.');
    }

    const document: Lib_BackupStateTest_Document = state.createBackupDocument({
      accessTokens: true,
      notifications: true,
      registries: true,
      settings: true,
    }, '1.0.4-test', currentSettings);
    const serialized: Lib_BackupStateTest_Serialized = JSON.stringify(document);

    expect(document['settings']).toEqual(currentSettings);

    expect(document['registries']).toEqual([expect.objectContaining({
      password: 'registry secret',
      registry: 'registry.example.net',
    })]);

    expect(document['notifications']).toEqual([expect.objectContaining({
      name: 'Ops alerts',
      secrets: { url: 'https://hooks.example.net/outpost' },
    })]);

    expect(document['accessTokens']).toEqual([expect.objectContaining({
      name: 'Backup automation',
      tokenHash: expect.stringMatching(sha256HashPattern),
    })]);

    expect(serialized).not.toContain('backup-admin');

    expect(serialized).not.toContain('fixture administrator secret');

    expect(serialized).not.toContain(createdToken['personalAccessToken']);

    expect(serialized).not.toContain('browser_sessions');

    state.close();

    return;
  });

  it('adds, replaces, and skips duplicates in one import', () => {
    directory = mkdtempSync(join(tmpdir(), 'outpost-backup-apply-'));
    const state: Lib_BackupStateTest_State = new State(directory);

    state.setRuntimeSettings(currentSettings);

    state.createRegistry({
      password: 'old registry secret',
      registry: 'registry.example.net',
      username: 'old-user',
    });

    state.createNotificationTarget({
      events: ['update-failed'],
      name: 'Ops alerts',
      secrets: { url: 'https://old.example.net/hook' },
      service: 'webhook',
      settings: {},
    });

    state.createToken({
      name: 'Existing token',
      scopes: ['status:read'],
    });

    const existing: Lib_BackupStateTest_Document = state.createBackupDocument({
      accessTokens: true,
      notifications: false,
      registries: false,
      settings: false,
    }, '1.0.4-test', currentSettings);
    const nextSettings: Lib_BackupStateTest_Settings = {
      ...currentSettings,
      cleanup: false,
      monitorOnly: true,
    };
    const document: Lib_BackupStateTest_Document = {
      accessTokens: [
        ...(existing['accessTokens'] ?? []),
        {
          createdAt: '2026-11-09T12:00:00.000Z',
          expiresAt: null,
          id: 'tok-1111111111111111',
          lastUsedAt: null,
          name: 'Imported token',
          scopes: ['updates:run'],
          tokenHash: '1'.repeat(64),
        },
      ],
      appVersion: '1.0.3',
      exportedAt: '2026-11-09T12:00:00.000Z',
      format: 'outpost-export',
      notifications: [
        {
          events: ['update-failed'],
          id: 'ntf-1111111111111111',
          missingSecrets: [],
          name: 'Ops alerts',
          secrets: { url: 'https://new.example.net/hook' },
          service: 'webhook',
          settings: {},
        },
        {
          events: ['updates-applied'],
          id: 'ntf-2222222222222222',
          missingSecrets: [],
          name: 'Release alerts',
          secrets: {},
          service: 'ntfy',
          settings: { url: 'https://ntfy.example.net/releases' },
        },
      ],
      registries: [
        {
          id: 'reg-1111111111111111',
          password: 'new registry secret',
          registry: 'registry.example.net',
          username: 'new-user',
        },
        {
          id: 'reg-2222222222222222',
          password: 'second registry secret',
          registry: 'images.example.net',
          username: 'image-user',
        },
      ],
      settings: nextSettings,
      version: 1,
    };
    const result: Lib_BackupStateTest_Result = state.applyBackupImport(document, currentSettings);
    const exported: Lib_BackupStateTest_Document = state.createBackupDocument({
      accessTokens: true,
      notifications: true,
      registries: true,
      settings: true,
    }, '1.0.4-test', nextSettings);

    expect(result).toEqual(expect.objectContaining({
      accessTokens: {
        added: 1,
        skipped: 1,
      },
      notifications: {
        added: 1,
        replaced: 1,
      },
      registries: {
        added: 1,
        replaced: 1,
      },
      settings: { changed: 2 },
    }));

    expect(exported['registries']).toEqual(expect.arrayContaining([
      expect.objectContaining({
        password: 'new registry secret',
        registry: 'registry.example.net',
        username: 'new-user',
      }),
      expect.objectContaining({
        password: 'second registry secret',
        registry: 'images.example.net',
      }),
    ]));

    expect(exported['notifications']).toEqual(expect.arrayContaining([
      expect.objectContaining({
        name: 'Ops alerts',
        secrets: { url: 'https://new.example.net/hook' },
      }),
      expect.objectContaining({ name: 'Release alerts' }),
    ]));

    expect(exported['accessTokens']).toHaveLength(2);

    expect(state.getRuntimeSettings(currentSettings)).toEqual(nextSettings);

    state.close();

    return;
  });

  it('rolls back every section when one imported row fails', () => {
    directory = mkdtempSync(join(tmpdir(), 'outpost-backup-rollback-'));
    const state: Lib_BackupStateTest_State = new State(directory);
    const database: Lib_BackupStateTest_Database = new DatabaseSync(join(directory, 'database', 'outpost.sqlite3'));

    state.setRuntimeSettings(currentSettings);

    database.exec('CREATE TRIGGER backup_import_failure BEFORE INSERT ON notification_targets WHEN NEW.name = \'Trigger rollback\' BEGIN SELECT RAISE(ABORT, \'fixture rollback\'); END;');

    database.close();

    const document: Lib_BackupStateTest_Document = {
      appVersion: '1.0.3',
      exportedAt: '2026-11-09T12:00:00.000Z',
      format: 'outpost-export',
      notifications: [{
        events: ['update-failed'],
        id: 'ntf-3333333333333333',
        missingSecrets: [],
        name: 'Trigger rollback',
        secrets: { url: 'https://hooks.example.net/failure' },
        service: 'webhook',
        settings: {},
      }],
      registries: [{
        id: 'reg-3333333333333333',
        password: 'rollback secret',
        registry: 'rollback.example.net',
        username: 'rollback-user',
      }],
      settings: {
        ...currentSettings,
        cleanup: false,
      },
      version: 1,
    };

    expect(() => state.applyBackupImport(document, currentSettings)).toThrow('fixture rollback');

    expect(state.getRuntimeSettings(currentSettings)).toEqual(currentSettings);

    expect(state.getRegistries()).toEqual([]);

    expect(state.getNotificationTargets()).toEqual([]);

    state.close();

    return;
  });

  return;
});

import {
  describe,
  expect,
  it,
} from 'vitest';

import {
  backupDocumentSchema as serverBackupDocumentSchema,
  GrantStore,
} from './backup.js';

import type {
  Lib_BackupTest_Document,
  Lib_BackupTest_Grant,
  Lib_BackupTest_Now,
  Lib_BackupTest_Store,
  Lib_BackupTest_UnknownDocument,
} from '../types/lib/backup.test.d.ts';

/**
 * Lib - Backup - Valid Document.
 *
 * Supplies the smallest valid settings export shared by strict-schema tests.
 * Individual cases add untrusted fields or duplicate identities.
 *
 * @since 1.1.0
 */
const validDocument: Lib_BackupTest_Document = {
  appVersion: '1.0.4',
  exportedAt: '2026-11-09T12:00:00.000Z',
  format: 'outpost-export',
  settings: {
    cleanup: true,
    healthTimeoutSeconds: 120,
    labelMode: 'opt-out',
    monitorOnly: false,
    runOnStart: false,
    schedule: '0 0 4 * * *',
    settleSeconds: 10,
    stopTimeoutSeconds: 30,
  },
  version: 1,
};

describe('backup confirmation grants', () => {
  it('expires after five minutes', () => {
    let now: Lib_BackupTest_Now = Date.parse('2026-11-09T12:00:00.000Z');
    const store: Lib_BackupTest_Store = new GrantStore(() => now);
    const issued: Lib_BackupTest_Grant = store.issue('session-one', 'export');

    now += (5 * 60 * 1000) + 1;

    expect(store.consume(issued['grant'], 'session-one', 'export')).toBe(false);

    return;
  });

  it('is single use and bound to its browser session and purpose', () => {
    const store: Lib_BackupTest_Store = new GrantStore();
    const issued: Lib_BackupTest_Grant = store.issue('session-one', 'import');

    expect(store.consume(issued['grant'], 'session-two', 'import')).toBe(false);

    expect(store.consume(issued['grant'], 'session-one', 'export')).toBe(false);

    expect(store.consume(issued['grant'], 'session-one', 'import')).toBe(true);

    expect(store.consume(issued['grant'], 'session-one', 'import')).toBe(false);

    return;
  });

  return;
});

describe('backup document validation', () => {
  it('accepts every portable section with its plain-text secret values', () => {
    const portableDocument: Lib_BackupTest_Document = {
      ...validDocument,
      accessTokens: [{
        createdAt: '2026-11-09T12:00:00.000Z',
        expiresAt: null,
        id: 'tok-1111111111111111',
        lastUsedAt: null,
        name: 'Status reader',
        scopes: ['status:read'],
        tokenHash: '1'.repeat(64),
      }],
      notifications: [{
        events: ['update-failed'],
        id: 'ntf-1111111111111111',
        missingSecrets: [],
        name: 'Ops alerts',
        secrets: { url: 'https://hooks.example.net/outpost' },
        service: 'webhook',
        settings: {},
      }],
      registries: [{
        id: 'reg-1111111111111111',
        password: 'registry secret',
        registry: 'registry.example.net',
        username: 'registry-user',
      }],
    };

    expect(serverBackupDocumentSchema.safeParse(portableDocument).success).toBe(true);

    return;
  });

  it('rejects unknown top-level and nested fields in the server and browser', () => {
    const unknownTopLevel: Lib_BackupTest_UnknownDocument = {
      ...validDocument,
      administrator: { password: 'must-not-import' },
    };
    const unknownNested: Lib_BackupTest_UnknownDocument = {
      ...validDocument,
      settings: {
        ...validDocument['settings'],
        dockerHost: 'must-not-import',
      },
    };

    expect(serverBackupDocumentSchema.safeParse(unknownTopLevel).success).toBe(false);

    expect(serverBackupDocumentSchema.safeParse(unknownNested).success).toBe(false);

    return;
  });

  it('rejects empty files and duplicate registry, target, or token identities', () => {
    const emptyDocument: Lib_BackupTest_UnknownDocument = {
      appVersion: validDocument['appVersion'],
      exportedAt: validDocument['exportedAt'],
      format: validDocument['format'],
      version: validDocument['version'],
    };
    const duplicateDocument: Lib_BackupTest_UnknownDocument = {
      ...validDocument,
      registries: [
        {
          id: 'reg-1111111111111111',
          password: 'one',
          registry: 'registry.example.net',
          username: 'one',
        },
        {
          id: 'reg-2222222222222222',
          password: 'two',
          registry: 'REGISTRY.EXAMPLE.NET',
          username: 'two',
        },
      ],
    };

    expect(serverBackupDocumentSchema.safeParse(emptyDocument).success).toBe(false);

    expect(serverBackupDocumentSchema.safeParse(duplicateDocument).success).toBe(false);

    return;
  });

  return;
});

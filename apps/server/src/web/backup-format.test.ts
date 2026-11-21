import {
  describe,
  expect,
  it,
} from 'vitest';

import { backupDocumentSchema } from '@/web/backup-format.ts';

import type {
  Web_BackupFormatTest_Document,
  Web_BackupFormatTest_UnknownDocument,
} from '@/types/web/backup-format.test.d.ts';

/**
 * Backup Format - Valid Document.
 *
 * Supplies a minimal version-one export for strict browser-schema tests.
 * Each case derives one invalid document without mutating the fixture.
 *
 * @since 1.1.0
 */
const validDocument: Web_BackupFormatTest_Document = {
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

describe('browser backup format', () => {
  it('rejects unknown fields, empty documents, and duplicate identities', () => {
    const unknownTopLevel: Web_BackupFormatTest_UnknownDocument = {
      ...validDocument,
      administrator: { password: 'must-not-import' },
    };
    const unknownNested: Web_BackupFormatTest_UnknownDocument = {
      ...validDocument,
      settings: {
        ...validDocument['settings'],
        dockerHost: 'must-not-import',
      },
    };
    const emptyDocument: Web_BackupFormatTest_UnknownDocument = {
      appVersion: validDocument['appVersion'],
      exportedAt: validDocument['exportedAt'],
      format: validDocument['format'],
      version: validDocument['version'],
    };
    const duplicateDocument: Web_BackupFormatTest_UnknownDocument = {
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

    expect(backupDocumentSchema.safeParse(unknownTopLevel).success).toBe(false);

    expect(backupDocumentSchema.safeParse(unknownNested).success).toBe(false);

    expect(backupDocumentSchema.safeParse(emptyDocument).success).toBe(false);

    expect(backupDocumentSchema.safeParse(duplicateDocument).success).toBe(false);

    return;
  });

  return;
});

import { z } from 'zod';

import { notificationServices } from '@/web/notification-services.ts';

import type { Web_Api_Schema } from '@/types/web/api.d.ts';
import type { Web_Backup_Document } from '@/types/web/backup.d.ts';

/**
 * Backup Format - Event schema.
 *
 * Enumerates every notification event portable Outpost targets can subscribe to.
 * Unknown or removed event names make the whole import invalid.
 *
 * @since 1.1.0
 */
const eventSchema = z.enum([
  'secrets-removed',
  'sign-in-locked',
  'updates-applied',
  'updates-available',
  'update-failed',
]);

/**
 * Backup Format - Service schema.
 *
 * Enumerates notification services understood by this console version.
 * Service-specific field validation runs after this closed choice.
 *
 * @since 1.1.0
 */
const serviceSchema = z.enum([
  'apprise',
  'discord',
  'email',
  'gotify',
  'matrix',
  'ntfy',
  'ntfy-reverse-proxy',
  'pushover',
  'slack',
  'telegram',
  'webhook',
]);

/**
 * Backup Format - String map schema.
 *
 * Bounds notification field names and values before service refinement.
 * Nested objects and unknown value types are rejected.
 *
 * @since 1.1.0
 */
const stringMapSchema = z.record(z.string().min(1).max(64), z.string().max(4096));

/**
 * Backup Format - Notification schema.
 *
 * Validates one target with plain settings and secret values kept separate.
 * Required service fields must be present or explicitly marked unavailable.
 *
 * @since 1.1.0
 */
const notificationSchema = z.object({
  events: z.array(eventSchema).min(1).max(5).refine((events): boolean => new Set(events).size === events.length),
  id: z.string().regex(/^ntf-[0-9a-f]{16}$/u),
  missingSecrets: z.array(z.string().min(1).max(64)).max(32).refine((keys): boolean => new Set(keys).size === keys.length),
  name: z.string().trim().min(1).max(80),
  secrets: stringMapSchema,
  service: serviceSchema,
  settings: stringMapSchema,
}).strict().superRefine((notification, context): void => {
  const service = notificationServices.find((definition): boolean => definition['key'] === notification['service']);

  if (service === undefined) {
    return;
  }

  const plainKeys: Set<string> = new Set(service['fields'].filter((field): boolean => field['secret'] === false).map((field): string => field['key']));
  const secretKeys: Set<string> = new Set(service['fields'].filter((field): boolean => field['secret']).map((field): string => field['key']));

  for (const key of Object.keys(notification['settings'])) {
    if (plainKeys.has(key) === false) {
      context.addIssue({
        code: 'custom',
        message: 'The file has an unsupported non-secret setting.',
        path: [
          'settings',
          key,
        ],
      });
    }
  }

  for (const key of Object.keys(notification['secrets'])) {
    if (secretKeys.has(key) === false) {
      context.addIssue({
        code: 'custom',
        message: 'The file has an unsupported secret setting.',
        path: [
          'secrets',
          key,
        ],
      });
    }
  }

  for (const key of notification['missingSecrets']) {
    if (secretKeys.has(key) === false || Object.hasOwn(notification['secrets'], key)) {
      context.addIssue({
        code: 'custom',
        message: 'The file has an invalid missing secret.',
        path: ['missingSecrets'],
      });
    }
  }

  for (const field of service['fields']) {
    if (field['optional'] === true) {
      continue;
    }

    const value: string = (field['secret']) ? (notification['secrets'][field['key']] ?? '') : (notification['settings'][field['key']] ?? '');
    if (value === '' && (!field['secret'] || !notification['missingSecrets'].includes(field['key']))) {
      context.addIssue({
        code: 'custom',
        message: 'The file is missing a required notification setting.',
        path: [
          (field['secret']) ? 'secrets' : 'settings',
          field['key'],
        ],
      });
    }
  }
});

/**
 * Backup Format - Runtime settings schema.
 *
 * Mirrors every editable value on the Outpost Settings page.
 * Strict parsing keeps future or misspelled keys from applying silently.
 *
 * @since 1.1.0
 */
const runtimeSettingsSchema = z.object({
  cleanup: z.boolean(),
  healthTimeoutSeconds: z.number().int().positive(),
  labelMode: z.enum([
    'opt-in',
    'opt-out',
  ]),
  monitorOnly: z.boolean(),
  runOnStart: z.boolean(),
  schedule: z.string().trim().min(1),
  settleSeconds: z.number().int().positive(),
  stopTimeoutSeconds: z.number().int().positive(),
}).strict();

/**
 * Backup Format - Document schema.
 *
 * Defines the strict browser-side version-one Outpost export contract.
 * Nested sections reject unknown fields before the server sees the file.
 *
 * @since 1.1.0
 */
export const backupDocumentSchema: Web_Api_Schema<Web_Backup_Document> = z.object({
  accessTokens: z.array(z.object({
    createdAt: z.iso.datetime({ offset: true }),
    expiresAt: z.iso.datetime({ offset: true }).nullable(),
    id: z.string().regex(/^tok-[0-9a-f]{16}$/u),
    lastUsedAt: z.iso.datetime({ offset: true }).nullable(),
    name: z.string().trim().min(1).max(80),
    scopes: z.array(z.enum([
      'metrics:read',
      'status:read',
      'updates:run',
    ])).min(1).max(3).refine((scopes): boolean => new Set(scopes).size === scopes.length),
    tokenHash: z.string().regex(/^[0-9a-f]{64}$/u),
  }).strict()).max(1000).optional(),
  appVersion: z.string().min(1).max(64),
  exportedAt: z.iso.datetime({ offset: true }),
  format: z.literal('outpost-export'),
  notifications: z.array(notificationSchema).max(1000).optional(),
  registries: z.array(z.object({
    id: z.string().regex(/^reg-[0-9a-f]{16}$/u),
    password: z.string().min(1).max(32768).nullable(),
    registry: z.string().trim().min(1).max(255).regex(/^(?:[A-Za-z0-9](?:[A-Za-z0-9.-]*[A-Za-z0-9])?)(?::[0-9]{1,5})?$/u),
    username: z.string().trim().min(1).max(255),
  }).strict()).max(1000).optional(),
  settings: runtimeSettingsSchema.optional(),
  version: z.literal(1),
}).strict().superRefine((document, context): void => {
  if (document['settings'] === undefined && document['registries'] === undefined && document['notifications'] === undefined && document['accessTokens'] === undefined) {
    context.addIssue({
      code: 'custom',
      message: 'The export does not contain any sections.',
    });
  }

  const groups: string[][] = [
    (document['registries'] ?? []).map((registry): string => registry['id']),
    (document['registries'] ?? []).map((registry): string => registry['registry'].toLocaleLowerCase()),
    (document['notifications'] ?? []).map((notification): string => notification['id']),
    (document['notifications'] ?? []).map((notification): string => notification['name'].toLocaleLowerCase()),
    (document['accessTokens'] ?? []).map((token): string => token['id']),
    (document['accessTokens'] ?? []).map((token): string => token['name'].toLocaleLowerCase()),
    (document['accessTokens'] ?? []).map((token): string => token['tokenHash']),
  ];

  if (groups.some((values): boolean => new Set(values).size !== values.length)) {
    context.addIssue({
      code: 'custom',
      message: 'The export contains duplicate registries, notification targets, or access tokens.',
    });
  }
});

/**
 * Backup Format - Parse document.
 *
 * Parses an untrusted uploaded value into the closed portable format.
 * Validation failures stay in the source step of the wizard.
 *
 * @param {unknown} value - Value.
 *
 * @returns {Web_Backup_Document}
 *
 * @since 1.1.0
 */
export const parseBackupDocument = (value: unknown): Web_Backup_Document => backupDocumentSchema.parse(value);

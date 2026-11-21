import { z } from 'zod';

import { notificationServices } from '@/web/notification-services.ts';
import {
  notificationTargetIdPattern,
  registryAddressPattern,
  registryIdPattern,
  sha256HashPattern,
  tokenIdPattern,
} from '@/web/regex.js';

import type {
  Web_BackupFormat_BackupDocumentSchema,
  Web_BackupFormat_BackupDocumentSchema_Groups,
  Web_BackupFormat_NotificationSchema_PlainKeys,
  Web_BackupFormat_NotificationSchema_SecretKeys,
  Web_BackupFormat_NotificationSchema_Service,
  Web_BackupFormat_NotificationSchema_Value,
  Web_BackupFormat_ParseBackupDocument_Returns,
  Web_BackupFormat_ParseBackupDocument_Value,
} from '@/types/web/backup-format.d.ts';

/**
 * Backup Format - Event Schema.
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
 * Backup Format - Service Schema.
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
 * Backup Format - String Map Schema.
 *
 * Bounds notification field names and values before service refinement.
 * Nested objects and unknown value types are rejected.
 *
 * @since 1.1.0
 */
const stringMapSchema = z.record(z.string().min(1).max(64), z.string().max(4096));

/**
 * Backup Format - Notification Schema.
 *
 * Validates one target with plain settings and secret values kept separate.
 * Required service fields must be present or explicitly marked unavailable.
 *
 * @since 1.1.0
 */
const notificationSchema = z.object({
  events: z.array(eventSchema).min(1).max(5).refine((events) => new Set(events).size === events.length),
  id: z.string().regex(new RegExp(notificationTargetIdPattern, 'u')),
  missingSecrets: z.array(z.string().min(1).max(64)).max(32).refine((keys) => new Set(keys).size === keys.length),
  name: z.string().trim().min(1).max(80),
  secrets: stringMapSchema,
  service: serviceSchema,
  settings: stringMapSchema,
}).strict().superRefine((notification, context) => {
  const service: Web_BackupFormat_NotificationSchema_Service = notificationServices.find((definition) => definition['key'] === notification['service']);

  if (service === undefined) {
    return;
  }

  const plainKeys: Web_BackupFormat_NotificationSchema_PlainKeys = new Set(service['fields'].filter((field) => field['secret'] === false).map((field) => field['key']));
  const secretKeys: Web_BackupFormat_NotificationSchema_SecretKeys = new Set(service['fields'].filter((field) => field['secret']).map((field) => field['key']));

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
    if (secretKeys.has(key) === false || Object.hasOwn(notification['secrets'], key) === true) {
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

    const value: Web_BackupFormat_NotificationSchema_Value = (field['secret'] === true) ? (notification['secrets'][field['key']] ?? '') : (notification['settings'][field['key']] ?? '');
    if (
      value === ''
      && (
        field['secret'] === false
        || notification['missingSecrets'].includes(field['key']) === false
      )
    ) {
      context.addIssue({
        code: 'custom',
        message: 'The file is missing a required notification setting.',
        path: [
          (field['secret'] === true) ? 'secrets' : 'settings',
          field['key'],
        ],
      });
    }
  }

  return;
});

/**
 * Backup Format - Runtime Settings Schema.
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
 * Backup Format - Backup Document Schema.
 *
 * Defines the strict browser-side version-one Outpost export contract.
 * Nested sections reject unknown fields before the server sees the file.
 *
 * @since 1.1.0
 */
export const backupDocumentSchema: Web_BackupFormat_BackupDocumentSchema = z.object({
  accessTokens: z.array(z.object({
    createdAt: z.iso.datetime({ offset: true }),
    expiresAt: z.iso.datetime({ offset: true }).nullable(),
    id: z.string().regex(new RegExp(tokenIdPattern, 'u')),
    lastUsedAt: z.iso.datetime({ offset: true }).nullable(),
    name: z.string().trim().min(1).max(80),
    scopes: z.array(z.enum([
      'metrics:read',
      'status:read',
      'updates:run',
    ])).min(1).max(3).refine((scopes) => new Set(scopes).size === scopes.length),
    tokenHash: z.string().regex(new RegExp(sha256HashPattern, 'u')),
  }).strict()).max(1000).optional(),
  appVersion: z.string().min(1).max(64),
  exportedAt: z.iso.datetime({ offset: true }),
  format: z.literal('outpost-export'),
  notifications: z.array(notificationSchema).max(1000).optional(),
  registries: z.array(z.object({
    id: z.string().regex(new RegExp(registryIdPattern, 'u')),
    password: z.string().min(1).max(32768).nullable(),
    registry: z.string().trim().min(1).max(255).regex(new RegExp(registryAddressPattern, 'u')),
    username: z.string().trim().min(1).max(255),
  }).strict()).max(1000).optional(),
  settings: runtimeSettingsSchema.optional(),
  version: z.literal(1),
}).strict().superRefine((document, context) => {
  if (
    document['settings'] === undefined
    && document['registries'] === undefined
    && document['notifications'] === undefined
    && document['accessTokens'] === undefined
  ) {
    context.addIssue({
      code: 'custom',
      message: 'The export does not contain any sections.',
    });
  }

  const groups: Web_BackupFormat_BackupDocumentSchema_Groups = [
    (document['registries'] ?? []).map((registry) => registry['id']),
    (document['registries'] ?? []).map((registry) => registry['registry'].toLocaleLowerCase()),
    (document['notifications'] ?? []).map((notification) => notification['id']),
    (document['notifications'] ?? []).map((notification) => notification['name'].toLocaleLowerCase()),
    (document['accessTokens'] ?? []).map((token) => token['id']),
    (document['accessTokens'] ?? []).map((token) => token['name'].toLocaleLowerCase()),
    (document['accessTokens'] ?? []).map((token) => token['tokenHash']),
  ];

  if (groups.some((values) => new Set(values).size !== values.length) === true) {
    context.addIssue({
      code: 'custom',
      message: 'The export contains duplicate registries, notification targets, or access tokens.',
    });
  }

  return;
});

/**
 * Backup Format - Parse Backup Document.
 *
 * Parses an untrusted uploaded value into the closed portable format.
 * Validation failures stay in the source step of the wizard.
 *
 * @param {Web_BackupFormat_ParseBackupDocument_Value} value - Value.
 *
 * @returns {Web_BackupFormat_ParseBackupDocument_Returns}
 *
 * @since 1.1.0
 */
export const parseBackupDocument = (value: Web_BackupFormat_ParseBackupDocument_Value): Web_BackupFormat_ParseBackupDocument_Returns => backupDocumentSchema.parse(value);

import { z } from 'zod';

import {
  createPasskey,
  getPasskey,
} from '@/web/passkeys.ts';
import { contentDispositionFilenamePattern } from '@/web/regex.js';

import type {
  Web_Api_AccountSecuritySchema,
  Web_Api_AddPasskey_Credential,
  Web_Api_AddPasskey_Name,
  Web_Api_AddPasskey_Password,
  Web_Api_AddPasskey_Returns,
  Web_Api_ApiError_Code,
  Web_Api_ApiError_Constructor_Code,
  Web_Api_ApiError_Constructor_Issues,
  Web_Api_ApiError_Constructor_Message,
  Web_Api_ApiError_Constructor_Status,
  Web_Api_ApiError_Issues,
  Web_Api_ApiError_Status,
  Web_Api_ApplyBackupImport_Grant,
  Web_Api_ApplyBackupImport_Returns,
  Web_Api_AuthenticationResponseSchema,
  Web_Api_BackupGrantSchema,
  Web_Api_BackupImportPreviewSchema,
  Web_Api_BackupImportResultSchema,
  Web_Api_BuildRequest_CsrfToken,
  Web_Api_BuildRequest_Method,
  Web_Api_BuildRequest_Returns,
  Web_Api_ChangePassword_CurrentPassword,
  Web_Api_ChangePassword_NewPassword,
  Web_Api_ChangePassword_Returns,
  Web_Api_ChangeUsername_Password,
  Web_Api_ChangeUsername_Returns,
  Web_Api_ChangeUsername_Username,
  Web_Api_CheckStartedSchema,
  Web_Api_ClaimInput,
  Web_Api_ClaimInstallation_Returns,
  Web_Api_ConfirmBackupOperation_Code,
  Web_Api_ConfirmBackupOperation_Password,
  Web_Api_ConfirmBackupOperation_Returns,
  Web_Api_ConfirmBackupOperationWithPasskey_Credential,
  Web_Api_ConfirmBackupOperationWithPasskey_Returns,
  Web_Api_ConnectEvents_Opened,
  Web_Api_ConnectEvents_ParsedReport,
  Web_Api_ConnectEvents_ParsedState,
  Web_Api_ContainerSchema,
  Web_Api_CreatedTokenSchema,
  Web_Api_CreateNotification_Returns,
  Web_Api_CreateRegistry_Returns,
  Web_Api_CreateToken_Returns,
  Web_Api_CreateTokenInput,
  Web_Api_Diagnostics,
  Web_Api_DiagnosticsSchema,
  Web_Api_DisableTotp_Password,
  Web_Api_DisableTotp_Returns,
  Web_Api_DismissRemovedSecrets_Returns,
  Web_Api_DownloadBackupExport_ContentDisposition,
  Web_Api_DownloadBackupExport_Filename,
  Web_Api_DownloadBackupExport_FilenameMatch,
  Web_Api_DownloadBackupExport_Grant,
  Web_Api_DownloadBackupExport_MatchedFilename,
  Web_Api_DownloadBackupExport_ObjectUrl,
  Web_Api_DownloadBackupExport_Returns,
  Web_Api_EnableTotp_Code,
  Web_Api_EnableTotp_Returns,
  Web_Api_ErrorEnvelopeSchema,
  Web_Api_Events_Close,
  Web_Api_Events_Handlers,
  Web_Api_GetAccountSecurity_Returns,
  Web_Api_GetContainers_Response,
  Web_Api_GetContainers_Returns,
  Web_Api_GetCurrentPrincipal_ResponseValue,
  Web_Api_GetCurrentPrincipal_Returns,
  Web_Api_GetDiagnostics_Returns,
  Web_Api_GetHistory_Response,
  Web_Api_GetHistory_Returns,
  Web_Api_GetNotificationEvents_Response,
  Web_Api_GetNotificationEvents_Returns,
  Web_Api_GetNotifications_Response,
  Web_Api_GetNotifications_Returns,
  Web_Api_GetOverview_Returns,
  Web_Api_GetRegistries_Response,
  Web_Api_GetRegistries_Returns,
  Web_Api_GetSettings_Returns,
  Web_Api_GetSetupStatus_Returns,
  Web_Api_GetTokens_Response,
  Web_Api_GetTokens_Returns,
  Web_Api_IssueFor_CaughtError,
  Web_Api_IssueFor_Field,
  Web_Api_IssueFor_Issue,
  Web_Api_IssueFor_Returns,
  Web_Api_Login_Returns,
  Web_Api_LoginInput,
  Web_Api_LoginResultSchema,
  Web_Api_Logout_Returns,
  Web_Api_NotificationTargetSchema,
  Web_Api_NotificationTestSchema,
  Web_Api_OverviewSchema,
  Web_Api_ParseEventData_Data,
  Web_Api_ParseEventData_Returns,
  Web_Api_PasskeyCeremony,
  Web_Api_PasskeyCeremonySchema,
  Web_Api_PasskeySchema,
  Web_Api_PreviewBackupImport_Returns,
  Web_Api_PrincipalSchema,
  Web_Api_ReadCookie_MatchingPart,
  Web_Api_ReadCookie_Name,
  Web_Api_ReadCookie_Parts,
  Web_Api_ReadCookie_Prefix,
  Web_Api_ReadCookie_Returns,
  Web_Api_RecoveryCodesSchema,
  Web_Api_RegenerateRecoveryCodes_Password,
  Web_Api_RegenerateRecoveryCodes_Returns,
  Web_Api_RegistryInput,
  Web_Api_RegistrySchema,
  Web_Api_RegistryUpdateInput,
  Web_Api_RemovedSecretSchema,
  Web_Api_RemoveNotification_NotificationId,
  Web_Api_RemoveNotification_Returns,
  Web_Api_RemovePasskey_PasskeyId,
  Web_Api_RemovePasskey_Password,
  Web_Api_RemovePasskey_Returns,
  Web_Api_RemoveRegistry_RegistryId,
  Web_Api_RemoveRegistry_Returns,
  Web_Api_ReportSchema,
  Web_Api_Request_Options,
  Web_Api_RequestJson_Path,
  Web_Api_RequestJson_ResponseValue,
  Web_Api_RequestVoid_Path,
  Web_Api_RequestVoid_Returns,
  Web_Api_ResponseError_ParsedError,
  Web_Api_ResponseError_ResponseValue,
  Web_Api_ResponseError_Returns,
  Web_Api_RevokeToken_Returns,
  Web_Api_RevokeToken_TokenId,
  Web_Api_RuntimeSettingsSchema,
  Web_Api_Schema,
  Web_Api_SettingsResponseSchema,
  Web_Api_SetupStatusSchema,
  Web_Api_SignInWithPasskey_Credential,
  Web_Api_SignInWithPasskey_Returns,
  Web_Api_StartCheck_ContainerId,
  Web_Api_StartCheck_Returns,
  Web_Api_StartTotpSetup_Password,
  Web_Api_StartTotpSetup_Returns,
  Web_Api_StartUpdate_Body,
  Web_Api_StartUpdate_ContainerId,
  Web_Api_StartUpdate_Returns,
  Web_Api_StartUpdate_Rollback,
  Web_Api_SubmitSecondFactor_Challenge,
  Web_Api_SubmitSecondFactor_Code,
  Web_Api_SubmitSecondFactor_Returns,
  Web_Api_SummaryFor_CaughtError,
  Web_Api_SummaryFor_Fallback,
  Web_Api_SummaryFor_Returns,
  Web_Api_SummaryFor_ShownFields,
  Web_Api_TestNotification_NotificationId,
  Web_Api_TestNotification_Returns,
  Web_Api_TokenSchema,
  Web_Api_TotpSetupSchema,
  Web_Api_UpdateDiagnostics_Returns,
  Web_Api_UpdateNotification_NotificationId,
  Web_Api_UpdateNotification_Returns,
  Web_Api_UpdateRegistry_RegistryId,
  Web_Api_UpdateRegistry_Returns,
  Web_Api_UpdateSettings_Returns,
  Web_Api_UpdateSettingsInput,
  Web_Api_UpdateToken_Returns,
  Web_Api_UpdateToken_TokenId,
  Web_Api_UpdateTokenInput,
} from '@/types/web/api.d.ts';
import type {
  Web_Backup_Document,
  Web_Backup_ExportSections,
  Web_Backup_Grant,
  Web_Backup_Purpose,
} from '@/types/web/backup.d.ts';
import type {
  Web_Notifications_CreateInput,
  Web_Notifications_UpdateInput,
} from '@/types/web/notifications.d.ts';

/**
 * API - Error Envelope Schema.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
const errorEnvelopeSchema: Web_Api_ErrorEnvelopeSchema = z.object({
  error: z.object({
    code: z.string(),
    issues: z.array(z.object({
      field: z.string(),
      message: z.string(),
      path: z.array(z.string()),
    })).optional(),
    message: z.string(),
  }),
});

/**
 * API - Setup Status Schema.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
const setupStatusSchema: Web_Api_SetupStatusSchema = z.object({
  claimExpiresAt: z.string().optional(),
  claimRequired: z.boolean(),
});

/**
 * API - Removed Secret Schema.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
const removedSecretSchema: Web_Api_RemovedSecretSchema = z.object({
  kind: z.enum([
    'authenticator',
    'notification',
    'registry',
  ]),
  name: z.string().optional(),
  notificationId: z.string().optional(),
  registryId: z.string().optional(),
  removedAt: z.string(),
});

/**
 * API - Notification Target Schema.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
const notificationTargetSchema: Web_Api_NotificationTargetSchema = z.object({
  createdAt: z.string(),
  events: z.array(z.string()),
  id: z.string(),
  lastAttemptAt: z.string().nullable(),
  lastError: z.string().nullable(),
  name: z.string(),
  secrets: z.record(z.string(), z.literal(true)),
  secretsMissing: z.array(z.string()),
  service: z.enum([
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
  ]),
  settings: z.record(z.string(), z.string()),
  updatedAt: z.string(),
});

/**
 * API - Notification Targets Response Schema.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
const notificationTargetsResponseSchema = z.object({
  items: z.array(notificationTargetSchema),
});

/**
 * API - Notification Events Response Schema.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
const notificationEventsResponseSchema = z.object({
  items: z.array(z.object({
    defaultEnabled: z.boolean(),
    description: z.string(),
    key: z.string(),
    label: z.string(),
  })),
});

/**
 * API - Notification Test Schema.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
const notificationTestSchema: Web_Api_NotificationTestSchema = z.object({
  delivered: z.boolean(),
  message: z.string().optional(),
});

/**
 * API - Registry Schema.
 *
 * Checks one private registry sign-in as the API lists it.
 * The password never comes back, only whether a lost key removed it.
 *
 * @since 1.0.0
 */
const registrySchema: Web_Api_RegistrySchema = z.object({
  createdAt: z.string(),
  id: z.string(),
  passwordMissing: z.boolean(),
  registry: z.string(),
  updatedAt: z.string(),
  username: z.string(),
});

/**
 * API - Registries Response Schema.
 *
 * Checks the items envelope the registry list arrives in.
 * The server sorts the sign-ins by registry host.
 *
 * @since 1.0.0
 */
const registriesResponseSchema = z.object({
  items: z.array(registrySchema),
});

/**
 * API - Principal Schema.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
const principalSchema: Web_Api_PrincipalSchema = z.object({
  administratorId: z.string().optional(),
  authenticationType: z.enum([
    'session',
    'token',
  ]),
  id: z.string(),
  removedSecrets: z.array(removedSecretSchema).optional(),
  scopes: z.array(z.string()).optional(),
  username: z.string().optional(),
});

/**
 * API - Authentication Response Schema.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
const authenticationResponseSchema: Web_Api_AuthenticationResponseSchema = z.object({
  administrator: z.object({
    id: z.string(),
    username: z.string(),
  }),
  csrfToken: z.string(),
  expiresAt: z.string(),
  status: z.literal('authenticated'),
});

/**
 * API - Login Result Schema.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
const loginResultSchema: Web_Api_LoginResultSchema = z.union([
  authenticationResponseSchema,
  z.object({
    challenge: z.string(),
    expiresAt: z.string(),
    status: z.literal('second_factor_required'),
  }),
]);

/**
 * API - Passkey Schema.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
const passkeySchema: Web_Api_PasskeySchema = z.object({
  createdAt: z.string(),
  hostname: z.string().nullable(),
  id: z.string(),
  lastUsedAt: z.string().nullable(),
  name: z.string(),
});

/**
 * API - Account Security Schema.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
const accountSecuritySchema: Web_Api_AccountSecuritySchema = z.object({
  hostname: z.string(),
  passkeys: z.array(passkeySchema),
  passkeysAvailable: z.boolean(),
  recoveryCodesRemaining: z.number(),
  totpEnabled: z.boolean(),
  username: z.string(),
});

/**
 * API - Backup Grant Schema.
 *
 * Validates the short-lived credential returned after identity confirmation.
 * The raw grant is kept only long enough to make the next backup request.
 *
 * @since 1.1.0
 */
const backupGrantSchema: Web_Api_BackupGrantSchema = z.object({
  expiresAt: z.string(),
  grant: z.string(),
}).strict();

/**
 * API - Backup Import Summary Schema.
 *
 * Validates server-authored preview and committed summaries.
 * Nonnegative counts keep the wizard's review language trustworthy.
 *
 * @since 1.1.0
 */
const backupImportSummarySchema = z.object({
  accessTokens: z.object({
    added: z.number().int().nonnegative(),
    skipped: z.number().int().nonnegative(),
  }).strict(),
  notifications: z.object({
    added: z.number().int().nonnegative(),
    replaced: z.number().int().nonnegative(),
  }).strict(),
  registries: z.object({
    added: z.number().int().nonnegative(),
    replaced: z.number().int().nonnegative(),
  }).strict(),
  settings: z.object({ changed: z.number().int().nonnegative() }).strict(),
}).strict();

/**
 * API - Backup Import Preview Schema.
 *
 * Validates the read-only section plan returned for an uploaded document.
 * Every section identifies whether it will enter the transaction.
 *
 * @since 1.1.0
 */
const backupImportPreviewSchema: Web_Api_BackupImportPreviewSchema = z.object({
  appVersion: z.string(),
  exportedAt: z.string(),
  sections: z.array(z.object({
    file: z.string(),
    here: z.string(),
    id: z.enum([
      'settings',
      'registries',
      'notifications',
      'accessTokens',
    ]),
    label: z.string(),
    reason: z.string().optional(),
    willImport: z.boolean(),
  }).strict()),
  summary: backupImportSummarySchema,
}).strict();

/**
 * API - Backup Import Result Schema.
 *
 * Validates committed counts and the sections applied by the transaction.
 * The progress screen uses this result before announcing completion.
 *
 * @since 1.1.0
 */
const backupImportResultSchema: Web_Api_BackupImportResultSchema = backupImportSummarySchema.extend({
  importedSections: z.array(z.enum([
    'settings',
    'registries',
    'notifications',
    'accessTokens',
  ])),
}).strict();

/**
 * API - Totp Setup Schema.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
const totpSetupSchema: Web_Api_TotpSetupSchema = z.object({
  expiresAt: z.string(),
  qrCode: z.string(),
  secret: z.string(),
  uri: z.string(),
});

/**
 * API - Recovery Codes Schema.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
const recoveryCodesSchema: Web_Api_RecoveryCodesSchema = z.object({
  recoveryCodes: z.array(z.string()),
});

/**
 * API - Passkey Ceremony Schema.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
const passkeyCeremonySchema: Web_Api_PasskeyCeremonySchema = z.object({
  ceremonyId: z.string(),
  options: z.record(z.string(), z.unknown()),
});

/**
 * API - Scope Schema.
 *
 * Encapsulates the related behavior behind one reusable interface.
 * Callers share the same lifecycle and state management.
 *
 * @since 1.0.0
 */
const scopeSchema = z.enum([
  'metrics:read',
  'status:read',
  'updates:run',
]);

/**
 * API - Token Schema.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
const tokenSchema: Web_Api_TokenSchema = z.object({
  createdAt: z.string(),
  expiresAt: z.string().nullable(),
  id: z.string(),
  lastUsedAt: z.string().nullable(),
  name: z.string(),
  scopes: z.array(scopeSchema),
});

/**
 * API - Tokens Response Schema.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
const tokensResponseSchema = z.object({
  items: z.array(tokenSchema),
});

/**
 * API - Created Token Schema.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
const createdTokenSchema: Web_Api_CreatedTokenSchema = z.object({
  plaintext: z.string(),
  token: tokenSchema,
});

/**
 * API - Result Status Schema.
 *
 * Encapsulates the related behavior behind one reusable interface.
 * Callers share the same lifecycle and state management.
 *
 * @since 1.0.0
 */
const resultStatusSchema = z.enum([
  'available',
  'failed',
  'held',
  'kept-unhealthy',
  'rolled-back',
  'skipped',
  'up-to-date',
  'updated',
]);

/**
 * API - Report Schema.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
const reportSchema: Web_Api_ReportSchema = z.object({
  action: z.enum([
    'check',
    'update',
  ]).nullish(),
  error: z.string().nullish(),
  finishedAt: z.string(),
  rollback: z.boolean().nullish(),
  results: z.array(z.object({
    container: z.string(),
    detail: z.string(),
    image: z.string(),
    status: resultStatusSchema,
    summary: z.string().optional(),
  })),
  startedAt: z.string(),
  trigger: z.string().nullish(),
});

/**
 * API - History Response Schema.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
const historyResponseSchema = z.object({
  items: z.array(reportSchema),
});

/**
 * API - Overview Schema.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
const overviewSchema: Web_Api_OverviewSchema = z.object({
  action: z.enum([
    'check',
    'update',
  ]).nullish(),
  labelMode: z.enum([
    'opt-in',
    'opt-out',
  ]),
  lastError: z.string().nullish(),
  lastReport: reportSchema.nullish(),
  monitorOnly: z.boolean(),
  nextRun: z.string().nullish(),
  running: z.boolean(),
  schedule: z.string(),
  startedAt: z.string().nullish(),
  timeZone: z.string(),
  totals: z.object({
    cycles: z.number(),
    failed: z.number(),
    updated: z.number(),
  }),
});

/**
 * API - Container Schema.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
const containerSchema: Web_Api_ContainerSchema = z.object({
  fullId: z.string(),
  id: z.string(),
  image: z.string(),
  lastAction: z.enum([
    'check',
    'update',
  ]).nullish(),
  lastCheckedAt: z.string().nullish(),
  lastDetail: z.string().nullish(),
  lastSummary: z.string().nullish(),
  lastStatus: resultStatusSchema.nullish(),
  managed: z.boolean(),
  monitorOnly: z.boolean(),
  name: z.string(),
  note: z.string(),
  self: z.boolean(),
  state: z.string(),
});

/**
 * API - Containers Response Schema.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
const containersResponseSchema = z.object({
  items: z.array(containerSchema),
});

/**
 * API - Runtime Settings Schema.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
const runtimeSettingsSchema: Web_Api_RuntimeSettingsSchema = z.object({
  cleanup: z.boolean(),
  healthTimeoutSeconds: z.number(),
  labelMode: z.enum([
    'opt-in',
    'opt-out',
  ]),
  monitorOnly: z.boolean(),
  runOnStart: z.boolean(),
  schedule: z.string(),
  settleSeconds: z.number(),
  stopTimeoutSeconds: z.number(),
});

/**
 * API - Diagnostics Schema.
 *
 * Reads whether Debug logging is on, for the Settings page's switch.
 * The same shape answers both reading and changing it.
 *
 * @since 1.1.0
 */
const diagnosticsSchema: Web_Api_DiagnosticsSchema = z.object({
  debugLogging: z.boolean(),
});

/**
 * API - Settings Response Schema.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
const settingsResponseSchema: Web_Api_SettingsResponseSchema = z.object({
  runtime: runtimeSettingsSchema,
  system: z.object({
    dataDirectory: z.string(),
    dockerHost: z.string(),
    timeZone: z.string(),
  }),
});

/**
 * API - Check Started Schema.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
const checkStartedSchema: Web_Api_CheckStartedSchema = z.object({
  started: z.boolean(),
});

/**
 * API.
 *
 * Keeps the machine-readable code and field issues from the shared error envelope so
 * screens can react to specific failures and show each message next to its field.
 *
 * @since 1.0.0
 */
export class ApiError extends Error {
  /**
   * API - Code.
   *
   * Stores this module-level value in one named location.
   * Related code reuses it instead of duplicating the definition.
   *
   * @since 1.0.0
   */
  public readonly code: Web_Api_ApiError_Code;

  /**
   * API - Status.
   *
   * Stores this module-level value in one named location.
   * Related code reuses it instead of duplicating the definition.
   *
   * @since 1.0.0
   */
  public readonly status: Web_Api_ApiError_Status;

  /**
   * API - Issues.
   *
   * Stores this module-level value in one named location.
   * Related code reuses it instead of duplicating the definition.
   *
   * @since 1.0.0
   */
  public readonly issues: Web_Api_ApiError_Issues;

  /**
   * API - Constructor.
   *
   * Stores this module-level value in one named location.
   * Related code reuses it instead of duplicating the definition.
   *
   * @since 1.0.0
   */
  public constructor(message: Web_Api_ApiError_Constructor_Message, code: Web_Api_ApiError_Constructor_Code, status: Web_Api_ApiError_Constructor_Status, issues: Web_Api_ApiError_Constructor_Issues) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.issues = issues;

    return;
  }
}

// issueFor returns the message the API attached to one form field, if any.

/**
 * API - Issue For.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_Api_IssueFor_CaughtError} caughtError - Caught error.
 * @param {Web_Api_IssueFor_Field}       field       - Field.
 *
 * @returns {Web_Api_IssueFor_Returns}
 *
 * @since 1.0.0
 */
export const issueFor = (caughtError: Web_Api_IssueFor_CaughtError, field: Web_Api_IssueFor_Field): Web_Api_IssueFor_Returns => {
  if (!(caughtError instanceof ApiError)) {
    return '';
  }

  const issue: Web_Api_IssueFor_Issue = caughtError.issues.find(
    (candidate) => candidate['field'] === field,
  );

  return (issue === undefined) ? '' : issue['message'];
};

// summaryFor returns the banner text for an error, or nothing when a shown field already carries it.

/**
 * API - Summary For.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_Api_SummaryFor_CaughtError} caughtError - Caught error.
 * @param {Web_Api_SummaryFor_ShownFields} shownFields - Shown fields.
 * @param {Web_Api_SummaryFor_Fallback}    fallback    - Fallback.
 *
 * @returns {Web_Api_SummaryFor_Returns}
 *
 * @since 1.0.0
 */
export const summaryFor = (caughtError: Web_Api_SummaryFor_CaughtError, shownFields: Web_Api_SummaryFor_ShownFields, fallback: Web_Api_SummaryFor_Fallback): Web_Api_SummaryFor_Returns => {
  if (caughtError === null || caughtError === undefined) {
    return '';
  }

  if (
    caughtError instanceof ApiError
    && caughtError.issues.some(
      (issue) => shownFields.includes(issue['field']),
    ) === true
  ) {
    return '';
  }

  if (caughtError instanceof DOMException && caughtError.name === 'NotAllowedError') {
    return 'The passkey prompt was closed before it finished.';
  }

  if (caughtError instanceof DOMException && caughtError.name === 'InvalidStateError') {
    return 'This device already has a passkey for this account.';
  }

  return (caughtError instanceof Error) ? caughtError.message : fallback;
};

// responseError converts the stable API error envelope into an ApiError.

/**
 * API - Response Error.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Response} response - Response.
 *
 * @returns {Web_Api_ResponseError_Returns}
 *
 * @since 1.0.0
 */
const responseError = async (response: Response): Web_Api_ResponseError_Returns => {
  const responseValue: Web_Api_ResponseError_ResponseValue = await response.json().catch(() => undefined);
  const parsedError: Web_Api_ResponseError_ParsedError = errorEnvelopeSchema.safeParse(responseValue);
  if (parsedError.success === true) {
    return new ApiError(
      parsedError.data['error']['message'],
      parsedError.data['error']['code'],
      response.status,
      parsedError.data['error']['issues'] ?? [],
    );
  }

  return new ApiError(`Request failed with status ${response.status}.`, 'request_failed', response.status, []);
};

// readCookie returns one non-HTTP-only same-origin cookie.

/**
 * API - Read Cookie.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_Api_ReadCookie_Name} name - Name.
 *
 * @returns {Web_Api_ReadCookie_Returns}
 *
 * @since 1.0.0
 */
const readCookie = (name: Web_Api_ReadCookie_Name): Web_Api_ReadCookie_Returns => {
  const prefix: Web_Api_ReadCookie_Prefix = `${name}=`;
  const parts: Web_Api_ReadCookie_Parts = document.cookie.split(';');
  const matchingPart: Web_Api_ReadCookie_MatchingPart = parts
    .map((part) => part.trim())
    .find((part) => part.startsWith(prefix));

  return (matchingPart === undefined) ? undefined : decodeURIComponent(matchingPart.slice(prefix.length));
};

// buildRequest adds the JSON body, the CSRF header for mutations, and same-origin cookies.

/**
 * API - Build Request.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_Api_Request_Options} options - Options.
 *
 * @returns {Web_Api_BuildRequest_Returns}
 *
 * @since 1.0.0
 */
const buildRequest = (options: Web_Api_Request_Options): Web_Api_BuildRequest_Returns => {
  const headers: Headers = new Headers(options['headers']);
  const method: Web_Api_BuildRequest_Method = options['method'] ?? 'GET';

  if (options['body'] !== undefined) {
    headers.set('Content-Type', 'application/json');
  }

  if (method !== 'GET') {
    const csrfToken: Web_Api_BuildRequest_CsrfToken = readCookie('outpost_csrf');
    if (csrfToken !== undefined) {
      headers.set('X-CSRF-Token', csrfToken);
    }
  }

  return {
    ...((options['body'] === undefined) ? {} : { body: JSON.stringify(options['body']) }),
    credentials: 'same-origin',
    headers,
    method,
  };
};

// requestJSON performs one same-origin request and validates its response contract.

/**
 * API - Request JSON.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @param {Web_Api_RequestJson_Path}       path      - Path.
 * @param {Web_Api_Schema<ResponseValue>}  schema    - Schema.
 * @param {Web_Api_Request_Options}        [options] - Options.
 *
 * @returns {Promise<ResponseValue>}
 *
 * @since 1.0.0
 */
const requestJSON = async <ResponseValue>(
  path: Web_Api_RequestJson_Path,
  schema: Web_Api_Schema<ResponseValue>,
  options: Web_Api_Request_Options = {},
): Promise<ResponseValue> => {
  const response: Response = await fetch(path, buildRequest(options));
  if (response.ok === false) {
    throw await responseError(response);
  }

  const responseValue: Web_Api_RequestJson_ResponseValue = await response.json();

  return schema.parse(responseValue);
};

// requestVoid performs one mutation whose successful response has no body.

/**
 * API - Request Void.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @param {Web_Api_RequestVoid_Path} path    - Path.
 * @param {Web_Api_Request_Options}  options - Options.
 *
 * @returns {Web_Api_RequestVoid_Returns}
 *
 * @since 1.0.0
 */
const requestVoid = async (
  path: Web_Api_RequestVoid_Path,
  options: Web_Api_Request_Options,
): Web_Api_RequestVoid_Returns => {
  const response: Response = await fetch(path, buildRequest(options));
  if (response.ok === false) {
    throw await responseError(response);
  }

  return;
};

/**
 * API - Get Setup Status.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {Web_Api_GetSetupStatus_Returns}
 *
 * @since 1.0.0
 */
export const getSetupStatus = async (): Web_Api_GetSetupStatus_Returns => requestJSON(
  '/api/v1/setup/status',
  setupStatusSchema,
);

/**
 * API - Get Current Principal.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {Web_Api_GetCurrentPrincipal_Returns}
 *
 * @since 1.0.0
 */
export const getCurrentPrincipal = async (): Web_Api_GetCurrentPrincipal_Returns => {
  const response: Response = await fetch('/api/v1/auth/me', {
    credentials: 'same-origin',
  });
  if (response.status === 401) {
    return null;
  }
  if (response.ok === false) {
    throw await responseError(response);
  }

  const responseValue: Web_Api_GetCurrentPrincipal_ResponseValue = await response.json();

  return principalSchema.parse(responseValue);
};

/**
 * API - Claim Installation.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @param {Web_Api_ClaimInput} input - Input.
 *
 * @returns {Web_Api_ClaimInstallation_Returns}
 *
 * @since 1.0.0
 */
export const claimInstallation = async (
  input: Web_Api_ClaimInput,
): Web_Api_ClaimInstallation_Returns => requestJSON(
  '/api/v1/setup/claim',
  authenticationResponseSchema,
  {
    body: {
      claimCode: input['claimCode'].trim(),
      password: input['password'],
      username: input['username'].trim(),
    },
    method: 'POST',
  },
);

/**
 * API - Login.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @param {Web_Api_LoginInput} input - Input.
 *
 * @returns {Web_Api_Login_Returns}
 *
 * @since 1.0.0
 */
export const login = async (
  input: Web_Api_LoginInput,
): Web_Api_Login_Returns => requestJSON(
  '/api/v1/auth/login',
  loginResultSchema,
  {
    body: {
      password: input['password'],
      username: input['username'].trim(),
    },
    method: 'POST',
  },
);

/**
 * API - Submit Second Factor.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @param {Web_Api_SubmitSecondFactor_Challenge} challenge - Challenge.
 * @param {Web_Api_SubmitSecondFactor_Code}      code      - Code.
 *
 * @returns {Web_Api_SubmitSecondFactor_Returns}
 *
 * @since 1.0.0
 */
export const submitSecondFactor = async (
  challenge: Web_Api_SubmitSecondFactor_Challenge,
  code: Web_Api_SubmitSecondFactor_Code,
): Web_Api_SubmitSecondFactor_Returns => requestJSON(
  '/api/v1/auth/login/second-factor',
  authenticationResponseSchema,
  {
    body: {
      challenge,
      code: code.trim(),
    },
    method: 'POST',
  },
);

/**
 * API - Sign In With Passkey.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {Web_Api_SignInWithPasskey_Returns}
 *
 * @since 1.0.0
 */
export const signInWithPasskey = async (): Web_Api_SignInWithPasskey_Returns => {
  const ceremony: Web_Api_PasskeyCeremony = await requestJSON(
    '/api/v1/auth/passkeys/login/options',
    passkeyCeremonySchema,
    { method: 'POST' },
  );
  const credential: Web_Api_SignInWithPasskey_Credential = await getPasskey(ceremony['options']);

  return requestJSON(
    '/api/v1/auth/passkeys/login/verify',
    authenticationResponseSchema,
    {
      body: {
        ceremonyId: ceremony['ceremonyId'],
        credential,
      },
      method: 'POST',
    },
  );
};

/**
 * API - Logout.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {Web_Api_Logout_Returns}
 *
 * @since 1.0.0
 */
export const logout = async (): Web_Api_Logout_Returns => requestVoid(
  '/api/v1/auth/logout',
  { method: 'POST' },
);

/**
 * API - Dismiss Removed Secrets.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {Web_Api_DismissRemovedSecrets_Returns}
 *
 * @since 1.0.0
 */
export const dismissRemovedSecrets = async (): Web_Api_DismissRemovedSecrets_Returns => requestVoid(
  '/api/v1/auth/removed-secrets',
  { method: 'DELETE' },
);

/**
 * API - Get Account Security.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {Web_Api_GetAccountSecurity_Returns}
 *
 * @since 1.0.0
 */
export const getAccountSecurity = async (): Web_Api_GetAccountSecurity_Returns => requestJSON(
  '/api/v1/auth/security',
  accountSecuritySchema,
);

/**
 * API - Change Password.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @param {Web_Api_ChangePassword_CurrentPassword} currentPassword - Current password.
 * @param {Web_Api_ChangePassword_NewPassword}     newPassword     - New password.
 *
 * @returns {Web_Api_ChangePassword_Returns}
 *
 * @since 1.0.0
 */
export const changePassword = async (
  currentPassword: Web_Api_ChangePassword_CurrentPassword,
  newPassword: Web_Api_ChangePassword_NewPassword,
): Web_Api_ChangePassword_Returns => requestVoid(
  '/api/v1/auth/password',
  {
    body: {
      currentPassword,
      newPassword,
    },
    method: 'POST',
  },
);

/**
 * API - Change Username.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @param {Web_Api_ChangeUsername_Username} username - Username.
 * @param {Web_Api_ChangeUsername_Password} password - Password.
 *
 * @returns {Web_Api_ChangeUsername_Returns}
 *
 * @since 1.0.0
 */
export const changeUsername = async (
  username: Web_Api_ChangeUsername_Username,
  password: Web_Api_ChangeUsername_Password,
): Web_Api_ChangeUsername_Returns => {
  await requestJSON(
    '/api/v1/auth/username',
    z.object({
      administrator: z.object({
        id: z.string(),
        username: z.string(),
      }),
    }),
    {
      body: {
        password,
        username: username.trim(),
      },
      method: 'POST',
    },
  );

  return;
};

/**
 * API - Start Totp Setup.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_Api_StartTotpSetup_Password} password - Password.
 *
 * @returns {Web_Api_StartTotpSetup_Returns}
 *
 * @since 1.0.0
 */
export const startTotpSetup = async (password: Web_Api_StartTotpSetup_Password): Web_Api_StartTotpSetup_Returns => requestJSON(
  '/api/v1/auth/totp/setup',
  totpSetupSchema,
  {
    body: { password },
    method: 'POST',
  },
);

/**
 * API - Enable Totp.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_Api_EnableTotp_Code} code - Code.
 *
 * @returns {Web_Api_EnableTotp_Returns}
 *
 * @since 1.0.0
 */
export const enableTotp = async (code: Web_Api_EnableTotp_Code): Web_Api_EnableTotp_Returns => requestJSON(
  '/api/v1/auth/totp/enable',
  recoveryCodesSchema,
  {
    body: { code: code.trim() },
    method: 'POST',
  },
);

/**
 * API - Disable Totp.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_Api_DisableTotp_Password} password - Password.
 *
 * @returns {Web_Api_DisableTotp_Returns}
 *
 * @since 1.0.0
 */
export const disableTotp = async (password: Web_Api_DisableTotp_Password): Web_Api_DisableTotp_Returns => requestVoid(
  '/api/v1/auth/totp/disable',
  {
    body: { password },
    method: 'POST',
  },
);

/**
 * API - Regenerate Recovery Codes.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_Api_RegenerateRecoveryCodes_Password} password - Password.
 *
 * @returns {Web_Api_RegenerateRecoveryCodes_Returns}
 *
 * @since 1.0.0
 */
export const regenerateRecoveryCodes = async (password: Web_Api_RegenerateRecoveryCodes_Password): Web_Api_RegenerateRecoveryCodes_Returns => requestJSON(
  '/api/v1/auth/recovery-codes',
  recoveryCodesSchema,
  {
    body: { password },
    method: 'POST',
  },
);

/**
 * API - Add Passkey.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_Api_AddPasskey_Name}     name     - Name.
 * @param {Web_Api_AddPasskey_Password} password - Password.
 *
 * @returns {Web_Api_AddPasskey_Returns}
 *
 * @since 1.0.0
 */
export const addPasskey = async (name: Web_Api_AddPasskey_Name, password: Web_Api_AddPasskey_Password): Web_Api_AddPasskey_Returns => {
  const ceremony: Web_Api_PasskeyCeremony = await requestJSON(
    '/api/v1/auth/passkeys/register/options',
    passkeyCeremonySchema,
    {
      body: {
        name: name.trim(),
        password,
      },
      method: 'POST',
    },
  );
  const credential: Web_Api_AddPasskey_Credential = await createPasskey(ceremony['options']);

  return requestJSON(
    '/api/v1/auth/passkeys/register/verify',
    passkeySchema,
    {
      body: {
        ceremonyId: ceremony['ceremonyId'],
        credential,
      },
      method: 'POST',
    },
  );
};

/**
 * API - Remove Passkey.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_Api_RemovePasskey_PasskeyId} passkeyId - Passkey id.
 * @param {Web_Api_RemovePasskey_Password}  password  - Password.
 *
 * @returns {Web_Api_RemovePasskey_Returns}
 *
 * @since 1.0.0
 */
export const removePasskey = async (passkeyId: Web_Api_RemovePasskey_PasskeyId, password: Web_Api_RemovePasskey_Password): Web_Api_RemovePasskey_Returns => requestVoid(
  `/api/v1/auth/passkeys/${encodeURIComponent(passkeyId)}`,
  {
    body: { password },
    method: 'DELETE',
  },
);

/**
 * API - Get Overview.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {Web_Api_GetOverview_Returns}
 *
 * @since 1.0.0
 */
export const getOverview = async (): Web_Api_GetOverview_Returns => requestJSON(
  '/api/v1/overview',
  overviewSchema,
);

/**
 * API - Get Containers.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {Web_Api_GetContainers_Returns}
 *
 * @since 1.0.0
 */
export const getContainers = async (): Web_Api_GetContainers_Returns => {
  const response: Web_Api_GetContainers_Response = await requestJSON('/api/v1/containers', containersResponseSchema);

  return response['items'];
};

/**
 * API - Get History.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {Web_Api_GetHistory_Returns}
 *
 * @since 1.0.0
 */
export const getHistory = async (): Web_Api_GetHistory_Returns => {
  const response: Web_Api_GetHistory_Response = await requestJSON('/api/v1/history', historyResponseSchema);

  return response['items'];
};

/**
 * API - Get Settings.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {Web_Api_GetSettings_Returns}
 *
 * @since 1.0.0
 */
export const getSettings = async (): Web_Api_GetSettings_Returns => requestJSON('/api/v1/settings', settingsResponseSchema);

/**
 * API - Update Settings.
 *
 * Persists editable runtime behavior and returns the complete current settings document.
 * The browser session and CSRF token protect this administrative mutation.
 *
 * @param {Web_Api_UpdateSettingsInput} input - Input.
 *
 * @returns {Web_Api_UpdateSettings_Returns}
 *
 * @since 1.0.0
 */
export const updateSettings = async (input: Web_Api_UpdateSettingsInput): Web_Api_UpdateSettings_Returns => requestJSON(
  '/api/v1/settings',
  settingsResponseSchema,
  {
    body: input,
    method: 'PUT',
  },
);

/**
 * API - Get Diagnostics.
 *
 * Reads whether Debug logging is on.
 * The Settings page shows it on its switch.
 *
 * @returns {Web_Api_GetDiagnostics_Returns}
 *
 * @since 1.1.0
 */
export const getDiagnostics = async (): Web_Api_GetDiagnostics_Returns => requestJSON(
  '/api/v1/diagnostics',
  diagnosticsSchema,
);

/**
 * API - Update Diagnostics.
 *
 * Turns Debug logging on or off and answers with the saved setting.
 * The change takes effect at once, without a restart.
 *
 * @param {Web_Api_Diagnostics} input - Input.
 *
 * @returns {Web_Api_UpdateDiagnostics_Returns}
 *
 * @since 1.1.0
 */
export const updateDiagnostics = async (
  input: Web_Api_Diagnostics,
): Web_Api_UpdateDiagnostics_Returns => requestJSON(
  '/api/v1/diagnostics',
  diagnosticsSchema,
  {
    body: input,
    method: 'PUT',
  },
);

/**
 * API - Start Check.
 *
 * Resolves registry digests without pulling images or recreating containers.
 * One container ID can limit the check to a selected managed container.
 *
 * @param {Web_Api_StartCheck_ContainerId} [containerId] - Container id.
 *
 * @returns {Web_Api_StartCheck_Returns}
 *
 * @since 1.1.0
 */
export const startCheck = async (containerId?: Web_Api_StartCheck_ContainerId): Web_Api_StartCheck_Returns => requestJSON(
  '/api/v1/checks',
  checkStartedSchema,
  {
    body: (containerId === undefined) ? {} : { containerId },
    method: 'POST',
  },
);

/**
 * API - Start Update.
 *
 * Applies updates to every managed container or to one selected container.
 * Monitor-only settings remain authoritative during the apply cycle.
 *
 * @param {Web_Api_StartUpdate_ContainerId} [containerId] - Container id.
 * @param {Web_Api_StartUpdate_Rollback}    [rollback]    - Rollback.
 *
 * @returns {Web_Api_StartUpdate_Returns}
 *
 * @since 1.1.0
 */
export const startUpdate = async (containerId?: Web_Api_StartUpdate_ContainerId, rollback: Web_Api_StartUpdate_Rollback = true): Web_Api_StartUpdate_Returns => {
  let body: Web_Api_StartUpdate_Body = {};

  if (containerId !== undefined) {
    body = {
      containerId,
      rollback,
    };
  } else if (rollback === false) {
    body = { rollback };
  }

  return requestJSON(
    '/api/v1/updates',
    checkStartedSchema,
    {
      body,
      method: 'POST',
    },
  );
};

/**
 * API - Get Tokens.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {Web_Api_GetTokens_Returns}
 *
 * @since 1.0.0
 */
export const getTokens = async (): Web_Api_GetTokens_Returns => {
  const response: Web_Api_GetTokens_Response = await requestJSON('/api/v1/auth/tokens', tokensResponseSchema);

  return response['items'];
};

/**
 * API - Create Token.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @param {Web_Api_CreateTokenInput} input - Input.
 *
 * @returns {Web_Api_CreateToken_Returns}
 *
 * @since 1.0.0
 */
export const createToken = async (
  input: Web_Api_CreateTokenInput,
): Web_Api_CreateToken_Returns => requestJSON(
  '/api/v1/auth/tokens',
  createdTokenSchema,
  {
    body: {
      ...((input['expiresAt'] === undefined) ? {} : { expiresAt: input['expiresAt'] }),
      name: input['name'].trim(),
      scopes: input['scopes'],
    },
    method: 'POST',
  },
);

/**
 * API - Update Token.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @param {Web_Api_UpdateToken_TokenId} tokenId - Token id.
 * @param {Web_Api_UpdateTokenInput}    input   - Input.
 *
 * @returns {Web_Api_UpdateToken_Returns}
 *
 * @since 1.0.0
 */
export const updateToken = async (
  tokenId: Web_Api_UpdateToken_TokenId,
  input: Web_Api_UpdateTokenInput,
): Web_Api_UpdateToken_Returns => requestJSON(
  `/api/v1/auth/tokens/${encodeURIComponent(tokenId)}`,
  tokenSchema,
  {
    body: {
      ...((input['expiresAt'] === undefined) ? {} : { expiresAt: input['expiresAt'] }),
      name: input['name'].trim(),
      scopes: input['scopes'],
    },
    method: 'PUT',
  },
);

/**
 * API - Revoke Token.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_Api_RevokeToken_TokenId} tokenId - Token id.
 *
 * @returns {Web_Api_RevokeToken_Returns}
 *
 * @since 1.0.0
 */
export const revokeToken = async (tokenId: Web_Api_RevokeToken_TokenId): Web_Api_RevokeToken_Returns => requestVoid(
  `/api/v1/auth/tokens/${encodeURIComponent(tokenId)}`,
  { method: 'DELETE' },
);

/**
 * API - Get Notifications.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {Web_Api_GetNotifications_Returns}
 *
 * @since 1.0.0
 */
export const getNotifications = async (): Web_Api_GetNotifications_Returns => {
  const response: Web_Api_GetNotifications_Response = await requestJSON('/api/v1/notifications', notificationTargetsResponseSchema);

  return response['items'];
};

/**
 * API - Get Notification Events.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {Web_Api_GetNotificationEvents_Returns}
 *
 * @since 1.0.0
 */
export const getNotificationEvents = async (): Web_Api_GetNotificationEvents_Returns => {
  const response: Web_Api_GetNotificationEvents_Response = await requestJSON('/api/v1/notifications/events', notificationEventsResponseSchema);

  return response['items'];
};

/**
 * API - Create Notification.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @param {Web_Notifications_CreateInput} input - Input.
 *
 * @returns {Web_Api_CreateNotification_Returns}
 *
 * @since 1.0.0
 */
export const createNotification = async (
  input: Web_Notifications_CreateInput,
): Web_Api_CreateNotification_Returns => requestJSON(
  '/api/v1/notifications',
  notificationTargetSchema,
  {
    body: {
      events: input['events'],
      name: input['name'].trim(),
      service: input['service'],
      settings: input['settings'],
    },
    method: 'POST',
  },
);

/**
 * API - Update Notification.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @param {Web_Api_UpdateNotification_NotificationId} notificationId - Notification id.
 * @param {Web_Notifications_UpdateInput}             input          - Input.
 *
 * @returns {Web_Api_UpdateNotification_Returns}
 *
 * @since 1.0.0
 */
export const updateNotification = async (
  notificationId: Web_Api_UpdateNotification_NotificationId,
  input: Web_Notifications_UpdateInput,
): Web_Api_UpdateNotification_Returns => requestJSON(
  `/api/v1/notifications/${encodeURIComponent(notificationId)}`,
  notificationTargetSchema,
  {
    body: {
      clearSecrets: input['clearSecrets'],
      events: input['events'],
      name: input['name'].trim(),
      settings: input['settings'],
    },
    method: 'PUT',
  },
);

/**
 * API - Remove Notification.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_Api_RemoveNotification_NotificationId} notificationId - Notification id.
 *
 * @returns {Web_Api_RemoveNotification_Returns}
 *
 * @since 1.0.0
 */
export const removeNotification = async (notificationId: Web_Api_RemoveNotification_NotificationId): Web_Api_RemoveNotification_Returns => requestVoid(
  `/api/v1/notifications/${encodeURIComponent(notificationId)}`,
  { method: 'DELETE' },
);

/**
 * API - Test Notification.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_Api_TestNotification_NotificationId} notificationId - Notification id.
 *
 * @returns {Web_Api_TestNotification_Returns}
 *
 * @since 1.0.0
 */
export const testNotification = async (notificationId: Web_Api_TestNotification_NotificationId): Web_Api_TestNotification_Returns => requestJSON(
  `/api/v1/notifications/${encodeURIComponent(notificationId)}/test`,
  notificationTestSchema,
  { method: 'POST' },
);

/**
 * API - Get Registries.
 *
 * Lists the private registry sign-ins Outpost uses for checks and pulls.
 * Only a signed-in browser session can read them, and passwords never come back.
 *
 * @returns {Web_Api_GetRegistries_Returns}
 *
 * @since 1.0.0
 */
export const getRegistries = async (): Web_Api_GetRegistries_Returns => {
  const response: Web_Api_GetRegistries_Response = await requestJSON('/api/v1/registries', registriesResponseSchema);

  return response['items'];
};

/**
 * API - Create Registry.
 *
 * Saves a sign-in for one registry host and returns it without the password.
 * A host that already has a sign-in is refused with an issue on the registry field.
 *
 * @param {Web_Api_RegistryInput} input - Input.
 *
 * @returns {Web_Api_CreateRegistry_Returns}
 *
 * @since 1.0.0
 */
export const createRegistry = async (
  input: Web_Api_RegistryInput,
): Web_Api_CreateRegistry_Returns => requestJSON(
  '/api/v1/registries',
  registrySchema,
  {
    body: {
      password: input['password'],
      registry: input['registry'].trim(),
      username: input['username'].trim(),
    },
    method: 'POST',
  },
);

/**
 * API - Update Registry.
 *
 * Changes a sign-in's host and username, and its password only when a new one is given.
 * Leaving the password out keeps the saved one.
 *
 * @param {Web_Api_UpdateRegistry_RegistryId} registryId - Registry id.
 * @param {Web_Api_RegistryUpdateInput}       input      - Input.
 *
 * @returns {Web_Api_UpdateRegistry_Returns}
 *
 * @since 1.0.0
 */
export const updateRegistry = async (
  registryId: Web_Api_UpdateRegistry_RegistryId,
  input: Web_Api_RegistryUpdateInput,
): Web_Api_UpdateRegistry_Returns => requestJSON(
  `/api/v1/registries/${encodeURIComponent(registryId)}`,
  registrySchema,
  {
    body: {
      ...((input['password'] === undefined) ? {} : { password: input['password'] }),
      registry: input['registry'].trim(),
      username: input['username'].trim(),
    },
    method: 'PUT',
  },
);

/**
 * API - Remove Registry.
 *
 * Deletes one sign-in so later checks reach that registry without a login.
 * Other sign-ins are unaffected.
 *
 * @param {Web_Api_RemoveRegistry_RegistryId} registryId - Registry id.
 *
 * @returns {Web_Api_RemoveRegistry_Returns}
 *
 * @since 1.0.0
 */
export const removeRegistry = async (registryId: Web_Api_RemoveRegistry_RegistryId): Web_Api_RemoveRegistry_Returns => requestVoid(
  `/api/v1/registries/${encodeURIComponent(registryId)}`,
  { method: 'DELETE' },
);

/**
 * API - Confirm Backup Operation.
 *
 * Exchanges fresh password and authenticator proof for one scoped, single-use grant.
 * Blank authenticator input is omitted when the account has no TOTP factor.
 *
 * @param {Web_Backup_Purpose}                      purpose  - Purpose.
 * @param {Web_Api_ConfirmBackupOperation_Password} password - Password.
 * @param {Web_Api_ConfirmBackupOperation_Code}     code     - Code.
 *
 * @returns {Web_Api_ConfirmBackupOperation_Returns}
 *
 * @since 1.1.0
 */
export const confirmBackupOperation = async (purpose: Web_Backup_Purpose, password: Web_Api_ConfirmBackupOperation_Password, code: Web_Api_ConfirmBackupOperation_Code): Web_Api_ConfirmBackupOperation_Returns => {
  const result: Web_Backup_Grant = await requestJSON('/api/v1/backup/confirmation', backupGrantSchema, {
    body: {
      ...((code === '') ? {} : { code }),
      password,
      purpose,
    },
    method: 'POST',
  });

  return result['grant'];
};

/**
 * API - Confirm Backup Operation With Passkey.
 *
 * Runs a session- and purpose-bound WebAuthn ceremony for a one-use grant.
 * Browser WebAuthn output is posted directly to the matching verification route.
 *
 * @param {Web_Backup_Purpose} purpose - Purpose.
 *
 * @returns {Web_Api_ConfirmBackupOperationWithPasskey_Returns}
 *
 * @since 1.1.0
 */
export const confirmBackupOperationWithPasskey = async (purpose: Web_Backup_Purpose): Web_Api_ConfirmBackupOperationWithPasskey_Returns => {
  const ceremony: Web_Api_PasskeyCeremony = await requestJSON('/api/v1/backup/confirmation/passkey/options', passkeyCeremonySchema, {
    body: { purpose },
    method: 'POST',
  });
  const credential: Web_Api_ConfirmBackupOperationWithPasskey_Credential = await getPasskey(ceremony['options']);
  const result: Web_Backup_Grant = await requestJSON('/api/v1/backup/confirmation/passkey/verify', backupGrantSchema, {
    body: {
      ceremonyId: ceremony['ceremonyId'],
      credential,
      purpose,
    },
    method: 'POST',
  });

  return result['grant'];
};

/**
 * API - Download Backup Export.
 *
 * Streams the secret-bearing response into a temporary browser download.
 * The object URL is revoked immediately after the download click.
 *
 * @param {Web_Backup_ExportSections}          sections - Sections.
 * @param {Web_Api_DownloadBackupExport_Grant} grant    - Grant.
 *
 * @returns {Web_Api_DownloadBackupExport_Returns}
 *
 * @since 1.1.0
 */
export const downloadBackupExport = async (sections: Web_Backup_ExportSections, grant: Web_Api_DownloadBackupExport_Grant): Web_Api_DownloadBackupExport_Returns => {
  const response: Response = await fetch('/api/v1/backup/export', {
    ...buildRequest({
      body: {
        grant,
        sections,
      },
      method: 'POST',
    }),
    cache: 'no-store',
  });

  if (response.ok === false) {
    throw await responseError(response);
  }

  const contentDisposition: Web_Api_DownloadBackupExport_ContentDisposition = response.headers.get('Content-Disposition') ?? '';
  const filenameMatch: Web_Api_DownloadBackupExport_FilenameMatch = contentDisposition.match(new RegExp(contentDispositionFilenamePattern, 'u'));
  const matchedFilename: Web_Api_DownloadBackupExport_MatchedFilename = (filenameMatch !== null) ? filenameMatch[1] : undefined;
  const filename: Web_Api_DownloadBackupExport_Filename = matchedFilename ?? `outpost-export-${new Date().toISOString().slice(0, 10)}.json`;
  const objectUrl: Web_Api_DownloadBackupExport_ObjectUrl = URL.createObjectURL(await response.blob());
  const link: HTMLAnchorElement = document.createElement('a');

  try {
    link.href = objectUrl;
    link.download = filename;
    link.click();
  } finally {
    URL.revokeObjectURL(objectUrl);
  }

  return;
};

/**
 * API - Preview Backup Import.
 *
 * Sends a strictly parsed document for a read-only comparison with current state.
 * Preview never needs or consumes a fresh identity-confirmation grant.
 *
 * @param {Web_Backup_Document} document - Document.
 *
 * @returns {Web_Api_PreviewBackupImport_Returns}
 *
 * @since 1.1.0
 */
export const previewBackupImport = async (document: Web_Backup_Document): Web_Api_PreviewBackupImport_Returns => requestJSON(
  '/api/v1/backup/imports/preview',
  backupImportPreviewSchema,
  {
    body: { document },
    method: 'POST',
  },
);

/**
 * API - Apply Backup Import.
 *
 * Submits the reviewed document with a freshly confirmed import grant.
 * The server validates the entire document again before applying it.
 *
 * @param {Web_Backup_Document}             document - Document.
 * @param {Web_Api_ApplyBackupImport_Grant} grant    - Grant.
 *
 * @returns {Web_Api_ApplyBackupImport_Returns}
 *
 * @since 1.1.0
 */
export const applyBackupImport = async (document: Web_Backup_Document, grant: Web_Api_ApplyBackupImport_Grant): Web_Api_ApplyBackupImport_Returns => requestJSON(
  '/api/v1/backup/imports',
  backupImportResultSchema,
  {
    body: {
      document,
      grant,
    },
    method: 'POST',
  },
);

// parseEventData reads one event's JSON, or nothing when it isn't JSON.

/**
 * API - Parse Event Data.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_Api_ParseEventData_Data} data - Data.
 *
 * @returns {Web_Api_ParseEventData_Returns}
 *
 * @since 1.0.0
 */
const parseEventData = (data: Web_Api_ParseEventData_Data): Web_Api_ParseEventData_Returns => {
  try {
    return JSON.parse(data);
  } catch {
    return undefined;
  }
};

// connectEvents follows the live stream: the scheduler state on connect and on every change, and each finished check.

/**
 * API - Connect Events.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_Api_Events_Handlers} handlers - Handlers.
 *
 * @returns {Web_Api_Events_Close}
 *
 * @since 1.0.0
 */
export const connectEvents = (handlers: Web_Api_Events_Handlers): Web_Api_Events_Close => {
  const source: EventSource = new EventSource('/api/v1/events');
  let opened: Web_Api_ConnectEvents_Opened = false;

  source.addEventListener('open', () => {
    // A second open is a reconnect, and checks that finished in between were missed.
    if (opened === true) {
      handlers.onReconnect();
    }

    opened = true;

    return;
  });

  source.addEventListener('state', (event) => {
    const parsedState: Web_Api_ConnectEvents_ParsedState = overviewSchema.safeParse(parseEventData(event.data));
    if (parsedState.success === true) {
      handlers.onState(parsedState.data);
    }

    return;
  });

  source.addEventListener('check', (event) => {
    const parsedReport: Web_Api_ConnectEvents_ParsedReport = reportSchema.safeParse(parseEventData(event.data));
    if (parsedReport.success === true) {
      handlers.onCheck(parsedReport.data);
    }

    return;
  });

  source.addEventListener('error', () => {
    // EventSource retries on its own; once it gives up, for example after a 401, the stream stays closed.
    if (source.readyState === EventSource.CLOSED) {
      handlers.onClosed();
    }

    return;
  });

  return () => {
    source.close();

    return;
  };
};

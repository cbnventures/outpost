import {
  createHash,
  randomBytes,
} from 'node:crypto';

import { toDataURL } from 'qrcode';

import {
  administratorUsernamePattern,
  containerIdPattern,
  httpSchemePattern,
  isoTimestampPattern,
  notificationPathPattern,
  registryHostPattern,
  registryPathPattern,
  separatorsPattern,
  tokenPathPattern,
  totpCodePattern,
} from './src/web/regex.js';

import type {
  MockApi_Administrator,
  MockApi_AdministratorId,
  MockApi_At_Date,
  MockApi_At_DaysAgo,
  MockApi_At_Hour,
  MockApi_At_Minutes,
  MockApi_At_Returns,
  MockApi_BackupGrants,
  MockApi_BackupPasskeyCeremonies,
  MockApi_Broadcast_Data,
  MockApi_Broadcast_Event,
  MockApi_Broadcast_Returns,
  MockApi_CheckedContainers_Returns,
  MockApi_ContainerRows_Report,
  MockApi_ContainerRows_Result,
  MockApi_ContainerRows_Returns,
  MockApi_ContainerRows_Rows,
  MockApi_Containers,
  MockApi_Day,
  MockApi_DebugLogging,
  MockApi_Digest_Returns,
  MockApi_Digest_Value,
  MockApi_EventClients,
  MockApi_FakeDigest_Returns,
  MockApi_FakeDigest_Seed,
  MockApi_FieldIssue_Field,
  MockApi_FieldIssue_Message,
  MockApi_FieldIssue_Returns,
  MockApi_HandleRequest_Action,
  MockApi_HandleRequest_Alias,
  MockApi_HandleRequest_Aliases,
  MockApi_HandleRequest_AliasMethod,
  MockApi_HandleRequest_AliasPrincipal,
  MockApi_HandleRequest_AliasRoute,
  MockApi_HandleRequest_AliasScope,
  MockApi_HandleRequest_AllowCredential,
  MockApi_HandleRequest_Allowed,
  MockApi_HandleRequest_Binding,
  MockApi_HandleRequest_Body,
  MockApi_HandleRequest_CeremonyId,
  MockApi_HandleRequest_CeremonyPasskeyName,
  MockApi_HandleRequest_CheckPassword,
  MockApi_HandleRequest_CheckPassword_Field,
  MockApi_HandleRequest_CheckPassword_Returns,
  MockApi_HandleRequest_ClaimUsername,
  MockApi_HandleRequest_Code,
  MockApi_HandleRequest_ContainerId,
  MockApi_HandleRequest_Document,
  MockApi_HandleRequest_DocumentSettings,
  MockApi_HandleRequest_Duplicate,
  MockApi_HandleRequest_ExistingNotification,
  MockApi_HandleRequest_ExistingRegistry,
  MockApi_HandleRequest_ExportDocument,
  MockApi_HandleRequest_ExportSecretEntry,
  MockApi_HandleRequest_Extra,
  MockApi_HandleRequest_FileRegistries,
  MockApi_HandleRequest_FileTargets,
  MockApi_HandleRequest_FileTokens,
  MockApi_HandleRequest_FoundNotification,
  MockApi_HandleRequest_FoundRegistry,
  MockApi_HandleRequest_FoundToken,
  MockApi_HandleRequest_Grant,
  MockApi_HandleRequest_ImportDocument,
  MockApi_HandleRequest_ImportedNotification,
  MockApi_HandleRequest_ImportedSecretEntry,
  MockApi_HandleRequest_ImportedSections,
  MockApi_HandleRequest_ImportSummary,
  MockApi_HandleRequest_Index,
  MockApi_HandleRequest_Issues,
  MockApi_HandleRequest_IsTotpCode,
  MockApi_HandleRequest_KeepAlive,
  MockApi_HandleRequest_LoginUsername,
  MockApi_HandleRequest_Method,
  MockApi_HandleRequest_MeUsername,
  MockApi_HandleRequest_NewUsername,
  MockApi_HandleRequest_Notification,
  MockApi_HandleRequest_NotificationInput,
  MockApi_HandleRequest_NotificationInput_Clearable,
  MockApi_HandleRequest_NotificationInput_ClearSecretKeys,
  MockApi_HandleRequest_NotificationInput_ClearSecrets,
  MockApi_HandleRequest_NotificationInput_Events,
  MockApi_HandleRequest_NotificationInput_Existing,
  MockApi_HandleRequest_NotificationInput_InvalidIndex,
  MockApi_HandleRequest_NotificationInput_Key,
  MockApi_HandleRequest_NotificationInput_Missing,
  MockApi_HandleRequest_NotificationInput_Name,
  MockApi_HandleRequest_NotificationInput_PlainSettings,
  MockApi_HandleRequest_NotificationInput_Replaced,
  MockApi_HandleRequest_NotificationInput_Required,
  MockApi_HandleRequest_NotificationInput_Returns,
  MockApi_HandleRequest_NotificationInput_Saved,
  MockApi_HandleRequest_NotificationInput_Secret,
  MockApi_HandleRequest_NotificationInput_Secrets,
  MockApi_HandleRequest_NotificationInput_Service,
  MockApi_HandleRequest_NotificationInput_Value,
  MockApi_HandleRequest_NotificationInput_Values,
  MockApi_HandleRequest_NotificationInputResult,
  MockApi_HandleRequest_NotificationMatch,
  MockApi_HandleRequest_ParsedBody,
  MockApi_HandleRequest_Passkey,
  MockApi_HandleRequest_PasskeyId,
  MockApi_HandleRequest_PasskeyName,
  MockApi_HandleRequest_PasskeyUsername,
  MockApi_HandleRequest_Password,
  MockApi_HandleRequest_Path,
  MockApi_HandleRequest_Plaintext,
  MockApi_HandleRequest_PreviewSections,
  MockApi_HandleRequest_Principal,
  MockApi_HandleRequest_Purpose,
  MockApi_HandleRequest_RecoveryCode,
  MockApi_HandleRequest_Registry,
  MockApi_HandleRequest_RegistryHosts,
  MockApi_HandleRequest_RegistryInputResult,
  MockApi_HandleRequest_RegistryMatch,
  MockApi_HandleRequest_RejectUnknown,
  MockApi_HandleRequest_RejectUnknown_Allowed,
  MockApi_HandleRequest_RejectUnknown_Extra,
  MockApi_HandleRequest_RejectUnknown_Returns,
  MockApi_HandleRequest_Request,
  MockApi_HandleRequest_RequireScope,
  MockApi_HandleRequest_RequireScope_Returns,
  MockApi_HandleRequest_RequireScope_Scope,
  MockApi_HandleRequest_Response,
  MockApi_HandleRequest_Returns,
  MockApi_HandleRequest_Rollback,
  MockApi_HandleRequest_SavedUsername,
  MockApi_HandleRequest_Sections,
  MockApi_HandleRequest_SecurityUsername,
  MockApi_HandleRequest_SettingsChanged,
  MockApi_HandleRequest_SettingsKey,
  MockApi_HandleRequest_Started,
  MockApi_HandleRequest_Target,
  MockApi_HandleRequest_TargetNames,
  MockApi_HandleRequest_Token,
  MockApi_HandleRequest_TokenHashes,
  MockApi_HandleRequest_TokenIds,
  MockApi_HandleRequest_TokenInputResult,
  MockApi_HandleRequest_TokenMatch,
  MockApi_HandleRequest_TokenNames,
  MockApi_HandleRequest_TotpUri,
  MockApi_HandleRequest_TotpUsername,
  MockApi_HandleRequest_Url,
  MockApi_History,
  MockApi_History_StartTime,
  MockApi_Jellyfin,
  MockApi_KeyReplaced,
  MockApi_LastCheckDay,
  MockApi_LastError,
  MockApi_LiveResult_Action,
  MockApi_LiveResult_Container,
  MockApi_LiveResult_Result,
  MockApi_LiveResult_Returns,
  MockApi_LiveUpdates,
  MockApi_LongContainer,
  MockApi_MetricsText_LastReport,
  MockApi_MetricsText_Lines,
  MockApi_MetricsText_Returns,
  MockApi_MetricsText_RunningValue,
  MockApi_Minute,
  MockApi_MockApi_ErrorText,
  MockApi_MockApi_Next,
  MockApi_MockApi_Request,
  MockApi_MockApi_Response,
  MockApi_MockApi_Returns,
  MockApi_MockNotificationService,
  MockApi_MockPassword,
  MockApi_MockScope,
  MockApi_NewRecoveryCodes_Code,
  MockApi_NewRecoveryCodes_Returns,
  MockApi_NextRun_Returns,
  MockApi_NormalizeCode_Returns,
  MockApi_NormalizeCode_Value,
  MockApi_NormalizeRegistry_Host,
  MockApi_NormalizeRegistry_Returns,
  MockApi_NormalizeRegistry_Value,
  MockApi_NotificationEvents,
  MockApi_NotificationFields,
  MockApi_Notifications,
  MockApi_OverviewResource_Returns,
  MockApi_PasskeyCeremonies,
  MockApi_Passkeys,
  MockApi_PasswordIssue_Returns,
  MockApi_PasswordIssue_Value,
  MockApi_PendingChallenge,
  MockApi_PrincipalOf_Authorization,
  MockApi_PrincipalOf_Plaintext,
  MockApi_PrincipalOf_Request,
  MockApi_PrincipalOf_Returns,
  MockApi_PrincipalOf_SessionId,
  MockApi_PrincipalOf_Token,
  MockApi_ReadBody_Body,
  MockApi_ReadBody_Chunks,
  MockApi_ReadBody_Parsed,
  MockApi_ReadBody_Request,
  MockApi_ReadBody_Returns,
  MockApi_ReadBody_Text,
  MockApi_ReadCookies_Entries,
  MockApi_ReadCookies_Entry,
  MockApi_ReadCookies_Request,
  MockApi_ReadCookies_Returns,
  MockApi_RecoveryCodes,
  MockApi_Registries,
  MockApi_RegistryInput_Body,
  MockApi_RegistryInput_Creating,
  MockApi_RegistryInput_ExceptId,
  MockApi_RegistryInput_Issues,
  MockApi_RegistryInput_Password,
  MockApi_RegistryInput_Registry,
  MockApi_RegistryInput_Response,
  MockApi_RegistryInput_Returns,
  MockApi_RegistryInput_Username,
  MockApi_RemovedSecrets,
  MockApi_ResultFor_Container,
  MockApi_ResultFor_DaysAgo,
  MockApi_ResultFor_Detail,
  MockApi_ResultFor_Entry,
  MockApi_ResultFor_Returns,
  MockApi_ResultFor_Status,
  MockApi_ResultFor_Summary,
  MockApi_RunAction,
  MockApi_Running,
  MockApi_RunStartedAt,
  MockApi_SchedulerState_Returns,
  MockApi_ScopeOrder,
  MockApi_SecretKeys,
  MockApi_SeedReport_DaysAgo,
  MockApi_SeedReport_Returns,
  MockApi_SeedReport_Seconds,
  MockApi_SeedReport_StartTime,
  MockApi_SeedReport_Trigger,
  MockApi_SeedTokens,
  MockApi_SendEmpty_Response,
  MockApi_SendEmpty_Returns,
  MockApi_SendError_Code,
  MockApi_SendError_Message,
  MockApi_SendError_Response,
  MockApi_SendError_Returns,
  MockApi_SendError_Status,
  MockApi_SendIssues_Code,
  MockApi_SendIssues_FirstIssue,
  MockApi_SendIssues_Issues,
  MockApi_SendIssues_Response,
  MockApi_SendIssues_Returns,
  MockApi_SendIssues_Status,
  MockApi_SendJson_Body,
  MockApi_SendJson_Response,
  MockApi_SendJson_Returns,
  MockApi_SendJson_Status,
  MockApi_Sessions,
  MockApi_Settings,
  MockApi_SetupCode,
  MockApi_StartCycle_Action,
  MockApi_StartCycle_ContainerId,
  MockApi_StartCycle_Report,
  MockApi_StartCycle_Returns,
  MockApi_StartCycle_Rollback,
  MockApi_StartCycle_Targets,
  MockApi_StartCycle_Trigger,
  MockApi_StartedAt,
  MockApi_StartSession_CsrfToken,
  MockApi_StartSession_Response,
  MockApi_StartSession_Returns,
  MockApi_StartSession_SessionId,
  MockApi_StartSession_Status,
  MockApi_StartSession_Username,
  MockApi_TokenInput_Body,
  MockApi_TokenInput_Creating,
  MockApi_TokenInput_ExceptId,
  MockApi_TokenInput_ExpiresAt,
  MockApi_TokenInput_Extra,
  MockApi_TokenInput_Issues,
  MockApi_TokenInput_Name,
  MockApi_TokenInput_RawScopes,
  MockApi_TokenInput_Response,
  MockApi_TokenInput_Returns,
  MockApi_TokenResource_Returns,
  MockApi_TokenResource_Token,
  MockApi_Tokens,
  MockApi_Totals,
  MockApi_TotpEnabled,
  MockApi_TotpPending,
  MockApi_UnknownFields_Allowed,
  MockApi_UnknownFields_Body,
  MockApi_UnknownFields_Fields,
  MockApi_UnknownFields_Returns,
  MockApi_UsernameIssue_Returns,
  MockApi_UsernameIssue_Value,
} from './src/types/mock-api.d.ts';

/**
 * Mock API - Setup Code.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
const setupCode: MockApi_SetupCode = 'K7Q2M-XR9TD-P4W8N';

/**
 * Mock API - Mock Password.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
const mockPassword: MockApi_MockPassword = 'mock password 123';

// Each service's fields: [key, message when missing, secret, required].

/**
 * Mock API - Notification Fields.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
const notificationFields: MockApi_NotificationFields = {
  'apprise': [
    [
      'url',
      'Enter the Apprise URL.',
      true,
      true,
    ],
    [
      'urls',
      '',
      true,
      false,
    ],
  ],
  'discord': [[
    'webhookUrl',
    'Enter the webhook URL.',
    true,
    true,
  ]],
  'email': [
    [
      'host',
      'Enter the SMTP server.',
      false,
      true,
    ],
    [
      'port',
      'Enter a port number.',
      false,
      true,
    ],
    [
      'security',
      'Choose STARTTLS, TLS, or none.',
      false,
      true,
    ],
    [
      'username',
      '',
      false,
      false,
    ],
    [
      'password',
      '',
      true,
      false,
    ],
    [
      'from',
      'Enter the address to send from.',
      false,
      true,
    ],
    [
      'to',
      'Enter the address to send to.',
      false,
      true,
    ],
  ],
  'gotify': [
    [
      'url',
      'Enter the server URL.',
      false,
      true,
    ],
    [
      'token',
      'Enter the app token.',
      true,
      true,
    ],
  ],
  'matrix': [
    [
      'homeserverUrl',
      'Enter the homeserver URL.',
      false,
      true,
    ],
    [
      'roomId',
      'Enter the room ID.',
      false,
      true,
    ],
    [
      'accessToken',
      'Enter the access token.',
      true,
      true,
    ],
  ],
  'ntfy': [
    [
      'url',
      'Enter the topic URL.',
      false,
      true,
    ],
    [
      'token',
      '',
      true,
      false,
    ],
  ],
  'ntfy-reverse-proxy': [
    [
      'url',
      'Enter the context URL.',
      false,
      true,
    ],
    [
      'token',
      '',
      true,
      false,
    ],
  ],
  'pushover': [
    [
      'userKey',
      'Enter the user key.',
      true,
      true,
    ],
    [
      'appToken',
      'Enter the app token.',
      true,
      true,
    ],
  ],
  'slack': [[
    'webhookUrl',
    'Enter the webhook URL.',
    true,
    true,
  ]],
  'telegram': [
    [
      'botToken',
      'Enter the bot token.',
      true,
      true,
    ],
    [
      'chatId',
      'Enter the chat ID.',
      false,
      true,
    ],
  ],
  'webhook': [
    [
      'url',
      'Enter the URL.',
      true,
      true,
    ],
    [
      'token',
      '',
      true,
      false,
    ],
  ],
};

/**
 * Mock API - Notification Events.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
const notificationEvents: MockApi_NotificationEvents = [
  {
    defaultEnabled: true,
    description: 'The app started without its key and removed what it locked.',
    key: 'secrets-removed',
    label: 'Saved secrets were removed',
  },
  {
    defaultEnabled: true,
    description: 'Ten failed sign-ins from one address paused sign-in from it.',
    key: 'sign-in-locked',
    label: 'Sign-in locked',
  },
  {
    defaultEnabled: true,
    description: 'Containers were updated to new images.',
    key: 'updates-applied',
    label: 'Containers updated',
  },
  {
    defaultEnabled: true,
    description: 'A check found new container images.',
    key: 'updates-available',
    label: 'New images available',
  },
  {
    defaultEnabled: true,
    description: 'An update failed, was rolled back, or was kept after failure.',
    key: 'update-failed',
    label: 'Update failed',
  },
];

/**
 * Mock API - Minute.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
const minute: MockApi_Minute = 60 * 1000;

/**
 * Mock API - Day.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
const day: MockApi_Day = 24 * 60 * minute;

/**
 * Mock API - Started At.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
const startedAt: MockApi_StartedAt = Date.now();

/**
 * Mock API - Settings.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
const settings: MockApi_Settings = {
  runtime: {
    cleanup: true,
    healthTimeoutSeconds: 120,
    labelMode: 'opt-out',
    monitorOnly: false,
    runOnStart: false,
    schedule: '0 0 4 * * *',
    settleSeconds: 10,
    stopTimeoutSeconds: 30,
  },
  system: {
    dataDirectory: '/config',
    dockerHost: 'unix:///var/run/docker.sock',
    timeZone: 'UTC',
  },
};

/**
 * Mock API - Scope Order.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
const scopeOrder: MockApi_ScopeOrder = [
  'metrics:read',
  'status:read',
  'updates:run',
];

/**
 * Mock API - Administrator ID.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
const administratorId: MockApi_AdministratorId = '00000000-0000-4000-8000-000000000001';

/**
 * Mock API - Digest.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {MockApi_Digest_Returns}
 *
 * @since 1.0.0
 */
const digest = (value: MockApi_Digest_Value): MockApi_Digest_Returns => createHash('sha256').update(value).digest('hex');

// fakeDigest makes a stable, realistic image digest from a seed.

/**
 * Mock API - Fake Digest.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {MockApi_FakeDigest_Returns}
 *
 * @since 1.0.0
 */
const fakeDigest = (seed: MockApi_FakeDigest_Seed): MockApi_FakeDigest_Returns => `sha256:${digest(seed)}`;

// The seeds count days back from the latest 4:00 check, so the history looks the same at any hour.

/**
 * Mock API - Last Check Day.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
const lastCheckDay: MockApi_LastCheckDay = new Date();

if (lastCheckDay.getHours() < 4) {
  lastCheckDay.setDate(lastCheckDay.getDate() - 1);
}

// at returns the time a number of days before the latest 4:00 check's day at a given local hour and minute.

/**
 * Mock API - At.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {MockApi_At_Returns}
 *
 * @since 1.0.0
 */
const at = (daysAgo: MockApi_At_DaysAgo, hour: MockApi_At_Hour, minutes: MockApi_At_Minutes = 0): MockApi_At_Returns => {
  const date: MockApi_At_Date = new Date(lastCheckDay);

  date.setDate(date.getDate() - daysAgo);

  date.setHours(hour, minutes, 0, 0);

  return date.getTime();
};

// nextRun is the next 4:00 the schedule fires at.

/**
 * Mock API - Next Run.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {MockApi_NextRun_Returns}
 *
 * @since 1.0.0
 */
const nextRun = (): MockApi_NextRun_Returns => new Date(at(-1, 4)).toISOString();

/**
 * Mock API - Containers.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
const containers: MockApi_Containers = [
  {
    history: {
      0: [
        'held',
        'Rolled back last time; waiting for a newer image (0123456789ab). Update this container with rollback disabled to keep and inspect the rejected image',
      ],
    },
    id: '4f6c2a1e9b3d',
    image: 'traefik:v3.2',
    managed: true,
    monitorOnly: false,
    name: 'traefik',
    note: 'Managed',
  },
  {
    history: {
      1: [
        'updated',
        'Recreated with localhost:22690/e2e/uptodate-app:latest',
      ],
      7: [
        'updated',
        'Recreated with localhost:22690/e2e/uptodate-app:latest',
      ],
    },
    id: '9a8e7d6c5b4a',
    image: 'localhost:22690/e2e/uptodate-app:latest',
    managed: true,
    monitorOnly: false,
    name: 'discord-stonker-bot-fresh-app-1',
    note: 'Managed',
  },
  {
    history: {
      0: [
        'kept-unhealthy',
        `New container unhealthy; rollback was disabled, so replacement container ${'d'.repeat(64)} was kept as Docker left it. Previous container ${'c'.repeat(64)} (image sha256:${'e'.repeat(64)}) was renamed to e2e-app-outpost-kept-20261106T040413Z and remains stopped; previous container config summary: ${JSON.stringify({
          configuredImage: 'localhost:22690/e2e/a-very-long-repository-name/with-nested-path-segments/app:latest',
          containerId: 'c'.repeat(64),
          environmentVariables: [
            'PATH',
            'NODE_ENV',
            'A_VERY_LONG_ENVIRONMENT_VARIABLE_NAME',
          ],
          exposedPorts: ['22601/tcp'],
          mounts: [
            '/config',
            '/var/run/docker.sock',
          ],
          name: 'e2e-app',
          networks: ['e2e_default'],
        })}`,
        'Replacement failed its startup check; previous container kept as e2e-app-outpost-kept-20261106T040413Z',
      ],
    },
    id: 'c'.repeat(64),
    image: 'localhost:22690/e2e/a-very-long-repository-name/with-nested-path-segments/app:latest',
    managed: true,
    monitorOnly: false,
    name: 'e2e-app',
    note: 'Managed',
  },
  {
    history: {
      5: [
        'updated',
        'Recreated with postgres:16-alpine',
      ],
    },
    id: '1b2c3d4e5f60',
    image: 'postgres:16-alpine',
    managed: true,
    monitorOnly: false,
    name: 'nextcloud-db',
    note: 'Managed',
  },
  {
    history: {
      0: [
        'failed',
        'Registry "ghcr.io" returned HTTP 503 for "immich-app/immich-server:release".',
      ],
      4: [
        'rolled-back',
        'New container did not become healthy within 120s; rolled back to the previous container',
      ],
    },
    id: '7e1f0a9b8c2d',
    image: 'ghcr.io/immich-app/immich-server:release',
    managed: true,
    monitorOnly: false,
    name: 'immich-server',
    note: 'Managed',
  },
  {
    history: {
      0: [
        'available',
        `New digest ${fakeDigest('jellyfin-10.10.3')}`,
      ],
      1: [
        'available',
        `New digest ${fakeDigest('jellyfin-10.10.3')}`,
      ],
      2: [
        'available',
        `New digest ${fakeDigest('jellyfin-10.10.3')}`,
      ],
    },
    id: '3c4d5e6f7a8b',
    image: 'jellyfin/jellyfin:10.10',
    managed: true,
    monitorOnly: true,
    name: 'jellyfin',
    note: 'Managed',
  },
  {
    history: {},
    id: '5d6e7f8a9b0c',
    image: 'ghcr.io/home-assistant/home-assistant:stable',
    managed: false,
    monitorOnly: false,
    name: 'container-name_with-exactly-fifty-characters-12345',
    note: 'Opted out by label',
  },
  {
    history: {},
    id: '8b9c0d1e2f3a',
    image: `pihole/pihole@${fakeDigest('pihole-2024.07.0')}`,
    managed: false,
    monitorOnly: false,
    name: 'pihole',
    note: 'Pinned image',
    skipped: 'Image is pinned to a digest or ID',
  },
  {
    history: {},
    id: '2a3b4c5d6e7f',
    image: 'qmcgaw/gluetun:v3.39',
    managed: false,
    monitorOnly: false,
    name: 'gluetun',
    note: 'Network namespace owner',
    skipped: 'Has containers sharing its network namespace',
  },
  {
    history: {},
    id: '6f7a8b9c0d1e',
    image: 'lscr.io/linuxserver/qbittorrent:latest',
    managed: false,
    monitorOnly: false,
    name: 'qbittorrent',
    note: 'Shared network namespace',
    skipped: 'Shares another container\'s network namespace',
  },
  {
    history: {
      1: [
        'updated',
        'Recreated with cbnventures/outpost:latest',
      ],
    },
    id: '0e1d2c3b4a59',
    image: 'cbnventures/outpost:latest',
    managed: true,
    monitorOnly: false,
    name: 'outpost',
    note: 'Managed',
    self: true,
  },
];

// resultFor says what a check found for one container on a given day; skipped containers always say why.

/**
 * Mock API - Result For.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {MockApi_ResultFor_Returns}
 *
 * @since 1.0.0
 */
const resultFor = (container: MockApi_ResultFor_Container, daysAgo: MockApi_ResultFor_DaysAgo): MockApi_ResultFor_Returns => {
  if (container['skipped'] !== undefined) {
    return {
      container: container['name'],
      detail: container['skipped'],
      image: container['image'],
      status: 'skipped',
    };
  }

  const entry: MockApi_ResultFor_Entry = container['history'][daysAgo] ?? [
    'up-to-date',
    fakeDigest(`${container['image']}-current`),
  ];
  const status: MockApi_ResultFor_Status = entry[0];
  const detail: MockApi_ResultFor_Detail = entry[1];
  const summary: MockApi_ResultFor_Summary = entry[2];

  return {
    container: container['name'],
    detail,
    image: container['image'],
    status,
    ...((summary === undefined) ? {} : { summary }),
  };
};

// Opted-out containers never appear in a check; every other container does.

/**
 * Mock API - Checked Containers.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {MockApi_CheckedContainers_Returns}
 *
 * @since 1.0.0
 */
const checkedContainers = (): MockApi_CheckedContainers_Returns => containers.filter((container) => container['note'] !== 'Opted out by label');

/**
 * Mock API - Seed Report.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {MockApi_SeedReport_Returns}
 *
 * @since 1.0.0
 */
const seedReport = (daysAgo: MockApi_SeedReport_DaysAgo, startTime: MockApi_SeedReport_StartTime, seconds: MockApi_SeedReport_Seconds, trigger: MockApi_SeedReport_Trigger): MockApi_SeedReport_Returns => ({
  action: 'update',
  finishedAt: new Date(startTime + (seconds * 1000)).toISOString(),
  results: checkedContainers().map((container) => resultFor(container, daysAgo)),
  startedAt: new Date(startTime).toISOString(),
  trigger,
});

// About two weeks of checks: one each night at 4:00, plus a few started by hand, by a script, or at startup.

/**
 * Mock API - History.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
const history: MockApi_History = [];

for (let daysAgo = 10; daysAgo >= 0; daysAgo -= 1) {
  const startTime: MockApi_History_StartTime = at(daysAgo, 4);

  if (startTime > Date.now()) {
    continue;
  }

  if (daysAgo === 8) {
    history.unshift({
      action: 'update',
      error: 'connect ENOENT /var/run/docker.sock',
      finishedAt: new Date(startTime + 1200).toISOString(),
      results: [{
        container: 'Outpost',
        detail: 'Update cycle failed: connect ENOENT /var/run/docker.sock',
        image: 'update cycle',
        status: 'failed',
      }],
      startedAt: new Date(startTime).toISOString(),
      trigger: 'schedule',
    });

    continue;
  }

  history.unshift(seedReport(daysAgo, startTime, 24 + ((daysAgo * 7) % 19) + ((daysAgo === 1 || daysAgo === 4) ? 52 : 0), 'schedule'));

  if (daysAgo === 6) {
    history.unshift(seedReport(daysAgo, at(daysAgo, 9, 12), 31, 'startup'));
  }

  if (daysAgo === 3) {
    history.unshift(seedReport(daysAgo, at(daysAgo, 14, 26), 27, 'api'));
  }
}

/**
 * Mock API - Jellyfin.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 1.0.0
 */
const jellyfin: MockApi_Jellyfin = containers.find((container) => container['name'] === 'jellyfin');

if (jellyfin !== undefined) {
  history.unshift({
    action: 'check',
    finishedAt: new Date(at(1, 18, 20) + 4000).toISOString(),
    results: [resultFor(jellyfin, 1)],
    startedAt: new Date(at(1, 18, 20)).toISOString(),
    trigger: 'dashboard',
  });
}

/**
 * Mock API - Long Container.
 *
 * Drives responsive dashboard checks with a real registry path, full Docker
 * IDs, recovery detail, and a concise table summary.
 *
 * @since 1.1.0
 */
const longContainer: MockApi_LongContainer = containers.find((container) => container['name'] === 'e2e-app');

if (longContainer !== undefined) {
  history.unshift({
    action: 'update',
    finishedAt: new Date(at(0, 19, 20) + 4000).toISOString(),
    rollback: false,
    results: [resultFor(longContainer, 0)],
    startedAt: new Date(at(0, 19, 20)).toISOString(),
    trigger: 'dashboard',
  });
}

history.sort((left, right) => right['startedAt'].localeCompare(left['startedAt']));

/**
 * Mock API - Administrator.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
let administrator: MockApi_Administrator = null;

/**
 * Mock API - Pending Challenge.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
let pendingChallenge: MockApi_PendingChallenge = null;

/**
 * Mock API - Totp Enabled.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
let totpEnabled: MockApi_TotpEnabled = false;

/**
 * Mock API - Totp Pending.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
let totpPending: MockApi_TotpPending = false;

/**
 * Mock API - Recovery Codes.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
let recoveryCodes: MockApi_RecoveryCodes = [];

// Two saved passkeys, so the Security page shows a realistic list. Ones added in the mock are kept until it restarts.

/**
 * Mock API - Passkeys.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
let passkeys: MockApi_Passkeys = [
  {
    createdAt: new Date(startedAt - (34 * day)).toISOString(),
    hostname: 'outpost.example.net',
    id: 'pk-mJ3xQ8vN2rT5wY7z',
    lastUsedAt: new Date(startedAt - (2 * 60 * minute)).toISOString(),
    name: 'MacBook Pro',
  },
  {
    createdAt: new Date(startedAt - (9 * day)).toISOString(),
    hostname: 'outpost.example.net',
    id: 'pk-hK6dF1sL9pB4cX2v',
    lastUsedAt: new Date(startedAt - (3 * day)).toISOString(),
    name: 'iPhone',
  },
];

/**
 * Mock API - Passkey Ceremonies.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
const passkeyCeremonies: MockApi_PasskeyCeremonies = new Map();

/**
 * Mock API - Backup Grants.
 *
 * Keeps mock confirmation credentials session- and purpose-bound and single-use.
 * Separate maps mirror the grant and passkey ceremony lifecycles.
 *
 * @since 1.1.0
 */
const backupGrants: MockApi_BackupGrants = new Map();

/**
 * Mock API - Backup Passkey Ceremonies.
 *
 * Stores temporary mock WebAuthn bindings until verification.
 * Each ceremony is scoped to its initiating session and purpose.
 *
 * @since 1.1.0
 */
const backupPasskeyCeremonies: MockApi_BackupPasskeyCeremonies = new Map();

// MOCK_KEY_REPLACED=true starts as if the encryption key had been lost, to show the notice.

/**
 * Mock API - Key Replaced.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
const keyReplaced: MockApi_KeyReplaced = process.env['MOCK_KEY_REPLACED'] === 'true';

/**
 * Mock API - Removed Secrets.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
let removedSecrets: MockApi_RemovedSecrets = (keyReplaced === true) ? [{
  kind: 'authenticator',
  removedAt: new Date(startedAt).toISOString(),
}] : [];

/**
 * Mock API - Notifications.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
const notifications: MockApi_Notifications = [
  {
    createdAt: new Date(startedAt - (21 * 24 * 60 * minute)).toISOString(),
    events: [
      'secrets-removed',
      'sign-in-locked',
      'updates-applied',
      'updates-available',
      'update-failed',
    ],
    id: 'ntf-1b3d5f7a9c0e2b48',
    lastAttemptAt: new Date(startedAt - (4 * 60 * minute)).toISOString(),
    lastError: null,
    name: 'My phone',
    secrets: {},
    secretsMissing: [],
    service: 'ntfy',
    settings: { url: 'https://ntfy.sh/outpost-updates' },
    updatedAt: new Date(startedAt - (21 * 24 * 60 * minute)).toISOString(),
  },
  {
    createdAt: new Date(startedAt - (12 * 24 * 60 * minute)).toISOString(),
    events: [
      'updates-applied',
      'update-failed',
    ],
    id: 'ntf-6a8c0e2b4d6f8a13',
    lastAttemptAt: new Date(startedAt - (28 * 60 * minute)).toISOString(),
    lastError: null,
    name: 'Homelab chat',
    secrets: { botToken: true },
    secretsMissing: [],
    service: 'telegram',
    settings: { chatId: '-1002468013579' },
    updatedAt: new Date(startedAt - (12 * 24 * 60 * minute)).toISOString(),
  },
  {
    createdAt: new Date(startedAt - (5 * 24 * 60 * minute)).toISOString(),
    events: ['update-failed'],
    id: 'ntf-9e1a3c5b7d0f2e64',
    lastAttemptAt: new Date(startedAt - (3 * 24 * 60 * minute)).toISOString(),
    lastError: 'Invalid login: 535 5.7.8 Authentication credentials invalid',
    name: 'Email',
    secrets: { password: true },
    secretsMissing: [],
    service: 'email',
    settings: {
      from: 'outpost@example.com',
      host: 'smtp.example.com',
      port: '587',
      security: 'starttls',
      to: 'me@example.com',
      username: 'outpost@example.com',
    },
    updatedAt: new Date(startedAt - (5 * 24 * 60 * minute)).toISOString(),
  },
];

// A lost key removes every destination's saved secrets, as the server does, and pauses
// those destinations until the secrets are entered again.
if (keyReplaced === true) {
  for (const notification of [...notifications].sort((left, right) => left['name'].localeCompare(right['name']))) {
    const secretKeys: MockApi_SecretKeys = Object.keys(notification['secrets']).sort();

    if (secretKeys.length === 0) {
      continue;
    }

    notification.secrets = {};
    notification.secretsMissing = secretKeys;
    removedSecrets.push({
      kind: 'notification',
      name: notification['name'],
      notificationId: notification['id'],
      removedAt: new Date(startedAt).toISOString(),
    });
  }
}

// Two saved sign-ins, so the Private registries list on the Settings page looks real. Ones added in the mock are kept until it restarts.

/**
 * Mock API - Registries.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
const registries: MockApi_Registries = [
  {
    createdAt: '2026-10-28T09:14:00.000Z',
    id: 'reg-3c5e7a9b1d2f4a68',
    passwordMissing: false,
    registry: 'ghcr.io',
    updatedAt: '2026-10-28T09:14:00.000Z',
    username: 'example-bot',
  },
  {
    createdAt: '2026-11-01T16:42:00.000Z',
    id: 'reg-8b0d2f4a6c1e3b57',
    passwordMissing: false,
    registry: 'registry.example.com',
    updatedAt: '2026-11-01T16:42:00.000Z',
    username: 'deploy',
  },
];

// A lost key takes each registry's password as well, as the server does; the host and username stay.
if (keyReplaced === true) {
  for (const registry of registries) {
    registry.passwordMissing = true;
    removedSecrets.push({
      kind: 'registry',
      name: registry['registry'],
      registryId: registry['id'],
      removedAt: new Date(startedAt).toISOString(),
    });
  }
}

/**
 * Mock API - Running.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
let running: MockApi_Running = false;

/**
 * Mock API - Debug Logging.
 *
 * Whether the Settings page's Debug logging switch is on.
 * It starts off, like a fresh installation.
 *
 * @since 1.1.0
 */
let debugLogging: MockApi_DebugLogging = false;

/**
 * Mock API - Run Action.
 *
 * Names the simulated check or update while it is running.
 * Live state uses the same field as the production scheduler.
 *
 * @since 1.1.0
 */
let runAction: MockApi_RunAction = undefined;

/**
 * Mock API - Run Started At.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
let runStartedAt: MockApi_RunStartedAt = undefined;

/**
 * Mock API - Last Error.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
let lastError: MockApi_LastError = undefined;

/**
 * Mock API - Live Updates.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.1.0
 */
let liveUpdates: MockApi_LiveUpdates = 0;

/**
 * Mock API - Totals.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
const totals: MockApi_Totals = {
  cycles: 0,
  failed: 0,
  updated: 0,
};

/**
 * Mock API - Sessions.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
const sessions: MockApi_Sessions = new Map();

/**
 * Mock API - Event Clients.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
const eventClients: MockApi_EventClients = new Set();

// Seeded tokens have readable values so scripts can call the mock: outpost_ and 43 characters, like real ones.

/**
 * Mock API - Seed Tokens.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
const seedTokens: MockApi_SeedTokens = [
  {
    createdDaysAgo: 40,
    expiresInDays: null,
    name: 'Home Assistant',
    plaintext: `outpost_${'homeassistant'.padEnd(43, '0')}`,
    scopes: ['status:read'],
    usedMinutesAgo: 5,
  },
  {
    createdDaysAgo: 21,
    expiresInDays: null,
    name: 'GitHub Actions',
    plaintext: `outpost_${'githubactions'.padEnd(43, '0')}`,
    scopes: [
      'status:read',
      'updates:run',
    ],
    usedMinutesAgo: 3 * 24 * 60,
  },
  {
    createdDaysAgo: 12,
    expiresInDays: 78,
    name: 'Prometheus',
    plaintext: `outpost_${'prometheus'.padEnd(43, '0')}`,
    scopes: ['metrics:read'],
    usedMinutesAgo: 0.5,
  },
];

/**
 * Mock API - Tokens.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 1.0.0
 */
const tokens: MockApi_Tokens = seedTokens.map((seed) => ({
  createdAt: new Date(startedAt - (seed['createdDaysAgo'] * day)).toISOString(),
  expiresAt: (seed['expiresInDays'] === null) ? null : new Date(startedAt + (seed['expiresInDays'] * day)).toISOString(),
  hash: digest(seed['plaintext']),
  id: `tok-${digest(seed['name']).slice(0, 16)}`,
  lastUsedAt: (seed['usedMinutesAgo'] === null) ? null : new Date(startedAt - (seed['usedMinutesAgo'] * minute)).toISOString(),
  name: seed['name'],
  scopes: seed['scopes'],
}));

/**
 * Mock API - Send JSON.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {MockApi_SendJson_Returns}
 *
 * @since 1.0.0
 */
const sendJSON = (response: MockApi_SendJson_Response, status: MockApi_SendJson_Status, body: MockApi_SendJson_Body): MockApi_SendJson_Returns => {
  response.writeHead(status, {
    'Cache-Control': 'no-store',
    'Content-Type': 'application/json',
  }).end(JSON.stringify(body));

  return;
};

/**
 * Mock API - Send Empty.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {MockApi_SendEmpty_Returns}
 *
 * @since 1.0.0
 */
const sendEmpty = (response: MockApi_SendEmpty_Response): MockApi_SendEmpty_Returns => {
  response.writeHead(204).end();

  return;
};

/**
 * Mock API - Send Error.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {MockApi_SendError_Returns}
 *
 * @since 1.0.0
 */
const sendError = (response: MockApi_SendError_Response, status: MockApi_SendError_Status, code: MockApi_SendError_Code, message: MockApi_SendError_Message): MockApi_SendError_Returns => {
  sendJSON(response, status, {
    error: {
      code,
      message,
    },
  });

  return;
};

/**
 * Mock API - Send Issues.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {MockApi_SendIssues_Returns}
 *
 * @since 1.0.0
 */
const sendIssues = (response: MockApi_SendIssues_Response, status: MockApi_SendIssues_Status, code: MockApi_SendIssues_Code, issues: MockApi_SendIssues_Issues): MockApi_SendIssues_Returns => {
  const firstIssue: MockApi_SendIssues_FirstIssue = issues[0];

  sendJSON(response, status, {
    error: {
      code,
      issues,
      message: (firstIssue !== undefined) ? firstIssue['message'] : 'Check the highlighted fields.',
    },
  });

  return;
};

/**
 * Mock API - Field Issue.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {MockApi_FieldIssue_Returns}
 *
 * @since 1.0.0
 */
const fieldIssue = (field: MockApi_FieldIssue_Field, message: MockApi_FieldIssue_Message): MockApi_FieldIssue_Returns => ({
  field,
  message,
  path: field.split('.'),
});

/**
 * Mock API - Read Cookies.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {MockApi_ReadCookies_Returns}
 *
 * @since 1.0.0
 */
const readCookies = (request: MockApi_ReadCookies_Request): MockApi_ReadCookies_Returns => {
  const entries: MockApi_ReadCookies_Entries = (request.headers.cookie ?? '')
    .split(';')
    .map((part) => part.trim().split('='))
    .filter((parts) => parts.length >= 2 && parts[0] !== '')
    .map((parts): MockApi_ReadCookies_Entry => [
      parts[0] ?? '',
      decodeURIComponent(parts.slice(1).join('=')),
    ]);

  return Object.fromEntries(entries);
};

/**
 * Mock API - Read Body.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {MockApi_ReadBody_Returns}
 *
 * @since 1.0.0
 */
const readBody = async (request: MockApi_ReadBody_Request): MockApi_ReadBody_Returns => {
  const chunks: MockApi_ReadBody_Chunks = [];

  for await (const chunk of request) {
    chunks.push(Buffer.from(chunk));
  }

  const text: MockApi_ReadBody_Text = Buffer.concat(chunks).toString('utf-8');

  if (text === '') {
    return {};
  }

  try {
    const parsed: MockApi_ReadBody_Parsed = JSON.parse(text);

    return (
      typeof parsed === 'object'
      && parsed !== null
      && Array.isArray(parsed) === false
    ) ? parsed as MockApi_ReadBody_Body : {};
  } catch {
    return null;
  }
};

// Marks the browser signed in and answers like the real session response.

/**
 * Mock API - Start Session.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {MockApi_StartSession_Returns}
 *
 * @since 1.0.0
 */
const startSession = (response: MockApi_StartSession_Response, status: MockApi_StartSession_Status = 200): MockApi_StartSession_Returns => {
  const sessionId: MockApi_StartSession_SessionId = randomBytes(24).toString('base64url');
  const csrfToken: MockApi_StartSession_CsrfToken = randomBytes(24).toString('base64url');
  const username: MockApi_StartSession_Username = (administrator !== null) ? administrator['username'] : 'admin';

  sessions.set(sessionId, csrfToken);

  response.setHeader('Set-Cookie', [
    `outpost_session=${sessionId}; Path=/; HttpOnly; SameSite=Strict`,
    `outpost_csrf=${csrfToken}; Path=/; SameSite=Strict`,
  ]);

  sendJSON(response, status, {
    administrator: {
      id: administratorId,
      username,
    },
    csrfToken,
    expiresAt: new Date(Date.now() + day).toISOString(),
    status: 'authenticated',
  });

  return;
};

// principalOf finds who is calling: a personal access token wins over the session cookie.

/**
 * Mock API - Principal Of.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {MockApi_PrincipalOf_Returns}
 *
 * @since 1.0.0
 */
const principalOf = (request: MockApi_PrincipalOf_Request): MockApi_PrincipalOf_Returns => {
  const authorization: MockApi_PrincipalOf_Authorization = request.headers.authorization;

  if (authorization !== undefined) {
    const plaintext: MockApi_PrincipalOf_Plaintext = (authorization.startsWith('Bearer ') === true) ? authorization.slice(7).trim() : '';
    const token: MockApi_PrincipalOf_Token = tokens.find((candidate) => candidate['hash'] === digest(plaintext));

    if (
      token === undefined
      || (
        token['expiresAt'] !== null
        && Date.parse(token['expiresAt']) <= Date.now()
      )
    ) {
      return 'invalid-token';
    }

    token.lastUsedAt = new Date().toISOString();

    return {
      kind: 'token',
      token,
    };
  }

  const sessionId: MockApi_PrincipalOf_SessionId = readCookies(request)['outpost_session'] ?? '';

  return (administrator !== null && sessions.has(sessionId) === true) ? {
    kind: 'session',
    sessionId,
  } : null;
};

// Codes are compared like the server does: any letter case, with or without spaces and dashes.

/**
 * Mock API - Normalize Code.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {MockApi_NormalizeCode_Returns}
 *
 * @since 1.0.0
 */
const normalizeCode = (value: MockApi_NormalizeCode_Value): MockApi_NormalizeCode_Returns => value.toUpperCase().replace(new RegExp(separatorsPattern, 'gu'), '');

// Usernames follow the rule every app shares: 3 to 64 characters, starting with a letter or number.

/**
 * Mock API - Username Issue.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {MockApi_UsernameIssue_Returns}
 *
 * @since 1.0.0
 */
const usernameIssue = (value: MockApi_UsernameIssue_Value): MockApi_UsernameIssue_Returns => {
  if (value === '') {
    return 'Enter a username.';
  }

  return (new RegExp(administratorUsernamePattern, 'u').test(value) === true) ? '' : 'Use 3 to 64 letters, numbers, periods, underscores, or hyphens, starting with a letter or number.';
};

/**
 * Mock API - Password Issue.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {MockApi_PasswordIssue_Returns}
 *
 * @since 1.0.0
 */
const passwordIssue = (value: MockApi_PasswordIssue_Value): MockApi_PasswordIssue_Returns => {
  if (typeof value !== 'string' || value.length < 12) {
    return 'Use at least 12 characters.';
  }

  return (value.length > 1024) ? 'Use 1024 characters or fewer.' : '';
};

// unknownFields lists the body fields a route doesn't take.

/**
 * Mock API - Unknown Fields.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {MockApi_UnknownFields_Returns}
 *
 * @since 1.0.0
 */
const unknownFields = (body: MockApi_UnknownFields_Body, allowed: MockApi_UnknownFields_Allowed): MockApi_UnknownFields_Returns => {
  const fields: MockApi_UnknownFields_Fields = Object.keys(body).filter((field) => allowed.includes(field) === false);

  return fields.map((field) => fieldIssue(field, 'This field isn\'t accepted.'));
};

// newRecoveryCodes makes ten codes the way the server does: ten characters without look-alikes, split 5-5.

/**
 * Mock API - New Recovery Codes.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {MockApi_NewRecoveryCodes_Returns}
 *
 * @since 1.0.0
 */
const newRecoveryCodes = (): MockApi_NewRecoveryCodes_Returns => Array.from({ length: 10 }, () => {
  const code: MockApi_NewRecoveryCodes_Code = [...randomBytes(10)].map((byte) => '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'.charAt(byte % 32)).join('');

  return `${code.slice(0, 5)}-${code.slice(5)}`;
});

/**
 * Mock API - Scheduler State.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {MockApi_SchedulerState_Returns}
 *
 * @since 1.0.0
 */
const schedulerState = (): MockApi_SchedulerState_Returns => ({
  action: runAction,
  lastError,
  lastReport: history[0],
  nextRun: nextRun(),
  running,
  startedAt: runStartedAt,
  totals: { ...totals },
});

/**
 * Mock API - Overview Resource.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {MockApi_OverviewResource_Returns}
 *
 * @since 1.0.0
 */
const overviewResource = (): MockApi_OverviewResource_Returns => ({
  ...schedulerState(),
  labelMode: settings['runtime']['labelMode'],
  monitorOnly: settings['runtime']['monitorOnly'],
  schedule: settings['runtime']['schedule'],
  timeZone: settings['system']['timeZone'],
});

// containerRows shows each container with its newest result, the way the server builds them from the history.

/**
 * Mock API - Container Rows.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {MockApi_ContainerRows_Returns}
 *
 * @since 1.0.0
 */
const containerRows = (): MockApi_ContainerRows_Returns => {
  const rows: MockApi_ContainerRows_Rows = containers.map((container) => {
    const report: MockApi_ContainerRows_Report = history.find((candidate) => candidate['results'].some((result) => result['container'] === container['name']));
    const result: MockApi_ContainerRows_Result = (report !== undefined) ? report['results'].find((candidate) => candidate['container'] === container['name']) : undefined;

    return {
      fullId: container['id'].padEnd(64, container['id'][0] ?? '0'),
      id: container['id'].slice(0, 12),
      image: container['image'],
      lastAction: (report !== undefined) ? report['action'] : undefined,
      lastCheckedAt: (report !== undefined) ? report['finishedAt'] : undefined,
      lastDetail: (result !== undefined) ? result['detail'] : undefined,
      lastSummary: (result !== undefined) ? result['summary'] : undefined,
      lastStatus: (result !== undefined) ? result['status'] : undefined,
      managed: container['managed'],
      monitorOnly: container['monitorOnly'],
      name: container['name'],
      note: container['note'],
      self: container['self'] ?? false,
      state: 'running',
    };
  });

  return rows.sort((left, right) => String(left['name']).localeCompare(String(right['name'])));
};

/**
 * Mock API - Metrics Text.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {MockApi_MetricsText_Returns}
 *
 * @since 1.0.0
 */
const metricsText = (): MockApi_MetricsText_Returns => {
  const runningValue: MockApi_MetricsText_RunningValue = (running === true) ? 1 : 0;
  const lines: MockApi_MetricsText_Lines = [
    '# HELP outpost_cycles_total Update cycles finished since start.',
    '# TYPE outpost_cycles_total counter',
    `outpost_cycles_total ${totals['cycles']}`,
    '# HELP outpost_containers_updated_total Containers updated since start.',
    '# TYPE outpost_containers_updated_total counter',
    `outpost_containers_updated_total ${totals['updated']}`,
    '# HELP outpost_containers_failed_total Container updates that failed, rolled back, or were kept after failure since start.',
    '# TYPE outpost_containers_failed_total counter',
    `outpost_containers_failed_total ${totals['failed']}`,
    '# HELP outpost_cycle_running Whether an update cycle is running.',
    '# TYPE outpost_cycle_running gauge',
    `outpost_cycle_running ${runningValue}`,
  ];
  const lastReport: MockApi_MetricsText_LastReport = history[0];

  if (lastReport !== undefined) {
    lines.push(
      '# HELP outpost_last_cycle_timestamp_seconds When the last cycle finished.',
      '# TYPE outpost_last_cycle_timestamp_seconds gauge',
      `outpost_last_cycle_timestamp_seconds ${Math.floor(Date.parse(lastReport['finishedAt']) / 1000)}`,
    );
  }

  return `${lines.join('\n')}\n`;
};

// broadcast sends one server-sent event to every open dashboard.

/**
 * Mock API - Broadcast.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {MockApi_Broadcast_Returns}
 *
 * @since 1.0.0
 */
const broadcast = (event: MockApi_Broadcast_Event, data: MockApi_Broadcast_Data): MockApi_Broadcast_Returns => {
  for (const client of eventClients) {
    client.write([
      `event: ${event}`,
      `data: ${JSON.stringify(data)}`,
      '',
      '',
    ].join('\n'));
  }

  return;
};

// liveResult is what a run started now finds: checks expose availability, while updates apply it.

/**
 * Mock API - Live Result.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {MockApi_LiveResult_Returns}
 *
 * @since 1.0.0
 */
const liveResult = (container: MockApi_LiveResult_Container, action: MockApi_LiveResult_Action): MockApi_LiveResult_Returns => {
  const result: MockApi_LiveResult_Result = resultFor(container, 0);

  if (container['name'] === 'immich-server') {
    if (action === 'check' || settings['runtime']['monitorOnly'] === true) {
      return {
        ...result,
        detail: `New digest ${fakeDigest(`${container['image']}-new`)}`,
        status: 'available',
      };
    }

    return {
      ...result,
      detail: (liveUpdates === 0) ? `Recreated with ${container['image']}` : fakeDigest(`${container['image']}-new`),
      status: (liveUpdates === 0) ? 'updated' : 'up-to-date',
    };
  }

  if (
    result['status'] === 'updated'
    || result['status'] === 'failed'
    || result['status'] === 'rolled-back'
    || result['status'] === 'kept-unhealthy'
  ) {
    return {
      ...result,
      detail: fakeDigest(`${container['image']}-current`),
      status: 'up-to-date',
    };
  }

  return result;
};

// startCycle runs a simulated check or update in the background, like the scheduler: one at a time.

/**
 * Mock API - Start Cycle.
 *
 * Serializes simulated runs and records the requested action in history.
 * Checks expose available images; updates can produce updated results.
 *
 * @returns {MockApi_StartCycle_Returns}
 *
 * @since 1.1.0
 */
const startCycle = (containerId: MockApi_StartCycle_ContainerId, trigger: MockApi_StartCycle_Trigger, action: MockApi_StartCycle_Action, rollback: MockApi_StartCycle_Rollback = true): MockApi_StartCycle_Returns => {
  if (running === true) {
    return false;
  }

  running = true;
  runAction = action;
  runStartedAt = new Date().toISOString();
  broadcast('state', overviewResource());

  const targets: MockApi_StartCycle_Targets = (containerId === undefined) ? checkedContainers() : containers.filter(
    (container) => container['managed'] === true && container['id'].startsWith(containerId) === true,
  );

  setTimeout(() => {
    const report: MockApi_StartCycle_Report = {
      action,
      finishedAt: new Date().toISOString(),
      ...((action === 'update' && rollback === false) ? { rollback: false } : {}),
      results: targets.map((container) => liveResult(container, action)),
      startedAt: runStartedAt ?? new Date().toISOString(),
      trigger,
    };

    if (action === 'update') {
      liveUpdates += 1;
    }

    history.unshift(report);

    history.splice(50);
    totals.cycles += 1;
    totals.updated += report['results'].filter((result) => result['status'] === 'updated').length;
    totals.failed += report['results'].filter((result) => {
      return (
        result['status'] === 'failed'
        || result['status'] === 'rolled-back'
        || result['status'] === 'kept-unhealthy'
      );
    }).length;
    lastError = undefined;
    running = false;
    runAction = undefined;
    runStartedAt = undefined;
    broadcast('check', report);

    broadcast('state', overviewResource());

    return;
  }, (containerId === undefined) ? 7000 : 3000);

  return true;
};

// tokenInput reads and checks a create or edit body, sending the first problem it finds.

/**
 * Mock API - Token Input.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @returns {MockApi_TokenInput_Returns}
 *
 * @since 1.0.0
 */
const tokenInput = (response: MockApi_TokenInput_Response, body: MockApi_TokenInput_Body, exceptId: MockApi_TokenInput_ExceptId, creating: MockApi_TokenInput_Creating): MockApi_TokenInput_Returns => {
  const extra: MockApi_TokenInput_Extra = unknownFields(body, [
    'expiresAt',
    'name',
    'scopes',
  ]);

  if (extra.length > 0) {
    sendIssues(response, 422, 'invalid_request', extra);

    return null;
  }

  const name: MockApi_TokenInput_Name = (typeof body['name'] === 'string') ? body['name'].trim() : '';
  const rawScopes: MockApi_TokenInput_RawScopes = (Array.isArray(body['scopes']) === true) ? body['scopes'] as MockApi_TokenInput_RawScopes : [];
  const issues: MockApi_TokenInput_Issues = [];

  if (name === '') {
    issues.push(fieldIssue('name', 'Name this token.'));
  } else if (name.length > 80) {
    issues.push(fieldIssue('name', 'Use 80 characters or fewer.'));
  }

  if (rawScopes.length === 0) {
    issues.push(fieldIssue('scopes', 'Choose at least one scope.'));
  } else if (rawScopes.some((scope) => scopeOrder.includes(scope as MockApi_MockScope) === false) === true) {
    issues.push(fieldIssue('scopes', `Choose from: ${scopeOrder.join(', ')}.`));
  } else if (new Set(rawScopes).size !== rawScopes.length) {
    issues.push(fieldIssue('scopes', 'Choose each scope only once.'));
  }

  const expiresAt: MockApi_TokenInput_ExpiresAt = body['expiresAt'];

  if (expiresAt !== undefined && expiresAt !== null) {
    if (
      typeof expiresAt !== 'string'
      || new RegExp(isoTimestampPattern, 'u').test(expiresAt) === false
      || Number.isNaN(Date.parse(expiresAt)) === true
    ) {
      issues.push(fieldIssue('expiresAt', 'Use an ISO 8601 date and time with a time zone, like 2030-01-01T00:00:00Z.'));
    } else if (Date.parse(expiresAt) <= Date.now()) {
      issues.push(fieldIssue('expiresAt', 'Choose an expiration date in the future.'));
    }
  }

  if (issues.length > 0) {
    sendIssues(response, 422, 'invalid_request', issues);

    return null;
  }

  if (tokens.some((token) => token['id'] !== exceptId && token['name'].toLowerCase() === name.toLowerCase()) === true) {
    sendIssues(response, 409, 'token_exists', [fieldIssue('name', 'A token with this name already exists.')]);

    return null;
  }

  return {
    ...((expiresAt === undefined && creating === false) ? {} : { expiresAt: (typeof expiresAt === 'string') ? expiresAt : null }),
    name,
    scopes: scopeOrder.filter((scope) => rawScopes.includes(scope)),
  };
};

/**
 * Mock API - Token Resource.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {MockApi_TokenResource_Returns}
 *
 * @since 1.0.0
 */
const tokenResource = (token: MockApi_TokenResource_Token): MockApi_TokenResource_Returns => ({
  createdAt: token['createdAt'],
  expiresAt: token['expiresAt'],
  id: token['id'],
  lastUsedAt: token['lastUsedAt'],
  name: token['name'],
  scopes: token['scopes'],
});

// normalizeRegistry saves a host the way the server does: lowercase, without a scheme or path, and every Docker Hub name as docker.io.

/**
 * Mock API - Normalize Registry.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {MockApi_NormalizeRegistry_Returns}
 *
 * @since 1.0.0
 */
const normalizeRegistry = (value: MockApi_NormalizeRegistry_Value): MockApi_NormalizeRegistry_Returns => {
  const host: MockApi_NormalizeRegistry_Host = value.trim().toLowerCase().replace(new RegExp(httpSchemePattern, 'u'), '').split('/')[0] ?? '';

  return ([
    'docker.io',
    'index.docker.io',
    'registry-1.docker.io',
  ].includes(host) === true) ? 'docker.io' : host;
};

// registryInput reads and checks a registry sign-in body like the server, sending every problem it finds.

/**
 * Mock API - Registry Input.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {MockApi_RegistryInput_Returns}
 *
 * @since 1.0.0
 */
const registryInput = (response: MockApi_RegistryInput_Response, body: MockApi_RegistryInput_Body, exceptId: MockApi_RegistryInput_ExceptId, creating: MockApi_RegistryInput_Creating): MockApi_RegistryInput_Returns => {
  const password: MockApi_RegistryInput_Password = body['password'];
  const registry: MockApi_RegistryInput_Registry = (typeof body['registry'] === 'string') ? normalizeRegistry(body['registry']) : '';
  const username: MockApi_RegistryInput_Username = (typeof body['username'] === 'string') ? body['username'].trim() : '';
  const issues: MockApi_RegistryInput_Issues = [];

  // Leaving the password out of an edit keeps the saved one.
  if (
    (
      creating === true
      || password !== undefined
    )
    && (
      typeof password !== 'string'
      || password === ''
    )
  ) {
    issues.push(fieldIssue('password', 'Enter a password or access token.'));
  } else if (typeof password === 'string' && password.length > 4096) {
    issues.push(fieldIssue('password', 'Use 4096 characters or fewer.'));
  }

  if (registry === '') {
    issues.push(fieldIssue('registry', 'Enter a registry host, like ghcr.io.'));
  } else if (registry.length > 255) {
    issues.push(fieldIssue('registry', 'Use 255 characters or fewer.'));
  } else if (new RegExp(registryHostPattern, 'u').test(registry) === false) {
    issues.push(fieldIssue('registry', 'Use a host name with an optional port, like registry.example.com:5000.'));
  }

  if (username === '') {
    issues.push(fieldIssue('username', 'Enter a username.'));
  } else if (username.length > 255) {
    issues.push(fieldIssue('username', 'Use 255 characters or fewer.'));
  }

  issues.push(...unknownFields(body, [
    'password',
    'registry',
    'username',
  ]));

  if (issues.length > 0) {
    sendIssues(response, 422, 'invalid_request', issues);

    return null;
  }

  if (registries.some((candidate) => candidate['id'] !== exceptId && candidate['registry'] === registry) === true) {
    sendIssues(response, 409, 'registry_exists', [fieldIssue('registry', 'A sign-in for this registry already exists.')]);

    return null;
  }

  return {
    ...((typeof password === 'string') ? { password } : {}),
    registry,
    username,
  };
};

// Answers one dashboard API call, or returns false so Vite serves the page.

/**
 * Mock API - Handle Request.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {MockApi_HandleRequest_Returns}
 *
 * @since 1.0.0
 */
const handleRequest = async (request: MockApi_HandleRequest_Request, response: MockApi_HandleRequest_Response): MockApi_HandleRequest_Returns => {
  // The Host header gives the address the page was opened at, like the real server sees it.
  const url: MockApi_HandleRequest_Url = new URL(request.url ?? '/', `http://${request.headers.host ?? 'localhost'}`);
  const path: MockApi_HandleRequest_Path = url.pathname;
  const method: MockApi_HandleRequest_Method = request.method ?? 'GET';
  const aliasRoute: MockApi_HandleRequest_AliasRoute = (
    path === '/v1/update'
    || path === '/v1/status'
    || path === '/metrics'
  );

  if (path.startsWith('/api/v1/') === false && aliasRoute === false) {
    return false;
  }

  const parsedBody: MockApi_HandleRequest_ParsedBody = (method === 'GET' || method === 'HEAD') ? {} : await readBody(request);

  if (parsedBody === null) {
    sendError(response, 400, 'invalid_json', 'The request body is not valid JSON.');

    return true;
  }

  const body: MockApi_HandleRequest_Body = parsedBody;

  // The Watchtower-style paths take a token with the right scope, and nothing else.
  if (aliasRoute === true) {
    const aliases: MockApi_HandleRequest_Aliases = {
      '/metrics': [
        'GET',
        'metrics:read',
      ],
      '/v1/status': [
        'GET',
        'status:read',
      ],
      '/v1/update': [
        'POST',
        'updates:run',
      ],
    };
    const alias: MockApi_HandleRequest_Alias = aliases[path] ?? [
      '',
      'status:read',
    ];
    const aliasMethod: MockApi_HandleRequest_AliasMethod = alias[0];
    const aliasScope: MockApi_HandleRequest_AliasScope = alias[1];
    const aliasPrincipal: MockApi_HandleRequest_AliasPrincipal = principalOf(request);

    if (method !== aliasMethod) {
      sendError(response, 404, 'not_found', 'No route matches this request.');

      return true;
    }

    if (
      aliasPrincipal === null
      || aliasPrincipal === 'invalid-token'
      || aliasPrincipal['kind'] !== 'token'
    ) {
      sendError(response, 401, 'authentication_required', 'A valid personal access token is required.');

      return true;
    }

    if (aliasPrincipal['token']['scopes'].includes(aliasScope) === false) {
      sendError(response, 403, 'scope_required', `This token doesn't have the ${aliasScope} scope.`);

      return true;
    }

    if (path === '/v1/update') {
      const started: MockApi_HandleRequest_Started = startCycle(undefined, 'api', 'update');

      sendJSON(response, (started === true) ? 202 : 409, { started });

      return true;
    }

    if (path === '/v1/status') {
      sendJSON(response, 200, schedulerState());

      return true;
    }

    response.writeHead(200, { 'Content-Type': 'text/plain; version=0.0.4; charset=utf-8' }).end(metricsText());

    return true;
  }

  if (method === 'GET' && path === '/api/v1/setup/status') {
    sendJSON(response, 200, (administrator === null) ? {
      claimExpiresAt: new Date(startedAt + (30 * minute)).toISOString(),
      claimRequired: true,
    } : { claimRequired: false });

    return true;
  }

  if (method === 'POST' && path === '/api/v1/setup/claim') {
    if (administrator !== null) {
      sendError(response, 409, 'claim_unavailable', 'Setup is already complete. Sign in instead.');

      return true;
    }

    const claimUsername: MockApi_HandleRequest_ClaimUsername = (typeof body['username'] === 'string') ? body['username'].trim() : '';
    const issues: MockApi_HandleRequest_Issues = unknownFields(body, [
      'claimCode',
      'password',
      'username',
    ]);

    if (typeof body['claimCode'] !== 'string' || body['claimCode'].trim() === '') {
      issues.push(fieldIssue('claimCode', 'Enter the setup code from the container log.'));
    }

    if (usernameIssue(claimUsername) !== '') {
      issues.push(fieldIssue('username', usernameIssue(claimUsername)));
    }

    if (passwordIssue(body['password']) !== '') {
      issues.push(fieldIssue('password', passwordIssue(body['password'])));
    }

    if (issues.length > 0) {
      sendIssues(response, 422, 'invalid_request', issues);

      return true;
    }

    if (normalizeCode(String(body['claimCode'])) !== normalizeCode(setupCode)) {
      sendIssues(response, 401, 'claim_invalid', [fieldIssue('claimCode', 'That setup code is wrong or expired. Restart the container to print a new one.')]);

      return true;
    }

    administrator = {
      createdAt: new Date().toISOString(),
      password: String(body['password']),
      username: claimUsername,
    };
    startSession(response, 201);

    return true;
  }

  if (method === 'POST' && path === '/api/v1/auth/login') {
    const issues: MockApi_HandleRequest_Issues = unknownFields(body, [
      'password',
      'username',
    ]);
    const loginUsername: MockApi_HandleRequest_LoginUsername = (typeof body['username'] === 'string') ? body['username'].trim() : '';

    if (loginUsername === '') {
      issues.push(fieldIssue('username', 'Enter your username.'));
    }

    if (typeof body['password'] !== 'string' || body['password'] === '') {
      issues.push(fieldIssue('password', 'Enter your password.'));
    }

    if (issues.length > 0) {
      sendIssues(response, 422, 'invalid_request', issues);

      return true;
    }

    if (
      administrator === null
      || loginUsername.toLowerCase() !== administrator['username'].toLowerCase()
      || body['password'] !== administrator['password']
    ) {
      sendError(response, 401, 'credentials_invalid', 'The username or password is incorrect.');

      return true;
    }

    if (totpEnabled === true) {
      pendingChallenge = {
        challenge: randomBytes(24).toString('base64url'),
        failures: 0,
      };
      sendJSON(response, 200, {
        challenge: pendingChallenge['challenge'],
        expiresAt: new Date(Date.now() + (5 * minute)).toISOString(),
        status: 'second_factor_required',
      });

      return true;
    }

    startSession(response);

    return true;
  }

  if (method === 'POST' && path === '/api/v1/auth/login/second-factor') {
    const code: MockApi_HandleRequest_Code = (typeof body['code'] === 'string') ? body['code'].trim() : '';

    if (pendingChallenge === null || body['challenge'] !== pendingChallenge['challenge']) {
      sendError(response, 401, 'challenge_expired', 'Your sign-in timed out. Enter your password again.');

      return true;
    }

    if (code === '') {
      sendIssues(response, 422, 'invalid_request', [fieldIssue('code', 'Enter the code from your authenticator app, or a recovery code.')]);

      return true;
    }

    const isTotpCode: MockApi_HandleRequest_IsTotpCode = new RegExp(totpCodePattern, 'u').test(code);
    const recoveryCode: MockApi_HandleRequest_RecoveryCode = (isTotpCode === true) ? undefined : recoveryCodes.find((candidate) => normalizeCode(candidate) === normalizeCode(code));

    if (
      (
        isTotpCode === true
        && code !== '123456'
      )
      || (
        isTotpCode === false
        && recoveryCode === undefined
      )
    ) {
      pendingChallenge.failures += 1;

      if (pendingChallenge['failures'] >= 5) {
        pendingChallenge = null;
        sendError(response, 401, 'challenge_expired', 'Too many wrong codes. Enter your password again.');

        return true;
      }

      sendIssues(response, 401, 'code_invalid', [fieldIssue('code', 'That code doesn\'t match. Try the current code, or a recovery code.')]);

      return true;
    }

    recoveryCodes = recoveryCodes.filter((candidate) => candidate !== recoveryCode);
    pendingChallenge = null;
    startSession(response);

    return true;
  }

  // Passkey sign-in accepts any answer from the browser, like the transmission-vpn mock.
  if (method === 'POST' && path === '/api/v1/auth/passkeys/login/options') {
    sendJSON(response, 200, {
      ceremonyId: randomBytes(16).toString('base64url'),
      options: {
        allowCredentials: [],
        challenge: randomBytes(32).toString('base64url'),
        rpId: url.hostname,
        timeout: 300000,
        userVerification: 'required',
      },
    });

    return true;
  }

  if (method === 'POST' && path === '/api/v1/auth/passkeys/login/verify') {
    if (administrator === null) {
      sendError(response, 401, 'passkey_rejected', 'That passkey wasn\'t accepted.');

      return true;
    }

    startSession(response);

    return true;
  }

  const principal: MockApi_HandleRequest_Principal = principalOf(request);

  if (principal === 'invalid-token') {
    sendError(response, 401, 'authentication_required', 'A valid personal access token is required.');

    return true;
  }

  if (principal === null) {
    sendError(response, 401, 'authentication_required', 'Sign in to continue.');

    return true;
  }

  if (
    principal['kind'] === 'session'
    && method !== 'GET'
    && request.headers['x-csrf-token'] !== sessions.get(principal['sessionId'])
  ) {
    sendError(response, 403, 'csrf_invalid', 'The request CSRF token is missing or invalid.');

    return true;
  }

  // Tokens reach the dashboard data with the right scope; sign-in, security, and tokens need the browser session.

  /**
   * Mock API - Require Scope.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @returns {MockApi_HandleRequest_RequireScope_Returns}
   *
   * @since 1.0.0
   */
  const requireScope: MockApi_HandleRequest_RequireScope = (scope: MockApi_HandleRequest_RequireScope_Scope): MockApi_HandleRequest_RequireScope_Returns => {
    if (principal['kind'] === 'token' && principal['token']['scopes'].includes(scope) === false) {
      sendError(response, 403, 'scope_required', `This token doesn't have the ${scope} scope.`);

      return false;
    }

    return true;
  };

  if (method === 'GET' && path === '/api/v1/auth/me') {
    const meUsername: MockApi_HandleRequest_MeUsername = (administrator !== null) ? administrator['username'] : 'admin';

    sendJSON(response, 200, (principal['kind'] === 'token') ? {
      authenticationType: 'token',
      id: principal['token']['id'],
      name: principal['token']['name'],
      scopes: principal['token']['scopes'],
    } : {
      administratorId,
      authenticationType: 'session',
      id: 'mock-session',
      removedSecrets,
      username: meUsername,
    });

    return true;
  }

  if (method === 'GET' && path === '/api/v1/overview') {
    if (requireScope('status:read') === true) {
      sendJSON(response, 200, overviewResource());
    }

    return true;
  }

  if (method === 'GET' && path === '/api/v1/status') {
    if (requireScope('status:read') === true) {
      sendJSON(response, 200, schedulerState());
    }

    return true;
  }

  if (method === 'GET' && path === '/api/v1/containers') {
    if (requireScope('status:read') === true) {
      sendJSON(response, 200, { items: containerRows() });
    }

    return true;
  }

  if (method === 'GET' && path === '/api/v1/history') {
    if (requireScope('status:read') === true) {
      sendJSON(response, 200, { items: history.slice(0, 50) });
    }

    return true;
  }

  if (method === 'GET' && path === '/api/v1/settings') {
    if (requireScope('status:read') === true) {
      sendJSON(response, 200, settings);
    }

    return true;
  }

  if (method === 'PUT' && path === '/api/v1/settings') {
    if (principal['kind'] === 'token') {
      sendError(response, 403, 'session_required', 'An administrator browser session is required.');

      return true;
    }

    const allowed: MockApi_HandleRequest_Allowed = [
      'cleanup',
      'healthTimeoutSeconds',
      'labelMode',
      'monitorOnly',
      'runOnStart',
      'schedule',
      'settleSeconds',
      'stopTimeoutSeconds',
    ];
    const issues: MockApi_HandleRequest_Issues = unknownFields(body, allowed);

    for (const field of [
      'cleanup',
      'monitorOnly',
      'runOnStart',
    ]) {
      if (typeof body[field] !== 'boolean') {
        issues.push(fieldIssue(field, 'Use true or false.'));
      }
    }

    for (const field of [
      'healthTimeoutSeconds',
      'settleSeconds',
      'stopTimeoutSeconds',
    ]) {
      if (Number.isInteger(body[field]) === false || Number(body[field]) <= 0) {
        issues.push(fieldIssue(field, 'Use a positive whole number.'));
      }
    }

    if (body['labelMode'] !== 'opt-in' && body['labelMode'] !== 'opt-out') {
      issues.push(fieldIssue('labelMode', 'Choose opt-in or opt-out.'));
    }

    if (typeof body['schedule'] !== 'string' || body['schedule'].trim() === '') {
      issues.push(fieldIssue('schedule', 'Enter a cron schedule.'));
    }

    if (issues.length > 0) {
      sendIssues(response, 422, 'invalid_request', issues);

      return true;
    }

    settings.runtime = {
      cleanup: body['cleanup'] === true,
      healthTimeoutSeconds: Number(body['healthTimeoutSeconds']),
      labelMode: (body['labelMode'] === 'opt-in') ? 'opt-in' : 'opt-out',
      monitorOnly: body['monitorOnly'] === true,
      runOnStart: body['runOnStart'] === true,
      schedule: String(body['schedule']),
      settleSeconds: Number(body['settleSeconds']),
      stopTimeoutSeconds: Number(body['stopTimeoutSeconds']),
    };
    sendJSON(response, 200, settings);

    return true;
  }

  if (
    (
      method === 'GET'
      || method === 'PUT'
    )
    && path === '/api/v1/diagnostics'
  ) {
    if (principal['kind'] === 'token') {
      sendError(response, 403, 'session_required', 'An administrator browser session is required.');

      return true;
    }

    if (method === 'PUT') {
      if (typeof body['debugLogging'] !== 'boolean') {
        sendIssues(response, 422, 'invalid_request', [fieldIssue('debugLogging', 'Choose on or off.')]);

        return true;
      }

      debugLogging = body['debugLogging'];
    }

    sendJSON(response, 200, { debugLogging });

    return true;
  }

  if (
    method === 'POST'
    && (
      path === '/api/v1/checks'
      || path === '/api/v1/updates'
    )
  ) {
    if (requireScope('updates:run') === false) {
      return true;
    }

    const action: MockApi_HandleRequest_Action = (path === '/api/v1/checks') ? 'check' : 'update';
    const extra: MockApi_HandleRequest_Extra = unknownFields(body, (action === 'update') ? [
      'containerId',
      'rollback',
    ] : ['containerId']);

    if (extra.length > 0) {
      sendIssues(response, 422, 'invalid_request', extra);

      return true;
    }

    if (
      body['containerId'] !== undefined
      && (
        typeof body['containerId'] !== 'string'
        || new RegExp(containerIdPattern, 'u').test(body['containerId']) === false
      )
    ) {
      sendIssues(response, 422, 'invalid_request', [fieldIssue('containerId', 'Use a container ID of 12 to 64 hexadecimal characters.')]);

      return true;
    }

    if (
      action === 'update'
      && body['rollback'] !== undefined
      && typeof body['rollback'] !== 'boolean'
    ) {
      sendIssues(response, 422, 'invalid_request', [fieldIssue('rollback', 'Choose whether Outpost should roll back a failed update.')]);

      return true;
    }

    const containerId: MockApi_HandleRequest_ContainerId = (typeof body['containerId'] === 'string') ? body['containerId'] : undefined;
    const rollback: MockApi_HandleRequest_Rollback = (action === 'update') ? body['rollback'] !== false : true;

    if (rollback === false && containerId === undefined) {
      sendError(response, 422, 'invalid_request', 'Rollback can only be disabled for one container at a time. Send containerId with rollback set to false.');

      return true;
    }

    const target: MockApi_HandleRequest_Target = (containerId === undefined) ? undefined : containers.find((container) => container['id'].startsWith(containerId) === true || containerId.startsWith(container['id']) === true);

    if (
      rollback === false
      && target !== undefined
      && target['self'] === true
    ) {
      sendError(response, 422, 'invalid_request', 'Rollback cannot be disabled when updating Outpost itself.');

      return true;
    }

    if (startCycle(containerId, (principal['kind'] === 'token') ? 'api' : 'dashboard', action, rollback) === false) {
      sendError(response, 409, 'check_running', 'A check or update is already running.');

      return true;
    }

    sendJSON(response, 202, { started: true });

    return true;
  }

  if (method === 'GET' && path === '/api/v1/events') {
    if (requireScope('status:read') === false) {
      return true;
    }

    response.writeHead(200, {
      'Cache-Control': 'no-store',
      'Connection': 'keep-alive',
      'Content-Type': 'text/event-stream; charset=utf-8',
    });

    response.write('retry: 3000\n\n');

    response.write([
      'event: state',
      `data: ${JSON.stringify(overviewResource())}`,
      '',
      '',
    ].join('\n'));

    eventClients.add(response);

    const keepAlive: MockApi_HandleRequest_KeepAlive = setInterval(() => {
      response.write(': keep-alive\n\n');

      return;
    }, 15_000);

    request.on('close', () => {
      clearInterval(keepAlive);

      eventClients.delete(response);

      return;
    });

    return true;
  }

  if (principal['kind'] === 'token') {
    if (path.startsWith('/api/v1/auth/') === true || path.startsWith('/api/v1/backup/') === true) {
      sendError(response, 403, 'session_required', 'An administrator browser session is required.');
    } else {
      sendError(response, 404, 'not_found', 'No route matches this request.');
    }

    return true;
  }

  /**
   * Mock API - Check Password.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @returns {MockApi_HandleRequest_CheckPassword_Returns}
   *
   * @since 1.0.0
   */
  const checkPassword: MockApi_HandleRequest_CheckPassword = (field: MockApi_HandleRequest_CheckPassword_Field = 'password'): MockApi_HandleRequest_CheckPassword_Returns => {
    if (typeof body[field] !== 'string' || body[field] === '') {
      sendIssues(response, 422, 'invalid_request', [fieldIssue(field, (field === 'currentPassword') ? 'Enter your current password.' : 'Enter your password.')]);

      return false;
    }

    if (body[field] !== ((administrator !== null) ? administrator['password'] : undefined)) {
      sendIssues(response, 422, 'password_incorrect', [fieldIssue(field, 'That password is incorrect.')]);

      return false;
    }

    return true;
  };

  /**
   * Mock API - Reject Unknown.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @returns {MockApi_HandleRequest_RejectUnknown_Returns}
   *
   * @since 1.0.0
   */
  const rejectUnknown: MockApi_HandleRequest_RejectUnknown = (allowed: MockApi_HandleRequest_RejectUnknown_Allowed): MockApi_HandleRequest_RejectUnknown_Returns => {
    const extra: MockApi_HandleRequest_RejectUnknown_Extra = unknownFields(body, allowed);

    if (extra.length > 0) {
      sendIssues(response, 422, 'invalid_request', extra);

      return true;
    }

    return false;
  };

  if (method === 'DELETE' && path === '/api/v1/auth/removed-secrets') {
    removedSecrets = [];
    sendEmpty(response);

    return true;
  }

  if (method === 'POST' && path === '/api/v1/auth/logout') {
    sessions.delete(principal['sessionId']);

    response.setHeader('Set-Cookie', [
      'outpost_session=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0',
      'outpost_csrf=; Path=/; SameSite=Strict; Max-Age=0',
    ]);

    sendEmpty(response);

    return true;
  }

  if (method === 'GET' && path === '/api/v1/auth/security') {
    const securityUsername: MockApi_HandleRequest_SecurityUsername = (administrator !== null) ? administrator['username'] : 'admin';

    sendJSON(response, 200, {
      hostname: url.hostname,
      passkeys,
      passkeysAvailable: true,
      recoveryCodesRemaining: recoveryCodes.length,
      totpEnabled,
      username: securityUsername,
    });

    return true;
  }

  if (method === 'POST' && path === '/api/v1/backup/confirmation') {
    const purpose: MockApi_HandleRequest_Purpose = (body['purpose'] === 'export' || body['purpose'] === 'import') ? body['purpose'] : undefined;
    const password: MockApi_HandleRequest_Password = (typeof body['password'] === 'string') ? body['password'] : '';

    if (purpose === undefined || password === '') {
      sendIssues(response, 422, 'invalid_request', [fieldIssue((purpose === undefined) ? 'purpose' : 'password', (purpose === undefined) ? 'Choose what you are confirming.' : 'Enter your password.')]);

      return true;
    }

    if (administrator === null || password !== administrator['password']) {
      sendIssues(response, 422, 'identity_not_confirmed', [fieldIssue('password', 'That password is incorrect.')]);

      return true;
    }

    if (totpEnabled === true && body['code'] !== '123456') {
      sendIssues(response, 422, 'identity_not_confirmed', [fieldIssue('code', 'That authenticator code is incorrect.')]);

      return true;
    }

    const grant: MockApi_HandleRequest_Grant = `obg_${randomBytes(32).toString('base64url')}`;

    backupGrants.set(grant, {
      purpose,
      sessionId: principal['sessionId'],
    });

    sendJSON(response, 200, {
      expiresAt: new Date(Date.now() + (5 * minute)).toISOString(),
      grant,
    });

    return true;
  }

  if (method === 'POST' && path === '/api/v1/backup/confirmation/passkey/options') {
    const purpose: MockApi_HandleRequest_Purpose = (body['purpose'] === 'export' || body['purpose'] === 'import') ? body['purpose'] : undefined;

    if (purpose === undefined) {
      sendIssues(response, 422, 'invalid_request', [fieldIssue('purpose', 'Choose what you are confirming.')]);

      return true;
    }

    const ceremonyId: MockApi_HandleRequest_CeremonyId = randomBytes(32).toString('base64url');

    backupPasskeyCeremonies.set(ceremonyId, {
      purpose,
      sessionId: principal['sessionId'],
    });

    sendJSON(response, 200, {
      ceremonyId,
      options: {
        allowCredentials: passkeys.map((passkey): MockApi_HandleRequest_AllowCredential => ({
          id: passkey['id'],
          type: 'public-key',
        })),
        challenge: randomBytes(32).toString('base64url'),
        rpId: url.hostname,
        timeout: 300000,
        userVerification: 'required',
      },
    });

    return true;
  }

  if (method === 'POST' && path === '/api/v1/backup/confirmation/passkey/verify') {
    const ceremonyId: MockApi_HandleRequest_CeremonyId = (typeof body['ceremonyId'] === 'string') ? body['ceremonyId'] : '';
    const purpose: MockApi_HandleRequest_Purpose = (body['purpose'] === 'export' || body['purpose'] === 'import') ? body['purpose'] : undefined;
    const binding: MockApi_HandleRequest_Binding = backupPasskeyCeremonies.get(ceremonyId);

    backupPasskeyCeremonies.delete(ceremonyId);

    if (
      binding === undefined
      || purpose === undefined
      || binding['purpose'] !== purpose
      || binding['sessionId'] !== principal['sessionId']
    ) {
      sendError(response, 409, 'passkey_ceremony_invalid', 'That passkey request expired. Try again.');

      return true;
    }

    const grant: MockApi_HandleRequest_Grant = `obg_${randomBytes(32).toString('base64url')}`;

    backupGrants.set(grant, binding);

    sendJSON(response, 200, {
      expiresAt: new Date(Date.now() + (5 * minute)).toISOString(),
      grant,
    });

    return true;
  }

  if (method === 'POST' && path === '/api/v1/backup/export') {
    const grant: MockApi_HandleRequest_Grant = (typeof body['grant'] === 'string') ? body['grant'] : '';
    const binding: MockApi_HandleRequest_Binding = backupGrants.get(grant);
    const sections: MockApi_HandleRequest_Sections = (typeof body['sections'] === 'object' && body['sections'] !== null) ? body['sections'] as MockApi_HandleRequest_Sections : {};

    if (
      binding === undefined
      || binding['purpose'] !== 'export'
      || binding['sessionId'] !== principal['sessionId']
    ) {
      sendError(response, 401, 'backup_confirmation_expired', 'Confirm it\'s you again.');

      return true;
    }

    backupGrants.delete(grant);

    const document: MockApi_HandleRequest_ExportDocument = {
      appVersion: '1.0.4-mock',
      exportedAt: new Date().toISOString(),
      format: 'outpost-export',
      version: 1,
    };

    if (sections['settings'] === true) {
      document.settings = { ...settings['runtime'] };
    }

    if (sections['registries'] === true) {
      document.registries = registries.map((registry) => ({
        id: registry['id'],
        password: (registry['passwordMissing'] === true) ? null : 'mock registry password',
        registry: registry['registry'],
        username: registry['username'],
      }));
    }

    if (sections['notifications'] === true) {
      document.notifications = notifications.map((notification) => ({
        events: [...notification['events']],
        id: notification['id'],
        missingSecrets: [...notification['secretsMissing']],
        name: notification['name'],
        secrets: Object.fromEntries(Object.keys(notification['secrets']).map((key): MockApi_HandleRequest_ExportSecretEntry => [
          key,
          'mock notification secret',
        ])),
        service: notification['service'],
        settings: { ...notification['settings'] },
      }));
    }

    if (sections['accessTokens'] === true) {
      document.accessTokens = tokens.map((token) => ({
        createdAt: token['createdAt'],
        expiresAt: token['expiresAt'],
        id: token['id'],
        lastUsedAt: token['lastUsedAt'],
        name: token['name'],
        scopes: [...token['scopes']],
        tokenHash: token['hash'],
      }));
    }

    response.setHeader('Content-Disposition', `attachment; filename="outpost-export-${document['exportedAt'].slice(0, 10)}.json"`);

    sendJSON(response, 200, document);

    return true;
  }

  if (method === 'POST' && path === '/api/v1/backup/imports/preview') {
    const document: MockApi_HandleRequest_Document = (typeof body['document'] === 'object' && body['document'] !== null) ? body['document'] as MockApi_HandleRequest_ImportDocument : null;

    if (
      document === null
      || document['format'] !== 'outpost-export'
      || document['version'] !== 1
    ) {
      sendError(response, 422, 'invalid_request', 'Choose a valid Outpost export file.');

      return true;
    }

    const registryHosts: MockApi_HandleRequest_RegistryHosts = new Set(registries.map((registry) => registry['registry'].toLowerCase()));
    const targetNames: MockApi_HandleRequest_TargetNames = new Set(notifications.map((notification) => notification['name'].toLowerCase()));
    const tokenIds: MockApi_HandleRequest_TokenIds = new Set(tokens.map((token) => token['id']));
    const tokenNames: MockApi_HandleRequest_TokenNames = new Set(tokens.map((token) => token['name'].toLowerCase()));
    const tokenHashes: MockApi_HandleRequest_TokenHashes = new Set(tokens.map((token) => token['hash']));
    const fileRegistries: MockApi_HandleRequest_FileRegistries = document['registries'] ?? [];
    const fileTargets: MockApi_HandleRequest_FileTargets = document['notifications'] ?? [];
    const fileTokens: MockApi_HandleRequest_FileTokens = document['accessTokens'] ?? [];
    const documentSettings: MockApi_HandleRequest_DocumentSettings = document['settings'];
    const settingsChanged: MockApi_HandleRequest_SettingsChanged = (documentSettings === undefined) ? 0 : Object.keys(documentSettings).filter((key) => documentSettings[key as MockApi_HandleRequest_SettingsKey] !== settings['runtime'][key as MockApi_HandleRequest_SettingsKey]).length;
    const sections: MockApi_HandleRequest_PreviewSections = [];

    if (document['settings'] !== undefined) {
      sections.push({
        file: '8 settings',
        here: 'Current settings',
        id: 'settings',
        label: 'Settings',
        willImport: true,
      });
    }

    if (document['registries'] !== undefined) {
      sections.push({
        file: `${String(fileRegistries.length)} registry sign-ins`,
        here: `${String(registries.length)} registry sign-ins`,
        id: 'registries',
        label: 'Registries',
        willImport: true,
      });
    }

    if (document['notifications'] !== undefined) {
      sections.push({
        file: `${String(fileTargets.length)} targets`,
        here: `${String(notifications.length)} targets`,
        id: 'notifications',
        label: 'Notifications',
        willImport: true,
      });
    }

    if (document['accessTokens'] !== undefined) {
      sections.push({
        file: `${String(fileTokens.length)} tokens`,
        here: `${String(tokens.length)} tokens`,
        id: 'accessTokens',
        label: 'Access tokens',
        willImport: true,
      });
    }

    sendJSON(response, 200, {
      appVersion: document['appVersion'],
      exportedAt: document['exportedAt'],
      sections,
      summary: {
        accessTokens: {
          added: fileTokens.filter((token) => {
            return (
              tokenIds.has(token['id']) === false
              && tokenNames.has(token['name'].toLowerCase()) === false
              && tokenHashes.has(token['tokenHash']) === false
            );
          }).length,
          skipped: fileTokens.filter((token) => {
            return (
              tokenIds.has(token['id']) === true
              || tokenNames.has(token['name'].toLowerCase()) === true
              || tokenHashes.has(token['tokenHash']) === true
            );
          }).length,
        },
        notifications: {
          added: fileTargets.filter((target) => targetNames.has(target['name'].toLowerCase()) === false).length,
          replaced: fileTargets.filter((target) => targetNames.has(target['name'].toLowerCase()) === true).length,
        },
        registries: {
          added: fileRegistries.filter((registry) => registryHosts.has(registry['registry'].toLowerCase()) === false).length,
          replaced: fileRegistries.filter((registry) => registryHosts.has(registry['registry'].toLowerCase()) === true).length,
        },
        settings: { changed: settingsChanged },
      },
    });

    return true;
  }

  if (method === 'POST' && path === '/api/v1/backup/imports') {
    const document: MockApi_HandleRequest_Document = (typeof body['document'] === 'object' && body['document'] !== null) ? body['document'] as MockApi_HandleRequest_ImportDocument : null;
    const grant: MockApi_HandleRequest_Grant = (typeof body['grant'] === 'string') ? body['grant'] : '';
    const binding: MockApi_HandleRequest_Binding = backupGrants.get(grant);

    if (
      document === null
      || document['format'] !== 'outpost-export'
      || document['version'] !== 1
    ) {
      sendError(response, 422, 'invalid_request', 'Choose a valid Outpost export file.');

      return true;
    }

    if (
      binding === undefined
      || binding['purpose'] !== 'import'
      || binding['sessionId'] !== principal['sessionId']
    ) {
      sendError(response, 401, 'backup_confirmation_expired', 'Confirm it\'s you again.');

      return true;
    }

    backupGrants.delete(grant);

    const summary: MockApi_HandleRequest_ImportSummary = {
      accessTokens: {
        added: 0,
        skipped: 0,
      },
      notifications: {
        added: 0,
        replaced: 0,
      },
      registries: {
        added: 0,
        replaced: 0,
      },
      settings: { changed: 0 },
    };
    const importedSections: MockApi_HandleRequest_ImportedSections = [];
    const documentSettings: MockApi_HandleRequest_DocumentSettings = document['settings'];

    if (documentSettings !== undefined) {
      summary['settings'].changed = Object.keys(documentSettings).filter((key) => documentSettings[key as MockApi_HandleRequest_SettingsKey] !== settings['runtime'][key as MockApi_HandleRequest_SettingsKey]).length;
      settings.runtime = { ...documentSettings };
      importedSections.push('settings');
    }

    if (document['registries'] !== undefined) {
      for (const incoming of document['registries']) {
        const existing: MockApi_HandleRequest_ExistingRegistry = registries.find((registry) => registry['registry'].toLowerCase() === incoming['registry'].toLowerCase());

        if (existing === undefined) {
          registries.push({
            createdAt: new Date().toISOString(),
            id: incoming['id'],
            passwordMissing: incoming['password'] === null,
            registry: incoming['registry'],
            updatedAt: new Date().toISOString(),
            username: incoming['username'],
          });
          summary['registries'].added += 1;
        } else {
          existing.passwordMissing = incoming['password'] === null;
          existing.registry = incoming['registry'];
          existing.updatedAt = new Date().toISOString();
          existing.username = incoming['username'];
          summary['registries'].replaced += 1;
        }
      }

      importedSections.push('registries');
    }

    if (document['notifications'] !== undefined) {
      for (const incoming of document['notifications']) {
        const existing: MockApi_HandleRequest_ExistingNotification = notifications.find((notification) => notification['name'].toLowerCase() === incoming['name'].toLowerCase());
        const target: MockApi_HandleRequest_ImportedNotification = {
          createdAt: (existing !== undefined) ? existing['createdAt'] : new Date().toISOString(),
          events: [...incoming['events']],
          id: (existing !== undefined) ? existing['id'] : incoming['id'],
          lastAttemptAt: null,
          lastError: null,
          name: incoming['name'],
          secrets: Object.fromEntries(Object.keys(incoming['secrets']).map((key): MockApi_HandleRequest_ImportedSecretEntry => [
            key,
            true,
          ])),
          secretsMissing: [...incoming['missingSecrets']],
          service: incoming['service'],
          settings: { ...incoming['settings'] },
          updatedAt: new Date().toISOString(),
        };

        if (existing === undefined) {
          notifications.push(target);
          summary['notifications'].added += 1;
        } else {
          notifications.splice(notifications.indexOf(existing), 1, target);
          summary['notifications'].replaced += 1;
        }
      }

      importedSections.push('notifications');
    }

    if (document['accessTokens'] !== undefined) {
      for (const incoming of document['accessTokens']) {
        const duplicate: MockApi_HandleRequest_Duplicate = tokens.some((token) => {
          return (
            token['id'] === incoming['id']
            || token['name'].toLowerCase() === incoming['name'].toLowerCase()
            || token['hash'] === incoming['tokenHash']
          );
        });

        if (duplicate === true) {
          summary['accessTokens'].skipped += 1;
          continue;
        }

        tokens.push({
          createdAt: incoming['createdAt'],
          expiresAt: incoming['expiresAt'],
          hash: incoming['tokenHash'],
          id: incoming['id'],
          lastUsedAt: incoming['lastUsedAt'],
          name: incoming['name'],
          scopes: [...incoming['scopes']],
        });
        summary['accessTokens'].added += 1;
      }

      importedSections.push('accessTokens');
    }

    sendJSON(response, 200, {
      ...summary,
      importedSections,
    });

    return true;
  }

  if (method === 'POST' && path === '/api/v1/auth/password') {
    if (rejectUnknown([
      'currentPassword',
      'newPassword',
    ]) === true || checkPassword('currentPassword') === false) {
      return true;
    }

    if (passwordIssue(body['newPassword']) !== '') {
      sendIssues(response, 422, 'invalid_request', [fieldIssue('newPassword', passwordIssue(body['newPassword']))]);

      return true;
    }

    if (administrator !== null) {
      administrator.password = String(body['newPassword']);
    }

    // Other browsers are signed out; this one stays.
    for (const sessionId of [...sessions.keys()]) {
      if (sessionId !== principal['sessionId']) {
        sessions.delete(sessionId);
      }
    }

    sendEmpty(response);

    return true;
  }

  if (method === 'POST' && path === '/api/v1/auth/username') {
    const newUsername: MockApi_HandleRequest_NewUsername = (typeof body['username'] === 'string') ? body['username'].trim() : '';

    if (rejectUnknown([
      'password',
      'username',
    ]) === true) {
      return true;
    }

    if (typeof body['password'] !== 'string' || body['password'] === '') {
      sendIssues(response, 422, 'invalid_request', [fieldIssue('password', 'Enter your password.')]);

      return true;
    }

    if (usernameIssue(newUsername) !== '') {
      sendIssues(response, 422, 'invalid_request', [fieldIssue('username', usernameIssue(newUsername))]);

      return true;
    }

    if (checkPassword() === false) {
      return true;
    }

    if (administrator !== null) {
      administrator.username = newUsername;
    }

    const savedUsername: MockApi_HandleRequest_SavedUsername = (administrator !== null) ? administrator['username'] : newUsername;

    sendJSON(response, 200, {
      administrator: {
        id: administratorId,
        username: savedUsername,
      },
    });

    return true;
  }

  if (method === 'POST' && path === '/api/v1/auth/totp/setup') {
    if (rejectUnknown(['password']) === true || checkPassword() === false) {
      return true;
    }

    if (totpEnabled === true) {
      sendError(response, 409, 'totp_enabled', 'The authenticator app is already on.');

      return true;
    }

    const totpUsername: MockApi_HandleRequest_TotpUsername = (administrator !== null) ? administrator['username'] : 'admin';

    // The same URI and QR code options as the real server, so the code scans.
    const totpUri: MockApi_HandleRequest_TotpUri = `otpauth://totp/Outpost:${encodeURIComponent(totpUsername)}?secret=JBSWY3DPEHPK3PXPJBSWY3DPEHPK3PXP&issuer=Outpost&algorithm=SHA1&digits=6&period=30`;

    totpPending = true;
    sendJSON(response, 200, {
      expiresAt: new Date(Date.now() + (10 * minute)).toISOString(),
      qrCode: await toDataURL(totpUri, {
        errorCorrectionLevel: 'M',
        margin: 1,
        width: 240,
      }),
      secret: 'JBSWY3DPEHPK3PXPJBSWY3DPEHPK3PXP',
      uri: totpUri,
    });

    return true;
  }

  if (method === 'POST' && path === '/api/v1/auth/totp/enable') {
    if (rejectUnknown(['code']) === true) {
      return true;
    }

    if (totpPending === false) {
      sendError(response, 409, 'totp_setup_expired', 'Authenticator setup expired. Start again.');

      return true;
    }

    if (body['code'] !== '123456') {
      sendIssues(response, 422, 'code_invalid', [fieldIssue('code', 'That code doesn\'t match. Check the time on your device and try again. In the mock, use 123456.')]);

      return true;
    }

    totpEnabled = true;
    totpPending = false;
    recoveryCodes = newRecoveryCodes();
    removedSecrets = removedSecrets.filter((removedSecret) => removedSecret['kind'] !== 'authenticator');
    sendJSON(response, 200, { recoveryCodes });

    return true;
  }

  if (method === 'POST' && path === '/api/v1/auth/totp/disable') {
    if (rejectUnknown(['password']) === true || checkPassword() === false) {
      return true;
    }

    if (totpEnabled === false) {
      sendError(response, 409, 'totp_disabled', 'The authenticator app is already off.');

      return true;
    }

    totpEnabled = false;
    recoveryCodes = [];
    sendEmpty(response);

    return true;
  }

  if (method === 'POST' && path === '/api/v1/auth/recovery-codes') {
    if (rejectUnknown(['password']) === true || checkPassword() === false) {
      return true;
    }

    if (totpEnabled === false) {
      sendError(response, 409, 'totp_disabled', 'Turn on the authenticator app first.');

      return true;
    }

    recoveryCodes = newRecoveryCodes();
    sendJSON(response, 200, { recoveryCodes });

    return true;
  }

  // Adding a passkey runs the browser's real prompt; the mock saves whatever answer comes back.
  if (method === 'POST' && path === '/api/v1/auth/passkeys/register/options') {
    const passkeyName: MockApi_HandleRequest_PasskeyName = (typeof body['name'] === 'string') ? body['name'].trim() : '';

    if (rejectUnknown([
      'name',
      'password',
    ]) === true) {
      return true;
    }

    if (passkeyName === '' || [...passkeyName].length > 80) {
      sendIssues(response, 422, 'invalid_request', [fieldIssue('name', (passkeyName === '') ? 'Name this passkey.' : 'Use 80 characters or fewer.')]);

      return true;
    }

    if (checkPassword() === false) {
      return true;
    }

    const ceremonyId: MockApi_HandleRequest_CeremonyId = randomBytes(16).toString('base64url');
    const passkeyUsername: MockApi_HandleRequest_PasskeyUsername = (administrator !== null) ? administrator['username'] : 'admin';

    passkeyCeremonies.set(ceremonyId, passkeyName);

    sendJSON(response, 200, {
      ceremonyId,
      options: {
        attestation: 'none',
        authenticatorSelection: {
          residentKey: 'required',
          userVerification: 'preferred',
        },
        challenge: randomBytes(32).toString('base64url'),
        excludeCredentials: [],
        pubKeyCredParams: [
          {
            alg: -7,
            type: 'public-key',
          },
          {
            alg: -257,
            type: 'public-key',
          },
        ],
        rp: {
          id: url.hostname,
          name: 'Outpost',
        },
        timeout: 300000,
        user: {
          displayName: passkeyUsername,
          id: Buffer.from(administratorId).toString('base64url'),
          name: passkeyUsername,
        },
      },
    });

    return true;
  }

  if (method === 'POST' && path === '/api/v1/auth/passkeys/register/verify') {
    const ceremonyId: MockApi_HandleRequest_CeremonyId = (typeof body['ceremonyId'] === 'string') ? body['ceremonyId'] : '';
    const passkeyName: MockApi_HandleRequest_CeremonyPasskeyName = passkeyCeremonies.get(ceremonyId);

    if (passkeyName === undefined) {
      sendError(response, 409, 'passkey_ceremony_invalid', 'That passkey request expired. Try again.');

      return true;
    }

    const passkey: MockApi_HandleRequest_Passkey = {
      createdAt: new Date().toISOString(),
      hostname: url.hostname,
      id: `pk-${randomBytes(12).toString('base64url')}`,
      lastUsedAt: null,
      name: passkeyName,
    };

    passkeyCeremonies.delete(ceremonyId);
    passkeys = [
      ...passkeys,
      passkey,
    ];
    sendJSON(response, 201, passkey);

    return true;
  }

  if (method === 'DELETE' && path.startsWith('/api/v1/auth/passkeys/') === true) {
    const passkeyId: MockApi_HandleRequest_PasskeyId = decodeURIComponent(path.slice('/api/v1/auth/passkeys/'.length));

    if (passkeys.some((passkey) => passkey['id'] === passkeyId) === false) {
      sendError(response, 404, 'passkey_not_found', 'That passkey no longer exists.');

      return true;
    }

    if (rejectUnknown(['password']) === true || checkPassword() === false) {
      return true;
    }

    passkeys = passkeys.filter((passkey) => passkey['id'] !== passkeyId);
    sendEmpty(response);

    return true;
  }

  if (method === 'GET' && path === '/api/v1/notifications/events') {
    sendJSON(response, 200, { items: notificationEvents });

    return true;
  }

  if (method === 'GET' && path === '/api/v1/notifications') {
    sendJSON(response, 200, { items: [...notifications].sort((left, right) => right['createdAt'].localeCompare(left['createdAt'])) });

    return true;
  }

  // notificationInput checks a create or edit body like the server, sending the first problem.

  /**
   * Mock API - Notification Input.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @returns {MockApi_HandleRequest_NotificationInput_Returns}
   *
   * @since 1.0.0
   */
  const notificationInput: MockApi_HandleRequest_NotificationInput = (existing: MockApi_HandleRequest_NotificationInput_Existing): MockApi_HandleRequest_NotificationInput_Returns => {
    const service: MockApi_HandleRequest_NotificationInput_Service = (existing !== null) ? existing['service'] : body['service'] as MockApi_MockNotificationService;
    const name: MockApi_HandleRequest_NotificationInput_Name = (typeof body['name'] === 'string') ? body['name'].trim() : '';
    const events: MockApi_HandleRequest_NotificationInput_Events = (Array.isArray(body['events']) === true) ? body['events'] as MockApi_HandleRequest_NotificationInput_Events : [];
    const values: MockApi_HandleRequest_NotificationInput_Values = (typeof body['settings'] === 'object' && body['settings'] !== null) ? body['settings'] as MockApi_HandleRequest_NotificationInput_Values : {};

    if (notificationFields[service] === undefined) {
      sendIssues(response, 422, 'invalid_request', [fieldIssue('service', 'Choose a service.')]);

      return null;
    }

    if (name === '') {
      sendIssues(response, 422, 'invalid_request', [fieldIssue('name', 'Name this notification.')]);

      return null;
    }

    if (events.length === 0) {
      sendIssues(response, 422, 'invalid_request', [fieldIssue('events', 'Choose at least one event.')]);

      return null;
    }

    const plainSettings: MockApi_HandleRequest_NotificationInput_PlainSettings = {};
    const secrets: MockApi_HandleRequest_NotificationInput_Secrets = { ...((existing !== null) ? existing['secrets'] : {}) };

    for (const notificationField of notificationFields[service]) {
      const key: MockApi_HandleRequest_NotificationInput_Key = notificationField[0];
      const missing: MockApi_HandleRequest_NotificationInput_Missing = notificationField[1];
      const secret: MockApi_HandleRequest_NotificationInput_Secret = notificationField[2];
      const required: MockApi_HandleRequest_NotificationInput_Required = notificationField[3];
      const value: MockApi_HandleRequest_NotificationInput_Value = (typeof values[key] === 'string') ? (values[key]).trim() : '';
      const saved: MockApi_HandleRequest_NotificationInput_Saved = (
        secret === true
        && existing !== null
        && existing['secrets'][key] === true
      );

      if (
        value === ''
        && required === true
        && saved === false
      ) {
        sendIssues(response, 422, 'invalid_request', [fieldIssue(`settings.${key}`, missing)]);

        return null;
      }

      if (value !== '' && secret === true) {
        Reflect.set(secrets, key, true);
      } else if (value !== '') {
        Reflect.set(plainSettings, key, value);
      }
    }

    // Optional secrets that are saved, or missing after a lost key, can be cleared once each, never alongside a new value.
    const clearable: MockApi_HandleRequest_NotificationInput_Clearable = notificationFields[service]
      .filter((field) => {
        return (
          field[2] === true
          && field[3] === false
          && existing !== null
          && (
            existing['secrets'][field[0]] === true
            || existing['secretsMissing'].includes(field[0]) === true
          )
        );
      })
      .map((field) => field[0]);
    const clearSecrets: MockApi_HandleRequest_NotificationInput_ClearSecrets = (Array.isArray(body['clearSecrets']) === true) ? body['clearSecrets'] as MockApi_HandleRequest_NotificationInput_ClearSecrets : [];
    const invalidIndex: MockApi_HandleRequest_NotificationInput_InvalidIndex = clearSecrets.findIndex((key) => typeof key !== 'string' || clearable.includes(key) === false);

    if (body['clearSecrets'] !== undefined && Array.isArray(body['clearSecrets']) === false) {
      sendIssues(response, 422, 'invalid_request', [fieldIssue('clearSecrets', 'Choose an optional saved secret.')]);

      return null;
    }

    if (invalidIndex !== -1) {
      sendIssues(response, 422, 'invalid_request', [fieldIssue(`clearSecrets.${invalidIndex}`, 'Choose an optional saved secret.')]);

      return null;
    }

    if (new Set(clearSecrets).size !== clearSecrets.length) {
      sendIssues(response, 422, 'invalid_request', [fieldIssue('clearSecrets', 'Choose each secret only once.')]);

      return null;
    }

    const replaced: MockApi_HandleRequest_NotificationInput_Replaced = (clearSecrets as MockApi_HandleRequest_NotificationInput_ClearSecretKeys).find((key) => typeof values[key] === 'string' && (values[key]).trim() !== '');

    if (replaced !== undefined) {
      sendIssues(response, 422, 'invalid_request', [fieldIssue(`settings.${replaced}`, 'Enter a new value or clear this field, not both.')]);

      return null;
    }

    for (const key of clearSecrets as MockApi_HandleRequest_NotificationInput_ClearSecretKeys) {
      Reflect.deleteProperty(secrets, key);
    }

    if (notifications.some((notification) => notification['id'] !== ((existing !== null) ? existing['id'] : undefined) && notification['name'].toLowerCase() === name.toLowerCase()) === true) {
      sendIssues(response, 409, 'notification_exists', [fieldIssue('name', 'A notification with this name already exists.')]);

      return null;
    }

    return {
      events,
      name,
      clearSecrets: clearSecrets as MockApi_HandleRequest_NotificationInput_ClearSecretKeys,
      secrets,
      service,
      settings: plainSettings,
    };
  };

  if (method === 'POST' && path === '/api/v1/notifications') {
    const input: MockApi_HandleRequest_NotificationInputResult = notificationInput(null);

    if (input === null) {
      return true;
    }

    const notification: MockApi_HandleRequest_Notification = {
      events: input['events'],
      name: input['name'],
      secrets: input['secrets'],
      service: input['service'],
      settings: input['settings'],
      createdAt: new Date().toISOString(),
      id: `ntf-${randomBytes(8).toString('hex')}`,
      lastAttemptAt: null,
      lastError: null,
      secretsMissing: [],
      updatedAt: new Date().toISOString(),
    };

    notifications.push(notification);

    sendJSON(response, 201, notification);

    return true;
  }

  const notificationMatch: MockApi_HandleRequest_NotificationMatch = path.match(new RegExp(notificationPathPattern, 'u'));

  if (notificationMatch !== null) {
    const index: MockApi_HandleRequest_Index = notifications.findIndex((notification) => notification['id'] === notificationMatch[1]);
    const notification: MockApi_HandleRequest_FoundNotification = notifications[index];

    if (notification === undefined) {
      sendError(response, 404, 'notification_not_found', 'That notification no longer exists.');

      return true;
    }

    if (method === 'POST' && notificationMatch[2] === '/test') {
      if (notification['secretsMissing'].length > 0) {
        sendJSON(response, 200, {
          delivered: false,
          message: 'Enter the removed secrets again first.',
        });

        return true;
      }

      notification.lastAttemptAt = new Date().toISOString();
      notification.lastError = null;
      sendJSON(response, 200, { delivered: true });

      return true;
    }

    if (method === 'DELETE') {
      notifications.splice(index, 1);
      removedSecrets = removedSecrets.filter((removedSecret) => removedSecret['notificationId'] !== notification['id']);
      sendEmpty(response);

      return true;
    }

    if (method === 'PUT') {
      const input: MockApi_HandleRequest_NotificationInputResult = notificationInput(notification);

      if (input === null) {
        return true;
      }

      notification.events = input['events'];
      notification.name = input['name'];
      notification.secrets = input['secrets'];

      // A missing secret is settled by entering it again or, when optional, by clearing it.
      notification.secretsMissing = notification['secretsMissing'].filter((key) => input['secrets'][key] !== true && input['clearSecrets'].includes(key) === false);
      notification.settings = input['settings'];
      notification.updatedAt = new Date().toISOString();

      if (notification['secretsMissing'].length === 0) {
        removedSecrets = removedSecrets.filter((removedSecret) => removedSecret['notificationId'] !== notification['id']);
      }

      sendJSON(response, 200, notification);

      return true;
    }
  }

  if (method === 'GET' && path === '/api/v1/registries') {
    sendJSON(response, 200, { items: [...registries].sort((left, right) => left['registry'].localeCompare(right['registry'])) });

    return true;
  }

  if (method === 'POST' && path === '/api/v1/registries') {
    const input: MockApi_HandleRequest_RegistryInputResult = registryInput(response, body, '', true);

    if (input === null) {
      return true;
    }

    const registry: MockApi_HandleRequest_Registry = {
      createdAt: new Date().toISOString(),
      id: `reg-${randomBytes(8).toString('hex')}`,
      passwordMissing: false,
      registry: input['registry'],
      updatedAt: new Date().toISOString(),
      username: input['username'],
    };

    registries.push(registry);

    sendJSON(response, 201, registry);

    return true;
  }

  const registryMatch: MockApi_HandleRequest_RegistryMatch = path.match(new RegExp(registryPathPattern, 'u'));

  if (
    registryMatch !== null
    && (
      method === 'PUT'
      || method === 'DELETE'
    )
  ) {
    const index: MockApi_HandleRequest_Index = registries.findIndex((registry) => registry['id'] === decodeURIComponent(registryMatch[1] ?? ''));
    const registry: MockApi_HandleRequest_FoundRegistry = registries[index];

    if (registry === undefined) {
      sendError(response, 404, 'registry_not_found', 'That registry sign-in no longer exists.');

      return true;
    }

    if (method === 'DELETE') {
      registries.splice(index, 1);
      removedSecrets = removedSecrets.filter((removedSecret) => removedSecret['registryId'] !== registry['id']);
      sendEmpty(response);

      return true;
    }

    const input: MockApi_HandleRequest_RegistryInputResult = registryInput(response, body, registry['id'], false);

    if (input === null) {
      return true;
    }

    registry.registry = input['registry'];
    registry.username = input['username'];
    registry.updatedAt = new Date().toISOString();

    // A new password replaces the saved one, even one a lost key removed, and settles its notice.
    if (input['password'] !== undefined) {
      registry.passwordMissing = false;
      removedSecrets = removedSecrets.filter((removedSecret) => removedSecret['registryId'] !== registry['id']);
    }

    sendJSON(response, 200, registry);

    return true;
  }

  if (method === 'GET' && path === '/api/v1/auth/tokens') {
    sendJSON(response, 200, {
      items: [...tokens]
        .sort((left, right) => right['createdAt'].localeCompare(left['createdAt']))
        .map(tokenResource),
    });

    return true;
  }

  if (method === 'POST' && path === '/api/v1/auth/tokens') {
    const input: MockApi_HandleRequest_TokenInputResult = tokenInput(response, body, '', true);

    if (input === null) {
      return true;
    }

    const plaintext: MockApi_HandleRequest_Plaintext = `outpost_${randomBytes(32).toString('base64url')}`;
    const token: MockApi_HandleRequest_Token = {
      createdAt: new Date().toISOString(),
      expiresAt: input['expiresAt'] ?? null,
      hash: digest(plaintext),
      id: `tok-${randomBytes(8).toString('hex')}`,
      lastUsedAt: null,
      name: input['name'],
      scopes: input['scopes'],
    };

    tokens.push(token);

    sendJSON(response, 201, {
      plaintext,
      token: tokenResource(token),
    });

    return true;
  }

  const tokenMatch: MockApi_HandleRequest_TokenMatch = path.match(new RegExp(tokenPathPattern, 'u'));

  if (
    tokenMatch !== null
    && (
      method === 'PUT'
      || method === 'DELETE'
    )
  ) {
    const index: MockApi_HandleRequest_Index = tokens.findIndex((token) => token['id'] === decodeURIComponent(tokenMatch[1] ?? ''));
    const token: MockApi_HandleRequest_FoundToken = tokens[index];

    if (token === undefined) {
      sendError(response, 404, 'token_not_found', 'That token no longer exists.');

      return true;
    }

    if (method === 'DELETE') {
      tokens.splice(index, 1);

      sendEmpty(response);

      return true;
    }

    const input: MockApi_HandleRequest_TokenInputResult = tokenInput(response, body, token['id'], false);

    if (input === null) {
      return true;
    }

    token.name = input['name'];
    token.scopes = input['scopes'];

    if (input['expiresAt'] !== undefined) {
      token.expiresAt = input['expiresAt'];
    }

    sendJSON(response, 200, tokenResource(token));

    return true;
  }

  sendError(response, 404, 'not_found', 'No route matches this request.');

  return true;
};

/**
 * Mock API - Mock API.
 *
 * Answers the dashboard's API from memory, so the interface runs without Docker.
 * Set up with the printed code and "mock password 123"; the authenticator code
 * is 123456, and recovery codes are random, shown once when they're made.
 *
 * @returns {MockApi_MockApi_Returns}
 *
 * @since 1.0.0
 */
export const mockApi = (): MockApi_MockApi_Returns => ({
  name: 'outpost-mock-api',
  configureServer: (server) => {
    server.config.logger.info(`  Mock setup code: ${setupCode}, password "${mockPassword}"`);
    server.config.logger.info(`  Mock tokens: ${seedTokens.map((seed) => `${seed['name']} ${seed['plaintext']} (${seed['scopes'].join(', ')})`).join('; ')}`);

    server.middlewares.use((request: MockApi_MockApi_Request, response: MockApi_MockApi_Response, next: MockApi_MockApi_Next) => {
      void handleRequest(request, response).then((handled) => {
        if (handled === false) {
          next();
        }

        return;
      }).catch((error) => {
        const errorText: MockApi_MockApi_ErrorText = (error instanceof Error) ? error.stack ?? error.message : String(error);

        server.config.logger.error(`  Mock API error: ${errorText}`);

        if (response.headersSent === false) {
          sendError(response, 500, 'internal_error', 'Something went wrong. Try again.');
        }

        return;
      });

      return;
    });

    return;
  },
});

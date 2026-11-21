import type {
  IncomingMessage,
  ServerResponse,
} from 'node:http';

import type { Plugin } from 'vite';

/**
 * Mock API.
 *
 * @since 1.2.1
 */
export type MockApi_MockScope = 'metrics:read' | 'status:read' | 'updates:run';

export type MockApi_MockStatus = 'available' | 'failed' | 'held' | 'kept-unhealthy' | 'rolled-back' | 'skipped' | 'up-to-date' | 'updated';

// MockApi_MockAction names whether a simulated cycle only checks digests or applies updates.
export type MockApi_MockAction = 'check' | 'update';

export type MockApi_MockTrigger = 'api' | 'dashboard' | 'schedule' | 'startup';

export type MockApi_MockIssue = {
  field: string;
  message: string;
  path: string[];
};

export type MockApi_MockToken = {
  createdAt: string;
  expiresAt: string | null;
  hash: string;
  id: string;
  lastUsedAt: string | null;
  name: string;
  scopes: MockApi_MockScope[];
};

export type MockApi_MockResult = {
  container: string;
  detail: string;
  image: string;
  status: MockApi_MockStatus;
  summary?: string;
};

export type MockApi_MockReport = {
  action: MockApi_MockAction;
  error?: string;
  finishedAt: string;
  rollback?: boolean;
  results: MockApi_MockResult[];
  startedAt: string;
  trigger: MockApi_MockTrigger;
};

// MockApi_MockHistoryEntry is one day's result for a container: [status, detail, summary].
export type MockApi_MockHistoryEntry = [MockApi_MockStatus, string, string?];

export type MockApi_MockContainer = {
  history: Record<number, MockApi_MockHistoryEntry>;
  id: string;
  image: string;
  managed: boolean;
  monitorOnly: boolean;
  name: string;
  note: string;
  self?: boolean;
  skipped?: string;
};

// MockApi_MockRuntimeSettings mirrors the persisted settings contract used by the production API.
export type MockApi_MockRuntimeSettings = {
  cleanup: boolean;
  healthTimeoutSeconds: number;
  labelMode: 'opt-in' | 'opt-out';
  monitorOnly: boolean;
  runOnStart: boolean;
  schedule: string;
  settleSeconds: number;
  stopTimeoutSeconds: number;
};

export type MockApi_MockNotificationService = 'apprise' | 'discord' | 'email' | 'gotify' | 'matrix' | 'ntfy' | 'ntfy-reverse-proxy' | 'pushover' | 'slack' | 'telegram' | 'webhook';

// MockApi_MockBackupDocument mirrors the portable version-one shape; optional properties are the sections selected during export.
export type MockApi_MockBackupDocument = {
  accessTokens?: {
    createdAt: string;
    expiresAt: string | null;
    id: string;
    lastUsedAt: string | null;
    name: string;
    scopes: MockApi_MockScope[];
    tokenHash: string;
  }[];
  appVersion: string;
  exportedAt: string;
  format: 'outpost-export';
  notifications?: {
    events: string[];
    id: string;
    missingSecrets: string[];
    name: string;
    secrets: Record<string, string>;
    service: MockApi_MockNotificationService;
    settings: Record<string, string>;
  }[];
  registries?: {
    id: string;
    password: string | null;
    registry: string;
    username: string;
  }[];
  settings?: MockApi_MockRuntimeSettings;
  version: 1;
};

// MockApi_MockBackupPurpose restricts mock grants to one portable operation.
export type MockApi_MockBackupPurpose = 'export' | 'import';

// MockApi_MockBackupGrant binds one mock credential to a browser session and purpose.
export type MockApi_MockBackupGrant = {
  purpose: MockApi_MockBackupPurpose;
  sessionId: string;
};

export type MockApi_MockSettings = {
  runtime: MockApi_MockRuntimeSettings;
  system: {
    dataDirectory: string;
    dockerHost: string;
    timeZone: string;
  };
};

export type MockApi_MockPrincipal = {
  kind: 'session';
  sessionId: string;
} | {
  kind: 'token';
  token: MockApi_MockToken;
};

export type MockApi_MockPasskey = {
  createdAt: string;
  hostname: string | null;
  id: string;
  lastUsedAt: string | null;
  name: string;
};

// MockApi_MockRegistry is one private registry sign-in; the mock keeps no password, only whether a lost key removed it.
export type MockApi_MockRegistry = {
  createdAt: string;
  id: string;
  passwordMissing: boolean;
  registry: string;
  updatedAt: string;
  username: string;
};

export type MockApi_MockNotification = {
  createdAt: string;
  events: string[];
  id: string;
  lastAttemptAt: string | null;
  lastError: string | null;
  name: string;
  secrets: Record<string, true>;
  secretsMissing: string[];
  service: MockApi_MockNotificationService;
  settings: Record<string, string>;
  updatedAt: string;
};

// MockApi_MockNotificationField is one service field: [key, message when missing, secret, required].
export type MockApi_MockNotificationField = [string, string, boolean, boolean];

// MockApi_MockNotificationInput is a checked create or edit body, with the optional secrets to clear.
export type MockApi_MockNotificationInput = Pick<MockApi_MockNotification, 'events' | 'name' | 'secrets' | 'service' | 'settings'> & {
  clearSecrets: string[];
};

export type MockApi_MockAdministrator = {
  createdAt: string;
  password: string;
  username: string;
};

export type MockApi_MockTokenInput = {
  expiresAt?: string | null;
  name: string;
  scopes: MockApi_MockScope[];
};

export type MockApi_MockRegistryInput = {
  password?: string;
  registry: string;
  username: string;
};

/**
 * Mock API.
 *
 * @since 1.2.1
 */
export type MockApi_Administrator = MockApi_MockAdministrator | null;

/**
 * Mock API.
 *
 * @since 1.2.1
 */
export type MockApi_AdministratorId = string;

/**
 * Mock API.
 *
 * @since 1.2.1
 */
export type MockApi_At_DaysAgo = number;
export type MockApi_At_Hour = number;
export type MockApi_At_Minutes = number;
export type MockApi_At_Returns = number;
export type MockApi_At_Date = Date;

/**
 * Mock API.
 *
 * @since 1.2.1
 */
export type MockApi_BackupGrants = Map<string, MockApi_MockBackupGrant>;

/**
 * Mock API.
 *
 * @since 1.2.1
 */
export type MockApi_BackupPasskeyCeremonies = Map<string, MockApi_MockBackupGrant>;

/**
 * Mock API.
 *
 * @since 1.2.1
 */
export type MockApi_Broadcast_Event = string;
export type MockApi_Broadcast_Data = unknown;
export type MockApi_Broadcast_Returns = void;

/**
 * Mock API.
 *
 * @since 1.2.1
 */
export type MockApi_CheckedContainers_Returns = MockApi_MockContainer[];

/**
 * Mock API.
 *
 * @since 1.2.1
 */
export type MockApi_ContainerRows_Returns = Record<string, unknown>[];
export type MockApi_ContainerRows_Rows = Record<string, unknown>[];
export type MockApi_ContainerRows_Report = MockApi_MockReport | undefined;
export type MockApi_ContainerRows_Result = MockApi_MockResult | undefined;

/**
 * Mock API.
 *
 * @since 1.2.1
 */
export type MockApi_Containers = MockApi_MockContainer[];

/**
 * Mock API.
 *
 * @since 1.2.1
 */
export type MockApi_Day = number;

/**
 * Mock API.
 *
 * @since 1.2.1
 */
export type MockApi_DebugLogging = boolean;

/**
 * Mock API.
 *
 * @since 1.2.1
 */
export type MockApi_Digest_Value = string;
export type MockApi_Digest_Returns = string;

/**
 * Mock API.
 *
 * @since 1.2.1
 */
export type MockApi_EventClients = Set<ServerResponse>;

/**
 * Mock API.
 *
 * @since 1.2.1
 */
export type MockApi_FakeDigest_Seed = string;
export type MockApi_FakeDigest_Returns = string;

/**
 * Mock API.
 *
 * @since 1.2.1
 */
export type MockApi_FieldIssue_Field = string;
export type MockApi_FieldIssue_Message = string;
export type MockApi_FieldIssue_Returns = MockApi_MockIssue;

/**
 * Mock API.
 *
 * @since 1.2.1
 */
export type MockApi_HandleRequest_Request = IncomingMessage;
export type MockApi_HandleRequest_Response = ServerResponse;
export type MockApi_HandleRequest_Returns = Promise<boolean>;
export type MockApi_HandleRequest_Url = URL;
export type MockApi_HandleRequest_Path = string;
export type MockApi_HandleRequest_Method = string;
export type MockApi_HandleRequest_AliasRoute = boolean;
export type MockApi_HandleRequest_ParsedBody = Record<string, unknown> | null;
export type MockApi_HandleRequest_Body = Record<string, unknown>;
export type MockApi_HandleRequest_Aliases = Record<string, [string, MockApi_MockScope]>;
export type MockApi_HandleRequest_Alias = [string, MockApi_MockScope];
export type MockApi_HandleRequest_AliasMethod = string;
export type MockApi_HandleRequest_AliasScope = MockApi_MockScope;
export type MockApi_HandleRequest_AliasPrincipal = MockApi_MockPrincipal | 'invalid-token' | null;
export type MockApi_HandleRequest_Started = boolean;
export type MockApi_HandleRequest_ClaimUsername = string;
export type MockApi_HandleRequest_Issues = MockApi_MockIssue[];
export type MockApi_HandleRequest_LoginUsername = string;
export type MockApi_HandleRequest_Code = string;
export type MockApi_HandleRequest_IsTotpCode = boolean;
export type MockApi_HandleRequest_RecoveryCode = string | undefined;
export type MockApi_HandleRequest_Principal = MockApi_MockPrincipal | 'invalid-token' | null;
export type MockApi_HandleRequest_MeUsername = string;
export type MockApi_HandleRequest_Allowed = string[];
export type MockApi_HandleRequest_Action = MockApi_MockAction;
export type MockApi_HandleRequest_Extra = MockApi_MockIssue[];
export type MockApi_HandleRequest_ContainerId = string | undefined;
export type MockApi_HandleRequest_Rollback = boolean;
export type MockApi_HandleRequest_Target = MockApi_MockContainer | undefined;
export type MockApi_HandleRequest_KeepAlive = NodeJS.Timeout;
export type MockApi_HandleRequest_SecurityUsername = string;
export type MockApi_HandleRequest_Purpose = MockApi_MockBackupPurpose | undefined;
export type MockApi_HandleRequest_Password = string;
export type MockApi_HandleRequest_Grant = string;
export type MockApi_HandleRequest_CeremonyId = string;
export type MockApi_HandleRequest_AllowCredential = {
  id: string;
  type: 'public-key';
};
export type MockApi_HandleRequest_Binding = MockApi_MockBackupGrant | undefined;
export type MockApi_HandleRequest_Sections = Record<string, unknown>;
export type MockApi_HandleRequest_ExportDocument = MockApi_MockBackupDocument;
export type MockApi_HandleRequest_ExportSecretEntry = [string, string];
export type MockApi_HandleRequest_Document = MockApi_MockBackupDocument | null;
export type MockApi_HandleRequest_ImportDocument = MockApi_MockBackupDocument;
export type MockApi_HandleRequest_RegistryHosts = Set<string>;
export type MockApi_HandleRequest_TargetNames = Set<string>;
export type MockApi_HandleRequest_TokenIds = Set<string>;
export type MockApi_HandleRequest_TokenNames = Set<string>;
export type MockApi_HandleRequest_TokenHashes = Set<string>;
export type MockApi_HandleRequest_FileRegistries = NonNullable<MockApi_MockBackupDocument['registries']>;
export type MockApi_HandleRequest_FileTargets = NonNullable<MockApi_MockBackupDocument['notifications']>;
export type MockApi_HandleRequest_FileTokens = NonNullable<MockApi_MockBackupDocument['accessTokens']>;
export type MockApi_HandleRequest_DocumentSettings = MockApi_MockRuntimeSettings | undefined;
export type MockApi_HandleRequest_SettingsChanged = number;
export type MockApi_HandleRequest_SettingsKey = keyof MockApi_MockRuntimeSettings;
export type MockApi_HandleRequest_PreviewSections = {
  file: string;
  here: string;
  id: string;
  label: string;
  willImport: boolean;
}[];
export type MockApi_HandleRequest_ImportSummary = {
  accessTokens: {
    added: number;
    skipped: number;
  };
  notifications: {
    added: number;
    replaced: number;
  };
  registries: {
    added: number;
    replaced: number;
  };
  settings: {
    changed: number;
  };
};
export type MockApi_HandleRequest_ImportedSections = string[];
export type MockApi_HandleRequest_ExistingRegistry = MockApi_MockRegistry | undefined;
export type MockApi_HandleRequest_ExistingNotification = MockApi_MockNotification | undefined;
export type MockApi_HandleRequest_ImportedNotification = MockApi_MockNotification;
export type MockApi_HandleRequest_ImportedSecretEntry = [string, true];
export type MockApi_HandleRequest_Duplicate = boolean;
export type MockApi_HandleRequest_NewUsername = string;
export type MockApi_HandleRequest_SavedUsername = string;
export type MockApi_HandleRequest_TotpUsername = string;
export type MockApi_HandleRequest_TotpUri = string;
export type MockApi_HandleRequest_PasskeyName = string;
export type MockApi_HandleRequest_PasskeyUsername = string;
export type MockApi_HandleRequest_CeremonyPasskeyName = string | undefined;
export type MockApi_HandleRequest_Passkey = MockApi_MockPasskey;
export type MockApi_HandleRequest_PasskeyId = string;
export type MockApi_HandleRequest_NotificationInputResult = MockApi_MockNotificationInput | null;
export type MockApi_HandleRequest_Notification = MockApi_MockNotification;
export type MockApi_HandleRequest_NotificationMatch = RegExpMatchArray | null;
export type MockApi_HandleRequest_Index = number;
export type MockApi_HandleRequest_FoundNotification = MockApi_MockNotification | undefined;
export type MockApi_HandleRequest_RegistryInputResult = MockApi_MockRegistryInput | null;
export type MockApi_HandleRequest_Registry = MockApi_MockRegistry;
export type MockApi_HandleRequest_RegistryMatch = RegExpMatchArray | null;
export type MockApi_HandleRequest_FoundRegistry = MockApi_MockRegistry | undefined;
export type MockApi_HandleRequest_TokenInputResult = MockApi_MockTokenInput | null;
export type MockApi_HandleRequest_Plaintext = string;
export type MockApi_HandleRequest_Token = MockApi_MockToken;
export type MockApi_HandleRequest_TokenMatch = RegExpMatchArray | null;
export type MockApi_HandleRequest_FoundToken = MockApi_MockToken | undefined;

/**
 * Mock API.
 *
 * @since 1.2.1
 */
export type MockApi_HandleRequest_CheckPassword_Field = string;
export type MockApi_HandleRequest_CheckPassword_Returns = boolean;
export type MockApi_HandleRequest_CheckPassword = (field?: MockApi_HandleRequest_CheckPassword_Field) => MockApi_HandleRequest_CheckPassword_Returns;

/**
 * Mock API.
 *
 * @since 1.2.1
 */
export type MockApi_HandleRequest_NotificationInput_Existing = MockApi_MockNotification | null;
export type MockApi_HandleRequest_NotificationInput_Returns = MockApi_MockNotificationInput | null;
export type MockApi_HandleRequest_NotificationInput_Service = MockApi_MockNotificationService;
export type MockApi_HandleRequest_NotificationInput_Name = string;
export type MockApi_HandleRequest_NotificationInput_Events = string[];
export type MockApi_HandleRequest_NotificationInput_Values = Record<string, unknown>;
export type MockApi_HandleRequest_NotificationInput_PlainSettings = Record<string, string>;
export type MockApi_HandleRequest_NotificationInput_Secrets = Record<string, true>;
export type MockApi_HandleRequest_NotificationInput_Key = string;
export type MockApi_HandleRequest_NotificationInput_Missing = string;
export type MockApi_HandleRequest_NotificationInput_Secret = boolean;
export type MockApi_HandleRequest_NotificationInput_Required = boolean;
export type MockApi_HandleRequest_NotificationInput_Value = string;
export type MockApi_HandleRequest_NotificationInput_Saved = boolean;
export type MockApi_HandleRequest_NotificationInput_Clearable = string[];
export type MockApi_HandleRequest_NotificationInput_ClearSecrets = unknown[];
export type MockApi_HandleRequest_NotificationInput_InvalidIndex = number;
export type MockApi_HandleRequest_NotificationInput_ClearSecretKeys = string[];
export type MockApi_HandleRequest_NotificationInput_Replaced = string | undefined;
export type MockApi_HandleRequest_NotificationInput = (existing: MockApi_HandleRequest_NotificationInput_Existing) => MockApi_HandleRequest_NotificationInput_Returns;

/**
 * Mock API.
 *
 * @since 1.2.1
 */
export type MockApi_HandleRequest_RejectUnknown_Allowed = string[];
export type MockApi_HandleRequest_RejectUnknown_Returns = boolean;
export type MockApi_HandleRequest_RejectUnknown_Extra = MockApi_MockIssue[];
export type MockApi_HandleRequest_RejectUnknown = (allowed: MockApi_HandleRequest_RejectUnknown_Allowed) => MockApi_HandleRequest_RejectUnknown_Returns;

/**
 * Mock API.
 *
 * @since 1.2.1
 */
export type MockApi_HandleRequest_RequireScope_Scope = MockApi_MockScope;
export type MockApi_HandleRequest_RequireScope_Returns = boolean;
export type MockApi_HandleRequest_RequireScope = (scope: MockApi_HandleRequest_RequireScope_Scope) => MockApi_HandleRequest_RequireScope_Returns;

/**
 * Mock API.
 *
 * @since 1.2.1
 */
export type MockApi_History = MockApi_MockReport[];
export type MockApi_History_StartTime = number;

/**
 * Mock API.
 *
 * @since 1.2.1
 */
export type MockApi_Jellyfin = MockApi_MockContainer | undefined;

/**
 * Mock API.
 *
 * @since 1.2.1
 */
export type MockApi_KeyReplaced = boolean;

/**
 * Mock API.
 *
 * @since 1.2.1
 */
export type MockApi_LastCheckDay = Date;

/**
 * Mock API.
 *
 * @since 1.2.1
 */
export type MockApi_LastError = string | undefined;

/**
 * Mock API.
 *
 * @since 1.2.1
 */
export type MockApi_LiveResult_Container = MockApi_MockContainer;
export type MockApi_LiveResult_Action = MockApi_MockAction;
export type MockApi_LiveResult_Returns = MockApi_MockResult;
export type MockApi_LiveResult_Result = MockApi_MockResult;

/**
 * Mock API.
 *
 * @since 1.2.1
 */
export type MockApi_LiveUpdates = number;

/**
 * Mock API.
 *
 * @since 1.2.1
 */
export type MockApi_LongContainer = MockApi_MockContainer | undefined;

/**
 * Mock API.
 *
 * @since 1.2.1
 */
export type MockApi_MetricsText_Returns = string;
export type MockApi_MetricsText_RunningValue = number;
export type MockApi_MetricsText_Lines = string[];
export type MockApi_MetricsText_LastReport = MockApi_MockReport | undefined;

/**
 * Mock API.
 *
 * @since 1.2.1
 */
export type MockApi_Minute = number;

/**
 * Mock API.
 *
 * @since 1.2.1
 */
export type MockApi_MockApi_Returns = Plugin;
export type MockApi_MockApi_Request = IncomingMessage;
export type MockApi_MockApi_Response = ServerResponse;
export type MockApi_MockApi_Next = () => void;
export type MockApi_MockApi_ErrorText = string;

/**
 * Mock API.
 *
 * @since 1.2.1
 */
export type MockApi_MockPassword = string;

/**
 * Mock API.
 *
 * @since 1.2.1
 */
export type MockApi_NewRecoveryCodes_Returns = string[];
export type MockApi_NewRecoveryCodes_Code = string;

/**
 * Mock API.
 *
 * @since 1.2.1
 */
export type MockApi_NextRun_Returns = string;

/**
 * Mock API.
 *
 * @since 1.2.1
 */
export type MockApi_NormalizeCode_Value = string;
export type MockApi_NormalizeCode_Returns = string;

/**
 * Mock API.
 *
 * @since 1.2.1
 */
export type MockApi_NormalizeRegistry_Value = string;
export type MockApi_NormalizeRegistry_Returns = string;
export type MockApi_NormalizeRegistry_Host = string;

/**
 * Mock API.
 *
 * @since 1.2.1
 */
export type MockApi_NotificationEvents_NotificationEvent = {
  defaultEnabled: boolean;
  description: string;
  key: string;
  label: string;
};
export type MockApi_NotificationEvents = MockApi_NotificationEvents_NotificationEvent[];

/**
 * Mock API.
 *
 * @since 1.2.1
 */
export type MockApi_NotificationFields = Record<MockApi_MockNotificationService, MockApi_MockNotificationField[]>;

/**
 * Mock API.
 *
 * @since 1.2.1
 */
export type MockApi_Notifications = MockApi_MockNotification[];

/**
 * Mock API.
 *
 * @since 1.2.1
 */
export type MockApi_OverviewResource_Returns = Record<string, unknown>;

/**
 * Mock API.
 *
 * @since 1.2.1
 */
export type MockApi_PasskeyCeremonies = Map<string, string>;

/**
 * Mock API.
 *
 * @since 1.2.1
 */
export type MockApi_Passkeys = MockApi_MockPasskey[];

/**
 * Mock API.
 *
 * @since 1.2.1
 */
export type MockApi_PasswordIssue_Value = unknown;
export type MockApi_PasswordIssue_Returns = string;

/**
 * Mock API.
 *
 * @since 1.2.1
 */
export type MockApi_PendingChallenge = {
  challenge: string;
  failures: number;
} | null;

/**
 * Mock API.
 *
 * @since 1.2.1
 */
export type MockApi_PrincipalOf_Request = IncomingMessage;
export type MockApi_PrincipalOf_Returns = MockApi_MockPrincipal | 'invalid-token' | null;
export type MockApi_PrincipalOf_Authorization = string | undefined;
export type MockApi_PrincipalOf_Plaintext = string;
export type MockApi_PrincipalOf_Token = MockApi_MockToken | undefined;
export type MockApi_PrincipalOf_SessionId = string;

/**
 * Mock API.
 *
 * @since 1.2.1
 */
export type MockApi_ReadBody_Request = IncomingMessage;
export type MockApi_ReadBody_Returns = Promise<Record<string, unknown> | null>;
export type MockApi_ReadBody_Chunks = Buffer[];
export type MockApi_ReadBody_Text = string;
export type MockApi_ReadBody_Parsed = unknown;
export type MockApi_ReadBody_Body = Record<string, unknown>;

/**
 * Mock API.
 *
 * @since 1.2.1
 */
export type MockApi_ReadCookies_Request = IncomingMessage;
export type MockApi_ReadCookies_Returns = Record<string, string>;
export type MockApi_ReadCookies_Entries = [string, string][];
export type MockApi_ReadCookies_Entry = [string, string];

/**
 * Mock API.
 *
 * @since 1.2.1
 */
export type MockApi_RecoveryCodes = string[];

/**
 * Mock API.
 *
 * @since 1.2.1
 */
export type MockApi_Registries = MockApi_MockRegistry[];

/**
 * Mock API.
 *
 * @since 1.2.1
 */
export type MockApi_RegistryInput_Response = ServerResponse;
export type MockApi_RegistryInput_Body = Record<string, unknown>;
export type MockApi_RegistryInput_ExceptId = string;
export type MockApi_RegistryInput_Creating = boolean;
export type MockApi_RegistryInput_Returns = MockApi_MockRegistryInput | null;
export type MockApi_RegistryInput_Password = unknown;
export type MockApi_RegistryInput_Registry = string;
export type MockApi_RegistryInput_Username = string;
export type MockApi_RegistryInput_Issues = MockApi_MockIssue[];

/**
 * Mock API.
 *
 * @since 1.2.1
 */
export type MockApi_RemovedSecrets_RemovedSecret = {
  kind: 'authenticator' | 'notification' | 'registry';
  name?: string;
  notificationId?: string;
  registryId?: string;
  removedAt: string;
};
export type MockApi_RemovedSecrets = MockApi_RemovedSecrets_RemovedSecret[];

/**
 * Mock API.
 *
 * @since 1.2.1
 */
export type MockApi_ResultFor_Container = MockApi_MockContainer;
export type MockApi_ResultFor_DaysAgo = number;
export type MockApi_ResultFor_Returns = MockApi_MockResult;
export type MockApi_ResultFor_Entry = MockApi_MockHistoryEntry;
export type MockApi_ResultFor_Status = MockApi_MockStatus;
export type MockApi_ResultFor_Detail = string;
export type MockApi_ResultFor_Summary = string | undefined;

/**
 * Mock API.
 *
 * @since 1.2.1
 */
export type MockApi_RunAction = MockApi_MockAction | undefined;

/**
 * Mock API.
 *
 * @since 1.2.1
 */
export type MockApi_RunStartedAt = string | undefined;

/**
 * Mock API.
 *
 * @since 1.2.1
 */
export type MockApi_Running = boolean;

/**
 * Mock API.
 *
 * @since 1.2.1
 */
export type MockApi_SchedulerState_Returns = Record<string, unknown>;

/**
 * Mock API.
 *
 * @since 1.2.1
 */
export type MockApi_ScopeOrder = MockApi_MockScope[];

/**
 * Mock API.
 *
 * @since 1.2.1
 */
export type MockApi_SecretKeys = string[];

/**
 * Mock API.
 *
 * @since 1.2.1
 */
export type MockApi_SeedReport_DaysAgo = number;
export type MockApi_SeedReport_StartTime = number;
export type MockApi_SeedReport_Seconds = number;
export type MockApi_SeedReport_Trigger = MockApi_MockTrigger;
export type MockApi_SeedReport_Returns = MockApi_MockReport;

/**
 * Mock API.
 *
 * @since 1.2.1
 */
export type MockApi_SeedTokens_SeedToken = {
  createdDaysAgo: number;
  expiresInDays: number | null;
  name: string;
  plaintext: string;
  scopes: MockApi_MockScope[];
  usedMinutesAgo: number | null;
};
export type MockApi_SeedTokens = MockApi_SeedTokens_SeedToken[];

/**
 * Mock API.
 *
 * @since 1.2.1
 */
export type MockApi_SendEmpty_Response = ServerResponse;
export type MockApi_SendEmpty_Returns = void;

/**
 * Mock API.
 *
 * @since 1.2.1
 */
export type MockApi_SendError_Response = ServerResponse;
export type MockApi_SendError_Status = number;
export type MockApi_SendError_Code = string;
export type MockApi_SendError_Message = string;
export type MockApi_SendError_Returns = void;

/**
 * Mock API.
 *
 * @since 1.2.1
 */
export type MockApi_SendIssues_Response = ServerResponse;
export type MockApi_SendIssues_Status = number;
export type MockApi_SendIssues_Code = string;
export type MockApi_SendIssues_Issues = MockApi_MockIssue[];
export type MockApi_SendIssues_Returns = void;
export type MockApi_SendIssues_FirstIssue = MockApi_MockIssue | undefined;

/**
 * Mock API.
 *
 * @since 1.2.1
 */
export type MockApi_SendJson_Response = ServerResponse;
export type MockApi_SendJson_Status = number;
export type MockApi_SendJson_Body = unknown;
export type MockApi_SendJson_Returns = void;

/**
 * Mock API.
 *
 * @since 1.2.1
 */
export type MockApi_Sessions = Map<string, string>;

/**
 * Mock API.
 *
 * @since 1.2.1
 */
export type MockApi_Settings = MockApi_MockSettings;

/**
 * Mock API.
 *
 * @since 1.2.1
 */
export type MockApi_SetupCode = string;

/**
 * Mock API.
 *
 * @since 1.2.1
 */
export type MockApi_StartCycle_ContainerId = string | undefined;
export type MockApi_StartCycle_Trigger = MockApi_MockTrigger;
export type MockApi_StartCycle_Action = MockApi_MockAction;
export type MockApi_StartCycle_Rollback = boolean;
export type MockApi_StartCycle_Returns = boolean;
export type MockApi_StartCycle_Targets = MockApi_MockContainer[];
export type MockApi_StartCycle_Report = MockApi_MockReport;

/**
 * Mock API.
 *
 * @since 1.2.1
 */
export type MockApi_StartSession_Response = ServerResponse;
export type MockApi_StartSession_Status = number;
export type MockApi_StartSession_Returns = void;
export type MockApi_StartSession_SessionId = string;
export type MockApi_StartSession_CsrfToken = string;
export type MockApi_StartSession_Username = string;

/**
 * Mock API.
 *
 * @since 1.2.1
 */
export type MockApi_StartedAt = number;

/**
 * Mock API.
 *
 * @since 1.2.1
 */
export type MockApi_TokenInput_Response = ServerResponse;
export type MockApi_TokenInput_Body = Record<string, unknown>;
export type MockApi_TokenInput_ExceptId = string;
export type MockApi_TokenInput_Creating = boolean;
export type MockApi_TokenInput_Returns = MockApi_MockTokenInput | null;
export type MockApi_TokenInput_Extra = MockApi_MockIssue[];
export type MockApi_TokenInput_Name = string;
export type MockApi_TokenInput_RawScopes = unknown[];
export type MockApi_TokenInput_Issues = MockApi_MockIssue[];
export type MockApi_TokenInput_ExpiresAt = unknown;

/**
 * Mock API.
 *
 * @since 1.2.1
 */
export type MockApi_TokenResource_Token = MockApi_MockToken;
export type MockApi_TokenResource_Returns = Record<string, unknown>;

/**
 * Mock API.
 *
 * @since 1.2.1
 */
export type MockApi_Tokens = MockApi_MockToken[];

/**
 * Mock API.
 *
 * @since 1.2.1
 */
export type MockApi_Totals = {
  cycles: number;
  failed: number;
  updated: number;
};

/**
 * Mock API.
 *
 * @since 1.2.1
 */
export type MockApi_TotpEnabled = boolean;

/**
 * Mock API.
 *
 * @since 1.2.1
 */
export type MockApi_TotpPending = boolean;

/**
 * Mock API.
 *
 * @since 1.2.1
 */
export type MockApi_UnknownFields_Body = Record<string, unknown>;
export type MockApi_UnknownFields_Allowed = string[];
export type MockApi_UnknownFields_Returns = MockApi_MockIssue[];
export type MockApi_UnknownFields_Fields = string[];

/**
 * Mock API.
 *
 * @since 1.2.1
 */
export type MockApi_UsernameIssue_Value = string;
export type MockApi_UsernameIssue_Returns = string;

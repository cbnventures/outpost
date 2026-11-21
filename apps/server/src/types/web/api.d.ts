import type {
  ZodSafeParseResult,
  ZodType,
} from 'zod';

import type {
  Web_Backup_Grant,
  Web_Backup_ImportPreview,
  Web_Backup_ImportResult,
} from '@/types/web/backup.d.ts';
import type {
  Web_Notifications_Event,
  Web_Notifications_Target,
  Web_Notifications_TestResult,
} from '@/types/web/notifications.d.ts';

/**
 * API.
 *
 * @since 1.0.0
 */
export type Web_Api_Schema<Value> = ZodType<Value>;

/**
 * API.
 *
 * @since 1.0.0
 */
export type Web_Api_Request_Options = {
  body?: unknown;
  headers?: HeadersInit;
  method?: 'DELETE' | 'GET' | 'POST' | 'PUT';
};

/**
 * API.
 *
 * @since 1.0.0
 */
export type Web_Api_ErrorIssue = {
  field: string;
  message: string;
  path: string[];
};

/**
 * API.
 *
 * @since 1.0.0
 */
export type Web_Api_ErrorEnvelope = {
  error: {
    code: string;
    issues?: Web_Api_ErrorIssue[] | undefined;
    message: string;
  };
};

/**
 * API.
 *
 * @since 1.0.0
 */
export type Web_Api_SetupStatus = {
  claimExpiresAt?: string | undefined;
  claimRequired: boolean;
};

/**
 * API.
 *
 * @since 1.0.0
 */
export type Web_Api_RemovedSecret = {
  kind: 'authenticator' | 'notification' | 'registry';
  name?: string | undefined;
  notificationId?: string | undefined;
  registryId?: string | undefined;
  removedAt: string;
};

/**
 * API.
 *
 * @since 1.0.0
 */
export type Web_Api_Principal = {
  administratorId?: string | undefined;
  authenticationType: 'session' | 'token';
  id: string;
  removedSecrets?: Web_Api_RemovedSecret[] | undefined;
  scopes?: string[] | undefined;
  username?: string | undefined;
};

/**
 * API.
 *
 * @since 1.0.0
 */
export type Web_Api_AuthenticationResponse = {
  administrator: {
    id: string;
    username: string;
  };
  csrfToken: string;
  expiresAt: string;
  status: 'authenticated';
};

/**
 * API.
 *
 * @since 1.0.0
 */
export type Web_Api_SecondFactorRequired = {
  challenge: string;
  expiresAt: string;
  status: 'second_factor_required';
};

/**
 * API.
 *
 * @since 1.0.0
 */
export type Web_Api_LoginResult = Web_Api_AuthenticationResponse | Web_Api_SecondFactorRequired;

/**
 * API.
 *
 * @since 1.0.0
 */
export type Web_Api_ClaimInput = {
  claimCode: string;
  password: string;
  username: string;
};

/**
 * API.
 *
 * @since 1.0.0
 */
export type Web_Api_LoginInput = {
  password: string;
  username: string;
};

/**
 * API.
 *
 * @since 1.0.0
 */
export type Web_Api_Passkey = {
  createdAt: string;
  hostname: string | null;
  id: string;
  lastUsedAt: string | null;
  name: string;
};

/**
 * API.
 *
 * @since 1.0.0
 */
export type Web_Api_AccountSecurity = {
  hostname: string;
  passkeys: Web_Api_Passkey[];
  passkeysAvailable: boolean;
  recoveryCodesRemaining: number;
  role?: string;
  totpEnabled: boolean;
  username: string;
};

/**
 * API.
 *
 * @since 1.0.0
 */
export type Web_Api_TotpSetup = {
  expiresAt: string;
  qrCode: string;
  secret: string;
  uri: string;
};

/**
 * API.
 *
 * @since 1.0.0
 */
export type Web_Api_RecoveryCodes = {
  recoveryCodes: string[];
};

/**
 * API.
 *
 * @since 1.0.0
 */
export type Web_Api_PasskeyCeremony = {
  ceremonyId: string;
  options: Record<string, unknown>;
};

/**
 * API.
 *
 * @since 1.0.0
 */
export type Web_Api_Scope = 'metrics:read' | 'status:read' | 'updates:run';

/**
 * API.
 *
 * @since 1.0.0
 */
export type Web_Api_Token = {
  createdAt: string;
  expiresAt: string | null;
  id: string;
  lastUsedAt: string | null;
  name: string;
  scopes: Web_Api_Scope[];
};

/**
 * API.
 *
 * @since 1.0.0
 */
export type Web_Api_CreatedToken = {
  plaintext: string;
  token: Web_Api_Token;
};

/**
 * API.
 *
 * @since 1.0.0
 */
export type Web_Api_CreateTokenInput = {
  expiresAt?: string | undefined;
  name: string;
  scopes: Web_Api_Scope[];
};

/**
 * API.
 *
 * @since 1.0.0
 */
export type Web_Api_UpdateTokenInput = {
  expiresAt?: string | null | undefined;
  name: string;
  scopes: Web_Api_Scope[];
};

/**
 * API.
 *
 * @since 1.0.0
 */
export type Web_Api_LabelMode = 'opt-in' | 'opt-out';

/**
 * API.
 *
 * @since 1.0.0
 */
export type Web_Api_ResultStatus = 'available' | 'failed' | 'held' | 'kept-unhealthy' | 'rolled-back' | 'skipped' | 'up-to-date' | 'updated';

/**
 * API.
 *
 * @since 1.1.0
 */
export type Web_Api_CycleAction = 'check' | 'update';

/**
 * API.
 *
 * @since 1.0.0
 */
export type Web_Api_Result = {
  container: string;
  detail: string;
  image: string;
  status: Web_Api_ResultStatus;
  summary?: string | undefined;
};

/**
 * API.
 *
 * @since 1.0.0
 */
export type Web_Api_Report = {
  action?: Web_Api_CycleAction | null | undefined;
  error?: string | null | undefined;
  finishedAt: string;
  rollback?: boolean | null | undefined;
  results: Web_Api_Result[];
  startedAt: string;
  trigger?: string | null | undefined;
};

/**
 * API.
 *
 * @since 1.0.0
 */
export type Web_Api_Totals = {
  cycles: number;
  failed: number;
  updated: number;
};

/**
 * API.
 *
 * @since 1.0.0
 */
export type Web_Api_Overview = {
  action?: Web_Api_CycleAction | null | undefined;
  labelMode: Web_Api_LabelMode;
  lastError?: string | null | undefined;
  lastReport?: Web_Api_Report | null | undefined;
  monitorOnly: boolean;
  nextRun?: string | null | undefined;
  running: boolean;
  schedule: string;
  startedAt?: string | null | undefined;
  timeZone: string;
  totals: Web_Api_Totals;
};

/**
 * API.
 *
 * @since 1.0.0
 */
export type Web_Api_Container = {
  fullId: string;
  id: string;
  image: string;
  lastAction?: Web_Api_CycleAction | null | undefined;
  lastCheckedAt?: string | null | undefined;
  lastDetail?: string | null | undefined;
  lastSummary?: string | null | undefined;
  lastStatus?: Web_Api_ResultStatus | null | undefined;
  managed: boolean;
  monitorOnly: boolean;
  name: string;
  note: string;
  self: boolean;
  state: string;
};

/**
 * API.
 *
 * @since 1.0.0
 */
export type Web_Api_RuntimeSettings = {
  cleanup: boolean;
  healthTimeoutSeconds: number;
  labelMode: Web_Api_LabelMode;
  monitorOnly: boolean;
  runOnStart: boolean;
  schedule: string;
  settleSeconds: number;
  stopTimeoutSeconds: number;
};

/**
 * API.
 *
 * @since 1.0.0
 */
export type Web_Api_SystemSettings = {
  dataDirectory: string;
  dockerHost: string;
  timeZone: string;
};

/**
 * API.
 *
 * @since 1.1.0
 */
export type Web_Api_Diagnostics = {
  debugLogging: boolean;
};

/**
 * API.
 *
 * @since 1.0.0
 */
export type Web_Api_Settings = {
  runtime: Web_Api_RuntimeSettings;
  system: Web_Api_SystemSettings;
};

/**
 * API.
 *
 * @since 1.0.0
 */
export type Web_Api_UpdateSettingsInput = Web_Api_RuntimeSettings;

/**
 * API.
 *
 * @since 1.0.0
 */
export type Web_Api_CheckStarted = {
  started: boolean;
};

/**
 * API - Start Update.
 *
 * @since 1.1.0
 */
export type Web_Api_StartUpdate_Body = {
  containerId?: string;
  rollback?: boolean;
};

/**
 * API.
 *
 * @since 1.0.0
 */
export type Web_Api_Registry = {
  createdAt: string;
  id: string;
  passwordMissing: boolean;
  registry: string;
  updatedAt: string;
  username: string;
};

/**
 * API.
 *
 * @since 1.0.0
 */
export type Web_Api_RegistryInput = {
  password: string;
  registry: string;
  username: string;
};

/**
 * API.
 *
 * @since 1.0.0
 */
export type Web_Api_RegistryUpdateInput = {
  password?: string;
  registry: string;
  username: string;
};

/**
 * API.
 *
 * @since 1.0.0
 */
export type Web_Api_Events_Handlers = {
  onCheck: (report: Web_Api_Report) => void;
  onClosed: () => void;
  onReconnect: () => void;
  onState: (overview: Web_Api_Overview) => void;
};
export type Web_Api_Events_Close = () => void;

/**
 * API.
 *
 * @since 1.2.1
 */
export type Web_Api_AccountSecuritySchema = Web_Api_Schema<Web_Api_AccountSecurity>;

/**
 * API.
 *
 * @since 1.2.1
 */
export type Web_Api_AddPasskey_Name = string;
export type Web_Api_AddPasskey_Password = string;
export type Web_Api_AddPasskey_Returns = Promise<Web_Api_Passkey>;
export type Web_Api_AddPasskey_Credential = Record<string, unknown>;

/**
 * API.
 *
 * @since 1.2.1
 */
export type Web_Api_ApiError_Code = string;
export type Web_Api_ApiError_Status = number;
export type Web_Api_ApiError_Issues = Web_Api_ErrorIssue[];

/**
 * API.
 *
 * @since 1.2.1
 */
export type Web_Api_ApiError_Constructor_Message = string;
export type Web_Api_ApiError_Constructor_Code = string;
export type Web_Api_ApiError_Constructor_Status = number;
export type Web_Api_ApiError_Constructor_Issues = Web_Api_ErrorIssue[];

/**
 * API.
 *
 * @since 1.2.1
 */
export type Web_Api_ApplyBackupImport_Grant = string;
export type Web_Api_ApplyBackupImport_Returns = Promise<Web_Backup_ImportResult>;

/**
 * API.
 *
 * @since 1.2.1
 */
export type Web_Api_AuthenticationResponseSchema = Web_Api_Schema<Web_Api_AuthenticationResponse>;

/**
 * API.
 *
 * @since 1.2.1
 */
export type Web_Api_BackupGrantSchema = Web_Api_Schema<Web_Backup_Grant>;

/**
 * API.
 *
 * @since 1.2.1
 */
export type Web_Api_BackupImportPreviewSchema = Web_Api_Schema<Web_Backup_ImportPreview>;

/**
 * API.
 *
 * @since 1.2.1
 */
export type Web_Api_BackupImportResultSchema = Web_Api_Schema<Web_Backup_ImportResult>;

/**
 * API.
 *
 * @since 1.2.1
 */
export type Web_Api_BuildRequest_Returns = RequestInit;
export type Web_Api_BuildRequest_Method = string;
export type Web_Api_BuildRequest_CsrfToken = string | undefined;

/**
 * API.
 *
 * @since 1.2.1
 */
export type Web_Api_ChangePassword_CurrentPassword = string;
export type Web_Api_ChangePassword_NewPassword = string;
export type Web_Api_ChangePassword_Returns = Promise<void>;

/**
 * API.
 *
 * @since 1.2.1
 */
export type Web_Api_ChangeUsername_Username = string;
export type Web_Api_ChangeUsername_Password = string;
export type Web_Api_ChangeUsername_Returns = Promise<void>;

/**
 * API.
 *
 * @since 1.2.1
 */
export type Web_Api_CheckStartedSchema = Web_Api_Schema<Web_Api_CheckStarted>;

/**
 * API.
 *
 * @since 1.2.1
 */
export type Web_Api_ClaimInstallation_Returns = Promise<Web_Api_AuthenticationResponse>;

/**
 * API.
 *
 * @since 1.2.1
 */
export type Web_Api_ConfirmBackupOperation_Password = string;
export type Web_Api_ConfirmBackupOperation_Code = string;
export type Web_Api_ConfirmBackupOperation_Returns = Promise<string>;

/**
 * API.
 *
 * @since 1.2.1
 */
export type Web_Api_ConfirmBackupOperationWithPasskey_Returns = Promise<string>;
export type Web_Api_ConfirmBackupOperationWithPasskey_Credential = Record<string, unknown>;

/**
 * API.
 *
 * @since 1.2.1
 */
export type Web_Api_ConnectEvents_Opened = boolean;
export type Web_Api_ConnectEvents_ParsedState = ZodSafeParseResult<Web_Api_Overview>;
export type Web_Api_ConnectEvents_ParsedReport = ZodSafeParseResult<Web_Api_Report>;

/**
 * API.
 *
 * @since 1.2.1
 */
export type Web_Api_ContainerSchema = Web_Api_Schema<Web_Api_Container>;

/**
 * API.
 *
 * @since 1.2.1
 */
export type Web_Api_CreatedTokenSchema = Web_Api_Schema<Web_Api_CreatedToken>;

/**
 * API.
 *
 * @since 1.2.1
 */
export type Web_Api_CreateNotification_Returns = Promise<Web_Notifications_Target>;

/**
 * API.
 *
 * @since 1.2.1
 */
export type Web_Api_CreateRegistry_Returns = Promise<Web_Api_Registry>;

/**
 * API.
 *
 * @since 1.2.1
 */
export type Web_Api_CreateToken_Returns = Promise<Web_Api_CreatedToken>;

/**
 * API.
 *
 * @since 1.2.1
 */
export type Web_Api_DiagnosticsSchema = Web_Api_Schema<Web_Api_Diagnostics>;

/**
 * API.
 *
 * @since 1.2.1
 */
export type Web_Api_DisableTotp_Password = string;
export type Web_Api_DisableTotp_Returns = Promise<void>;

/**
 * API.
 *
 * @since 1.2.1
 */
export type Web_Api_DismissRemovedSecrets_Returns = Promise<void>;

/**
 * API.
 *
 * @since 1.2.1
 */
export type Web_Api_DownloadBackupExport_Grant = string;
export type Web_Api_DownloadBackupExport_Returns = Promise<void>;
export type Web_Api_DownloadBackupExport_ContentDisposition = string;
export type Web_Api_DownloadBackupExport_FilenameMatch = RegExpMatchArray | null;
export type Web_Api_DownloadBackupExport_MatchedFilename = string | undefined;
export type Web_Api_DownloadBackupExport_Filename = string;
export type Web_Api_DownloadBackupExport_ObjectUrl = string;

/**
 * API.
 *
 * @since 1.2.1
 */
export type Web_Api_EnableTotp_Code = string;
export type Web_Api_EnableTotp_Returns = Promise<Web_Api_RecoveryCodes>;

/**
 * API.
 *
 * @since 1.2.1
 */
export type Web_Api_ErrorEnvelopeSchema = Web_Api_Schema<Web_Api_ErrorEnvelope>;

/**
 * API.
 *
 * @since 1.2.1
 */
export type Web_Api_GetAccountSecurity_Returns = Promise<Web_Api_AccountSecurity>;

/**
 * API.
 *
 * @since 1.2.1
 */
export type Web_Api_GetContainers_Returns = Promise<Web_Api_Container[]>;
export type Web_Api_GetContainers_Response_Items = Web_Api_Container[];
export type Web_Api_GetContainers_Response = {
  items: Web_Api_GetContainers_Response_Items;
};

/**
 * API.
 *
 * @since 1.2.1
 */
export type Web_Api_GetCurrentPrincipal_Returns = Promise<Web_Api_Principal | null>;
export type Web_Api_GetCurrentPrincipal_ResponseValue = unknown;

/**
 * API.
 *
 * @since 1.2.1
 */
export type Web_Api_GetDiagnostics_Returns = Promise<Web_Api_Diagnostics>;

/**
 * API.
 *
 * @since 1.2.1
 */
export type Web_Api_GetHistory_Returns = Promise<Web_Api_Report[]>;
export type Web_Api_GetHistory_Response_Items = Web_Api_Report[];
export type Web_Api_GetHistory_Response = {
  items: Web_Api_GetHistory_Response_Items;
};

/**
 * API.
 *
 * @since 1.2.1
 */
export type Web_Api_GetNotificationEvents_Returns = Promise<Web_Notifications_Event[]>;
export type Web_Api_GetNotificationEvents_Response_Items = Web_Notifications_Event[];
export type Web_Api_GetNotificationEvents_Response = {
  items: Web_Api_GetNotificationEvents_Response_Items;
};

/**
 * API.
 *
 * @since 1.2.1
 */
export type Web_Api_GetNotifications_Returns = Promise<Web_Notifications_Target[]>;
export type Web_Api_GetNotifications_Response_Items = Web_Notifications_Target[];
export type Web_Api_GetNotifications_Response = {
  items: Web_Api_GetNotifications_Response_Items;
};

/**
 * API.
 *
 * @since 1.2.1
 */
export type Web_Api_GetOverview_Returns = Promise<Web_Api_Overview>;

/**
 * API.
 *
 * @since 1.2.1
 */
export type Web_Api_GetRegistries_Returns = Promise<Web_Api_Registry[]>;
export type Web_Api_GetRegistries_Response_Items = Web_Api_Registry[];
export type Web_Api_GetRegistries_Response = {
  items: Web_Api_GetRegistries_Response_Items;
};

/**
 * API.
 *
 * @since 1.2.1
 */
export type Web_Api_GetSettings_Returns = Promise<Web_Api_Settings>;

/**
 * API.
 *
 * @since 1.2.1
 */
export type Web_Api_GetSetupStatus_Returns = Promise<Web_Api_SetupStatus>;

/**
 * API.
 *
 * @since 1.2.1
 */
export type Web_Api_GetTokens_Returns = Promise<Web_Api_Token[]>;
export type Web_Api_GetTokens_Response_Items = Web_Api_Token[];
export type Web_Api_GetTokens_Response = {
  items: Web_Api_GetTokens_Response_Items;
};

/**
 * API.
 *
 * @since 1.2.1
 */
export type Web_Api_IssueFor_CaughtError = unknown;
export type Web_Api_IssueFor_Field = string;
export type Web_Api_IssueFor_Returns = string;
export type Web_Api_IssueFor_Issue = Web_Api_ErrorIssue | undefined;

/**
 * API.
 *
 * @since 1.2.1
 */
export type Web_Api_Login_Returns = Promise<Web_Api_LoginResult>;

/**
 * API.
 *
 * @since 1.2.1
 */
export type Web_Api_LoginResultSchema = Web_Api_Schema<Web_Api_LoginResult>;

/**
 * API.
 *
 * @since 1.2.1
 */
export type Web_Api_Logout_Returns = Promise<void>;

/**
 * API.
 *
 * @since 1.2.1
 */
export type Web_Api_NotificationTargetSchema = Web_Api_Schema<Web_Notifications_Target>;

/**
 * API.
 *
 * @since 1.2.1
 */
export type Web_Api_NotificationTestSchema = Web_Api_Schema<Web_Notifications_TestResult>;

/**
 * API.
 *
 * @since 1.2.1
 */
export type Web_Api_OverviewSchema = Web_Api_Schema<Web_Api_Overview>;

/**
 * API.
 *
 * @since 1.2.1
 */
export type Web_Api_ParseEventData_Data = string;
export type Web_Api_ParseEventData_Returns = unknown;

/**
 * API.
 *
 * @since 1.2.1
 */
export type Web_Api_PasskeyCeremonySchema = Web_Api_Schema<Web_Api_PasskeyCeremony>;

/**
 * API.
 *
 * @since 1.2.1
 */
export type Web_Api_PasskeySchema = Web_Api_Schema<Web_Api_Passkey>;

/**
 * API.
 *
 * @since 1.2.1
 */
export type Web_Api_PreviewBackupImport_Returns = Promise<Web_Backup_ImportPreview>;

/**
 * API.
 *
 * @since 1.2.1
 */
export type Web_Api_PrincipalSchema = Web_Api_Schema<Web_Api_Principal>;

/**
 * API.
 *
 * @since 1.2.1
 */
export type Web_Api_ReadCookie_Name = string;
export type Web_Api_ReadCookie_Returns = string | undefined;
export type Web_Api_ReadCookie_Prefix = string;
export type Web_Api_ReadCookie_Parts = string[];
export type Web_Api_ReadCookie_MatchingPart = string | undefined;

/**
 * API.
 *
 * @since 1.2.1
 */
export type Web_Api_RecoveryCodesSchema = Web_Api_Schema<Web_Api_RecoveryCodes>;

/**
 * API.
 *
 * @since 1.2.1
 */
export type Web_Api_RegenerateRecoveryCodes_Password = string;
export type Web_Api_RegenerateRecoveryCodes_Returns = Promise<Web_Api_RecoveryCodes>;

/**
 * API.
 *
 * @since 1.2.1
 */
export type Web_Api_RegistrySchema = Web_Api_Schema<Web_Api_Registry>;

/**
 * API.
 *
 * @since 1.2.1
 */
export type Web_Api_RemovedSecretSchema = Web_Api_Schema<Web_Api_RemovedSecret>;

/**
 * API.
 *
 * @since 1.2.1
 */
export type Web_Api_RemoveNotification_NotificationId = string;
export type Web_Api_RemoveNotification_Returns = Promise<void>;

/**
 * API.
 *
 * @since 1.2.1
 */
export type Web_Api_RemovePasskey_PasskeyId = string;
export type Web_Api_RemovePasskey_Password = string;
export type Web_Api_RemovePasskey_Returns = Promise<void>;

/**
 * API.
 *
 * @since 1.2.1
 */
export type Web_Api_RemoveRegistry_RegistryId = string;
export type Web_Api_RemoveRegistry_Returns = Promise<void>;

/**
 * API.
 *
 * @since 1.2.1
 */
export type Web_Api_ReportSchema = Web_Api_Schema<Web_Api_Report>;

/**
 * API.
 *
 * @since 1.2.1
 */
export type Web_Api_RequestJson_Path = string;
export type Web_Api_RequestJson_ResponseValue = unknown;

/**
 * API.
 *
 * @since 1.2.1
 */
export type Web_Api_RequestVoid_Path = string;
export type Web_Api_RequestVoid_Returns = Promise<void>;

/**
 * API.
 *
 * @since 1.2.1
 */
export type Web_Api_ResponseError_Returns = Promise<Web_Api_ResponseError_ApiError>;
export type Web_Api_ResponseError_ApiError = Error & {
  readonly code: string;
  readonly issues: Web_Api_ErrorIssue[];
  readonly status: number;
};
export type Web_Api_ResponseError_ResponseValue = unknown;
export type Web_Api_ResponseError_ParsedError = ZodSafeParseResult<Web_Api_ErrorEnvelope>;

/**
 * API.
 *
 * @since 1.2.1
 */
export type Web_Api_RevokeToken_TokenId = string;
export type Web_Api_RevokeToken_Returns = Promise<void>;

/**
 * API.
 *
 * @since 1.2.1
 */
export type Web_Api_RuntimeSettingsSchema = Web_Api_Schema<Web_Api_RuntimeSettings>;

/**
 * API.
 *
 * @since 1.2.1
 */
export type Web_Api_SettingsResponseSchema = Web_Api_Schema<Web_Api_Settings>;

/**
 * API.
 *
 * @since 1.2.1
 */
export type Web_Api_SetupStatusSchema = Web_Api_Schema<Web_Api_SetupStatus>;

/**
 * API.
 *
 * @since 1.2.1
 */
export type Web_Api_SignInWithPasskey_Returns = Promise<Web_Api_AuthenticationResponse>;
export type Web_Api_SignInWithPasskey_Credential = Record<string, unknown>;

/**
 * API.
 *
 * @since 1.2.1
 */
export type Web_Api_StartCheck_ContainerId = string;
export type Web_Api_StartCheck_Returns = Promise<Web_Api_CheckStarted>;

/**
 * API.
 *
 * @since 1.2.1
 */
export type Web_Api_StartTotpSetup_Password = string;
export type Web_Api_StartTotpSetup_Returns = Promise<Web_Api_TotpSetup>;

/**
 * API.
 *
 * @since 1.2.1
 */
export type Web_Api_StartUpdate_ContainerId = string;
export type Web_Api_StartUpdate_Rollback = boolean;
export type Web_Api_StartUpdate_Returns = Promise<Web_Api_CheckStarted>;

/**
 * API.
 *
 * @since 1.2.1
 */
export type Web_Api_SubmitSecondFactor_Challenge = string;
export type Web_Api_SubmitSecondFactor_Code = string;
export type Web_Api_SubmitSecondFactor_Returns = Promise<Web_Api_AuthenticationResponse>;

/**
 * API.
 *
 * @since 1.2.1
 */
export type Web_Api_SummaryFor_CaughtError = unknown;
export type Web_Api_SummaryFor_ShownFields = string[];
export type Web_Api_SummaryFor_Fallback = string;
export type Web_Api_SummaryFor_Returns = string;

/**
 * API.
 *
 * @since 1.2.1
 */
export type Web_Api_TestNotification_NotificationId = string;
export type Web_Api_TestNotification_Returns = Promise<Web_Notifications_TestResult>;

/**
 * API.
 *
 * @since 1.2.1
 */
export type Web_Api_TokenSchema = Web_Api_Schema<Web_Api_Token>;

/**
 * API.
 *
 * @since 1.2.1
 */
export type Web_Api_TotpSetupSchema = Web_Api_Schema<Web_Api_TotpSetup>;

/**
 * API.
 *
 * @since 1.2.1
 */
export type Web_Api_UpdateDiagnostics_Returns = Promise<Web_Api_Diagnostics>;

/**
 * API.
 *
 * @since 1.2.1
 */
export type Web_Api_UpdateNotification_NotificationId = string;
export type Web_Api_UpdateNotification_Returns = Promise<Web_Notifications_Target>;

/**
 * API.
 *
 * @since 1.2.1
 */
export type Web_Api_UpdateRegistry_RegistryId = string;
export type Web_Api_UpdateRegistry_Returns = Promise<Web_Api_Registry>;

/**
 * API.
 *
 * @since 1.2.1
 */
export type Web_Api_UpdateSettings_Returns = Promise<Web_Api_Settings>;

/**
 * API.
 *
 * @since 1.2.1
 */
export type Web_Api_UpdateToken_TokenId = string;
export type Web_Api_UpdateToken_Returns = Promise<Web_Api_Token>;

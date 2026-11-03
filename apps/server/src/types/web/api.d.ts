import type { ZodType } from 'zod';

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
export type Web_Api_ResultStatus = 'available' | 'failed' | 'rolled-back' | 'skipped' | 'up-to-date' | 'updated';

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
};

/**
 * API.
 *
 * @since 1.0.0
 */
export type Web_Api_Report = {
  error?: string | null | undefined;
  finishedAt: string;
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
  id: string;
  image: string;
  lastCheckedAt?: string | null | undefined;
  lastDetail?: string | null | undefined;
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

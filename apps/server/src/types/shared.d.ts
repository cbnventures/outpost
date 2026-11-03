import type { UpdateReport } from 'outpost-package-updater';

import type {
  Lib_Notifications_Service,
  Lib_Notifications_Target,
} from './lib/notifications.d.ts';

/**
 * Shared - Administrator.
 *
 * Defines the safe dashboard account metadata used by sessions and account routes.
 * The password hash never crosses this boundary.
 *
 * @since 1.0.0
 */
export type Shared_Administrator_CreatedAt = string;

export type Shared_Administrator_Id = string;

export type Shared_Administrator_UpdatedAt = string;

export type Shared_Administrator_Username = string;

export type Shared_Administrator = {
  createdAt: Shared_Administrator_CreatedAt;
  id: Shared_Administrator_Id;
  updatedAt: Shared_Administrator_UpdatedAt;
  username: Shared_Administrator_Username;
};

/**
 * Shared - Administrator Passkey.
 *
 * Defines one verified credential as kept by the state and WebAuthn layers.
 * Public summaries leave out the verification key and signature counter.
 *
 * @since 1.0.0
 */
export type Shared_AdministratorPasskey_AdministratorId = string;

export type Shared_AdministratorPasskey_BackedUp = boolean;

export type Shared_AdministratorPasskey_Counter = number;

export type Shared_AdministratorPasskey_CreatedAt = string;

export type Shared_AdministratorPasskey_DeviceType = 'multiDevice' | 'singleDevice';

export type Shared_AdministratorPasskey_Id = string;

export type Shared_AdministratorPasskey_LastUsedAt = string | undefined;

export type Shared_AdministratorPasskey_Name = string;

export type Shared_AdministratorPasskey_PublicKey = Uint8Array<ArrayBuffer>;

export type Shared_AdministratorPasskey_RpId = string | undefined;

export type Shared_AdministratorPasskey_Transport = string;

export type Shared_AdministratorPasskey_Transports = Shared_AdministratorPasskey_Transport[];

export type Shared_AdministratorPasskey = {
  administratorId: Shared_AdministratorPasskey_AdministratorId;
  backedUp: Shared_AdministratorPasskey_BackedUp;
  counter: Shared_AdministratorPasskey_Counter;
  createdAt: Shared_AdministratorPasskey_CreatedAt;
  deviceType: Shared_AdministratorPasskey_DeviceType;
  id: Shared_AdministratorPasskey_Id;
  lastUsedAt?: Shared_AdministratorPasskey_LastUsedAt;
  name: Shared_AdministratorPasskey_Name;
  publicKey: Shared_AdministratorPasskey_PublicKey;
  rpId?: Shared_AdministratorPasskey_RpId;
  transports: Shared_AdministratorPasskey_Transports;
};

export type Shared_AdministratorPasskeys = Shared_AdministratorPasskey[];

/**
 * Shared - Administrator Passkey Summary.
 *
 * Describes one passkey on the security page, with the hostname it belongs to.
 * Keys and counters stay on the server.
 *
 * @since 1.0.0
 */
export type Shared_AdministratorPasskeySummary_CreatedAt = string;

export type Shared_AdministratorPasskeySummary_Hostname = string | null;

export type Shared_AdministratorPasskeySummary_Id = string;

export type Shared_AdministratorPasskeySummary_LastUsedAt = string | null;

export type Shared_AdministratorPasskeySummary_Name = string;

export type Shared_AdministratorPasskeySummary = {
  createdAt: Shared_AdministratorPasskeySummary_CreatedAt;
  hostname: Shared_AdministratorPasskeySummary_Hostname;
  id: Shared_AdministratorPasskeySummary_Id;
  lastUsedAt: Shared_AdministratorPasskeySummary_LastUsedAt;
  name: Shared_AdministratorPasskeySummary_Name;
};

export type Shared_AdministratorPasskeySummaries = Shared_AdministratorPasskeySummary[];

/**
 * Shared - Administrator Security.
 *
 * Summarizes the account's sign-in methods for the security page.
 * Secrets, counters, and verification keys never appear in it.
 *
 * @since 1.0.0
 */
export type Shared_AdministratorSecurity_Passkeys = Shared_AdministratorPasskeySummaries;

export type Shared_AdministratorSecurity_RecoveryCodesRemaining = number;

export type Shared_AdministratorSecurity_TotpEnabled = boolean;

export type Shared_AdministratorSecurity_Username = string;

export type Shared_AdministratorSecurity = {
  passkeys: Shared_AdministratorSecurity_Passkeys;
  recoveryCodesRemaining: Shared_AdministratorSecurity_RecoveryCodesRemaining;
  totpEnabled: Shared_AdministratorSecurity_TotpEnabled;
  username: Shared_AdministratorSecurity_Username;
};

/**
 * Shared - Authenticated Token.
 *
 * Describes the access token that made a request, without its hash.
 * The current-principal route returns it so a script can see which token it uses.
 *
 * @since 1.0.0
 */
export type Shared_AuthenticatedToken_Id = string;

export type Shared_AuthenticatedToken_Name = string;

export type Shared_AuthenticatedToken_Scopes = Shared_PersonalAccessTokenScopes;

export type Shared_AuthenticatedToken = {
  id: Shared_AuthenticatedToken_Id;
  name: Shared_AuthenticatedToken_Name;
  scopes: Shared_AuthenticatedToken_Scopes;
};

/**
 * Shared - Browser Session.
 *
 * Describes one stored browser session after its opaque cookie was verified.
 * Only digests of the session and CSRF values are kept in SQLite.
 *
 * @since 1.0.0
 */
export type Shared_BrowserSession_AdministratorId = string;

export type Shared_BrowserSession_CsrfHash = string;

export type Shared_BrowserSession_ExpiresAt = string;

export type Shared_BrowserSession_Id = string;

export type Shared_BrowserSession_Username = string;

export type Shared_BrowserSession = {
  administratorId: Shared_BrowserSession_AdministratorId;
  csrfHash: Shared_BrowserSession_CsrfHash;
  expiresAt: Shared_BrowserSession_ExpiresAt;
  id: Shared_BrowserSession_Id;
  username: Shared_BrowserSession_Username;
};

/**
 * Shared - Check Report.
 *
 * Extends an update report with what started the check, for the history view.
 * Reports saved before this field existed simply leave it out.
 *
 * @since 1.0.0
 */
export type Shared_CheckTrigger = 'api' | 'dashboard' | 'schedule' | 'startup';

export type Shared_CheckReport_Trigger = Shared_CheckTrigger | undefined;

export type Shared_CheckReport = UpdateReport & {
  trigger?: Shared_CheckReport_Trigger;
};

export type Shared_CheckReports = Shared_CheckReport[];

/**
 * Shared - Runtime Settings.
 *
 * Stores the behavior an administrator can change from the dashboard.
 * Container bootstrap paths stay outside this object because they are needed
 * before Outpost can open its database.
 *
 * @since 1.0.0
 */
export type Shared_RuntimeSettings_Schedule = string;

export type Shared_RuntimeSettings_RunOnStart = boolean;

export type Shared_RuntimeSettings_LabelMode = 'opt-in' | 'opt-out';

export type Shared_RuntimeSettings_MonitorOnly = boolean;

export type Shared_RuntimeSettings_Cleanup = boolean;

export type Shared_RuntimeSettings_StopTimeoutSeconds = number;

export type Shared_RuntimeSettings_HealthTimeoutSeconds = number;

export type Shared_RuntimeSettings_SettleSeconds = number;

export type Shared_RuntimeSettings = {
  schedule: Shared_RuntimeSettings_Schedule;
  runOnStart: Shared_RuntimeSettings_RunOnStart;
  labelMode: Shared_RuntimeSettings_LabelMode;
  monitorOnly: Shared_RuntimeSettings_MonitorOnly;
  cleanup: Shared_RuntimeSettings_Cleanup;
  stopTimeoutSeconds: Shared_RuntimeSettings_StopTimeoutSeconds;
  healthTimeoutSeconds: Shared_RuntimeSettings_HealthTimeoutSeconds;
  settleSeconds: Shared_RuntimeSettings_SettleSeconds;
};

/**
 * Shared - Encrypted Value.
 *
 * Holds one AES-256-GCM sealed secret as Base64URL text for SQLite.
 * A fresh IV is used for every value.
 *
 * @since 1.0.0
 */
export type Shared_EncryptedValue_AuthTag = string;

export type Shared_EncryptedValue_Ciphertext = string;

export type Shared_EncryptedValue_Iv = string;

export type Shared_EncryptedValue = {
  authTag: Shared_EncryptedValue_AuthTag;
  ciphertext: Shared_EncryptedValue_Ciphertext;
  iv: Shared_EncryptedValue_Iv;
};

/**
 * Shared - Error Issue.
 *
 * Points one validation failure at the request field that caused it.
 * The dashboard uses the field name to show the message next to the input.
 *
 * @since 1.0.0
 */
export type Shared_ErrorIssue_Field = string;

export type Shared_ErrorIssue_Message = string;

export type Shared_ErrorIssue_PathSegment = string;

export type Shared_ErrorIssue_Path = Shared_ErrorIssue_PathSegment[];

export type Shared_ErrorIssue = {
  field: Shared_ErrorIssue_Field;
  message: Shared_ErrorIssue_Message;
  path: Shared_ErrorIssue_Path;
};

export type Shared_ErrorIssues = Shared_ErrorIssue[];

/**
 * Shared - Personal Access Token Scope.
 *
 * Names what an access token may do. The list is closed, so a route never
 * accepts a scope string nobody reviewed.
 *
 * @since 1.0.0
 */
export type Shared_PersonalAccessTokenScope = 'metrics:read' | 'status:read' | 'updates:run';

export type Shared_PersonalAccessTokenScopes = Shared_PersonalAccessTokenScope[];

/**
 * Shared - Personal Access Token Summary.
 *
 * Defines the token metadata that can safely leave the server.
 * The stored SHA-256 hash is never part of it.
 *
 * @since 1.0.0
 */
export type Shared_PersonalAccessTokenSummary_CreatedAt = string;

export type Shared_PersonalAccessTokenSummary_ExpiresAt = string | null;

export type Shared_PersonalAccessTokenSummary_Id = string;

export type Shared_PersonalAccessTokenSummary_LastUsedAt = string | null;

export type Shared_PersonalAccessTokenSummary_Name = string;

export type Shared_PersonalAccessTokenSummary_Scopes = Shared_PersonalAccessTokenScopes;

export type Shared_PersonalAccessTokenSummary = {
  createdAt: Shared_PersonalAccessTokenSummary_CreatedAt;
  expiresAt: Shared_PersonalAccessTokenSummary_ExpiresAt;
  id: Shared_PersonalAccessTokenSummary_Id;
  lastUsedAt: Shared_PersonalAccessTokenSummary_LastUsedAt;
  name: Shared_PersonalAccessTokenSummary_Name;
  scopes: Shared_PersonalAccessTokenSummary_Scopes;
};

export type Shared_PersonalAccessTokenSummaries = Shared_PersonalAccessTokenSummary[];

/**
 * Shared - Registry.
 *
 * Describes one private registry sign-in as the API returns it, without its password.
 * A password a lost encryption key removed is flagged so it can be entered again.
 *
 * @since 1.0.0
 */
export type Shared_Registry_CreatedAt = string;

export type Shared_Registry_Id = string;

export type Shared_Registry_PasswordMissing = boolean;

export type Shared_Registry_Registry = string;

export type Shared_Registry_UpdatedAt = string;

export type Shared_Registry_Username = string;

export type Shared_Registry = {
  createdAt: Shared_Registry_CreatedAt;
  id: Shared_Registry_Id;
  passwordMissing: Shared_Registry_PasswordMissing;
  registry: Shared_Registry_Registry;
  updatedAt: Shared_Registry_UpdatedAt;
  username: Shared_Registry_Username;
};

export type Shared_Registries = Shared_Registry[];

/**
 * Shared - Registry Input.
 *
 * Carries the host, username, and password of a new registry sign-in.
 * The password is sealed before it is stored.
 *
 * @since 1.0.0
 */
export type Shared_RegistryInput_Password = string;

export type Shared_RegistryInput_Registry = string;

export type Shared_RegistryInput_Username = string;

export type Shared_RegistryInput = {
  password: Shared_RegistryInput_Password;
  registry: Shared_RegistryInput_Registry;
  username: Shared_RegistryInput_Username;
};

/**
 * Shared - Registry Update.
 *
 * Carries the changes to a registry sign-in.
 * An omitted password keeps the saved one.
 *
 * @since 1.0.0
 */
export type Shared_RegistryUpdate_Password = string | undefined;

export type Shared_RegistryUpdate_Registry = string;

export type Shared_RegistryUpdate_Username = string;

export type Shared_RegistryUpdate = {
  password?: Shared_RegistryUpdate_Password;
  registry: Shared_RegistryUpdate_Registry;
  username: Shared_RegistryUpdate_Username;
};

/**
 * Shared - Removed Secret.
 *
 * Names one saved secret that a lost encryption key took, and when.
 * The dashboard lists these until they are entered again or dismissed.
 *
 * @since 1.0.0
 */
export type Shared_RemovedSecret_Kind = 'authenticator' | 'notification' | 'registry';

export type Shared_RemovedSecret_RemovedAt = string;

export type Shared_RemovedSecret = {
  kind: Shared_RemovedSecret_Kind;
  name?: string;
  notificationId?: string;
  registryId?: string;
  removedAt: Shared_RemovedSecret_RemovedAt;
};

export type Shared_RemovedSecrets = Shared_RemovedSecret[];

/**
 * Shared - Scheduler Event.
 *
 * Announces a change of the scheduler to the server-sent events stream.
 * A finished check carries its report.
 *
 * @since 1.0.0
 */
export type Shared_SchedulerEvent_State_Type = 'state';

export type Shared_SchedulerEvent_State = {
  type: Shared_SchedulerEvent_State_Type;
};

export type Shared_SchedulerEvent_Check_Type = 'check';

export type Shared_SchedulerEvent_Check_Report = Shared_CheckReport;

export type Shared_SchedulerEvent_Check = {
  type: Shared_SchedulerEvent_Check_Type;
  report: Shared_SchedulerEvent_Check_Report;
};

export type Shared_SchedulerEvent = Shared_SchedulerEvent_State | Shared_SchedulerEvent_Check;

export type Shared_SchedulerListener = (event: Shared_SchedulerEvent) => void;

/**
 * Shared - Setup Claim.
 *
 * Holds the digest and expiry of the setup code printed at startup.
 * The code itself only ever appears in the container log.
 *
 * @since 1.0.0
 */
export type Shared_SetupClaim_Digest = string;

export type Shared_SetupClaim_ExpiresAt = number;

export type Shared_SetupClaim = {
  digest: Shared_SetupClaim_Digest;
  expiresAt: Shared_SetupClaim_ExpiresAt;
};

/**
 * Shared - Stored Personal Access Token.
 *
 * Defines one token as the database keeps it, with its name beside the hash.
 * The raw token value is never stored.
 *
 * @since 1.0.0
 */
export type Shared_StoredPersonalAccessToken_CreatedAt = string;

export type Shared_StoredPersonalAccessToken_ExpiresAt = string | undefined;

export type Shared_StoredPersonalAccessToken_Id = string;

export type Shared_StoredPersonalAccessToken_Name = string;

export type Shared_StoredPersonalAccessToken_Scopes = Shared_PersonalAccessTokenScopes;

export type Shared_StoredPersonalAccessToken_TokenHash = string;

export type Shared_StoredPersonalAccessToken = {
  createdAt: Shared_StoredPersonalAccessToken_CreatedAt;
  expiresAt?: Shared_StoredPersonalAccessToken_ExpiresAt;
  id: Shared_StoredPersonalAccessToken_Id;
  name: Shared_StoredPersonalAccessToken_Name;
  scopes: Shared_StoredPersonalAccessToken_Scopes;
  tokenHash: Shared_StoredPersonalAccessToken_TokenHash;
};

export type Shared_StoredPersonalAccessTokens = Shared_StoredPersonalAccessToken[];

/**
 * Shared - Token Input.
 *
 * Carries the name, scopes, and expiry of a token being created or edited.
 * On edit, an omitted expiry keeps the current one and null removes it.
 *
 * @since 1.0.0
 */
export type Shared_TokenInput_ExpiresAt = string | null | undefined;

export type Shared_TokenInput_Name = string;

export type Shared_TokenInput_Scopes = Shared_PersonalAccessTokenScopes;

export type Shared_TokenInput = {
  expiresAt?: Shared_TokenInput_ExpiresAt;
  name: Shared_TokenInput_Name;
  scopes: Shared_TokenInput_Scopes;
};

/**
 * Shared - Verified Passkey Credential.
 *
 * Holds the public fields of a passkey whose registration was verified.
 * The state store keeps them so the passkey can sign in later.
 *
 * @since 1.0.0
 */
export type Shared_VerifiedPasskeyCredential_BackedUp = boolean;

export type Shared_VerifiedPasskeyCredential_Counter = number;

export type Shared_VerifiedPasskeyCredential_DeviceType = Shared_AdministratorPasskey_DeviceType;

export type Shared_VerifiedPasskeyCredential_Id = string;

export type Shared_VerifiedPasskeyCredential_PublicKey = Uint8Array<ArrayBuffer>;

export type Shared_VerifiedPasskeyCredential_Transport = string;

export type Shared_VerifiedPasskeyCredential_Transports = Shared_VerifiedPasskeyCredential_Transport[];

export type Shared_VerifiedPasskeyCredential = {
  backedUp: Shared_VerifiedPasskeyCredential_BackedUp;
  counter: Shared_VerifiedPasskeyCredential_Counter;
  deviceType: Shared_VerifiedPasskeyCredential_DeviceType;
  id: Shared_VerifiedPasskeyCredential_Id;
  publicKey: Shared_VerifiedPasskeyCredential_PublicKey;
  transports: Shared_VerifiedPasskeyCredential_Transports;
};

/**
 * Shared - WebAuthn Configuration.
 *
 * Defines the relying-party values derived from one request's own address.
 * Every passkey ceremony is bound to the hostname it started on.
 *
 * @since 1.0.0
 */
export type Shared_WebauthnConfiguration_Origin = string;

export type Shared_WebauthnConfiguration_RpId = string;

export type Shared_WebauthnConfiguration_RpName = string;

export type Shared_WebauthnConfiguration = {
  origin: Shared_WebauthnConfiguration_Origin;
  rpId: Shared_WebauthnConfiguration_RpId;
  rpName: Shared_WebauthnConfiguration_RpName;
};

/**
 * Shared - Notification Target.
 *
 * Defines a notification destination as the API returns it, without any secret value.
 * Saved secret fields are listed by name, and fields a lost key removed are listed apart.
 *
 * @since 1.0.0
 */
export type Shared_NotificationTarget = {
  createdAt: string;
  events: string[];
  id: string;
  lastAttemptAt: string | null;
  lastError: string | null;
  name: string;
  secrets: Record<string, true>;
  secretsMissing: string[];
  service: Lib_Notifications_Service;
  settings: Record<string, string>;
  updatedAt: string;
};

export type Shared_NotificationTargets = Shared_NotificationTarget[];

export type Shared_NotificationTargetInput = {
  events: string[];
  name: string;
  secrets: Record<string, string>;
  service: Lib_Notifications_Service;
  settings: Record<string, string>;
};

export type Shared_NotificationTargetUpdate = Omit<Shared_NotificationTargetInput, 'service'> & {
  clearSecrets?: string[] | undefined;
};

export type Shared_NotificationDelivery = {
  id: string;
  name: string;
  target: Lib_Notifications_Target;
};

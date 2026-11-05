import type {
  DatabaseSync,
  SQLOutputValue,
  StatementResultingChanges,
} from 'node:sqlite';

import type { RegistryCredentials } from 'outpost-package-registry';
import type { z } from 'zod';

import type {
  legacyAccountFile,
  storedAdministrator,
  storedAdministratorTotp,
  storedNotificationTarget,
  storedRegistryCredential,
  storedRejectedImage,
  storedRemovedSecret,
} from '../../lib/schema.js';
import type {
  Shared_Administrator,
  Shared_AdministratorPasskey,
  Shared_AdministratorPasskey_DeviceType,
  Shared_AdministratorPasskeys,
  Shared_AdministratorSecurity,
  Shared_AuthenticatedToken,
  Shared_BrowserSession,
  Shared_EncryptedValue,
  Shared_NotificationDelivery,
  Shared_NotificationTarget,
  Shared_NotificationTargetInput,
  Shared_NotificationTargets,
  Shared_NotificationTargetUpdate,
  Shared_PersonalAccessTokenScopes,
  Shared_PersonalAccessTokenSummaries,
  Shared_PersonalAccessTokenSummary,
  Shared_Registries,
  Shared_Registry,
  Shared_RegistryInput,
  Shared_RegistryUpdate,
  Shared_RemovedSecrets,
  Shared_RuntimeSettings,
  Shared_SetupClaim,
  Shared_StoredPersonalAccessToken,
  Shared_StoredPersonalAccessTokens,
  Shared_TokenInput,
  Shared_VerifiedPasskeyCredential,
} from '../shared.d.ts';

/**
 * Lib - State - Runner - Authenticate Administrator.
 *
 * @since 1.0.0
 */
export type Lib_State_Runner_AuthenticateAdministrator_Username = string;

export type Lib_State_Runner_AuthenticateAdministrator_Password = string;

export type Lib_State_Runner_AuthenticateAdministrator_Returns = Promise<Shared_Administrator | undefined>;

export type Lib_State_Runner_AuthenticateAdministrator_Administrator = z.infer<typeof storedAdministrator> | undefined;

export type Lib_State_Runner_AuthenticateAdministrator_PasswordHash = string;

export type Lib_State_Runner_AuthenticateAdministrator_IsValid = boolean;

/**
 * Lib - State - Runner - Authenticate Token.
 *
 * @since 1.0.0
 */
export type Lib_State_Runner_AuthenticateToken_PersonalAccessToken = string;

export type Lib_State_Runner_AuthenticateToken_Returns = Shared_AuthenticatedToken | undefined;

export type Lib_State_Runner_AuthenticateToken_MatchedToken = Shared_AuthenticatedToken | undefined;

export type Lib_State_Runner_AuthenticateToken_Result = StatementResultingChanges;

/**
 * Lib - State - Runner - Challenge Duration Milliseconds.
 *
 * @since 1.0.0
 */
export type Lib_State_Runner_ChallengeDurationMilliseconds = number;

/**
 * Lib - State - Runner - Challenge Failure Limit.
 *
 * @since 1.0.0
 */
export type Lib_State_Runner_ChallengeFailureLimit = number;

/**
 * Lib - State - Runner - Change Administrator Password.
 *
 * @since 1.0.0
 */
export type Lib_State_Runner_ChangeAdministratorPassword_Id = string;

export type Lib_State_Runner_ChangeAdministratorPassword_NewPassword = string;

export type Lib_State_Runner_ChangeAdministratorPassword_KeepSessionId = string;

export type Lib_State_Runner_ChangeAdministratorPassword_Returns = Promise<void>;

export type Lib_State_Runner_ChangeAdministratorPassword_PasswordHash = string;

/**
 * Lib - State - Runner - Change Administrator Username.
 *
 * @since 1.0.0
 */
export type Lib_State_Runner_ChangeAdministratorUsername_Id = string;

export type Lib_State_Runner_ChangeAdministratorUsername_Username = string;

export type Lib_State_Runner_ChangeAdministratorUsername_Returns = 'conflict' | 'not-found' | Shared_Administrator;

export type Lib_State_Runner_ChangeAdministratorUsername_Administrator = z.infer<typeof storedAdministrator> | undefined;

export type Lib_State_Runner_ChangeAdministratorUsername_ExistingUsername = z.infer<typeof storedAdministrator> | undefined;

export type Lib_State_Runner_ChangeAdministratorUsername_UpdatedAt = string;

/**
 * Lib - State - Runner - Claim Installation.
 *
 * @since 1.0.0
 */
export type Lib_State_Runner_ClaimInstallation_Code = string;

export type Lib_State_Runner_ClaimInstallation_Username = string;

export type Lib_State_Runner_ClaimInstallation_Password = string;

export type Lib_State_Runner_ClaimInstallation_Returns = Promise<'invalid' | 'unavailable' | Shared_Administrator>;

export type Lib_State_Runner_ClaimInstallation_NormalizedCode = string | undefined;

export type Lib_State_Runner_ClaimInstallation_SetupClaim = Shared_SetupClaim | undefined;

export type Lib_State_Runner_ClaimInstallation_PasswordHash = string;

export type Lib_State_Runner_ClaimInstallation_AdministratorId = string;

export type Lib_State_Runner_ClaimInstallation_CreatedAt = string;

/**
 * Lib - State - Runner - Close.
 *
 * @since 1.0.0
 */
export type Lib_State_Runner_Close_Returns = void;

/**
 * Lib - State - Runner - Confirm Administrator Password.
 *
 * @since 1.0.0
 */
export type Lib_State_Runner_ConfirmAdministratorPassword_Id = string;

export type Lib_State_Runner_ConfirmAdministratorPassword_Password = string;

export type Lib_State_Runner_ConfirmAdministratorPassword_Returns = Promise<boolean>;

export type Lib_State_Runner_ConfirmAdministratorPassword_Administrator = z.infer<typeof storedAdministrator> | undefined;

export type Lib_State_Runner_ConfirmAdministratorPassword_PasswordHash = string;

export type Lib_State_Runner_ConfirmAdministratorPassword_IsValid = boolean;

/**
 * Lib - State - Runner - Constructor.
 *
 * @since 1.0.0
 */
export type Lib_State_Runner_Constructor_DataDirectory = string;

export type Lib_State_Runner_Constructor_Now = () => number;

export type Lib_State_Runner_Constructor_DirectoryMode = number;

export type Lib_State_Runner_Constructor_FileMode = number;

/**
 * Lib - State - Runner - Consume Recovery Code.
 *
 * @since 1.0.0
 */
export type Lib_State_Runner_ConsumeRecoveryCode_AdministratorId = string;

export type Lib_State_Runner_ConsumeRecoveryCode_Code = string;

export type Lib_State_Runner_ConsumeRecoveryCode_Returns = boolean;

export type Lib_State_Runner_ConsumeRecoveryCode_NormalizedCode = string | undefined;

export type Lib_State_Runner_ConsumeRecoveryCode_Result = StatementResultingChanges;

/**
 * Lib - State - Runner - Count Rows.
 *
 * @since 1.0.0
 */
export type Lib_State_Runner_CountRows_Table = 'administrator_totp' | 'administrators' | 'totp_enrollments';

export type Lib_State_Runner_CountRows_Returns = number;

export type Lib_State_Runner_CountRows_Row = Record<string, SQLOutputValue> | undefined;

/**
 * Lib - State - Runner - Create Passkey.
 *
 * @since 1.0.0
 */
export type Lib_State_Runner_CreatePasskey_AdministratorId = string;

export type Lib_State_Runner_CreatePasskey_Name = string;

export type Lib_State_Runner_CreatePasskey_RpId = string;

export type Lib_State_Runner_CreatePasskey_Credential = Shared_VerifiedPasskeyCredential;

export type Lib_State_Runner_CreatePasskey_Returns = 'conflict' | 'created' | 'not-found';

export type Lib_State_Runner_CreatePasskey_Administrator = z.infer<typeof storedAdministrator> | undefined;

export type Lib_State_Runner_CreatePasskey_ExistingPasskey = Record<string, SQLOutputValue> | undefined;

/**
 * Lib - State - Runner - Create Registry.
 *
 * @since 1.0.0
 */
export type Lib_State_Runner_CreateRegistry_Input = Shared_RegistryInput;

export type Lib_State_Runner_CreateRegistry_Returns = Shared_Registry | undefined;

export type Lib_State_Runner_CreateRegistry_Registry = string;

export type Lib_State_Runner_CreateRegistry_ExistingRegistry = Record<string, SQLOutputValue> | undefined;

export type Lib_State_Runner_CreateRegistry_Id = string;

export type Lib_State_Runner_CreateRegistry_Now = string;

export type Lib_State_Runner_CreateRegistry_SealedPassword = Shared_EncryptedValue;

/**
 * Lib - State - Runner - Create Schema.
 *
 * @since 1.0.0
 */
export type Lib_State_Runner_CreateSchema_Returns = void;

export type Lib_State_Runner_CreateSchema_AppliedVersionOne = Record<string, SQLOutputValue> | undefined;

export type Lib_State_Runner_CreateSchema_AppliedVersionTwo = Record<string, SQLOutputValue> | undefined;

/**
 * Lib - State - Runner - Create Session.
 *
 * @since 1.0.0
 */
export type Lib_State_Runner_CreateSession_AdministratorId = string;

export type Lib_State_Runner_CreateSession_IpAddress = string;

export type Lib_State_Runner_CreateSession_UserAgent = string;

export type Lib_State_Runner_CreateSession_Returns_CsrfToken = string;

export type Lib_State_Runner_CreateSession_Returns_ExpiresAt = string;

export type Lib_State_Runner_CreateSession_Returns_SessionId = string;

export type Lib_State_Runner_CreateSession_Returns_SessionToken = string;

export type Lib_State_Runner_CreateSession_Returns = {
  csrfToken: Lib_State_Runner_CreateSession_Returns_CsrfToken;
  expiresAt: Lib_State_Runner_CreateSession_Returns_ExpiresAt;
  sessionId: Lib_State_Runner_CreateSession_Returns_SessionId;
  sessionToken: Lib_State_Runner_CreateSession_Returns_SessionToken;
};

export type Lib_State_Runner_CreateSession_SessionId = string;

export type Lib_State_Runner_CreateSession_SessionToken = string;

export type Lib_State_Runner_CreateSession_CsrfToken = string;

export type Lib_State_Runner_CreateSession_CreatedAt = string;

export type Lib_State_Runner_CreateSession_ExpiresAt = string;

/**
 * Lib - State - Runner - Create Sign In Challenge.
 *
 * @since 1.0.0
 */
export type Lib_State_Runner_CreateSignInChallenge_AdministratorId = string;

export type Lib_State_Runner_CreateSignInChallenge_Returns_Challenge = string;

export type Lib_State_Runner_CreateSignInChallenge_Returns_ExpiresAt = string;

export type Lib_State_Runner_CreateSignInChallenge_Returns = {
  challenge: Lib_State_Runner_CreateSignInChallenge_Returns_Challenge;
  expiresAt: Lib_State_Runner_CreateSignInChallenge_Returns_ExpiresAt;
};

export type Lib_State_Runner_CreateSignInChallenge_Challenge = string;

export type Lib_State_Runner_CreateSignInChallenge_CreatedAt = string;

export type Lib_State_Runner_CreateSignInChallenge_ExpiresAt = string;

/**
 * Lib - State - Runner - Create Token.
 *
 * @since 1.0.0
 */
export type Lib_State_Runner_CreateToken_Input = Shared_TokenInput;

export type Lib_State_Runner_CreateToken_Returns_PersonalAccessToken = string;

export type Lib_State_Runner_CreateToken_Returns_Token = Shared_PersonalAccessTokenSummary;

export type Lib_State_Runner_CreateToken_Returns_Created = {
  personalAccessToken: Lib_State_Runner_CreateToken_Returns_PersonalAccessToken;
  token: Lib_State_Runner_CreateToken_Returns_Token;
};

export type Lib_State_Runner_CreateToken_Returns = Lib_State_Runner_CreateToken_Returns_Created | undefined;

export type Lib_State_Runner_CreateToken_ExistingToken = Record<string, SQLOutputValue> | undefined;

export type Lib_State_Runner_CreateToken_Id = string;

export type Lib_State_Runner_CreateToken_PersonalAccessToken = string;

export type Lib_State_Runner_CreateToken_TokenHash = string;

export type Lib_State_Runner_CreateToken_CreatedAt = string;

export type Lib_State_Runner_CreateToken_Scopes = Shared_PersonalAccessTokenScopes;

/**
 * Lib - State - Runner - Create Webauthn Ceremony.
 *
 * @since 1.0.0
 */
export type Lib_State_Runner_CreateWebauthnCeremony_Ceremony_AdministratorId = string;

export type Lib_State_Runner_CreateWebauthnCeremony_Ceremony_Challenge = string;

export type Lib_State_Runner_CreateWebauthnCeremony_Ceremony_Kind = 'authentication' | 'registration';

export type Lib_State_Runner_CreateWebauthnCeremony_Ceremony_Name = string;

export type Lib_State_Runner_CreateWebauthnCeremony_Ceremony_Origin = string;

export type Lib_State_Runner_CreateWebauthnCeremony_Ceremony_RpId = string;

export type Lib_State_Runner_CreateWebauthnCeremony_Ceremony = {
  administratorId?: Lib_State_Runner_CreateWebauthnCeremony_Ceremony_AdministratorId;
  challenge: Lib_State_Runner_CreateWebauthnCeremony_Ceremony_Challenge;
  kind: Lib_State_Runner_CreateWebauthnCeremony_Ceremony_Kind;
  name?: Lib_State_Runner_CreateWebauthnCeremony_Ceremony_Name;
  origin: Lib_State_Runner_CreateWebauthnCeremony_Ceremony_Origin;
  rpId: Lib_State_Runner_CreateWebauthnCeremony_Ceremony_RpId;
};

export type Lib_State_Runner_CreateWebauthnCeremony_Returns = string;

export type Lib_State_Runner_CreateWebauthnCeremony_CeremonyId = string;

export type Lib_State_Runner_CreateWebauthnCeremony_CreatedAt = string;

export type Lib_State_Runner_CreateWebauthnCeremony_ExpiresAt = string;

/**
 * Lib - State - Runner - Database.
 *
 * @since 1.0.0
 */
export type Lib_State_Runner_Database = DatabaseSync;

/**
 * Lib - State - Runner - Database File Name.
 *
 * @since 1.0.0
 */
export type Lib_State_Runner_DatabaseFileName = string;

/**
 * Lib - State - Runner - Delete Session.
 *
 * @since 1.0.0
 */
export type Lib_State_Runner_DeleteSession_Id = string;

export type Lib_State_Runner_DeleteSession_Returns = void;

/**
 * Lib - State - Runner - Delete Sign In Challenge.
 *
 * @since 1.0.0
 */
export type Lib_State_Runner_DeleteSignInChallenge_Challenge = string;

export type Lib_State_Runner_DeleteSignInChallenge_Returns = void;

/**
 * Lib - State - Runner - Disable Totp.
 *
 * @since 1.0.0
 */
export type Lib_State_Runner_DisableTotp_AdministratorId = string;

export type Lib_State_Runner_DisableTotp_Returns = 'disabled' | 'not-found';

/**
 * Lib - State - Runner - Dismiss Removed Secrets.
 *
 * @since 1.0.0
 */
export type Lib_State_Runner_DismissRemovedSecrets_AdministratorId = string;

export type Lib_State_Runner_DismissRemovedSecrets_Returns = void;

/**
 * Lib - State - Runner - Dummy Password Hash.
 *
 * @since 1.0.0
 */
export type Lib_State_Runner_DummyPasswordHash = string;

/**
 * Lib - State - Runner - Enable Totp.
 *
 * @since 1.0.0
 */
export type Lib_State_Runner_EnableTotp_AdministratorId = string;

export type Lib_State_Runner_EnableTotp_Secret = string;

export type Lib_State_Runner_EnableTotp_InitialStep = number;

export type Lib_State_Runner_EnableTotp_Returns = string[] | undefined;

export type Lib_State_Runner_EnableTotp_Administrator = z.infer<typeof storedAdministrator> | undefined;

export type Lib_State_Runner_EnableTotp_EncryptedSecret = Shared_EncryptedValue;

export type Lib_State_Runner_EnableTotp_CreatedAt = string;

export type Lib_State_Runner_EnableTotp_RecoveryCodes = string[];

/**
 * Lib - State - Runner - Encryption Key.
 *
 * @since 1.0.0
 */
export type Lib_State_Runner_EncryptionKey = string;

/**
 * Lib - State - Runner - Enrollment Duration Milliseconds.
 *
 * @since 1.0.0
 */
export type Lib_State_Runner_EnrollmentDurationMilliseconds = number;

/**
 * Lib - State - Runner - Find Registry Credentials.
 *
 * @since 1.0.0
 */
export type Lib_State_Runner_FindRegistryCredentials_Registry = string;

export type Lib_State_Runner_FindRegistryCredentials_Returns = RegistryCredentials | undefined;

export type Lib_State_Runner_FindRegistryCredentials_Host = string;

export type Lib_State_Runner_FindRegistryCredentials_StoredRegistry = z.infer<typeof storedRegistryCredential> | undefined;

/**
 * Lib - State - Runner - Find Rejected Image.
 *
 * @since 1.0.3
 */
export type Lib_State_Runner_FindRejectedImage_Container = string;

export type Lib_State_Runner_FindRejectedImage_Returns = z.infer<typeof storedRejectedImage> | undefined;

export type Lib_State_Runner_FindRejectedImage_Row = Record<string, SQLOutputValue> | undefined;

/**
 * Lib - State - Runner - Forget Rejected Image.
 *
 * @since 1.0.3
 */
export type Lib_State_Runner_ForgetRejectedImage_Container = string;

export type Lib_State_Runner_ForgetRejectedImage_Returns = void;

/**
 * Lib - State - Runner - Remember Rejected Image.
 *
 * @since 1.0.3
 */
export type Lib_State_Runner_RememberRejectedImage_Container = string;

export type Lib_State_Runner_RememberRejectedImage_ImageId = string;

export type Lib_State_Runner_RememberRejectedImage_Returns = void;

/**
 * Lib - State - Runner - Get Administrator.
 *
 * @since 1.0.0
 */
export type Lib_State_Runner_GetAdministrator_Returns = Shared_Administrator | undefined;

export type Lib_State_Runner_GetAdministrator_Administrator = z.infer<typeof storedAdministrator> | undefined;

/**
 * Lib - State - Runner - Get Administrator By ID.
 *
 * @since 1.0.0
 */
export type Lib_State_Runner_GetAdministratorById_Id = string;

export type Lib_State_Runner_GetAdministratorById_Returns = Shared_Administrator | undefined;

export type Lib_State_Runner_GetAdministratorById_Administrator = z.infer<typeof storedAdministrator> | undefined;

/**
 * Lib - State - Runner - Get Administrator Security.
 *
 * @since 1.0.0
 */
export type Lib_State_Runner_GetAdministratorSecurity_AdministratorId = string;

export type Lib_State_Runner_GetAdministratorSecurity_Returns = Shared_AdministratorSecurity;

export type Lib_State_Runner_GetAdministratorSecurity_Administrator = z.infer<typeof storedAdministrator> | undefined;

export type Lib_State_Runner_GetAdministratorSecurity_Passkeys = Shared_AdministratorPasskeys;

export type Lib_State_Runner_GetAdministratorSecurity_RecoveryCodeRow = Record<string, SQLOutputValue> | undefined;

/**
 * Lib - State - Runner - Get Metadata.
 *
 * @since 1.0.0
 */
export type Lib_State_Runner_GetMetadata_Key = string;

export type Lib_State_Runner_GetMetadata_Returns = string | undefined;

export type Lib_State_Runner_GetMetadata_Row_Value = string;

export type Lib_State_Runner_GetMetadata_Row = {
  value: Lib_State_Runner_GetMetadata_Row_Value;
} | undefined;

/**
 * Lib - State - Runner - Get Passkey.
 *
 * @since 1.0.0
 */
export type Lib_State_Runner_GetPasskey_Id = string;

export type Lib_State_Runner_GetPasskey_Returns = Shared_AdministratorPasskey | undefined;

/**
 * Lib - State - Runner - Get Passkeys.
 *
 * @since 1.0.0
 */
export type Lib_State_Runner_GetPasskeys_AdministratorId = string;

export type Lib_State_Runner_GetPasskeys_Returns = Shared_AdministratorPasskeys;

export type Lib_State_Runner_GetPasskeys_Row_AdministratorId = string;

export type Lib_State_Runner_GetPasskeys_Row_BackedUp = number;

export type Lib_State_Runner_GetPasskeys_Row_Counter = number;

export type Lib_State_Runner_GetPasskeys_Row_CreatedAt = string;

export type Lib_State_Runner_GetPasskeys_Row_DeviceType = string;

export type Lib_State_Runner_GetPasskeys_Row_Id = string;

export type Lib_State_Runner_GetPasskeys_Row_LastUsedAt = string | null;

export type Lib_State_Runner_GetPasskeys_Row_Name = string;

export type Lib_State_Runner_GetPasskeys_Row_PublicKey = Uint8Array;

export type Lib_State_Runner_GetPasskeys_Row_RpId = string | null;

export type Lib_State_Runner_GetPasskeys_Row_Transports = string;

export type Lib_State_Runner_GetPasskeys_Row = {
  administratorId: Lib_State_Runner_GetPasskeys_Row_AdministratorId;
  backedUp: Lib_State_Runner_GetPasskeys_Row_BackedUp;
  counter: Lib_State_Runner_GetPasskeys_Row_Counter;
  createdAt: Lib_State_Runner_GetPasskeys_Row_CreatedAt;
  deviceType: Lib_State_Runner_GetPasskeys_Row_DeviceType;
  id: Lib_State_Runner_GetPasskeys_Row_Id;
  lastUsedAt: Lib_State_Runner_GetPasskeys_Row_LastUsedAt;
  name: Lib_State_Runner_GetPasskeys_Row_Name;
  publicKey: Lib_State_Runner_GetPasskeys_Row_PublicKey;
  rpId: Lib_State_Runner_GetPasskeys_Row_RpId;
  transports: Lib_State_Runner_GetPasskeys_Row_Transports;
};

export type Lib_State_Runner_GetPasskeys_Rows = Lib_State_Runner_GetPasskeys_Row[];

export type Lib_State_Runner_GetPasskeys_Transports = unknown;

/**
 * Lib - State - Runner - Get Registries.
 *
 * @since 1.0.0
 */
export type Lib_State_Runner_GetRegistries_Returns = Shared_Registries;

/**
 * Lib - State - Runner - Get Removed Secrets.
 *
 * @since 1.0.0
 */
export type Lib_State_Runner_GetRemovedSecrets_AdministratorId = string;

export type Lib_State_Runner_GetRemovedSecrets_Returns = Shared_RemovedSecrets;

export type Lib_State_Runner_GetRemovedSecrets_Rows = Record<string, SQLOutputValue>[];

/**
 * Lib - State - Runner - Get Runtime Settings.
 *
 * @since 1.0.0
 */
export type Lib_State_Runner_GetRuntimeSettings_Defaults = Shared_RuntimeSettings;

export type Lib_State_Runner_GetRuntimeSettings_Returns = Shared_RuntimeSettings;

export type Lib_State_Runner_GetRuntimeSettings_Stored = string | undefined;

export type Lib_State_Runner_GetRuntimeSettings_ParsedDefaults = Shared_RuntimeSettings;

/**
 * Lib - State - Runner - Get Session.
 *
 * @since 1.0.0
 */
export type Lib_State_Runner_GetSession_SessionToken = string;

export type Lib_State_Runner_GetSession_Returns = Shared_BrowserSession | undefined;

export type Lib_State_Runner_GetSession_Now = string;

export type Lib_State_Runner_GetSession_Row_AdministratorId = string;

export type Lib_State_Runner_GetSession_Row_CsrfHash = string;

export type Lib_State_Runner_GetSession_Row_ExpiresAt = string;

export type Lib_State_Runner_GetSession_Row_Id = string;

export type Lib_State_Runner_GetSession_Row_LastSeenAt = string;

export type Lib_State_Runner_GetSession_Row_Username = string;

export type Lib_State_Runner_GetSession_Row = {
  administratorId: Lib_State_Runner_GetSession_Row_AdministratorId;
  csrfHash: Lib_State_Runner_GetSession_Row_CsrfHash;
  expiresAt: Lib_State_Runner_GetSession_Row_ExpiresAt;
  id: Lib_State_Runner_GetSession_Row_Id;
  lastSeenAt: Lib_State_Runner_GetSession_Row_LastSeenAt;
  username: Lib_State_Runner_GetSession_Row_Username;
} | undefined;

export type Lib_State_Runner_GetSession_SeenBefore = string;

/**
 * Lib - State - Runner - Get Setup Status.
 *
 * @since 1.0.0
 */
export type Lib_State_Runner_GetSetupStatus_Returns_ClaimExpiresAt = string;

export type Lib_State_Runner_GetSetupStatus_Returns_ClaimRequired = boolean;

export type Lib_State_Runner_GetSetupStatus_Returns = {
  claimExpiresAt?: Lib_State_Runner_GetSetupStatus_Returns_ClaimExpiresAt;
  claimRequired: Lib_State_Runner_GetSetupStatus_Returns_ClaimRequired;
};

/**
 * Lib - State - Runner - Get Sign In Challenge.
 *
 * @since 1.0.0
 */
export type Lib_State_Runner_GetSignInChallenge_Challenge = string;

export type Lib_State_Runner_GetSignInChallenge_Returns_AdministratorId = string;

export type Lib_State_Runner_GetSignInChallenge_Returns_Challenge = {
  administratorId: Lib_State_Runner_GetSignInChallenge_Returns_AdministratorId;
};

export type Lib_State_Runner_GetSignInChallenge_Returns = Lib_State_Runner_GetSignInChallenge_Returns_Challenge | undefined;

export type Lib_State_Runner_GetSignInChallenge_Row_AdministratorId = string;

export type Lib_State_Runner_GetSignInChallenge_Row = {
  administratorId: Lib_State_Runner_GetSignInChallenge_Row_AdministratorId;
} | undefined;

/**
 * Lib - State - Runner - Get Stored Administrator.
 *
 * @since 1.0.0
 */
export type Lib_State_Runner_GetStoredAdministrator_Id = string;

export type Lib_State_Runner_GetStoredAdministrator_Username = string;

export type Lib_State_Runner_GetStoredAdministrator_Returns = z.infer<typeof storedAdministrator> | undefined;

export type Lib_State_Runner_GetStoredAdministrator_Row = Record<string, SQLOutputValue> | undefined;

/**
 * Lib - State - Runner - Get Stored Registry Credentials.
 *
 * @since 1.0.0
 */
export type Lib_State_Runner_GetStoredRegistryCredentials_Returns = z.infer<typeof storedRegistryCredential>[];

export type Lib_State_Runner_GetStoredRegistryCredentials_Rows = Record<string, SQLOutputValue>[];

/**
 * Lib - State - Runner - Get Stored Token Last Used Times.
 *
 * @since 1.0.0
 */
export type Lib_State_Runner_GetStoredTokenLastUsedTimes_TokenId = string;

export type Lib_State_Runner_GetStoredTokenLastUsedTimes_LastUsedAt = string | null;

export type Lib_State_Runner_GetStoredTokenLastUsedTimes_Returns = Map<Lib_State_Runner_GetStoredTokenLastUsedTimes_TokenId, Lib_State_Runner_GetStoredTokenLastUsedTimes_LastUsedAt>;

export type Lib_State_Runner_GetStoredTokenLastUsedTimes_Row_Id = string;

export type Lib_State_Runner_GetStoredTokenLastUsedTimes_Row_LastUsedAt = string | null;

export type Lib_State_Runner_GetStoredTokenLastUsedTimes_Row = {
  id: Lib_State_Runner_GetStoredTokenLastUsedTimes_Row_Id;
  lastUsedAt: Lib_State_Runner_GetStoredTokenLastUsedTimes_Row_LastUsedAt;
};

export type Lib_State_Runner_GetStoredTokenLastUsedTimes_Rows = Lib_State_Runner_GetStoredTokenLastUsedTimes_Row[];

/**
 * Lib - State - Runner - Get Stored Tokens.
 *
 * @since 1.0.0
 */
export type Lib_State_Runner_GetStoredTokens_Returns = Shared_StoredPersonalAccessTokens;

export type Lib_State_Runner_GetStoredTokens_Row_CreatedAt = string;

export type Lib_State_Runner_GetStoredTokens_Row_ExpiresAt = string | null;

export type Lib_State_Runner_GetStoredTokens_Row_Id = string;

export type Lib_State_Runner_GetStoredTokens_Row_LastUsedAt = string | null;

export type Lib_State_Runner_GetStoredTokens_Row_Name = string;

export type Lib_State_Runner_GetStoredTokens_Row_TokenHash = string;

export type Lib_State_Runner_GetStoredTokens_Row = {
  createdAt: Lib_State_Runner_GetStoredTokens_Row_CreatedAt;
  expiresAt: Lib_State_Runner_GetStoredTokens_Row_ExpiresAt;
  id: Lib_State_Runner_GetStoredTokens_Row_Id;
  lastUsedAt: Lib_State_Runner_GetStoredTokens_Row_LastUsedAt;
  name: Lib_State_Runner_GetStoredTokens_Row_Name;
  tokenHash: Lib_State_Runner_GetStoredTokens_Row_TokenHash;
};

export type Lib_State_Runner_GetStoredTokens_Rows = Lib_State_Runner_GetStoredTokens_Row[];

export type Lib_State_Runner_GetStoredTokens_ScopeRow_Scope = string;

export type Lib_State_Runner_GetStoredTokens_ScopeRow = {
  scope: Lib_State_Runner_GetStoredTokens_ScopeRow_Scope;
};

export type Lib_State_Runner_GetStoredTokens_ScopeRows = Lib_State_Runner_GetStoredTokens_ScopeRow[];

export type Lib_State_Runner_GetStoredTokens_Scopes = string[];

/**
 * Lib - State - Runner - Get Tokens.
 *
 * @since 1.0.0
 */
export type Lib_State_Runner_GetTokens_Returns = Shared_PersonalAccessTokenSummaries;

export type Lib_State_Runner_GetTokens_LastUsedTimes_TokenId = string;

export type Lib_State_Runner_GetTokens_LastUsedTimes_LastUsedAt = string | null;

export type Lib_State_Runner_GetTokens_LastUsedTimes = Map<Lib_State_Runner_GetTokens_LastUsedTimes_TokenId, Lib_State_Runner_GetTokens_LastUsedTimes_LastUsedAt>;

/**
 * Lib - State - Runner - Get Token Scopes.
 *
 * @since 1.0.0
 */
export type Lib_State_Runner_GetTokenScopes_Id = string;

export type Lib_State_Runner_GetTokenScopes_Returns = Shared_PersonalAccessTokenScopes | undefined;

export type Lib_State_Runner_GetTokenScopes_Token = Shared_StoredPersonalAccessToken | undefined;

/**
 * Lib - State - Runner - Get Totp Enrollment.
 *
 * @since 1.0.0
 */
export type Lib_State_Runner_GetTotpEnrollment_AdministratorId = string;

export type Lib_State_Runner_GetTotpEnrollment_Returns = string | undefined;

export type Lib_State_Runner_GetTotpEnrollment_Row = Shared_EncryptedValue | undefined;

/**
 * Lib - State - Runner - Get Webauthn Rp Name.
 *
 * @since 1.0.0
 */
export type Lib_State_Runner_GetWebauthnRpName_Returns = string;

/**
 * Lib - State - Runner - Has Administrator.
 *
 * @since 1.0.0
 */
export type Lib_State_Runner_HasAdministrator_Returns = boolean;

/**
 * Lib - State - Runner - Has Encrypted Data.
 *
 * @since 1.0.0
 */
export type Lib_State_Runner_HasEncryptedData_Returns = boolean;

/**
 * Lib - State - Runner - Has Session.
 *
 * @since 1.0.0
 */
export type Lib_State_Runner_HasSession_Id = string;

export type Lib_State_Runner_HasSession_Returns = boolean;

export type Lib_State_Runner_HasSession_Row = Record<string, SQLOutputValue> | undefined;

/**
 * Lib - State - Runner - Has Totp.
 *
 * @since 1.0.0
 */
export type Lib_State_Runner_HasTotp_AdministratorId = string;

export type Lib_State_Runner_HasTotp_Returns = boolean;

export type Lib_State_Runner_HasTotp_Row = Record<string, SQLOutputValue> | undefined;

/**
 * Lib - State - Runner - Import Legacy Account.
 *
 * @since 1.0.0
 */
export type Lib_State_Runner_ImportLegacyAccount_Returns = void;

export type Lib_State_Runner_ImportLegacyAccount_Account = z.infer<typeof legacyAccountFile> | undefined;

export type Lib_State_Runner_ImportLegacyAccount_CreatedAt = string;

export type Lib_State_Runner_ImportLegacyAccount_ErrorMessage = string;

/**
 * Lib - State - Runner - Insert Recovery Codes.
 *
 * @since 1.0.0
 */
export type Lib_State_Runner_InsertRecoveryCodes_AdministratorId = string;

export type Lib_State_Runner_InsertRecoveryCodes_RecoveryCodes = string[];

export type Lib_State_Runner_InsertRecoveryCodes_CreatedAt = string;

export type Lib_State_Runner_InsertRecoveryCodes_Returns = void;

/**
 * Lib - State - Runner - Key Check Value.
 *
 * @since 1.0.0
 */
export type Lib_State_Runner_KeyCheckValue = string;

/**
 * Lib - State - Runner - Key Path.
 *
 * @since 1.0.0
 */
export type Lib_State_Runner_KeyPath = string;

/**
 * Lib - State - Runner - Key Was Missing.
 *
 * @since 1.0.0
 */
export type Lib_State_Runner_KeyWasMissing = boolean;

export type Lib_State_Runner_KeyReplacement = string[];

export type Lib_State_Runner_GetKeyReplacement_Returns = string[];

/**
 * Lib - State - Runner - Legacy Account Path.
 *
 * @since 1.0.0
 */
export type Lib_State_Runner_LegacyAccountPath = string;

/**
 * Lib - State - Runner - Now.
 *
 * @since 1.0.0
 */
export type Lib_State_Runner_Now = () => number;

/**
 * Lib - State - Runner - Prepare Setup Claim.
 *
 * @since 1.0.0
 */
export type Lib_State_Runner_PrepareSetupClaim_Returns_Code = string;

export type Lib_State_Runner_PrepareSetupClaim_Returns_ExpiresAt = string;

export type Lib_State_Runner_PrepareSetupClaim_Returns_Claim = {
  code: Lib_State_Runner_PrepareSetupClaim_Returns_Code;
  expiresAt: Lib_State_Runner_PrepareSetupClaim_Returns_ExpiresAt;
};

export type Lib_State_Runner_PrepareSetupClaim_Returns = Lib_State_Runner_PrepareSetupClaim_Returns_Claim | undefined;

export type Lib_State_Runner_PrepareSetupClaim_Code = string;

export type Lib_State_Runner_PrepareSetupClaim_ExpiresAt = number;

/**
 * Lib - State - Runner - Prune Expired.
 *
 * @since 1.0.0
 */
export type Lib_State_Runner_PruneExpired_Returns = void;

export type Lib_State_Runner_PruneExpired_Now = string;

/**
 * Lib - State - Runner - Record Sign In Challenge Failure.
 *
 * @since 1.0.0
 */
export type Lib_State_Runner_RecordSignInChallengeFailure_Challenge = string;

export type Lib_State_Runner_RecordSignInChallengeFailure_Returns = boolean;

export type Lib_State_Runner_RecordSignInChallengeFailure_ChallengeHash = string;

export type Lib_State_Runner_RecordSignInChallengeFailure_Result = StatementResultingChanges;

/**
 * Lib - State - Runner - Remove Passkey.
 *
 * @since 1.0.0
 */
export type Lib_State_Runner_RemovePasskey_AdministratorId = string;

export type Lib_State_Runner_RemovePasskey_Id = string;

export type Lib_State_Runner_RemovePasskey_Returns = 'not-found' | 'removed';

export type Lib_State_Runner_RemovePasskey_Passkey = Shared_AdministratorPasskey | undefined;

/**
 * Lib - State - Runner - Remove Registry.
 *
 * @since 1.0.0
 */
export type Lib_State_Runner_RemoveRegistry_Id = string;

export type Lib_State_Runner_RemoveRegistry_Returns = 'not-found' | 'removed';

export type Lib_State_Runner_RemoveRegistry_ExistingRegistry = Record<string, SQLOutputValue> | undefined;

/**
 * Lib - State - Runner - Remove Token.
 *
 * @since 1.0.0
 */
export type Lib_State_Runner_RemoveToken_Id = string;

export type Lib_State_Runner_RemoveToken_Returns = 'not-found' | 'removed';

export type Lib_State_Runner_RemoveToken_ExistingToken = Record<string, SQLOutputValue> | undefined;

/**
 * Lib - State - Runner - Remove Locked Secrets.
 *
 * @since 1.0.0
 */
export type Lib_State_Runner_RemoveLockedSecrets_Returns = string[];

export type Lib_State_Runner_RemoveLockedSecrets_RemovedAt = string;

export type Lib_State_Runner_RemoveLockedSecrets_Administrator_Id = string;

export type Lib_State_Runner_RemoveLockedSecrets_Administrator_Username = string;

export type Lib_State_Runner_RemoveLockedSecrets_Administrator = {
  id: Lib_State_Runner_RemoveLockedSecrets_Administrator_Id;
  username: Lib_State_Runner_RemoveLockedSecrets_Administrator_Username;
};

export type Lib_State_Runner_RemoveLockedSecrets_Administrators = Lib_State_Runner_RemoveLockedSecrets_Administrator[];

/**
 * Lib - State - Runner - Replace Recovery Codes.
 *
 * @since 1.0.0
 */
export type Lib_State_Runner_ReplaceRecoveryCodes_AdministratorId = string;

export type Lib_State_Runner_ReplaceRecoveryCodes_Returns = string[] | undefined;

export type Lib_State_Runner_ReplaceRecoveryCodes_RecoveryCodes = string[];

export type Lib_State_Runner_ReplaceRecoveryCodes_CreatedAt = string;

/**
 * Lib - State - Runner - Resolve Encryption Key.
 *
 * @since 1.0.0
 */
export type Lib_State_Runner_ResolveEncryptionKey_Returns = string;

export type Lib_State_Runner_ResolveEncryptionKey_StoredKey = string;

/**
 * Lib - State - Runner - Save Encryption Key.
 *
 * @since 1.0.0
 */
export type Lib_State_Runner_SaveEncryptionKey_Returns = void;

export type Lib_State_Runner_SaveEncryptionKey_KeyFile = number;

/**
 * Lib - State - Runner - Session Duration Milliseconds.
 *
 * @since 1.0.0
 */
export type Lib_State_Runner_SessionDurationMilliseconds = number;

/**
 * Lib - State - Runner - Session Seen Interval Milliseconds.
 *
 * @since 1.0.0
 */
export type Lib_State_Runner_SessionSeenIntervalMilliseconds = number;

/**
 * Lib - State - Runner - Set Metadata.
 *
 * @since 1.0.0
 */
export type Lib_State_Runner_SetMetadata_Key = string;

export type Lib_State_Runner_SetMetadata_Value = string;

export type Lib_State_Runner_SetMetadata_Returns = void;

/**
 * Lib - State - Runner - Set Runtime Settings.
 *
 * @since 1.0.0
 */
export type Lib_State_Runner_SetRuntimeSettings_Settings = Shared_RuntimeSettings;

export type Lib_State_Runner_SetRuntimeSettings_Returns = void;

export type Lib_State_Runner_SetRuntimeSettings_Checked = Shared_RuntimeSettings;

/**
 * Lib - State - Runner - Setup Claim.
 *
 * @since 1.0.0
 */
export type Lib_State_Runner_SetupClaim = Shared_SetupClaim | undefined;

/**
 * Lib - State - Runner - Setup Claim Duration Milliseconds.
 *
 * @since 1.0.0
 */
export type Lib_State_Runner_SetupClaimDurationMilliseconds = number;

/**
 * Lib - State - Runner - Start Totp Enrollment.
 *
 * @since 1.0.0
 */
export type Lib_State_Runner_StartTotpEnrollment_AdministratorId = string;

export type Lib_State_Runner_StartTotpEnrollment_Secret = string;

export type Lib_State_Runner_StartTotpEnrollment_Returns = string;

export type Lib_State_Runner_StartTotpEnrollment_EncryptedSecret = Shared_EncryptedValue;

export type Lib_State_Runner_StartTotpEnrollment_CreatedAt = string;

export type Lib_State_Runner_StartTotpEnrollment_ExpiresAt = string;

/**
 * Lib - State - Runner - Take Webauthn Ceremony.
 *
 * @since 1.0.0
 */
export type Lib_State_Runner_TakeWebauthnCeremony_CeremonyId = string;

export type Lib_State_Runner_TakeWebauthnCeremony_Kind = 'authentication' | 'registration';

export type Lib_State_Runner_TakeWebauthnCeremony_Returns_AdministratorId = string;

export type Lib_State_Runner_TakeWebauthnCeremony_Returns_Challenge = string;

export type Lib_State_Runner_TakeWebauthnCeremony_Returns_Name = string;

export type Lib_State_Runner_TakeWebauthnCeremony_Returns_Origin = string;

export type Lib_State_Runner_TakeWebauthnCeremony_Returns_RpId = string;

export type Lib_State_Runner_TakeWebauthnCeremony_Returns_Ceremony = {
  administratorId?: Lib_State_Runner_TakeWebauthnCeremony_Returns_AdministratorId;
  challenge: Lib_State_Runner_TakeWebauthnCeremony_Returns_Challenge;
  name?: Lib_State_Runner_TakeWebauthnCeremony_Returns_Name;
  origin: Lib_State_Runner_TakeWebauthnCeremony_Returns_Origin;
  rpId: Lib_State_Runner_TakeWebauthnCeremony_Returns_RpId;
};

export type Lib_State_Runner_TakeWebauthnCeremony_Returns = Lib_State_Runner_TakeWebauthnCeremony_Returns_Ceremony | undefined;

export type Lib_State_Runner_TakeWebauthnCeremony_Row_AdministratorId = string | null;

export type Lib_State_Runner_TakeWebauthnCeremony_Row_Challenge = string;

export type Lib_State_Runner_TakeWebauthnCeremony_Row_ExpiresAt = string;

export type Lib_State_Runner_TakeWebauthnCeremony_Row_Name = string | null;

export type Lib_State_Runner_TakeWebauthnCeremony_Row_Origin = string;

export type Lib_State_Runner_TakeWebauthnCeremony_Row_RpId = string;

export type Lib_State_Runner_TakeWebauthnCeremony_Row = {
  administratorId: Lib_State_Runner_TakeWebauthnCeremony_Row_AdministratorId;
  challenge: Lib_State_Runner_TakeWebauthnCeremony_Row_Challenge;
  expiresAt: Lib_State_Runner_TakeWebauthnCeremony_Row_ExpiresAt;
  name: Lib_State_Runner_TakeWebauthnCeremony_Row_Name;
  origin: Lib_State_Runner_TakeWebauthnCeremony_Row_Origin;
  rpId: Lib_State_Runner_TakeWebauthnCeremony_Row_RpId;
} | undefined;

/**
 * Lib - State - Runner - Timestamp.
 *
 * @since 1.0.0
 */
export type Lib_State_Runner_Timestamp_OffsetMilliseconds = number;

export type Lib_State_Runner_Timestamp_Returns = string;

/**
 * Lib - State - Runner - Transaction.
 *
 * @since 1.0.0
 */
export type Lib_State_Runner_Transaction_Callback = () => void;

export type Lib_State_Runner_Transaction_Returns = void;

/**
 * Lib - State - Runner - Update Passkey Usage.
 *
 * @since 1.0.0
 */
export type Lib_State_Runner_UpdatePasskeyUsage_Id = string;

export type Lib_State_Runner_UpdatePasskeyUsage_Counter = number;

export type Lib_State_Runner_UpdatePasskeyUsage_DeviceType = Shared_AdministratorPasskey_DeviceType;

export type Lib_State_Runner_UpdatePasskeyUsage_BackedUp = boolean;

export type Lib_State_Runner_UpdatePasskeyUsage_RpId = string;

export type Lib_State_Runner_UpdatePasskeyUsage_Returns = 'conflict' | 'not-found' | 'updated';

export type Lib_State_Runner_UpdatePasskeyUsage_Passkey = Shared_AdministratorPasskey | undefined;

export type Lib_State_Runner_UpdatePasskeyUsage_Result = StatementResultingChanges;

/**
 * Lib - State - Runner - Update Registry.
 *
 * @since 1.0.0
 */
export type Lib_State_Runner_UpdateRegistry_Id = string;

export type Lib_State_Runner_UpdateRegistry_Input = Shared_RegistryUpdate;

export type Lib_State_Runner_UpdateRegistry_Returns = Shared_Registry | 'not-found' | 'registry-taken';

export type Lib_State_Runner_UpdateRegistry_ExistingRegistry = Record<string, SQLOutputValue> | undefined;

export type Lib_State_Runner_UpdateRegistry_Registry = string;

export type Lib_State_Runner_UpdateRegistry_ConflictingRegistry = Record<string, SQLOutputValue> | undefined;

export type Lib_State_Runner_UpdateRegistry_SealedPassword = Shared_EncryptedValue | undefined;

export type Lib_State_Runner_UpdateRegistry_UpdatedAt = string;

/**
 * Lib - State - Runner - Update Token.
 *
 * @since 1.0.0
 */
export type Lib_State_Runner_UpdateToken_Id = string;

export type Lib_State_Runner_UpdateToken_Input = Shared_TokenInput;

export type Lib_State_Runner_UpdateToken_Returns = 'name-taken' | 'not-found' | Shared_PersonalAccessTokenSummary;

export type Lib_State_Runner_UpdateToken_ExistingToken = Shared_StoredPersonalAccessToken | undefined;

export type Lib_State_Runner_UpdateToken_ConflictingToken = Record<string, SQLOutputValue> | undefined;

export type Lib_State_Runner_UpdateToken_Scopes = Shared_PersonalAccessTokenScopes;

export type Lib_State_Runner_UpdateToken_ExpiresAt = string | undefined;

export type Lib_State_Runner_UpdateToken_Summary = Shared_PersonalAccessTokenSummary | undefined;

/**
 * Lib - State - Runner - Verify Encryption Key.
 *
 * @since 1.0.0
 */
export type Lib_State_Runner_VerifyEncryptionKey_Returns = void;

export type Lib_State_Runner_VerifyEncryptionKey_RemovedSecrets = string[];

export type Lib_State_Runner_VerifyEncryptionKey_KeyCheck = string | undefined;

export type Lib_State_Runner_VerifyEncryptionKey_KeyCheckValue = string;

export type Lib_State_Runner_VerifyEncryptionKey_TotpRow = Shared_EncryptedValue | undefined;

export type Lib_State_Runner_VerifyEncryptionKey_EnrollmentRow = Shared_EncryptedValue | undefined;

/**
 * Lib - State - Runner - Verify Totp.
 *
 * @since 1.0.0
 */
export type Lib_State_Runner_VerifyTotp_AdministratorId = string;

export type Lib_State_Runner_VerifyTotp_Code = string;

export type Lib_State_Runner_VerifyTotp_Now = number;

export type Lib_State_Runner_VerifyTotp_Returns = boolean;

export type Lib_State_Runner_VerifyTotp_Row = Record<string, SQLOutputValue> | undefined;

export type Lib_State_Runner_VerifyTotp_StoredTotp = z.infer<typeof storedAdministratorTotp>;

export type Lib_State_Runner_VerifyTotp_Secret = string;

export type Lib_State_Runner_VerifyTotp_MatchedStep = number | undefined;

export type Lib_State_Runner_VerifyTotp_Result = StatementResultingChanges;

/**
 * Lib - State - Runner - Webauthn Ceremony Duration Milliseconds.
 *
 * @since 1.0.0
 */
export type Lib_State_Runner_WebauthnCeremonyDurationMilliseconds = number;

/**
 * Lib - State - Runner - Webauthn Rp Name.
 *
 * @since 1.0.0
 */
export type Lib_State_Runner_WebauthnRpName = string;

export type Lib_State_Runner_StoredNotificationTarget = Omit<ReturnType<typeof storedNotificationTarget.parse>, 'events' | 'missingSecrets' | 'secretFields' | 'settings'> & {
  events: string[];
  missingSecrets: string[];
  secretFields: string[];
  settings: Record<string, string>;
};

export type Lib_State_Runner_CreateSchema_AppliedVersionThree = Record<string, SQLOutputValue> | undefined;

export type Lib_State_Runner_CreateSchema_AppliedVersionFour = Record<string, SQLOutputValue> | undefined;

export type Lib_State_Runner_CreateSchema_AppliedVersionFive = Record<string, SQLOutputValue> | undefined;

export type Lib_State_Runner_GetRemovedSecrets_RemovedSecret = ReturnType<typeof storedRemovedSecret.parse>;

export type Lib_State_Runner_RemoveLockedSecrets_NotificationRows = {
  id: string;
  missingSecrets: string;
  name: string;
  secretFields: string;
}[];

export type Lib_State_Runner_RemoveLockedSecrets_MissingSecrets = string[];

export type Lib_State_Runner_RemoveLockedSecrets_RegistryRow_Id = string;

export type Lib_State_Runner_RemoveLockedSecrets_RegistryRow_Registry = string;

export type Lib_State_Runner_RemoveLockedSecrets_RegistryRow = {
  id: Lib_State_Runner_RemoveLockedSecrets_RegistryRow_Id;
  registry: Lib_State_Runner_RemoveLockedSecrets_RegistryRow_Registry;
};

export type Lib_State_Runner_RemoveLockedSecrets_RegistryRows = Lib_State_Runner_RemoveLockedSecrets_RegistryRow[];

export type Lib_State_Runner_CreateNotificationTarget_Input = Shared_NotificationTargetInput;

export type Lib_State_Runner_CreateNotificationTarget_Returns = Shared_NotificationTarget | undefined;

export type Lib_State_Runner_CreateNotificationTarget_ExistingTarget = Record<string, unknown> | undefined;

export type Lib_State_Runner_CreateNotificationTarget_Id = string;

export type Lib_State_Runner_CreateNotificationTarget_Now = string;

export type Lib_State_Runner_CreateNotificationTarget_SealedSecrets = Shared_EncryptedValue | undefined;

export type Lib_State_Runner_GetNotificationDeliveries_Event = string;

export type Lib_State_Runner_GetNotificationDeliveries_Returns = Shared_NotificationDelivery[];

export type Lib_State_Runner_GetNotificationDelivery_Id = string;

export type Lib_State_Runner_GetNotificationDelivery_Returns = Shared_NotificationDelivery | 'not-found' | 'secrets-missing';

export type Lib_State_Runner_GetNotificationDelivery_Target = Lib_State_Runner_StoredNotificationTarget | undefined;

export type Lib_State_Runner_GetNotificationTargets_Returns = Shared_NotificationTargets;

export type Lib_State_Runner_GetStoredNotificationTargets_Returns = Lib_State_Runner_StoredNotificationTarget[];

export type Lib_State_Runner_GetStoredNotificationTargets_Rows = Record<string, unknown>[];

export type Lib_State_Runner_GetStoredNotificationTargets_Target = ReturnType<typeof storedNotificationTarget.parse>;

export type Lib_State_Runner_OpenNotificationSecrets_Target = Lib_State_Runner_StoredNotificationTarget;

export type Lib_State_Runner_OpenNotificationSecrets_Returns = Record<string, string>;

export type Lib_State_Runner_RecordNotificationAttempt_Id = string;

export type Lib_State_Runner_RecordNotificationAttempt_ErrorMessage = string | null;

export type Lib_State_Runner_RecordNotificationAttempt_Returns = void;

export type Lib_State_Runner_RemoveNotificationTarget_Id = string;

export type Lib_State_Runner_RemoveNotificationTarget_Returns = 'not-found' | 'removed';

export type Lib_State_Runner_RemoveNotificationTarget_ExistingTarget = {
  name: string;
} | undefined;

export type Lib_State_Runner_SealNotificationSecrets_Secrets = Record<string, string>;

export type Lib_State_Runner_SealNotificationSecrets_Returns = Shared_EncryptedValue | undefined;

export type Lib_State_Runner_UpdateNotificationTarget_Id = string;

export type Lib_State_Runner_UpdateNotificationTarget_Input = Shared_NotificationTargetUpdate;

export type Lib_State_Runner_UpdateNotificationTarget_Returns = Shared_NotificationTarget | 'name-taken' | 'not-found';

export type Lib_State_Runner_UpdateNotificationTarget_ExistingTarget = Lib_State_Runner_StoredNotificationTarget | undefined;

export type Lib_State_Runner_UpdateNotificationTarget_ConflictingTarget = Record<string, unknown> | undefined;

export type Lib_State_Runner_UpdateNotificationTarget_Secrets = Record<string, string>;

export type Lib_State_Runner_UpdateNotificationTarget_ClearSecrets = string[];

export type Lib_State_Runner_UpdateNotificationTarget_MissingSecrets = string[];

export type Lib_State_Runner_UpdateNotificationTarget_SealedSecrets = Shared_EncryptedValue | undefined;

export type Lib_State_Runner_WantsNotification_Events = string[];

export type Lib_State_Runner_WantsNotification_Returns = boolean;

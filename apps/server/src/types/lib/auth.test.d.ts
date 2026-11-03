import type { Request } from 'express';

import type {
  Shared_EncryptedValue,
  Shared_StoredPersonalAccessTokens,
} from '../shared.d.ts';

/**
 * Lib - Auth - Administrator Passwords - Hashes Passwords With Scrypt And Independent Salts.
 *
 * @since 1.0.0
 */
export type Lib_Auth_AdministratorPasswords_HashesPasswordsWithScryptAndIndependentSalts_FirstPasswordHash = string;

export type Lib_Auth_AdministratorPasswords_HashesPasswordsWithScryptAndIndependentSalts_SecondPasswordHash = string;

/**
 * Lib - Auth - Administrator Passwords - Verifies Hashes From The Account File.
 *
 * @since 1.0.0
 */
export type Lib_Auth_AdministratorPasswords_VerifiesHashesFromTheAccountFile_Salt = Buffer;

export type Lib_Auth_AdministratorPasswords_VerifiesHashesFromTheAccountFile_DerivedKey = Buffer;

export type Lib_Auth_AdministratorPasswords_VerifiesHashesFromTheAccountFile_LegacyHash = string;

/**
 * Lib - Auth - Create Request.
 *
 * @since 1.0.0
 */
export type Lib_Auth_CreateRequest_Authorization = string | undefined;

export type Lib_Auth_CreateRequest_Returns = Request;

export type Lib_Auth_CreateRequest_Unknown = unknown;

export type Lib_Auth_CreateRequest_Request = Request;

/**
 * Lib - Auth - Credential Encryption - Encrypts Secrets With Authenticated Random Nonces.
 *
 * @since 1.0.0
 */
export type Lib_Auth_CredentialEncryption_EncryptsSecretsWithAuthenticatedRandomNonces_EncryptionKey = string;

export type Lib_Auth_CredentialEncryption_EncryptsSecretsWithAuthenticatedRandomNonces_FirstEncryptedCredential = Shared_EncryptedValue;

export type Lib_Auth_CredentialEncryption_EncryptsSecretsWithAuthenticatedRandomNonces_SecondEncryptedCredential = Shared_EncryptedValue;

/**
 * Lib - Auth - Personal Access Token.
 *
 * @since 1.0.0
 */
export type Lib_Auth_PersonalAccessToken = string;

/**
 * Lib - Auth - Personal Access Token Authentication - Generates Unique Tokens With The Documented Shape.
 *
 * @since 1.0.0
 */
export type Lib_Auth_PersonalAccessTokenAuthentication_GeneratesUniqueTokensWithTheDocumentedShape_FirstPersonalAccessToken = string;

export type Lib_Auth_PersonalAccessTokenAuthentication_GeneratesUniqueTokensWithTheDocumentedShape_SecondPersonalAccessToken = string;

/**
 * Lib - Auth - Personal Access Tokens.
 *
 * @since 1.0.0
 */
export type Lib_Auth_PersonalAccessTokens = Shared_StoredPersonalAccessTokens;

/**
 * Lib - Auth - Setup And Recovery Codes - Generates Readable Setup Codes And Accepts Them Typed Loosely.
 *
 * @since 1.0.0
 */
export type Lib_Auth_SetupAndRecoveryCodes_GeneratesReadableSetupCodesAndAcceptsThemTypedLoosely_SetupCode = string;

/**
 * Lib - Auth - Setup And Recovery Codes - Generates Ten Unique Recovery Codes That Survive Spaces And Dashes.
 *
 * @since 1.0.0
 */
export type Lib_Auth_SetupAndRecoveryCodes_GeneratesTenUniqueRecoveryCodesThatSurviveSpacesAndDashes_RecoveryCodes = string[];

import type { CipherGCM, DecipherGCM } from 'node:crypto';

import type { Request } from 'express';

import type {
  Shared_AuthenticatedToken,
  Shared_EncryptedValue,
  Shared_PersonalAccessTokenScope,
  Shared_StoredPersonalAccessToken,
  Shared_StoredPersonalAccessTokens,
} from '../shared.d.ts';

/**
 * Lib - Auth - Authenticate Raw Personal Access Token.
 *
 * @since 1.0.0
 */
export type Lib_Auth_AuthenticateRawPersonalAccessToken_PersonalAccessTokens = Shared_StoredPersonalAccessTokens;

export type Lib_Auth_AuthenticateRawPersonalAccessToken_PersonalAccessToken = string;

export type Lib_Auth_AuthenticateRawPersonalAccessToken_Now = Date;

export type Lib_Auth_AuthenticateRawPersonalAccessToken_Returns = Shared_AuthenticatedToken | undefined;

export type Lib_Auth_AuthenticateRawPersonalAccessToken_ProvidedTokenHash = string;

export type Lib_Auth_AuthenticateRawPersonalAccessToken_ProvidedTokenHashBuffer = Buffer;

export type Lib_Auth_AuthenticateRawPersonalAccessToken_MatchedToken = Shared_StoredPersonalAccessToken | undefined;

export type Lib_Auth_AuthenticateRawPersonalAccessToken_ExpectedTokenHashBuffer = Buffer;

export type Lib_Auth_AuthenticateRawPersonalAccessToken_IsMatch = boolean;

export type Lib_Auth_AuthenticateRawPersonalAccessToken_ExpiresAt = number;

/**
 * Lib - Auth - Code Alphabet.
 *
 * @since 1.0.0
 */
export type Lib_Auth_CodeAlphabet = string;

/**
 * Lib - Auth - Create Dummy Password Hash.
 *
 * @since 1.0.0
 */
export type Lib_Auth_CreateDummyPasswordHash_Returns = string;

/**
 * Lib - Auth - Decrypt Credential.
 *
 * @since 1.0.0
 */
export type Lib_Auth_DecryptCredential_EncryptedCredential = Shared_EncryptedValue;

export type Lib_Auth_DecryptCredential_EncryptionKey = string;

export type Lib_Auth_DecryptCredential_Returns = string;

export type Lib_Auth_DecryptCredential_Key = Buffer;

export type Lib_Auth_DecryptCredential_Iv = Buffer;

export type Lib_Auth_DecryptCredential_AuthTag = Buffer;

export type Lib_Auth_DecryptCredential_Ciphertext = Buffer;

export type Lib_Auth_DecryptCredential_Cipher = DecipherGCM;

export type Lib_Auth_DecryptCredential_Plaintext = Buffer;

/**
 * Lib - Auth - Derive Key.
 *
 * @since 1.0.0
 */
export type Lib_Auth_DeriveKey_Password = string;

export type Lib_Auth_DeriveKey_Salt = Buffer;

export type Lib_Auth_DeriveKey_Returns = Promise<Buffer>;

/**
 * Lib - Auth - Digests Equal.
 *
 * @since 1.0.0
 */
export type Lib_Auth_DigestsEqual_Left = string;

export type Lib_Auth_DigestsEqual_Right = string;

export type Lib_Auth_DigestsEqual_Returns = boolean;

export type Lib_Auth_DigestsEqual_LeftBuffer = Buffer;

export type Lib_Auth_DigestsEqual_RightBuffer = Buffer;

/**
 * Lib - Auth - Digest Value.
 *
 * @since 1.0.0
 */
export type Lib_Auth_DigestValue_Value = string;

export type Lib_Auth_DigestValue_Returns = string;

/**
 * Lib - Auth - Encrypt Credential.
 *
 * @since 1.0.0
 */
export type Lib_Auth_EncryptCredential_Credential = string;

export type Lib_Auth_EncryptCredential_EncryptionKey = string;

export type Lib_Auth_EncryptCredential_Returns = Shared_EncryptedValue;

export type Lib_Auth_EncryptCredential_Key = Buffer;

export type Lib_Auth_EncryptCredential_Iv = Buffer;

export type Lib_Auth_EncryptCredential_Cipher = CipherGCM;

export type Lib_Auth_EncryptCredential_Ciphertext = Buffer;

export type Lib_Auth_EncryptCredential_AuthTag = Buffer;

/**
 * Lib - Auth - Generate Code.
 *
 * @since 1.0.0
 */
export type Lib_Auth_GenerateCode_Length = number;

export type Lib_Auth_GenerateCode_Returns = string;

export type Lib_Auth_GenerateCode_RandomValue = Buffer;

/**
 * Lib - Auth - Generate Encryption Key.
 *
 * @since 1.0.0
 */
export type Lib_Auth_GenerateEncryptionKey_Returns = string;

/**
 * Lib - Auth - Generate Opaque Token.
 *
 * @since 1.0.0
 */
export type Lib_Auth_GenerateOpaqueToken_Prefix = string;

export type Lib_Auth_GenerateOpaqueToken_ByteLength = number;

export type Lib_Auth_GenerateOpaqueToken_Returns = string;

/**
 * Lib - Auth - Generate Personal Access Token.
 *
 * @since 1.0.0
 */
export type Lib_Auth_GeneratePersonalAccessToken_Returns = string;

export type Lib_Auth_GeneratePersonalAccessToken_RandomValue = string;

/**
 * Lib - Auth - Generate Recovery Codes.
 *
 * @since 1.0.0
 */
export type Lib_Auth_GenerateRecoveryCodes_Returns = string[];

export type Lib_Auth_GenerateRecoveryCodes_Codes = string[];

export type Lib_Auth_GenerateRecoveryCodes_Code = string;

/**
 * Lib - Auth - Generate Setup Code.
 *
 * @since 1.0.0
 */
export type Lib_Auth_GenerateSetupCode_Returns = string;

export type Lib_Auth_GenerateSetupCode_Code = string;

/**
 * Lib - Auth - Get Bearer Token.
 *
 * @since 1.0.0
 */
export type Lib_Auth_GetBearerToken_Request = Request;

export type Lib_Auth_GetBearerToken_Returns = string | undefined;

export type Lib_Auth_GetBearerToken_AuthorizationHeader = string | undefined;

export type Lib_Auth_GetBearerToken_AuthorizationPattern = RegExp;

export type Lib_Auth_GetBearerToken_Match = RegExpMatchArray | null;

/**
 * Lib - Auth - Hash Administrator Password.
 *
 * @since 1.0.0
 */
export type Lib_Auth_HashAdministratorPassword_Password = string;

export type Lib_Auth_HashAdministratorPassword_Returns = Promise<string>;

export type Lib_Auth_HashAdministratorPassword_Salt = Buffer;

export type Lib_Auth_HashAdministratorPassword_DerivedKey = Buffer;

/**
 * Lib - Auth - Hash Personal Access Token.
 *
 * @since 1.0.0
 */
export type Lib_Auth_HashPersonalAccessToken_PersonalAccessToken = string;

export type Lib_Auth_HashPersonalAccessToken_Returns = string;

/**
 * Lib - Auth - Has Personal Access Token Scope.
 *
 * @since 1.0.0
 */
export type Lib_Auth_HasPersonalAccessTokenScope_PersonalAccessToken = Shared_AuthenticatedToken;

export type Lib_Auth_HasPersonalAccessTokenScope_Scope = Shared_PersonalAccessTokenScope;

export type Lib_Auth_HasPersonalAccessTokenScope_Returns = boolean;

/**
 * Lib - Auth - Normalize Recovery Code.
 *
 * @since 1.0.0
 */
export type Lib_Auth_NormalizeRecoveryCode_Value = string;

export type Lib_Auth_NormalizeRecoveryCode_Returns = string | undefined;

export type Lib_Auth_NormalizeRecoveryCode_Normalized = string;

/**
 * Lib - Auth - Normalize Setup Code.
 *
 * @since 1.0.0
 */
export type Lib_Auth_NormalizeSetupCode_Value = string;

export type Lib_Auth_NormalizeSetupCode_Returns = string | undefined;

export type Lib_Auth_NormalizeSetupCode_Characters = string;

export type Lib_Auth_NormalizeSetupCode_Normalized = string;

/**
 * Lib - Auth - Password Parameters.
 *
 * @since 1.0.0
 */
export type Lib_Auth_PasswordParameters_BlockSize = number;

export type Lib_Auth_PasswordParameters_Cost = number;

export type Lib_Auth_PasswordParameters_KeyLength = number;

export type Lib_Auth_PasswordParameters_Maxmem = number;

export type Lib_Auth_PasswordParameters_Parallelization = number;

export type Lib_Auth_PasswordParameters_SaltLength = number;

export type Lib_Auth_PasswordParameters = {
  blockSize: Lib_Auth_PasswordParameters_BlockSize;
  cost: Lib_Auth_PasswordParameters_Cost;
  keyLength: Lib_Auth_PasswordParameters_KeyLength;
  maxmem: Lib_Auth_PasswordParameters_Maxmem;
  parallelization: Lib_Auth_PasswordParameters_Parallelization;
  saltLength: Lib_Auth_PasswordParameters_SaltLength;
};

/**
 * Lib - Auth - Verify Administrator Password.
 *
 * @since 1.0.0
 */
export type Lib_Auth_VerifyAdministratorPassword_Password = string;

export type Lib_Auth_VerifyAdministratorPassword_PasswordHash = string;

export type Lib_Auth_VerifyAdministratorPassword_Returns = Promise<boolean>;

export type Lib_Auth_VerifyAdministratorPassword_Parts = string[];

export type Lib_Auth_VerifyAdministratorPassword_Salt = Buffer;

export type Lib_Auth_VerifyAdministratorPassword_ExpectedKey = Buffer;

export type Lib_Auth_VerifyAdministratorPassword_DerivedKey = Buffer;

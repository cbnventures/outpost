import { randomBytes, scryptSync } from 'node:crypto';

import {
  describe,
  expect,
  it,
} from 'vitest';

import { personalAccessTokenPattern, setupCodePattern } from '../regex.js';
import {
  authenticateRawPersonalAccessToken,
  createDummyPasswordHash,
  decryptCredential,
  digestsEqual,
  digestValue,
  encryptCredential,
  generatePersonalAccessToken,
  generateRecoveryCodes,
  generateSetupCode,
  getBearerToken,
  hashAdministratorPassword,
  hashPersonalAccessToken,
  hasPersonalAccessTokenScope,
  normalizeRecoveryCode,
  normalizeSetupCode,
  verifyAdministratorPassword,
} from './auth.js';

import type {
  Lib_Auth_AdministratorPasswords_HashesPasswordsWithScryptAndIndependentSalts_FirstPasswordHash,
  Lib_Auth_AdministratorPasswords_HashesPasswordsWithScryptAndIndependentSalts_SecondPasswordHash,
  Lib_Auth_AdministratorPasswords_VerifiesHashesFromTheAccountFile_DerivedKey,
  Lib_Auth_AdministratorPasswords_VerifiesHashesFromTheAccountFile_LegacyHash,
  Lib_Auth_AdministratorPasswords_VerifiesHashesFromTheAccountFile_Salt,
  Lib_Auth_CreateRequest_Authorization,
  Lib_Auth_CreateRequest_Request,
  Lib_Auth_CreateRequest_Returns,
  Lib_Auth_CreateRequest_Unknown,
  Lib_Auth_CredentialEncryption_EncryptsSecretsWithAuthenticatedRandomNonces_EncryptionKey,
  Lib_Auth_CredentialEncryption_EncryptsSecretsWithAuthenticatedRandomNonces_FirstEncryptedCredential,
  Lib_Auth_CredentialEncryption_EncryptsSecretsWithAuthenticatedRandomNonces_SecondEncryptedCredential,
  Lib_Auth_PersonalAccessToken,
  Lib_Auth_PersonalAccessTokenAuthentication_GeneratesUniqueTokensWithTheDocumentedShape_FirstPersonalAccessToken,
  Lib_Auth_PersonalAccessTokenAuthentication_GeneratesUniqueTokensWithTheDocumentedShape_SecondPersonalAccessToken,
  Lib_Auth_PersonalAccessTokens,
  Lib_Auth_SetupAndRecoveryCodes_GeneratesReadableSetupCodesAndAcceptsThemTypedLoosely_SetupCode,
  Lib_Auth_SetupAndRecoveryCodes_GeneratesTenUniqueRecoveryCodesThatSurviveSpacesAndDashes_RecoveryCodes,
} from '../types/lib/auth.test.d.ts';

/**
 * Lib - Auth - Personal Access Token.
 *
 * Uses one deterministic token to check hashing, expiry, and scopes.
 * The raw value is never written to a snapshot or the log.
 *
 * @since 1.0.0
 */
const personalAccessToken: Lib_Auth_PersonalAccessToken = `outpost_${'A'.repeat(43)}`;

/**
 * Lib - Auth - Personal Access Tokens.
 *
 * Holds the stored record of the fixture token, with two of the three scopes.
 * Only its hash is kept, as in the database.
 *
 * @since 1.0.0
 */
const personalAccessTokens: Lib_Auth_PersonalAccessTokens = [{
  createdAt: '2026-10-25T00:00:00.000Z',
  id: 'tok-0123456789abcdef',
  name: 'Home Assistant',
  scopes: [
    'status:read',
    'updates:run',
  ],
  tokenHash: hashPersonalAccessToken(personalAccessToken),
}];

/**
 * Lib - Auth - Create Request.
 *
 * Creates the smallest Express request shape needed to read the Authorization header.
 * The fake keeps these tests independent from a network listener.
 *
 * @param {Lib_Auth_CreateRequest_Authorization} authorization - Authorization.
 *
 * @returns {Lib_Auth_CreateRequest_Returns}
 *
 * @since 1.0.0
 */
function createRequest(authorization: Lib_Auth_CreateRequest_Authorization): Lib_Auth_CreateRequest_Returns {
  return {
    get: () => {
      return authorization;
    },
  } as Lib_Auth_CreateRequest_Unknown as Lib_Auth_CreateRequest_Request;
}

/**
 * Lib - Auth - Personal Access Token Authentication.
 *
 * Checks Bearer extraction, hash matching, expiry, the token shape, and
 * the exact-scope check.
 *
 * @since 1.0.0
 */
describe('personal access token authentication', () => {
  it('extracts a well-formed Bearer token in any scheme case', () => {
    expect(getBearerToken(createRequest(`Bearer ${personalAccessToken}`))).toBe(personalAccessToken);

    expect(getBearerToken(createRequest(`bearer  ${personalAccessToken}`))).toBe(personalAccessToken);

    return;
  });

  it.each([
    undefined,
    '',
    `Basic ${personalAccessToken}`,
    'Bearer outpost_too-short',
    `Bearer pfa_${'A'.repeat(43)}`,
  ])('ignores an absent, foreign, or malformed authorization header', (authorization) => {
    expect(getBearerToken(createRequest(authorization))).toBeUndefined();

    return;
  });

  it('authenticates a raw token without returning its hash', () => {
    expect(authenticateRawPersonalAccessToken(personalAccessTokens, personalAccessToken)).toEqual({
      id: 'tok-0123456789abcdef',
      name: 'Home Assistant',
      scopes: [
        'status:read',
        'updates:run',
      ],
    });

    expect(authenticateRawPersonalAccessToken(personalAccessTokens, 'outpost_too-short')).toBeUndefined();

    expect(authenticateRawPersonalAccessToken(personalAccessTokens, `outpost_${'B'.repeat(43)}`)).toBeUndefined();

    return;
  });

  it('rejects an expired token', () => {
    expect(authenticateRawPersonalAccessToken([{
      createdAt: '2026-10-25T00:00:00.000Z',
      expiresAt: '2026-10-26T00:00:00.000Z',
      id: 'tok-0123456789abcdef',
      name: 'Home Assistant',
      scopes: ['status:read'],
      tokenHash: hashPersonalAccessToken(personalAccessToken),
    }], personalAccessToken, new Date('2026-10-26T00:00:00.000Z'))).toBeUndefined();

    return;
  });

  it('hashes tokens deterministically with SHA-256', () => {
    expect(hashPersonalAccessToken(personalAccessToken)).toBe('5a40308ae84350705e8a044d6fc18f38c60ed930cdc9efe680d2807c0e62b68e');

    expect(digestValue(personalAccessToken)).toBe(hashPersonalAccessToken(personalAccessToken));

    expect(digestsEqual(digestValue('a'), digestValue('a'))).toBe(true);

    expect(digestsEqual(digestValue('a'), digestValue('b'))).toBe(false);

    expect(digestsEqual('short', digestValue('a'))).toBe(false);

    return;
  });

  it('generates unique tokens with the documented shape', () => {
    const firstPersonalAccessToken: Lib_Auth_PersonalAccessTokenAuthentication_GeneratesUniqueTokensWithTheDocumentedShape_FirstPersonalAccessToken = generatePersonalAccessToken();
    const secondPersonalAccessToken: Lib_Auth_PersonalAccessTokenAuthentication_GeneratesUniqueTokensWithTheDocumentedShape_SecondPersonalAccessToken = generatePersonalAccessToken();

    expect(firstPersonalAccessToken).toMatch(personalAccessTokenPattern);

    expect(secondPersonalAccessToken).toMatch(personalAccessTokenPattern);

    expect(secondPersonalAccessToken).not.toBe(firstPersonalAccessToken);

    return;
  });

  it('requires an exact granted scope', () => {
    expect(hasPersonalAccessTokenScope({
      id: 'tok-0123456789abcdef',
      name: 'Home Assistant',
      scopes: ['status:read'],
    }, 'status:read')).toBe(true);

    expect(hasPersonalAccessTokenScope({
      id: 'tok-0123456789abcdef',
      name: 'Home Assistant',
      scopes: ['status:read'],
    }, 'metrics:read')).toBe(false);

    return;
  });

  return;
});

/**
 * Lib - Auth - Administrator Passwords.
 *
 * Checks the scrypt hash format kept from the account file, salt independence,
 * verification, and that malformed hashes never match.
 *
 * @since 1.0.0
 */
describe('administrator passwords', () => {
  it('hashes passwords with scrypt and independent salts', async () => {
    const firstPasswordHash: Lib_Auth_AdministratorPasswords_HashesPasswordsWithScryptAndIndependentSalts_FirstPasswordHash = await hashAdministratorPassword('fixture admin password');
    const secondPasswordHash: Lib_Auth_AdministratorPasswords_HashesPasswordsWithScryptAndIndependentSalts_SecondPasswordHash = await hashAdministratorPassword('fixture admin password');

    expect(firstPasswordHash.startsWith('scrypt$32768$8$1$')).toBe(true);

    expect(firstPasswordHash).not.toBe(secondPasswordHash);

    expect(await verifyAdministratorPassword('fixture admin password', firstPasswordHash)).toBe(true);

    expect(await verifyAdministratorPassword('wrong password guess', firstPasswordHash)).toBe(false);

    expect(await verifyAdministratorPassword('fixture admin password', createDummyPasswordHash())).toBe(false);

    return;
  });

  it('verifies hashes from the account file', async () => {
    const salt: Lib_Auth_AdministratorPasswords_VerifiesHashesFromTheAccountFile_Salt = randomBytes(16);
    const derivedKey: Lib_Auth_AdministratorPasswords_VerifiesHashesFromTheAccountFile_DerivedKey = scryptSync('fixture admin password', salt, 64, {
      N: 32768,
      maxmem: 64 * 1024 * 1024,
      p: 1,
      r: 8,
    });
    const legacyHash: Lib_Auth_AdministratorPasswords_VerifiesHashesFromTheAccountFile_LegacyHash = `scrypt$32768$8$1$${salt.toString('base64url')}$${derivedKey.toString('base64url')}`;

    expect(await verifyAdministratorPassword('fixture admin password', legacyHash)).toBe(true);

    expect(await verifyAdministratorPassword('wrong password guess', legacyHash)).toBe(false);

    return;
  });

  it.each([
    'malformed',
    '$argon2id$v=19$m=65536,t=3,p=2$c2FsdHNhbHRzYWx0c2FsdA$aGFzaGhhc2hoYXNoaGFzaA',
    'scrypt$1$8$1$AAAA$AAAA',
    `scrypt$32768$8$1$${'A'.repeat(22)}$${'A'.repeat(80)}`,
  ])('rejects a malformed stored hash', async (passwordHash) => {
    expect(await verifyAdministratorPassword('fixture admin password', passwordHash)).toBe(false);

    return;
  });

  return;
});

/**
 * Lib - Auth - Setup And Recovery Codes.
 *
 * Checks the readable code formats and that people may type them with any
 * letter case, spaces, or missing dashes.
 *
 * @since 1.0.0
 */
describe('setup and recovery codes', () => {
  it('generates readable setup codes and accepts them typed loosely', () => {
    const setupCode: Lib_Auth_SetupAndRecoveryCodes_GeneratesReadableSetupCodesAndAcceptsThemTypedLoosely_SetupCode = generateSetupCode();

    expect(setupCode).toMatch(setupCodePattern);

    expect(normalizeSetupCode(setupCode.toLowerCase())).toBe(setupCode);

    expect(normalizeSetupCode(setupCode.replaceAll('-', ''))).toBe(setupCode);

    expect(normalizeSetupCode(` ${setupCode.replaceAll('-', ' ')} `)).toBe(setupCode);

    expect(normalizeSetupCode('ABCDE-FGHIJ-KLMNO')).toBeUndefined();

    expect(normalizeSetupCode('ABCDE')).toBeUndefined();

    return;
  });

  it('generates ten unique recovery codes that survive spaces and dashes', () => {
    const recoveryCodes: Lib_Auth_SetupAndRecoveryCodes_GeneratesTenUniqueRecoveryCodesThatSurviveSpacesAndDashes_RecoveryCodes = generateRecoveryCodes();

    expect(recoveryCodes).toHaveLength(10);

    expect(new Set(recoveryCodes).size).toBe(10);

    for (const recoveryCode of recoveryCodes) {
      expect(normalizeRecoveryCode(recoveryCode.toLowerCase())).toBe(recoveryCode.replace('-', ''));
    }

    expect(normalizeRecoveryCode('123456')).toBeUndefined();

    return;
  });

  return;
});

/**
 * Lib - Auth - Credential Encryption.
 *
 * Checks that authenticator secrets are sealed with a fresh nonce each time
 * and that a different key cannot open them.
 *
 * @since 1.0.0
 */
describe('credential encryption', () => {
  it('encrypts secrets with authenticated random nonces', () => {
    const encryptionKey: Lib_Auth_CredentialEncryption_EncryptsSecretsWithAuthenticatedRandomNonces_EncryptionKey = 'd'.repeat(64);
    const firstEncryptedCredential: Lib_Auth_CredentialEncryption_EncryptsSecretsWithAuthenticatedRandomNonces_FirstEncryptedCredential = encryptCredential('GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ', encryptionKey);
    const secondEncryptedCredential: Lib_Auth_CredentialEncryption_EncryptsSecretsWithAuthenticatedRandomNonces_SecondEncryptedCredential = encryptCredential('GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ', encryptionKey);

    expect(firstEncryptedCredential['ciphertext']).not.toContain('GEZDGNBVGY3TQOJQ');

    expect(firstEncryptedCredential).not.toEqual(secondEncryptedCredential);

    expect(decryptCredential(firstEncryptedCredential, encryptionKey)).toBe('GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ');

    expect(() => decryptCredential(firstEncryptedCredential, 'e'.repeat(64))).toThrow();

    return;
  });

  return;
});

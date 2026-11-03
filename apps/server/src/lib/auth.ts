import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
  scrypt,
  timingSafeEqual,
} from 'node:crypto';

import {
  bearerAuthorizationPattern,
  personalAccessTokenPattern,
  recoveryCodePattern,
  scryptPasswordHashPattern,
  setupCodePattern,
  whitespacePattern,
} from '../regex.js';

import type {
  Lib_Auth_AuthenticateRawPersonalAccessToken_ExpectedTokenHashBuffer,
  Lib_Auth_AuthenticateRawPersonalAccessToken_ExpiresAt,
  Lib_Auth_AuthenticateRawPersonalAccessToken_IsMatch,
  Lib_Auth_AuthenticateRawPersonalAccessToken_MatchedToken,
  Lib_Auth_AuthenticateRawPersonalAccessToken_Now,
  Lib_Auth_AuthenticateRawPersonalAccessToken_PersonalAccessToken,
  Lib_Auth_AuthenticateRawPersonalAccessToken_PersonalAccessTokens,
  Lib_Auth_AuthenticateRawPersonalAccessToken_ProvidedTokenHash,
  Lib_Auth_AuthenticateRawPersonalAccessToken_ProvidedTokenHashBuffer,
  Lib_Auth_AuthenticateRawPersonalAccessToken_Returns,
  Lib_Auth_CodeAlphabet,
  Lib_Auth_CreateDummyPasswordHash_Returns,
  Lib_Auth_DecryptCredential_AuthTag,
  Lib_Auth_DecryptCredential_Cipher,
  Lib_Auth_DecryptCredential_Ciphertext,
  Lib_Auth_DecryptCredential_EncryptedCredential,
  Lib_Auth_DecryptCredential_EncryptionKey,
  Lib_Auth_DecryptCredential_Iv,
  Lib_Auth_DecryptCredential_Key,
  Lib_Auth_DecryptCredential_Plaintext,
  Lib_Auth_DecryptCredential_Returns,
  Lib_Auth_DeriveKey_Password,
  Lib_Auth_DeriveKey_Returns,
  Lib_Auth_DeriveKey_Salt,
  Lib_Auth_DigestsEqual_Left,
  Lib_Auth_DigestsEqual_LeftBuffer,
  Lib_Auth_DigestsEqual_Returns,
  Lib_Auth_DigestsEqual_Right,
  Lib_Auth_DigestsEqual_RightBuffer,
  Lib_Auth_DigestValue_Returns,
  Lib_Auth_DigestValue_Value,
  Lib_Auth_EncryptCredential_AuthTag,
  Lib_Auth_EncryptCredential_Cipher,
  Lib_Auth_EncryptCredential_Ciphertext,
  Lib_Auth_EncryptCredential_Credential,
  Lib_Auth_EncryptCredential_EncryptionKey,
  Lib_Auth_EncryptCredential_Iv,
  Lib_Auth_EncryptCredential_Key,
  Lib_Auth_EncryptCredential_Returns,
  Lib_Auth_GenerateCode_Length,
  Lib_Auth_GenerateCode_RandomValue,
  Lib_Auth_GenerateCode_Returns,
  Lib_Auth_GenerateEncryptionKey_Returns,
  Lib_Auth_GenerateOpaqueToken_ByteLength,
  Lib_Auth_GenerateOpaqueToken_Prefix,
  Lib_Auth_GenerateOpaqueToken_Returns,
  Lib_Auth_GeneratePersonalAccessToken_RandomValue,
  Lib_Auth_GeneratePersonalAccessToken_Returns,
  Lib_Auth_GenerateRecoveryCodes_Code,
  Lib_Auth_GenerateRecoveryCodes_Codes,
  Lib_Auth_GenerateRecoveryCodes_Returns,
  Lib_Auth_GenerateSetupCode_Code,
  Lib_Auth_GenerateSetupCode_Returns,
  Lib_Auth_GetBearerToken_AuthorizationHeader,
  Lib_Auth_GetBearerToken_AuthorizationPattern,
  Lib_Auth_GetBearerToken_Match,
  Lib_Auth_GetBearerToken_Request,
  Lib_Auth_GetBearerToken_Returns,
  Lib_Auth_HashAdministratorPassword_DerivedKey,
  Lib_Auth_HashAdministratorPassword_Password,
  Lib_Auth_HashAdministratorPassword_Returns,
  Lib_Auth_HashAdministratorPassword_Salt,
  Lib_Auth_HashPersonalAccessToken_PersonalAccessToken,
  Lib_Auth_HashPersonalAccessToken_Returns,
  Lib_Auth_HasPersonalAccessTokenScope_PersonalAccessToken,
  Lib_Auth_HasPersonalAccessTokenScope_Returns,
  Lib_Auth_HasPersonalAccessTokenScope_Scope,
  Lib_Auth_NormalizeRecoveryCode_Normalized,
  Lib_Auth_NormalizeRecoveryCode_Returns,
  Lib_Auth_NormalizeRecoveryCode_Value,
  Lib_Auth_NormalizeSetupCode_Characters,
  Lib_Auth_NormalizeSetupCode_Normalized,
  Lib_Auth_NormalizeSetupCode_Returns,
  Lib_Auth_NormalizeSetupCode_Value,
  Lib_Auth_PasswordParameters,
  Lib_Auth_VerifyAdministratorPassword_DerivedKey,
  Lib_Auth_VerifyAdministratorPassword_ExpectedKey,
  Lib_Auth_VerifyAdministratorPassword_Parts,
  Lib_Auth_VerifyAdministratorPassword_Password,
  Lib_Auth_VerifyAdministratorPassword_PasswordHash,
  Lib_Auth_VerifyAdministratorPassword_Returns,
  Lib_Auth_VerifyAdministratorPassword_Salt,
} from '../types/lib/auth.d.ts';

/**
 * Lib - Auth - Password Parameters.
 *
 * Keeps the scrypt cost the account file already used, so imported hashes keep working.
 * The cost, salt, and key length are written into every stored hash.
 *
 * @since 1.0.0
 */
const passwordParameters: Lib_Auth_PasswordParameters = {
  blockSize: 8,
  cost: 32768,
  keyLength: 64,
  maxmem: 64 * 1024 * 1024,
  parallelization: 1,
  saltLength: 16,
};

/**
 * Lib - Auth - Code Alphabet.
 *
 * Omits look-alike characters such as 0, O, 1, and I from setup and recovery codes.
 * Thirty-two symbols divide 256 evenly, so each random byte maps without bias.
 *
 * @since 1.0.0
 */
const codeAlphabet: Lib_Auth_CodeAlphabet = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';

/**
 * Lib - Auth - Authenticate Raw Personal Access Token.
 *
 * Resolves an already extracted credential against stored hashes and expiry metadata.
 * Expired, malformed, and unknown credentials share the same rejected result.
 *
 * @param {Lib_Auth_AuthenticateRawPersonalAccessToken_PersonalAccessTokens} personalAccessTokens - Personal access tokens.
 * @param {Lib_Auth_AuthenticateRawPersonalAccessToken_PersonalAccessToken}  personalAccessToken  - Personal access token.
 * @param {Lib_Auth_AuthenticateRawPersonalAccessToken_Now}                  now                  - Now.
 *
 * @returns {Lib_Auth_AuthenticateRawPersonalAccessToken_Returns}
 *
 * @since 1.0.0
 */
export function authenticateRawPersonalAccessToken(personalAccessTokens: Lib_Auth_AuthenticateRawPersonalAccessToken_PersonalAccessTokens, personalAccessToken: Lib_Auth_AuthenticateRawPersonalAccessToken_PersonalAccessToken, now: Lib_Auth_AuthenticateRawPersonalAccessToken_Now = new Date()): Lib_Auth_AuthenticateRawPersonalAccessToken_Returns {
  if (personalAccessTokenPattern.test(personalAccessToken) === false) {
    return undefined;
  }

  const providedTokenHash: Lib_Auth_AuthenticateRawPersonalAccessToken_ProvidedTokenHash = hashPersonalAccessToken(personalAccessToken);
  const providedTokenHashBuffer: Lib_Auth_AuthenticateRawPersonalAccessToken_ProvidedTokenHashBuffer = Buffer.from(providedTokenHash, 'hex');

  let matchedToken: Lib_Auth_AuthenticateRawPersonalAccessToken_MatchedToken = undefined;

  for (const storedPersonalAccessToken of personalAccessTokens) {
    const expectedTokenHashBuffer: Lib_Auth_AuthenticateRawPersonalAccessToken_ExpectedTokenHashBuffer = Buffer.from(storedPersonalAccessToken['tokenHash'], 'hex');
    const isMatch: Lib_Auth_AuthenticateRawPersonalAccessToken_IsMatch = expectedTokenHashBuffer.length === providedTokenHashBuffer.length && timingSafeEqual(providedTokenHashBuffer, expectedTokenHashBuffer);

    if (isMatch === true) {
      matchedToken = storedPersonalAccessToken;
    }
  }

  if (matchedToken === undefined) {
    return undefined;
  }

  if (matchedToken['expiresAt'] !== undefined) {
    const expiresAt: Lib_Auth_AuthenticateRawPersonalAccessToken_ExpiresAt = Date.parse(matchedToken['expiresAt']);

    if (expiresAt <= now.getTime()) {
      return undefined;
    }
  }

  return {
    id: matchedToken['id'],
    name: matchedToken['name'],
    scopes: matchedToken['scopes'],
  };
}

/**
 * Lib - Auth - Create Dummy Password Hash.
 *
 * Builds a well-formed hash that no password matches, for usernames that don't exist.
 * Checking it costs the same scrypt work, so timing never reveals the username.
 *
 * @returns {Lib_Auth_CreateDummyPasswordHash_Returns}
 *
 * @since 1.0.0
 */
export function createDummyPasswordHash(): Lib_Auth_CreateDummyPasswordHash_Returns {
  return [
    'scrypt',
    String(passwordParameters['cost']),
    String(passwordParameters['blockSize']),
    String(passwordParameters['parallelization']),
    randomBytes(passwordParameters['saltLength']).toString('base64url'),
    randomBytes(passwordParameters['keyLength']).toString('base64url'),
  ].join('$');
}

/**
 * Lib - Auth - Decrypt Credential.
 *
 * Opens one AES-256-GCM value using the installation's encryption key.
 * Authentication failure is fatal so corrupted or substituted secrets fail closed.
 *
 * @param {Lib_Auth_DecryptCredential_EncryptedCredential} encryptedCredential - Encrypted credential.
 * @param {Lib_Auth_DecryptCredential_EncryptionKey}       encryptionKey       - Encryption key.
 *
 * @returns {Lib_Auth_DecryptCredential_Returns}
 *
 * @since 1.0.0
 */
export function decryptCredential(encryptedCredential: Lib_Auth_DecryptCredential_EncryptedCredential, encryptionKey: Lib_Auth_DecryptCredential_EncryptionKey): Lib_Auth_DecryptCredential_Returns {
  const key: Lib_Auth_DecryptCredential_Key = Buffer.from(encryptionKey, 'hex');
  const iv: Lib_Auth_DecryptCredential_Iv = Buffer.from(encryptedCredential['iv'], 'base64url');
  const authTag: Lib_Auth_DecryptCredential_AuthTag = Buffer.from(encryptedCredential['authTag'], 'base64url');
  const ciphertext: Lib_Auth_DecryptCredential_Ciphertext = Buffer.from(encryptedCredential['ciphertext'], 'base64url');
  const cipher: Lib_Auth_DecryptCredential_Cipher = createDecipheriv('aes-256-gcm', key, iv);

  cipher.setAuthTag(authTag);

  const plaintext: Lib_Auth_DecryptCredential_Plaintext = Buffer.concat([
    cipher.update(ciphertext),
    cipher.final(),
  ]);

  return plaintext.toString('utf8');
}

/**
 * Lib - Auth - Digest Value.
 *
 * Derives the fixed-length SHA-256 value stored for random session, CSRF, and code values.
 * High-entropy inputs need no password hashing, and the digest allows indexed lookup.
 *
 * @param {Lib_Auth_DigestValue_Value} value - Value.
 *
 * @returns {Lib_Auth_DigestValue_Returns}
 *
 * @since 1.0.0
 */
export function digestValue(value: Lib_Auth_DigestValue_Value): Lib_Auth_DigestValue_Returns {
  return createHash('sha256').update(value).digest('hex');
}

/**
 * Lib - Auth - Digests Equal.
 *
 * Compares two hexadecimal digests in constant time.
 * Values of different lengths are rejected before the timing-safe comparison.
 *
 * @param {Lib_Auth_DigestsEqual_Left}  left  - Left.
 * @param {Lib_Auth_DigestsEqual_Right} right - Right.
 *
 * @returns {Lib_Auth_DigestsEqual_Returns}
 *
 * @since 1.0.0
 */
export function digestsEqual(left: Lib_Auth_DigestsEqual_Left, right: Lib_Auth_DigestsEqual_Right): Lib_Auth_DigestsEqual_Returns {
  const leftBuffer: Lib_Auth_DigestsEqual_LeftBuffer = Buffer.from(left, 'utf8');
  const rightBuffer: Lib_Auth_DigestsEqual_RightBuffer = Buffer.from(right, 'utf8');

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

/**
 * Lib - Auth - Encrypt Credential.
 *
 * Seals one secret with an independent random IV and authentication tag.
 * The database stores only ciphertext while the key stays in its own file.
 *
 * @param {Lib_Auth_EncryptCredential_Credential}    credential    - Credential.
 * @param {Lib_Auth_EncryptCredential_EncryptionKey} encryptionKey - Encryption key.
 *
 * @returns {Lib_Auth_EncryptCredential_Returns}
 *
 * @since 1.0.0
 */
export function encryptCredential(credential: Lib_Auth_EncryptCredential_Credential, encryptionKey: Lib_Auth_EncryptCredential_EncryptionKey): Lib_Auth_EncryptCredential_Returns {
  const key: Lib_Auth_EncryptCredential_Key = Buffer.from(encryptionKey, 'hex');
  const iv: Lib_Auth_EncryptCredential_Iv = randomBytes(12);
  const cipher: Lib_Auth_EncryptCredential_Cipher = createCipheriv('aes-256-gcm', key, iv);
  const ciphertext: Lib_Auth_EncryptCredential_Ciphertext = Buffer.concat([
    cipher.update(credential, 'utf8'),
    cipher.final(),
  ]);
  const authTag: Lib_Auth_EncryptCredential_AuthTag = cipher.getAuthTag();

  return {
    authTag: authTag.toString('base64url'),
    ciphertext: ciphertext.toString('base64url'),
    iv: iv.toString('base64url'),
  };
}

/**
 * Lib - Auth - Generate Encryption Key.
 *
 * Creates the 32-byte hexadecimal key that seals authenticator secrets.
 * It is written once to the key file in the data directory.
 *
 * @returns {Lib_Auth_GenerateEncryptionKey_Returns}
 *
 * @since 1.0.0
 */
export function generateEncryptionKey(): Lib_Auth_GenerateEncryptionKey_Returns {
  return randomBytes(32).toString('hex');
}

/**
 * Lib - Auth - Generate Opaque Token.
 *
 * Creates a prefixed random Base64URL value for browser sessions and CSRF protection.
 * Only the digest of the returned value is ever written to SQLite.
 *
 * @param {Lib_Auth_GenerateOpaqueToken_Prefix}     prefix     - Prefix.
 * @param {Lib_Auth_GenerateOpaqueToken_ByteLength} byteLength - Byte length.
 *
 * @returns {Lib_Auth_GenerateOpaqueToken_Returns}
 *
 * @since 1.0.0
 */
export function generateOpaqueToken(prefix: Lib_Auth_GenerateOpaqueToken_Prefix, byteLength: Lib_Auth_GenerateOpaqueToken_ByteLength): Lib_Auth_GenerateOpaqueToken_Returns {
  return `${prefix}${randomBytes(byteLength).toString('base64url')}`;
}

/**
 * Lib - Auth - Generate Personal Access Token.
 *
 * Creates a high-entropy token suitable for one-time provisioning to a client.
 * The raw value is never needed by the server after its hash is stored.
 *
 * @returns {Lib_Auth_GeneratePersonalAccessToken_Returns}
 *
 * @since 1.0.0
 */
export function generatePersonalAccessToken(): Lib_Auth_GeneratePersonalAccessToken_Returns {
  const randomValue: Lib_Auth_GeneratePersonalAccessToken_RandomValue = randomBytes(32).toString('base64url');

  return `outpost_${randomValue}`;
}

/**
 * Lib - Auth - Generate Recovery Codes.
 *
 * Creates ten single-use codes shown once when the authenticator app is turned on.
 * Each code holds fifty bits of randomness split into two readable groups.
 *
 * @returns {Lib_Auth_GenerateRecoveryCodes_Returns}
 *
 * @since 1.0.0
 */
export function generateRecoveryCodes(): Lib_Auth_GenerateRecoveryCodes_Returns {
  const codes: Lib_Auth_GenerateRecoveryCodes_Codes = [];

  while (codes.length < 10) {
    const code: Lib_Auth_GenerateRecoveryCodes_Code = generateCode(10);

    codes.push(`${code.slice(0, 5)}-${code.slice(5)}`);
  }

  return codes;
}

/**
 * Lib - Auth - Generate Setup Code.
 *
 * Creates the one-time code printed to the container log for first-run setup.
 * Three groups of five symbols hold seventy-five bits of randomness.
 *
 * @returns {Lib_Auth_GenerateSetupCode_Returns}
 *
 * @since 1.0.0
 */
export function generateSetupCode(): Lib_Auth_GenerateSetupCode_Returns {
  const code: Lib_Auth_GenerateSetupCode_Code = generateCode(15);

  return `${code.slice(0, 5)}-${code.slice(5, 10)}-${code.slice(10)}`;
}

/**
 * Lib - Auth - Get Bearer Token.
 *
 * Extracts one well-formed access token from the Authorization header.
 * Missing, foreign-scheme, and malformed values all return undefined.
 *
 * @param {Lib_Auth_GetBearerToken_Request} request - Request.
 *
 * @returns {Lib_Auth_GetBearerToken_Returns}
 *
 * @since 1.0.0
 */
export function getBearerToken(request: Lib_Auth_GetBearerToken_Request): Lib_Auth_GetBearerToken_Returns {
  const authorizationHeader: Lib_Auth_GetBearerToken_AuthorizationHeader = request.get('Authorization');

  if (authorizationHeader === undefined) {
    return undefined;
  }

  const authorizationPattern: Lib_Auth_GetBearerToken_AuthorizationPattern = new RegExp(bearerAuthorizationPattern, 'i');
  const match: Lib_Auth_GetBearerToken_Match = authorizationHeader.match(authorizationPattern);

  if (
    match === null
    || match[1] === undefined
    || personalAccessTokenPattern.test(match[1]) === false
  ) {
    return undefined;
  }

  return match[1];
}

/**
 * Lib - Auth - Hash Administrator Password.
 *
 * Derives a salted scrypt hash in the scrypt$N$r$p$salt$key form the account file used.
 * The work runs on the thread pool, so hashing never pauses the scheduler.
 *
 * @param {Lib_Auth_HashAdministratorPassword_Password} password - Password.
 *
 * @returns {Lib_Auth_HashAdministratorPassword_Returns}
 *
 * @since 1.0.0
 */
export async function hashAdministratorPassword(password: Lib_Auth_HashAdministratorPassword_Password): Lib_Auth_HashAdministratorPassword_Returns {
  const salt: Lib_Auth_HashAdministratorPassword_Salt = randomBytes(passwordParameters['saltLength']);
  const derivedKey: Lib_Auth_HashAdministratorPassword_DerivedKey = await deriveKey(password, salt);

  return [
    'scrypt',
    String(passwordParameters['cost']),
    String(passwordParameters['blockSize']),
    String(passwordParameters['parallelization']),
    salt.toString('base64url'),
    derivedKey.toString('base64url'),
  ].join('$');
}

/**
 * Lib - Auth - Hash Personal Access Token.
 *
 * Derives the fixed-length value stored in the server-side token table.
 * High-entropy raw tokens remain exclusively with their clients.
 *
 * @param {Lib_Auth_HashPersonalAccessToken_PersonalAccessToken} personalAccessToken - Personal access token.
 *
 * @returns {Lib_Auth_HashPersonalAccessToken_Returns}
 *
 * @since 1.0.0
 */
export function hashPersonalAccessToken(personalAccessToken: Lib_Auth_HashPersonalAccessToken_PersonalAccessToken): Lib_Auth_HashPersonalAccessToken_Returns {
  return digestValue(personalAccessToken);
}

/**
 * Lib - Auth - Has Personal Access Token Scope.
 *
 * Checks one authenticated token against the exact capability a route needs.
 * Scopes are deliberately closed rather than accepting arbitrary permission strings.
 *
 * @param {Lib_Auth_HasPersonalAccessTokenScope_PersonalAccessToken} personalAccessToken - Personal access token.
 * @param {Lib_Auth_HasPersonalAccessTokenScope_Scope}               scope               - Scope.
 *
 * @returns {Lib_Auth_HasPersonalAccessTokenScope_Returns}
 *
 * @since 1.0.0
 */
export function hasPersonalAccessTokenScope(personalAccessToken: Lib_Auth_HasPersonalAccessTokenScope_PersonalAccessToken, scope: Lib_Auth_HasPersonalAccessTokenScope_Scope): Lib_Auth_HasPersonalAccessTokenScope_Returns {
  return personalAccessToken['scopes'].includes(scope);
}

/**
 * Lib - Auth - Normalize Recovery Code.
 *
 * Uppercases a typed recovery code and removes the spaces and dashes people add.
 * Values that still do not match the generated shape return undefined.
 *
 * @param {Lib_Auth_NormalizeRecoveryCode_Value} value - Value.
 *
 * @returns {Lib_Auth_NormalizeRecoveryCode_Returns}
 *
 * @since 1.0.0
 */
export function normalizeRecoveryCode(value: Lib_Auth_NormalizeRecoveryCode_Value): Lib_Auth_NormalizeRecoveryCode_Returns {
  const normalized: Lib_Auth_NormalizeRecoveryCode_Normalized = value.toUpperCase().split(whitespacePattern).join('').replaceAll('-', '');

  if (recoveryCodePattern.test(normalized) === false) {
    return undefined;
  }

  return normalized;
}

/**
 * Lib - Auth - Normalize Setup Code.
 *
 * Accepts the setup code with or without dashes, with spaces, and in any letter case.
 * The result always uses the printed three-group form, or undefined when invalid.
 *
 * @param {Lib_Auth_NormalizeSetupCode_Value} value - Value.
 *
 * @returns {Lib_Auth_NormalizeSetupCode_Returns}
 *
 * @since 1.0.0
 */
export function normalizeSetupCode(value: Lib_Auth_NormalizeSetupCode_Value): Lib_Auth_NormalizeSetupCode_Returns {
  const characters: Lib_Auth_NormalizeSetupCode_Characters = value.toUpperCase().split(whitespacePattern).join('').replaceAll('-', '');
  const normalized: Lib_Auth_NormalizeSetupCode_Normalized = `${characters.slice(0, 5)}-${characters.slice(5, 10)}-${characters.slice(10)}`;

  if (characters.length !== 15 || setupCodePattern.test(normalized) === false) {
    return undefined;
  }

  return normalized;
}

/**
 * Lib - Auth - Verify Administrator Password.
 *
 * Recomputes the scrypt key with the stored salt and compares it in constant time.
 * Malformed stored hashes return the same false result as an incorrect password.
 *
 * @param {Lib_Auth_VerifyAdministratorPassword_Password}     password     - Password.
 * @param {Lib_Auth_VerifyAdministratorPassword_PasswordHash} passwordHash - Password hash.
 *
 * @returns {Lib_Auth_VerifyAdministratorPassword_Returns}
 *
 * @since 1.0.0
 */
export async function verifyAdministratorPassword(password: Lib_Auth_VerifyAdministratorPassword_Password, passwordHash: Lib_Auth_VerifyAdministratorPassword_PasswordHash): Lib_Auth_VerifyAdministratorPassword_Returns {
  if (scryptPasswordHashPattern.test(passwordHash) === false) {
    return false;
  }

  const parts: Lib_Auth_VerifyAdministratorPassword_Parts = passwordHash.split('$');
  const salt: Lib_Auth_VerifyAdministratorPassword_Salt = Buffer.from(parts[4] ?? '', 'base64url');
  const expectedKey: Lib_Auth_VerifyAdministratorPassword_ExpectedKey = Buffer.from(parts[5] ?? '', 'base64url');

  if (salt.length !== passwordParameters['saltLength'] || expectedKey.length !== passwordParameters['keyLength']) {
    return false;
  }

  const derivedKey: Lib_Auth_VerifyAdministratorPassword_DerivedKey = await deriveKey(password, salt);

  return timingSafeEqual(derivedKey, expectedKey);
}

/**
 * Lib - Auth - Derive Key.
 *
 * Runs scrypt on the thread pool with the fixed cost settings.
 * Sign-ins and password changes therefore never block other requests.
 *
 * @param {Lib_Auth_DeriveKey_Password} password - Password.
 * @param {Lib_Auth_DeriveKey_Salt}     salt     - Salt.
 *
 * @returns {Lib_Auth_DeriveKey_Returns}
 *
 * @since 1.0.0
 */
async function deriveKey(password: Lib_Auth_DeriveKey_Password, salt: Lib_Auth_DeriveKey_Salt): Lib_Auth_DeriveKey_Returns {
  return new Promise((resolve, reject) => {
    scrypt(password, salt, passwordParameters['keyLength'], {
      blockSize: passwordParameters['blockSize'],
      cost: passwordParameters['cost'],
      maxmem: passwordParameters['maxmem'],
      parallelization: passwordParameters['parallelization'],
    }, (error, key) => {
      if (error !== null) {
        reject(error);

        return;
      }

      resolve(key);

      return;
    });

    return;
  });
}

/**
 * Lib - Auth - Generate Code.
 *
 * Draws characters from the shared code alphabet using the system random source.
 * Each byte maps to one symbol, and the alphabet size keeps the mapping unbiased.
 *
 * @param {Lib_Auth_GenerateCode_Length} length - Length.
 *
 * @returns {Lib_Auth_GenerateCode_Returns}
 *
 * @since 1.0.0
 */
function generateCode(length: Lib_Auth_GenerateCode_Length): Lib_Auth_GenerateCode_Returns {
  const randomValue: Lib_Auth_GenerateCode_RandomValue = randomBytes(length);

  return [...randomValue].map((byte) => codeAlphabet.charAt(byte % codeAlphabet.length)).join('');
}

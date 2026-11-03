import {
  createHmac,
  randomBytes,
  timingSafeEqual,
} from 'node:crypto';

import type {
  Lib_Totp_Base32Alphabet,
  Lib_Totp_CreateTotpUri_AccountLabel,
  Lib_Totp_CreateTotpUri_EncodedIssuer,
  Lib_Totp_CreateTotpUri_Issuer,
  Lib_Totp_CreateTotpUri_Returns,
  Lib_Totp_CreateTotpUri_Secret,
  Lib_Totp_CreateTotpUri_Username,
  Lib_Totp_DecodeBase32_Bits,
  Lib_Totp_DecodeBase32_CharacterValue,
  Lib_Totp_DecodeBase32_Returns,
  Lib_Totp_DecodeBase32_Secret,
  Lib_Totp_DecodeBase32_Value,
  Lib_Totp_DecodeBase32_Values,
  Lib_Totp_EncodeBase32_Bits,
  Lib_Totp_EncodeBase32_Bytes,
  Lib_Totp_EncodeBase32_Result,
  Lib_Totp_EncodeBase32_Returns,
  Lib_Totp_EncodeBase32_Value,
  Lib_Totp_GenerateCode_BinaryCode,
  Lib_Totp_GenerateCode_Code,
  Lib_Totp_GenerateCode_Counter,
  Lib_Totp_GenerateCode_Digest,
  Lib_Totp_GenerateCode_Offset,
  Lib_Totp_GenerateCode_Returns,
  Lib_Totp_GenerateCode_Secret,
  Lib_Totp_GenerateCode_SecretBytes,
  Lib_Totp_GenerateCode_Step,
  Lib_Totp_GenerateTotpSecret_RandomValue,
  Lib_Totp_GenerateTotpSecret_Returns,
  Lib_Totp_VerifyTotpCode_CandidateStep,
  Lib_Totp_VerifyTotpCode_Code,
  Lib_Totp_VerifyTotpCode_ExpectedBuffer,
  Lib_Totp_VerifyTotpCode_ExpectedCode,
  Lib_Totp_VerifyTotpCode_Now,
  Lib_Totp_VerifyTotpCode_ProvidedBuffer,
  Lib_Totp_VerifyTotpCode_Returns,
  Lib_Totp_VerifyTotpCode_Secret,
  Lib_Totp_VerifyTotpCode_Step,
} from '../types/lib/totp.d.ts';

/**
 * Lib - Totp - Base32 Alphabet.
 *
 * Uses the RFC 4648 alphabet expected by authenticator app setup URIs.
 * Generated secrets omit padding because otpauth consumers do not require it.
 *
 * @since 1.0.0
 */
const base32Alphabet: Lib_Totp_Base32Alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

/**
 * Lib - Totp - Create Totp URI.
 *
 * Produces the standard otpauth URI consumed by authenticator apps.
 * Issuer and account labels are encoded independently to avoid ambiguous labels.
 *
 * @param {Lib_Totp_CreateTotpUri_Secret}   secret   - Secret.
 * @param {Lib_Totp_CreateTotpUri_Username} username - Username.
 *
 * @returns {Lib_Totp_CreateTotpUri_Returns}
 *
 * @since 1.0.0
 */
export function createTotpUri(secret: Lib_Totp_CreateTotpUri_Secret, username: Lib_Totp_CreateTotpUri_Username): Lib_Totp_CreateTotpUri_Returns {
  const issuer: Lib_Totp_CreateTotpUri_Issuer = 'Outpost';
  const encodedIssuer: Lib_Totp_CreateTotpUri_EncodedIssuer = encodeURIComponent(issuer);
  const accountLabel: Lib_Totp_CreateTotpUri_AccountLabel = `${encodedIssuer}:${encodeURIComponent(username)}`;

  return `otpauth://totp/${accountLabel}?secret=${secret}&issuer=${encodedIssuer}&algorithm=SHA1&digits=6&period=30`;
}

/**
 * Lib - Totp - Generate Code.
 *
 * Implements RFC 4226 dynamic truncation for one RFC 6238 time step.
 * SHA-1, six digits, and a 30-second period maximize authenticator compatibility.
 *
 * @param {Lib_Totp_GenerateCode_Secret} secret - Secret.
 * @param {Lib_Totp_GenerateCode_Step}   step   - Step.
 *
 * @returns {Lib_Totp_GenerateCode_Returns}
 *
 * @since 1.0.0
 */
export function generateCode(secret: Lib_Totp_GenerateCode_Secret, step: Lib_Totp_GenerateCode_Step): Lib_Totp_GenerateCode_Returns {
  const secretBytes: Lib_Totp_GenerateCode_SecretBytes = decodeBase32(secret);
  const counter: Lib_Totp_GenerateCode_Counter = Buffer.alloc(8);

  counter.writeBigUInt64BE(BigInt(step));

  const digest: Lib_Totp_GenerateCode_Digest = createHmac('sha1', secretBytes).update(counter).digest();
  const offset: Lib_Totp_GenerateCode_Offset = (digest.at(-1) ?? 0) % 16;
  const binaryCode: Lib_Totp_GenerateCode_BinaryCode = digest.readUInt32BE(offset) % Math.pow(2, 31);
  const code: Lib_Totp_GenerateCode_Code = binaryCode % 1000000;

  return code.toString().padStart(6, '0');
}

/**
 * Lib - Totp - Generate Totp Secret.
 *
 * Creates a 160-bit secret using the operating system cryptographic random source.
 * The Base32 value can be typed in by hand when a QR code can't be scanned.
 *
 * @returns {Lib_Totp_GenerateTotpSecret_Returns}
 *
 * @since 1.0.0
 */
export function generateTotpSecret(): Lib_Totp_GenerateTotpSecret_Returns {
  const randomValue: Lib_Totp_GenerateTotpSecret_RandomValue = randomBytes(20);

  return encodeBase32(randomValue);
}

/**
 * Lib - Totp - Verify Totp Code.
 *
 * Checks the current 30-second step plus one adjacent step in either direction.
 * Timing-safe comparison protects the fixed-length value and returns its matched step.
 *
 * @param {Lib_Totp_VerifyTotpCode_Secret} secret - Secret.
 * @param {Lib_Totp_VerifyTotpCode_Code}   code   - Code.
 * @param {Lib_Totp_VerifyTotpCode_Now}    [now]  - Now.
 *
 * @returns {Lib_Totp_VerifyTotpCode_Returns}
 *
 * @since 1.0.0
 */
export function verifyTotpCode(secret: Lib_Totp_VerifyTotpCode_Secret, code: Lib_Totp_VerifyTotpCode_Code, now: Lib_Totp_VerifyTotpCode_Now = Date.now()): Lib_Totp_VerifyTotpCode_Returns {
  if (code.length !== 6) {
    return undefined;
  }

  const step: Lib_Totp_VerifyTotpCode_Step = Math.floor(now / 30000);
  const providedBuffer: Lib_Totp_VerifyTotpCode_ProvidedBuffer = Buffer.from(code);

  for (const offset of [
    0,
    -1,
    1,
  ]) {
    const candidateStep: Lib_Totp_VerifyTotpCode_CandidateStep = step + offset;

    if (candidateStep < 0) {
      continue;
    }

    const expectedCode: Lib_Totp_VerifyTotpCode_ExpectedCode = generateCode(secret, candidateStep);
    const expectedBuffer: Lib_Totp_VerifyTotpCode_ExpectedBuffer = Buffer.from(expectedCode);

    if (providedBuffer.length === expectedBuffer.length && timingSafeEqual(providedBuffer, expectedBuffer) === true) {
      return candidateStep;
    }
  }

  return undefined;
}

/**
 * Lib - Totp - Decode Base32.
 *
 * Decodes a secret this app generated, for HMAC evaluation.
 * Invalid input fails closed even though stored secrets are validated before use.
 *
 * @param {Lib_Totp_DecodeBase32_Secret} secret - Secret.
 *
 * @returns {Lib_Totp_DecodeBase32_Returns}
 *
 * @since 1.0.0
 */
function decodeBase32(secret: Lib_Totp_DecodeBase32_Secret): Lib_Totp_DecodeBase32_Returns {
  let bits: Lib_Totp_DecodeBase32_Bits = 0;
  let value: Lib_Totp_DecodeBase32_Value = 0;
  const values: Lib_Totp_DecodeBase32_Values = [];

  for (const character of secret.toUpperCase()) {
    const characterValue: Lib_Totp_DecodeBase32_CharacterValue = base32Alphabet.indexOf(character);

    if (characterValue < 0) {
      throw new Error('The stored TOTP secret is invalid.');
    }

    value = (value * 32) + characterValue;
    bits += 5;

    if (bits >= 8) {
      bits -= 8;
      values.push(Math.floor(value / Math.pow(2, bits)) % 256);
      value %= Math.pow(2, bits);
    }
  }

  return Buffer.from(values);
}

/**
 * Lib - Totp - Encode Base32.
 *
 * Encodes random secret bytes without padding for an otpauth setup URI.
 * The small bit accumulator is drained continuously and never exceeds 12 bits.
 *
 * @param {Lib_Totp_EncodeBase32_Bytes} bytes - Bytes.
 *
 * @returns {Lib_Totp_EncodeBase32_Returns}
 *
 * @since 1.0.0
 */
function encodeBase32(bytes: Lib_Totp_EncodeBase32_Bytes): Lib_Totp_EncodeBase32_Returns {
  let bits: Lib_Totp_EncodeBase32_Bits = 0;
  let value: Lib_Totp_EncodeBase32_Value = 0;
  let result: Lib_Totp_EncodeBase32_Result = '';

  for (const byte of bytes) {
    value = (value * 256) + byte;
    bits += 8;

    while (bits >= 5) {
      bits -= 5;
      result += base32Alphabet.charAt(Math.floor(value / Math.pow(2, bits)) % 32);
    }

    value %= Math.pow(2, bits);
  }

  if (bits > 0) {
    result += base32Alphabet.charAt((value * Math.pow(2, 5 - bits)) % 32);
  }

  return result;
}

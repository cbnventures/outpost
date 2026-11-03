import {
  describe,
  expect,
  it,
} from 'vitest';

import {
  createTotpUri,
  generateTotpSecret,
  verifyTotpCode,
} from './totp.js';

import type {
  Lib_Totp_AdministratorTotp_GeneratesACompatibleSecretAndEncodedOtpauthUri_Secret,
  Lib_Totp_AdministratorTotp_GeneratesACompatibleSecretAndEncodedOtpauthUri_Uri,
  Lib_Totp_AdministratorTotp_VerifiesTheRfc6238Sha1FixtureWithASixDigitCode_Secret,
} from '../types/lib/totp.test.d.ts';

/**
 * Lib - Totp - Administrator TOTP.
 *
 * Checks the RFC 6238 fixture with its one-step window and that generated
 * secrets and setup URIs work with authenticator apps.
 *
 * @since 1.0.0
 */
describe('administrator TOTP', () => {
  it('verifies the RFC 6238 SHA-1 fixture with a six-digit code', () => {
    const secret: Lib_Totp_AdministratorTotp_VerifiesTheRfc6238Sha1FixtureWithASixDigitCode_Secret = 'GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ';

    expect(verifyTotpCode(secret, '287082', 59000)).toBe(1);

    expect(verifyTotpCode(secret, '287082', 89000)).toBe(1);

    expect(verifyTotpCode(secret, '287082', 119000)).toBeUndefined();

    expect(verifyTotpCode(secret, '000000', 59000)).toBeUndefined();

    return;
  });

  it('generates a compatible secret and encoded otpauth URI', () => {
    const secret: Lib_Totp_AdministratorTotp_GeneratesACompatibleSecretAndEncodedOtpauthUri_Secret = generateTotpSecret();
    const uri: Lib_Totp_AdministratorTotp_GeneratesACompatibleSecretAndEncodedOtpauthUri_Uri = createTotpUri(secret, 'admin.operator');

    expect(secret).toHaveLength(32);

    expect([...secret].every((character) => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'.includes(character))).toBe(true);

    expect(uri).toBe(`otpauth://totp/Outpost:admin.operator?secret=${secret}&issuer=Outpost&algorithm=SHA1&digits=6&period=30`);

    return;
  });

  return;
});

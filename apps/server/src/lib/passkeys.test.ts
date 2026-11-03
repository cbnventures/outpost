import {
  describe,
  expect,
  it,
} from 'vitest';

import {
  createPasskeyAuthenticationOptions,
  createPasskeyRegistrationOptions,
  getPasskeyUserHandle,
} from './passkeys.js';

import type {
  Lib_Passkeys_AdministratorPasskeys_CreatesAnonymousAuthenticationOptionsWithoutACredentialAllowList_Configuration,
  Lib_Passkeys_AdministratorPasskeys_CreatesAnonymousAuthenticationOptionsWithoutACredentialAllowList_Options,
  Lib_Passkeys_AdministratorPasskeys_CreatesDiscoverableRegistrationOptionsWithRequiredUserVerification_Administrator,
  Lib_Passkeys_AdministratorPasskeys_CreatesDiscoverableRegistrationOptionsWithRequiredUserVerification_Configuration,
  Lib_Passkeys_AdministratorPasskeys_CreatesDiscoverableRegistrationOptionsWithRequiredUserVerification_Options,
  Lib_Passkeys_AdministratorPasskeys_CreatesDiscoverableRegistrationOptionsWithRequiredUserVerification_UserHandle,
} from '../types/lib/passkeys.test.d.ts';

/**
 * Lib - Passkeys - Administrator Passkeys.
 *
 * Checks that passkeys are discoverable and user-verified, and that sign-in
 * options name no credential so the authenticator picks one.
 *
 * @since 1.0.0
 */
describe('administrator passkeys', () => {
  it('creates discoverable registration options with required user verification', async () => {
    const configuration: Lib_Passkeys_AdministratorPasskeys_CreatesDiscoverableRegistrationOptionsWithRequiredUserVerification_Configuration = {
      origin: 'https://outpost.example.net',
      rpId: 'outpost.example.net',
      rpName: 'Outpost',
    };
    const administrator: Lib_Passkeys_AdministratorPasskeys_CreatesDiscoverableRegistrationOptionsWithRequiredUserVerification_Administrator = {
      createdAt: '2026-10-25T00:00:00.000Z',
      id: '9cdb2684-2053-48ab-891d-105cfde1e1b6',
      updatedAt: '2026-10-25T00:00:00.000Z',
      username: 'admin',
    };
    const options: Lib_Passkeys_AdministratorPasskeys_CreatesDiscoverableRegistrationOptionsWithRequiredUserVerification_Options = await createPasskeyRegistrationOptions(configuration, administrator, []);
    const userHandle: Lib_Passkeys_AdministratorPasskeys_CreatesDiscoverableRegistrationOptionsWithRequiredUserVerification_UserHandle = getPasskeyUserHandle(administrator['id']);

    expect(options['rp']['id']).toBe(configuration['rpId']);

    expect(options['rp']['name']).toBe('Outpost');

    expect(options['attestation']).toBe('none');

    expect(options['authenticatorSelection']).toEqual(expect.objectContaining({
      residentKey: 'required',
      userVerification: 'required',
    }));

    expect(options['user']['id']).toBe(userHandle);

    expect(Buffer.from(userHandle, 'base64url').toString('utf8')).toBe(administrator['id']);

    return;
  });

  it('creates anonymous authentication options without a credential allow-list', async () => {
    const configuration: Lib_Passkeys_AdministratorPasskeys_CreatesAnonymousAuthenticationOptionsWithoutACredentialAllowList_Configuration = {
      origin: 'https://outpost.example.net',
      rpId: 'outpost.example.net',
      rpName: 'Outpost',
    };
    const options: Lib_Passkeys_AdministratorPasskeys_CreatesAnonymousAuthenticationOptionsWithoutACredentialAllowList_Options = await createPasskeyAuthenticationOptions(configuration);

    expect(options['rpId']).toBe(configuration['rpId']);

    expect(options['userVerification']).toBe('required');

    expect(options['allowCredentials']).toBeUndefined();

    return;
  });

  return;
});

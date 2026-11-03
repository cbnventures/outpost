import {
  type AuthenticationResponseJSON,
  generateAuthenticationOptions,
  generateRegistrationOptions,
  type RegistrationResponseJSON,
  verifyAuthenticationResponse,
  verifyRegistrationResponse,
} from '@simplewebauthn/server';

import type {
  Lib_Passkeys_CreatePasskeyAuthenticationOptions_Configuration,
  Lib_Passkeys_CreatePasskeyAuthenticationOptions_Returns,
  Lib_Passkeys_CreatePasskeyRegistrationOptions_Administrator,
  Lib_Passkeys_CreatePasskeyRegistrationOptions_Configuration,
  Lib_Passkeys_CreatePasskeyRegistrationOptions_ExistingPasskeys,
  Lib_Passkeys_CreatePasskeyRegistrationOptions_Returns,
  Lib_Passkeys_GetPasskeyUserHandle_AdministratorId,
  Lib_Passkeys_GetPasskeyUserHandle_Returns,
  Lib_Passkeys_VerifyPasskeyAuthentication_Challenge,
  Lib_Passkeys_VerifyPasskeyAuthentication_Configuration,
  Lib_Passkeys_VerifyPasskeyAuthentication_Passkey,
  Lib_Passkeys_VerifyPasskeyAuthentication_Response,
  Lib_Passkeys_VerifyPasskeyAuthentication_Returns,
  Lib_Passkeys_VerifyPasskeyAuthentication_Verification,
  Lib_Passkeys_VerifyPasskeyRegistration_Challenge,
  Lib_Passkeys_VerifyPasskeyRegistration_Configuration,
  Lib_Passkeys_VerifyPasskeyRegistration_Response,
  Lib_Passkeys_VerifyPasskeyRegistration_ResponseTransports,
  Lib_Passkeys_VerifyPasskeyRegistration_Returns,
  Lib_Passkeys_VerifyPasskeyRegistration_Transports,
  Lib_Passkeys_VerifyPasskeyRegistration_Verification,
} from '../types/lib/passkeys.d.ts';

/**
 * Lib - Passkeys - Create Passkey Authentication Options.
 *
 * Starts an account-discovering assertion with mandatory local user verification.
 * Omitting allowCredentials lets the authenticator select a resident credential.
 *
 * @param {Lib_Passkeys_CreatePasskeyAuthenticationOptions_Configuration} configuration - Configuration.
 *
 * @returns {Lib_Passkeys_CreatePasskeyAuthenticationOptions_Returns}
 *
 * @since 1.0.0
 */
export async function createPasskeyAuthenticationOptions(configuration: Lib_Passkeys_CreatePasskeyAuthenticationOptions_Configuration): Lib_Passkeys_CreatePasskeyAuthenticationOptions_Returns {
  return generateAuthenticationOptions({
    rpID: configuration['rpId'],
    timeout: 60000,
    userVerification: 'required',
  });
}

/**
 * Lib - Passkeys - Create Passkey Registration Options.
 *
 * Starts a discoverable, user-verified WebAuthn registration for one administrator.
 * Existing credentials are excluded so a device cannot add the same key twice.
 *
 * @param {Lib_Passkeys_CreatePasskeyRegistrationOptions_Configuration}    configuration    - Configuration.
 * @param {Lib_Passkeys_CreatePasskeyRegistrationOptions_Administrator}    administrator    - Administrator.
 * @param {Lib_Passkeys_CreatePasskeyRegistrationOptions_ExistingPasskeys} existingPasskeys - Existing passkeys.
 *
 * @returns {Lib_Passkeys_CreatePasskeyRegistrationOptions_Returns}
 *
 * @since 1.0.0
 */
export async function createPasskeyRegistrationOptions(configuration: Lib_Passkeys_CreatePasskeyRegistrationOptions_Configuration, administrator: Lib_Passkeys_CreatePasskeyRegistrationOptions_Administrator, existingPasskeys: Lib_Passkeys_CreatePasskeyRegistrationOptions_ExistingPasskeys): Lib_Passkeys_CreatePasskeyRegistrationOptions_Returns {
  return generateRegistrationOptions({
    attestationType: 'none',
    authenticatorSelection: {
      residentKey: 'required',
      userVerification: 'required',
    },
    excludeCredentials: existingPasskeys.map((passkey) => ({
      id: passkey['id'],
      transports: passkey['transports'],
    })),
    rpID: configuration['rpId'],
    rpName: configuration['rpName'],
    timeout: 60000,
    userDisplayName: administrator['username'],
    userID: new Uint8Array(Buffer.from(administrator['id'], 'utf8')),
    userName: administrator['username'],
  });
}

/**
 * Lib - Passkeys - Get Passkey User Handle.
 *
 * Encodes the stable administrator UUID as the opaque WebAuthn user handle.
 * The handle stays below the specification's 64-byte maximum and leaves out the username.
 *
 * @param {Lib_Passkeys_GetPasskeyUserHandle_AdministratorId} administratorId - Administrator id.
 *
 * @returns {Lib_Passkeys_GetPasskeyUserHandle_Returns}
 *
 * @since 1.0.0
 */
export function getPasskeyUserHandle(administratorId: Lib_Passkeys_GetPasskeyUserHandle_AdministratorId): Lib_Passkeys_GetPasskeyUserHandle_Returns {
  return Buffer.from(administratorId, 'utf8').toString('base64url');
}

/**
 * Lib - Passkeys - Verify Passkey Authentication.
 *
 * Validates the discoverable credential handle before signature and counter checks.
 * A successful result returns the next replay counter for atomic persistence.
 *
 * @param {Lib_Passkeys_VerifyPasskeyAuthentication_Configuration} configuration - Configuration.
 * @param {Lib_Passkeys_VerifyPasskeyAuthentication_Response}      response      - Response.
 * @param {Lib_Passkeys_VerifyPasskeyAuthentication_Challenge}     challenge     - Challenge.
 * @param {Lib_Passkeys_VerifyPasskeyAuthentication_Passkey}       passkey       - Passkey.
 *
 * @returns {Lib_Passkeys_VerifyPasskeyAuthentication_Returns}
 *
 * @since 1.0.0
 */
export async function verifyPasskeyAuthentication(configuration: Lib_Passkeys_VerifyPasskeyAuthentication_Configuration, response: Lib_Passkeys_VerifyPasskeyAuthentication_Response, challenge: Lib_Passkeys_VerifyPasskeyAuthentication_Challenge, passkey: Lib_Passkeys_VerifyPasskeyAuthentication_Passkey): Lib_Passkeys_VerifyPasskeyAuthentication_Returns {
  if (response['response']['userHandle'] !== getPasskeyUserHandle(passkey['administratorId'])) {
    return undefined;
  }

  let verification: Lib_Passkeys_VerifyPasskeyAuthentication_Verification = undefined;

  try {
    verification = await verifyAuthenticationResponse({
      credential: {
        counter: passkey['counter'],
        id: passkey['id'],
        publicKey: passkey['publicKey'],
        transports: passkey['transports'],
      },
      expectedChallenge: challenge,
      expectedOrigin: configuration['origin'],
      expectedRPID: configuration['rpId'],
      requireUserVerification: true,
      response: response as AuthenticationResponseJSON,
    });
  } catch {
    return undefined;
  }

  if (verification['verified'] === false || verification['authenticationInfo']['userVerified'] === false) {
    return undefined;
  }

  return {
    backedUp: verification['authenticationInfo']['credentialBackedUp'],
    counter: verification['authenticationInfo']['newCounter'],
    deviceType: verification['authenticationInfo']['credentialDeviceType'],
  };
}

/**
 * Lib - Passkeys - Verify Passkey Registration.
 *
 * Checks challenge, origin, relying party, user presence, and user verification.
 * Only the verified public credential fields are returned for storage.
 *
 * @param {Lib_Passkeys_VerifyPasskeyRegistration_Configuration} configuration - Configuration.
 * @param {Lib_Passkeys_VerifyPasskeyRegistration_Response}      response      - Response.
 * @param {Lib_Passkeys_VerifyPasskeyRegistration_Challenge}     challenge     - Challenge.
 *
 * @returns {Lib_Passkeys_VerifyPasskeyRegistration_Returns}
 *
 * @since 1.0.0
 */
export async function verifyPasskeyRegistration(configuration: Lib_Passkeys_VerifyPasskeyRegistration_Configuration, response: Lib_Passkeys_VerifyPasskeyRegistration_Response, challenge: Lib_Passkeys_VerifyPasskeyRegistration_Challenge): Lib_Passkeys_VerifyPasskeyRegistration_Returns {
  let verification: Lib_Passkeys_VerifyPasskeyRegistration_Verification = undefined;

  try {
    verification = await verifyRegistrationResponse({
      expectedChallenge: challenge,
      expectedOrigin: configuration['origin'],
      expectedRPID: configuration['rpId'],
      requireUserPresence: true,
      requireUserVerification: true,
      response: response as RegistrationResponseJSON,
    });
  } catch {
    return undefined;
  }

  if (verification['verified'] === false) {
    return undefined;
  }

  const responseTransports: Lib_Passkeys_VerifyPasskeyRegistration_ResponseTransports = response['response']['transports'] ?? [];
  const transports: Lib_Passkeys_VerifyPasskeyRegistration_Transports = verification['registrationInfo']['credential']['transports'] ?? responseTransports;

  return {
    backedUp: verification['registrationInfo']['credentialBackedUp'],
    counter: verification['registrationInfo']['credential']['counter'],
    deviceType: verification['registrationInfo']['credentialDeviceType'],
    id: verification['registrationInfo']['credential']['id'],
    publicKey: new Uint8Array(verification['registrationInfo']['credential']['publicKey']),
    transports,
  };
}

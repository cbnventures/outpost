import type {
  PublicKeyCredentialCreationOptionsJSON,
  PublicKeyCredentialRequestOptionsJSON,
  VerifiedAuthenticationResponse,
  VerifiedRegistrationResponse,
} from '@simplewebauthn/server';
import type { z } from 'zod';

import type {
  webauthnAuthenticationResponse,
  webauthnRegistrationResponse,
} from '../../lib/schema.js';
import type {
  Shared_Administrator,
  Shared_AdministratorPasskey,
  Shared_AdministratorPasskey_DeviceType,
  Shared_AdministratorPasskeys,
  Shared_VerifiedPasskeyCredential,
  Shared_WebauthnConfiguration,
} from '../shared.d.ts';

/**
 * Lib - Passkeys - Create Passkey Authentication Options.
 *
 * @since 1.0.0
 */
export type Lib_Passkeys_CreatePasskeyAuthenticationOptions_Configuration = Shared_WebauthnConfiguration;

export type Lib_Passkeys_CreatePasskeyAuthenticationOptions_Returns = Promise<PublicKeyCredentialRequestOptionsJSON>;

/**
 * Lib - Passkeys - Create Passkey Registration Options.
 *
 * @since 1.0.0
 */
export type Lib_Passkeys_CreatePasskeyRegistrationOptions_Configuration = Shared_WebauthnConfiguration;

export type Lib_Passkeys_CreatePasskeyRegistrationOptions_Administrator = Shared_Administrator;

export type Lib_Passkeys_CreatePasskeyRegistrationOptions_ExistingPasskeys = Shared_AdministratorPasskeys;

export type Lib_Passkeys_CreatePasskeyRegistrationOptions_Returns = Promise<PublicKeyCredentialCreationOptionsJSON>;

/**
 * Lib - Passkeys - Get Passkey User Handle.
 *
 * @since 1.0.0
 */
export type Lib_Passkeys_GetPasskeyUserHandle_AdministratorId = string;

export type Lib_Passkeys_GetPasskeyUserHandle_Returns = string;

/**
 * Lib - Passkeys - Verify Passkey Authentication.
 *
 * @since 1.0.0
 */
export type Lib_Passkeys_VerifyPasskeyAuthentication_Configuration = Shared_WebauthnConfiguration;

export type Lib_Passkeys_VerifyPasskeyAuthentication_Response = z.infer<typeof webauthnAuthenticationResponse>;

export type Lib_Passkeys_VerifyPasskeyAuthentication_Challenge = string;

export type Lib_Passkeys_VerifyPasskeyAuthentication_Passkey = Shared_AdministratorPasskey;

export type Lib_Passkeys_VerifyPasskeyAuthentication_Returns = Promise<Lib_Passkeys_VerifyPasskeyAuthentication_Result | undefined>;

export type Lib_Passkeys_VerifyPasskeyAuthentication_Verification = VerifiedAuthenticationResponse | undefined;

export type Lib_Passkeys_VerifyPasskeyAuthentication_Result_BackedUp = boolean;

export type Lib_Passkeys_VerifyPasskeyAuthentication_Result_Counter = number;

export type Lib_Passkeys_VerifyPasskeyAuthentication_Result_DeviceType = Shared_AdministratorPasskey_DeviceType;

export type Lib_Passkeys_VerifyPasskeyAuthentication_Result = {
  backedUp: Lib_Passkeys_VerifyPasskeyAuthentication_Result_BackedUp;
  counter: Lib_Passkeys_VerifyPasskeyAuthentication_Result_Counter;
  deviceType: Lib_Passkeys_VerifyPasskeyAuthentication_Result_DeviceType;
};

/**
 * Lib - Passkeys - Verify Passkey Registration.
 *
 * @since 1.0.0
 */
export type Lib_Passkeys_VerifyPasskeyRegistration_Configuration = Shared_WebauthnConfiguration;

export type Lib_Passkeys_VerifyPasskeyRegistration_Response = z.infer<typeof webauthnRegistrationResponse>;

export type Lib_Passkeys_VerifyPasskeyRegistration_Challenge = string;

export type Lib_Passkeys_VerifyPasskeyRegistration_Returns = Promise<Shared_VerifiedPasskeyCredential | undefined>;

export type Lib_Passkeys_VerifyPasskeyRegistration_Verification = VerifiedRegistrationResponse | undefined;

export type Lib_Passkeys_VerifyPasskeyRegistration_ResponseTransports = string[];

export type Lib_Passkeys_VerifyPasskeyRegistration_Transports = string[];

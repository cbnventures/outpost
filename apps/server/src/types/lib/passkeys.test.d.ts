import type { PublicKeyCredentialCreationOptionsJSON, PublicKeyCredentialRequestOptionsJSON } from '@simplewebauthn/server';

import type { Shared_Administrator, Shared_WebauthnConfiguration } from '../shared.d.ts';

/**
 * Lib - Passkeys - Administrator Passkeys - Creates Anonymous Authentication Options Without A Credential Allow List.
 *
 * @since 1.0.0
 */
export type Lib_Passkeys_AdministratorPasskeys_CreatesAnonymousAuthenticationOptionsWithoutACredentialAllowList_Configuration = Shared_WebauthnConfiguration;

export type Lib_Passkeys_AdministratorPasskeys_CreatesAnonymousAuthenticationOptionsWithoutACredentialAllowList_Options = PublicKeyCredentialRequestOptionsJSON;

/**
 * Lib - Passkeys - Administrator Passkeys - Creates Discoverable Registration Options With Required User Verification.
 *
 * @since 1.0.0
 */
export type Lib_Passkeys_AdministratorPasskeys_CreatesDiscoverableRegistrationOptionsWithRequiredUserVerification_Configuration = Shared_WebauthnConfiguration;

export type Lib_Passkeys_AdministratorPasskeys_CreatesDiscoverableRegistrationOptionsWithRequiredUserVerification_Administrator = Shared_Administrator;

export type Lib_Passkeys_AdministratorPasskeys_CreatesDiscoverableRegistrationOptionsWithRequiredUserVerification_Options = PublicKeyCredentialCreationOptionsJSON;

export type Lib_Passkeys_AdministratorPasskeys_CreatesDiscoverableRegistrationOptionsWithRequiredUserVerification_UserHandle = string;

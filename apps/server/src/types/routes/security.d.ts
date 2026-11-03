import type {
  Express,
  Request,
  Response,
} from 'express';
import type { z } from 'zod';

import type { Runner as Access } from '../../lib/access.js';
import type { Runner as Attempts } from '../../lib/attempts.js';
import type {
  passkeyRegistrationStart,
  passkeyRegistrationVerify,
  passwordChange,
  passwordConfirmation,
  totpEnable,
  usernameChange,
} from '../../lib/schema.js';
import type { Runner as State } from '../../lib/state.js';
import type { Lib_Passkeys_CreatePasskeyRegistrationOptions_Returns } from '../lib/passkeys.d.ts';
import type {
  Lib_State_Runner_ChangeAdministratorUsername_Returns,
  Lib_State_Runner_CreatePasskey_Returns,
  Lib_State_Runner_DisableTotp_Returns,
  Lib_State_Runner_EnableTotp_Returns,
  Lib_State_Runner_RemovePasskey_Returns,
  Lib_State_Runner_ReplaceRecoveryCodes_Returns,
  Lib_State_Runner_TakeWebauthnCeremony_Returns,
} from '../lib/state.d.ts';
import type {
  Shared_Administrator,
  Shared_AdministratorPasskeySummary,
  Shared_BrowserSession,
  Shared_VerifiedPasskeyCredential,
  Shared_WebauthnConfiguration,
} from '../shared.d.ts';

/**
 * Routes - Security - Runner - Access.
 *
 * @since 1.0.0
 */
export type Routes_Security_Runner_Access = Access;

/**
 * Routes - Security - Runner - Attempts.
 *
 * @since 1.0.0
 */
export type Routes_Security_Runner_Attempts = Attempts;

/**
 * Routes - Security - Runner - Confirm Password.
 *
 * @since 1.0.0
 */
export type Routes_Security_Runner_ConfirmPassword_Request = Request;

export type Routes_Security_Runner_ConfirmPassword_Response = Response;

export type Routes_Security_Runner_ConfirmPassword_Password = string;

export type Routes_Security_Runner_ConfirmPassword_Field = 'currentPassword' | 'password';

export type Routes_Security_Runner_ConfirmPassword_Returns = Promise<boolean>;

export type Routes_Security_Runner_ConfirmPassword_AttemptKey = string;

export type Routes_Security_Runner_ConfirmPassword_Session = Shared_BrowserSession;

export type Routes_Security_Runner_ConfirmPassword_RetryAfterSeconds = number;

export type Routes_Security_Runner_ConfirmPassword_IsValid = boolean;

/**
 * Routes - Security - Runner - Constructor.
 *
 * @since 1.0.0
 */
export type Routes_Security_Runner_Constructor_State = State;

export type Routes_Security_Runner_Constructor_Access = Access;

export type Routes_Security_Runner_Constructor_Attempts = Attempts;

/**
 * Routes - Security - Runner - Register.
 *
 * @since 1.0.0
 */
export type Routes_Security_Runner_Register_App = Express;

export type Routes_Security_Runner_Register_Returns = void;

/**
 * Routes - Security - Runner - Route Change Password.
 *
 * @since 1.0.0
 */
export type Routes_Security_Runner_RouteChangePassword_Request = Request;

export type Routes_Security_Runner_RouteChangePassword_Response = Response;

export type Routes_Security_Runner_RouteChangePassword_Returns = Promise<void>;

export type Routes_Security_Runner_RouteChangePassword_RequestBody = z.ZodSafeParseResult<z.infer<typeof passwordChange>>;

export type Routes_Security_Runner_RouteChangePassword_Session = Shared_BrowserSession;

/**
 * Routes - Security - Runner - Route Change Username.
 *
 * @since 1.0.0
 */
export type Routes_Security_Runner_RouteChangeUsername_Request = Request;

export type Routes_Security_Runner_RouteChangeUsername_Response = Response;

export type Routes_Security_Runner_RouteChangeUsername_Returns = Promise<void>;

export type Routes_Security_Runner_RouteChangeUsername_RequestBody = z.ZodSafeParseResult<z.infer<typeof usernameChange>>;

export type Routes_Security_Runner_RouteChangeUsername_Session = Shared_BrowserSession;

export type Routes_Security_Runner_RouteChangeUsername_Result = Lib_State_Runner_ChangeAdministratorUsername_Returns;

/**
 * Routes - Security - Runner - Route Delete Passkey.
 *
 * @since 1.0.0
 */
export type Routes_Security_Runner_RouteDeletePasskey_Request = Request;

export type Routes_Security_Runner_RouteDeletePasskey_Response = Response;

export type Routes_Security_Runner_RouteDeletePasskey_Returns = Promise<void>;

export type Routes_Security_Runner_RouteDeletePasskey_PasskeyId = string | undefined;

export type Routes_Security_Runner_RouteDeletePasskey_RequestBody = z.ZodSafeParseResult<z.infer<typeof passwordConfirmation>>;

export type Routes_Security_Runner_RouteDeletePasskey_Session = Shared_BrowserSession;

export type Routes_Security_Runner_RouteDeletePasskey_Result = Lib_State_Runner_RemovePasskey_Returns;

/**
 * Routes - Security - Runner - Route Disable Totp.
 *
 * @since 1.0.0
 */
export type Routes_Security_Runner_RouteDisableTotp_Request = Request;

export type Routes_Security_Runner_RouteDisableTotp_Response = Response;

export type Routes_Security_Runner_RouteDisableTotp_Returns = Promise<void>;

export type Routes_Security_Runner_RouteDisableTotp_RequestBody = z.ZodSafeParseResult<z.infer<typeof passwordConfirmation>>;

export type Routes_Security_Runner_RouteDisableTotp_Session = Shared_BrowserSession;

export type Routes_Security_Runner_RouteDisableTotp_Result = Lib_State_Runner_DisableTotp_Returns;

/**
 * Routes - Security - Runner - Route Enable Totp.
 *
 * @since 1.0.0
 */
export type Routes_Security_Runner_RouteEnableTotp_Request = Request;

export type Routes_Security_Runner_RouteEnableTotp_Response = Response;

export type Routes_Security_Runner_RouteEnableTotp_Returns = void;

export type Routes_Security_Runner_RouteEnableTotp_RequestBody = z.ZodSafeParseResult<z.infer<typeof totpEnable>>;

export type Routes_Security_Runner_RouteEnableTotp_Session = Shared_BrowserSession;

export type Routes_Security_Runner_RouteEnableTotp_Secret = string | undefined;

export type Routes_Security_Runner_RouteEnableTotp_MatchedStep = number | undefined;

export type Routes_Security_Runner_RouteEnableTotp_RecoveryCodes = Lib_State_Runner_EnableTotp_Returns;

/**
 * Routes - Security - Runner - Route Passkey Options.
 *
 * @since 1.0.0
 */
export type Routes_Security_Runner_RoutePasskeyOptions_Request = Request;

export type Routes_Security_Runner_RoutePasskeyOptions_Response = Response;

export type Routes_Security_Runner_RoutePasskeyOptions_Returns = Promise<void>;

export type Routes_Security_Runner_RoutePasskeyOptions_RequestBody = z.ZodSafeParseResult<z.infer<typeof passkeyRegistrationStart>>;

export type Routes_Security_Runner_RoutePasskeyOptions_Session = Shared_BrowserSession;

export type Routes_Security_Runner_RoutePasskeyOptions_Administrator = Shared_Administrator | undefined;

export type Routes_Security_Runner_RoutePasskeyOptions_Configuration = Shared_WebauthnConfiguration;

export type Routes_Security_Runner_RoutePasskeyOptions_Options = Awaited<Lib_Passkeys_CreatePasskeyRegistrationOptions_Returns>;

export type Routes_Security_Runner_RoutePasskeyOptions_CeremonyId = string;

/**
 * Routes - Security - Runner - Route Passkey Verify.
 *
 * @since 1.0.0
 */
export type Routes_Security_Runner_RoutePasskeyVerify_Request = Request;

export type Routes_Security_Runner_RoutePasskeyVerify_Response = Response;

export type Routes_Security_Runner_RoutePasskeyVerify_Returns = Promise<void>;

export type Routes_Security_Runner_RoutePasskeyVerify_RequestBody = z.ZodSafeParseResult<z.infer<typeof passkeyRegistrationVerify>>;

export type Routes_Security_Runner_RoutePasskeyVerify_Session = Shared_BrowserSession;

export type Routes_Security_Runner_RoutePasskeyVerify_Ceremony = Lib_State_Runner_TakeWebauthnCeremony_Returns;

export type Routes_Security_Runner_RoutePasskeyVerify_Configuration = Shared_WebauthnConfiguration;

export type Routes_Security_Runner_RoutePasskeyVerify_Credential = Shared_VerifiedPasskeyCredential | undefined;

export type Routes_Security_Runner_RoutePasskeyVerify_Name = string;

export type Routes_Security_Runner_RoutePasskeyVerify_Result = Lib_State_Runner_CreatePasskey_Returns;

export type Routes_Security_Runner_RoutePasskeyVerify_Passkey = Shared_AdministratorPasskeySummary | undefined;

/**
 * Routes - Security - Runner - Route Recovery Codes.
 *
 * @since 1.0.0
 */
export type Routes_Security_Runner_RouteRecoveryCodes_Request = Request;

export type Routes_Security_Runner_RouteRecoveryCodes_Response = Response;

export type Routes_Security_Runner_RouteRecoveryCodes_Returns = Promise<void>;

export type Routes_Security_Runner_RouteRecoveryCodes_RequestBody = z.ZodSafeParseResult<z.infer<typeof passwordConfirmation>>;

export type Routes_Security_Runner_RouteRecoveryCodes_Session = Shared_BrowserSession;

export type Routes_Security_Runner_RouteRecoveryCodes_RecoveryCodes = Lib_State_Runner_ReplaceRecoveryCodes_Returns;

/**
 * Routes - Security - Runner - Route Security.
 *
 * @since 1.0.0
 */
export type Routes_Security_Runner_RouteSecurity_Request = Request;

export type Routes_Security_Runner_RouteSecurity_Response = Response;

export type Routes_Security_Runner_RouteSecurity_Returns = void;

export type Routes_Security_Runner_RouteSecurity_Session = Shared_BrowserSession;

/**
 * Routes - Security - Runner - Route Totp Setup.
 *
 * @since 1.0.0
 */
export type Routes_Security_Runner_RouteTotpSetup_Request = Request;

export type Routes_Security_Runner_RouteTotpSetup_Response = Response;

export type Routes_Security_Runner_RouteTotpSetup_Returns = Promise<void>;

export type Routes_Security_Runner_RouteTotpSetup_RequestBody = z.ZodSafeParseResult<z.infer<typeof passwordConfirmation>>;

export type Routes_Security_Runner_RouteTotpSetup_Session = Shared_BrowserSession;

export type Routes_Security_Runner_RouteTotpSetup_Secret = string;

export type Routes_Security_Runner_RouteTotpSetup_Uri = string;

export type Routes_Security_Runner_RouteTotpSetup_QrCode = string;

export type Routes_Security_Runner_RouteTotpSetup_ExpiresAt = string;

/**
 * Routes - Security - Runner - State.
 *
 * @since 1.0.0
 */
export type Routes_Security_Runner_State = State;

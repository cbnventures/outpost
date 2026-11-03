import type {
  Express,
  Request,
  Response,
} from 'express';
import type { z } from 'zod';

import type { Runner as Access } from '../../lib/access.js';
import type { Runner as Attempts } from '../../lib/attempts.js';
import type {
  passkeySignInVerify,
  setupClaim,
  signIn,
  signInSecondFactor,
} from '../../lib/schema.js';
import type { Runner as State } from '../../lib/state.js';
import type {
  Lib_Passkeys_CreatePasskeyAuthenticationOptions_Returns,
  Lib_Passkeys_VerifyPasskeyAuthentication_Result,
} from '../lib/passkeys.d.ts';
import type {
  Lib_State_Runner_ClaimInstallation_Returns,
  Lib_State_Runner_CreateSignInChallenge_Returns,
  Lib_State_Runner_GetSignInChallenge_Returns,
  Lib_State_Runner_TakeWebauthnCeremony_Returns,
  Lib_State_Runner_UpdatePasskeyUsage_Returns,
} from '../lib/state.d.ts';
import type {
  Shared_Administrator,
  Shared_AdministratorPasskey,
  Shared_AuthenticatedToken,
  Shared_BrowserSession,
  Shared_WebauthnConfiguration,
} from '../shared.d.ts';

/**
 * Routes - Auth - Runner - Access.
 *
 * @since 1.0.0
 */
export type Routes_Auth_Runner_Access = Access;

/**
 * Routes - Auth - Runner - Attempts.
 *
 * @since 1.0.0
 */
export type Routes_Auth_Runner_Attempts = Attempts;

/**
 * Routes - Auth - Runner - Constructor.
 *
 * @since 1.0.0
 */
export type Routes_Auth_Runner_Constructor_State = State;

export type Routes_Auth_Runner_Constructor_Access = Access;

export type Routes_Auth_Runner_Constructor_Attempts = Attempts;

/**
 * Routes - Auth - Runner - Is Rate Limited.
 *
 * @since 1.0.0
 */
export type Routes_Auth_Runner_IsRateLimited_Response = Response;

export type Routes_Auth_Runner_IsRateLimited_Key = string;

export type Routes_Auth_Runner_IsRateLimited_Message = string;

export type Routes_Auth_Runner_IsRateLimited_Returns = boolean;

export type Routes_Auth_Runner_IsRateLimited_RetryAfterSeconds = number;

/**
 * Routes - Auth - Runner - Register.
 *
 * @since 1.0.0
 */
export type Routes_Auth_Runner_Register_App = Express;

export type Routes_Auth_Runner_Register_Returns = void;

/**
 * Routes - Auth - Runner - Reject Passkey.
 *
 * @since 1.0.0
 */
export type Routes_Auth_Runner_RejectPasskey_Response = Response;

export type Routes_Auth_Runner_RejectPasskey_Key = string;

export type Routes_Auth_Runner_RejectPasskey_Message = string;

export type Routes_Auth_Runner_RejectPasskey_Returns = void;

/**
 * Routes - Auth - Runner - Route Claim.
 *
 * @since 1.0.0
 */
export type Routes_Auth_Runner_RouteClaim_Request = Request;

export type Routes_Auth_Runner_RouteClaim_Response = Response;

export type Routes_Auth_Runner_RouteClaim_Returns = Promise<void>;

export type Routes_Auth_Runner_RouteClaim_AttemptKey = string;

export type Routes_Auth_Runner_RouteClaim_RequestBody = z.ZodSafeParseResult<z.infer<typeof setupClaim>>;

export type Routes_Auth_Runner_RouteClaim_Result = Awaited<Lib_State_Runner_ClaimInstallation_Returns>;

/**
 * Routes - Auth - Runner - Route Current Principal.
 *
 * @since 1.0.0
 */
export type Routes_Auth_Runner_RouteCurrentPrincipal_Request = Request;

export type Routes_Auth_Runner_RouteCurrentPrincipal_Response = Response;

export type Routes_Auth_Runner_RouteCurrentPrincipal_Returns = void;

export type Routes_Auth_Runner_RouteCurrentPrincipal_PersonalAccessToken = Shared_AuthenticatedToken | undefined;

export type Routes_Auth_Runner_RouteCurrentPrincipal_Session = Shared_BrowserSession | undefined;

/**
 * Routes - Auth - Runner - Route Dismiss Removed Secrets.
 *
 * @since 1.0.0
 */
export type Routes_Auth_Runner_RouteDismissRemovedSecrets_Request = Request;

export type Routes_Auth_Runner_RouteDismissRemovedSecrets_Response = Response;

export type Routes_Auth_Runner_RouteDismissRemovedSecrets_Returns = void;

export type Routes_Auth_Runner_RouteDismissRemovedSecrets_Session = Shared_BrowserSession;

/**
 * Routes - Auth - Runner - Route Login.
 *
 * @since 1.0.0
 */
export type Routes_Auth_Runner_RouteLogin_Request = Request;

export type Routes_Auth_Runner_RouteLogin_Response = Response;

export type Routes_Auth_Runner_RouteLogin_Returns = Promise<void>;

export type Routes_Auth_Runner_RouteLogin_AttemptKey = string;

export type Routes_Auth_Runner_RouteLogin_RequestBody = z.ZodSafeParseResult<z.infer<typeof signIn>>;

export type Routes_Auth_Runner_RouteLogin_IsOverlong = boolean;

export type Routes_Auth_Runner_RouteLogin_Administrator = Shared_Administrator | undefined;

export type Routes_Auth_Runner_RouteLogin_Challenge = Lib_State_Runner_CreateSignInChallenge_Returns;

/**
 * Routes - Auth - Runner - Route Logout.
 *
 * @since 1.0.0
 */
export type Routes_Auth_Runner_RouteLogout_Request = Request;

export type Routes_Auth_Runner_RouteLogout_Response = Response;

export type Routes_Auth_Runner_RouteLogout_Returns = void;

export type Routes_Auth_Runner_RouteLogout_Session = Shared_BrowserSession | undefined;

/**
 * Routes - Auth - Runner - Route Passkey Options.
 *
 * @since 1.0.0
 */
export type Routes_Auth_Runner_RoutePasskeyOptions_Request = Request;

export type Routes_Auth_Runner_RoutePasskeyOptions_Response = Response;

export type Routes_Auth_Runner_RoutePasskeyOptions_Returns = Promise<void>;

export type Routes_Auth_Runner_RoutePasskeyOptions_Configuration = Shared_WebauthnConfiguration;

export type Routes_Auth_Runner_RoutePasskeyOptions_Options = Awaited<Lib_Passkeys_CreatePasskeyAuthenticationOptions_Returns>;

export type Routes_Auth_Runner_RoutePasskeyOptions_CeremonyId = string;

/**
 * Routes - Auth - Runner - Route Passkey Verify.
 *
 * @since 1.0.0
 */
export type Routes_Auth_Runner_RoutePasskeyVerify_Request = Request;

export type Routes_Auth_Runner_RoutePasskeyVerify_Response = Response;

export type Routes_Auth_Runner_RoutePasskeyVerify_Returns = Promise<void>;

export type Routes_Auth_Runner_RoutePasskeyVerify_AttemptKey = string;

export type Routes_Auth_Runner_RoutePasskeyVerify_RequestBody = z.ZodSafeParseResult<z.infer<typeof passkeySignInVerify>>;

export type Routes_Auth_Runner_RoutePasskeyVerify_Ceremony = Lib_State_Runner_TakeWebauthnCeremony_Returns;

export type Routes_Auth_Runner_RoutePasskeyVerify_Configuration = Shared_WebauthnConfiguration;

export type Routes_Auth_Runner_RoutePasskeyVerify_Passkey = Shared_AdministratorPasskey | undefined;

export type Routes_Auth_Runner_RoutePasskeyVerify_Verification = Lib_Passkeys_VerifyPasskeyAuthentication_Result | undefined;

export type Routes_Auth_Runner_RoutePasskeyVerify_UpdateResult = Lib_State_Runner_UpdatePasskeyUsage_Returns;

export type Routes_Auth_Runner_RoutePasskeyVerify_Administrator = Shared_Administrator | undefined;

/**
 * Routes - Auth - Runner - Route Second Factor.
 *
 * @since 1.0.0
 */
export type Routes_Auth_Runner_RouteSecondFactor_Request = Request;

export type Routes_Auth_Runner_RouteSecondFactor_Response = Response;

export type Routes_Auth_Runner_RouteSecondFactor_Returns = void;

export type Routes_Auth_Runner_RouteSecondFactor_AttemptKey = string;

export type Routes_Auth_Runner_RouteSecondFactor_RequestBody = z.ZodSafeParseResult<z.infer<typeof signInSecondFactor>>;

export type Routes_Auth_Runner_RouteSecondFactor_Challenge = Lib_State_Runner_GetSignInChallenge_Returns;

export type Routes_Auth_Runner_RouteSecondFactor_IsTotpCode = boolean;

export type Routes_Auth_Runner_RouteSecondFactor_IsOverlong = boolean;

export type Routes_Auth_Runner_RouteSecondFactor_IsValid = boolean;

export type Routes_Auth_Runner_RouteSecondFactor_IsExhausted = boolean;

export type Routes_Auth_Runner_RouteSecondFactor_Administrator = Shared_Administrator | undefined;

/**
 * Routes - Auth - Runner - Route Setup Status.
 *
 * @since 1.0.0
 */
export type Routes_Auth_Runner_RouteSetupStatus_Request = Request;

export type Routes_Auth_Runner_RouteSetupStatus_Response = Response;

export type Routes_Auth_Runner_RouteSetupStatus_Returns = void;

/**
 * Routes - Auth - Runner - State.
 *
 * @since 1.0.0
 */
export type Routes_Auth_Runner_State = State;

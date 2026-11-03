import type {
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from 'express';

import type { Runner as State } from '../../lib/state.js';
import type {
  Shared_Administrator,
  Shared_AuthenticatedToken,
  Shared_BrowserSession,
  Shared_PersonalAccessTokenScope,
} from '../shared.d.ts';
import type {
  Lib_State_Runner_AuthenticateToken_Returns,
  Lib_State_Runner_CreateSession_Returns,
  Lib_State_Runner_GetTokenScopes_Returns,
} from './state.d.ts';

/**
 * Lib - Access - Runner - Clear Session.
 *
 * @since 1.0.0
 */
export type Lib_Access_Runner_ClearSession_Request = Request;

export type Lib_Access_Runner_ClearSession_Response = Response;

export type Lib_Access_Runner_ClearSession_Returns = void;

export type Lib_Access_Runner_ClearSession_Secure = boolean;

/**
 * Lib - Access - Runner - Constructor.
 *
 * @since 1.0.0
 */
export type Lib_Access_Runner_Constructor_State = State;

/**
 * Lib - Access - Runner - Csrf Cookie Name.
 *
 * @since 1.0.0
 */
export type Lib_Access_Runner_CsrfCookieName = string;

/**
 * Lib - Access - Runner - Has Active Principal.
 *
 * @since 1.0.0
 */
export type Lib_Access_Runner_HasActivePrincipal_Response = Response;

export type Lib_Access_Runner_HasActivePrincipal_Scope = Shared_PersonalAccessTokenScope;

export type Lib_Access_Runner_HasActivePrincipal_Returns = boolean;

export type Lib_Access_Runner_HasActivePrincipal_PersonalAccessToken = Shared_AuthenticatedToken | undefined;

export type Lib_Access_Runner_HasActivePrincipal_Session = Shared_BrowserSession | undefined;

export type Lib_Access_Runner_HasActivePrincipal_Scopes = Lib_State_Runner_GetTokenScopes_Returns;

/**
 * Lib - Access - Runner - Has Valid Csrf.
 *
 * @since 1.0.0
 */
export type Lib_Access_Runner_HasValidCsrf_Request = Request;

export type Lib_Access_Runner_HasValidCsrf_Session = Shared_BrowserSession;

export type Lib_Access_Runner_HasValidCsrf_Returns = boolean;

export type Lib_Access_Runner_HasValidCsrf_HeaderToken = string | undefined;

export type Lib_Access_Runner_HasValidCsrf_CookieToken = string | undefined;

/**
 * Lib - Access - Runner - Issue Session.
 *
 * @since 1.0.0
 */
export type Lib_Access_Runner_IssueSession_Request = Request;

export type Lib_Access_Runner_IssueSession_Response = Response;

export type Lib_Access_Runner_IssueSession_Administrator = Shared_Administrator;

export type Lib_Access_Runner_IssueSession_Status = number;

export type Lib_Access_Runner_IssueSession_Returns = void;

export type Lib_Access_Runner_IssueSession_CreatedSession = Lib_State_Runner_CreateSession_Returns;

export type Lib_Access_Runner_IssueSession_MaxAge = number;

export type Lib_Access_Runner_IssueSession_Secure = boolean;

/**
 * Lib - Access - Runner - Require Authentication.
 *
 * @since 1.0.0
 */
export type Lib_Access_Runner_RequireAuthentication_Mutation = boolean;

export type Lib_Access_Runner_RequireAuthentication_Returns = RequestHandler;

export type Lib_Access_Runner_RequireAuthentication_Request = Request;

export type Lib_Access_Runner_RequireAuthentication_Response = Response;

export type Lib_Access_Runner_RequireAuthentication_Next = NextFunction;

export type Lib_Access_Runner_RequireAuthentication_CallbackReturns = void;

export type Lib_Access_Runner_RequireAuthentication_RawToken = string | undefined;

export type Lib_Access_Runner_RequireAuthentication_PersonalAccessToken = Lib_State_Runner_AuthenticateToken_Returns;

/**
 * Lib - Access - Runner - Require Scope.
 *
 * @since 1.0.0
 */
export type Lib_Access_Runner_RequireScope_Scope = Shared_PersonalAccessTokenScope;

export type Lib_Access_Runner_RequireScope_Mutation = boolean;

export type Lib_Access_Runner_RequireScope_Returns = RequestHandler;

export type Lib_Access_Runner_RequireScope_Request = Request;

export type Lib_Access_Runner_RequireScope_Response = Response;

export type Lib_Access_Runner_RequireScope_Next = NextFunction;

export type Lib_Access_Runner_RequireScope_CallbackReturns = void;

export type Lib_Access_Runner_RequireScope_RawToken = string | undefined;

export type Lib_Access_Runner_RequireScope_PersonalAccessToken = Lib_State_Runner_AuthenticateToken_Returns;

export type Lib_Access_Runner_RequireScope_Session = Shared_BrowserSession | undefined;

/**
 * Lib - Access - Runner - Require Session.
 *
 * @since 1.0.0
 */
export type Lib_Access_Runner_RequireSession_Mutation = boolean;

export type Lib_Access_Runner_RequireSession_Returns = RequestHandler;

export type Lib_Access_Runner_RequireSession_Request = Request;

export type Lib_Access_Runner_RequireSession_Response = Response;

export type Lib_Access_Runner_RequireSession_Next = NextFunction;

export type Lib_Access_Runner_RequireSession_CallbackReturns = void;

export type Lib_Access_Runner_RequireSession_Session = Shared_BrowserSession | undefined;

/**
 * Lib - Access - Runner - Require Token.
 *
 * @since 1.0.0
 */
export type Lib_Access_Runner_RequireToken_Scope = Shared_PersonalAccessTokenScope;

export type Lib_Access_Runner_RequireToken_Returns = RequestHandler;

export type Lib_Access_Runner_RequireToken_Request = Request;

export type Lib_Access_Runner_RequireToken_Response = Response;

export type Lib_Access_Runner_RequireToken_Next = NextFunction;

export type Lib_Access_Runner_RequireToken_CallbackReturns = void;

export type Lib_Access_Runner_RequireToken_RawToken = string | undefined;

export type Lib_Access_Runner_RequireToken_PersonalAccessToken = Lib_State_Runner_AuthenticateToken_Returns;

/**
 * Lib - Access - Runner - Resolve Session.
 *
 * @since 1.0.0
 */
export type Lib_Access_Runner_ResolveSession_Request = Request;

export type Lib_Access_Runner_ResolveSession_Returns = Shared_BrowserSession | undefined;

export type Lib_Access_Runner_ResolveSession_SessionToken = string | undefined;

/**
 * Lib - Access - Runner - Session Cookie Name.
 *
 * @since 1.0.0
 */
export type Lib_Access_Runner_SessionCookieName = string;

/**
 * Lib - Access - Runner - State.
 *
 * @since 1.0.0
 */
export type Lib_Access_Runner_State = State;

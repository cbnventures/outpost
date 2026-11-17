import type {
  Express,
  NextFunction,
  Request,
  Response,
} from 'express';

/**
 * Routes - Web - Runner - Allow Caching.
 *
 * @since 1.0.0
 */
export type Routes_Web_Runner_AllowCaching_Request = Request;

export type Routes_Web_Runner_AllowCaching_Response = Response;

export type Routes_Web_Runner_AllowCaching_Next = NextFunction;

export type Routes_Web_Runner_AllowCaching_Returns = void;

/**
 * Routes - Web - Runner - Constructor.
 *
 * @since 1.0.0
 */
export type Routes_Web_Runner_Constructor_Root = string;

/**
 * Routes - Web - Runner - Dashboard Headers.
 *
 * @since 1.0.0
 */
export type Routes_Web_Runner_DashboardHeaders_Request = Request;

export type Routes_Web_Runner_DashboardHeaders_Response = Response;

export type Routes_Web_Runner_DashboardHeaders_Next = NextFunction;

export type Routes_Web_Runner_DashboardHeaders_Returns = void;

/**
 * Routes - Web - Runner - Register.
 *
 * @since 1.0.0
 */
export type Routes_Web_Runner_Register_App = Express;

export type Routes_Web_Runner_Register_Returns = void;

/**
 * Routes - Web - Runner - Register Fallback.
 *
 * @since 1.1.0
 */
export type Routes_Web_Runner_RegisterFallback_App = Express;

export type Routes_Web_Runner_RegisterFallback_Returns = void;

/**
 * Routes - Web - Runner - Root.
 *
 * @since 1.0.0
 */
export type Routes_Web_Runner_Root = string;

/**
 * Routes - Web - Runner - Send Application.
 *
 * @since 1.0.0
 */
export type Routes_Web_Runner_SendApplication_Request = Request;

export type Routes_Web_Runner_SendApplication_Response = Response;

export type Routes_Web_Runner_SendApplication_Returns = void;

/**
 * Routes - Web - Runner - Send Browser Application.
 *
 * @since 1.1.0
 */
export type Routes_Web_Runner_SendBrowserApplication_Request = Request;

export type Routes_Web_Runner_SendBrowserApplication_Response = Response;

export type Routes_Web_Runner_SendBrowserApplication_Next = NextFunction;

export type Routes_Web_Runner_SendBrowserApplication_Returns = void;

export type Routes_Web_Runner_SendBrowserApplication_Preferred = string | false;

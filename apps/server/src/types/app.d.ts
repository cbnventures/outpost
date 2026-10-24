import type {
  Express,
  NextFunction,
  Request,
  Response,
  Router,
} from 'express';

import type { Runner as Scheduler } from '../scheduler.js';

/**
 * App - Create App.
 *
 * @since 0.0.1
 */
export type App_CreateApp_Scheduler = Pick<Scheduler, 'trigger' | 'getState'>;

export type App_CreateApp_ApiToken = string | undefined;

export type App_CreateApp_AdminRouter = Router | undefined;

export type App_CreateApp_TrustProxy = boolean;

export type App_CreateApp_Returns = Express;

export type App_CreateApp_App = Express;

export type App_CreateApp_Authorize = (request: Request, response: Response, next: NextFunction) => void;

export type App_CreateApp_Started = boolean;

export type App_CreateApp_State = ReturnType<Scheduler['getState']>;

/**
 * App - Format Metrics.
 *
 * @since 0.0.1
 */
export type App_FormatMetrics_State = ReturnType<Scheduler['getState']>;

export type App_FormatMetrics_Returns = string;

export type App_FormatMetrics_RunningValue = string;

export type App_FormatMetrics_Line = string;

export type App_FormatMetrics_Lines = App_FormatMetrics_Line[];

/**
 * App - Is Authorized.
 *
 * @since 0.0.1
 */
export type App_IsAuthorized_Header = string | undefined;

export type App_IsAuthorized_ApiToken = string;

export type App_IsAuthorized_Returns = boolean;

export type App_IsAuthorized_Provided = Buffer;

export type App_IsAuthorized_Expected = Buffer;

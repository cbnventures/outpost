import type {
  Express,
  Request,
  Response,
} from 'express';

import type { Runner as Access } from '../../lib/access.js';
import type { Runner as Scheduler } from '../../scheduler.js';
import type { Scheduler_Runner_GetState_Returns } from '../scheduler.d.ts';

/**
 * Routes - Watchtower - Format Metrics.
 *
 * @since 0.0.1
 */
export type Routes_Watchtower_FormatMetrics_State = Scheduler_Runner_GetState_Returns;

export type Routes_Watchtower_FormatMetrics_Returns = string;

export type Routes_Watchtower_FormatMetrics_RunningValue = string;

export type Routes_Watchtower_FormatMetrics_Line = string;

export type Routes_Watchtower_FormatMetrics_Lines = Routes_Watchtower_FormatMetrics_Line[];

/**
 * Routes - Watchtower - Runner - Access.
 *
 * @since 1.0.0
 */
export type Routes_Watchtower_Runner_Access = Access;

/**
 * Routes - Watchtower - Runner - Constructor.
 *
 * @since 1.0.0
 */
export type Routes_Watchtower_Runner_Constructor_Scheduler = Pick<Scheduler, 'getState' | 'trigger'>;

export type Routes_Watchtower_Runner_Constructor_Access = Access;

/**
 * Routes - Watchtower - Runner - Register.
 *
 * @since 1.0.0
 */
export type Routes_Watchtower_Runner_Register_App = Express;

export type Routes_Watchtower_Runner_Register_Returns = void;

/**
 * Routes - Watchtower - Runner - Route Metrics.
 *
 * @since 1.0.0
 */
export type Routes_Watchtower_Runner_RouteMetrics_Request = Request;

export type Routes_Watchtower_Runner_RouteMetrics_Response = Response;

export type Routes_Watchtower_Runner_RouteMetrics_Returns = void;

/**
 * Routes - Watchtower - Runner - Route Status.
 *
 * @since 1.0.0
 */
export type Routes_Watchtower_Runner_RouteStatus_Request = Request;

export type Routes_Watchtower_Runner_RouteStatus_Response = Response;

export type Routes_Watchtower_Runner_RouteStatus_Returns = void;

/**
 * Routes - Watchtower - Runner - Route Update.
 *
 * @since 1.0.0
 */
export type Routes_Watchtower_Runner_RouteUpdate_Request = Request;

export type Routes_Watchtower_Runner_RouteUpdate_Response = Response;

export type Routes_Watchtower_Runner_RouteUpdate_Returns = void;

export type Routes_Watchtower_Runner_RouteUpdate_Started = boolean;

/**
 * Routes - Watchtower - Runner - Scheduler.
 *
 * @since 1.0.0
 */
export type Routes_Watchtower_Runner_Scheduler = Pick<Scheduler, 'getState' | 'trigger'>;

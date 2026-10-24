import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';

import type { Runner as Scheduler } from '../scheduler.js';

/**
 * App - API.
 *
 * @since 0.0.1
 */
export type App_Api_Trigger = Scheduler['trigger'];

export type App_Api_Scheduler = Pick<Scheduler, 'trigger' | 'getState'>;

export type App_Api_BaseUrl_Protected = string;

export type App_Api_BaseUrl_Open = string;

export type App_Api_BaseUrl = {
  protected: App_Api_BaseUrl_Protected;
  open: App_Api_BaseUrl_Open;
};

export type App_Api_Server = Server;

export type App_Api_Servers = App_Api_Server[];

export type App_Api_ProtectedServer = Server;

export type App_Api_OpenServer = Server;

export type App_Api_ProtectedAddress = AddressInfo | string | null;

export type App_Api_OpenAddress = AddressInfo | string | null;

/**
 * App - API - Disables Protected Endpoints Without A Token.
 *
 * @since 0.0.1
 */
export type App_Api_DisablesProtectedEndpointsWithoutAToken_Response = Response;

/**
 * App - API - Protects And Serves The Update Endpoint.
 *
 * @since 0.0.1
 */
export type App_Api_ProtectsAndServesTheUpdateEndpoint_Response = Response;

/**
 * App - Format Metrics - Renders Counters And The Last Cycle.
 *
 * @since 0.0.1
 */
export type App_FormatMetrics_RendersCountersAndTheLastCycle_Metrics = string;

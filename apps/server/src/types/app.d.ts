import type {
  Express,
  NextFunction,
  Request,
  Response,
} from 'express';
import type { RateLimitRequestHandler } from 'express-rate-limit';
import type { DockerContainerInspect, DockerContainerSummary } from 'outpost-package-docker-engine';

import type { Runner as History } from '../history.js';
import type { Runner as Access } from '../lib/access.js';
import type { Runner as Attempts } from '../lib/attempts.js';
import type { Runner as Notifier } from '../lib/notifier.js';
import type { Runner as State } from '../lib/state.js';
import type { Runner as Scheduler } from '../scheduler.js';
import type { Config_LoadConfig_Settings } from './config.d.ts';
import type { Shared_RuntimeSettings } from './shared.d.ts';

/**
 * App - Create App.
 *
 * @since 0.0.1
 */
export type App_CreateApp_Dependencies_Config = Config_LoadConfig_Settings;

export type App_CreateApp_Dependencies_EventHeartbeatMilliseconds = number;

export type App_CreateApp_Dependencies_History = Pick<History, 'list'>;

export type App_CreateApp_Dependencies_InspectContainer = (id: string) => Promise<DockerContainerInspect>;

export type App_CreateApp_Dependencies_ListContainers = () => Promise<DockerContainerSummary[]>;

export type App_CreateApp_Dependencies_Notifier = Notifier;

export type App_CreateApp_Dependencies_Now = () => number;

export type App_CreateApp_Dependencies_OnRuntimeSettingsChanged = (settings: Shared_RuntimeSettings) => void;

export type App_CreateApp_Dependencies_Scheduler = Pick<Scheduler, 'getState' | 'subscribe' | 'trigger'>;

export type App_CreateApp_Dependencies_State = State;

export type App_CreateApp_Dependencies_WebRoot = string;

export type App_CreateApp_Dependencies = {
  config: App_CreateApp_Dependencies_Config;
  eventHeartbeatMilliseconds?: App_CreateApp_Dependencies_EventHeartbeatMilliseconds;
  history: App_CreateApp_Dependencies_History;
  inspectContainer: App_CreateApp_Dependencies_InspectContainer;
  listContainers: App_CreateApp_Dependencies_ListContainers;
  notifier?: App_CreateApp_Dependencies_Notifier;
  now?: App_CreateApp_Dependencies_Now;
  onRuntimeSettingsChanged?: App_CreateApp_Dependencies_OnRuntimeSettingsChanged;
  scheduler: App_CreateApp_Dependencies_Scheduler;
  state: App_CreateApp_Dependencies_State;
  webRoot?: App_CreateApp_Dependencies_WebRoot;
};

export type App_CreateApp_Returns = Express;

export type App_CreateApp_App = Express;

export type App_CreateApp_Access = Access;

export type App_CreateApp_Attempts = Attempts;

export type App_CreateApp_Notifier = Notifier;

export type App_CreateApp_ApiLimiter = RateLimitRequestHandler;

/**
 * App - Handle Error.
 *
 * @since 1.0.0
 */
export type App_HandleError_Error = unknown;

export type App_HandleError_Request = Request;

export type App_HandleError_Response = Response;

export type App_HandleError_Next = NextFunction;

export type App_HandleError_Returns = void;

export type App_HandleError_Type = unknown;

export type App_HandleError_Status = unknown;

export type App_HandleError_ErrorMessage = string;

/**
 * App - Handle Not Found.
 *
 * @since 1.0.0
 */
export type App_HandleNotFound_Request = Request;

export type App_HandleNotFound_Response = Response;

export type App_HandleNotFound_Returns = void;

/**
 * App - Set Base Headers.
 *
 * @since 1.0.0
 */
export type App_SetBaseHeaders_Request = Request;

export type App_SetBaseHeaders_Response = Response;

export type App_SetBaseHeaders_Next = NextFunction;

export type App_SetBaseHeaders_Returns = void;

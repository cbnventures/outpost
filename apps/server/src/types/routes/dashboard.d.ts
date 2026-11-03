import type {
  Express,
  Request,
  Response,
} from 'express';
import type { DockerContainerInspect, DockerContainerSummary } from 'outpost-package-docker-engine';
import type { UpdateResult, UpdaterOptions } from 'outpost-package-updater';
import type { z } from 'zod';

import type { Runner as History } from '../../history.js';
import type { Runner as Access } from '../../lib/access.js';
import type { checkStart, runtimeSettings } from '../../lib/schema.js';
import type { Runner as State } from '../../lib/state.js';
import type { Runner as Scheduler } from '../../scheduler.js';
import type { Config_LoadConfig_Settings } from '../config.d.ts';
import type { Scheduler_Runner_GetState_Returns } from '../scheduler.d.ts';
import type {
  Shared_CheckReport,
  Shared_CheckReports,
  Shared_CheckTrigger,
  Shared_RuntimeSettings,
} from '../shared.d.ts';

/**
 * Routes - Dashboard - Build Container Rows.
 *
 * @since 0.0.1
 */
export type Routes_Dashboard_BuildContainerRows_Containers = DockerContainerSummary[];

export type Routes_Dashboard_BuildContainerRows_Options = Pick<UpdaterOptions, 'labelMode' | 'selfId' | 'monitorOnly'>;

export type Routes_Dashboard_BuildContainerRows_Reports = Shared_CheckReports;

export type Routes_Dashboard_BuildContainerRows_InspectedContainers = DockerContainerInspect[];

export type Routes_Dashboard_BuildContainerRows_Row_Id = string;

export type Routes_Dashboard_BuildContainerRows_Row_Name = string;

export type Routes_Dashboard_BuildContainerRows_Row_Image = string;

export type Routes_Dashboard_BuildContainerRows_Row_State = string;

export type Routes_Dashboard_BuildContainerRows_Row_Managed = boolean;

export type Routes_Dashboard_BuildContainerRows_Row_Note = string;

export type Routes_Dashboard_BuildContainerRows_Row_MonitorOnly = boolean;

export type Routes_Dashboard_BuildContainerRows_Row_Self = boolean;

export type Routes_Dashboard_BuildContainerRows_Row_LastStatus = UpdateResult['status'] | undefined;

export type Routes_Dashboard_BuildContainerRows_Row_LastDetail = string | undefined;

export type Routes_Dashboard_BuildContainerRows_Row_LastCheckedAt = string | undefined;

export type Routes_Dashboard_BuildContainerRows_Row = {
  id: Routes_Dashboard_BuildContainerRows_Row_Id;
  name: Routes_Dashboard_BuildContainerRows_Row_Name;
  image: Routes_Dashboard_BuildContainerRows_Row_Image;
  state: Routes_Dashboard_BuildContainerRows_Row_State;
  managed: Routes_Dashboard_BuildContainerRows_Row_Managed;
  note: Routes_Dashboard_BuildContainerRows_Row_Note;
  self: Routes_Dashboard_BuildContainerRows_Row_Self;
  monitorOnly: Routes_Dashboard_BuildContainerRows_Row_MonitorOnly;
  lastStatus: Routes_Dashboard_BuildContainerRows_Row_LastStatus;
  lastDetail: Routes_Dashboard_BuildContainerRows_Row_LastDetail;
  lastCheckedAt: Routes_Dashboard_BuildContainerRows_Row_LastCheckedAt;
};

export type Routes_Dashboard_BuildContainerRows_Returns = Routes_Dashboard_BuildContainerRows_Row[];

export type Routes_Dashboard_BuildContainerRows_Selection_Candidates = DockerContainerSummary[];

export type Routes_Dashboard_BuildContainerRows_Selection_Skipped = UpdateResult[];

export type Routes_Dashboard_BuildContainerRows_Selection = {
  candidates: Routes_Dashboard_BuildContainerRows_Selection_Candidates;
  skipped: Routes_Dashboard_BuildContainerRows_Selection_Skipped;
};

export type Routes_Dashboard_BuildContainerRows_Name = string;

export type Routes_Dashboard_BuildContainerRows_Labels = Record<string, string>;

export type Routes_Dashboard_BuildContainerRows_Inspected = DockerContainerInspect | undefined;

export type Routes_Dashboard_BuildContainerRows_InspectedNetworkMode = string | undefined;

export type Routes_Dashboard_BuildContainerRows_SummaryNetworkMode = string | undefined;

export type Routes_Dashboard_BuildContainerRows_NetworkMode = string;

export type Routes_Dashboard_BuildContainerRows_InspectedAutoRemove = boolean;

export type Routes_Dashboard_BuildContainerRows_SummaryAutoRemove = boolean;

export type Routes_Dashboard_BuildContainerRows_AutoRemove = boolean;

export type Routes_Dashboard_BuildContainerRows_InspectedConfiguredImage = string | undefined;

export type Routes_Dashboard_BuildContainerRows_ConfiguredImage = string;

export type Routes_Dashboard_BuildContainerRows_Pinned = boolean;

export type Routes_Dashboard_BuildContainerRows_Skipped = UpdateResult | undefined;

export type Routes_Dashboard_BuildContainerRows_Managed = boolean;

export type Routes_Dashboard_BuildContainerRows_IsSelf = boolean;

export type Routes_Dashboard_BuildContainerRows_LastReport = Shared_CheckReport | undefined;

export type Routes_Dashboard_BuildContainerRows_LastResult = UpdateResult | undefined;

export type Routes_Dashboard_BuildContainerRows_Note = string;

/**
 * Routes - Dashboard - Build Settings.
 *
 * @since 0.0.1
 */
export type Routes_Dashboard_BuildSettings_Config = Config_LoadConfig_Settings;

export type Routes_Dashboard_BuildSettings_Returns_Runtime = Shared_RuntimeSettings;

export type Routes_Dashboard_BuildSettings_Returns_System_DataDirectory = string;

export type Routes_Dashboard_BuildSettings_Returns_System_DockerHost = string;

export type Routes_Dashboard_BuildSettings_Returns_System_TimeZone = string;

export type Routes_Dashboard_BuildSettings_Returns_System = {
  dataDirectory: Routes_Dashboard_BuildSettings_Returns_System_DataDirectory;
  dockerHost: Routes_Dashboard_BuildSettings_Returns_System_DockerHost;
  timeZone: Routes_Dashboard_BuildSettings_Returns_System_TimeZone;
};

export type Routes_Dashboard_BuildSettings_Returns = {
  runtime: Routes_Dashboard_BuildSettings_Returns_Runtime;
  system: Routes_Dashboard_BuildSettings_Returns_System;
};

export type Routes_Dashboard_BuildSettings_TimeZone = string;

/**
 * Routes - Dashboard - Runner - Access.
 *
 * @since 1.0.0
 */
export type Routes_Dashboard_Runner_Access = Access;

/**
 * Routes - Dashboard - Runner - Config.
 *
 * @since 1.0.0
 */
export type Routes_Dashboard_Runner_Config = Config_LoadConfig_Settings;

/**
 * Routes - Dashboard - Runner - On Runtime Settings Changed.
 *
 * @since 1.0.0
 */
export type Routes_Dashboard_Runner_OnRuntimeSettingsChanged = ((settings: Shared_RuntimeSettings) => void) | undefined;

/**
 * Routes - Dashboard - Runner - Constructor.
 *
 * @since 1.0.0
 */
export type Routes_Dashboard_Runner_Constructor_Dependencies_Access = Access;

export type Routes_Dashboard_Runner_Constructor_Dependencies_Config = Config_LoadConfig_Settings;

export type Routes_Dashboard_Runner_Constructor_Dependencies_EventHeartbeatMilliseconds = number;

export type Routes_Dashboard_Runner_Constructor_Dependencies_History = Pick<History, 'list'>;

export type Routes_Dashboard_Runner_Constructor_Dependencies_InspectContainer = (id: string) => Promise<DockerContainerInspect>;

export type Routes_Dashboard_Runner_Constructor_Dependencies_ListContainers = () => Promise<DockerContainerSummary[]>;

export type Routes_Dashboard_Runner_Constructor_Dependencies_OnRuntimeSettingsChanged = Routes_Dashboard_Runner_OnRuntimeSettingsChanged;

export type Routes_Dashboard_Runner_Constructor_Dependencies_Scheduler = Pick<Scheduler, 'getState' | 'subscribe' | 'trigger'>;

export type Routes_Dashboard_Runner_Constructor_Dependencies_State = Pick<State, 'setRuntimeSettings'>;

export type Routes_Dashboard_Runner_Constructor_Dependencies = {
  access: Routes_Dashboard_Runner_Constructor_Dependencies_Access;
  config: Routes_Dashboard_Runner_Constructor_Dependencies_Config;
  eventHeartbeatMilliseconds?: Routes_Dashboard_Runner_Constructor_Dependencies_EventHeartbeatMilliseconds;
  history: Routes_Dashboard_Runner_Constructor_Dependencies_History;
  inspectContainer: Routes_Dashboard_Runner_Constructor_Dependencies_InspectContainer;
  listContainers: Routes_Dashboard_Runner_Constructor_Dependencies_ListContainers;
  onRuntimeSettingsChanged?: Routes_Dashboard_Runner_Constructor_Dependencies_OnRuntimeSettingsChanged;
  scheduler: Routes_Dashboard_Runner_Constructor_Dependencies_Scheduler;
  state: Routes_Dashboard_Runner_Constructor_Dependencies_State;
};

/**
 * Routes - Dashboard - Runner - Event Heartbeat Milliseconds.
 *
 * @since 1.0.0
 */
export type Routes_Dashboard_Runner_EventHeartbeatMilliseconds = number;

/**
 * Routes - Dashboard - Runner - Get Overview.
 *
 * @since 1.0.0
 */
export type Routes_Dashboard_Runner_GetOverview_Returns_Schedule = string;

export type Routes_Dashboard_Runner_GetOverview_Returns_TimeZone = string;

export type Routes_Dashboard_Runner_GetOverview_Returns_LabelMode = UpdaterOptions['labelMode'];

export type Routes_Dashboard_Runner_GetOverview_Returns_MonitorOnly = boolean;

export type Routes_Dashboard_Runner_GetOverview_Returns = Scheduler_Runner_GetState_Returns & {
  schedule: Routes_Dashboard_Runner_GetOverview_Returns_Schedule;
  timeZone: Routes_Dashboard_Runner_GetOverview_Returns_TimeZone;
  labelMode: Routes_Dashboard_Runner_GetOverview_Returns_LabelMode;
  monitorOnly: Routes_Dashboard_Runner_GetOverview_Returns_MonitorOnly;
};

/**
 * Routes - Dashboard - Runner - History.
 *
 * @since 1.0.0
 */
export type Routes_Dashboard_Runner_History = Pick<History, 'list'>;

/**
 * Routes - Dashboard - Runner - Inspect Container.
 *
 * @since 1.0.0
 */
export type Routes_Dashboard_Runner_InspectContainer = (id: string) => Promise<DockerContainerInspect>;

/**
 * Routes - Dashboard - Runner - List Containers.
 *
 * @since 1.0.0
 */
export type Routes_Dashboard_Runner_ListContainers = () => Promise<DockerContainerSummary[]>;

/**
 * Routes - Dashboard - Runner - State.
 *
 * @since 1.0.0
 */
export type Routes_Dashboard_Runner_State = Pick<State, 'setRuntimeSettings'>;

/**
 * Routes - Dashboard - Runner - Register.
 *
 * @since 1.0.0
 */
export type Routes_Dashboard_Runner_Register_App = Express;

export type Routes_Dashboard_Runner_Register_Returns = void;

/**
 * Routes - Dashboard - Runner - Route Checks.
 *
 * @since 1.0.0
 */
export type Routes_Dashboard_Runner_RouteChecks_Request = Request;

export type Routes_Dashboard_Runner_RouteChecks_Response = Response;

export type Routes_Dashboard_Runner_RouteChecks_Returns = void;

export type Routes_Dashboard_Runner_RouteChecks_RequestBody = z.ZodSafeParseResult<z.infer<typeof checkStart>>;

export type Routes_Dashboard_Runner_RouteChecks_ContainerId = string | undefined;

export type Routes_Dashboard_Runner_RouteChecks_Trigger = Shared_CheckTrigger;

export type Routes_Dashboard_Runner_RouteChecks_Started = boolean;

/**
 * Routes - Dashboard - Runner - Route Containers.
 *
 * @since 1.0.0
 */
export type Routes_Dashboard_Runner_RouteContainers_Request = Request;

export type Routes_Dashboard_Runner_RouteContainers_Response = Response;

export type Routes_Dashboard_Runner_RouteContainers_Returns = Promise<void>;

export type Routes_Dashboard_Runner_RouteContainers_Containers = DockerContainerSummary[];

export type Routes_Dashboard_Runner_RouteContainers_InspectedContainers = DockerContainerInspect[];

export type Routes_Dashboard_Runner_RouteContainers_ErrorMessage = string;

/**
 * Routes - Dashboard - Runner - Route Events.
 *
 * @since 1.0.0
 */
export type Routes_Dashboard_Runner_RouteEvents_Request = Request;

export type Routes_Dashboard_Runner_RouteEvents_Response = Response;

export type Routes_Dashboard_Runner_RouteEvents_Returns = void;

export type Routes_Dashboard_Runner_RouteEvents_Unsubscribe = () => void;

export type Routes_Dashboard_Runner_RouteEvents_Heartbeat = NodeJS.Timeout;

/**
 * Routes - Dashboard - Runner - Route History.
 *
 * @since 1.0.0
 */
export type Routes_Dashboard_Runner_RouteHistory_Request = Request;

export type Routes_Dashboard_Runner_RouteHistory_Response = Response;

export type Routes_Dashboard_Runner_RouteHistory_Returns = void;

/**
 * Routes - Dashboard - Runner - Route Overview.
 *
 * @since 1.0.0
 */
export type Routes_Dashboard_Runner_RouteOverview_Request = Request;

export type Routes_Dashboard_Runner_RouteOverview_Response = Response;

export type Routes_Dashboard_Runner_RouteOverview_Returns = void;

/**
 * Routes - Dashboard - Runner - Route Settings.
 *
 * @since 1.0.0
 */
export type Routes_Dashboard_Runner_RouteSettings_Request = Request;

export type Routes_Dashboard_Runner_RouteSettings_Response = Response;

export type Routes_Dashboard_Runner_RouteSettings_Returns = void;

/**
 * Routes - Dashboard - Runner - Route Update Settings.
 *
 * @since 1.0.0
 */
export type Routes_Dashboard_Runner_RouteUpdateSettings_Request = Request;

export type Routes_Dashboard_Runner_RouteUpdateSettings_Response = Response;

export type Routes_Dashboard_Runner_RouteUpdateSettings_Returns = void;

export type Routes_Dashboard_Runner_RouteUpdateSettings_RequestBody = z.ZodSafeParseResult<z.infer<typeof runtimeSettings>>;

/**
 * Routes - Dashboard - Runner - Route Status.
 *
 * @since 1.0.0
 */
export type Routes_Dashboard_Runner_RouteStatus_Request = Request;

export type Routes_Dashboard_Runner_RouteStatus_Response = Response;

export type Routes_Dashboard_Runner_RouteStatus_Returns = void;

/**
 * Routes - Dashboard - Runner - Scheduler.
 *
 * @since 1.0.0
 */
export type Routes_Dashboard_Runner_Scheduler = Pick<Scheduler, 'getState' | 'subscribe' | 'trigger'>;

/**
 * Routes - Dashboard - Runner - Write Event.
 *
 * @since 1.0.0
 */
export type Routes_Dashboard_Runner_WriteEvent_Response = Response;

export type Routes_Dashboard_Runner_WriteEvent_Name = 'check' | 'state';

export type Routes_Dashboard_Runner_WriteEvent_Data = unknown;

export type Routes_Dashboard_Runner_WriteEvent_Returns = void;

export type Routes_Dashboard_Runner_WriteEvent_Line = string;

export type Routes_Dashboard_Runner_WriteEvent_Lines = Routes_Dashboard_Runner_WriteEvent_Line[];

import type {
  NextFunction,
  Request,
  Response,
  Router,
} from 'express';
import type { DockerContainerSummary } from 'outpost-package-docker-engine';
import type { UpdateReport, UpdateResult, UpdaterOptions } from 'outpost-package-updater';

import type { Runner as History } from '../history.js';
import type { Runner as Scheduler } from '../scheduler.js';
import type { Runner as Sessions } from '../session.js';
import type { Config_LoadConfig_Settings } from './config.d.ts';

/**
 * Admin - Build Container Rows.
 *
 * @since 0.0.1
 */
export type Admin_BuildContainerRows_Containers = DockerContainerSummary[];

export type Admin_BuildContainerRows_Options = Pick<UpdaterOptions, 'labelMode' | 'selfId' | 'monitorOnly'>;

export type Admin_BuildContainerRows_LastReport = UpdateReport | undefined;

export type Admin_BuildContainerRows_Row_Id = string;

export type Admin_BuildContainerRows_Row_Name = string;

export type Admin_BuildContainerRows_Row_Image = string;

export type Admin_BuildContainerRows_Row_State = string;

export type Admin_BuildContainerRows_Row_Managed = boolean;

export type Admin_BuildContainerRows_Row_Note = string;

export type Admin_BuildContainerRows_Row_MonitorOnly = boolean;

export type Admin_BuildContainerRows_Row_LastStatus = UpdateResult['status'] | undefined;

export type Admin_BuildContainerRows_Row_LastDetail = string | undefined;

export type Admin_BuildContainerRows_Row_LastCheckedAt = string | undefined;

export type Admin_BuildContainerRows_Row = {
  id: Admin_BuildContainerRows_Row_Id;
  name: Admin_BuildContainerRows_Row_Name;
  image: Admin_BuildContainerRows_Row_Image;
  state: Admin_BuildContainerRows_Row_State;
  managed: Admin_BuildContainerRows_Row_Managed;
  note: Admin_BuildContainerRows_Row_Note;
  monitorOnly: Admin_BuildContainerRows_Row_MonitorOnly;
  lastStatus: Admin_BuildContainerRows_Row_LastStatus;
  lastDetail: Admin_BuildContainerRows_Row_LastDetail;
  lastCheckedAt: Admin_BuildContainerRows_Row_LastCheckedAt;
};

export type Admin_BuildContainerRows_Returns = Admin_BuildContainerRows_Row[];

export type Admin_BuildContainerRows_Selection_Candidates = DockerContainerSummary[];

export type Admin_BuildContainerRows_Selection_Skipped = UpdateResult[];

export type Admin_BuildContainerRows_Selection = {
  candidates: Admin_BuildContainerRows_Selection_Candidates;
  skipped: Admin_BuildContainerRows_Selection_Skipped;
};

export type Admin_BuildContainerRows_Name = string;

export type Admin_BuildContainerRows_Labels = Record<string, string>;

export type Admin_BuildContainerRows_Managed = boolean;

export type Admin_BuildContainerRows_IsSelf = boolean;

export type Admin_BuildContainerRows_LastResult = UpdateResult | undefined;

export type Admin_BuildContainerRows_Note = string;

/**
 * Admin - Build Settings.
 *
 * @since 0.0.1
 */
export type Admin_BuildSettings_Config = Config_LoadConfig_Settings;

export type Admin_BuildSettings_Setting_Group = string;

export type Admin_BuildSettings_Setting_Name = string;

export type Admin_BuildSettings_Setting_Value = string;

export type Admin_BuildSettings_Setting = {
  group: Admin_BuildSettings_Setting_Group;
  name: Admin_BuildSettings_Setting_Name;
  value: Admin_BuildSettings_Setting_Value;
};

export type Admin_BuildSettings_Returns = Admin_BuildSettings_Setting[];

export type Admin_BuildSettings_Updater = UpdaterOptions;

export type Admin_BuildSettings_Targets = UpdaterOptions['notificationTargets'];

/**
 * Admin - Create Admin Router.
 *
 * @since 0.0.1
 */
export type Admin_CreateAdminRouter_Dependencies_Sessions = Pick<Sessions, 'isEnabled' | 'login' | 'verify' | 'logout'>;

export type Admin_CreateAdminRouter_Dependencies_Scheduler = Pick<Scheduler, 'trigger' | 'getState'>;

export type Admin_CreateAdminRouter_Dependencies_History = Pick<History, 'list'>;

export type Admin_CreateAdminRouter_Dependencies_ListContainers = () => Promise<DockerContainerSummary[]>;

export type Admin_CreateAdminRouter_Dependencies_Config = Config_LoadConfig_Settings;

export type Admin_CreateAdminRouter_Dependencies_AssetsDirectory = string;

export type Admin_CreateAdminRouter_Dependencies_IndexPath = string;

export type Admin_CreateAdminRouter_Dependencies = {
  sessions: Admin_CreateAdminRouter_Dependencies_Sessions;
  scheduler: Admin_CreateAdminRouter_Dependencies_Scheduler;
  history: Admin_CreateAdminRouter_Dependencies_History;
  listContainers: Admin_CreateAdminRouter_Dependencies_ListContainers;
  config: Admin_CreateAdminRouter_Dependencies_Config;
  assetsDirectory: Admin_CreateAdminRouter_Dependencies_AssetsDirectory;
  indexPath: Admin_CreateAdminRouter_Dependencies_IndexPath;
};

export type Admin_CreateAdminRouter_Returns = Router;

export type Admin_CreateAdminRouter_Router = Router;

export type Admin_CreateAdminRouter_RequireSession = (request: Request, response: Response, next: NextFunction) => void;

export type Admin_CreateAdminRouter_RequireSession_Session = ReturnType<Sessions['verify']>;

export type Admin_CreateAdminRouter_RequireCsrf = (request: Request, response: Response, next: NextFunction) => void;

export type Admin_CreateAdminRouter_RequireCsrf_Provided = Buffer;

export type Admin_CreateAdminRouter_RequireCsrf_Expected = Buffer;

export type Admin_CreateAdminRouter_ApiSession_Session = ReturnType<Sessions['verify']>;

export type Admin_CreateAdminRouter_ApiSession_Body = Record<string, unknown>;

export type Admin_CreateAdminRouter_ApiSession_Result = ReturnType<Sessions['login']>;

export type Admin_CreateAdminRouter_ApiSession_Secure = string;

export type Admin_CreateAdminRouter_ApiContainers_Containers = DockerContainerSummary[];

export type Admin_CreateAdminRouter_ApiContainers_ErrorMessage = string;

export type Admin_CreateAdminRouter_ApiRun_Body = Record<string, unknown>;

export type Admin_CreateAdminRouter_ApiRun_ContainerId = string;

export type Admin_CreateAdminRouter_ApiRun_ContainerIds = Admin_CreateAdminRouter_ApiRun_ContainerId[] | undefined;

export type Admin_CreateAdminRouter_ApiRun_Started = boolean;

/**
 * Admin - Read Session ID.
 *
 * @since 0.0.1
 */
export type Admin_ReadSessionId_Cookie = string | undefined;

export type Admin_ReadSessionId_Returns = string | undefined;

export type Admin_ReadSessionId_SeparatorIndex = number;

export type Admin_ReadSessionId_Name = string;

export type Admin_ReadSessionId_Value = string;

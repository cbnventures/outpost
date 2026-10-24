import type {
  DockerContainerConfig,
  DockerContainerInspect,
  DockerContainerSummary,
  DockerEngine,
  DockerImageInspect,
} from 'outpost-package-docker-engine';
import type { FetchFunction, NotificationTargets } from 'outpost-package-notifiers';
import type { RegistryCredentials } from 'outpost-package-registry';

/**
 * Shared - Container Config.
 *
 * @since 0.0.1
 */
export type Shared_ContainerConfig = DockerContainerConfig;

/**
 * Shared - Container Inspect.
 *
 * @since 0.0.1
 */
export type Shared_ContainerInspect = DockerContainerInspect;

/**
 * Shared - Container Summary.
 *
 * @since 0.0.1
 */
export type Shared_ContainerSummary = DockerContainerSummary;

/**
 * Shared - Image Inspect.
 *
 * @since 0.0.1
 */
export type Shared_ImageInspect = DockerImageInspect;

/**
 * Shared - Engine.
 *
 * @since 0.0.1
 */
export type Shared_Engine = Pick<DockerEngine, 'listContainers' | 'inspectContainer' | 'inspectImage' | 'pullImage' | 'stopContainer' | 'startContainer' | 'renameContainer' | 'removeContainer' | 'createContainer' | 'connectNetwork' | 'removeImage'>;

/**
 * Shared - Label Mode.
 *
 * @since 0.0.1
 */
export type Shared_LabelMode = 'opt-in' | 'opt-out';

/**
 * Shared - Result Status.
 *
 * @since 0.0.1
 */
export type Shared_ResultStatus = 'updated' | 'available' | 'up-to-date' | 'skipped' | 'rolled-back' | 'failed';

/**
 * Shared - Result.
 *
 * @since 0.0.1
 */
export type Shared_Result_Container = string;

export type Shared_Result_Image = string;

export type Shared_Result_Status = Shared_ResultStatus;

export type Shared_Result_Detail = string;

export type Shared_Result = {
  container: Shared_Result_Container;
  image: Shared_Result_Image;
  status: Shared_Result_Status;
  detail: Shared_Result_Detail;
};

/**
 * Shared - Report.
 *
 * @since 0.0.1
 */
export type Shared_Report_StartedAt = string;

export type Shared_Report_FinishedAt = string;

export type Shared_Report_Results = Shared_Result[];

export type Shared_Report = {
  startedAt: Shared_Report_StartedAt;
  finishedAt: Shared_Report_FinishedAt;
  results: Shared_Report_Results;
};

/**
 * Shared - Options.
 *
 * @since 0.0.1
 */
export type Shared_Options_LabelMode = Shared_LabelMode;

export type Shared_Options_MonitorOnly = boolean;

export type Shared_Options_Cleanup = boolean;

export type Shared_Options_StopTimeoutSeconds = number;

export type Shared_Options_HealthTimeoutSeconds = number;

export type Shared_Options_SettleSeconds = number;

export type Shared_Options_SelfId = string | undefined;

export type Shared_Options_DockerConfigPath = string;

export type Shared_Options_NotificationTargets = NotificationTargets;

export type Shared_Options = {
  labelMode: Shared_Options_LabelMode;
  monitorOnly: Shared_Options_MonitorOnly;
  cleanup: Shared_Options_Cleanup;
  stopTimeoutSeconds: Shared_Options_StopTimeoutSeconds;
  healthTimeoutSeconds: Shared_Options_HealthTimeoutSeconds;
  settleSeconds: Shared_Options_SettleSeconds;
  selfId: Shared_Options_SelfId;
  dockerConfigPath: Shared_Options_DockerConfigPath;
  notificationTargets: Shared_Options_NotificationTargets;
};

/**
 * Shared - Dependencies.
 *
 * @since 0.0.1
 */
export type Shared_Dependencies_Engine = Shared_Engine;

export type Shared_Dependencies_FetchFunction = FetchFunction;

export type Shared_Dependencies_Sleep = (milliseconds: number) => Promise<void>;

export type Shared_Dependencies_Now = () => Date;

export type Shared_Dependencies_FindCredentials = (configPath: string, registry: string) => RegistryCredentials | undefined;

export type Shared_Dependencies = {
  engine: Shared_Dependencies_Engine;
  fetchFunction: Shared_Dependencies_FetchFunction;
  sleep: Shared_Dependencies_Sleep;
  now: Shared_Dependencies_Now;
  findCredentials: Shared_Dependencies_FindCredentials;
};

/**
 * Shared - Create Plan.
 *
 * @since 0.0.1
 */
export type Shared_CreatePlan_Name = string;

export type Shared_CreatePlan_Body = Record<string, unknown>;

export type Shared_CreatePlan_ExtraNetwork_Name = string;

export type Shared_CreatePlan_ExtraNetwork_Endpoint = Record<string, unknown>;

export type Shared_CreatePlan_ExtraNetwork = {
  name: Shared_CreatePlan_ExtraNetwork_Name;
  endpoint: Shared_CreatePlan_ExtraNetwork_Endpoint;
};

export type Shared_CreatePlan_ExtraNetworks = Shared_CreatePlan_ExtraNetwork[];

export type Shared_CreatePlan = {
  name: Shared_CreatePlan_Name;
  body: Shared_CreatePlan_Body;
  extraNetworks: Shared_CreatePlan_ExtraNetworks;
};

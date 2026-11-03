import type {
  DockerContainerInspect,
  DockerContainerSummary,
  DockerEngine,
} from 'outpost-package-docker-engine';
import type {
  SelfUpdateRequest,
  UpdateReport,
  UpdateResult,
  UpdateStatus,
} from 'outpost-package-updater';

import type { Runner as Handoff } from '../handoff.js';
import type {
  Handoff_File,
  Handoff_Outcome,
  Handoff_Pending,
} from './handoff.d.ts';
import type { Shared_CheckTrigger } from './shared.d.ts';

/**
 * Self Update.
 *
 * @since 1.0.0
 */
export type SelfUpdate_Identity_Gid = number | undefined;

export type SelfUpdate_Identity_Groups = number[];

export type SelfUpdate_Identity_Uid = number | undefined;

export type SelfUpdate_Identity = {
  gid: SelfUpdate_Identity_Gid;
  groups: SelfUpdate_Identity_Groups;
  uid: SelfUpdate_Identity_Uid;
};

export type SelfUpdate_Settings_Cleanup = boolean;

export type SelfUpdate_Settings_DataDirectory = string;

export type SelfUpdate_Settings_DockerHost = string;

export type SelfUpdate_Settings_HealthTimeoutSeconds = number;

export type SelfUpdate_Settings_Identity = SelfUpdate_Identity;

export type SelfUpdate_Settings_StopTimeoutSeconds = number;

export type SelfUpdate_Settings = {
  cleanup: SelfUpdate_Settings_Cleanup;
  dataDirectory: SelfUpdate_Settings_DataDirectory;
  dockerHost: SelfUpdate_Settings_DockerHost;
  healthTimeoutSeconds: SelfUpdate_Settings_HealthTimeoutSeconds;
  identity: SelfUpdate_Settings_Identity;
  stopTimeoutSeconds: SelfUpdate_Settings_StopTimeoutSeconds;
};

export type SelfUpdate_Context_Engine = Pick<DockerEngine, 'createContainer' | 'inspectContainer' | 'removeContainer' | 'removeImage' | 'startContainer' | 'stopContainer'>;

export type SelfUpdate_Context_Handoff = Pick<Handoff, 'read' | 'settle' | 'write'>;

export type SelfUpdate_Context_Now = () => Date;

export type SelfUpdate_Context_Settings = SelfUpdate_Settings;

export type SelfUpdate_Context_Sleep = (milliseconds: number) => Promise<void>;

export type SelfUpdate_Context = {
  engine: SelfUpdate_Context_Engine;
  handoff: SelfUpdate_Context_Handoff;
  now: SelfUpdate_Context_Now;
  settings: SelfUpdate_Context_Settings;
  sleep: SelfUpdate_Context_Sleep;
};

export type SelfUpdate_HelperPlan_Name = string;

export type SelfUpdate_HelperPlan_Body = Record<string, unknown>;

export type SelfUpdate_HelperPlan = {
  name: SelfUpdate_HelperPlan_Name;
  body: SelfUpdate_HelperPlan_Body;
};

export type SelfUpdate_Mount = NonNullable<DockerContainerInspect['Mounts']>[number];

/**
 * Self Update - Finish Self Update.
 *
 * @since 1.0.0
 */
export type SelfUpdate_FinishSelfUpdate_Pending = Handoff_Pending;

export type SelfUpdate_FinishSelfUpdate_Context = SelfUpdate_Context;

export type SelfUpdate_FinishSelfUpdate_Returns = Promise<UpdateReport>;

export type SelfUpdate_FinishSelfUpdate_Current = Handoff_File | undefined;

export type SelfUpdate_FinishSelfUpdate_Outcome = Handoff_Outcome | undefined;

export type SelfUpdate_FinishSelfUpdate_FailedImageId = string | undefined;

export type SelfUpdate_FinishSelfUpdate_Status = UpdateStatus;

export type SelfUpdate_FinishSelfUpdate_Detail = string;

export type SelfUpdate_FinishSelfUpdate_CleanupNote = string;

export type SelfUpdate_FinishSelfUpdate_CleanupErrorMessage = string;

/**
 * Self Update - Hand Over.
 *
 * @since 1.0.0
 */
export type SelfUpdate_HandOver_Request = SelfUpdateRequest;

export type SelfUpdate_HandOver_Trigger = Shared_CheckTrigger;

export type SelfUpdate_HandOver_Context = SelfUpdate_Context;

export type SelfUpdate_HandOver_Returns = Promise<UpdateResult>;

export type SelfUpdate_HandOver_Name = string;

export type SelfUpdate_HandOver_Current = Handoff_File | undefined;

export type SelfUpdate_HandOver_Row = (status: UpdateStatus, detail: string) => UpdateResult;

export type SelfUpdate_HandOver_Plan = SelfUpdate_HelperPlan | string;

export type SelfUpdate_HandOver_Deadline = string;

export type SelfUpdate_HandOver_HelperId = string | undefined;

export type SelfUpdate_HandOver_ErrorMessage = string;

export type SelfUpdate_HandOver_ExitCode = number | undefined;

export type SelfUpdate_HandOver_Outcome = Handoff_Outcome | undefined;

/**
 * Self Update - Mount Bind.
 *
 * @since 1.0.0
 */
export type SelfUpdate_MountBind_Mount = SelfUpdate_Mount;

export type SelfUpdate_MountBind_Returns = string;

export type SelfUpdate_MountBind_Source = string;

/**
 * Self Update - Plan Helper.
 *
 * @since 1.0.0
 */
export type SelfUpdate_PlanHelper_Container = DockerContainerInspect;

export type SelfUpdate_PlanHelper_Reference = string;

export type SelfUpdate_PlanHelper_Settings = SelfUpdate_Settings;

export type SelfUpdate_PlanHelper_Returns = SelfUpdate_HelperPlan | string;

export type SelfUpdate_PlanHelper_Name = string;

export type SelfUpdate_PlanHelper_Mounts = SelfUpdate_Mount[];

export type SelfUpdate_PlanHelper_DataMount = SelfUpdate_Mount | undefined;

export type SelfUpdate_PlanHelper_Binds = string[];

export type SelfUpdate_PlanHelper_SocketPath = string;

export type SelfUpdate_PlanHelper_SocketMount = SelfUpdate_Mount | undefined;

export type SelfUpdate_PlanHelper_Identity = SelfUpdate_Identity;

/**
 * Self Update - Read Outcome.
 *
 * @since 1.0.0
 */
export type SelfUpdate_ReadOutcome_Handoff = Pick<Handoff, 'read'>;

export type SelfUpdate_ReadOutcome_Returns = Handoff_Outcome | undefined;

export type SelfUpdate_ReadOutcome_File = Handoff_File | undefined;

/**
 * Self Update - Remove Exited Helpers.
 *
 * @since 1.0.0
 */
export type SelfUpdate_RemoveExitedHelpers_Engine = Pick<DockerEngine, 'listContainersByLabel' | 'removeContainer'>;

export type SelfUpdate_RemoveExitedHelpers_Returns = Promise<void>;

export type SelfUpdate_RemoveExitedHelpers_Helpers = DockerContainerSummary[];

/**
 * Self Update - Short Image ID.
 *
 * @since 1.0.0
 */
export type SelfUpdate_ShortImageId_ImageId = string;

export type SelfUpdate_ShortImageId_Returns = string;

/**
 * Self Update - Wait For Exit.
 *
 * @since 1.0.0
 */
export type SelfUpdate_WaitForExit_Name = string;

export type SelfUpdate_WaitForExit_Deadline = string;

export type SelfUpdate_WaitForExit_Context = Pick<SelfUpdate_Context, 'engine' | 'now' | 'sleep'>;

export type SelfUpdate_WaitForExit_Returns = Promise<number | undefined>;

export type SelfUpdate_WaitForExit_Poll = () => Promise<number | undefined>;

export type SelfUpdate_WaitForExit_Inspected = DockerContainerInspect | undefined;

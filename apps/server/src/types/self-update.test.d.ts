import type { DockerContainerInspect, DockerEngine } from 'outpost-package-docker-engine';
import type {
  SelfUpdateRequest,
  UpdateReport,
  UpdateResult,
} from 'outpost-package-updater';
import type { Mock } from 'vitest';

import type { Runner as Handoff } from '../handoff.js';
import type { Handoff_Pending } from './handoff.d.ts';
import type {
  SelfUpdate_Context_Engine,
  SelfUpdate_HelperPlan,
  SelfUpdate_Settings as SelfUpdate_SelfUpdateSettings,
} from './self-update.d.ts';

/**
 * Self Update.
 *
 * @since 1.0.0
 */
export type SelfUpdate_Directory = string;

export type SelfUpdate_Settings = SelfUpdate_SelfUpdateSettings;

export type SelfUpdate_OutpostContainer = DockerContainerInspect;

export type SelfUpdate_Request = SelfUpdateRequest;

export type SelfUpdate_Pending = Handoff_Pending;

export type SelfUpdate_FakeEngine = { [Key in keyof SelfUpdate_Context_Engine]: Mock<SelfUpdate_Context_Engine[Key]> };

export type SelfUpdate_FakeContext_Engine = SelfUpdate_FakeEngine;

export type SelfUpdate_FakeContext_Handoff = Handoff;

export type SelfUpdate_FakeContext_Now = () => Date;

export type SelfUpdate_FakeContext_Settings = SelfUpdate_SelfUpdateSettings;

export type SelfUpdate_FakeContext_Sleep = Mock<(milliseconds: number) => Promise<void>>;

export type SelfUpdate_FakeContext = {
  engine: SelfUpdate_FakeContext_Engine;
  handoff: SelfUpdate_FakeContext_Handoff;
  now: SelfUpdate_FakeContext_Now;
  settings: SelfUpdate_FakeContext_Settings;
  sleep: SelfUpdate_FakeContext_Sleep;
};

/**
 * Self Update - Create Context.
 *
 * @since 1.0.0
 */
export type SelfUpdate_CreateContext_FileName = string;

export type SelfUpdate_CreateContext_HelperExitCode = number | undefined;

export type SelfUpdate_CreateContext_Returns = SelfUpdate_FakeContext;

export type SelfUpdate_CreateContext_Clock = number;

/**
 * Self Update - Finish Self Update - Finishes An Update And Removes The Previous Image.
 *
 * @since 1.0.0
 */
export type SelfUpdate_FinishSelfUpdate_FinishesAnUpdateAndRemovesThePreviousImage_Context = SelfUpdate_FakeContext;

export type SelfUpdate_FinishSelfUpdate_FinishesAnUpdateAndRemovesThePreviousImage_Report = UpdateReport;

/**
 * Self Update - Finish Self Update - Keeps The Helper When It Never Finished.
 *
 * @since 1.0.0
 */
export type SelfUpdate_FinishSelfUpdate_KeepsTheHelperWhenItNeverFinished_Context = SelfUpdate_FakeContext;

export type SelfUpdate_FinishSelfUpdate_KeepsTheHelperWhenItNeverFinished_Report = UpdateReport;

/**
 * Self Update - Finish Self Update - Remembers An Image That Was Rolled Back.
 *
 * @since 1.0.0
 */
export type SelfUpdate_FinishSelfUpdate_RemembersAnImageThatWasRolledBack_Context = SelfUpdate_FakeContext;

export type SelfUpdate_FinishSelfUpdate_RemembersAnImageThatWasRolledBack_Report = UpdateReport;

/**
 * Self Update - Hand Over - Hands Over And Reports A Helper That Stops Early.
 *
 * @since 1.0.0
 */
export type SelfUpdate_HandOver_HandsOverAndReportsAHelperThatStopsEarly_Context = SelfUpdate_FakeContext;

export type SelfUpdate_HandOver_HandsOverAndReportsAHelperThatStopsEarly_Pending = Handoff_Pending | undefined;

export type SelfUpdate_HandOver_HandsOverAndReportsAHelperThatStopsEarly_Result = UpdateResult;

/**
 * Self Update - Hand Over - Skips An Image That Failed To Start Last Time.
 *
 * @since 1.0.0
 */
export type SelfUpdate_HandOver_SkipsAnImageThatFailedToStartLastTime_Context = SelfUpdate_FakeContext;

export type SelfUpdate_HandOver_SkipsAnImageThatFailedToStartLastTime_Result = UpdateResult;

/**
 * Self Update - Plan Helper - Plans A Helper With The Data And Socket Mounts.
 *
 * @since 1.0.0
 */
export type SelfUpdate_PlanHelper_PlansAHelperWithTheDataAndSocketMounts_Plan = SelfUpdate_HelperPlan | string;

/**
 * Self Update - Plan Helper - Refuses Without A Data Volume Or Socket Mount.
 *
 * @since 1.0.0
 */
export type SelfUpdate_PlanHelper_RefusesWithoutADataVolumeOrSocketMount_WithoutData = SelfUpdate_HelperPlan | string;

export type SelfUpdate_PlanHelper_RefusesWithoutADataVolumeOrSocketMount_WithoutSocket = SelfUpdate_HelperPlan | string;

/**
 * Self Update - Remove Exited Helpers - Removes Only Stopped Helpers.
 *
 * @since 1.0.0
 */
export type SelfUpdate_RemoveExitedHelpers_RemovesOnlyStoppedHelpers_Engine = {
  listContainersByLabel: Mock<DockerEngine['listContainersByLabel']>;
  removeContainer: Mock<DockerEngine['removeContainer']>;
};

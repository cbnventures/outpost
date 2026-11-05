import type { Mock } from 'vitest';

import type {
  Shared_Dependencies,
  Shared_Dependencies_UpdateSelf,
  Shared_Engine,
  Shared_ImageInspect,
  Shared_Options,
  Shared_Report,
} from './shared.d.ts';

/**
 * Run.
 *
 * @since 0.0.1
 */
export type Run_Options = Shared_Options;

export type Run_InspectContainer = Shared_Engine['inspectContainer'];

export type Run_InspectImage = Shared_Engine['inspectImage'];

export type Run_FetchFunction = Shared_Dependencies['fetchFunction'];

export type Run_Sleep = Shared_Dependencies['sleep'];

export type Run_UpdateSelf = Shared_Dependencies_UpdateSelf;

export type Run_FakeEngine = { [Key in keyof Shared_Engine]: Mock<Shared_Engine[Key]> };

export type Run_FakeDependencies_Engine = Run_FakeEngine;

export type Run_FakeDependencies_FetchFunction = Mock<Shared_Dependencies['fetchFunction']>;

export type Run_FakeDependencies_Sleep = Mock<Shared_Dependencies['sleep']>;

export type Run_FakeDependencies_Now = Shared_Dependencies['now'];

export type Run_FakeDependencies_FindCredentials = Mock<Shared_Dependencies['findCredentials']>;

export type Run_FakeDependencies_FindRejectedImage = Mock<Shared_Dependencies['findRejectedImage']>;

export type Run_FakeDependencies_RememberRejectedImage = Mock<Shared_Dependencies['rememberRejectedImage']>;

export type Run_FakeDependencies_ForgetRejectedImage = Mock<Shared_Dependencies['forgetRejectedImage']>;

export type Run_FakeDependencies = {
  engine: Run_FakeDependencies_Engine;
  fetchFunction: Run_FakeDependencies_FetchFunction;
  sleep: Run_FakeDependencies_Sleep;
  now: Run_FakeDependencies_Now;
  findCredentials: Run_FakeDependencies_FindCredentials;
  findRejectedImage: Run_FakeDependencies_FindRejectedImage;
  rememberRejectedImage: Run_FakeDependencies_RememberRejectedImage;
  forgetRejectedImage: Run_FakeDependencies_ForgetRejectedImage;
};

/**
 * Run - Create Dependencies.
 *
 * @since 0.0.1
 */
export type Run_CreateDependencies_State_LocalDigest = string;

export type Run_CreateDependencies_State_CurrentRepoDigests = string[] | undefined;

export type Run_CreateDependencies_State_NewRestartCount = number | undefined;

export type Run_CreateDependencies_State_NewRestarting = boolean | undefined;

export type Run_CreateDependencies_State_NewStatus = string | undefined;

export type Run_CreateDependencies_State_ListError = Error | undefined;

export type Run_CreateDependencies_State_CleanupError = Error | undefined;

export type Run_CreateDependencies_State_RemoteDigest = string | undefined;

export type Run_CreateDependencies_State_RemoteStatus = number | undefined;

export type Run_CreateDependencies_State_Identity = Shared_ImageInspect['Identity'];

export type Run_CreateDependencies_State_Descriptor = boolean | undefined;

export type Run_CreateDependencies_State_OldHealth = string | undefined;

export type Run_CreateDependencies_State_NewHealth = string | undefined;

export type Run_CreateDependencies_State = {
  localDigest: Run_CreateDependencies_State_LocalDigest;
  currentRepoDigests?: Run_CreateDependencies_State_CurrentRepoDigests;
  newRestartCount?: Run_CreateDependencies_State_NewRestartCount;
  newRestarting?: Run_CreateDependencies_State_NewRestarting;
  newStatus?: Run_CreateDependencies_State_NewStatus;
  listError?: Run_CreateDependencies_State_ListError;
  cleanupError?: Run_CreateDependencies_State_CleanupError;
  remoteDigest?: Run_CreateDependencies_State_RemoteDigest;
  remoteStatus?: Run_CreateDependencies_State_RemoteStatus;
  identity?: Run_CreateDependencies_State_Identity;
  descriptor?: Run_CreateDependencies_State_Descriptor;
  oldHealth?: Run_CreateDependencies_State_OldHealth;
  newHealth?: Run_CreateDependencies_State_NewHealth;
};

export type Run_CreateDependencies_RunningAfterStart = boolean;

export type Run_CreateDependencies_Returns = Run_FakeDependencies;

export type Run_CreateDependencies_Clock = number;

export type Run_CreateDependencies_NewInspectCount = number;

export type Run_CreateDependencies_IsCreated = boolean;

/**
 * Run - Create Self Dependencies.
 *
 * @since 1.0.0
 */
export type Run_CreateSelfDependencies_WithUpdateSelf = boolean;

export type Run_CreateSelfDependencies_UpdateSelf = Mock<Shared_Dependencies_UpdateSelf>;

export type Run_CreateSelfDependencies_Returns = Run_FakeDependencies & {
  updateSelf?: Run_CreateSelfDependencies_UpdateSelf;
};

export type Run_CreateSelfDependencies_Clock = number;

/**
 * Run - Run Update Cycle - Checks Pulled Images On The Containerd Image Store.
 *
 * @since 1.0.0
 */
export type Run_RunUpdateCycle_ChecksPulledImagesOnTheContainerdImageStore_Dependencies = Run_FakeDependencies;

export type Run_RunUpdateCycle_ChecksPulledImagesOnTheContainerdImageStore_UntaggedDependencies = Run_FakeDependencies;

export type Run_RunUpdateCycle_ChecksPulledImagesOnTheContainerdImageStore_RolledBackDependencies = Run_FakeDependencies;

export type Run_RunUpdateCycle_ChecksPulledImagesOnTheContainerdImageStore_OlderDependencies = Run_FakeDependencies;

export type Run_RunUpdateCycle_ChecksPulledImagesOnTheContainerdImageStore_Report = Shared_Report;

export type Run_RunUpdateCycle_ChecksPulledImagesOnTheContainerdImageStore_UntaggedReport = Shared_Report;

export type Run_RunUpdateCycle_ChecksPulledImagesOnTheContainerdImageStore_RolledBackReport = Shared_Report;

export type Run_RunUpdateCycle_ChecksPulledImagesOnTheContainerdImageStore_OlderReport = Shared_Report;

/**
 * Run - Run Update Cycle - Hands Outpost To Update Self After The Other Containers.
 *
 * @since 1.0.0
 */
export type Run_RunUpdateCycle_HandsOutpostToUpdateSelfAfterTheOtherContainers_Dependencies = Run_CreateSelfDependencies_Returns;

export type Run_RunUpdateCycle_HandsOutpostToUpdateSelfAfterTheOtherContainers_Report = Shared_Report;

/**
 * Run - Run Update Cycle - Keeps An Unhealthy Replacement When The Old Container Was Unhealthy.
 *
 * @since 1.0.3
 */
export type Run_RunUpdateCycle_KeepsAnUnhealthyReplacementWhenTheOldContainerWasUnhealthy_Dependencies = Run_FakeDependencies;

export type Run_RunUpdateCycle_KeepsAnUnhealthyReplacementWhenTheOldContainerWasUnhealthy_Report = Shared_Report;

/**
 * Run - Run Update Cycle - Keeps Checking Pulled Images That The Registry Turns Away.
 *
 * @since 1.0.0
 */
export type Run_RunUpdateCycle_KeepsCheckingPulledImagesThatTheRegistryTurnsAway_Dependencies = Run_FakeDependencies;

export type Run_RunUpdateCycle_KeepsCheckingPulledImagesThatTheRegistryTurnsAway_Report = Shared_Report;

/**
 * Run - Run Update Cycle - Looks Up Each Registry Sign In Once Per Cycle.
 *
 * @since 1.0.0
 */
export type Run_RunUpdateCycle_LooksUpEachRegistrySignInOncePerCycle_Dependencies = Run_CreateSelfDependencies_Returns;

/**
 * Run - Run Update Cycle - Remembers An Image That Rolls Back.
 *
 * @since 1.0.3
 */
export type Run_RunUpdateCycle_RemembersAnImageThatRollsBack_Dependencies = Run_FakeDependencies;

export type Run_RunUpdateCycle_RemembersAnImageThatRollsBack_Report = Shared_Report;

/**
 * Run - Run Update Cycle - Retries A Rolled Back Image When A Check Names The Container.
 *
 * @since 1.0.3
 */
export type Run_RunUpdateCycle_RetriesARolledBackImageWhenACheckNamesTheContainer_Dependencies = Run_FakeDependencies;

export type Run_RunUpdateCycle_RetriesARolledBackImageWhenACheckNamesTheContainer_Report = Shared_Report;

/**
 * Run - Run Update Cycle - Rolls Back An Unhealthy Replacement Of A Healthy Container.
 *
 * @since 1.0.3
 */
export type Run_RunUpdateCycle_RollsBackAnUnhealthyReplacementOfAHealthyContainer_Dependencies = Run_FakeDependencies;

export type Run_RunUpdateCycle_RollsBackAnUnhealthyReplacementOfAHealthyContainer_Report = Shared_Report;

/**
 * Run - Run Update Cycle - Rolls Back When The New Container Stops.
 *
 * @since 0.0.1
 */
export type Run_RunUpdateCycle_RollsBackWhenTheNewContainerStops_Dependencies = Run_FakeDependencies;

export type Run_RunUpdateCycle_RollsBackWhenTheNewContainerStops_Report = Shared_Report;

/**
 * Run - Run Update Cycle - Rolls Back When The Replacement Restarts.
 *
 * @since 1.0.0
 */
export type Run_RunUpdateCycle_RollsBackWhenTheReplacementRestarts_Dependencies = Run_FakeDependencies;

export type Run_RunUpdateCycle_RollsBackWhenTheReplacementRestarts_Report = Shared_Report;

/**
 * Run - Run Update Cycle - Reports A Cycle Failure And Notifies.
 *
 * @since 1.0.0
 */
export type Run_RunUpdateCycle_ReportsACycleFailure_Dependencies = Run_FakeDependencies;

export type Run_RunUpdateCycle_ReportsACycleFailure_Report = Shared_Report;

/**
 * Run - Run Update Cycle - Reports Updated When Cleanup Fails.
 *
 * @since 1.0.0
 */
export type Run_RunUpdateCycle_ReportsUpdatedWhenCleanupFails_Dependencies = Run_FakeDependencies;

export type Run_RunUpdateCycle_ReportsUpdatedWhenCleanupFails_Report = Shared_Report;

/**
 * Run - Run Update Cycle - Skips An Image That Was Rolled Back.
 *
 * @since 1.0.3
 */
export type Run_RunUpdateCycle_SkipsAnImageThatWasRolledBack_Dependencies = Run_FakeDependencies;

export type Run_RunUpdateCycle_SkipsAnImageThatWasRolledBack_Report = Shared_Report;

/**
 * Run - Run Update Cycle - Skips Images Of Unknown Origin That The Registry Lacks.
 *
 * @since 1.0.0
 */
export type Run_RunUpdateCycle_SkipsImagesOfUnknownOriginThatTheRegistryLacks_Dependencies = Run_FakeDependencies;

export type Run_RunUpdateCycle_SkipsImagesOfUnknownOriginThatTheRegistryLacks_RefusedDependencies = Run_FakeDependencies;

export type Run_RunUpdateCycle_SkipsImagesOfUnknownOriginThatTheRegistryLacks_Report = Shared_Report;

export type Run_RunUpdateCycle_SkipsImagesOfUnknownOriginThatTheRegistryLacks_RefusedReport = Shared_Report;

/**
 * Run - Run Update Cycle - Skips Images That Docker Built On This Host.
 *
 * @since 1.0.0
 */
export type Run_RunUpdateCycle_SkipsImagesThatDockerBuiltOnThisHost_Dependencies = Run_FakeDependencies;

export type Run_RunUpdateCycle_SkipsImagesThatDockerBuiltOnThisHost_ClassicDependencies = Run_FakeDependencies;

export type Run_RunUpdateCycle_SkipsImagesThatDockerBuiltOnThisHost_Report = Shared_Report;

export type Run_RunUpdateCycle_SkipsImagesThatDockerBuiltOnThisHost_ClassicReport = Shared_Report;

/**
 * Run - Run Update Cycle - Skips Outpost When Nothing Can Update It.
 *
 * @since 1.0.0
 */
export type Run_RunUpdateCycle_SkipsOutpostWhenNothingCanUpdateIt_Dependencies = Run_CreateSelfDependencies_Returns;

export type Run_RunUpdateCycle_SkipsOutpostWhenNothingCanUpdateIt_Report = Shared_Report;

/**
 * Run - Run Update Cycle - Skips Pulling When The Digest Matches.
 *
 * @since 0.0.1
 */
export type Run_RunUpdateCycle_SkipsPullingWhenTheDigestMatches_Dependencies = Run_FakeDependencies;

export type Run_RunUpdateCycle_SkipsPullingWhenTheDigestMatches_Report = Shared_Report;

/**
 * Run - Run Update Cycle - Updates And Cleans Up When A New Image Exists.
 *
 * @since 0.0.1
 */
export type Run_RunUpdateCycle_UpdatesAndCleansUpWhenANewImageExists_Dependencies = Run_FakeDependencies;

export type Run_RunUpdateCycle_UpdatesAndCleansUpWhenANewImageExists_Report = Shared_Report;

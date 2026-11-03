import type {
  ImageReference,
  RegistryCredentials,
  RemoteDigest,
  RemoteDigestStatus,
} from 'outpost-package-registry';

import type {
  Shared_ContainerInspect,
  Shared_ContainerSummary,
  Shared_Dependencies,
  Shared_Engine,
  Shared_ImageInspect,
  Shared_Options,
  Shared_Report,
  Shared_Result,
  Shared_ResultStatus,
} from './shared.d.ts';

/**
 * Run - Check Container.
 *
 * @since 0.0.1
 */
export type Run_CheckContainer_Container = Shared_ContainerSummary;

export type Run_CheckContainer_Options = Shared_Options;

export type Run_CheckContainer_Dependencies = Shared_Dependencies;

export type Run_CheckContainer_CredentialCache = Map<string, RegistryCredentials | undefined>;

export type Run_CheckContainer_Cycle_Results = Shared_Result[];

export type Run_CheckContainer_Cycle_StartedAt = string;

export type Run_CheckContainer_Cycle = {
  results: Run_CheckContainer_Cycle_Results;
  startedAt: Run_CheckContainer_Cycle_StartedAt;
};

export type Run_CheckContainer_Returns = Promise<Shared_Result>;

export type Run_CheckContainer_Engine = Shared_Engine;

export type Run_CheckContainer_Inspected = Shared_ContainerInspect;

export type Run_CheckContainer_Name = string;

export type Run_CheckContainer_Reference = string;

export type Run_CheckContainer_NetworkMode = string;

export type Run_CheckContainer_Target = ImageReference;

export type Run_CheckContainer_Credentials = RegistryCredentials | undefined;

export type Run_CheckContainer_CurrentImage = Shared_ImageInspect | undefined;

export type Run_CheckContainer_Origin = Run_ImageOrigin_Returns;

export type Run_CheckContainer_RemoteDigest = string | undefined;

export type Run_CheckContainer_LookupStatus = RemoteDigestStatus | undefined;

export type Run_CheckContainer_Lookup = RemoteDigest;

export type Run_CheckContainer_MonitorOnly = boolean;

export type Run_CheckContainer_PulledImage = Shared_ImageInspect | undefined;

export type Run_CheckContainer_Outcome_Status = Shared_ResultStatus;

export type Run_CheckContainer_Outcome_Detail = string;

export type Run_CheckContainer_Outcome = {
  status: Run_CheckContainer_Outcome_Status;
  detail: Run_CheckContainer_Outcome_Detail;
};

export type Run_CheckContainer_CleanupNote = string;

export type Run_CheckContainer_CleanupErrorMessage = string;

export type Run_CheckContainer_ImageNote = string;

/**
 * Run - Image Origin.
 *
 * @since 1.0.0
 */
export type Run_ImageOrigin_Image = Shared_ImageInspect;

export type Run_ImageOrigin_Returns = 'built' | 'pulled' | 'unknown';

export type Run_ImageOrigin_Identity = NonNullable<Shared_ImageInspect['Identity']> | undefined;

export type Run_ImageOrigin_Pulls = unknown[];

export type Run_ImageOrigin_Builds = unknown[];

export type Run_ImageOrigin_RepoDigests = string[];

export type Run_ImageOrigin_Descriptor = NonNullable<Shared_ImageInspect['Descriptor']> | undefined;

/**
 * Run - Run Update Cycle.
 *
 * @since 0.0.1
 */
export type Run_RunUpdateCycle_Options = Shared_Options;

export type Run_RunUpdateCycle_Dependencies = Shared_Dependencies;

export type Run_RunUpdateCycle_ContainerId = string;

export type Run_RunUpdateCycle_ContainerIds = Run_RunUpdateCycle_ContainerId[] | undefined;

export type Run_RunUpdateCycle_Returns = Promise<Shared_Report>;

export type Run_RunUpdateCycle_StartedAt = string;

export type Run_RunUpdateCycle_CredentialCache = Map<string, RegistryCredentials | undefined>;

export type Run_RunUpdateCycle_Containers = Shared_ContainerSummary[];

export type Run_RunUpdateCycle_Selection_Candidates = Shared_ContainerSummary[];

export type Run_RunUpdateCycle_Selection_Skipped = Shared_Result[];

export type Run_RunUpdateCycle_Selection = {
  candidates: Run_RunUpdateCycle_Selection_Candidates;
  skipped: Run_RunUpdateCycle_Selection_Skipped;
};

export type Run_RunUpdateCycle_Candidates = Shared_ContainerSummary[];

export type Run_RunUpdateCycle_Ordered = Shared_ContainerSummary[];

export type Run_RunUpdateCycle_Sorted = Shared_ContainerSummary[];

export type Run_RunUpdateCycle_IsSelf = (container: Shared_ContainerSummary) => boolean;

export type Run_RunUpdateCycle_Results = Shared_Result[];

export type Run_RunUpdateCycle_Result = Shared_Result | undefined;

export type Run_RunUpdateCycle_ErrorMessage = string;

export type Run_RunUpdateCycle_Report = Shared_Report | undefined;

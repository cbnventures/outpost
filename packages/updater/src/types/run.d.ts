import type { ImageReference, RegistryCredentials } from 'outpost-package-registry';

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

export type Run_CheckContainer_Returns = Promise<Shared_Result>;

export type Run_CheckContainer_Engine = Shared_Engine;

export type Run_CheckContainer_Inspected = Shared_ContainerInspect;

export type Run_CheckContainer_Name = string;

export type Run_CheckContainer_Reference = string;

export type Run_CheckContainer_NetworkMode = string;

export type Run_CheckContainer_Target = ImageReference;

export type Run_CheckContainer_Credentials = RegistryCredentials | undefined;

export type Run_CheckContainer_CurrentImage = Shared_ImageInspect | undefined;

export type Run_CheckContainer_RemoteDigest = string | undefined;

export type Run_CheckContainer_MonitorOnly = boolean;

export type Run_CheckContainer_ImageNote = string;

export type Run_CheckContainer_PulledImage = Shared_ImageInspect | undefined;

export type Run_CheckContainer_Outcome_Status = Shared_ResultStatus;

export type Run_CheckContainer_Outcome_Detail = string;

export type Run_CheckContainer_Outcome = {
  status: Run_CheckContainer_Outcome_Status;
  detail: Run_CheckContainer_Outcome_Detail;
};

/**
 * Run - Notify Report.
 *
 * @since 0.0.1
 */
export type Run_NotifyReport_Report = Shared_Report;

export type Run_NotifyReport_Options = Shared_Options;

export type Run_NotifyReport_Dependencies = Shared_Dependencies;

export type Run_NotifyReport_Returns = Promise<void>;

export type Run_NotifyReport_Changed = Shared_Result[];

export type Run_NotifyReport_Failed = boolean;

export type Run_NotifyReport_Line = string;

export type Run_NotifyReport_Lines = Run_NotifyReport_Line[];

export type Run_NotifyReport_Noun = string;

export type Run_NotifyReport_Title = string;

export type Run_NotifyReport_Error = string;

export type Run_NotifyReport_Errors = Run_NotifyReport_Error[];

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

export type Run_RunUpdateCycle_Containers = Shared_ContainerSummary[];

export type Run_RunUpdateCycle_Selection_Candidates = Shared_ContainerSummary[];

export type Run_RunUpdateCycle_Selection_Skipped = Shared_Result[];

export type Run_RunUpdateCycle_Selection = {
  candidates: Run_RunUpdateCycle_Selection_Candidates;
  skipped: Run_RunUpdateCycle_Selection_Skipped;
};

export type Run_RunUpdateCycle_Candidates = Shared_ContainerSummary[];

export type Run_RunUpdateCycle_Ordered = Shared_ContainerSummary[];

export type Run_RunUpdateCycle_Results = Shared_Result[];

export type Run_RunUpdateCycle_Result = Shared_Result | undefined;

export type Run_RunUpdateCycle_ErrorMessage = string;

export type Run_RunUpdateCycle_Report = Shared_Report;

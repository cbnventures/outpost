import type { z } from 'zod';

import type { Shared_CheckReport, Shared_CheckTrigger } from './shared.d.ts';

/**
 * Handoff.
 *
 * @since 1.0.0
 */
export type Handoff_Outcome_Detail = string;

export type Handoff_Outcome_FinishedAt = string;

export type Handoff_Outcome_Status = 'failed' | 'rolled-back' | 'updated';

export type Handoff_Outcome = {
  detail: Handoff_Outcome_Detail;
  finishedAt: Handoff_Outcome_FinishedAt;
  status: Handoff_Outcome_Status;
};

export type Handoff_Pending_ContainerId = string;

export type Handoff_Pending_ContainerName = string;

export type Handoff_Pending_Deadline = string;

export type Handoff_Pending_HelperName = string;

export type Handoff_Pending_NewImageId = string;

export type Handoff_Pending_Outcome = Handoff_Outcome | undefined;

export type Handoff_Pending_PreviousImageId = string;

export type Handoff_Pending_Reference = string;

export type Handoff_Pending_Results = Shared_CheckReport['results'];

export type Handoff_Pending_StartedAt = string;

export type Handoff_Pending_Trigger = Shared_CheckTrigger;

export type Handoff_Pending = {
  containerId: Handoff_Pending_ContainerId;
  containerName: Handoff_Pending_ContainerName;
  deadline: Handoff_Pending_Deadline;
  helperName: Handoff_Pending_HelperName;
  newImageId: Handoff_Pending_NewImageId;
  outcome?: Handoff_Pending_Outcome;
  previousImageId: Handoff_Pending_PreviousImageId;
  reference: Handoff_Pending_Reference;
  results: Handoff_Pending_Results;
  startedAt: Handoff_Pending_StartedAt;
  trigger: Handoff_Pending_Trigger;
};

export type Handoff_File_Version = 1;

export type Handoff_File_FailedImageId = string | undefined;

export type Handoff_File_Pending = Handoff_Pending | undefined;

export type Handoff_File = {
  version: Handoff_File_Version;
  failedImageId?: Handoff_File_FailedImageId;
  pending?: Handoff_File_Pending;
};

export type Handoff_Runner_FilePath = string;

/**
 * Handoff - Clear.
 *
 * @since 1.0.0
 */
export type Handoff_Runner_Clear_Returns = void;

/**
 * Handoff - Constructor.
 *
 * @since 1.0.0
 */
export type Handoff_Runner_Constructor_FilePath = string;

/**
 * Handoff - Read.
 *
 * @since 1.0.0
 */
export type Handoff_Runner_Read_Returns = Handoff_File | undefined;

export type Handoff_Runner_Read_Parsed = z.ZodSafeParseResult<Handoff_File>;

/**
 * Handoff - Record Outcome.
 *
 * @since 1.0.0
 */
export type Handoff_Runner_RecordOutcome_Outcome = Handoff_Outcome;

export type Handoff_Runner_RecordOutcome_Returns = void;

export type Handoff_Runner_RecordOutcome_Current = Handoff_File | undefined;

/**
 * Handoff - Settle.
 *
 * @since 1.0.0
 */
export type Handoff_Runner_Settle_FailedImageId = string | undefined;

export type Handoff_Runner_Settle_Returns = void;

/**
 * Handoff - Write.
 *
 * @since 1.0.0
 */
export type Handoff_Runner_Write_Handoff = Handoff_File;

export type Handoff_Runner_Write_Returns = void;

export type Handoff_Runner_Write_TemporaryPath = string;

export type Handoff_Runner_Write_FileMode = number;

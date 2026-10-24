import type { UpdateReport } from 'outpost-package-updater';

import type { Runner as History } from '../history.js';

/**
 * Scheduler.
 *
 * @since 0.0.1
 */
export type Scheduler_Runner_RunCycle = (containerIds: string[] | undefined) => Promise<UpdateReport>;

export type Scheduler_Runner_Running = boolean;

export type Scheduler_Runner_History = Pick<History, 'add' | 'list'>;

export type Scheduler_Runner_GetNextRun = () => Date | undefined;

export type Scheduler_Runner_StartedAt = string | undefined;

export type Scheduler_Runner_LastError = string | undefined;

export type Scheduler_Runner_Totals_Cycles = number;

export type Scheduler_Runner_Totals_Updated = number;

export type Scheduler_Runner_Totals_Failed = number;

export type Scheduler_Runner_Totals = {
  cycles: Scheduler_Runner_Totals_Cycles;
  updated: Scheduler_Runner_Totals_Updated;
  failed: Scheduler_Runner_Totals_Failed;
};

/**
 * Scheduler - Constructor.
 *
 * @since 0.0.1
 */
export type Scheduler_Runner_Constructor_RunCycle = (containerIds: string[] | undefined) => Promise<UpdateReport>;

export type Scheduler_Runner_Constructor_History = Pick<History, 'add' | 'list'>;

export type Scheduler_Runner_Constructor_GetNextRun = () => Date | undefined;

/**
 * Scheduler - Execute.
 *
 * @since 0.0.1
 */
export type Scheduler_Runner_Execute_ContainerIds = string[] | undefined;

export type Scheduler_Runner_Execute_Returns = Promise<void>;

export type Scheduler_Runner_Execute_Report = UpdateReport;

export type Scheduler_Runner_Execute_ErrorMessage = string;

/**
 * Scheduler - Get State.
 *
 * @since 0.0.1
 */
export type Scheduler_Runner_GetState_NextRun = Date | undefined;

export type Scheduler_Runner_GetState_Returns_Running = boolean;

export type Scheduler_Runner_GetState_Returns_StartedAt = string | undefined;

export type Scheduler_Runner_GetState_Returns_NextRun = string | undefined;

export type Scheduler_Runner_GetState_Returns_LastReport = UpdateReport | undefined;

export type Scheduler_Runner_GetState_Returns_LastError = string | undefined;

export type Scheduler_Runner_GetState_Returns_Totals = Scheduler_Runner_Totals;

export type Scheduler_Runner_GetState_Returns = {
  running: Scheduler_Runner_GetState_Returns_Running;
  startedAt: Scheduler_Runner_GetState_Returns_StartedAt;
  nextRun: Scheduler_Runner_GetState_Returns_NextRun;
  lastReport: Scheduler_Runner_GetState_Returns_LastReport;
  lastError: Scheduler_Runner_GetState_Returns_LastError;
  totals: Scheduler_Runner_GetState_Returns_Totals;
};

/**
 * Scheduler - Trigger.
 *
 * @since 0.0.1
 */
export type Scheduler_Runner_Trigger_ContainerIds = string[] | undefined;

export type Scheduler_Runner_Trigger_Returns = boolean;

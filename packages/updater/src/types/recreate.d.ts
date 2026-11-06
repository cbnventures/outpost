import type {
  Shared_ContainerConfig,
  Shared_ContainerInspect,
  Shared_CreatePlan,
  Shared_Dependencies,
  Shared_Engine,
  Shared_Options,
  Shared_ResultStatus,
} from './shared.d.ts';

/**
 * Recreate - Recreate Container.
 *
 * @since 0.0.1
 */
export type Recreate_RecreateContainer_Container = Shared_ContainerInspect;

export type Recreate_RecreateContainer_ImageConfig = Shared_ContainerConfig | undefined;

export type Recreate_RecreateContainer_Reference = string;

export type Recreate_RecreateContainer_Options = Pick<Shared_Options, 'stopTimeoutSeconds' | 'healthTimeoutSeconds' | 'settleSeconds'>;

export type Recreate_RecreateContainer_Dependencies = Pick<Shared_Dependencies, 'engine' | 'sleep' | 'now'>;

export type Recreate_RecreateContainer_Outcome_Status = Shared_ResultStatus;

export type Recreate_RecreateContainer_Outcome_Detail = string;

export type Recreate_RecreateContainer_Outcome = {
  status: Recreate_RecreateContainer_Outcome_Status;
  detail: Recreate_RecreateContainer_Outcome_Detail;
};

export type Recreate_RecreateContainer_Returns = Promise<Recreate_RecreateContainer_Outcome>;

export type Recreate_RecreateContainer_Engine = Shared_Engine;

export type Recreate_RecreateContainer_Plan = Shared_CreatePlan;

export type Recreate_RecreateContainer_PreviousName = string;

export type Recreate_RecreateContainer_PreviousHealth = NonNullable<Shared_ContainerInspect['State']['Health']> | undefined;

export type Recreate_RecreateContainer_PreviouslyUnhealthy = boolean;

export type Recreate_RecreateContainer_Renamed = boolean;

export type Recreate_RecreateContainer_NewId = string | undefined;

export type Recreate_RecreateContainer_Created = Shared_ContainerInspect;

export type Recreate_RecreateContainer_InitialRestartCount = number;

export type Recreate_RecreateContainer_HealthNote = string;

export type Recreate_RecreateContainer_ErrorMessage = string;

export type Recreate_RecreateContainer_RollbackMessage = string;

export type Recreate_RecreateContainer_RollbackErrorMessage = string;

/**
 * Recreate - First Health Answer Seconds.
 *
 * @since 1.0.4
 */
export type Recreate_FirstHealthAnswerSeconds_Healthcheck = NonNullable<Shared_ContainerInspect['Config']['Healthcheck']> | undefined;

export type Recreate_FirstHealthAnswerSeconds_Returns = number;

export type Recreate_FirstHealthAnswerSeconds_Interval = number;

export type Recreate_FirstHealthAnswerSeconds_StartPeriod = number;

/**
 * Recreate - Wait Until Healthy.
 *
 * @since 0.0.1
 */
export type Recreate_WaitUntilHealthy_Id = string;

export type Recreate_WaitUntilHealthy_InitialRestartCount = number;

export type Recreate_WaitUntilHealthy_PreviouslyUnhealthy = boolean;

export type Recreate_WaitUntilHealthy_Options = Pick<Shared_Options, 'healthTimeoutSeconds' | 'settleSeconds'>;

export type Recreate_WaitUntilHealthy_Dependencies = Pick<Shared_Dependencies, 'engine' | 'sleep' | 'now'>;

export type Recreate_WaitUntilHealthy_Returns = Promise<Recreate_WaitUntilHealthy_HealthNote>;

export type Recreate_WaitUntilHealthy_Deadline = number;

export type Recreate_WaitUntilHealthy_SettleDeadline = number;

export type Recreate_WaitUntilHealthy_Poll = () => Promise<Recreate_WaitUntilHealthy_HealthNote>;

export type Recreate_WaitUntilHealthy_Inspected = Shared_ContainerInspect;

export type Recreate_WaitUntilHealthy_RestartCount = number;

export type Recreate_WaitUntilHealthy_HealthStatus = string | undefined;

export type Recreate_WaitUntilHealthy_HealthNote = string;

export type Recreate_WaitUntilHealthy_FirstAnswerSeconds = number;

export type Recreate_WaitUntilHealthy_SlowHealthcheck = boolean;

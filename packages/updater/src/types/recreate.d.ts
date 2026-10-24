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

export type Recreate_RecreateContainer_Renamed = boolean;

export type Recreate_RecreateContainer_NewId = string | undefined;

export type Recreate_RecreateContainer_ErrorMessage = string;

export type Recreate_RecreateContainer_RollbackMessage = string;

export type Recreate_RecreateContainer_RollbackErrorMessage = string;

/**
 * Recreate - Wait Until Healthy.
 *
 * @since 0.0.1
 */
export type Recreate_WaitUntilHealthy_Id = string;

export type Recreate_WaitUntilHealthy_Options = Pick<Shared_Options, 'healthTimeoutSeconds' | 'settleSeconds'>;

export type Recreate_WaitUntilHealthy_Dependencies = Pick<Shared_Dependencies, 'engine' | 'sleep' | 'now'>;

export type Recreate_WaitUntilHealthy_Returns = Promise<void>;

export type Recreate_WaitUntilHealthy_Deadline = number;

export type Recreate_WaitUntilHealthy_SettleDeadline = number;

export type Recreate_WaitUntilHealthy_Poll = () => Promise<void>;

export type Recreate_WaitUntilHealthy_Inspected = Shared_ContainerInspect;

export type Recreate_WaitUntilHealthy_HealthStatus = string | undefined;

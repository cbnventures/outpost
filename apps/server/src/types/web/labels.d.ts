import type {
  Web_Api_CycleAction,
  Web_Api_Overview,
  Web_Api_Report,
  Web_Api_Result,
  Web_Api_ResultStatus,
} from '@/types/web/api.d.ts';
import type {
  Web_Components_ResultCount,
  Web_Components_SchedulerStatus,
} from '@/types/web/components.d.ts';

/**
 * Labels.
 *
 * @since 1.2.1
 */
export type Web_Labels_CheckDuration_Report = Web_Api_Report;
export type Web_Labels_CheckDuration_Returns = number;

/**
 * Labels.
 *
 * @since 1.2.1
 */
export type Web_Labels_CountLabel_Entry = Web_Components_ResultCount;
export type Web_Labels_CountLabel_Returns = string;
export type Web_Labels_CountLabel_Unit = string;

/**
 * Labels.
 *
 * @since 1.2.1
 */
export type Web_Labels_CountOrder = Web_Api_ResultStatus[];

/**
 * Labels.
 *
 * @since 1.2.1
 */
export type Web_Labels_CountResults_Results = Web_Api_Result[];
export type Web_Labels_CountResults_Returns = Web_Components_ResultCount[];

/**
 * Labels.
 *
 * @since 1.2.1
 */
export type Web_Labels_CycleActionCompletedLabel_Action = Web_Api_CycleAction | null | undefined;
export type Web_Labels_CycleActionCompletedLabel_Returns = string;

/**
 * Labels.
 *
 * @since 1.2.1
 */
export type Web_Labels_CycleActionLabel_Action = Web_Api_CycleAction | null | undefined;
export type Web_Labels_CycleActionLabel_Returns = string;

/**
 * Labels.
 *
 * @since 1.2.1
 */
export type Web_Labels_CycleActionRunningLabel_Action = Web_Api_CycleAction | null | undefined;
export type Web_Labels_CycleActionRunningLabel_Returns = string;

/**
 * Labels.
 *
 * @since 1.2.1
 */
export type Web_Labels_DescribeScheduler_Overview = Web_Api_Overview | null;
export type Web_Labels_DescribeScheduler_DockerUnreachable = boolean;
export type Web_Labels_DescribeScheduler_Returns = Web_Components_SchedulerStatus;
export type Web_Labels_DescribeScheduler_RunningLabel = string;
export type Web_Labels_DescribeScheduler_LastReport = Web_Api_Report | null | undefined;
export type Web_Labels_DescribeScheduler_LastAction = string;
export type Web_Labels_DescribeScheduler_ScheduledAction = string;
export type Web_Labels_DescribeScheduler_Failed = number;

/**
 * Labels.
 *
 * @since 1.2.1
 */
export type Web_Labels_FailedCount_Results = Web_Api_Result[];
export type Web_Labels_FailedCount_Returns = number;

/**
 * Labels.
 *
 * @since 1.2.1
 */
export type Web_Labels_ModeSummary_Overview = Web_Api_Overview;
export type Web_Labels_ModeSummary_Returns = string;
export type Web_Labels_ModeSummary_Parts = string[];

/**
 * Labels.
 *
 * @since 1.2.1
 */
export type Web_Labels_ReportFailed_Report = Web_Api_Report;
export type Web_Labels_ReportFailed_Returns = boolean;

/**
 * Labels.
 *
 * @since 1.2.1
 */
export type Web_Labels_StatusClasses = Record<Web_Api_ResultStatus, string>;

/**
 * Labels.
 *
 * @since 1.2.1
 */
export type Web_Labels_StatusLabels = Record<Web_Api_ResultStatus, string>;

/**
 * Labels.
 *
 * @since 1.2.1
 */
export type Web_Labels_TriggerLabel_Trigger = string | null | undefined;
export type Web_Labels_TriggerLabel_Returns = string;

/**
 * Labels.
 *
 * @since 1.2.1
 */
export type Web_Labels_TriggerLabels = Record<string, string>;

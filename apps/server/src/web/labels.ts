import { formatRelative } from '@/web/format.ts';
import { formatUntil } from '@/web/outpost-format.ts';

import type {
  Web_Labels_CheckDuration_Report,
  Web_Labels_CheckDuration_Returns,
  Web_Labels_CountLabel_Entry,
  Web_Labels_CountLabel_Returns,
  Web_Labels_CountLabel_Unit,
  Web_Labels_CountOrder,
  Web_Labels_CountResults_Results,
  Web_Labels_CountResults_Returns,
  Web_Labels_CycleActionCompletedLabel_Action,
  Web_Labels_CycleActionCompletedLabel_Returns,
  Web_Labels_CycleActionLabel_Action,
  Web_Labels_CycleActionLabel_Returns,
  Web_Labels_CycleActionRunningLabel_Action,
  Web_Labels_CycleActionRunningLabel_Returns,
  Web_Labels_DescribeScheduler_DockerUnreachable,
  Web_Labels_DescribeScheduler_Failed,
  Web_Labels_DescribeScheduler_LastAction,
  Web_Labels_DescribeScheduler_LastReport,
  Web_Labels_DescribeScheduler_Overview,
  Web_Labels_DescribeScheduler_Returns,
  Web_Labels_DescribeScheduler_RunningLabel,
  Web_Labels_DescribeScheduler_ScheduledAction,
  Web_Labels_FailedCount_Results,
  Web_Labels_FailedCount_Returns,
  Web_Labels_ModeSummary_Overview,
  Web_Labels_ModeSummary_Parts,
  Web_Labels_ModeSummary_Returns,
  Web_Labels_ReportFailed_Report,
  Web_Labels_ReportFailed_Returns,
  Web_Labels_StatusClasses,
  Web_Labels_StatusLabels,
  Web_Labels_TriggerLabel_Returns,
  Web_Labels_TriggerLabel_Trigger,
  Web_Labels_TriggerLabels,
} from '@/types/web/labels.d.ts';

/**
 * Labels - Status Labels.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
export const statusLabels: Web_Labels_StatusLabels = {
  'available': 'Update available',
  'failed': 'Failed',
  'held': 'Held',
  'kept-unhealthy': 'Kept after failure',
  'rolled-back': 'Rolled back',
  'skipped': 'Skipped',
  'up-to-date': 'Up to date',
  'updated': 'Updated',
};

// Green for an update, amber for one waiting in monitor-only mode, red only for problems.

/**
 * Labels - Status Classes.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
export const statusClasses: Web_Labels_StatusClasses = {
  'available': 'status-dot status-checking',
  'failed': 'status-dot status-error',
  'held': 'status-dot status-checking',
  'kept-unhealthy': 'status-dot status-error',
  'rolled-back': 'status-dot status-error',
  'skipped': 'status-dot status-queued',
  'up-to-date': 'status-dot status-paused',
  'updated': 'status-dot status-seeding',
};

// The order counts are listed in, most important first.

/**
 * Labels - Count Order.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
const countOrder: Web_Labels_CountOrder = [
  'updated',
  'available',
  'held',
  'kept-unhealthy',
  'rolled-back',
  'failed',
  'up-to-date',
  'skipped',
];

/**
 * Labels - Trigger Labels.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
const triggerLabels: Web_Labels_TriggerLabels = {
  api: 'API',
  dashboard: 'Dashboard',
  schedule: 'Schedule',
  startup: 'Startup',
};

/**
 * Labels - Cycle Action Label.
 *
 * Names a history action. Reports written before actions were recorded were
 * update cycles, so a missing value remains an update.
 *
 * @param {Web_Labels_CycleActionLabel_Action} action - Action.
 *
 * @returns {Web_Labels_CycleActionLabel_Returns}
 *
 * @since 1.1.0
 */
export const cycleActionLabel = (action: Web_Labels_CycleActionLabel_Action): Web_Labels_CycleActionLabel_Returns => (action === 'check') ? 'Check' : 'Update';

/**
 * Labels - Cycle Action Completed Label.
 *
 * Names the completed action beside a container's result time. Reports written
 * before actions were recorded were update cycles, so they remain updated.
 *
 * @param {Web_Labels_CycleActionCompletedLabel_Action} action - Action.
 *
 * @returns {Web_Labels_CycleActionCompletedLabel_Returns}
 *
 * @since 1.1.0
 */
export const cycleActionCompletedLabel = (action: Web_Labels_CycleActionCompletedLabel_Action): Web_Labels_CycleActionCompletedLabel_Returns => (action === 'check') ? 'Checked' : 'Updated';

/**
 * Labels - Cycle Action Running Label.
 *
 * Distinguishes a registry-only check from an update everywhere live scheduler
 * state appears. A missing legacy action remains an update.
 *
 * @param {Web_Labels_CycleActionRunningLabel_Action} action - Action.
 *
 * @returns {Web_Labels_CycleActionRunningLabel_Returns}
 *
 * @since 1.1.0
 */
export const cycleActionRunningLabel = (action: Web_Labels_CycleActionRunningLabel_Action): Web_Labels_CycleActionRunningLabel_Returns => (action === 'check') ? 'Checking' : 'Updating';

// countResults tallies a check's results by status, leaving out statuses that didn't occur.

/**
 * Labels - Count Results.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_Labels_CountResults_Results} results - Results.
 *
 * @returns {Web_Labels_CountResults_Returns}
 *
 * @since 1.0.0
 */
export const countResults = (results: Web_Labels_CountResults_Results): Web_Labels_CountResults_Returns => {
  return countOrder
    .map((status) => {
      return {
        count: results.filter((result) => result['status'] === status).length,
        status,
      };
    })
    .filter((entry) => entry['count'] > 0);
};

// countLabel reads a tally like "2 updates available" or "3 up to date".

/**
 * Labels - Count Label.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_Labels_CountLabel_Entry} entry - Entry.
 *
 * @returns {Web_Labels_CountLabel_Returns}
 *
 * @since 1.0.0
 */
export const countLabel = (entry: Web_Labels_CountLabel_Entry): Web_Labels_CountLabel_Returns => {
  if (entry['status'] === 'available') {
    const unit: Web_Labels_CountLabel_Unit = (entry['count'] === 1) ? 'update' : 'updates';

    return `${entry['count']} ${unit} available`;
  }

  return `${entry['count']} ${statusLabels[entry['status']].toLowerCase()}`;
};

// failedCount counts the results that need attention; a rollback means the update failed.

/**
 * Labels - Failed Count.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_Labels_FailedCount_Results} results - Results.
 *
 * @returns {Web_Labels_FailedCount_Returns}
 *
 * @since 1.0.0
 */
export const failedCount = (results: Web_Labels_FailedCount_Results): Web_Labels_FailedCount_Returns => results.filter(
  (result) => (
    result['status'] === 'failed'
    || result['status'] === 'rolled-back'
    || result['status'] === 'kept-unhealthy'
  ),
).length;

// reportFailed says whether a check failed as a whole or for any container.

/**
 * Labels - Report Failed.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_Labels_ReportFailed_Report} report - Report.
 *
 * @returns {Web_Labels_ReportFailed_Returns}
 *
 * @since 1.0.0
 */
export const reportFailed = (report: Web_Labels_ReportFailed_Report): Web_Labels_ReportFailed_Returns => (
  (
    report['error'] !== null
    && report['error'] !== undefined
    && report['error'] !== ''
  )
  || failedCount(report['results']) > 0
);

// checkDuration is how long a check ran, in seconds.

/**
 * Labels - Check Duration.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_Labels_CheckDuration_Report} report - Report.
 *
 * @returns {Web_Labels_CheckDuration_Returns}
 *
 * @since 1.0.0
 */
export const checkDuration = (report: Web_Labels_CheckDuration_Report): Web_Labels_CheckDuration_Returns => (Date.parse(report['finishedAt']) - Date.parse(report['startedAt'])) / 1000;

// triggerLabel names what started a check, when the server says.

/**
 * Labels - Trigger Label.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_Labels_TriggerLabel_Trigger} trigger - Trigger.
 *
 * @returns {Web_Labels_TriggerLabel_Returns}
 *
 * @since 1.0.0
 */
export const triggerLabel = (trigger: Web_Labels_TriggerLabel_Trigger): Web_Labels_TriggerLabel_Returns => {
  if (
    trigger === null
    || trigger === undefined
    || trigger === ''
  ) {
    return '';
  }

  return triggerLabels[trigger] ?? trigger;
};

// modeSummary describes the label mode and monitor-only setting in one sentence.

/**
 * Labels - Mode Summary.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_Labels_ModeSummary_Overview} overview - Overview.
 *
 * @returns {Web_Labels_ModeSummary_Returns}
 *
 * @since 1.0.0
 */
export const modeSummary = (overview: Web_Labels_ModeSummary_Overview): Web_Labels_ModeSummary_Returns => {
  const parts: Web_Labels_ModeSummary_Parts = [(overview['labelMode'] === 'opt-in') ? 'Opt-in: only labeled containers are updated' : 'Opt-out: every container is updated unless labeled off'];

  if (overview['monitorOnly'] === true) {
    parts.push('monitor-only (updates are reported, not applied)');
  }

  return `${parts.join(', ')}.`;
};

// Reduces the scheduler state to what the shell shows at a glance.

/**
 * Labels - Describe Scheduler.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @param {Web_Labels_DescribeScheduler_Overview}          overview          - Overview.
 * @param {Web_Labels_DescribeScheduler_DockerUnreachable} dockerUnreachable - Docker unreachable.
 *
 * @returns {Web_Labels_DescribeScheduler_Returns}
 *
 * @since 1.0.0
 */
export const describeScheduler = (
  overview: Web_Labels_DescribeScheduler_Overview,
  dockerUnreachable: Web_Labels_DescribeScheduler_DockerUnreachable,
): Web_Labels_DescribeScheduler_Returns => {
  if (overview === null) {
    return {
      detail: 'Loading…',
      label: 'Outpost',
      tone: 'idle',
    };
  }

  if (overview['running'] === true) {
    const runningLabel: Web_Labels_DescribeScheduler_RunningLabel = cycleActionRunningLabel(overview['action']);

    return {
      detail: (overview['startedAt'] === null || overview['startedAt'] === undefined) ? `${runningLabel} containers` : `Started ${formatRelative(overview['startedAt'])}`,
      label: runningLabel,
      tone: 'connecting',
    };
  }

  if (dockerUnreachable === true) {
    return {
      detail: 'Check the Docker socket',
      label: 'Can\'t reach Docker',
      tone: 'blocked',
    };
  }

  const lastReport: Web_Labels_DescribeScheduler_LastReport = overview['lastReport'];
  const lastAction: Web_Labels_DescribeScheduler_LastAction = cycleActionLabel((lastReport === null || lastReport === undefined) ? undefined : lastReport['action']).toLowerCase();
  const scheduledAction: Web_Labels_DescribeScheduler_ScheduledAction = (overview['monitorOnly'] === true) ? 'check' : 'update';

  if (
    overview['lastError'] !== null
    && overview['lastError'] !== undefined
    && overview['lastError'] !== ''
  ) {
    return {
      detail: overview['lastError'],
      label: `Last ${lastAction} failed`,
      tone: 'blocked',
    };
  }

  const failed: Web_Labels_DescribeScheduler_Failed = (lastReport === null || lastReport === undefined) ? 0 : failedCount(lastReport['results']);

  if (failed > 0) {
    return {
      detail: `${failed} failed in the last ${lastAction}`,
      label: 'Idle',
      tone: 'blocked',
    };
  }

  return {
    detail: (overview['nextRun'] === null || overview['nextRun'] === undefined) ? `No ${scheduledAction} scheduled` : `Next ${scheduledAction} ${formatUntil(overview['nextRun'])}`,
    label: 'Idle',
    tone: 'protected',
  };
};

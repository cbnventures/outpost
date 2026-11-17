import { formatRelative } from '@/web/format.ts';
import { formatUntil } from '@/web/outpost-format.ts';

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
 * Labels - Status labels.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
export const statusLabels: Record<Web_Api_ResultStatus, string> = {
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
 * Labels - Status classes.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
export const statusClasses: Record<Web_Api_ResultStatus, string> = {
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
 * Labels - Count order.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
const countOrder: Web_Api_ResultStatus[] = [
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
 * Labels - Trigger labels.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
const triggerLabels: Record<string, string> = {
  api: 'API',
  dashboard: 'Dashboard',
  schedule: 'Schedule',
  startup: 'Startup',
};

/**
 * Labels - Cycle action label.
 *
 * Names a history action. Reports written before actions were recorded were
 * update cycles, so a missing value remains an update.
 *
 * @param {Web_Api_CycleAction | null | undefined} action - Action.
 *
 * @returns {string}
 *
 * @since 1.1.0
 */
export const cycleActionLabel = (action: Web_Api_CycleAction | null | undefined): string => (action === 'check') ? 'Check' : 'Update';

/**
 * Labels - Cycle action completed label.
 *
 * Names the completed action beside a container's result time. Reports written
 * before actions were recorded were update cycles, so they remain updated.
 *
 * @param {Web_Api_CycleAction | null | undefined} action - Action.
 *
 * @returns {string}
 *
 * @since 1.1.0
 */
export const cycleActionCompletedLabel = (action: Web_Api_CycleAction | null | undefined): string => (action === 'check') ? 'Checked' : 'Updated';

/**
 * Labels - Cycle action running label.
 *
 * Distinguishes a registry-only check from an update everywhere live scheduler
 * state appears. A missing legacy action remains an update.
 *
 * @param {Web_Api_CycleAction | null | undefined} action - Action.
 *
 * @returns {string}
 *
 * @since 1.1.0
 */
export const cycleActionRunningLabel = (action: Web_Api_CycleAction | null | undefined): string => (action === 'check') ? 'Checking' : 'Updating';

// countResults tallies a check's results by status, leaving out statuses that didn't occur.

/**
 * Labels - Count results.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 1.0.0
 */
export const countResults = (results: Web_Api_Result[]): Web_Components_ResultCount[] => countOrder
  .map((status: Web_Api_ResultStatus): Web_Components_ResultCount => ({
    count: results.filter((result: Web_Api_Result): boolean => result['status'] === status).length,
    status,
  }))
  .filter((entry: Web_Components_ResultCount): boolean => entry['count'] > 0);

// countLabel reads a tally like "2 updates available" or "3 up to date".

/**
 * Labels - Count label.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 1.0.0
 */
export const countLabel = (entry: Web_Components_ResultCount): string => {
  if (entry['status'] === 'available') {
    return `${entry['count']} ${(entry['count'] === 1) ? 'update' : 'updates'} available`;
  }

  return `${entry['count']} ${statusLabels[entry['status']].toLowerCase()}`;
};

// failedCount counts the results that need attention; a rollback means the update failed.

/**
 * Labels - Failed count.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 1.0.0
 */
export const failedCount = (results: Web_Api_Result[]): number => results.filter(
  (result: Web_Api_Result): boolean => result['status'] === 'failed' || result['status'] === 'rolled-back' || result['status'] === 'kept-unhealthy',
).length;

// reportFailed says whether a check failed as a whole or for any container.

/**
 * Labels - Report failed.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 1.0.0
 */
export const reportFailed = (report: Web_Api_Report): boolean => (
  (report['error'] !== null && report['error'] !== undefined && report['error'] !== '') || failedCount(report['results']) > 0
);

// checkDuration is how long a check ran, in seconds.

/**
 * Labels - Checks duration.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 1.0.0
 */
export const checkDuration = (report: Web_Api_Report): number => (Date.parse(report['finishedAt']) - Date.parse(report['startedAt'])) / 1000;

// triggerLabel names what started a check, when the server says.

/**
 * Labels - Trigger label.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 1.0.0
 */
export const triggerLabel = (trigger: string | null | undefined): string => {
  if (trigger === null || trigger === undefined || trigger === '') {
    return '';
  }

  return triggerLabels[trigger] ?? trigger;
};

// modeSummary describes the label mode and monitor-only setting in one sentence.

/**
 * Labels - Mode summary.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 1.0.0
 */
export const modeSummary = (overview: Web_Api_Overview): string => {
  const parts: string[] = [(overview['labelMode'] === 'opt-in') ? 'Opt-in: only labeled containers are updated' : 'Opt-out: every container is updated unless labeled off'];

  if (overview['monitorOnly']) {
    parts.push('monitor-only (updates are reported, not applied)');
  }

  return `${parts.join(', ')}.`;
};

// Reduces the scheduler state to what the shell shows at a glance.

/**
 * Labels - Describe scheduler.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
export const describeScheduler = (
  overview: Web_Api_Overview | null,
  dockerUnreachable: boolean,
): Web_Components_SchedulerStatus => {
  if (overview === null) {
    return {
      detail: 'Loading…',
      label: 'Outpost',
      tone: 'idle',
    };
  }

  if (overview['running']) {
    const runningLabel: string = cycleActionRunningLabel(overview['action']);

    return {
      detail: (overview['startedAt'] === null || overview['startedAt'] === undefined) ? `${runningLabel} containers` : `Started ${formatRelative(overview['startedAt'])}`,
      label: runningLabel,
      tone: 'connecting',
    };
  }

  if (dockerUnreachable) {
    return {
      detail: 'Check the Docker socket',
      label: 'Can\'t reach Docker',
      tone: 'blocked',
    };
  }

  const lastReport: Web_Api_Report | null | undefined = overview['lastReport'];
  const lastAction: string = cycleActionLabel((lastReport === null || lastReport === undefined) ? undefined : lastReport['action']).toLowerCase();
  const scheduledAction: string = (overview['monitorOnly']) ? 'check' : 'update';

  if (overview['lastError'] !== null && overview['lastError'] !== undefined && overview['lastError'] !== '') {
    return {
      detail: overview['lastError'],
      label: `Last ${lastAction} failed`,
      tone: 'blocked',
    };
  }

  const failed: number = (lastReport === null || lastReport === undefined) ? 0 : failedCount(lastReport['results']);

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

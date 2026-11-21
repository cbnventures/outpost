import {
  describe,
  expect,
  it,
} from 'vitest';

import {
  cycleActionCompletedLabel,
  cycleActionRunningLabel,
  describeScheduler,
} from '@/web/labels.ts';

import type {
  Web_Labels_DescribeScheduler_DistinguishesChecksFromUpdates_CheckOverview,
  Web_Labels_DescribeScheduler_DistinguishesChecksFromUpdates_CheckStatus,
  Web_Labels_DescribeScheduler_DistinguishesChecksFromUpdates_UpdateOverview,
  Web_Labels_DescribeScheduler_DistinguishesChecksFromUpdates_UpdateStatus,
  Web_Labels_DescribeScheduler_UsesTheCompletedAndScheduledActions_Overview,
  Web_Labels_DescribeScheduler_UsesTheCompletedAndScheduledActions_Status,
} from '@/types/web/labels.test.d.ts';

/**
 * Labels - Cycle Action Labels.
 *
 * Keeps the running and completed wording aligned with the scheduler action.
 * Both dashboard status surfaces and container result times reuse these labels.
 *
 * @since 1.1.0
 */
describe('cycle action labels', () => {
  it('names checks and updates in their current tense', () => {
    expect(cycleActionRunningLabel('check')).toBe('Checking');

    expect(cycleActionRunningLabel('update')).toBe('Updating');

    expect(cycleActionCompletedLabel('check')).toBe('Checked');

    expect(cycleActionCompletedLabel('update')).toBe('Updated');

    return;
  });

  return;
});

/**
 * Labels - Describe Scheduler.
 *
 * Verifies the sidebar status names the action carried by live scheduler state.
 * The detail follows the same action when a start time is unavailable.
 *
 * @since 1.1.0
 */
describe('describeScheduler', () => {
  it('distinguishes checks from updates', () => {
    const checkOverview: Web_Labels_DescribeScheduler_DistinguishesChecksFromUpdates_CheckOverview = {
      action: 'check',
      labelMode: 'opt-out',
      monitorOnly: false,
      running: true,
      schedule: '0 0 4 * * *',
      timeZone: 'UTC',
      totals: {
        cycles: 0,
        failed: 0,
        updated: 0,
      },
    };
    const updateOverview: Web_Labels_DescribeScheduler_DistinguishesChecksFromUpdates_UpdateOverview = {
      ...checkOverview,
      action: 'update',
    };
    const checkStatus: Web_Labels_DescribeScheduler_DistinguishesChecksFromUpdates_CheckStatus = describeScheduler(checkOverview, false);
    const updateStatus: Web_Labels_DescribeScheduler_DistinguishesChecksFromUpdates_UpdateStatus = describeScheduler(updateOverview, false);

    expect(checkStatus).toEqual({
      detail: 'Checking containers',
      label: 'Checking',
      tone: 'connecting',
    });

    expect(updateStatus).toEqual({
      detail: 'Updating containers',
      label: 'Updating',
      tone: 'connecting',
    });

    return;
  });

  it('uses the completed and scheduled actions while idle', () => {
    const overview: Web_Labels_DescribeScheduler_UsesTheCompletedAndScheduledActions_Overview = {
      labelMode: 'opt-out',
      lastReport: {
        action: 'update',
        finishedAt: '2026-10-25T04:00:05.000Z',
        results: [{
          container: 'web',
          detail: 'Replacement stopped',
          image: 'nginx:1',
          status: 'failed',
        }],
        startedAt: '2026-10-25T04:00:00.000Z',
      },
      monitorOnly: false,
      running: false,
      schedule: '0 0 4 * * *',
      timeZone: 'UTC',
      totals: {
        cycles: 1,
        failed: 1,
        updated: 0,
      },
    };
    const failedStatus: Web_Labels_DescribeScheduler_UsesTheCompletedAndScheduledActions_Status = describeScheduler(overview, false);
    const errorStatus: Web_Labels_DescribeScheduler_UsesTheCompletedAndScheduledActions_Status = describeScheduler({
      ...overview,
      lastError: 'Docker socket is unreachable',
    }, false);
    const monitorStatus: Web_Labels_DescribeScheduler_UsesTheCompletedAndScheduledActions_Status = describeScheduler({
      ...overview,
      lastReport: undefined,
      monitorOnly: true,
    }, false);

    expect(failedStatus['detail']).toBe('1 failed in the last update');

    expect(errorStatus['label']).toBe('Last update failed');

    expect(monitorStatus['detail']).toBe('No check scheduled');

    expect(describeScheduler({
      ...overview,
      lastReport: undefined,
    }, false)['detail']).toBe('No update scheduled');

    return;
  });

  return;
});

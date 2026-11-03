import {
  describe,
  expect,
  it,
} from 'vitest';

import { formatMetrics } from './watchtower.js';

import type {
  Routes_Watchtower_FormatMetrics_LeavesTheLastCycleOutBeforeTheFirstCheck_Metrics,
  Routes_Watchtower_FormatMetrics_RendersCountersAndTheLastCycle_Metrics,
} from '../types/routes/watchtower.test.d.ts';

/**
 * Routes - Watchtower - Format Metrics.
 *
 * Checks the Prometheus text output for counters, the running gauge,
 * and the last cycle timestamp.
 *
 * @since 0.0.1
 */
describe('formatMetrics', () => {
  it('renders counters and the last cycle', () => {
    const metrics: Routes_Watchtower_FormatMetrics_RendersCountersAndTheLastCycle_Metrics = formatMetrics({
      running: true,
      startedAt: '2026-10-24T04:00:00.000Z',
      nextRun: undefined,
      lastReport: {
        startedAt: '2026-10-24T04:00:00.000Z',
        finishedAt: '2026-10-24T04:00:10.000Z',
        results: [],
        trigger: 'api',
      },
      lastError: undefined,
      totals: {
        cycles: 3,
        updated: 2,
        failed: 1,
      },
    });

    expect(metrics).toContain('outpost_cycles_total 3');

    expect(metrics).toContain('outpost_containers_updated_total 2');

    expect(metrics).toContain('outpost_containers_failed_total 1');

    expect(metrics).toContain('outpost_cycle_running 1');

    expect(metrics).toContain('outpost_last_cycle_timestamp_seconds 1792814410');

    expect(metrics.endsWith('\n')).toBe(true);

    return;
  });

  it('leaves the last cycle out before the first check', () => {
    const metrics: Routes_Watchtower_FormatMetrics_LeavesTheLastCycleOutBeforeTheFirstCheck_Metrics = formatMetrics({
      running: false,
      startedAt: undefined,
      nextRun: undefined,
      lastReport: undefined,
      lastError: undefined,
      totals: {
        cycles: 0,
        updated: 0,
        failed: 0,
      },
    });

    expect(metrics).toContain('outpost_cycle_running 0');

    expect(metrics).not.toContain('outpost_last_cycle_timestamp_seconds');

    return;
  });

  return;
});

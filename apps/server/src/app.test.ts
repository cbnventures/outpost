import { once } from 'node:events';

import {
  afterAll,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { createApp, formatMetrics } from './app.js';

import type {
  App_Api_BaseUrl,
  App_Api_DisablesProtectedEndpointsWithoutAToken_Response,
  App_Api_OpenAddress,
  App_Api_OpenServer,
  App_Api_ProtectedAddress,
  App_Api_ProtectedServer,
  App_Api_ProtectsAndServesTheUpdateEndpoint_Response,
  App_Api_Scheduler,
  App_Api_Servers,
  App_Api_Trigger,
  App_FormatMetrics_RendersCountersAndTheLastCycle_Metrics,
} from './types/app.test.d.ts';

/**
 * App - Scheduler.
 *
 * Fake scheduler that accepts the first trigger and refuses the second,
 * like a real cycle that is still running.
 *
 * @since 0.0.1
 */
const scheduler: App_Api_Scheduler = {
  trigger: vi.fn<App_Api_Trigger>().mockReturnValueOnce(true).mockReturnValue(false),
  getState: () => ({
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
  }),
};

/**
 * App - Base URL.
 *
 * Base URLs of the server with a token and the server without one,
 * filled in once both are listening.
 *
 * @since 0.0.1
 */
const baseUrl: App_Api_BaseUrl = {
  protected: '',
  open: '',
};

/**
 * App - Servers.
 *
 * Both test servers, kept so they can be closed after the suite and
 * no listener outlives the test run.
 *
 * @since 0.0.1
 */
const servers: App_Api_Servers = [];

/**
 * App - API.
 *
 * Calls the real Express routes over HTTP with a fake scheduler, so
 * auth, status codes, and routing are exercised end to end.
 *
 * @since 0.0.1
 */
describe('API', () => {
  beforeAll(async () => {
    const protectedServer: App_Api_ProtectedServer = createApp(scheduler, 'secret', undefined).listen(0, '127.0.0.1');
    const openServer: App_Api_OpenServer = createApp(scheduler, undefined, undefined).listen(0, '127.0.0.1');

    servers.push(protectedServer, openServer);

    await Promise.all(servers.map(async (server) => once(server, 'listening')));

    const protectedAddress: App_Api_ProtectedAddress = protectedServer.address();
    const openAddress: App_Api_OpenAddress = openServer.address();

    if (
      typeof protectedAddress === 'object'
      && protectedAddress !== null
      && typeof openAddress === 'object'
      && openAddress !== null
    ) {
      Reflect.set(baseUrl, 'protected', `http://127.0.0.1:${String(protectedAddress.port)}`);

      Reflect.set(baseUrl, 'open', `http://127.0.0.1:${String(openAddress.port)}`);
    }

    return;
  });

  afterAll(() => {
    for (const server of servers) {
      server.close();
    }

    return;
  });

  it('protects and serves the update endpoint', async () => {
    const response: App_Api_ProtectsAndServesTheUpdateEndpoint_Response = await fetch(`${baseUrl['protected']}/v1/update`, {
      method: 'POST',
      headers: { Authorization: 'Bearer secret' },
    });

    expect(response.status).toBe(202);

    expect((await fetch(`${baseUrl['protected']}/v1/update`, {
      method: 'POST',
      headers: { Authorization: 'Bearer secret' },
    })).status).toBe(409);

    expect((await fetch(`${baseUrl['protected']}/v1/update`, {
      method: 'POST',
      headers: { Authorization: 'Bearer wrong' },
    })).status).toBe(401);

    expect((await fetch(`${baseUrl['protected']}/health`)).status).toBe(200);

    return;
  });

  it('disables protected endpoints without a token', async () => {
    const response: App_Api_DisablesProtectedEndpointsWithoutAToken_Response = await fetch(`${baseUrl['open']}/metrics`);

    expect(response.status).toBe(404);

    return;
  });

  return;
});

/**
 * App - Format Metrics.
 *
 * Checks the Prometheus text output for counters, the running gauge,
 * and the last cycle timestamp.
 *
 * @since 0.0.1
 */
describe('formatMetrics', () => {
  it('renders counters and the last cycle', () => {
    const metrics: App_FormatMetrics_RendersCountersAndTheLastCycle_Metrics = formatMetrics({
      running: true,
      startedAt: '2026-10-24T04:00:00.000Z',
      nextRun: undefined,
      lastReport: {
        startedAt: '2026-10-24T04:00:00.000Z',
        finishedAt: '2026-10-24T04:00:10.000Z',
        results: [],
      },
      lastError: undefined,
      totals: {
        cycles: 3,
        updated: 2,
        failed: 1,
      },
    });

    expect(metrics).toContain('outpost_cycles_total 3');

    expect(metrics).toContain('outpost_cycle_running 1');

    expect(metrics).toContain('outpost_last_cycle_timestamp_seconds 1792814410');

    return;
  });

  return;
});

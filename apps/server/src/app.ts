import { timingSafeEqual } from 'node:crypto';

import express from 'express';

import type {
  App_CreateApp_AdminRouter,
  App_CreateApp_ApiToken,
  App_CreateApp_App,
  App_CreateApp_Authorize,
  App_CreateApp_Returns,
  App_CreateApp_Scheduler,
  App_CreateApp_Started,
  App_CreateApp_State,
  App_CreateApp_TrustProxy,
  App_FormatMetrics_Lines,
  App_FormatMetrics_Returns,
  App_FormatMetrics_RunningValue,
  App_FormatMetrics_State,
  App_IsAuthorized_ApiToken,
  App_IsAuthorized_Expected,
  App_IsAuthorized_Header,
  App_IsAuthorized_Provided,
  App_IsAuthorized_Returns,
} from './types/app.d.ts';

/**
 * App - Create App.
 *
 * Builds the HTTP server: the dashboard at /admin, a public health check,
 * and token-protected endpoints to trigger updates, read the last report,
 * and scrape metrics (disabled without OUTPOST_API_TOKEN).
 *
 * @param {App_CreateApp_Scheduler}   scheduler    - Scheduler.
 * @param {App_CreateApp_ApiToken}    apiToken     - Api token.
 * @param {App_CreateApp_AdminRouter} adminRouter  - Admin router.
 * @param {App_CreateApp_TrustProxy}  [trustProxy] - Trust proxy.
 *
 * @returns {App_CreateApp_Returns}
 *
 * @since 0.0.1
 */
export function createApp(scheduler: App_CreateApp_Scheduler, apiToken: App_CreateApp_ApiToken, adminRouter: App_CreateApp_AdminRouter, trustProxy: App_CreateApp_TrustProxy = false): App_CreateApp_Returns {
  const app: App_CreateApp_App = express();

  app.disable('x-powered-by');

  // Behind one reverse proxy, read the client address and HTTPS from X-Forwarded-* headers.
  app.set('trust proxy', (trustProxy === true) ? 1 : false);

  app.get('/', (_request, response) => {
    response.redirect(302, '/admin/');

    return;
  });

  if (adminRouter !== undefined) {
    app.use('/admin', adminRouter);
  }

  app.get('/health', (_request, response) => {
    response.json({ status: 'ok' });

    return;
  });

  /**
   * App - Create App - Authorize.
   *
   * Middleware that rejects requests without the configured bearer
   * token, or reports the endpoint as disabled when none is set.
   *
   * @param {Request}      request  - Request.
   * @param {Response}     response - Response.
   * @param {NextFunction} next     - Next.
   *
   * @returns {void}
   *
   * @since 0.0.1
   */
  const authorize: App_CreateApp_Authorize = (request, response, next) => {
    if (apiToken === undefined) {
      response.status(404).json({ error: 'Set OUTPOST_API_TOKEN to enable this endpoint.' });

      return;
    }

    if (isAuthorized(request.get('Authorization'), apiToken) === false) {
      response.status(401).json({ error: 'Invalid or missing bearer token.' });

      return;
    }

    next();

    return;
  };

  app.post('/v1/update', authorize, (_request, response) => {
    const started: App_CreateApp_Started = scheduler.trigger();

    response.status((started === true) ? 202 : 409).json({ started });

    return;
  });

  app.get('/v1/status', authorize, (_request, response) => {
    const state: App_CreateApp_State = scheduler.getState();

    response.json(state);

    return;
  });

  app.get('/metrics', authorize, (_request, response) => {
    response.type('text/plain; version=0.0.4').send(formatMetrics(scheduler.getState()));

    return;
  });

  return app;
}

/**
 * App - Is Authorized.
 *
 * Compares a "Bearer <token>" header with the configured token in
 * constant time so the token cannot be guessed from response timing.
 *
 * @param {App_IsAuthorized_Header}   header   - Header.
 * @param {App_IsAuthorized_ApiToken} apiToken - Api token.
 *
 * @returns {App_IsAuthorized_Returns}
 *
 * @since 0.0.1
 */
export function isAuthorized(header: App_IsAuthorized_Header, apiToken: App_IsAuthorized_ApiToken): App_IsAuthorized_Returns {
  if (header === undefined || header.startsWith('Bearer ') === false) {
    return false;
  }

  const provided: App_IsAuthorized_Provided = Buffer.from(header.slice(7));
  const expected: App_IsAuthorized_Expected = Buffer.from(apiToken);

  return provided.length === expected.length && timingSafeEqual(provided, expected);
}

/**
 * App - Format Metrics.
 *
 * Renders the scheduler state in the Prometheus text exposition format
 * so Outpost can be scraped like Watchtower.
 *
 * @param {App_FormatMetrics_State} state - State.
 *
 * @returns {App_FormatMetrics_Returns}
 *
 * @since 0.0.1
 */
export function formatMetrics(state: App_FormatMetrics_State): App_FormatMetrics_Returns {
  const runningValue: App_FormatMetrics_RunningValue = (state['running'] === true) ? '1' : '0';
  const lines: App_FormatMetrics_Lines = [
    '# HELP outpost_cycles_total Update cycles finished since start.',
    '# TYPE outpost_cycles_total counter',
    `outpost_cycles_total ${String(state['totals']['cycles'])}`,
    '# HELP outpost_containers_updated_total Containers updated since start.',
    '# TYPE outpost_containers_updated_total counter',
    `outpost_containers_updated_total ${String(state['totals']['updated'])}`,
    '# HELP outpost_containers_failed_total Container updates that failed or rolled back since start.',
    '# TYPE outpost_containers_failed_total counter',
    `outpost_containers_failed_total ${String(state['totals']['failed'])}`,
    '# HELP outpost_cycle_running Whether an update cycle is running.',
    '# TYPE outpost_cycle_running gauge',
    `outpost_cycle_running ${runningValue}`,
  ];

  if (state['lastReport'] !== undefined) {
    lines.push('# HELP outpost_last_cycle_timestamp_seconds When the last cycle finished.');
    lines.push('# TYPE outpost_last_cycle_timestamp_seconds gauge');
    lines.push(`outpost_last_cycle_timestamp_seconds ${String(Math.floor(Date.parse(state['lastReport']['finishedAt']) / 1000))}`);
  }

  return `${lines.join('\n')}\n`;
}

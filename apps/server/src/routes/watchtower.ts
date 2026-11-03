import type {
  Routes_Watchtower_FormatMetrics_Lines,
  Routes_Watchtower_FormatMetrics_Returns,
  Routes_Watchtower_FormatMetrics_RunningValue,
  Routes_Watchtower_FormatMetrics_State,
  Routes_Watchtower_Runner_Access,
  Routes_Watchtower_Runner_Constructor_Access,
  Routes_Watchtower_Runner_Constructor_Scheduler,
  Routes_Watchtower_Runner_Register_App,
  Routes_Watchtower_Runner_Register_Returns,
  Routes_Watchtower_Runner_RouteMetrics_Request,
  Routes_Watchtower_Runner_RouteMetrics_Response,
  Routes_Watchtower_Runner_RouteMetrics_Returns,
  Routes_Watchtower_Runner_RouteStatus_Request,
  Routes_Watchtower_Runner_RouteStatus_Response,
  Routes_Watchtower_Runner_RouteStatus_Returns,
  Routes_Watchtower_Runner_RouteUpdate_Request,
  Routes_Watchtower_Runner_RouteUpdate_Response,
  Routes_Watchtower_Runner_RouteUpdate_Returns,
  Routes_Watchtower_Runner_RouteUpdate_Started,
  Routes_Watchtower_Runner_Scheduler,
} from '../types/routes/watchtower.d.ts';

/**
 * Routes - Watchtower.
 *
 * Keeps the Watchtower-style update, status, and metrics endpoints for existing clients.
 * Each one takes an access token with the matching scope, never a browser session.
 *
 * @since 1.0.0
 */
export class Runner {
  /**
   * Routes - Watchtower - Access.
   *
   * Authenticates the Bearer token and enforces the exact scope of each endpoint.
   * Failures use the shared error envelope.
   *
   * @private
   *
   * @since 1.0.0
   */
  readonly #access: Routes_Watchtower_Runner_Access;

  /**
   * Routes - Watchtower - Scheduler.
   *
   * Starts checks and reports the scheduler state and totals.
   * A check started here counts as started by the API.
   *
   * @private
   *
   * @since 1.0.0
   */
  readonly #scheduler: Routes_Watchtower_Runner_Scheduler;

  /**
   * Routes - Watchtower - Constructor.
   *
   * Binds the endpoints to the scheduler and the token check.
   * No route is registered until register is called.
   *
   * @param {Routes_Watchtower_Runner_Constructor_Scheduler} scheduler - Scheduler.
   * @param {Routes_Watchtower_Runner_Constructor_Access}    access    - Access.
   *
   * @since 1.0.0
   */
  public constructor(scheduler: Routes_Watchtower_Runner_Constructor_Scheduler, access: Routes_Watchtower_Runner_Constructor_Access) {
    this.#access = access;
    this.#scheduler = scheduler;

    return;
  }

  /**
   * Routes - Watchtower - Register.
   *
   * Installs the update, status, and metrics endpoints behind the token check.
   * Their bodies stay the same as before access tokens existed.
   *
   * @param {Routes_Watchtower_Runner_Register_App} app - App.
   *
   * @returns {Routes_Watchtower_Runner_Register_Returns}
   *
   * @since 1.0.0
   */
  public register(app: Routes_Watchtower_Runner_Register_App): Routes_Watchtower_Runner_Register_Returns {
    app.post('/v1/update', this.#access.requireToken('updates:run'), this['routeUpdate'].bind(this));

    app.get('/v1/status', this.#access.requireToken('status:read'), this['routeStatus'].bind(this));

    app.get('/metrics', this.#access.requireToken('metrics:read'), this['routeMetrics'].bind(this));

    return;
  }

  /**
   * Routes - Watchtower - Route Metrics.
   *
   * Returns the scheduler counters in the Prometheus text format.
   * Prometheus can scrape Outpost the way it scraped Watchtower.
   *
   * @param {Routes_Watchtower_Runner_RouteMetrics_Request}  _request - Request.
   * @param {Routes_Watchtower_Runner_RouteMetrics_Response} response - Response.
   *
   * @private
   *
   * @returns {Routes_Watchtower_Runner_RouteMetrics_Returns}
   *
   * @since 1.0.0
   */
  private routeMetrics(_request: Routes_Watchtower_Runner_RouteMetrics_Request, response: Routes_Watchtower_Runner_RouteMetrics_Response): Routes_Watchtower_Runner_RouteMetrics_Returns {
    response.type('text/plain; version=0.0.4').send(formatMetrics(this.#scheduler.getState()));

    return;
  }

  /**
   * Routes - Watchtower - Route Status.
   *
   * Returns the scheduler state with the last report and totals.
   * The dashboard API serves the same body at /api/v1/status.
   *
   * @param {Routes_Watchtower_Runner_RouteStatus_Request}  _request - Request.
   * @param {Routes_Watchtower_Runner_RouteStatus_Response} response - Response.
   *
   * @private
   *
   * @returns {Routes_Watchtower_Runner_RouteStatus_Returns}
   *
   * @since 1.0.0
   */
  private routeStatus(_request: Routes_Watchtower_Runner_RouteStatus_Request, response: Routes_Watchtower_Runner_RouteStatus_Response): Routes_Watchtower_Runner_RouteStatus_Returns {
    response.json(this.#scheduler.getState());

    return;
  }

  /**
   * Routes - Watchtower - Route Update.
   *
   * Starts a check of every managed container, like Watchtower's HTTP API.
   * A check that is already running answers with started set to false.
   *
   * @param {Routes_Watchtower_Runner_RouteUpdate_Request}  _request - Request.
   * @param {Routes_Watchtower_Runner_RouteUpdate_Response} response - Response.
   *
   * @private
   *
   * @returns {Routes_Watchtower_Runner_RouteUpdate_Returns}
   *
   * @since 1.0.0
   */
  private routeUpdate(_request: Routes_Watchtower_Runner_RouteUpdate_Request, response: Routes_Watchtower_Runner_RouteUpdate_Response): Routes_Watchtower_Runner_RouteUpdate_Returns {
    const started: Routes_Watchtower_Runner_RouteUpdate_Started = this.#scheduler.trigger('api');

    response.status((started === true) ? 202 : 409).json({ started });

    return;
  }
}

/**
 * Routes - Watchtower - Format Metrics.
 *
 * Renders the scheduler state in the Prometheus text exposition format
 * so Outpost can be scraped like Watchtower.
 *
 * @param {Routes_Watchtower_FormatMetrics_State} state - State.
 *
 * @returns {Routes_Watchtower_FormatMetrics_Returns}
 *
 * @since 0.0.1
 */
export function formatMetrics(state: Routes_Watchtower_FormatMetrics_State): Routes_Watchtower_FormatMetrics_Returns {
  const runningValue: Routes_Watchtower_FormatMetrics_RunningValue = (state['running'] === true) ? '1' : '0';
  const lines: Routes_Watchtower_FormatMetrics_Lines = [
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

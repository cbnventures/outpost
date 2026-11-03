import { ENABLE_LABEL, MONITOR_ONLY_LABEL, selectContainers } from 'outpost-package-updater';

import { applyRuntimeSettings, runtimeSettingsFromConfig } from '../config.js';
import { sendError, sendValidationError } from '../lib/http.js';
import { checkStart, runtimeSettings } from '../lib/schema.js';

import type {
  Routes_Dashboard_BuildContainerRows_AutoRemove,
  Routes_Dashboard_BuildContainerRows_ConfiguredImage,
  Routes_Dashboard_BuildContainerRows_Containers,
  Routes_Dashboard_BuildContainerRows_Inspected,
  Routes_Dashboard_BuildContainerRows_InspectedAutoRemove,
  Routes_Dashboard_BuildContainerRows_InspectedConfiguredImage,
  Routes_Dashboard_BuildContainerRows_InspectedContainers,
  Routes_Dashboard_BuildContainerRows_InspectedNetworkMode,
  Routes_Dashboard_BuildContainerRows_IsSelf,
  Routes_Dashboard_BuildContainerRows_Labels,
  Routes_Dashboard_BuildContainerRows_LastReport,
  Routes_Dashboard_BuildContainerRows_LastResult,
  Routes_Dashboard_BuildContainerRows_Managed,
  Routes_Dashboard_BuildContainerRows_Name,
  Routes_Dashboard_BuildContainerRows_NetworkMode,
  Routes_Dashboard_BuildContainerRows_Note,
  Routes_Dashboard_BuildContainerRows_Options,
  Routes_Dashboard_BuildContainerRows_Pinned,
  Routes_Dashboard_BuildContainerRows_Reports,
  Routes_Dashboard_BuildContainerRows_Returns,
  Routes_Dashboard_BuildContainerRows_Selection,
  Routes_Dashboard_BuildContainerRows_Skipped,
  Routes_Dashboard_BuildContainerRows_SummaryAutoRemove,
  Routes_Dashboard_BuildContainerRows_SummaryNetworkMode,
  Routes_Dashboard_BuildSettings_Config,
  Routes_Dashboard_BuildSettings_Returns,
  Routes_Dashboard_BuildSettings_TimeZone,
  Routes_Dashboard_Runner_Access,
  Routes_Dashboard_Runner_Config,
  Routes_Dashboard_Runner_Constructor_Dependencies,
  Routes_Dashboard_Runner_EventHeartbeatMilliseconds,
  Routes_Dashboard_Runner_GetOverview_Returns,
  Routes_Dashboard_Runner_GetOverview_Returns_TimeZone,
  Routes_Dashboard_Runner_History,
  Routes_Dashboard_Runner_InspectContainer,
  Routes_Dashboard_Runner_ListContainers,
  Routes_Dashboard_Runner_OnRuntimeSettingsChanged,
  Routes_Dashboard_Runner_Register_App,
  Routes_Dashboard_Runner_Register_Returns,
  Routes_Dashboard_Runner_RouteChecks_ContainerId,
  Routes_Dashboard_Runner_RouteChecks_Request,
  Routes_Dashboard_Runner_RouteChecks_RequestBody,
  Routes_Dashboard_Runner_RouteChecks_Response,
  Routes_Dashboard_Runner_RouteChecks_Returns,
  Routes_Dashboard_Runner_RouteChecks_Started,
  Routes_Dashboard_Runner_RouteChecks_Trigger,
  Routes_Dashboard_Runner_RouteContainers_Containers,
  Routes_Dashboard_Runner_RouteContainers_ErrorMessage,
  Routes_Dashboard_Runner_RouteContainers_InspectedContainers,
  Routes_Dashboard_Runner_RouteContainers_Request,
  Routes_Dashboard_Runner_RouteContainers_Response,
  Routes_Dashboard_Runner_RouteContainers_Returns,
  Routes_Dashboard_Runner_RouteEvents_Heartbeat,
  Routes_Dashboard_Runner_RouteEvents_Request,
  Routes_Dashboard_Runner_RouteEvents_Response,
  Routes_Dashboard_Runner_RouteEvents_Returns,
  Routes_Dashboard_Runner_RouteEvents_Unsubscribe,
  Routes_Dashboard_Runner_RouteHistory_Request,
  Routes_Dashboard_Runner_RouteHistory_Response,
  Routes_Dashboard_Runner_RouteHistory_Returns,
  Routes_Dashboard_Runner_RouteOverview_Request,
  Routes_Dashboard_Runner_RouteOverview_Response,
  Routes_Dashboard_Runner_RouteOverview_Returns,
  Routes_Dashboard_Runner_RouteSettings_Request,
  Routes_Dashboard_Runner_RouteSettings_Response,
  Routes_Dashboard_Runner_RouteSettings_Returns,
  Routes_Dashboard_Runner_RouteStatus_Request,
  Routes_Dashboard_Runner_RouteStatus_Response,
  Routes_Dashboard_Runner_RouteStatus_Returns,
  Routes_Dashboard_Runner_RouteUpdateSettings_Request,
  Routes_Dashboard_Runner_RouteUpdateSettings_RequestBody,
  Routes_Dashboard_Runner_RouteUpdateSettings_Response,
  Routes_Dashboard_Runner_RouteUpdateSettings_Returns,
  Routes_Dashboard_Runner_Scheduler,
  Routes_Dashboard_Runner_State,
  Routes_Dashboard_Runner_WriteEvent_Data,
  Routes_Dashboard_Runner_WriteEvent_Lines,
  Routes_Dashboard_Runner_WriteEvent_Name,
  Routes_Dashboard_Runner_WriteEvent_Response,
  Routes_Dashboard_Runner_WriteEvent_Returns,
} from '../types/routes/dashboard.d.ts';

/**
 * Routes - Dashboard.
 *
 * Serves Outpost's overview, containers, history, settings, checks, and live events.
 * A browser session or an access token with the matching scope can call each route.
 *
 * @since 1.0.0
 */
export class Runner {
  /**
   * Routes - Dashboard - Access.
   *
   * Accepts a signed-in session or a token that holds the route's scope.
   * Starting a check from a session also needs the CSRF header.
   *
   * @private
   *
   * @since 1.0.0
   */
  readonly #access: Routes_Dashboard_Runner_Access;

  /**
   * Routes - Dashboard - Config.
   *
   * Holds bootstrap paths and the live copy of persisted runtime behavior.
   * Saving settings updates this object so every runner reads the new values.
   *
   * @private
   *
   * @since 1.0.0
   */
  readonly #config: Routes_Dashboard_Runner_Config;

  /**
   * Routes - Dashboard - Event Heartbeat Milliseconds.
   *
   * Sets how often an open event stream gets a comment line and a fresh access check.
   * Proxies keep the connection open, and a revoked caller stops receiving events.
   *
   * @private
   *
   * @since 1.0.0
   */
  readonly #eventHeartbeatMilliseconds: Routes_Dashboard_Runner_EventHeartbeatMilliseconds;

  /**
   * Routes - Dashboard - History.
   *
   * Lists the saved check reports, newest first.
   * The container rows read each container's last result from it.
   *
   * @private
   *
   * @since 1.0.0
   */
  readonly #history: Routes_Dashboard_Runner_History;

  /**
   * Routes - Dashboard - Inspect Container.
   *
   * Reads one container's full configuration from Docker.
   * Pinned images and network sharing only show up there.
   *
   * @private
   *
   * @since 1.0.0
   */
  readonly #inspectContainer: Routes_Dashboard_Runner_InspectContainer;

  /**
   * Routes - Dashboard - List Containers.
   *
   * Lists the running containers from Docker for the containers view.
   * A failure means Docker can't be reached.
   *
   * @private
   *
   * @since 1.0.0
   */
  readonly #listContainers: Routes_Dashboard_Runner_ListContainers;

  /**
   * Routes - Dashboard - On Runtime Settings Changed.
   *
   * Rebuilds the active cron job and any other process-level consumers after a save.
   * The optional callback keeps this route reusable in focused tests.
   *
   * @private
   *
   * @since 1.0.0
   */
  readonly #onRuntimeSettingsChanged: Routes_Dashboard_Runner_OnRuntimeSettingsChanged;

  /**
   * Routes - Dashboard - Scheduler.
   *
   * Starts checks one at a time and reports whether one is running.
   * The event stream subscribes to its changes.
   *
   * @private
   *
   * @since 1.0.0
   */
  readonly #scheduler: Routes_Dashboard_Runner_Scheduler;

  /**
   * Routes - Dashboard - State.
   *
   * Persists editable runtime settings in the same SQLite store as the dashboard account.
   * Bootstrap paths remain in config because they are needed before this store opens.
   *
   * @private
   *
   * @since 1.0.0
   */
  readonly #state: Routes_Dashboard_Runner_State;

  /**
   * Routes - Dashboard - Constructor.
   *
   * Binds the dashboard routes to the scheduler, history, Docker, and access checks.
   * No route is registered until register is called.
   *
   * @param {Routes_Dashboard_Runner_Constructor_Dependencies} dependencies - Dependencies.
   *
   * @since 1.0.0
   */
  public constructor(dependencies: Routes_Dashboard_Runner_Constructor_Dependencies) {
    this.#access = dependencies['access'];
    this.#config = dependencies['config'];
    this.#eventHeartbeatMilliseconds = dependencies['eventHeartbeatMilliseconds'] ?? 15000;
    this.#history = dependencies['history'];
    this.#inspectContainer = dependencies['inspectContainer'];
    this.#listContainers = dependencies['listContainers'];
    this.#onRuntimeSettingsChanged = dependencies['onRuntimeSettingsChanged'];
    this.#scheduler = dependencies['scheduler'];
    this.#state = dependencies['state'];

    return;
  }

  /**
   * Routes - Dashboard - Register.
   *
   * Installs the dashboard routes behind the session-or-scope check.
   * Lists use the shared items envelope.
   *
   * @param {Routes_Dashboard_Runner_Register_App} app - App.
   *
   * @returns {Routes_Dashboard_Runner_Register_Returns}
   *
   * @since 1.0.0
   */
  public register(app: Routes_Dashboard_Runner_Register_App): Routes_Dashboard_Runner_Register_Returns {
    app.get('/api/v1/overview', this.#access.requireScope('status:read', false), this['routeOverview'].bind(this));

    app.get('/api/v1/containers', this.#access.requireScope('status:read', false), this['routeContainers'].bind(this));

    app.get('/api/v1/history', this.#access.requireScope('status:read', false), this['routeHistory'].bind(this));

    app.get('/api/v1/settings', this.#access.requireScope('status:read', false), this['routeSettings'].bind(this));

    app.put('/api/v1/settings', this.#access.requireSession(true), this['routeUpdateSettings'].bind(this));

    app.post('/api/v1/checks', this.#access.requireScope('updates:run', true), this['routeChecks'].bind(this));

    app.get('/api/v1/status', this.#access.requireScope('status:read', false), this['routeStatus'].bind(this));

    app.get('/api/v1/events', this.#access.requireScope('status:read', false), this['routeEvents'].bind(this));

    return;
  }

  /**
   * Routes - Dashboard - Get Overview.
   *
   * Combines the scheduler state with the schedule and update mode.
   * The overview route and every state event send this same object.
   *
   * @private
   *
   * @returns {Routes_Dashboard_Runner_GetOverview_Returns}
   *
   * @since 1.0.0
   */
  private getOverview(): Routes_Dashboard_Runner_GetOverview_Returns {
    // The schedule runs in this process's time zone, which TZ sets (UTC in the image).
    const timeZone: Routes_Dashboard_Runner_GetOverview_Returns_TimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    return {
      ...this.#scheduler.getState(),
      schedule: this.#config['schedule'],
      timeZone,
      labelMode: this.#config['updater']['labelMode'],
      monitorOnly: this.#config['updater']['monitorOnly'],
    };
  }

  /**
   * Routes - Dashboard - Route Checks.
   *
   * Starts a check of every managed container, or of the one container named.
   * Only one check runs at a time, so a second request gets a conflict.
   *
   * @param {Routes_Dashboard_Runner_RouteChecks_Request}  request  - Request.
   * @param {Routes_Dashboard_Runner_RouteChecks_Response} response - Response.
   *
   * @private
   *
   * @returns {Routes_Dashboard_Runner_RouteChecks_Returns}
   *
   * @since 1.0.0
   */
  private routeChecks(request: Routes_Dashboard_Runner_RouteChecks_Request, response: Routes_Dashboard_Runner_RouteChecks_Response): Routes_Dashboard_Runner_RouteChecks_Returns {
    const requestBody: Routes_Dashboard_Runner_RouteChecks_RequestBody = checkStart.safeParse(request.body ?? {});

    if (requestBody['success'] === false) {
      sendValidationError(response, 422, requestBody['error'], 'Check the highlighted fields.');

      return;
    }

    const containerId: Routes_Dashboard_Runner_RouteChecks_ContainerId = requestBody['data']['containerId'];
    const trigger: Routes_Dashboard_Runner_RouteChecks_Trigger = (response.locals['personalAccessToken'] === undefined) ? 'dashboard' : 'api';
    const started: Routes_Dashboard_Runner_RouteChecks_Started = this.#scheduler.trigger(trigger, (containerId === undefined) ? undefined : [containerId]);

    if (started === false) {
      sendError(response, 409, 'check_running', 'A check is already running.');

      return;
    }

    response.status(202).json({
      started: true,
    });

    return;
  }

  /**
   * Routes - Dashboard - Route Containers.
   *
   * Lists every running container with whether Outpost manages it and why not.
   * Each row also shows that container's result from its most recent check.
   *
   * @param {Routes_Dashboard_Runner_RouteContainers_Request}  _request - Request.
   * @param {Routes_Dashboard_Runner_RouteContainers_Response} response - Response.
   *
   * @private
   *
   * @returns {Routes_Dashboard_Runner_RouteContainers_Returns}
   *
   * @since 1.0.0
   */
  private async routeContainers(_request: Routes_Dashboard_Runner_RouteContainers_Request, response: Routes_Dashboard_Runner_RouteContainers_Response): Routes_Dashboard_Runner_RouteContainers_Returns {
    try {
      const containers: Routes_Dashboard_Runner_RouteContainers_Containers = await this.#listContainers();
      const inspectedContainers: Routes_Dashboard_Runner_RouteContainers_InspectedContainers = await Promise.all(containers.map(async (container) => this.#inspectContainer(container['Id'])));

      response.json({
        items: buildContainerRows(containers, this.#config['updater'], this.#history.list(), inspectedContainers),
      });
    } catch (error) {
      const errorMessage: Routes_Dashboard_Runner_RouteContainers_ErrorMessage = (error instanceof Error) ? error['message'] : String(error);

      process.stderr.write(`Could not list containers: ${errorMessage}\n`);

      sendError(response, 502, 'docker_unreachable', 'Outpost can\'t reach Docker. Check that the Docker socket is mounted.');
    }

    return;
  }

  /**
   * Routes - Dashboard - Route Events.
   *
   * Streams the scheduler state on connect and on every change, and each finished check.
   * A comment line every heartbeat keeps proxies from closing the connection.
   *
   * @param {Routes_Dashboard_Runner_RouteEvents_Request}  _request - Request.
   * @param {Routes_Dashboard_Runner_RouteEvents_Response} response - Response.
   *
   * @private
   *
   * @returns {Routes_Dashboard_Runner_RouteEvents_Returns}
   *
   * @since 1.0.0
   */
  private routeEvents(_request: Routes_Dashboard_Runner_RouteEvents_Request, response: Routes_Dashboard_Runner_RouteEvents_Response): Routes_Dashboard_Runner_RouteEvents_Returns {
    response.status(200);

    response.set({
      'Cache-Control': 'no-store',
      'Content-Type': 'text/event-stream; charset=utf-8',
      'X-Accel-Buffering': 'no',
    });

    response.flushHeaders();

    response.write('retry: 3000\n\n');

    this.writeEvent(response, 'state', this.getOverview());

    const unsubscribe: Routes_Dashboard_Runner_RouteEvents_Unsubscribe = this.#scheduler.subscribe((event) => {
      if (event['type'] === 'check') {
        this.writeEvent(response, 'check', event['report']);

        return;
      }

      this.writeEvent(response, 'state', this.getOverview());

      return;
    });

    // Each heartbeat also rechecks the caller, so a signed-out session or revoked token stops here.
    const heartbeat: Routes_Dashboard_Runner_RouteEvents_Heartbeat = setInterval(() => {
      if (this.#access.hasActivePrincipal(response, 'status:read') === false) {
        response.end();

        return;
      }

      response.write(': keep-alive\n\n');

      return;
    }, this.#eventHeartbeatMilliseconds);

    heartbeat.unref();

    response.on('close', () => {
      clearInterval(heartbeat);

      unsubscribe();

      return;
    });

    return;
  }

  /**
   * Routes - Dashboard - Route History.
   *
   * Returns the saved check reports, newest first.
   * The history keeps the last 50 checks.
   *
   * @param {Routes_Dashboard_Runner_RouteHistory_Request}  _request - Request.
   * @param {Routes_Dashboard_Runner_RouteHistory_Response} response - Response.
   *
   * @private
   *
   * @returns {Routes_Dashboard_Runner_RouteHistory_Returns}
   *
   * @since 1.0.0
   */
  private routeHistory(_request: Routes_Dashboard_Runner_RouteHistory_Request, response: Routes_Dashboard_Runner_RouteHistory_Response): Routes_Dashboard_Runner_RouteHistory_Returns {
    response.json({
      items: this.#history.list(),
    });

    return;
  }

  /**
   * Routes - Dashboard - Route Overview.
   *
   * Returns the scheduler state with the schedule and update mode.
   * Live changes to the same object arrive through the event stream.
   *
   * @param {Routes_Dashboard_Runner_RouteOverview_Request}  _request - Request.
   * @param {Routes_Dashboard_Runner_RouteOverview_Response} response - Response.
   *
   * @private
   *
   * @returns {Routes_Dashboard_Runner_RouteOverview_Returns}
   *
   * @since 1.0.0
   */
  private routeOverview(_request: Routes_Dashboard_Runner_RouteOverview_Request, response: Routes_Dashboard_Runner_RouteOverview_Response): Routes_Dashboard_Runner_RouteOverview_Returns {
    response.json(this.getOverview());

    return;
  }

  /**
   * Routes - Dashboard - Route Settings.
   *
   * Returns editable runtime behavior and read-only container bootstrap details.
   * Scoped tokens may read this document but cannot change it.
   *
   * @param {Routes_Dashboard_Runner_RouteSettings_Request}  _request - Request.
   * @param {Routes_Dashboard_Runner_RouteSettings_Response} response - Response.
   *
   * @private
   *
   * @returns {Routes_Dashboard_Runner_RouteSettings_Returns}
   *
   * @since 1.0.0
   */
  private routeSettings(_request: Routes_Dashboard_Runner_RouteSettings_Request, response: Routes_Dashboard_Runner_RouteSettings_Response): Routes_Dashboard_Runner_RouteSettings_Returns {
    response.json(buildSettings(this.#config));

    return;
  }

  /**
   * Routes - Dashboard - Route Update Settings.
   *
   * Validates and persists editable behavior, then applies it to the running process.
   * Container bootstrap paths remain outside this endpoint.
   *
   * @param {Routes_Dashboard_Runner_RouteUpdateSettings_Request}  request  - Request.
   * @param {Routes_Dashboard_Runner_RouteUpdateSettings_Response} response - Response.
   *
   * @private
   *
   * @returns {Routes_Dashboard_Runner_RouteUpdateSettings_Returns}
   *
   * @since 1.0.0
   */
  private routeUpdateSettings(request: Routes_Dashboard_Runner_RouteUpdateSettings_Request, response: Routes_Dashboard_Runner_RouteUpdateSettings_Response): Routes_Dashboard_Runner_RouteUpdateSettings_Returns {
    const requestBody: Routes_Dashboard_Runner_RouteUpdateSettings_RequestBody = runtimeSettings.safeParse(request.body ?? {});

    if (requestBody['success'] === false) {
      sendValidationError(response, 422, requestBody['error'], 'Check the highlighted fields.');

      return;
    }

    this.#state.setRuntimeSettings(requestBody['data']);

    applyRuntimeSettings(this.#config, requestBody['data']);

    if (this.#onRuntimeSettingsChanged !== undefined) {
      this.#onRuntimeSettingsChanged(requestBody['data']);
    }

    response.json(buildSettings(this.#config));

    return;
  }

  /**
   * Routes - Dashboard - Route Status.
   *
   * Returns the scheduler state, the same body as the Watchtower-style status route.
   * The overview adds the schedule and update mode to it.
   *
   * @param {Routes_Dashboard_Runner_RouteStatus_Request}  _request - Request.
   * @param {Routes_Dashboard_Runner_RouteStatus_Response} response - Response.
   *
   * @private
   *
   * @returns {Routes_Dashboard_Runner_RouteStatus_Returns}
   *
   * @since 1.0.0
   */
  private routeStatus(_request: Routes_Dashboard_Runner_RouteStatus_Request, response: Routes_Dashboard_Runner_RouteStatus_Response): Routes_Dashboard_Runner_RouteStatus_Returns {
    response.json(this.#scheduler.getState());

    return;
  }

  /**
   * Routes - Dashboard - Write Event.
   *
   * Writes one named server-sent event with its JSON data.
   * JSON never contains a raw line break, so the data fits on one line.
   *
   * @param {Routes_Dashboard_Runner_WriteEvent_Response} response - Response.
   * @param {Routes_Dashboard_Runner_WriteEvent_Name}     name     - Name.
   * @param {Routes_Dashboard_Runner_WriteEvent_Data}     data     - Data.
   *
   * @private
   *
   * @returns {Routes_Dashboard_Runner_WriteEvent_Returns}
   *
   * @since 1.0.0
   */
  private writeEvent(response: Routes_Dashboard_Runner_WriteEvent_Response, name: Routes_Dashboard_Runner_WriteEvent_Name, data: Routes_Dashboard_Runner_WriteEvent_Data): Routes_Dashboard_Runner_WriteEvent_Returns {
    const lines: Routes_Dashboard_Runner_WriteEvent_Lines = [
      `event: ${name}`,
      `data: ${JSON.stringify(data)}`,
      '',
      '',
    ];

    response.write(lines.join('\n'));

    return;
  }
}

/**
 * Routes - Dashboard - Build Container Rows.
 *
 * Merges running containers with label rules, inspected configuration,
 * and saved history so every row shows its own most recent result and
 * permanent skip reasons never get update buttons.
 *
 * @param {Routes_Dashboard_BuildContainerRows_Containers}          containers          - Containers.
 * @param {Routes_Dashboard_BuildContainerRows_Options}             options             - Options.
 * @param {Routes_Dashboard_BuildContainerRows_Reports}             reports             - Reports.
 * @param {Routes_Dashboard_BuildContainerRows_InspectedContainers} inspectedContainers - Inspected containers.
 *
 * @returns {Routes_Dashboard_BuildContainerRows_Returns}
 *
 * @since 0.0.1
 */
export function buildContainerRows(containers: Routes_Dashboard_BuildContainerRows_Containers, options: Routes_Dashboard_BuildContainerRows_Options, reports: Routes_Dashboard_BuildContainerRows_Reports, inspectedContainers: Routes_Dashboard_BuildContainerRows_InspectedContainers): Routes_Dashboard_BuildContainerRows_Returns {
  const selection: Routes_Dashboard_BuildContainerRows_Selection = selectContainers(containers, options);

  return containers.map((container) => {
    const name: Routes_Dashboard_BuildContainerRows_Name = (container['Names'][0] ?? container['Id']).replace('/', '');
    const labels: Routes_Dashboard_BuildContainerRows_Labels = container['Labels'] ?? {};
    const inspected: Routes_Dashboard_BuildContainerRows_Inspected = inspectedContainers.find((candidate) => candidate['Id'] === container['Id']);
    const inspectedNetworkMode: Routes_Dashboard_BuildContainerRows_InspectedNetworkMode = (inspected === undefined) ? undefined : inspected['HostConfig']['NetworkMode'];
    const summaryNetworkMode: Routes_Dashboard_BuildContainerRows_SummaryNetworkMode = (container['HostConfig'] === undefined) ? undefined : container['HostConfig']['NetworkMode'];
    const networkMode: Routes_Dashboard_BuildContainerRows_NetworkMode = inspectedNetworkMode
      ?? summaryNetworkMode
      ?? '';
    const inspectedAutoRemove: Routes_Dashboard_BuildContainerRows_InspectedAutoRemove = inspected !== undefined && inspected['HostConfig']['AutoRemove'] === true;
    const summaryAutoRemove: Routes_Dashboard_BuildContainerRows_SummaryAutoRemove = container['HostConfig'] !== undefined && container['HostConfig']['AutoRemove'] === true;
    const autoRemove: Routes_Dashboard_BuildContainerRows_AutoRemove = inspectedAutoRemove === true || summaryAutoRemove === true;
    const inspectedConfiguredImage: Routes_Dashboard_BuildContainerRows_InspectedConfiguredImage = (inspected === undefined) ? undefined : inspected['Config']['Image'];
    const configuredImage: Routes_Dashboard_BuildContainerRows_ConfiguredImage = inspectedConfiguredImage ?? container['Image'];
    const pinned: Routes_Dashboard_BuildContainerRows_Pinned = configuredImage.includes('@') === true || configuredImage.startsWith('sha256:') === true;
    const skipped: Routes_Dashboard_BuildContainerRows_Skipped = selection['skipped'].find((result) => result['container'] === name);
    const managed: Routes_Dashboard_BuildContainerRows_Managed = selection['candidates'].some((candidate) => candidate['Id'] === container['Id'])
      && pinned === false
      && networkMode.startsWith('container:') === false
      && autoRemove === false;
    const isSelf: Routes_Dashboard_BuildContainerRows_IsSelf = options['selfId'] !== undefined && container['Id'].startsWith(options['selfId']);
    const lastReport: Routes_Dashboard_BuildContainerRows_LastReport = reports.find((report) => report['results'].some((result) => result['container'] === name));
    const lastResult: Routes_Dashboard_BuildContainerRows_LastResult = (lastReport === undefined) ? undefined : lastReport['results'].find((result) => result['container'] === name);
    let note: Routes_Dashboard_BuildContainerRows_Note = 'Managed';

    if (labels[ENABLE_LABEL] === 'false') {
      note = 'Opted out by label';
    } else if (pinned === true) {
      note = 'Pinned image';
    } else if (networkMode.startsWith('container:') === true) {
      note = 'Shared network namespace';
    } else if (skipped !== undefined && skipped['detail'] === 'Has containers sharing its network namespace') {
      note = 'Network namespace owner';
    } else if (autoRemove === true) {
      note = 'Automatic removal enabled';
    } else if (skipped !== undefined && skipped['detail'] === 'Outpost couldn\'t find its own container, so it leaves Outpost containers alone') {
      note = 'Outpost container';
    } else if (managed === false) {
      note = 'Not opted in';
    }

    return {
      id: container['Id'].slice(0, 12),
      name,
      image: container['Image'],
      state: container['State'],
      managed,
      note,
      self: isSelf,
      monitorOnly: options['monitorOnly'] === true || labels[MONITOR_ONLY_LABEL] === 'true',
      lastStatus: (lastResult !== undefined) ? lastResult['status'] : undefined,
      lastDetail: (lastResult !== undefined) ? lastResult['detail'] : undefined,
      lastCheckedAt: (lastResult !== undefined && lastReport !== undefined) ? lastReport['finishedAt'] : undefined,
    };
  }).sort((a, b) => a['name'].localeCompare(b['name']));
}

/**
 * Routes - Dashboard - Build Settings.
 *
 * Returns editable behavior separately from read-only container bootstrap details.
 * Secret values and obsolete environment options never enter this response.
 *
 * @param {Routes_Dashboard_BuildSettings_Config} config - Config.
 *
 * @returns {Routes_Dashboard_BuildSettings_Returns}
 *
 * @since 0.0.1
 */
export function buildSettings(config: Routes_Dashboard_BuildSettings_Config): Routes_Dashboard_BuildSettings_Returns {
  // The cron job runs in this process's time zone, which TZ sets (UTC in the image).
  const timeZone: Routes_Dashboard_BuildSettings_TimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return {
    runtime: runtimeSettingsFromConfig(config),
    system: {
      dataDirectory: config['dataDirectory'],
      dockerHost: config['dockerHost'],
      timeZone,
    },
  };
}

/**
 * Admin - State.
 *
 * Holds the CSRF token for the current session, the visible section,
 * and the polling timer. Nothing here is written to browser storage.
 *
 * @since 0.0.1
 */
const state = {
  csrfToken: '',
  view: 'overview',
  pollTimer: undefined,
  wasRunning: false,
};

/**
 * Admin - Status Labels.
 *
 * Readable labels for the result statuses the update engine reports,
 * shared by the overview, containers, and history views.
 *
 * @since 0.0.1
 */
const statusLabels = {
  'updated': 'Updated',
  'available': 'Update available',
  'up-to-date': 'Up to date',
  'skipped': 'Skipped',
  'rolled-back': 'Rolled back',
  'failed': 'Failed',
};

/**
 * Admin - By ID.
 *
 * Looks up an element that the static shell is known to contain and
 * fails loudly if the markup and script drift apart.
 *
 * @param {string} id - Id.
 *
 * @returns {HTMLElement}
 *
 * @since 0.0.1
 */
function byId(id) {
  const element = globalThis.document.getElementById(id);

  if (element === null) {
    throw new Error(`Missing element #${id}`);
  }

  return element;
}

/**
 * Admin - Create Element.
 *
 * Builds an element with a class and text content. Text is always set
 * through textContent so container names can never inject markup.
 *
 * @param {string} tagName   - Tag name.
 * @param {string} className - Class name.
 * @param {string} text      - Text.
 *
 * @returns {HTMLElement}
 *
 * @since 0.0.1
 */
function createElement(tagName, className, text) {
  const element = globalThis.document.createElement(tagName);

  if (className !== '') {
    element.className = className;
  }

  if (text !== '') {
    element.textContent = text;
  }

  return element;
}

/**
 * Admin - Create Badge.
 *
 * Renders a status pill whose color comes from the status name, such as
 * green for updated and red for failed.
 *
 * @param {string} status - Status.
 * @param {string} label  - Label.
 *
 * @returns {HTMLElement}
 *
 * @since 0.0.1
 */
function createBadge(status, label) {
  return createElement('span', `outpost-badge outpost-badge--${status}`, label);
}

/**
 * Admin - Format Time.
 *
 * Formats an ISO timestamp in the browser's locale, or a dash when the
 * value is missing.
 *
 * @param {string | undefined} value - Value.
 *
 * @returns {string}
 *
 * @since 0.0.1
 */
function formatTime(value) {
  if (value === undefined || value === null) {
    return '–';
  }

  return new Date(value).toLocaleString();
}

/**
 * Admin - Format Relative.
 *
 * Describes how far a timestamp is from now ("5 min ago", "in 3 h"),
 * which is easier to scan than a full date.
 *
 * @param {string | undefined} value - Value.
 *
 * @returns {string}
 *
 * @since 0.0.1
 */
function formatRelative(value) {
  if (value === undefined || value === null) {
    return '–';
  }

  const seconds = Math.round((Date.parse(value) - Date.now()) / 1000);
  const absolute = Math.abs(seconds);
  let amount = `${String(absolute)} s`;

  if (absolute >= 86400) {
    amount = `${String(Math.round(absolute / 86400))} d`;
  } else if (absolute >= 3600) {
    amount = `${String(Math.round(absolute / 3600))} h`;
  } else if (absolute >= 60) {
    amount = `${String(Math.round(absolute / 60))} min`;
  }

  return (seconds < 0) ? `${amount} ago` : `in ${amount}`;
}

/**
 * Admin - Show Toast.
 *
 * Shows a short status message in the corner and hides it again after
 * a few seconds.
 *
 * @param {string} message - Message.
 *
 * @returns {void}
 *
 * @since 0.0.1
 */
function showToast(message) {
  const toast = byId('toast');

  toast.textContent = message;
  toast.hidden = false;

  globalThis.setTimeout(() => {
    toast.hidden = true;

    return;
  }, 4000);

  return;
}

/**
 * Admin - Request.
 *
 * Calls the dashboard API with the session cookie and, for changes, the
 * CSRF token. A 401 sends the user back to the sign-in screen.
 *
 * @param {string} method - Method.
 * @param {string} path   - Path.
 * @param {object} body   - Body.
 *
 * @returns {Promise<object>}
 *
 * @since 0.0.1
 */
async function request(method, path, body) {
  const headers = { Accept: 'application/json' };

  if (method !== 'GET') {
    Reflect.set(headers, 'Content-Type', 'application/json');
    Reflect.set(headers, 'X-CSRF-Token', state.csrfToken);
  }

  const response = await globalThis.fetch(`/admin/api${path}`, {
    method,
    headers,
    credentials: 'same-origin',
    ...((body !== undefined) ? { body: JSON.stringify(body) } : {}),
  });

  if (response.status === 204) {
    return {
      status: response.status,
      data: {},
    };
  }

  const data = await response.json().catch(() => ({}));

  if (response.status === 401 && path !== '/session') {
    showLogin(false);
  }

  return {
    status: response.status,
    data,
  };
}

/**
 * Admin - Show Login.
 *
 * Switches to the sign-in screen and stops polling. When the dashboard
 * has no password configured, explains how to unlock it instead.
 *
 * @param {boolean} disabled - Disabled.
 *
 * @returns {void}
 *
 * @since 0.0.1
 */
function showLogin(disabled) {
  stopPolling();

  byId('app-view').hidden = true;
  byId('login-view').hidden = false;
  byId('login-disabled').hidden = disabled === false;
  byId('login-submit').disabled = disabled === true;

  return;
}

/**
 * Admin - Show App.
 *
 * Switches to the dashboard after a successful sign-in, remembers the
 * CSRF token, and loads every section.
 *
 * @param {string} username  - Username.
 * @param {string} csrfToken - Csrf token.
 *
 * @returns {void}
 *
 * @since 0.0.1
 */
function showApp(username, csrfToken) {
  state.csrfToken = csrfToken;

  byId('login-view').hidden = true;
  byId('app-view').hidden = false;
  byId('current-user').textContent = username;

  void refreshAll();

  return;
}

/**
 * Admin - Show View.
 *
 * Shows one section and marks its navigation button as current so
 * screen readers announce the active section.
 *
 * @param {string} view - View.
 *
 * @returns {void}
 *
 * @since 0.0.1
 */
function showView(view) {
  state.view = view;

  for (const section of globalThis.document.querySelectorAll('[data-section]')) {
    section.hidden = section.getAttribute('data-section') !== view;
  }

  for (const button of globalThis.document.querySelectorAll('[data-view]')) {
    if (button.getAttribute('data-view') === view) {
      button.setAttribute('aria-current', 'page');
    } else {
      button.removeAttribute('aria-current');
    }
  }

  return;
}

/**
 * Admin - Render Results.
 *
 * Renders a report's per-container results as a table, or an empty
 * state when there is no report yet.
 *
 * @param {HTMLElement}        container - Container.
 * @param {object | undefined} report    - Report.
 *
 * @returns {void}
 *
 * @since 0.0.1
 */
function renderResults(container, report) {
  container.replaceChildren();

  if (
    report === undefined
    || report === null
    || report.results.length === 0
  ) {
    container.append(createElement('p', 'outpost-empty', 'No checks have run yet. Use "Check now" to run one.'));

    return;
  }

  const table = createElement('table', 'outpost-table', '');
  const body = createElement('tbody', '', '');

  for (const result of report.results) {
    const row = createElement('tr', '', '');
    const statusCell = createElement('td', '', '');

    statusCell.append(createBadge(result.status, statusLabels[result.status] ?? result.status));

    row.append(createElement('td', '', result.container), createElement('td', 'outpost-mono', result.image), statusCell, createElement('td', 'outpost-table__detail', result.detail));

    body.append(row);
  }

  table.append(body);

  const wrap = createElement('div', 'outpost-table-wrap', '');

  wrap.append(table);

  container.append(wrap);

  return;
}

/**
 * Admin - Refresh Overview.
 *
 * Loads the scheduler state, fills in the summary cards, and adjusts
 * the polling speed while a check is running.
 *
 * @returns {Promise<void>}
 *
 * @since 0.0.1
 */
async function refreshOverview() {
  const response = await request('GET', '/overview', undefined);

  if (response.status !== 200) {
    return;
  }

  const overview = response.data;
  const modeParts = [(overview.labelMode === 'opt-in') ? 'Opt-in: only labeled containers are updated' : 'Opt-out: every container is updated unless labeled off'];

  if (overview.monitorOnly === true) {
    modeParts.push('monitor-only (updates are reported, not applied)');
  }

  byId('overview-mode').textContent = modeParts.join(', ');
  byId('check-now').disabled = overview.running === true;
  byId('stat-status').replaceChildren(createBadge((overview.running === true) ? 'running' : 'idle', (overview.running === true) ? 'Checking' : 'Idle'));
  byId('stat-status-hint').textContent = (overview.running === true) ? `Started ${formatRelative(overview.startedAt)}` : `${String(overview.totals.cycles)} checks since start`;
  byId('stat-last').textContent = (overview.lastReport !== undefined) ? formatRelative(overview.lastReport.finishedAt) : '–';
  byId('stat-last-hint').textContent = (overview.lastReport !== undefined) ? formatTime(overview.lastReport.finishedAt) : 'No checks yet';
  byId('stat-next').textContent = formatRelative(overview.nextRun);
  byId('stat-next-hint').textContent = `Schedule ${overview.schedule}`;

  const errorBox = byId('overview-error');

  errorBox.hidden = overview.lastError === undefined;
  errorBox.textContent = (overview.lastError !== undefined) ? `The last check failed: ${overview.lastError}` : '';

  renderResults(byId('overview-results'), overview.lastReport);

  // Refresh everything once when a running check finishes.
  if (state.wasRunning === true && overview.running === false) {
    showToast('Check finished.');

    void refreshContainers();
    void refreshHistory();
  }

  state.wasRunning = overview.running === true;

  schedulePoll((overview.running === true) ? 2000 : 30000);

  return;
}

/**
 * Admin - Refresh Containers.
 *
 * Loads the running containers and renders the table with a check
 * button for every managed container.
 *
 * @returns {Promise<void>}
 *
 * @since 0.0.1
 */
async function refreshContainers() {
  const response = await request('GET', '/containers', undefined);
  const errorBox = byId('containers-error');
  const body = byId('containers-body');

  if (response.status !== 200) {
    errorBox.hidden = false;
    errorBox.textContent = response.data.error ?? 'Could not load containers.';

    return;
  }

  errorBox.hidden = true;
  body.replaceChildren();

  const managedCount = response.data.filter((row) => row.managed === true).length;
  const availableCount = response.data.filter((row) => row.lastStatus === 'available').length;

  byId('stat-managed').textContent = String(managedCount);
  byId('stat-managed-hint').textContent = `${String(response.data.length)} running, ${String(availableCount)} with updates available`;

  if (response.data.length === 0) {
    const row = createElement('tr', '', '');
    const cell = createElement('td', 'outpost-empty', 'No running containers.');

    cell.colSpan = 5;
    row.append(cell);

    body.append(row);

    return;
  }

  for (const container of response.data) {
    const row = createElement('tr', '', '');
    const nameCell = createElement('td', '', '');
    const resultCell = createElement('td', '', '');
    const managedCell = createElement('td', '', '');
    const actionCell = createElement('td', '', '');

    nameCell.append(createElement('div', '', container.name), createElement('div', 'outpost-table__detail outpost-mono', container.id));

    if (container.lastStatus !== undefined) {
      resultCell.append(createBadge(container.lastStatus, statusLabels[container.lastStatus] ?? container.lastStatus), createElement('div', 'outpost-table__detail', container.lastDetail ?? ''));
    } else {
      resultCell.append(createElement('span', 'outpost-table__detail', 'Not checked yet'));
    }

    managedCell.append(createElement('div', '', container.note));

    if (container.monitorOnly === true && container.managed === true) {
      managedCell.append(createElement('div', 'outpost-table__detail', 'Monitor only'));
    }

    if (container.managed === true) {
      const button = createElement('button', 'outpost-button outpost-button--small', (container.monitorOnly === true) ? 'Check' : 'Check & update');

      button.type = 'button';
      button.dataset.containerId = container.id;

      actionCell.append(button);
    }

    row.append(nameCell, createElement('td', 'outpost-mono outpost-table__detail', container.image), resultCell, managedCell, actionCell);

    body.append(row);
  }

  return;
}

/**
 * Admin - Refresh History.
 *
 * Loads past checks and renders each one as an expandable entry with
 * counts by status in its summary.
 *
 * @returns {Promise<void>}
 *
 * @since 0.0.1
 */
async function refreshHistory() {
  const response = await request('GET', '/history', undefined);
  const list = byId('history-list');

  if (response.status !== 200) {
    return;
  }

  list.replaceChildren();

  if (response.data.length === 0) {
    list.append(createElement('p', 'outpost-empty', 'No checks have run yet.'));

    return;
  }

  for (const report of response.data) {
    const details = createElement('details', 'outpost-run', '');
    const summary = createElement('summary', '', '');
    const badges = createElement('span', 'outpost-run__badges', '');
    const counts = new Map();

    for (const result of report.results) {
      counts.set(result.status, (counts.get(result.status) ?? 0) + 1);
    }

    for (const entry of counts) {
      badges.append(createBadge(entry[0], `${String(entry[1])} ${(statusLabels[entry[0]] ?? entry[0]).toLowerCase()}`));
    }

    if (report.results.length === 0) {
      badges.append(createBadge('skipped', 'nothing to check'));
    }

    summary.append(createElement('span', 'outpost-run__time', formatTime(report.finishedAt)), badges);

    const results = createElement('div', '', '');

    renderResults(results, report);

    details.append(summary, results);

    list.append(details);
  }

  return;
}

/**
 * Admin - Refresh Settings.
 *
 * Loads the read-only configuration and renders it grouped by area.
 * Secrets arrive from the server as "Set" or "Not set" only.
 *
 * @returns {Promise<void>}
 *
 * @since 0.0.1
 */
async function refreshSettings() {
  const response = await request('GET', '/settings', undefined);
  const container = byId('settings-groups');

  if (response.status !== 200) {
    return;
  }

  container.replaceChildren();

  const groups = new Map();

  for (const setting of response.data) {
    const group = groups.get(setting.group) ?? [];

    group.push(setting);

    groups.set(setting.group, group);
  }

  for (const entry of groups) {
    const panel = createElement('div', 'outpost-panel', '');
    const list = createElement('dl', 'outpost-settings', '');

    for (const setting of entry[1]) {
      list.append(createElement('dt', '', setting.name), createElement('dd', '', setting.value));
    }

    panel.append(createElement('h3', 'outpost-panel__title', entry[0]), list);

    container.append(panel);
  }

  return;
}

/**
 * Admin - Refresh All.
 *
 * Loads every section in parallel after sign-in so the first view is
 * complete when the user switches tabs.
 *
 * @returns {Promise<void>}
 *
 * @since 0.0.1
 */
async function refreshAll() {
  await Promise.all([
    refreshOverview(),
    refreshContainers(),
    refreshHistory(),
    refreshSettings(),
  ]);

  return;
}

/**
 * Admin - Schedule Poll.
 *
 * Re-checks the overview after a delay: quickly while a check runs,
 * slowly otherwise.
 *
 * @param {number} delay - Delay.
 *
 * @returns {void}
 *
 * @since 0.0.1
 */
function schedulePoll(delay) {
  stopPolling();

  state.pollTimer = globalThis.setTimeout(() => {
    void refreshOverview();

    return;
  }, delay);

  return;
}

/**
 * Admin - Stop Polling.
 *
 * Cancels the pending overview refresh, used on sign-out and before a
 * new poll is scheduled.
 *
 * @returns {void}
 *
 * @since 0.0.1
 */
function stopPolling() {
  if (state.pollTimer !== undefined) {
    globalThis.clearTimeout(state.pollTimer);

    state.pollTimer = undefined;
  }

  return;
}

/**
 * Admin - Start Check.
 *
 * Asks the server to run a check, for everything or one container, and
 * switches the overview into its fast polling mode.
 *
 * @param {string | undefined} containerId - Container id.
 *
 * @returns {Promise<void>}
 *
 * @since 0.0.1
 */
async function startCheck(containerId) {
  const response = await request('POST', '/run', (containerId !== undefined) ? { containerId } : {});

  if (response.status === 202) {
    showToast((containerId !== undefined) ? 'Checking the container…' : 'Checking all managed containers…');
  } else if (response.status === 409) {
    showToast('A check is already running.');
  } else {
    showToast(response.data.error ?? 'Could not start a check.');
  }

  await refreshOverview();

  return;
}

/**
 * Admin - Handle Login.
 *
 * Submits the sign-in form and opens the dashboard on success, or
 * shows the server's error message.
 *
 * @param {SubmitEvent} event - Event.
 *
 * @returns {Promise<void>}
 *
 * @since 0.0.1
 */
async function handleLogin(event) {
  event.preventDefault();

  const errorBox = byId('login-error');
  const response = await request('POST', '/session', {
    username: byId('login-username').value,
    password: byId('login-password').value,
  });

  if (response.status !== 200) {
    errorBox.hidden = false;
    errorBox.textContent = response.data.error ?? 'Sign-in failed.';

    return;
  }

  errorBox.hidden = true;
  byId('login-password').value = '';

  showApp(response.data.username, response.data.csrfToken);

  return;
}

/**
 * Admin - Handle Click.
 *
 * Routes clicks for navigation, checks, and sign-out through one
 * delegated listener.
 *
 * @param {MouseEvent} event - Event.
 *
 * @returns {void}
 *
 * @since 0.0.1
 */
function handleClick(event) {
  if ((event.target instanceof globalThis.Element) === false) {
    return;
  }

  const viewButton = event.target.closest('[data-view]');
  const containerButton = event.target.closest('[data-container-id]');

  if (viewButton !== null) {
    showView(viewButton.getAttribute('data-view') ?? 'overview');
  } else if (containerButton !== null) {
    void startCheck(containerButton.getAttribute('data-container-id') ?? undefined);
  } else if (event.target.closest('#check-now') !== null) {
    void startCheck(undefined);
  } else if (event.target.closest('#logout-button') !== null) {
    void request('DELETE', '/session', undefined).then(() => {
      showLogin(false);

      return;
    });
  }

  return;
}

/**
 * Admin - Initialize.
 *
 * Wires up listeners and asks the server whether a session already
 * exists, so a reload does not require signing in again.
 *
 * @returns {Promise<void>}
 *
 * @since 0.0.1
 */
async function initialize() {
  byId('login-form').addEventListener('submit', (event) => {
    void handleLogin(event);

    return;
  });

  globalThis.document.addEventListener('click', handleClick);

  const response = await request('GET', '/session', undefined);

  if (response.data.authenticated === true) {
    showApp(response.data.username, response.data.csrfToken);

    return;
  }

  showLogin(response.data.enabled === false);

  return;
}

void initialize();

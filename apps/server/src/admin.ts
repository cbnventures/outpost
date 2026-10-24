import { timingSafeEqual } from 'node:crypto';
import { basename, dirname } from 'node:path';

import express from 'express';
import { ENABLE_LABEL, MONITOR_ONLY_LABEL, selectContainers } from 'outpost-package-updater';

import type {
  Admin_BuildContainerRows_Containers,
  Admin_BuildContainerRows_IsSelf,
  Admin_BuildContainerRows_Labels,
  Admin_BuildContainerRows_LastReport,
  Admin_BuildContainerRows_LastResult,
  Admin_BuildContainerRows_Managed,
  Admin_BuildContainerRows_Name,
  Admin_BuildContainerRows_Note,
  Admin_BuildContainerRows_Options,
  Admin_BuildContainerRows_Returns,
  Admin_BuildContainerRows_Selection,
  Admin_BuildSettings_Config,
  Admin_BuildSettings_Returns,
  Admin_BuildSettings_Targets,
  Admin_BuildSettings_Updater,
  Admin_CreateAdminRouter_ApiContainers_Containers,
  Admin_CreateAdminRouter_ApiContainers_ErrorMessage,
  Admin_CreateAdminRouter_ApiRun_Body,
  Admin_CreateAdminRouter_ApiRun_ContainerIds,
  Admin_CreateAdminRouter_ApiRun_Started,
  Admin_CreateAdminRouter_ApiSession_Body,
  Admin_CreateAdminRouter_ApiSession_Result,
  Admin_CreateAdminRouter_ApiSession_Secure,
  Admin_CreateAdminRouter_ApiSession_Session,
  Admin_CreateAdminRouter_Dependencies,
  Admin_CreateAdminRouter_RequireCsrf,
  Admin_CreateAdminRouter_RequireCsrf_Expected,
  Admin_CreateAdminRouter_RequireCsrf_Provided,
  Admin_CreateAdminRouter_RequireSession,
  Admin_CreateAdminRouter_RequireSession_Session,
  Admin_CreateAdminRouter_Returns,
  Admin_CreateAdminRouter_Router,
  Admin_ReadSessionId_Cookie,
  Admin_ReadSessionId_Name,
  Admin_ReadSessionId_Returns,
  Admin_ReadSessionId_SeparatorIndex,
  Admin_ReadSessionId_Value,
} from './types/admin.d.ts';

/**
 * Admin - Cookie Name.
 *
 * Name of the session cookie. It is scoped to /admin, HTTP-only, and
 * SameSite=Strict.
 *
 * @since 0.0.1
 */
const cookieName = 'outpost_session';

/**
 * Admin - Create Admin Router.
 *
 * Serves the dashboard at /admin and its JSON API at /admin/api. Every
 * API route except login requires a session, and every change also
 * requires the session's CSRF token in the X-CSRF-Token header.
 *
 * @param {Admin_CreateAdminRouter_Dependencies} dependencies - Dependencies.
 *
 * @returns {Admin_CreateAdminRouter_Returns}
 *
 * @since 0.0.1
 */
export function createAdminRouter(dependencies: Admin_CreateAdminRouter_Dependencies): Admin_CreateAdminRouter_Returns {
  const router: Admin_CreateAdminRouter_Router = express.Router();

  router.use((_request, response, next) => {
    response.set({
      'Content-Security-Policy': 'default-src \'self\'; img-src \'self\' data:; frame-ancestors \'none\'; base-uri \'none\'; form-action \'self\'',
      'Referrer-Policy': 'no-referrer',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
    });

    next();

    return;
  });

  router.use('/assets', express.static(dependencies['assetsDirectory'], {
    fallthrough: false,
    index: false,
  }));

  router.get('/', (_request, response) => {
    response.set('Cache-Control', 'no-store');

    // Resolve relative to the folder; absolute paths under dot-folders (like ~/.code) are refused.
    response.sendFile(basename(dependencies['indexPath']), { root: dirname(dependencies['indexPath']) });

    return;
  });

  router.use('/api', express.json({ limit: '16kb' }), (_request, response, next) => {
    response.set('Cache-Control', 'no-store');

    next();

    return;
  });

  /**
   * Admin - Create Admin Router - Require Session.
   *
   * Rejects API requests without a valid session cookie and stores the
   * session on the response for the CSRF check.
   *
   * @param {Request}      request  - Request.
   * @param {Response}     response - Response.
   * @param {NextFunction} next     - Next.
   *
   * @returns {void}
   *
   * @since 0.0.1
   */
  const requireSession: Admin_CreateAdminRouter_RequireSession = (request, response, next) => {
    const session: Admin_CreateAdminRouter_RequireSession_Session = dependencies['sessions'].verify(readSessionId(request.get('Cookie')));

    if (session === undefined) {
      response.status(401).json({ error: 'Sign in to continue.' });

      return;
    }

    Reflect.set(response.locals, 'csrfToken', session['csrfToken']);

    next();

    return;
  };

  /**
   * Admin - Create Admin Router - Require Csrf.
   *
   * Rejects changes whose X-CSRF-Token header does not match the
   * session's token, which blocks cross-site form submissions.
   *
   * @param {Request}      request  - Request.
   * @param {Response}     response - Response.
   * @param {NextFunction} next     - Next.
   *
   * @returns {void}
   *
   * @since 0.0.1
   */
  const requireCsrf: Admin_CreateAdminRouter_RequireCsrf = (request, response, next) => {
    const provided: Admin_CreateAdminRouter_RequireCsrf_Provided = Buffer.from(request.get('X-CSRF-Token') ?? '');
    const expected: Admin_CreateAdminRouter_RequireCsrf_Expected = Buffer.from(String(response.locals['csrfToken']));

    if (provided.length !== expected.length || timingSafeEqual(provided, expected) === false) {
      response.status(403).json({ error: 'The page is out of date. Reload and try again.' });

      return;
    }

    next();

    return;
  };

  router.get('/api/session', (request, response) => {
    const session: Admin_CreateAdminRouter_ApiSession_Session = dependencies['sessions'].verify(readSessionId(request.get('Cookie')));

    response.json({
      enabled: dependencies['sessions'].isEnabled(),
      authenticated: session !== undefined,
      ...((session !== undefined) ? {
        username: session['username'],
        csrfToken: session['csrfToken'],
      } : {}),
    });

    return;
  });

  router.post('/api/session', (request, response) => {
    const body: Admin_CreateAdminRouter_ApiSession_Body = (typeof request.body === 'object' && request.body !== null) ? request.body : {};
    const result: Admin_CreateAdminRouter_ApiSession_Result = dependencies['sessions'].login(String(body['username'] ?? ''), String(body['password'] ?? ''), request.ip ?? 'unknown');

    if (result['outcome'] === 'disabled') {
      response.status(503).json({ error: 'The dashboard is disabled. Set OUTPOST_ADMIN_PASSWORD_FILE (or OUTPOST_ADMIN_PASSWORD) and restart Outpost.' });

      return;
    }

    if (result['outcome'] === 'rate-limited') {
      response.status(429).json({ error: 'Too many failed sign-ins. Wait 15 minutes and try again.' });

      return;
    }

    if (result['outcome'] === 'invalid' || ('sessionId' in result) === false) {
      response.status(401).json({ error: 'Incorrect username or password.' });

      return;
    }

    const secure: Admin_CreateAdminRouter_ApiSession_Secure = (request.secure === true) ? '; Secure' : '';

    response.set('Set-Cookie', `${cookieName}=${result['sessionId']}; Path=/admin; HttpOnly; SameSite=Strict${secure}`);

    response.json({
      username: result['username'],
      csrfToken: result['csrfToken'],
    });

    return;
  });

  router.delete('/api/session', requireSession, requireCsrf, (request, response) => {
    dependencies['sessions'].logout(readSessionId(request.get('Cookie')));

    response.set('Set-Cookie', `${cookieName}=; Path=/admin; HttpOnly; SameSite=Strict; Max-Age=0`);

    response.status(204).end();

    return;
  });

  router.get('/api/overview', requireSession, (_request, response) => {
    response.json({
      ...dependencies['scheduler'].getState(),
      schedule: dependencies['config']['schedule'],
      labelMode: dependencies['config']['updater']['labelMode'],
      monitorOnly: dependencies['config']['updater']['monitorOnly'],
    });

    return;
  });

  router.get('/api/containers', requireSession, async (_request, response) => {
    try {
      const containers: Admin_CreateAdminRouter_ApiContainers_Containers = await dependencies.listContainers();

      response.json(buildContainerRows(containers, dependencies['config']['updater'], dependencies['scheduler'].getState()['lastReport']));
    } catch (error) {
      const errorMessage: Admin_CreateAdminRouter_ApiContainers_ErrorMessage = (error instanceof Error) ? error['message'] : String(error);

      response.status(502).json({ error: `Docker is unreachable: ${errorMessage}` });
    }

    return;
  });

  router.get('/api/history', requireSession, (_request, response) => {
    response.json(dependencies['history'].list());

    return;
  });

  router.get('/api/settings', requireSession, (_request, response) => {
    response.json(buildSettings(dependencies['config']));

    return;
  });

  router.post('/api/run', requireSession, requireCsrf, (request, response) => {
    const body: Admin_CreateAdminRouter_ApiRun_Body = (typeof request.body === 'object' && request.body !== null) ? request.body : {};
    const containerIds: Admin_CreateAdminRouter_ApiRun_ContainerIds = (typeof body['containerId'] === 'string' && body['containerId'] !== '') ? [body['containerId']] : undefined;
    const started: Admin_CreateAdminRouter_ApiRun_Started = dependencies['scheduler'].trigger(containerIds);

    response.status((started === true) ? 202 : 409).json({ started });

    return;
  });

  return router;
}

/**
 * Admin - Build Container Rows.
 *
 * Merges the running containers with the label rules and the newest
 * report, so the dashboard shows whether each container is managed and
 * what happened to it last.
 *
 * @param {Admin_BuildContainerRows_Containers} containers - Containers.
 * @param {Admin_BuildContainerRows_Options}    options    - Options.
 * @param {Admin_BuildContainerRows_LastReport} lastReport - Last report.
 *
 * @returns {Admin_BuildContainerRows_Returns}
 *
 * @since 0.0.1
 */
export function buildContainerRows(containers: Admin_BuildContainerRows_Containers, options: Admin_BuildContainerRows_Options, lastReport: Admin_BuildContainerRows_LastReport): Admin_BuildContainerRows_Returns {
  const selection: Admin_BuildContainerRows_Selection = selectContainers(containers, options);

  return containers.map((container) => {
    const name: Admin_BuildContainerRows_Name = (container['Names'][0] ?? container['Id']).replace('/', '');
    const labels: Admin_BuildContainerRows_Labels = container['Labels'] ?? {};
    const managed: Admin_BuildContainerRows_Managed = selection['candidates'].some((candidate) => candidate['Id'] === container['Id']);
    const isSelf: Admin_BuildContainerRows_IsSelf = options['selfId'] !== undefined && container['Id'].startsWith(options['selfId']);
    const lastResult: Admin_BuildContainerRows_LastResult = (lastReport !== undefined) ? lastReport['results'].find((result) => result['container'] === name) : undefined;
    let note: Admin_BuildContainerRows_Note = 'Managed';

    if (isSelf === true) {
      note = 'Outpost itself';
    } else if (labels[ENABLE_LABEL] === 'false') {
      note = 'Opted out by label';
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
      monitorOnly: options['monitorOnly'] === true || labels[MONITOR_ONLY_LABEL] === 'true',
      lastStatus: (lastResult !== undefined) ? lastResult['status'] : undefined,
      lastDetail: (lastResult !== undefined) ? lastResult['detail'] : undefined,
      lastCheckedAt: (lastResult !== undefined && lastReport !== undefined) ? lastReport['finishedAt'] : undefined,
    };
  }).sort((a, b) => a['name'].localeCompare(b['name']));
}

/**
 * Admin - Build Settings.
 *
 * Returns the active configuration for the read-only settings view.
 * Secrets are reported only as set or not set.
 *
 * @param {Admin_BuildSettings_Config} config - Config.
 *
 * @returns {Admin_BuildSettings_Returns}
 *
 * @since 0.0.1
 */
export function buildSettings(config: Admin_BuildSettings_Config): Admin_BuildSettings_Returns {
  const updater: Admin_BuildSettings_Updater = config['updater'];
  const targets: Admin_BuildSettings_Targets = updater['notificationTargets'];

  return [
    {
      group: 'Schedule',
      name: 'OUTPOST_SCHEDULE',
      value: config['schedule'],
    },
    {
      group: 'Schedule',
      name: 'OUTPOST_RUN_ON_START',
      value: String(config['runOnStart']),
    },
    {
      group: 'Updates',
      name: 'OUTPOST_LABEL_MODE',
      value: updater['labelMode'],
    },
    {
      group: 'Updates',
      name: 'OUTPOST_MONITOR_ONLY',
      value: String(updater['monitorOnly']),
    },
    {
      group: 'Updates',
      name: 'OUTPOST_CLEANUP',
      value: String(updater['cleanup']),
    },
    {
      group: 'Updates',
      name: 'OUTPOST_STOP_TIMEOUT',
      value: `${String(updater['stopTimeoutSeconds'])}s`,
    },
    {
      group: 'Updates',
      name: 'OUTPOST_HEALTH_TIMEOUT',
      value: `${String(updater['healthTimeoutSeconds'])}s`,
    },
    {
      group: 'Updates',
      name: 'OUTPOST_SETTLE_SECONDS',
      value: `${String(updater['settleSeconds'])}s`,
    },
    {
      group: 'Docker',
      name: 'DOCKER_HOST',
      value: config['dockerHost'],
    },
    {
      group: 'Docker',
      name: 'Registry credentials',
      value: updater['dockerConfigPath'],
    },
    {
      group: 'Notifications',
      name: 'OUTPOST_NTFY_URL',
      value: targets['ntfyUrl'] ?? 'Not set',
    },
    {
      group: 'Notifications',
      name: 'OUTPOST_NTFY_TOKEN',
      value: (targets['ntfyToken'] !== undefined) ? 'Set' : 'Not set',
    },
    {
      group: 'Notifications',
      name: 'OUTPOST_WEBHOOK_URL',
      value: (targets['webhookUrl'] !== undefined) ? 'Set' : 'Not set',
    },
    {
      group: 'Access',
      name: 'OUTPOST_API_TOKEN',
      value: (config['apiToken'] !== undefined) ? 'Set' : 'Not set',
    },
    {
      group: 'Access',
      name: 'OUTPOST_ADMIN_USERNAME',
      value: config['adminUsername'],
    },
    {
      group: 'Access',
      name: 'OUTPOST_TRUST_PROXY',
      value: String(config['trustProxy']),
    },
    {
      group: 'Access',
      name: 'Data directory',
      value: config['dataDirectory'],
    },
  ];
}

/**
 * Admin - Read Session ID.
 *
 * Extracts the session cookie value from a Cookie header without a
 * cookie-parsing dependency.
 *
 * @param {Admin_ReadSessionId_Cookie} cookie - Cookie.
 *
 * @returns {Admin_ReadSessionId_Returns}
 *
 * @since 0.0.1
 */
export function readSessionId(cookie: Admin_ReadSessionId_Cookie): Admin_ReadSessionId_Returns {
  for (const part of (cookie ?? '').split(';')) {
    const separatorIndex: Admin_ReadSessionId_SeparatorIndex = part.indexOf('=');
    const name: Admin_ReadSessionId_Name = part.slice(0, separatorIndex).trim();
    const value: Admin_ReadSessionId_Value = part.slice(separatorIndex + 1).trim();

    if (
      separatorIndex > 0
      && name === cookieName
      && value !== ''
    ) {
      return value;
    }
  }

  return undefined;
}

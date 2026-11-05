import express from 'express';
import rateLimit from 'express-rate-limit';

import { Runner as Access } from './lib/access.js';
import { Runner as Attempts } from './lib/attempts.js';
import { getClientLimitKey, isTrustedProxyAddress, sendError } from './lib/http.js';
import { Runner as Notifier } from './lib/notifier.js';
import { Runner as Auth } from './routes/auth.js';
import { Runner as Dashboard } from './routes/dashboard.js';
import { Runner as Notifications } from './routes/notifications.js';
import { Runner as Registries } from './routes/registries.js';
import { Runner as Security } from './routes/security.js';
import { Runner as Tokens } from './routes/tokens.js';
import { Runner as Watchtower } from './routes/watchtower.js';
import { Runner as Web } from './routes/web.js';

import type {
  App_CreateApp_Access,
  App_CreateApp_ApiLimiter,
  App_CreateApp_App,
  App_CreateApp_Attempts,
  App_CreateApp_Dependencies,
  App_CreateApp_Notifier,
  App_CreateApp_Returns,
  App_HandleError_Error,
  App_HandleError_ErrorMessage,
  App_HandleError_Next,
  App_HandleError_Request,
  App_HandleError_Response,
  App_HandleError_Returns,
  App_HandleError_Status,
  App_HandleError_Type,
  App_HandleNotFound_Request,
  App_HandleNotFound_Response,
  App_HandleNotFound_Returns,
  App_SetBaseHeaders_Next,
  App_SetBaseHeaders_Request,
  App_SetBaseHeaders_Response,
  App_SetBaseHeaders_Returns,
} from './types/app.d.ts';

/**
 * App - Create App.
 *
 * Builds the HTTP server: the dashboard at /admin, its /api/v1 API, a public health
 * check, and the Watchtower-style update, status, and metrics endpoints.
 *
 * @param {App_CreateApp_Dependencies} dependencies - Dependencies.
 *
 * @returns {App_CreateApp_Returns}
 *
 * @since 0.0.1
 */
export function createApp(dependencies: App_CreateApp_Dependencies): App_CreateApp_Returns {
  const app: App_CreateApp_App = express();
  const access: App_CreateApp_Access = new Access(dependencies['state']);
  const notifier: App_CreateApp_Notifier = dependencies['notifier'] ?? new Notifier(dependencies['state']);
  const attempts: App_CreateApp_Attempts = new Attempts(dependencies['now'], (key) => notifier.notifySignInLimit(key));
  const apiLimiter: App_CreateApp_ApiLimiter = rateLimit({
    handler: (_request, response) => {
      sendError(response, 429, 'rate_limited', 'Too many requests. Wait a minute and try again.');

      return;
    },
    keyGenerator: (request) => getClientLimitKey(request),
    legacyHeaders: false,
    limit: 120,
    standardHeaders: true,
    windowMs: 60 * 1000,
  });

  app.disable('x-powered-by');

  // Forwarded headers count only from loopback and private senders, such as a proxy on the LAN.
  app.set('trust proxy', isTrustedProxyAddress);

  app.use(setBaseHeaders);

  app.use(express.json({
    limit: '64kb',
  }));

  app.use([
    '/api/v1',
    '/metrics',
    '/v1',
  ], apiLimiter);

  new Web(dependencies['webRoot']).register(app);

  app.get('/health', (_request, response) => {
    response.json({ status: 'ok' });

    return;
  });

  new Auth(dependencies['state'], access, attempts).register(app);

  new Security(dependencies['state'], access, attempts).register(app);

  new Tokens(dependencies['state'], access).register(app);

  new Notifications(dependencies['state'], access, notifier).register(app);

  new Registries(dependencies['state'], access).register(app);

  new Dashboard({
    access,
    config: dependencies['config'],
    ...((dependencies['eventHeartbeatMilliseconds'] === undefined) ? {} : { eventHeartbeatMilliseconds: dependencies['eventHeartbeatMilliseconds'] }),
    history: dependencies['history'],
    inspectContainer: dependencies['inspectContainer'],
    listContainers: dependencies['listContainers'],
    ...((dependencies['onRuntimeSettingsChanged'] === undefined) ? {} : { onRuntimeSettingsChanged: dependencies['onRuntimeSettingsChanged'] }),
    scheduler: dependencies['scheduler'],
    state: dependencies['state'],
  }).register(app);

  new Watchtower(dependencies['scheduler'], access).register(app);

  app.use(handleNotFound);

  app.use(handleError);

  return app;
}

/**
 * App - Handle Error.
 *
 * Turns body-parser, static file, and unexpected failures into the shared error envelope.
 * Unexpected causes are logged and never returned to the client.
 *
 * @param {App_HandleError_Error}    error    - Error.
 * @param {App_HandleError_Request}  _request - Request.
 * @param {App_HandleError_Response} response - Response.
 * @param {App_HandleError_Next}     next     - Next.
 *
 * @returns {App_HandleError_Returns}
 *
 * @since 1.0.0
 */
function handleError(error: App_HandleError_Error, _request: App_HandleError_Request, response: App_HandleError_Response, next: App_HandleError_Next): App_HandleError_Returns {
  const type: App_HandleError_Type = (typeof error === 'object' && error !== null) ? Reflect.get(error, 'type') : undefined;
  const status: App_HandleError_Status = (typeof error === 'object' && error !== null) ? Reflect.get(error, 'status') : undefined;

  if (response.headersSent === true) {
    next(error);

    return;
  }

  if (type === 'entity.parse.failed') {
    sendError(response, 400, 'invalid_json', 'The request body is not valid JSON.');

    return;
  }

  if (type === 'entity.too.large') {
    sendError(response, 413, 'payload_too_large', 'The request body is larger than 64 KB.');

    return;
  }

  if (type === 'charset.unsupported' || type === 'encoding.unsupported') {
    sendError(response, 415, 'unsupported_encoding', 'Send the request body as UTF-8 JSON.');

    return;
  }

  // A missing dashboard asset, or a method a file can't take, has no route either.
  if (status === 404 || status === 405) {
    sendError(response, 404, 'not_found', 'No route matches this request.');

    return;
  }

  const errorMessage: App_HandleError_ErrorMessage = (error instanceof Error) ? error['message'] : String(error);

  process.stderr.write(`Request failed: ${errorMessage}\n`);

  sendError(response, 500, 'internal_error', 'Something went wrong. Try again.');

  return;
}

/**
 * App - Handle Not Found.
 *
 * Answers every unmatched path with the shared error envelope.
 * Unknown paths never fall through to a default HTML page.
 *
 * @param {App_HandleNotFound_Request}  _request - Request.
 * @param {App_HandleNotFound_Response} response - Response.
 *
 * @returns {App_HandleNotFound_Returns}
 *
 * @since 1.0.0
 */
function handleNotFound(_request: App_HandleNotFound_Request, response: App_HandleNotFound_Response): App_HandleNotFound_Returns {
  sendError(response, 404, 'not_found', 'No route matches this request.');

  return;
}

/**
 * App - Set Base Headers.
 *
 * Marks every response as uncacheable, unsniffable, and without a referrer.
 * Dashboard assets later replace the cache header with their own long lifetime.
 *
 * @param {App_SetBaseHeaders_Request}  _request - Request.
 * @param {App_SetBaseHeaders_Response} response - Response.
 * @param {App_SetBaseHeaders_Next}     next     - Next.
 *
 * @returns {App_SetBaseHeaders_Returns}
 *
 * @since 1.0.0
 */
function setBaseHeaders(_request: App_SetBaseHeaders_Request, response: App_SetBaseHeaders_Response, next: App_SetBaseHeaders_Next): App_SetBaseHeaders_Returns {
  response.set({
    'Cache-Control': 'no-store',
    'Referrer-Policy': 'no-referrer',
    'X-Content-Type-Options': 'nosniff',
  });

  next();

  return;
}

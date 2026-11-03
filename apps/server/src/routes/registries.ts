import {
  sendError,
  sendValidationError,
} from '../lib/http.js';
import {
  registryCreate,
  registryUpdate,
} from '../lib/schema.js';
import { registryIdPattern } from '../regex.js';

import type {
  Routes_Registries_Runner_Access,
  Routes_Registries_Runner_Constructor_Access,
  Routes_Registries_Runner_Constructor_State,
  Routes_Registries_Runner_GetRegistryId_RegistryId,
  Routes_Registries_Runner_GetRegistryId_Request,
  Routes_Registries_Runner_GetRegistryId_Returns,
  Routes_Registries_Runner_Register_App,
  Routes_Registries_Runner_Register_Returns,
  Routes_Registries_Runner_RouteCreate_CreatedRegistry,
  Routes_Registries_Runner_RouteCreate_Request,
  Routes_Registries_Runner_RouteCreate_RequestBody,
  Routes_Registries_Runner_RouteCreate_Response,
  Routes_Registries_Runner_RouteCreate_Returns,
  Routes_Registries_Runner_RouteDelete_RegistryId,
  Routes_Registries_Runner_RouteDelete_Request,
  Routes_Registries_Runner_RouteDelete_Response,
  Routes_Registries_Runner_RouteDelete_Result,
  Routes_Registries_Runner_RouteDelete_Returns,
  Routes_Registries_Runner_RouteList_Request,
  Routes_Registries_Runner_RouteList_Response,
  Routes_Registries_Runner_RouteList_Returns,
  Routes_Registries_Runner_RouteUpdate_RegistryId,
  Routes_Registries_Runner_RouteUpdate_Request,
  Routes_Registries_Runner_RouteUpdate_RequestBody,
  Routes_Registries_Runner_RouteUpdate_Response,
  Routes_Registries_Runner_RouteUpdate_Result,
  Routes_Registries_Runner_RouteUpdate_Returns,
  Routes_Registries_Runner_SendNotFound_Response,
  Routes_Registries_Runner_SendNotFound_Returns,
  Routes_Registries_Runner_SendRegistryTaken_Response,
  Routes_Registries_Runner_SendRegistryTaken_Returns,
  Routes_Registries_Runner_State,
} from '../types/routes/registries.d.ts';

/**
 * Routes - Registries.
 *
 * Lists, adds, edits, and removes the private registry sign-ins checks and pulls use.
 * Only a signed-in browser session can manage them, and passwords are never returned.
 *
 * @since 1.0.0
 */
export class Runner {
  /**
   * Routes - Registries - Access.
   *
   * Restricts every registry route to a signed-in browser session.
   * Changes also need the session's CSRF header, and access tokens are refused.
   *
   * @private
   *
   * @since 1.0.0
   */
  readonly #access: Routes_Registries_Runner_Access;

  /**
   * Routes - Registries - State.
   *
   * Stores each sign-in with its password sealed by the encryption key.
   * Passwords never leave the state layer except for a check.
   *
   * @private
   *
   * @since 1.0.0
   */
  readonly #state: Routes_Registries_Runner_State;

  /**
   * Routes - Registries - Constructor.
   *
   * Binds the registry routes to shared state and access checks.
   * No route is registered until register is called.
   *
   * @param {Routes_Registries_Runner_Constructor_State}  state  - State.
   * @param {Routes_Registries_Runner_Constructor_Access} access - Access.
   *
   * @since 1.0.0
   */
  public constructor(state: Routes_Registries_Runner_Constructor_State, access: Routes_Registries_Runner_Constructor_Access) {
    this.#access = access;
    this.#state = state;

    return;
  }

  /**
   * Routes - Registries - Register.
   *
   * Installs the registry routes behind the session check.
   * Lists use the shared items envelope.
   *
   * @param {Routes_Registries_Runner_Register_App} app - App.
   *
   * @returns {Routes_Registries_Runner_Register_Returns}
   *
   * @since 1.0.0
   */
  public register(app: Routes_Registries_Runner_Register_App): Routes_Registries_Runner_Register_Returns {
    app.get('/api/v1/registries', this.#access.requireSession(false), this['routeList'].bind(this));

    app.post('/api/v1/registries', this.#access.requireSession(true), this['routeCreate'].bind(this));

    app.put('/api/v1/registries/:registryId', this.#access.requireSession(true), this['routeUpdate'].bind(this));

    app.delete('/api/v1/registries/:registryId', this.#access.requireSession(true), this['routeDelete'].bind(this));

    return;
  }

  /**
   * Routes - Registries - Get Registry ID.
   *
   * Reads and validates the sign-in identifier from the route path.
   * Identifiers that could never exist return undefined.
   *
   * @param {Routes_Registries_Runner_GetRegistryId_Request} request - Request.
   *
   * @private
   *
   * @returns {Routes_Registries_Runner_GetRegistryId_Returns}
   *
   * @since 1.0.0
   */
  private getRegistryId(request: Routes_Registries_Runner_GetRegistryId_Request): Routes_Registries_Runner_GetRegistryId_Returns {
    const registryId: Routes_Registries_Runner_GetRegistryId_RegistryId = (typeof request.params['registryId'] === 'string') ? request.params['registryId'] : undefined;

    if (registryId === undefined || registryIdPattern.test(registryId) === false) {
      return undefined;
    }

    return registryId;
  }

  /**
   * Routes - Registries - Route Create.
   *
   * Adds a sign-in after checking its host, username, and password.
   * A host that already has a sign-in fails without changing anything.
   *
   * @param {Routes_Registries_Runner_RouteCreate_Request}  request  - Request.
   * @param {Routes_Registries_Runner_RouteCreate_Response} response - Response.
   *
   * @private
   *
   * @returns {Routes_Registries_Runner_RouteCreate_Returns}
   *
   * @since 1.0.0
   */
  private routeCreate(request: Routes_Registries_Runner_RouteCreate_Request, response: Routes_Registries_Runner_RouteCreate_Response): Routes_Registries_Runner_RouteCreate_Returns {
    const requestBody: Routes_Registries_Runner_RouteCreate_RequestBody = registryCreate.safeParse(request.body ?? {});

    if (requestBody['success'] === false) {
      sendValidationError(response, 422, requestBody['error'], 'Check the highlighted fields.');

      return;
    }

    const createdRegistry: Routes_Registries_Runner_RouteCreate_CreatedRegistry = this.#state.createRegistry(requestBody['data']);

    if (createdRegistry === undefined) {
      this.sendRegistryTaken(response);

      return;
    }

    response.status(201).json(createdRegistry);

    return;
  }

  /**
   * Routes - Registries - Route Delete.
   *
   * Removes one sign-in so later checks reach that registry without it.
   * Other sign-ins are unaffected.
   *
   * @param {Routes_Registries_Runner_RouteDelete_Request}  request  - Request.
   * @param {Routes_Registries_Runner_RouteDelete_Response} response - Response.
   *
   * @private
   *
   * @returns {Routes_Registries_Runner_RouteDelete_Returns}
   *
   * @since 1.0.0
   */
  private routeDelete(request: Routes_Registries_Runner_RouteDelete_Request, response: Routes_Registries_Runner_RouteDelete_Response): Routes_Registries_Runner_RouteDelete_Returns {
    const registryId: Routes_Registries_Runner_RouteDelete_RegistryId = this.getRegistryId(request);

    if (registryId === undefined) {
      this.sendNotFound(response);

      return;
    }

    const result: Routes_Registries_Runner_RouteDelete_Result = this.#state.removeRegistry(registryId);

    if (result === 'not-found') {
      this.sendNotFound(response);

      return;
    }

    response.sendStatus(204);

    return;
  }

  /**
   * Routes - Registries - Route List.
   *
   * Lists every sign-in by registry host, with its username but no password.
   * A password a lost key removed is flagged so the dashboard asks for it again.
   *
   * @param {Routes_Registries_Runner_RouteList_Request}  _request - Request.
   * @param {Routes_Registries_Runner_RouteList_Response} response - Response.
   *
   * @private
   *
   * @returns {Routes_Registries_Runner_RouteList_Returns}
   *
   * @since 1.0.0
   */
  private routeList(_request: Routes_Registries_Runner_RouteList_Request, response: Routes_Registries_Runner_RouteList_Response): Routes_Registries_Runner_RouteList_Returns {
    response.json({
      items: this.#state.getRegistries(),
    });

    return;
  }

  /**
   * Routes - Registries - Route Update.
   *
   * Changes a sign-in's host and username, and its password only when a new one is sent.
   * A host another sign-in uses fails without changing anything.
   *
   * @param {Routes_Registries_Runner_RouteUpdate_Request}  request  - Request.
   * @param {Routes_Registries_Runner_RouteUpdate_Response} response - Response.
   *
   * @private
   *
   * @returns {Routes_Registries_Runner_RouteUpdate_Returns}
   *
   * @since 1.0.0
   */
  private routeUpdate(request: Routes_Registries_Runner_RouteUpdate_Request, response: Routes_Registries_Runner_RouteUpdate_Response): Routes_Registries_Runner_RouteUpdate_Returns {
    const registryId: Routes_Registries_Runner_RouteUpdate_RegistryId = this.getRegistryId(request);

    if (registryId === undefined) {
      this.sendNotFound(response);

      return;
    }

    const requestBody: Routes_Registries_Runner_RouteUpdate_RequestBody = registryUpdate.safeParse(request.body ?? {});

    if (requestBody['success'] === false) {
      sendValidationError(response, 422, requestBody['error'], 'Check the highlighted fields.');

      return;
    }

    const result: Routes_Registries_Runner_RouteUpdate_Result = this.#state.updateRegistry(registryId, requestBody['data']);

    if (result === 'not-found') {
      this.sendNotFound(response);

      return;
    }

    if (result === 'registry-taken') {
      this.sendRegistryTaken(response);

      return;
    }

    response.json(result);

    return;
  }

  /**
   * Routes - Registries - Send Not Found.
   *
   * Answers a sign-in that doesn't exist or was removed.
   * The same answer covers identifiers that could never exist.
   *
   * @param {Routes_Registries_Runner_SendNotFound_Response} response - Response.
   *
   * @private
   *
   * @returns {Routes_Registries_Runner_SendNotFound_Returns}
   *
   * @since 1.0.0
   */
  private sendNotFound(response: Routes_Registries_Runner_SendNotFound_Response): Routes_Registries_Runner_SendNotFound_Returns {
    sendError(response, 404, 'registry_not_found', 'That registry sign-in no longer exists.');

    return;
  }

  /**
   * Routes - Registries - Send Registry Taken.
   *
   * Answers a registry host that already has a sign-in.
   * The issue points at the registry field.
   *
   * @param {Routes_Registries_Runner_SendRegistryTaken_Response} response - Response.
   *
   * @private
   *
   * @returns {Routes_Registries_Runner_SendRegistryTaken_Returns}
   *
   * @since 1.0.0
   */
  private sendRegistryTaken(response: Routes_Registries_Runner_SendRegistryTaken_Response): Routes_Registries_Runner_SendRegistryTaken_Returns {
    sendError(response, 409, 'registry_exists', 'A sign-in for this registry already exists.', [{
      field: 'registry',
      message: 'A sign-in for this registry already exists.',
      path: ['registry'],
    }]);

    return;
  }
}

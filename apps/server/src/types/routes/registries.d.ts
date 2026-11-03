import type {
  Express,
  Request,
  Response,
} from 'express';
import type { z } from 'zod';

import type { Runner as Access } from '../../lib/access.js';
import type { registryCreate, registryUpdate } from '../../lib/schema.js';
import type { Runner as State } from '../../lib/state.js';
import type {
  Lib_State_Runner_CreateRegistry_Returns,
  Lib_State_Runner_RemoveRegistry_Returns,
  Lib_State_Runner_UpdateRegistry_Returns,
} from '../lib/state.d.ts';

/**
 * Routes - Registries - Runner - Access.
 *
 * @since 1.0.0
 */
export type Routes_Registries_Runner_Access = Access;

/**
 * Routes - Registries - Runner - Constructor.
 *
 * @since 1.0.0
 */
export type Routes_Registries_Runner_Constructor_State = State;

export type Routes_Registries_Runner_Constructor_Access = Access;

/**
 * Routes - Registries - Runner - Get Registry ID.
 *
 * @since 1.0.0
 */
export type Routes_Registries_Runner_GetRegistryId_Request = Request;

export type Routes_Registries_Runner_GetRegistryId_Returns = string | undefined;

export type Routes_Registries_Runner_GetRegistryId_RegistryId = string | undefined;

/**
 * Routes - Registries - Runner - Register.
 *
 * @since 1.0.0
 */
export type Routes_Registries_Runner_Register_App = Express;

export type Routes_Registries_Runner_Register_Returns = void;

/**
 * Routes - Registries - Runner - Route Create.
 *
 * @since 1.0.0
 */
export type Routes_Registries_Runner_RouteCreate_Request = Request;

export type Routes_Registries_Runner_RouteCreate_Response = Response;

export type Routes_Registries_Runner_RouteCreate_Returns = void;

export type Routes_Registries_Runner_RouteCreate_RequestBody = z.ZodSafeParseResult<z.infer<typeof registryCreate>>;

export type Routes_Registries_Runner_RouteCreate_CreatedRegistry = Lib_State_Runner_CreateRegistry_Returns;

/**
 * Routes - Registries - Runner - Route Delete.
 *
 * @since 1.0.0
 */
export type Routes_Registries_Runner_RouteDelete_Request = Request;

export type Routes_Registries_Runner_RouteDelete_Response = Response;

export type Routes_Registries_Runner_RouteDelete_Returns = void;

export type Routes_Registries_Runner_RouteDelete_RegistryId = string | undefined;

export type Routes_Registries_Runner_RouteDelete_Result = Lib_State_Runner_RemoveRegistry_Returns;

/**
 * Routes - Registries - Runner - Route List.
 *
 * @since 1.0.0
 */
export type Routes_Registries_Runner_RouteList_Request = Request;

export type Routes_Registries_Runner_RouteList_Response = Response;

export type Routes_Registries_Runner_RouteList_Returns = void;

/**
 * Routes - Registries - Runner - Route Update.
 *
 * @since 1.0.0
 */
export type Routes_Registries_Runner_RouteUpdate_Request = Request;

export type Routes_Registries_Runner_RouteUpdate_Response = Response;

export type Routes_Registries_Runner_RouteUpdate_Returns = void;

export type Routes_Registries_Runner_RouteUpdate_RegistryId = string | undefined;

export type Routes_Registries_Runner_RouteUpdate_RequestBody = z.ZodSafeParseResult<z.infer<typeof registryUpdate>>;

export type Routes_Registries_Runner_RouteUpdate_Result = Lib_State_Runner_UpdateRegistry_Returns;

/**
 * Routes - Registries - Runner - Send Not Found.
 *
 * @since 1.0.0
 */
export type Routes_Registries_Runner_SendNotFound_Response = Response;

export type Routes_Registries_Runner_SendNotFound_Returns = void;

/**
 * Routes - Registries - Runner - Send Registry Taken.
 *
 * @since 1.0.0
 */
export type Routes_Registries_Runner_SendRegistryTaken_Response = Response;

export type Routes_Registries_Runner_SendRegistryTaken_Returns = void;

/**
 * Routes - Registries - Runner - State.
 *
 * @since 1.0.0
 */
export type Routes_Registries_Runner_State = State;

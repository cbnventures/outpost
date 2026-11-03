import type { Server } from 'node:http';

import type { Runner } from '../engine.js';
import type {
  Shared_ContainerInspect,
  Shared_ContainerSummary,
  Shared_ImageInspect,
} from './shared.d.ts';

/**
 * Engine - Engine.
 *
 * @since 0.0.1
 */
export type Engine_Engine_SocketPath = string;

export type Engine_Engine_Server = Server;

export type Engine_Engine_Engine = Runner;

/**
 * Engine - Engine - Lists Stopped Containers By Label.
 *
 * @since 1.0.0
 */
export type Engine_Engine_ListsStoppedContainersByLabel_Containers = Shared_ContainerSummary[];

/**
 * Engine - Engine - Reads The Exit Code Of A Stopped Container.
 *
 * @since 1.0.0
 */
export type Engine_Engine_ReadsTheExitCodeOfAStoppedContainer_Inspected = Shared_ContainerInspect;

/**
 * Engine - Engine - Reports Daemon Error Messages.
 *
 * @since 0.0.1
 */
export type Engine_Engine_ReportsDaemonErrorMessages_Request = Promise<unknown>;

/**
 * Engine - Engine - Treats Missing Images As Undefined.
 *
 * @since 0.0.1
 */
export type Engine_Engine_TreatsMissingImagesAsUndefined_Image = Shared_ImageInspect | undefined;

/**
 * Engine - Engine - Validates Container List Responses.
 *
 * @since 0.0.1
 */
export type Engine_Engine_ValidatesContainerListResponses_Containers = Shared_ContainerSummary[];

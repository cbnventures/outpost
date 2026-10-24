import type { Server } from 'node:http';

import type { Runner } from '../engine.js';
import type { Shared_ContainerSummary, Shared_ImageInspect } from './shared.d.ts';

/**
 * Engine - Engine.
 *
 * @since 0.0.1
 */
export type Engine_Engine_SocketPath = string;

export type Engine_Engine_Server = Server;

export type Engine_Engine_Engine = Runner;

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

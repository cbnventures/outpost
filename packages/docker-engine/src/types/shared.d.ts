import type { z } from 'zod';

import type {
  containerConfigSchema,
  containerInspectSchema,
  containerSummarySchema,
  imageInspectSchema,
} from '../schema.js';

/**
 * Shared - Container Config.
 *
 * @since 0.0.1
 */
export type Shared_ContainerConfig = z.infer<typeof containerConfigSchema>;

/**
 * Shared - Container Inspect.
 *
 * @since 0.0.1
 */
export type Shared_ContainerInspect = z.infer<typeof containerInspectSchema>;

/**
 * Shared - Container Summary.
 *
 * @since 0.0.1
 */
export type Shared_ContainerSummary = z.infer<typeof containerSummarySchema>;

/**
 * Shared - Image Inspect.
 *
 * @since 0.0.1
 */
export type Shared_ImageInspect = z.infer<typeof imageInspectSchema>;

/**
 * Shared - Endpoint.
 *
 * @since 0.0.1
 */
export type Shared_Endpoint_SocketPath = string | undefined;

export type Shared_Endpoint_Host = string | undefined;

export type Shared_Endpoint_Port = number | undefined;

export type Shared_Endpoint = {
  socketPath: Shared_Endpoint_SocketPath;
  host: Shared_Endpoint_Host;
  port: Shared_Endpoint_Port;
};

/**
 * Shared - Engine Response.
 *
 * @since 0.0.1
 */
export type Shared_EngineResponse_StatusCode = number;

export type Shared_EngineResponse_Body = string;

export type Shared_EngineResponse = {
  statusCode: Shared_EngineResponse_StatusCode;
  body: Shared_EngineResponse_Body;
};

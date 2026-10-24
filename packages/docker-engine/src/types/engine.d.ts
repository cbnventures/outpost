import type { ClientRequest } from 'node:http';

import type { z } from 'zod';

import type { errorResponseSchema, pullProgressSchema } from '../schema.js';
import type {
  Shared_ContainerInspect,
  Shared_ContainerSummary,
  Shared_Endpoint,
  Shared_EngineResponse,
  Shared_ImageInspect,
} from './shared.d.ts';

/**
 * Engine.
 *
 * @since 0.0.1
 */
export type Engine_Runner_Endpoint = Shared_Endpoint;

/**
 * Engine - Connect Network.
 *
 * @since 0.0.1
 */
export type Engine_Runner_ConnectNetwork_Network = string;

export type Engine_Runner_ConnectNetwork_ContainerId = string;

export type Engine_Runner_ConnectNetwork_EndpointConfig = Record<string, unknown>;

export type Engine_Runner_ConnectNetwork_Returns = Promise<void>;

export type Engine_Runner_ConnectNetwork_Response = Shared_EngineResponse;

/**
 * Engine - Constructor.
 *
 * @since 0.0.1
 */
export type Engine_Runner_Constructor_DockerHost = string;

/**
 * Engine - Create Container.
 *
 * @since 0.0.1
 */
export type Engine_Runner_CreateContainer_Name = string;

export type Engine_Runner_CreateContainer_Body = Record<string, unknown>;

export type Engine_Runner_CreateContainer_Returns = Promise<string>;

export type Engine_Runner_CreateContainer_Response = Shared_EngineResponse;

/**
 * Engine - Expect.
 *
 * @since 0.0.1
 */
export type Engine_Runner_Expect_Response = Shared_EngineResponse;

export type Engine_Runner_Expect_AllowedStatusCode = number;

export type Engine_Runner_Expect_AllowedStatusCodes = Engine_Runner_Expect_AllowedStatusCode[];

export type Engine_Runner_Expect_Returns = unknown;

export type Engine_Runner_Expect_Parsed = unknown;

export type Engine_Runner_Expect_ErrorResponse = z.ZodSafeParseResult<z.infer<typeof errorResponseSchema>>;

export type Engine_Runner_Expect_Message = string;

/**
 * Engine - Inspect Container.
 *
 * @since 0.0.1
 */
export type Engine_Runner_InspectContainer_Id = string;

export type Engine_Runner_InspectContainer_Returns = Promise<Shared_ContainerInspect>;

export type Engine_Runner_InspectContainer_Response = Shared_EngineResponse;

/**
 * Engine - Inspect Image.
 *
 * @since 0.0.1
 */
export type Engine_Runner_InspectImage_Reference = string;

export type Engine_Runner_InspectImage_Returns = Promise<Shared_ImageInspect | undefined>;

export type Engine_Runner_InspectImage_Response = Shared_EngineResponse;

/**
 * Engine - List Containers.
 *
 * @since 0.0.1
 */
export type Engine_Runner_ListContainers_Returns = Promise<Shared_ContainerSummary[]>;

export type Engine_Runner_ListContainers_Response = Shared_EngineResponse;

/**
 * Engine - Parse Docker Host.
 *
 * @since 0.0.1
 */
export type Engine_Runner_ParseDockerHost_DockerHost = string;

export type Engine_Runner_ParseDockerHost_Returns = Shared_Endpoint;

export type Engine_Runner_ParseDockerHost_Url = URL;

/**
 * Engine - Ping.
 *
 * @since 0.0.1
 */
export type Engine_Runner_Ping_Returns = Promise<void>;

export type Engine_Runner_Ping_Response = Shared_EngineResponse;

/**
 * Engine - Pull Image.
 *
 * @since 0.0.1
 */
export type Engine_Runner_PullImage_Reference = string;

export type Engine_Runner_PullImage_RegistryAuth = string | undefined;

export type Engine_Runner_PullImage_Returns = Promise<void>;

export type Engine_Runner_PullImage_Response = Shared_EngineResponse;

export type Engine_Runner_PullImage_Line = string;

export type Engine_Runner_PullImage_Progress = z.ZodSafeParseResult<z.infer<typeof pullProgressSchema>>;

/**
 * Engine - Remove Container.
 *
 * @since 0.0.1
 */
export type Engine_Runner_RemoveContainer_Id = string;

export type Engine_Runner_RemoveContainer_Returns = Promise<void>;

export type Engine_Runner_RemoveContainer_Response = Shared_EngineResponse;

/**
 * Engine - Remove Image.
 *
 * @since 0.0.1
 */
export type Engine_Runner_RemoveImage_Id = string;

export type Engine_Runner_RemoveImage_Returns = Promise<boolean>;

export type Engine_Runner_RemoveImage_Response = Shared_EngineResponse;

/**
 * Engine - Rename Container.
 *
 * @since 0.0.1
 */
export type Engine_Runner_RenameContainer_Id = string;

export type Engine_Runner_RenameContainer_Name = string;

export type Engine_Runner_RenameContainer_Returns = Promise<void>;

export type Engine_Runner_RenameContainer_Response = Shared_EngineResponse;

/**
 * Engine - Send.
 *
 * @since 0.0.1
 */
export type Engine_Runner_Send_Method = 'GET' | 'POST' | 'DELETE';

export type Engine_Runner_Send_Path = string;

export type Engine_Runner_Send_Body = Record<string, unknown> | undefined;

export type Engine_Runner_Send_Headers = Record<string, string>;

export type Engine_Runner_Send_Returns = Promise<Shared_EngineResponse>;

export type Engine_Runner_Send_Payload = string | undefined;

export type Engine_Runner_Send_ClientRequest = ClientRequest;

export type Engine_Runner_Send_Chunks = Buffer[];

/**
 * Engine - Start Container.
 *
 * @since 0.0.1
 */
export type Engine_Runner_StartContainer_Id = string;

export type Engine_Runner_StartContainer_Returns = Promise<void>;

export type Engine_Runner_StartContainer_Response = Shared_EngineResponse;

/**
 * Engine - Stop Container.
 *
 * @since 0.0.1
 */
export type Engine_Runner_StopContainer_Id = string;

export type Engine_Runner_StopContainer_TimeoutSeconds = number;

export type Engine_Runner_StopContainer_Returns = Promise<void>;

export type Engine_Runner_StopContainer_Response = Shared_EngineResponse;

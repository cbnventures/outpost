import { request } from 'node:http';

import {
  containerInspectSchema,
  containerSummariesSchema,
  createContainerResponseSchema,
  errorResponseSchema,
  imageInspectSchema,
  pullProgressSchema,
} from './schema.js';

import type {
  Engine_Runner_ConnectNetwork_ContainerId,
  Engine_Runner_ConnectNetwork_EndpointConfig,
  Engine_Runner_ConnectNetwork_Network,
  Engine_Runner_ConnectNetwork_Response,
  Engine_Runner_ConnectNetwork_Returns,
  Engine_Runner_Constructor_DockerHost,
  Engine_Runner_CreateContainer_Body,
  Engine_Runner_CreateContainer_Name,
  Engine_Runner_CreateContainer_Response,
  Engine_Runner_CreateContainer_Returns,
  Engine_Runner_Endpoint,
  Engine_Runner_Expect_AllowedStatusCodes,
  Engine_Runner_Expect_ErrorResponse,
  Engine_Runner_Expect_Message,
  Engine_Runner_Expect_Parsed,
  Engine_Runner_Expect_Response,
  Engine_Runner_Expect_Returns,
  Engine_Runner_InspectContainer_Id,
  Engine_Runner_InspectContainer_Response,
  Engine_Runner_InspectContainer_Returns,
  Engine_Runner_InspectImage_Reference,
  Engine_Runner_InspectImage_Response,
  Engine_Runner_InspectImage_Returns,
  Engine_Runner_ListContainers_Response,
  Engine_Runner_ListContainers_Returns,
  Engine_Runner_ParseDockerHost_DockerHost,
  Engine_Runner_ParseDockerHost_Returns,
  Engine_Runner_ParseDockerHost_Url,
  Engine_Runner_Ping_Response,
  Engine_Runner_Ping_Returns,
  Engine_Runner_PullImage_Line,
  Engine_Runner_PullImage_Progress,
  Engine_Runner_PullImage_Reference,
  Engine_Runner_PullImage_RegistryAuth,
  Engine_Runner_PullImage_Response,
  Engine_Runner_PullImage_Returns,
  Engine_Runner_RemoveContainer_Id,
  Engine_Runner_RemoveContainer_Response,
  Engine_Runner_RemoveContainer_Returns,
  Engine_Runner_RemoveImage_Id,
  Engine_Runner_RemoveImage_Response,
  Engine_Runner_RemoveImage_Returns,
  Engine_Runner_RenameContainer_Id,
  Engine_Runner_RenameContainer_Name,
  Engine_Runner_RenameContainer_Response,
  Engine_Runner_RenameContainer_Returns,
  Engine_Runner_Send_Body,
  Engine_Runner_Send_Chunks,
  Engine_Runner_Send_ClientRequest,
  Engine_Runner_Send_Headers,
  Engine_Runner_Send_Method,
  Engine_Runner_Send_Path,
  Engine_Runner_Send_Payload,
  Engine_Runner_Send_Returns,
  Engine_Runner_StartContainer_Id,
  Engine_Runner_StartContainer_Response,
  Engine_Runner_StartContainer_Returns,
  Engine_Runner_StopContainer_Id,
  Engine_Runner_StopContainer_Response,
  Engine_Runner_StopContainer_Returns,
  Engine_Runner_StopContainer_TimeoutSeconds,
} from './types/engine.d.ts';

/**
 * Engine.
 *
 * Minimal Docker Engine API client. Talks HTTP over the local unix socket
 * (or a plain TCP DOCKER_HOST) and validates every JSON response.
 *
 * @since 0.0.1
 */
export class Runner {
  /**
   * Engine - Endpoint.
   *
   * Connection target derived from DOCKER_HOST: either a unix socket
   * path or a TCP host and port.
   *
   * @private
   *
   * @since 0.0.1
   */
  readonly #endpoint: Engine_Runner_Endpoint;

  /**
   * Engine - Constructor.
   *
   * Parses the DOCKER_HOST value once so every request reuses the
   * same connection target.
   *
   * @param {Engine_Runner_Constructor_DockerHost} dockerHost - Docker host.
   *
   * @since 0.0.1
   */
  public constructor(dockerHost: Engine_Runner_Constructor_DockerHost) {
    this.#endpoint = Runner.parseDockerHost(dockerHost);

    return;
  }

  /**
   * Engine - Ping.
   *
   * Confirms the daemon is reachable and the socket is usable,
   * so startup can fail fast with a clear error.
   *
   * @returns {Engine_Runner_Ping_Returns}
   *
   * @since 0.0.1
   */
  public async ping(): Engine_Runner_Ping_Returns {
    const response: Engine_Runner_Ping_Response = await this.send('GET', '/_ping', undefined, {});

    Runner.expect(response, [200]);

    return;
  }

  /**
   * Engine - List Containers.
   *
   * Lists running containers. Stopped containers are never updated,
   * so they are not requested.
   *
   * @returns {Engine_Runner_ListContainers_Returns}
   *
   * @since 0.0.1
   */
  public async listContainers(): Engine_Runner_ListContainers_Returns {
    const response: Engine_Runner_ListContainers_Response = await this.send('GET', '/containers/json', undefined, {});

    return containerSummariesSchema.parse(Runner.expect(response, [200]));
  }

  /**
   * Engine - Inspect Container.
   *
   * Returns the full configuration and state of one container,
   * which recreation copies from.
   *
   * @param {Engine_Runner_InspectContainer_Id} id - Id.
   *
   * @returns {Engine_Runner_InspectContainer_Returns}
   *
   * @since 0.0.1
   */
  public async inspectContainer(id: Engine_Runner_InspectContainer_Id): Engine_Runner_InspectContainer_Returns {
    const response: Engine_Runner_InspectContainer_Response = await this.send('GET', `/containers/${encodeURIComponent(id)}/json`, undefined, {});

    return containerInspectSchema.parse(Runner.expect(response, [200]));
  }

  /**
   * Engine - Inspect Image.
   *
   * Returns the identity and default config of a local image, or
   * undefined when the image is not present.
   *
   * @param {Engine_Runner_InspectImage_Reference} reference - Reference.
   *
   * @returns {Engine_Runner_InspectImage_Returns}
   *
   * @since 0.0.1
   */
  public async inspectImage(reference: Engine_Runner_InspectImage_Reference): Engine_Runner_InspectImage_Returns {
    const response: Engine_Runner_InspectImage_Response = await this.send('GET', `/images/${encodeURIComponent(reference)}/json`, undefined, {});

    if (response['statusCode'] === 404) {
      return undefined;
    }

    return imageInspectSchema.parse(Runner.expect(response, [200]));
  }

  /**
   * Engine - Pull Image.
   *
   * Pulls an image and waits for the progress stream to finish. Errors
   * reported inside the stream are raised as exceptions.
   *
   * @param {Engine_Runner_PullImage_Reference}    reference    - Reference.
   * @param {Engine_Runner_PullImage_RegistryAuth} registryAuth - Registry auth.
   *
   * @returns {Engine_Runner_PullImage_Returns}
   *
   * @since 0.0.1
   */
  public async pullImage(reference: Engine_Runner_PullImage_Reference, registryAuth: Engine_Runner_PullImage_RegistryAuth): Engine_Runner_PullImage_Returns {
    const response: Engine_Runner_PullImage_Response = await this.send('POST', `/images/create?fromImage=${encodeURIComponent(reference)}`, undefined, (registryAuth !== undefined) ? { 'X-Registry-Auth': registryAuth } : {});

    Runner.expect(response, [200]);

    for (const line of response['body'].split('\n')) {
      const trimmedLine: Engine_Runner_PullImage_Line = line.trim();

      if (trimmedLine === '') {
        continue;
      }

      const progress: Engine_Runner_PullImage_Progress = pullProgressSchema.safeParse(JSON.parse(trimmedLine));

      if (progress['success'] === true && progress['data']['error'] !== undefined) {
        throw new Error(`Pulling "${reference}" failed: ${progress['data']['error']}`);
      }
    }

    return;
  }

  /**
   * Engine - Stop Container.
   *
   * Stops a container, giving it the timeout to shut down gracefully.
   * Stopping an already stopped container is not an error.
   *
   * @param {Engine_Runner_StopContainer_Id}             id             - Id.
   * @param {Engine_Runner_StopContainer_TimeoutSeconds} timeoutSeconds - Timeout seconds.
   *
   * @returns {Engine_Runner_StopContainer_Returns}
   *
   * @since 0.0.1
   */
  public async stopContainer(id: Engine_Runner_StopContainer_Id, timeoutSeconds: Engine_Runner_StopContainer_TimeoutSeconds): Engine_Runner_StopContainer_Returns {
    const response: Engine_Runner_StopContainer_Response = await this.send('POST', `/containers/${encodeURIComponent(id)}/stop?t=${String(timeoutSeconds)}`, undefined, {});

    Runner.expect(response, [
      204,
      304,
    ]);

    return;
  }

  /**
   * Engine - Start Container.
   *
   * Starts a created or stopped container. Starting a running
   * container is not an error.
   *
   * @param {Engine_Runner_StartContainer_Id} id - Id.
   *
   * @returns {Engine_Runner_StartContainer_Returns}
   *
   * @since 0.0.1
   */
  public async startContainer(id: Engine_Runner_StartContainer_Id): Engine_Runner_StartContainer_Returns {
    const response: Engine_Runner_StartContainer_Response = await this.send('POST', `/containers/${encodeURIComponent(id)}/start`, undefined, {});

    Runner.expect(response, [
      204,
      304,
    ]);

    return;
  }

  /**
   * Engine - Rename Container.
   *
   * Renames a container so its original name can be reused by the
   * replacement while the old one is kept for rollback.
   *
   * @param {Engine_Runner_RenameContainer_Id}   id   - Id.
   * @param {Engine_Runner_RenameContainer_Name} name - Name.
   *
   * @returns {Engine_Runner_RenameContainer_Returns}
   *
   * @since 0.0.1
   */
  public async renameContainer(id: Engine_Runner_RenameContainer_Id, name: Engine_Runner_RenameContainer_Name): Engine_Runner_RenameContainer_Returns {
    const response: Engine_Runner_RenameContainer_Response = await this.send('POST', `/containers/${encodeURIComponent(id)}/rename?name=${encodeURIComponent(name)}`, undefined, {});

    Runner.expect(response, [204]);

    return;
  }

  /**
   * Engine - Remove Container.
   *
   * Force-removes a container. Named and anonymous volumes are kept
   * because the replacement container reuses them.
   *
   * @param {Engine_Runner_RemoveContainer_Id} id - Id.
   *
   * @returns {Engine_Runner_RemoveContainer_Returns}
   *
   * @since 0.0.1
   */
  public async removeContainer(id: Engine_Runner_RemoveContainer_Id): Engine_Runner_RemoveContainer_Returns {
    const response: Engine_Runner_RemoveContainer_Response = await this.send('DELETE', `/containers/${encodeURIComponent(id)}?force=true&v=false`, undefined, {});

    Runner.expect(response, [
      204,
      404,
    ]);

    return;
  }

  /**
   * Engine - Create Container.
   *
   * Creates a container with the given name and creation body and
   * returns its ID.
   *
   * @param {Engine_Runner_CreateContainer_Name} name - Name.
   * @param {Engine_Runner_CreateContainer_Body} body - Body.
   *
   * @returns {Engine_Runner_CreateContainer_Returns}
   *
   * @since 0.0.1
   */
  public async createContainer(name: Engine_Runner_CreateContainer_Name, body: Engine_Runner_CreateContainer_Body): Engine_Runner_CreateContainer_Returns {
    const response: Engine_Runner_CreateContainer_Response = await this.send('POST', `/containers/create?name=${encodeURIComponent(name)}`, body, {});

    return createContainerResponseSchema.parse(Runner.expect(response, [201]))['Id'];
  }

  /**
   * Engine - Connect Network.
   *
   * Attaches a container to an additional network. Containers can only
   * be created with one network, so the rest are connected afterwards.
   *
   * @param {Engine_Runner_ConnectNetwork_Network}        network        - Network.
   * @param {Engine_Runner_ConnectNetwork_ContainerId}    containerId    - Container id.
   * @param {Engine_Runner_ConnectNetwork_EndpointConfig} endpointConfig - Endpoint config.
   *
   * @returns {Engine_Runner_ConnectNetwork_Returns}
   *
   * @since 0.0.1
   */
  public async connectNetwork(network: Engine_Runner_ConnectNetwork_Network, containerId: Engine_Runner_ConnectNetwork_ContainerId, endpointConfig: Engine_Runner_ConnectNetwork_EndpointConfig): Engine_Runner_ConnectNetwork_Returns {
    const response: Engine_Runner_ConnectNetwork_Response = await this.send('POST', `/networks/${encodeURIComponent(network)}/connect`, {
      Container: containerId,
      EndpointConfig: endpointConfig,
    }, {});

    Runner.expect(response, [200]);

    return;
  }

  /**
   * Engine - Remove Image.
   *
   * Removes an image by ID. Returns false when the image is still in use
   * or already gone instead of failing.
   *
   * @param {Engine_Runner_RemoveImage_Id} id - Id.
   *
   * @returns {Engine_Runner_RemoveImage_Returns}
   *
   * @since 0.0.1
   */
  public async removeImage(id: Engine_Runner_RemoveImage_Id): Engine_Runner_RemoveImage_Returns {
    const response: Engine_Runner_RemoveImage_Response = await this.send('DELETE', `/images/${encodeURIComponent(id)}`, undefined, {});

    if (response['statusCode'] === 200) {
      return true;
    }

    Runner.expect(response, [
      404,
      409,
    ]);

    return false;
  }

  /**
   * Engine - Send.
   *
   * Sends one HTTP request to the daemon and buffers the response
   * body so callers can validate it in one place.
   *
   * @param {Engine_Runner_Send_Method}  method  - Method.
   * @param {Engine_Runner_Send_Path}    path    - Path.
   * @param {Engine_Runner_Send_Body}    body    - Body.
   * @param {Engine_Runner_Send_Headers} headers - Headers.
   *
   * @private
   *
   * @returns {Engine_Runner_Send_Returns}
   *
   * @since 0.0.1
   */
  private async send(method: Engine_Runner_Send_Method, path: Engine_Runner_Send_Path, body: Engine_Runner_Send_Body, headers: Engine_Runner_Send_Headers): Engine_Runner_Send_Returns {
    const payload: Engine_Runner_Send_Payload = (body !== undefined) ? JSON.stringify(body) : undefined;

    return new Promise((resolve, reject) => {
      const clientRequest: Engine_Runner_Send_ClientRequest = request({
        ...((this.#endpoint['socketPath'] !== undefined) ? { socketPath: this.#endpoint['socketPath'] } : {
          host: this.#endpoint['host'],
          port: this.#endpoint['port'],
        }),
        method,
        path,
        headers: {
          ...headers,
          ...((payload !== undefined) ? {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(payload),
          } : {}),
        },
      }, (incomingMessage) => {
        const chunks: Engine_Runner_Send_Chunks = [];

        incomingMessage.on('data', (chunk) => {
          chunks.push(Buffer.from(chunk));

          return;
        });

        incomingMessage.on('end', () => {
          resolve({
            statusCode: incomingMessage.statusCode ?? 0,
            body: Buffer.concat(chunks).toString('utf-8'),
          });

          return;
        });

        incomingMessage.on('error', reject);

        return;
      });

      clientRequest.on('error', reject);

      if (payload !== undefined) {
        clientRequest.write(payload);
      }

      clientRequest.end();

      return;
    });
  }

  /**
   * Engine - Expect.
   *
   * Throws with the daemon's error message unless the status code is
   * allowed, and returns the parsed JSON body (or undefined when empty).
   *
   * @param {Engine_Runner_Expect_Response}           response           - Response.
   * @param {Engine_Runner_Expect_AllowedStatusCodes} allowedStatusCodes - Allowed status codes.
   *
   * @private
   *
   * @returns {Engine_Runner_Expect_Returns}
   *
   * @since 0.0.1
   */
  private static expect(response: Engine_Runner_Expect_Response, allowedStatusCodes: Engine_Runner_Expect_AllowedStatusCodes): Engine_Runner_Expect_Returns {
    let parsed: Engine_Runner_Expect_Parsed = undefined;

    if (response['body'].trim() !== '') {
      try {
        parsed = JSON.parse(response['body']);
      } catch {
        parsed = response['body'];
      }
    }

    if (allowedStatusCodes.includes(response['statusCode']) === false) {
      const errorResponse: Engine_Runner_Expect_ErrorResponse = errorResponseSchema.safeParse(parsed);
      const message: Engine_Runner_Expect_Message = (errorResponse['success'] === true) ? errorResponse['data']['message'] : response['body'].trim();

      throw new Error(`Docker Engine API returned HTTP ${String(response['statusCode'])}: ${message}`);
    }

    return parsed;
  }

  /**
   * Engine - Parse Docker Host.
   *
   * Turns a DOCKER_HOST value ("unix:///var/run/docker.sock",
   * "tcp://127.0.0.1:2375", or a bare socket path) into an endpoint.
   *
   * @param {Engine_Runner_ParseDockerHost_DockerHost} dockerHost - Docker host.
   *
   * @private
   *
   * @returns {Engine_Runner_ParseDockerHost_Returns}
   *
   * @since 0.0.1
   */
  private static parseDockerHost(dockerHost: Engine_Runner_ParseDockerHost_DockerHost): Engine_Runner_ParseDockerHost_Returns {
    if (dockerHost.startsWith('tcp://') === true) {
      const url: Engine_Runner_ParseDockerHost_Url = new URL(dockerHost.replace('tcp://', 'http://'));

      return {
        socketPath: undefined,
        host: url.hostname,
        port: (url.port !== '') ? Number(url.port) : 2375,
      };
    }

    return {
      socketPath: dockerHost.replace('unix://', ''),
      host: undefined,
      port: undefined,
    };
  }
}

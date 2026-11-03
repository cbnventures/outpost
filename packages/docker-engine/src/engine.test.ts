import { rmSync } from 'node:fs';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import {
  afterAll,
  beforeAll,
  describe,
  expect,
  it,
} from 'vitest';

import { Runner } from './engine.js';

import type {
  Engine_Engine_Engine,
  Engine_Engine_ListsStoppedContainersByLabel_Containers,
  Engine_Engine_ReadsTheExitCodeOfAStoppedContainer_Inspected,
  Engine_Engine_ReportsDaemonErrorMessages_Request,
  Engine_Engine_Server,
  Engine_Engine_SocketPath,
  Engine_Engine_TreatsMissingImagesAsUndefined_Image,
  Engine_Engine_ValidatesContainerListResponses_Containers,
} from './types/engine.test.d.ts';

/**
 * Engine - Socket Path.
 *
 * Temporary unix socket the fake daemon listens on, unique per test
 * process so parallel runs do not collide.
 *
 * @since 0.0.1
 */
const socketPath: Engine_Engine_SocketPath = join(tmpdir(), `outpost-engine-${String(process.pid)}.sock`);

/**
 * Engine - Server.
 *
 * Fake Docker daemon that answers the handful of endpoints the tests
 * exercise and returns Engine-style errors for everything else.
 *
 * @since 0.0.1
 */
const server: Engine_Engine_Server = createServer((request, response) => {
  if (request.url === '/containers/json') {
    response.writeHead(200, { 'Content-Type': 'application/json' });

    response.end(JSON.stringify([{
      Id: 'abc',
      Names: ['/web'],
      Image: 'nginx:1',
      ImageID: 'sha256:1',
      Labels: {},
      State: 'running',
    }]));

    return;
  }

  if (request.url === '/images/create?fromImage=broken%3A1') {
    response.writeHead(200, { 'Content-Type': 'application/json' });

    response.end([
      JSON.stringify({ status: 'Pulling' }),
      JSON.stringify({ error: 'manifest unknown' }),
      '',
    ].join('\n'));

    return;
  }

  if (request.url === `/containers/json?all=true&filters=${encodeURIComponent(JSON.stringify({ label: ['io.cbnventures.outpost.self-update-helper'] }))}`) {
    response.writeHead(200, { 'Content-Type': 'application/json' });

    response.end(JSON.stringify([{
      Id: 'helper',
      Names: ['/outpost-outpost-self-update'],
      Image: 'sha256:old',
      ImageID: 'sha256:old',
      Labels: { 'io.cbnventures.outpost.self-update-helper': 'abc' },
      State: 'exited',
    }]));

    return;
  }

  if (request.url === '/containers/helper/json') {
    response.writeHead(200, { 'Content-Type': 'application/json' });

    response.end(JSON.stringify({
      Id: 'helper',
      Name: '/outpost-outpost-self-update',
      Image: 'sha256:old',
      Config: {},
      HostConfig: {},
      NetworkSettings: {},
      State: {
        Running: false,
        Status: 'exited',
        ExitCode: 1,
      },
    }));

    return;
  }

  if (request.url === '/containers/missing/json') {
    response.writeHead(404, { 'Content-Type': 'application/json' });

    response.end(JSON.stringify({ message: 'No such container: missing' }));

    return;
  }

  response.writeHead(404, { 'Content-Type': 'application/json' });

  response.end(JSON.stringify({ message: 'not found' }));

  return;
});

/**
 * Engine - Engine.
 *
 * Client under test, pointed at the fake daemon's socket with the
 * same unix:// form a real DOCKER_HOST uses.
 *
 * @since 0.0.1
 */
const engine: Engine_Engine_Engine = new Runner(`unix://${socketPath}`);

/**
 * Engine - Engine.
 *
 * Runs the client against a fake daemon listening on a temporary unix
 * socket, so no real Docker installation is needed.
 *
 * @since 0.0.1
 */
describe('engine', () => {
  beforeAll(async () => {
    rmSync(socketPath, { force: true });

    await new Promise((resolve) => {
      server.listen(socketPath, () => {
        resolve(undefined);

        return;
      });

      return;
    });

    return;
  });

  afterAll(() => {
    server.close();

    rmSync(socketPath, { force: true });

    return;
  });

  it('validates container list responses', async () => {
    const containers: Engine_Engine_ValidatesContainerListResponses_Containers = await engine.listContainers();

    expect(containers.map((container) => container['Names'])).toStrictEqual([['/web']]);

    return;
  });

  it('lists stopped containers by label', async () => {
    const containers: Engine_Engine_ListsStoppedContainersByLabel_Containers = await engine.listContainersByLabel('io.cbnventures.outpost.self-update-helper');

    expect(containers.map((container) => container['State'])).toStrictEqual(['exited']);

    return;
  });

  it('reads the exit code of a stopped container', async () => {
    const inspected: Engine_Engine_ReadsTheExitCodeOfAStoppedContainer_Inspected = await engine.inspectContainer('helper');

    expect(inspected['State']['ExitCode']).toBe(1);

    return;
  });

  it('treats missing images as undefined', async () => {
    const image: Engine_Engine_TreatsMissingImagesAsUndefined_Image = await engine.inspectImage('ghost:1');

    expect(image).toBeUndefined();

    return;
  });

  it('reports daemon error messages', async () => {
    const request: Engine_Engine_ReportsDaemonErrorMessages_Request = engine.inspectContainer('missing');

    await expect(request).rejects.toThrow('No such container: missing');

    await expect(engine.pullImage('broken:1', undefined)).rejects.toThrow('manifest unknown');

    return;
  });

  return;
});

import { once } from 'node:events';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import express from 'express';
import {
  afterAll,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { buildContainerRows, createAdminRouter, readSessionId } from './admin.js';
import { loadConfig } from './config.js';
import { Runner as Sessions } from './session.js';

import type {
  Admin_BuildContainerRows_MarksManagedAndExcludedContainers_Rows,
  Admin_Dashboard_Address,
  Admin_Dashboard_BaseUrl,
  Admin_Dashboard_PublicDirectory,
  Admin_Dashboard_Server,
  Admin_Dashboard_ServesThePageWithSecurityHeaders_Response,
  Admin_Dashboard_SignsInAndProtectsChanges_Cookie,
  Admin_Dashboard_SignsInAndProtectsChanges_Login,
  Admin_Dashboard_SignsInAndProtectsChanges_Session,
  Admin_Dashboard_Trigger,
  Admin_ReadSessionId_FindsTheSessionCookie_SessionId,
} from './types/admin.test.d.ts';

/**
 * Admin - Public Directory.
 *
 * The dashboard's real static files, so the test also catches a
 * missing or renamed index page.
 *
 * @since 0.0.1
 */
const publicDirectory: Admin_Dashboard_PublicDirectory = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'admin');

/**
 * Admin - Trigger.
 *
 * Fake scheduler trigger that records which containers a dashboard
 * check asked for.
 *
 * @since 0.0.1
 */
const trigger: Admin_Dashboard_Trigger = vi.fn(() => true);

/**
 * Admin - Server.
 *
 * Express app with only the admin router mounted, listening on a random
 * local port.
 *
 * @since 0.0.1
 */
const server: Admin_Dashboard_Server = express().use('/admin', createAdminRouter({
  sessions: new Sessions('admin', 'secret', () => Date.now()),
  scheduler: {
    trigger,
    getState: () => ({
      running: false,
      startedAt: undefined,
      nextRun: undefined,
      lastReport: undefined,
      lastError: undefined,
      totals: {
        cycles: 0,
        updated: 0,
        failed: 0,
      },
    }),
  },
  history: { list: () => [] },
  listContainers: async () => [],
  config: loadConfig({}),
  assetsDirectory: join(publicDirectory, 'assets'),
  indexPath: join(publicDirectory, 'index.html'),
})).listen(0, '127.0.0.1');

/**
 * Admin - Base URL.
 *
 * Address of the test server, filled in once it is listening on its
 * random port.
 *
 * @since 0.0.1
 */
const baseUrl: Admin_Dashboard_BaseUrl = { value: '' };

/**
 * Admin - Dashboard.
 *
 * Calls the real routes over HTTP: the page, sign-in, session checks,
 * and the CSRF guard on changes.
 *
 * @since 0.0.1
 */
describe('dashboard', () => {
  beforeAll(async () => {
    if (server.listening === false) {
      await once(server, 'listening');
    }

    const address: Admin_Dashboard_Address = server.address();

    if (typeof address === 'object' && address !== null) {
      Reflect.set(baseUrl, 'value', `http://127.0.0.1:${String(address.port)}`);
    }

    return;
  });

  afterAll(() => {
    server.close();

    return;
  });

  it('serves the page with security headers', async () => {
    const response: Admin_Dashboard_ServesThePageWithSecurityHeaders_Response = await fetch(`${baseUrl['value']}/admin/`);

    expect(response.status).toBe(200);

    expect(response.headers.get('Content-Security-Policy')).toContain('default-src \'self\'');

    expect(await response.text()).toContain('Sign in to Outpost');

    expect((await fetch(`${baseUrl['value']}/admin/assets/admin.js`)).status).toBe(200);

    return;
  });

  it('signs in and protects changes', async () => {
    expect((await fetch(`${baseUrl['value']}/admin/api/overview`)).status).toBe(401);

    expect((await fetch(`${baseUrl['value']}/admin/api/session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'admin',
        password: 'wrong',
      }),
    })).status).toBe(401);

    const login: Admin_Dashboard_SignsInAndProtectsChanges_Login = await fetch(`${baseUrl['value']}/admin/api/session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'admin',
        password: 'secret',
      }),
    });
    const cookie: Admin_Dashboard_SignsInAndProtectsChanges_Cookie = (login.headers.get('Set-Cookie') ?? '').split(';')[0] ?? '';
    const session: Admin_Dashboard_SignsInAndProtectsChanges_Session = Object(await login.json());

    expect(cookie).toContain('outpost_session=');

    expect((await fetch(`${baseUrl['value']}/admin/api/overview`, { headers: { Cookie: cookie } })).status).toBe(200);

    expect((await fetch(`${baseUrl['value']}/admin/api/run`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookie,
      },
      body: JSON.stringify({ containerId: 'abc123' }),
    })).status).toBe(403);

    expect((await fetch(`${baseUrl['value']}/admin/api/run`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookie,
        'X-CSRF-Token': String(session['csrfToken']),
      },
      body: JSON.stringify({ containerId: 'abc123' }),
    })).status).toBe(202);

    expect(trigger).toHaveBeenCalledWith(['abc123']);

    return;
  });

  return;
});

/**
 * Admin - Build Container Rows.
 *
 * Checks the managed flag, the explanatory note, and that the last
 * report's result is attached to the right container.
 *
 * @since 0.0.1
 */
describe('buildContainerRows', () => {
  it('marks managed and excluded containers', () => {
    const rows: Admin_BuildContainerRows_MarksManagedAndExcludedContainers_Rows = buildContainerRows([
      {
        Id: 'aaaaaaaaaaaa1111',
        Names: ['/web'],
        Image: 'nginx:1',
        ImageID: 'sha256:1',
        Labels: {},
        State: 'running',
      },
      {
        Id: 'bbbbbbbbbbbb2222',
        Names: ['/db'],
        Image: 'postgres:17',
        ImageID: 'sha256:2',
        Labels: { 'io.cbnventures.outpost.enable': 'false' },
        State: 'running',
      },
    ], {
      labelMode: 'opt-out',
      selfId: undefined,
      monitorOnly: false,
    }, {
      startedAt: '2026-10-24T04:00:00.000Z',
      finishedAt: '2026-10-24T04:00:05.000Z',
      results: [{
        container: 'web',
        image: 'nginx:1',
        status: 'updated',
        detail: 'Recreated with nginx:1',
      }],
    });

    expect(rows.map((row) => [
      row['name'],
      row['managed'],
      row['note'],
      row['lastStatus'],
    ])).toStrictEqual([
      [
        'db',
        false,
        'Opted out by label',
        undefined,
      ],
      [
        'web',
        true,
        'Managed',
        'updated',
      ],
    ]);

    return;
  });

  return;
});

/**
 * Admin - Read Session ID.
 *
 * Checks that the session cookie is found among other cookies and that
 * a missing header yields no session.
 *
 * @since 0.0.1
 */
describe('readSessionId', () => {
  it('finds the session cookie', () => {
    const sessionId: Admin_ReadSessionId_FindsTheSessionCookie_SessionId = readSessionId('theme=dark; outpost_session=abc; other=1');

    expect(sessionId).toBe('abc');

    expect(readSessionId(undefined)).toBeUndefined();

    return;
  });

  return;
});

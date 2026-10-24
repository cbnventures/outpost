import {
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { sendNotification } from './notify.js';

import type {
  Notify_SendNotification_PostsToNtfyAndWebhook_Errors,
  Notify_SendNotification_PostsToNtfyAndWebhook_FetchFunction,
  Notify_SendNotification_ReportsFailuresWithoutThrowing_Errors,
} from './types/notify.test.d.ts';
import type { Shared_FetchFunction } from './types/shared.d.ts';

/**
 * Notify - Send Notification.
 *
 * Checks request shapes for both targets and that failures are
 * collected instead of thrown.
 *
 * @since 0.0.1
 */
describe('sendNotification', () => {
  it('posts to ntfy and webhook', async () => {
    const fetchFunction: Notify_SendNotification_PostsToNtfyAndWebhook_FetchFunction = vi.fn<Shared_FetchFunction>(async () => new Response('ok'));
    const errors: Notify_SendNotification_PostsToNtfyAndWebhook_Errors = await sendNotification({
      ntfyUrl: 'https://ntfy.test/outpost',
      ntfyToken: 'tk_secret',
      webhookUrl: 'https://hooks.test/outpost',
    }, {
      title: 'Outpost updated 1 container',
      message: 'web: nginx:1 updated',
      tags: ['whale'],
      priority: 'default',
      payload: { updated: 1 },
    }, fetchFunction);

    expect(errors).toStrictEqual([]);

    expect(fetchFunction).toHaveBeenCalledTimes(2);

    expect(fetchFunction).toHaveBeenCalledWith('https://ntfy.test/outpost', expect.objectContaining({
      body: 'web: nginx:1 updated',
      headers: expect.objectContaining({ Authorization: 'Bearer tk_secret' }),
    }));

    return;
  });

  it('reports failures without throwing', async () => {
    const errors: Notify_SendNotification_ReportsFailuresWithoutThrowing_Errors = await sendNotification({
      ntfyUrl: 'https://ntfy.test/outpost',
      ntfyToken: undefined,
      webhookUrl: undefined,
    }, {
      title: 'Outpost',
      message: 'Hello',
      tags: [],
      priority: 'low',
      payload: undefined,
    }, vi.fn<Shared_FetchFunction>(async () => Promise.reject(new Error('offline'))));

    expect(errors).toStrictEqual(['ntfy notification failed: offline']);

    return;
  });

  return;
});

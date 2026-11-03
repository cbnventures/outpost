import {
  describe,
  expect,
  it,
} from 'vitest';

import {
  buildNotificationPayload,
  notificationInputSchema,
  sendNotification,
} from './notifications.js';

import type {
  Lib_Notifications_Payloads_SerializesOutpostAppDiscriminator_Payload,
  Lib_Notifications_Responses_KeepsNtfyReverseProxyMismatchReasons_Result,
  Lib_Notifications_Responses_KeepsNtfyReverseProxyMismatchReasons_ServiceReason,
  Lib_Notifications_Validation_RejectsMatrixRoomAliases_Parsed,
} from '../types/lib/notifications.test.d.ts';

/**
 * Lib - Notifications - Payloads.
 *
 * Locks the producer discriminator to the ntfy-reverse-proxy interpreter key.
 * This protects integrations from future display-name or service-name changes.
 *
 * @since 1.0.0
 */
describe('payloads', () => {
  it('serializes the Outpost app discriminator', () => {
    const payload: Lib_Notifications_Payloads_SerializesOutpostAppDiscriminator_Payload = buildNotificationPayload({
      key: 'outpost',
      name: 'Outpost',
    }, {
      details: {},
      event: 'test',
      message: 'Test message.',
      occurredAt: '2026-10-27T12:00:00.000Z',
      priority: 'default',
      tags: ['bell'],
      title: 'Test notification',
    });

    expect(payload['app']).toBe('outpost');

    return;
  });

  return;
});

/**
 * Lib - Notifications - Validation.
 *
 * Checks service-specific fields before a destination can be saved.
 * Invalid values keep the destination out of state.
 *
 * @since 1.0.0
 */
describe('validation', () => {
  it('rejects Matrix room aliases', () => {
    const parsed: Lib_Notifications_Validation_RejectsMatrixRoomAliases_Parsed = notificationInputSchema('matrix', ['update-failed'], [], []).safeParse({
      events: ['update-failed'],
      name: 'Matrix alerts',
      service: 'matrix',
      settings: {
        accessToken: 'matrix-secret',
        homeserverUrl: 'https://matrix.example.com',
        roomId: '#alerts:example.com',
      },
    });

    expect(parsed.success).toBe(false);

    if (parsed.success === false) {
      expect(parsed.error.issues).toEqual(expect.arrayContaining([expect.objectContaining({
        message: 'Use a room ID like !room:example.com.',
        path: [
          'settings',
          'roomId',
        ],
      })]));
    }

    return;
  });

  return;
});

/**
 * Lib - Notifications - Responses.
 *
 * Keeps useful service errors bounded without cutting off known mismatch guidance.
 * The stored row should explain how to correct the destination.
 *
 * @since 1.0.0
 */
describe('responses', () => {
  it('keeps ntfy-reverse-proxy mismatch reasons', async () => {
    const serviceReason: Lib_Notifications_Responses_KeepsNtfyReverseProxyMismatchReasons_ServiceReason = 'This context reads Transmission VPN alerts, but the payload came from discord-stonker-bot. Set the context\'s interpreter to discord-stonker-bot.';
    const result: Lib_Notifications_Responses_KeepsNtfyReverseProxyMismatchReasons_Result = await sendNotification({
      key: 'outpost',
      name: 'Outpost',
    }, {
      secrets: {},
      service: 'ntfy-reverse-proxy',
      settings: { url: 'https://alerts.example.com' },
    }, {
      details: {},
      event: 'test',
      message: 'Test message.',
      occurredAt: '2026-10-27T12:00:00.000Z',
      priority: 'default',
      tags: ['bell'],
      title: 'Test notification',
    }, {
      fetch: async () => new Response(JSON.stringify({ error: serviceReason }), { status: 422 }),
      sendMail: async () => undefined,
    });

    expect(result).toEqual({
      delivered: false,
      message: `HTTP 422: ${serviceReason}`,
    });

    return;
  });

  return;
});

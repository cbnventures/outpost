import type {
  buildNotificationPayload,
  notificationInputSchema,
  sendNotification,
} from '../../lib/notifications.js';

/**
 * Lib - Notifications - Payloads - Serializes Outpost App Discriminator.
 *
 * @since 1.0.0
 */
export type Lib_Notifications_Payloads_SerializesOutpostAppDiscriminator_Payload = ReturnType<typeof buildNotificationPayload>;

/**
 * Lib - Notifications - Validation - Rejects Matrix Room Aliases.
 *
 * @since 1.0.0
 */
export type Lib_Notifications_Validation_RejectsMatrixRoomAliases_Parsed = ReturnType<ReturnType<typeof notificationInputSchema>['safeParse']>;

/**
 * Lib - Notifications - Responses - Keeps Ntfy Reverse Proxy Mismatch Reasons.
 *
 * @since 1.0.0
 */
export type Lib_Notifications_Responses_KeepsNtfyReverseProxyMismatchReasons_ServiceReason = string;

export type Lib_Notifications_Responses_KeepsNtfyReverseProxyMismatchReasons_Result = Awaited<ReturnType<typeof sendNotification>>;

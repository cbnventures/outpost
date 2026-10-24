/**
 * Shared - Fetch Function.
 *
 * @since 0.0.1
 */
export type Shared_FetchFunction = (input: string, init: RequestInit) => Promise<Response>;

/**
 * Shared - Notification.
 *
 * @since 0.0.1
 */
export type Shared_Notification_Title = string;

export type Shared_Notification_Message = string;

export type Shared_Notification_Tag = string;

export type Shared_Notification_Tags = Shared_Notification_Tag[];

export type Shared_Notification_Priority = 'min' | 'low' | 'default' | 'high' | 'urgent';

export type Shared_Notification_Payload = unknown;

export type Shared_Notification = {
  title: Shared_Notification_Title;
  message: Shared_Notification_Message;
  tags: Shared_Notification_Tags;
  priority: Shared_Notification_Priority;
  payload: Shared_Notification_Payload;
};

/**
 * Shared - Targets.
 *
 * @since 0.0.1
 */
export type Shared_Targets_NtfyUrl = string | undefined;

export type Shared_Targets_NtfyToken = string | undefined;

export type Shared_Targets_WebhookUrl = string | undefined;

export type Shared_Targets = {
  ntfyUrl: Shared_Targets_NtfyUrl;
  ntfyToken: Shared_Targets_NtfyToken;
  webhookUrl: Shared_Targets_WebhookUrl;
};

import type {
  Notify_SendNotification_Errors,
  Notify_SendNotification_FetchFunction,
  Notify_SendNotification_Headers,
  Notify_SendNotification_Notification,
  Notify_SendNotification_Returns,
  Notify_SendNotification_Targets,
  Notify_SendRequest_Description,
  Notify_SendRequest_ErrorMessage,
  Notify_SendRequest_Errors,
  Notify_SendRequest_FetchFunction,
  Notify_SendRequest_Init,
  Notify_SendRequest_Response,
  Notify_SendRequest_Returns,
  Notify_SendRequest_Url,
} from './types/notify.d.ts';

/**
 * Notify - Send Notification.
 *
 * Delivers a notification to every configured target: an ntfy topic as
 * plain text with ntfy headers, and a webhook as JSON. Never throws;
 * failures are returned so a bad target cannot stop an update run.
 *
 * @param {Notify_SendNotification_Targets}       targets       - Targets.
 * @param {Notify_SendNotification_Notification}  notification  - Notification.
 * @param {Notify_SendNotification_FetchFunction} fetchFunction - Fetch function.
 *
 * @returns {Notify_SendNotification_Returns}
 *
 * @since 0.0.1
 */
export async function sendNotification(targets: Notify_SendNotification_Targets, notification: Notify_SendNotification_Notification, fetchFunction: Notify_SendNotification_FetchFunction): Notify_SendNotification_Returns {
  const errors: Notify_SendNotification_Errors = [];

  if (targets['ntfyUrl'] !== undefined) {
    const headers: Notify_SendNotification_Headers = {
      'Content-Type': 'text/plain; charset=utf-8',
      'Title': notification['title'],
      'Tags': notification['tags'].join(','),
      'Priority': notification['priority'],
    };

    if (targets['ntfyToken'] !== undefined) {
      Reflect.set(headers, 'Authorization', `Bearer ${targets['ntfyToken']}`);
    }

    await sendRequest(targets['ntfyUrl'], {
      method: 'POST',
      headers,
      body: notification['message'],
    }, 'ntfy', errors, fetchFunction);
  }

  if (targets['webhookUrl'] !== undefined) {
    await sendRequest(targets['webhookUrl'], {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: notification['title'],
        message: notification['message'],
        tags: notification['tags'],
        priority: notification['priority'],
        payload: notification['payload'],
      }),
    }, 'webhook', errors, fetchFunction);
  }

  return errors;
}

/**
 * Notify - Send Request.
 *
 * Sends one notification request and records a readable error instead
 * of throwing when the network call fails or the target rejects it.
 *
 * @param {Notify_SendRequest_Url}           url           - Url.
 * @param {Notify_SendRequest_Init}          init          - Init.
 * @param {Notify_SendRequest_Description}   description   - Description.
 * @param {Notify_SendRequest_Errors}        errors        - Errors.
 * @param {Notify_SendRequest_FetchFunction} fetchFunction - Fetch function.
 *
 * @returns {Notify_SendRequest_Returns}
 *
 * @since 0.0.1
 */
async function sendRequest(url: Notify_SendRequest_Url, init: Notify_SendRequest_Init, description: Notify_SendRequest_Description, errors: Notify_SendRequest_Errors, fetchFunction: Notify_SendRequest_FetchFunction): Notify_SendRequest_Returns {
  try {
    const response: Notify_SendRequest_Response = await fetchFunction(url, init);

    if (response['ok'] === false) {
      errors.push(`${description} notification failed with HTTP ${String(response['status'])}.`);
    }
  } catch (error) {
    const errorMessage: Notify_SendRequest_ErrorMessage = (error instanceof Error) ? error['message'] : String(error);

    errors.push(`${description} notification failed: ${errorMessage}`);
  }

  return;
}

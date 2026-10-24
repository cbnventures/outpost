import type {
  Shared_FetchFunction,
  Shared_Notification,
  Shared_Targets,
} from './shared.d.ts';

/**
 * Notify - Send Notification.
 *
 * @since 0.0.1
 */
export type Notify_SendNotification_Targets = Shared_Targets;

export type Notify_SendNotification_Notification = Shared_Notification;

export type Notify_SendNotification_FetchFunction = Shared_FetchFunction;

export type Notify_SendNotification_Error = string;

export type Notify_SendNotification_Returns = Promise<Notify_SendNotification_Error[]>;

export type Notify_SendNotification_Errors = Notify_SendNotification_Error[];

export type Notify_SendNotification_Headers = Record<string, string>;

/**
 * Notify - Send Request.
 *
 * @since 0.0.1
 */
export type Notify_SendRequest_Url = string;

export type Notify_SendRequest_Init = RequestInit;

export type Notify_SendRequest_Description = string;

export type Notify_SendRequest_Error = string;

export type Notify_SendRequest_Errors = Notify_SendRequest_Error[];

export type Notify_SendRequest_FetchFunction = Shared_FetchFunction;

export type Notify_SendRequest_Returns = Promise<void>;

export type Notify_SendRequest_Response = Response;

export type Notify_SendRequest_ErrorMessage = string;

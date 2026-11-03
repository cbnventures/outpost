import type {
  UpdateReport,
  UpdateResult,
} from 'outpost-package-updater';

import type { Runner as State } from '../../lib/state.js';
import type {
  Lib_Notifications_App,
  Lib_Notifications_EventDefinitions,
  Lib_Notifications_Notification,
  Lib_Notifications_Result,
  Lib_Notifications_Target,
} from './notifications.d.ts';
import type {
  Lib_State_Runner_GetNotificationDeliveries_Returns,
  Lib_State_Runner_GetNotificationDelivery_Returns,
} from './state.d.ts';

export type Lib_Notifier_App = Lib_Notifications_App & {
  key: 'outpost';
  name: 'Outpost';
};

export type Lib_Notifier_NotificationEvents = Lib_Notifications_EventDefinitions;

export type Lib_Notifier_Runner_Dependencies = {
  send: (app: Lib_Notifications_App, target: Lib_Notifications_Target, notification: Lib_Notifications_Notification) => Promise<Lib_Notifications_Result>;
};

export type Lib_Notifier_Runner_LockedAddresses = Map<string, number>;

export type Lib_Notifier_Runner_LockWindowMilliseconds = number;

export type Lib_Notifier_Runner_State = State;

export type Lib_Notifier_Runner_Constructor_State = State;

export type Lib_Notifier_Runner_Constructor_Dependencies = Partial<Lib_Notifier_Runner_Dependencies>;

export type Lib_Notifier_Runner_GetEvents_Returns = Lib_Notifications_EventDefinitions;

export type Lib_Notifier_Runner_NotifySecretsRemoved_Items = string[];

export type Lib_Notifier_Runner_NotifySecretsRemoved_Returns = void;

export type Lib_Notifier_Runner_NotifySignInLimit_Key = string;

export type Lib_Notifier_Runner_NotifySignInLimit_Returns = void;

export type Lib_Notifier_Runner_NotifySignInLimit_Address = string;

export type Lib_Notifier_Runner_NotifySignInLimit_Now = number;

export type Lib_Notifier_Runner_NotifySignInLimit_LockedAt = number | undefined;

export type Lib_Notifier_Runner_NotifyUpdateReport_Report = UpdateReport;

export type Lib_Notifier_Runner_NotifyUpdateReport_Returns = void;

export type Lib_Notifier_Runner_NotifyUpdateReport_Results = UpdateResult[];

export type Lib_Notifier_Runner_SendTest_Id = string;

export type Lib_Notifier_Runner_SendTest_Returns = Promise<Lib_Notifications_Result | 'not-found' | 'secrets-missing'>;

export type Lib_Notifier_Runner_SendTest_Delivery = Lib_State_Runner_GetNotificationDelivery_Returns;

export type Lib_Notifier_Runner_SendTest_Result = Lib_Notifications_Result;

export type Lib_Notifier_Runner_Deliver_Notification = Lib_Notifications_Notification;

export type Lib_Notifier_Runner_Deliver_Returns = void;

export type Lib_Notifier_Runner_Deliver_Deliveries = Lib_State_Runner_GetNotificationDeliveries_Returns;

export type Lib_Notifier_Runner_Deliver_Error = unknown;

export type Lib_Notifier_Runner_Deliver_Reason = string;

export type Lib_Notifier_Runner_DescribeContainers_Results = UpdateResult[];

export type Lib_Notifier_Runner_DescribeContainers_Detailed = boolean;

export type Lib_Notifier_Runner_DescribeContainers_Returns = string;

export type Lib_Notifier_Runner_DescribeContainers_Noun = string;

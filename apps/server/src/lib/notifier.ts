import {
  buildEventNotification,
  buildSecretsRemovedNotification,
  buildSignInLockedNotification,
  buildTestNotification,
  commonNotificationEvents,
  sendNotification,
} from './notifications.js';

import type {
  Lib_Notifier_App,
  Lib_Notifier_NotificationEvents,
  Lib_Notifier_Runner_Constructor_Dependencies,
  Lib_Notifier_Runner_Constructor_State,
  Lib_Notifier_Runner_Deliver_Deliveries,
  Lib_Notifier_Runner_Deliver_Error,
  Lib_Notifier_Runner_Deliver_Notification,
  Lib_Notifier_Runner_Deliver_Reason,
  Lib_Notifier_Runner_Deliver_Returns,
  Lib_Notifier_Runner_Dependencies,
  Lib_Notifier_Runner_DescribeContainers_Detailed,
  Lib_Notifier_Runner_DescribeContainers_Noun,
  Lib_Notifier_Runner_DescribeContainers_Results,
  Lib_Notifier_Runner_DescribeContainers_Returns,
  Lib_Notifier_Runner_GetEvents_Returns,
  Lib_Notifier_Runner_LockedAddresses,
  Lib_Notifier_Runner_LockWindowMilliseconds,
  Lib_Notifier_Runner_NotifySecretsRemoved_Items,
  Lib_Notifier_Runner_NotifySecretsRemoved_Returns,
  Lib_Notifier_Runner_NotifySignInLimit_Address,
  Lib_Notifier_Runner_NotifySignInLimit_Key,
  Lib_Notifier_Runner_NotifySignInLimit_LockedAt,
  Lib_Notifier_Runner_NotifySignInLimit_Now,
  Lib_Notifier_Runner_NotifySignInLimit_Returns,
  Lib_Notifier_Runner_NotifyUpdateReport_Report,
  Lib_Notifier_Runner_NotifyUpdateReport_Results,
  Lib_Notifier_Runner_NotifyUpdateReport_Returns,
  Lib_Notifier_Runner_SendTest_Delivery,
  Lib_Notifier_Runner_SendTest_Id,
  Lib_Notifier_Runner_SendTest_Result,
  Lib_Notifier_Runner_SendTest_Returns,
  Lib_Notifier_Runner_State,
} from '../types/lib/notifier.d.ts';

/**
 * Lib - Notifier - App.
 *
 * Names Outpost in notification titles and payloads.
 * The key also picks the matching ntfy-reverse-proxy interpreter.
 *
 * @since 1.0.0
 */
const app: Lib_Notifier_App = {
  key: 'outpost',
  name: 'Outpost',
};

/**
 * Lib - Notifier - Notification Events.
 *
 * Lists every event a destination can choose, with its label, description, and default.
 * The first two are shared by all four apps.
 *
 * @since 1.0.0
 */
export const notificationEvents: Lib_Notifier_NotificationEvents = [
  ...commonNotificationEvents,
  {
    defaultEnabled: true,
    description: 'Containers were updated to new images.',
    key: 'updates-applied',
    label: 'Containers updated',
    priority: 'default',
    tags: [
      'whale',
      'white_check_mark',
    ],
  },
  {
    defaultEnabled: true,
    description: 'Monitor-only containers have new images.',
    key: 'updates-available',
    label: 'New images available',
    priority: 'default',
    tags: ['whale'],
  },
  {
    defaultEnabled: true,
    description: 'An update failed or was rolled back.',
    key: 'update-failed',
    label: 'Update failed',
    priority: 'high',
    tags: [
      'whale',
      'warning',
    ],
  },
];

/**
 * Lib - Notifier.
 *
 * Turns update checks, sign-in lockouts, and a lost encryption key into notifications,
 * and sends each one to every destination that chose its event.
 *
 * @since 1.0.0
 */
export class Runner {
  /**
   * Lib - Notifier - Lock Window Milliseconds.
   *
   * Matches the sign-in limiter's window, so an address is reported once per lockout.
   * Ten failures inside it pause sign-in from that address.
   *
   * @private
   *
   * @since 1.0.0
   */
  static readonly #lockWindowMilliseconds: Lib_Notifier_Runner_LockWindowMilliseconds = 15 * 60 * 1000;

  /**
   * Lib - Notifier - Dependencies.
   *
   * Holds the network send, which tests replace.
   * Production uses the shared notification sender.
   *
   * @private
   *
   * @since 1.0.0
   */
  readonly #dependencies: Lib_Notifier_Runner_Dependencies;

  /**
   * Lib - Notifier - Locked Addresses.
   *
   * Remembers when each address was last reported as locked.
   * Entries older than the lock window are dropped.
   *
   * @private
   *
   * @since 1.0.0
   */
  readonly #lockedAddresses: Lib_Notifier_Runner_LockedAddresses = new Map();

  /**
   * Lib - Notifier - State.
   *
   * Supplies the destinations and records each attempt.
   * Secrets are only opened when a notification is sent.
   *
   * @private
   *
   * @since 1.0.0
   */
  readonly #state: Lib_Notifier_Runner_State;

  /**
   * Lib - Notifier - Constructor.
   *
   * Binds the notifier to the dashboard state.
   * Tests may pass their own send.
   *
   * @param {Lib_Notifier_Runner_Constructor_State}        state          - State.
   * @param {Lib_Notifier_Runner_Constructor_Dependencies} [dependencies] - Dependencies.
   *
   * @since 1.0.0
   */
  public constructor(state: Lib_Notifier_Runner_Constructor_State, dependencies: Lib_Notifier_Runner_Constructor_Dependencies = {}) {
    this.#state = state;
    this.#dependencies = {
      send: dependencies['send'] ?? sendNotification,
    };

    return;
  }

  /**
   * Lib - Notifier - Get Events.
   *
   * Lists the events a destination can choose.
   * The words match the other appliances.
   *
   * @returns {Lib_Notifier_Runner_GetEvents_Returns}
   *
   * @since 1.0.0
   */
  public getEvents(): Lib_Notifier_Runner_GetEvents_Returns {
    return notificationEvents;
  }

  /**
   * Lib - Notifier - Notify Secrets Removed.
   *
   * Reports the secrets a lost encryption key took when this start made a new key.
   * Only destinations that kept working without their own secrets can receive it.
   *
   * @param {Lib_Notifier_Runner_NotifySecretsRemoved_Items} items - Items.
   *
   * @returns {Lib_Notifier_Runner_NotifySecretsRemoved_Returns}
   *
   * @since 1.0.0
   */
  public notifySecretsRemoved(items: Lib_Notifier_Runner_NotifySecretsRemoved_Items): Lib_Notifier_Runner_NotifySecretsRemoved_Returns {
    if (items.length === 0) {
      return;
    }

    this.deliver(buildSecretsRemovedNotification(app, 'encryption key', items));

    return;
  }

  /**
   * Lib - Notifier - Notify Sign In Limit.
   *
   * Reports an address the moment its sign-in failures reach the limit.
   * Each address is reported once per lockout window.
   *
   * @param {Lib_Notifier_Runner_NotifySignInLimit_Key} key - Key.
   *
   * @returns {Lib_Notifier_Runner_NotifySignInLimit_Returns}
   *
   * @since 1.0.0
   */
  public notifySignInLimit(key: Lib_Notifier_Runner_NotifySignInLimit_Key): Lib_Notifier_Runner_NotifySignInLimit_Returns {
    if (key.startsWith('sign-in:') === false) {
      return;
    }

    const address: Lib_Notifier_Runner_NotifySignInLimit_Address = key.slice('sign-in:'.length);
    const now: Lib_Notifier_Runner_NotifySignInLimit_Now = Date.now();
    const lockedAt: Lib_Notifier_Runner_NotifySignInLimit_LockedAt = this.#lockedAddresses.get(address);

    for (const lockedAddress of [...this.#lockedAddresses.keys()]) {
      if ((this.#lockedAddresses.get(lockedAddress) ?? 0) <= now - Runner.#lockWindowMilliseconds) {
        this.#lockedAddresses.delete(lockedAddress);
      }
    }

    if (lockedAt !== undefined && lockedAt > now - Runner.#lockWindowMilliseconds) {
      return;
    }

    this.#lockedAddresses.set(address, now);

    this.deliver(buildSignInLockedNotification(address));

    return;
  }

  /**
   * Lib - Notifier - Notify Update Report.
   *
   * Reports what one update check did: at most one notification per event, each listing
   * its containers. A quiet check sends nothing.
   *
   * @param {Lib_Notifier_Runner_NotifyUpdateReport_Report} report - Report.
   *
   * @returns {Lib_Notifier_Runner_NotifyUpdateReport_Returns}
   *
   * @since 1.0.0
   */
  public notifyUpdateReport(report: Lib_Notifier_Runner_NotifyUpdateReport_Report): Lib_Notifier_Runner_NotifyUpdateReport_Returns {
    if (report['error'] !== undefined) {
      this.deliver(buildEventNotification(notificationEvents[4]!, `The update check couldn't run: ${report['error']}`, {
        error: report['error'],
        finishedAt: report['finishedAt'],
        startedAt: report['startedAt'],
      }));

      return;
    }

    const updated: Lib_Notifier_Runner_NotifyUpdateReport_Results = report['results'].filter((result) => result['status'] === 'updated');
    const available: Lib_Notifier_Runner_NotifyUpdateReport_Results = report['results'].filter((result) => result['status'] === 'available');
    const failed: Lib_Notifier_Runner_NotifyUpdateReport_Results = report['results'].filter((result) => result['status'] === 'failed' || result['status'] === 'rolled-back');

    if (updated.length > 0) {
      this.deliver(buildEventNotification(notificationEvents[2]!, `Updated ${this.describeContainers(updated, false)}.`, {
        containers: updated,
        finishedAt: report['finishedAt'],
      }));
    }

    if (available.length > 0) {
      this.deliver(buildEventNotification(notificationEvents[3]!, `New images are ready for ${this.describeContainers(available, false)}.`, {
        containers: available,
        finishedAt: report['finishedAt'],
      }));
    }

    if (failed.length > 0) {
      this.deliver(buildEventNotification(notificationEvents[4]!, `Couldn't update ${this.describeContainers(failed, true)}.`, {
        containers: failed,
        finishedAt: report['finishedAt'],
      }));
    }

    return;
  }

  /**
   * Lib - Notifier - Send Test.
   *
   * Sends the test notification to one destination right away and records the attempt.
   * A destination waiting for removed secrets isn't tried.
   *
   * @param {Lib_Notifier_Runner_SendTest_Id} id - Id.
   *
   * @returns {Lib_Notifier_Runner_SendTest_Returns}
   *
   * @since 1.0.0
   */
  public async sendTest(id: Lib_Notifier_Runner_SendTest_Id): Lib_Notifier_Runner_SendTest_Returns {
    const delivery: Lib_Notifier_Runner_SendTest_Delivery = this.#state.getNotificationDelivery(id);

    if (typeof delivery === 'string') {
      return delivery;
    }

    const result: Lib_Notifier_Runner_SendTest_Result = await this.#dependencies.send(app, delivery['target'], buildTestNotification(app));

    this.#state.recordNotificationAttempt(id, (result['delivered'] === true) ? null : result['message']);

    return result;
  }

  /**
   * Lib - Notifier - Deliver.
   *
   * Sends one notification to every destination that chose its event, without waiting.
   * Each attempt is recorded, and a failure never reaches the caller.
   *
   * @param {Lib_Notifier_Runner_Deliver_Notification} notification - Notification.
   *
   * @private
   *
   * @returns {Lib_Notifier_Runner_Deliver_Returns}
   *
   * @since 1.0.0
   */
  private deliver(notification: Lib_Notifier_Runner_Deliver_Notification): Lib_Notifier_Runner_Deliver_Returns {
    let deliveries: Lib_Notifier_Runner_Deliver_Deliveries = [];

    try {
      deliveries = this.#state.getNotificationDeliveries(notification['event']);
    } catch (error) {
      const reason: Lib_Notifier_Runner_Deliver_Reason = (error instanceof Error) ? error.message : String(error);

      process.stderr.write(`Notification destinations could not be loaded for ${notification['event']}: ${reason}\n`);

      return;
    }

    for (const delivery of deliveries) {
      void this.#dependencies.send(app, delivery['target'], notification).then((result) => {
        this.#state.recordNotificationAttempt(delivery['id'], (result['delivered'] === true) ? null : result['message']);

        return;
      }).catch((error: Lib_Notifier_Runner_Deliver_Error) => {
        const reason: Lib_Notifier_Runner_Deliver_Reason = (error instanceof Error) ? error.message : String(error);

        process.stderr.write(`A notification to ${delivery['name']} failed: ${reason}\n`);

        return;
      });
    }

    return;
  }

  /**
   * Lib - Notifier - Describe Containers.
   *
   * Lists containers with their images for a notification, like "2 containers: a (x), b (y)".
   * The detailed form adds what went wrong with each one.
   *
   * @param {Lib_Notifier_Runner_DescribeContainers_Results}  results  - Results.
   * @param {Lib_Notifier_Runner_DescribeContainers_Detailed} detailed - Detailed.
   *
   * @private
   *
   * @returns {Lib_Notifier_Runner_DescribeContainers_Returns}
   *
   * @since 1.0.0
   */
  private describeContainers(results: Lib_Notifier_Runner_DescribeContainers_Results, detailed: Lib_Notifier_Runner_DescribeContainers_Detailed): Lib_Notifier_Runner_DescribeContainers_Returns {
    const noun: Lib_Notifier_Runner_DescribeContainers_Noun = (results.length === 1) ? 'container' : 'containers';

    if (detailed === false) {
      return `${String(results.length)} ${noun}: ${results.map((result) => `${result['container']} (${result['image']})`).join(', ')}`;
    }

    return `${String(results.length)} ${noun}: ${results.map((result) => {
      const outcome: Lib_Notifier_Runner_DescribeContainers_Noun = (result['status'] === 'rolled-back') ? 'was rolled back' : 'failed';
      const detail: Lib_Notifier_Runner_DescribeContainers_Noun = (result['detail'].endsWith('.') === true) ? result['detail'].slice(0, -1) : result['detail'];

      return `${result['container']} (${result['image']}) ${outcome}: ${detail}`;
    }).join('; ')}`;
  }
}

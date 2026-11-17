import { logDebug, logError, logInfo } from './lib/logger.js';

import type {
  Scheduler_Runner_Action,
  Scheduler_Runner_Constructor_GetNextRun,
  Scheduler_Runner_Constructor_History,
  Scheduler_Runner_Constructor_RunCycle,
  Scheduler_Runner_Execute_Action,
  Scheduler_Runner_Execute_AlreadyRecorded,
  Scheduler_Runner_Execute_CycleLabel,
  Scheduler_Runner_Execute_CycleReport,
  Scheduler_Runner_Execute_CycleStartedAt,
  Scheduler_Runner_Execute_ErrorMessage,
  Scheduler_Runner_Execute_FinishedAt,
  Scheduler_Runner_Execute_RecordOnce,
  Scheduler_Runner_Execute_Report,
  Scheduler_Runner_Execute_Returns,
  Scheduler_Runner_Execute_Rollback,
  Scheduler_Runner_Execute_Run,
  Scheduler_Runner_Execute_Source,
  Scheduler_Runner_GetNextRun,
  Scheduler_Runner_GetState_NextRun,
  Scheduler_Runner_GetState_Returns,
  Scheduler_Runner_History,
  Scheduler_Runner_LastError,
  Scheduler_Runner_Listeners,
  Scheduler_Runner_Notify_Event,
  Scheduler_Runner_Notify_Returns,
  Scheduler_Runner_Refresh_Returns,
  Scheduler_Runner_Resume_Finish,
  Scheduler_Runner_Resume_Returns,
  Scheduler_Runner_Resume_Source,
  Scheduler_Runner_Resume_StartedAt,
  Scheduler_Runner_RunCycle,
  Scheduler_Runner_Running,
  Scheduler_Runner_StartedAt,
  Scheduler_Runner_Subscribe_Listener,
  Scheduler_Runner_Subscribe_Returns,
  Scheduler_Runner_Totals,
  Scheduler_Runner_Trigger_Action,
  Scheduler_Runner_Trigger_ContainerIds,
  Scheduler_Runner_Trigger_Returns,
  Scheduler_Runner_Trigger_Rollback,
  Scheduler_Runner_Trigger_Source,
  Scheduler_ScheduledCycleAction_MonitorOnly,
  Scheduler_ScheduledCycleAction_Returns,
} from './types/scheduler.d.ts';

/**
 * Scheduler - Scheduled Cycle Action.
 *
 * Scheduled monitor-only runs inspect registries without pulling. Other
 * scheduled runs apply updates.
 *
 * @param {Scheduler_ScheduledCycleAction_MonitorOnly} monitorOnly - Monitor only.
 *
 * @returns {Scheduler_ScheduledCycleAction_Returns}
 *
 * @since 1.1.0
 */
export const scheduledCycleAction = (monitorOnly: Scheduler_ScheduledCycleAction_MonitorOnly): Scheduler_ScheduledCycleAction_Returns => (monitorOnly === true) ? 'check' : 'update';

/**
 * Scheduler.
 *
 * Runs update cycles one at a time, whether started by the cron schedule
 * or the API, and keeps the last report and running totals for metrics.
 *
 * @since 0.0.1
 */
export class Runner {
  /**
   * Scheduler - Run Cycle.
   *
   * Function that performs one update cycle and resolves with its report.
   * Injected so tests can replace the Docker-backed implementation.
   *
   * @private
   *
   * @since 0.0.1
   */
  readonly #runCycle: Scheduler_Runner_RunCycle;

  /**
   * Scheduler - Running.
   *
   * Whether a cycle is in progress. A second trigger while one runs is
   * refused so two cycles never recreate the same container at once.
   *
   * @private
   *
   * @since 0.0.1
   */
  #running: Scheduler_Runner_Running = false;

  /**
   * Scheduler - Action.
   *
   * Names the running cycle as a registry-only check or an applying update.
   * Status responses and live dashboard state use it while the lock is held.
   *
   * @private
   *
   * @since 1.1.0
   */
  #action: Scheduler_Runner_Action = undefined;

  /**
   * Scheduler - History.
   *
   * Store of finished reports. Its newest entry is the last report
   * served by the status endpoint and the dashboard.
   *
   * @private
   *
   * @since 0.0.1
   */
  readonly #history: Scheduler_Runner_History;

  /**
   * Scheduler - Get Next Run.
   *
   * Reads the next scheduled run time from the cron job, so the
   * dashboard can show when the next automatic check happens.
   *
   * @private
   *
   * @since 0.0.1
   */
  readonly #getNextRun: Scheduler_Runner_GetNextRun;

  /**
   * Scheduler - Started At.
   *
   * When the running cycle began, shown by the dashboard while a
   * check is in progress. Undefined when idle.
   *
   * @private
   *
   * @since 0.0.1
   */
  #startedAt: Scheduler_Runner_StartedAt = undefined;

  /**
   * Scheduler - Last Error.
   *
   * Message of the most recent cycle that failed outright, for example
   * because the Docker socket was unreachable.
   *
   * @private
   *
   * @since 0.0.1
   */
  #lastError: Scheduler_Runner_LastError = undefined;

  /**
   * Scheduler - Listeners.
   *
   * Callbacks told when a check starts or finishes, such as the dashboard's
   * live event stream. Each one is removed when its stream closes.
   *
   * @private
   *
   * @since 1.0.0
   */
  readonly #listeners: Scheduler_Runner_Listeners = new Set();

  /**
   * Scheduler - Totals.
   *
   * Running counters exposed as Prometheus metrics: cycles, updates,
   * and failures since the process started.
   *
   * @private
   *
   * @since 0.0.1
   */
  readonly #totals: Scheduler_Runner_Totals = {
    cycles: 0,
    updated: 0,
    failed: 0,
  };

  /**
   * Scheduler - Constructor.
   *
   * Stores the cycle function and history. Nothing runs until trigger
   * is called by the schedule, the API, or the dashboard.
   *
   * @param {Scheduler_Runner_Constructor_RunCycle}   runCycle   - Run cycle.
   * @param {Scheduler_Runner_Constructor_History}    history    - History.
   * @param {Scheduler_Runner_Constructor_GetNextRun} getNextRun - Get next run.
   *
   * @since 0.0.1
   */
  public constructor(runCycle: Scheduler_Runner_Constructor_RunCycle, history: Scheduler_Runner_Constructor_History, getNextRun: Scheduler_Runner_Constructor_GetNextRun) {
    this.#runCycle = runCycle;
    this.#history = history;
    this.#getNextRun = getNextRun;

    return;
  }

  /**
   * Scheduler - Trigger.
   *
   * Starts a cycle in the background unless one is already running,
   * optionally limited to some containers. Returns whether it started.
   *
   * @param {Scheduler_Runner_Trigger_Source}       source         - Source.
   * @param {Scheduler_Runner_Trigger_ContainerIds} [containerIds] - Container ids.
   * @param {Scheduler_Runner_Trigger_Action}       [action]       - Action.
   * @param {Scheduler_Runner_Trigger_Rollback}     [rollback]     - Rollback.
   *
   * @returns {Scheduler_Runner_Trigger_Returns}
   *
   * @since 1.1.0
   */
  public trigger(source: Scheduler_Runner_Trigger_Source, containerIds?: Scheduler_Runner_Trigger_ContainerIds, action: Scheduler_Runner_Trigger_Action = 'update', rollback: Scheduler_Runner_Trigger_Rollback = true): Scheduler_Runner_Trigger_Returns {
    if (this.#running === true) {
      return false;
    }

    this.#running = true;
    this.#action = action;
    this.#startedAt = new Date().toISOString();

    this.notify({ type: 'state' });

    void this.execute(source, action, rollback, async () => this.#runCycle(containerIds, source, action, rollback), false);

    return true;
  }

  /**
   * Scheduler - Resume.
   *
   * Finishes a check that an earlier Outpost started before it handed itself to
   * the self-update helper. The lock stays held, with the original start time.
   *
   * @param {Scheduler_Runner_Resume_Source}    source    - Source.
   * @param {Scheduler_Runner_Resume_StartedAt} startedAt - Started at.
   * @param {Scheduler_Runner_Resume_Finish}    finish    - Finish.
   *
   * @returns {Scheduler_Runner_Resume_Returns}
   *
   * @since 1.0.0
   */
  public resume(source: Scheduler_Runner_Resume_Source, startedAt: Scheduler_Runner_Resume_StartedAt, finish: Scheduler_Runner_Resume_Finish): Scheduler_Runner_Resume_Returns {
    if (this.#running === true) {
      return false;
    }

    this.#running = true;
    this.#action = 'update';
    this.#startedAt = startedAt;

    this.notify({ type: 'state' });

    void this.execute(source, 'update', true, finish, true);

    return true;
  }

  /**
   * Scheduler - Get State.
   *
   * Returns a snapshot of the scheduler for the status and metrics
   * endpoints.
   *
   * @returns {Scheduler_Runner_GetState_Returns}
   *
   * @since 0.0.1
   */
  public getState(): Scheduler_Runner_GetState_Returns {
    const nextRun: Scheduler_Runner_GetState_NextRun = this.#getNextRun();

    return {
      action: this.#action,
      running: this.#running,
      startedAt: this.#startedAt,
      nextRun: (nextRun !== undefined) ? nextRun.toISOString() : undefined,
      lastReport: this.#history.list()[0],
      lastError: this.#lastError,
      totals: { ...this.#totals },
    };
  }

  /**
   * Scheduler - Refresh.
   *
   * Tells live dashboard streams to read a fresh state snapshot after settings change.
   * It does not start a check or modify the current scheduler lock.
   *
   * @returns {Scheduler_Runner_Refresh_Returns}
   *
   * @since 1.0.0
   */
  public refresh(): Scheduler_Runner_Refresh_Returns {
    this.notify({ type: 'state' });

    return;
  }

  /**
   * Scheduler - Subscribe.
   *
   * Calls the listener whenever a check starts or finishes, with the report
   * of a finished check. The returned function stops the calls.
   *
   * @param {Scheduler_Runner_Subscribe_Listener} listener - Listener.
   *
   * @returns {Scheduler_Runner_Subscribe_Returns}
   *
   * @since 1.0.0
   */
  public subscribe(listener: Scheduler_Runner_Subscribe_Listener): Scheduler_Runner_Subscribe_Returns {
    this.#listeners.add(listener);

    return () => {
      this.#listeners.delete(listener);

      return;
    };
  }

  /**
   * Scheduler - Execute.
   *
   * Runs one cycle, records its outcome with what started it, and always
   * releases the lock, so a crashed cycle never blocks the next one.
   *
   * @param {Scheduler_Runner_Execute_Source}     source     - Source.
   * @param {Scheduler_Runner_Execute_Action}     action     - Action.
   * @param {Scheduler_Runner_Execute_Rollback}   rollback   - Rollback.
   * @param {Scheduler_Runner_Execute_Run}        run        - Run.
   * @param {Scheduler_Runner_Execute_RecordOnce} recordOnce - Record once.
   *
   * @private
   *
   * @returns {Scheduler_Runner_Execute_Returns}
   *
   * @since 1.1.0
   */
  private async execute(source: Scheduler_Runner_Execute_Source, action: Scheduler_Runner_Execute_Action, rollback: Scheduler_Runner_Execute_Rollback, run: Scheduler_Runner_Execute_Run, recordOnce: Scheduler_Runner_Execute_RecordOnce): Scheduler_Runner_Execute_Returns {
    const cycleLabel: Scheduler_Runner_Execute_CycleLabel = (action === 'check') ? 'Check cycle' : 'Update cycle';
    const cycleStartedAt: Scheduler_Runner_Execute_CycleStartedAt = Date.now();
    let report: Scheduler_Runner_Execute_Report = undefined;

    logDebug('scheduler', `${cycleLabel} started by ${source}`);

    try {
      const cycleReport: Scheduler_Runner_Execute_CycleReport = await run();

      report = {
        ...cycleReport,
        action,
        ...((action === 'update' && rollback === false) ? { rollback: false } : {}),
        trigger: source,
      };

      // A check finished after a self-update is recorded once, even if Outpost restarts again.
      const alreadyRecorded: Scheduler_Runner_Execute_AlreadyRecorded = recordOnce === true && this.#history.list().some((existing) => existing['startedAt'] === cycleReport['startedAt']);

      if (alreadyRecorded === false) {
        this.#history.add(report);
      }
      this.#lastError = report['error'];
      Reflect.set(this.#totals, 'updated', this.#totals['updated'] + report['results'].filter((result) => result['status'] === 'updated').length);
      Reflect.set(this.#totals, 'failed', this.#totals['failed'] + report['results'].filter((result) => (
        result['status'] === 'failed'
        || result['status'] === 'rolled-back'
        || result['status'] === 'kept-unhealthy'
      )).length);

      for (const result of report['results']) {
        logInfo('scheduler', `${result['container']} (${result['image']}): ${result['status']} - ${result['detail']}`);
      }

      logDebug('scheduler', `${cycleLabel} finished after ${String(Date.now() - cycleStartedAt)} ms (results: ${String(report['results'].length)})`);
    } catch (error) {
      const errorMessage: Scheduler_Runner_Execute_ErrorMessage = (error instanceof Error) ? error['message'] : String(error);
      const finishedAt: Scheduler_Runner_Execute_FinishedAt = new Date().toISOString();

      report = {
        action,
        ...((action === 'update' && rollback === false) ? { rollback: false } : {}),
        startedAt: this.#startedAt ?? finishedAt,
        finishedAt,
        error: errorMessage,
        results: [{
          container: 'Outpost',
          image: cycleLabel.toLowerCase(),
          status: 'failed',
          detail: `${cycleLabel} failed: ${errorMessage}`,
        }],
        trigger: source,
      };

      this.#lastError = errorMessage;
      this.#history.add(report);

      Reflect.set(this.#totals, 'failed', this.#totals['failed'] + 1);

      logError('scheduler', `${cycleLabel} failed: ${errorMessage}`);
    } finally {
      Reflect.set(this.#totals, 'cycles', this.#totals['cycles'] + 1);
      this.#running = false;
      this.#action = undefined;
      this.#startedAt = undefined;
    }

    if (report !== undefined) {
      this.notify({
        type: 'check',
        report,
      });
    }

    this.notify({ type: 'state' });

    return;
  }

  /**
   * Scheduler - Notify.
   *
   * Hands one event to every listener. A listener that throws is skipped,
   * so a broken event stream never stops a cycle from finishing.
   *
   * @param {Scheduler_Runner_Notify_Event} event - Event.
   *
   * @private
   *
   * @returns {Scheduler_Runner_Notify_Returns}
   *
   * @since 1.0.0
   */
  private notify(event: Scheduler_Runner_Notify_Event): Scheduler_Runner_Notify_Returns {
    for (const listener of [...this.#listeners]) {
      try {
        listener(event);
      } catch {
        // A closed or broken stream must not interrupt the other listeners.
      }
    }

    return;
  }
}

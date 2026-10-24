import type {
  Scheduler_Runner_Constructor_GetNextRun,
  Scheduler_Runner_Constructor_History,
  Scheduler_Runner_Constructor_RunCycle,
  Scheduler_Runner_Execute_ContainerIds,
  Scheduler_Runner_Execute_ErrorMessage,
  Scheduler_Runner_Execute_Report,
  Scheduler_Runner_Execute_Returns,
  Scheduler_Runner_GetNextRun,
  Scheduler_Runner_GetState_NextRun,
  Scheduler_Runner_GetState_Returns,
  Scheduler_Runner_History,
  Scheduler_Runner_LastError,
  Scheduler_Runner_RunCycle,
  Scheduler_Runner_Running,
  Scheduler_Runner_StartedAt,
  Scheduler_Runner_Totals,
  Scheduler_Runner_Trigger_ContainerIds,
  Scheduler_Runner_Trigger_Returns,
} from './types/scheduler.d.ts';

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
   * @param {Scheduler_Runner_Trigger_ContainerIds} [containerIds] - Container ids.
   *
   * @returns {Scheduler_Runner_Trigger_Returns}
   *
   * @since 0.0.1
   */
  public trigger(containerIds?: Scheduler_Runner_Trigger_ContainerIds): Scheduler_Runner_Trigger_Returns {
    if (this.#running === true) {
      return false;
    }

    this.#running = true;
    this.#startedAt = new Date().toISOString();

    void this.execute(containerIds);

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
      running: this.#running,
      startedAt: this.#startedAt,
      nextRun: (nextRun !== undefined) ? nextRun.toISOString() : undefined,
      lastReport: this.#history.list()[0],
      lastError: this.#lastError,
      totals: { ...this.#totals },
    };
  }

  /**
   * Scheduler - Execute.
   *
   * Runs one cycle, records its outcome, and always releases the lock,
   * so a crashed cycle never blocks the next one.
   *
   * @param {Scheduler_Runner_Execute_ContainerIds} containerIds - Container ids.
   *
   * @private
   *
   * @returns {Scheduler_Runner_Execute_Returns}
   *
   * @since 0.0.1
   */
  private async execute(containerIds: Scheduler_Runner_Execute_ContainerIds): Scheduler_Runner_Execute_Returns {
    try {
      const report: Scheduler_Runner_Execute_Report = await this.#runCycle(containerIds);

      this.#history.add(report);
      this.#lastError = undefined;
      Reflect.set(this.#totals, 'updated', this.#totals['updated'] + report['results'].filter((result) => result['status'] === 'updated').length);
      Reflect.set(this.#totals, 'failed', this.#totals['failed'] + report['results'].filter((result) => result['status'] === 'failed' || result['status'] === 'rolled-back').length);

      for (const result of report['results']) {
        process.stdout.write(`${result['container']} (${result['image']}): ${result['status']} - ${result['detail']}\n`);
      }
    } catch (error) {
      const errorMessage: Scheduler_Runner_Execute_ErrorMessage = (error instanceof Error) ? error['message'] : String(error);

      this.#lastError = errorMessage;

      process.stderr.write(`Update cycle failed: ${errorMessage}\n`);
    } finally {
      Reflect.set(this.#totals, 'cycles', this.#totals['cycles'] + 1);
      this.#running = false;
      this.#startedAt = undefined;
    }

    return;
  }
}

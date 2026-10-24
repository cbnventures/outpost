import {
  mkdirSync,
  readFileSync,
  renameSync,
  writeFileSync,
} from 'node:fs';
import { dirname } from 'node:path';

import { z } from 'zod';

import type {
  History_Runner_Add_Report,
  History_Runner_Add_Returns,
  History_Runner_Constructor_FilePath,
  History_Runner_Constructor_Limit,
  History_Runner_FilePath,
  History_Runner_Limit,
  History_Runner_List_Returns,
  History_Runner_Load_Parsed,
  History_Runner_Load_Returns,
  History_Runner_Reports,
  History_Runner_Save_ErrorMessage,
  History_Runner_Save_Returns,
  History_Runner_Save_TemporaryPath,
} from './types/history.d.ts';

/**
 * History - Reports Schema.
 *
 * Validates reports read back from disk so a hand-edited or truncated
 * history file can never crash the dashboard.
 *
 * @since 0.0.1
 */
const reportsSchema = z.array(z.object({
  startedAt: z.string(),
  finishedAt: z.string(),
  results: z.array(z.object({
    container: z.string(),
    image: z.string(),
    status: z.enum([
      'updated',
      'available',
      'up-to-date',
      'skipped',
      'rolled-back',
      'failed',
    ]),
    detail: z.string(),
  })),
}));

/**
 * History.
 *
 * Keeps the most recent update reports, newest first, in a JSON file on
 * the data volume so the dashboard shows past runs after a restart.
 *
 * @since 0.0.1
 */
export class Runner {
  /**
   * History - File Path.
   *
   * Location of the JSON file, normally /data/history.json inside the
   * container.
   *
   * @private
   *
   * @since 0.0.1
   */
  readonly #filePath: History_Runner_FilePath;

  /**
   * History - Limit.
   *
   * Maximum number of reports kept; older ones are dropped when a new
   * report is added.
   *
   * @private
   *
   * @since 0.0.1
   */
  readonly #limit: History_Runner_Limit;

  /**
   * History - Reports.
   *
   * Reports in memory, newest first, mirrored to the file after every
   * change.
   *
   * @private
   *
   * @since 0.0.1
   */
  #reports: History_Runner_Reports;

  /**
   * History - Constructor.
   *
   * Loads any existing history from disk. A missing or unreadable file
   * starts an empty history instead of failing startup.
   *
   * @param {History_Runner_Constructor_FilePath} filePath - File path.
   * @param {History_Runner_Constructor_Limit}    limit    - Limit.
   *
   * @since 0.0.1
   */
  public constructor(filePath: History_Runner_Constructor_FilePath, limit: History_Runner_Constructor_Limit) {
    this.#filePath = filePath;
    this.#limit = limit;
    this.#reports = this.load();

    return;
  }

  /**
   * History - Add.
   *
   * Records a finished report at the front of the history and saves the
   * file. Save failures are reported but never thrown.
   *
   * @param {History_Runner_Add_Report} report - Report.
   *
   * @returns {History_Runner_Add_Returns}
   *
   * @since 0.0.1
   */
  public add(report: History_Runner_Add_Report): History_Runner_Add_Returns {
    this.#reports = [
      report,
      ...this.#reports,
    ].slice(0, this.#limit);

    this.save();

    return;
  }

  /**
   * History - List.
   *
   * Returns a copy of the stored reports, newest first, for the
   * dashboard's history view.
   *
   * @returns {History_Runner_List_Returns}
   *
   * @since 0.0.1
   */
  public list(): History_Runner_List_Returns {
    return [...this.#reports];
  }

  /**
   * History - Load.
   *
   * Reads and validates the history file, returning an empty history
   * when it does not exist yet or cannot be parsed.
   *
   * @private
   *
   * @returns {History_Runner_Load_Returns}
   *
   * @since 0.0.1
   */
  private load(): History_Runner_Load_Returns {
    try {
      const parsed: History_Runner_Load_Parsed = reportsSchema.safeParse(JSON.parse(readFileSync(this.#filePath, 'utf-8')));

      return (parsed['success'] === true) ? parsed['data'].slice(0, this.#limit) : [];
    } catch {
      return [];
    }
  }

  /**
   * History - Save.
   *
   * Writes the history through a temporary file and a rename so a crash
   * mid-write never leaves a corrupt file behind.
   *
   * @private
   *
   * @returns {History_Runner_Save_Returns}
   *
   * @since 0.0.1
   */
  private save(): History_Runner_Save_Returns {
    const temporaryPath: History_Runner_Save_TemporaryPath = `${this.#filePath}.tmp`;

    try {
      mkdirSync(dirname(this.#filePath), { recursive: true });

      writeFileSync(temporaryPath, `${JSON.stringify(this.#reports, null, 2)}\n`);

      renameSync(temporaryPath, this.#filePath);
    } catch (error) {
      const errorMessage: History_Runner_Save_ErrorMessage = (error instanceof Error) ? error['message'] : String(error);

      process.stderr.write(`Could not save update history to "${this.#filePath}": ${errorMessage}\n`);
    }

    return;
  }
}

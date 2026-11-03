import {
  chmodSync,
  mkdirSync,
  readFileSync,
  renameSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { dirname } from 'node:path';

import { z } from 'zod';

import type {
  Handoff_Runner_Clear_Returns,
  Handoff_Runner_Constructor_FilePath,
  Handoff_Runner_FilePath,
  Handoff_Runner_Read_Parsed,
  Handoff_Runner_Read_Returns,
  Handoff_Runner_RecordOutcome_Current,
  Handoff_Runner_RecordOutcome_Outcome,
  Handoff_Runner_RecordOutcome_Returns,
  Handoff_Runner_Settle_FailedImageId,
  Handoff_Runner_Settle_Returns,
  Handoff_Runner_Write_FileMode,
  Handoff_Runner_Write_Handoff,
  Handoff_Runner_Write_Returns,
  Handoff_Runner_Write_TemporaryPath,
} from './types/handoff.d.ts';

/**
 * Handoff - Schema.
 *
 * Validates the self-update file on the data volume: the update a helper is
 * carrying out, and a new image that failed to start, which is skipped later.
 *
 * @since 1.0.0
 */
const handoffSchema = z.object({
  version: z.literal(1),
  failedImageId: z.string().optional(),
  pending: z.object({
    containerId: z.string(),
    containerName: z.string(),
    deadline: z.string(),
    helperName: z.string(),
    newImageId: z.string(),
    outcome: z.object({
      detail: z.string(),
      finishedAt: z.string(),
      status: z.enum([
        'failed',
        'rolled-back',
        'updated',
      ]),
    }).optional(),
    previousImageId: z.string(),
    reference: z.string(),
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
    startedAt: z.string(),
    trigger: z.enum([
      'api',
      'dashboard',
      'schedule',
      'startup',
    ]),
  }).optional(),
});

/**
 * Handoff.
 *
 * Keeps the self-update file that the outgoing Outpost, the helper container,
 * and the Outpost running afterwards share. Every write replaces the file.
 *
 * @since 1.0.0
 */
export class Runner {
  /**
   * Handoff - File Path.
   *
   * Where the self-update file lives, normally self-update.json on the
   * data volume so every Outpost container and the helper can reach it.
   *
   * @private
   *
   * @since 1.0.0
   */
  readonly #filePath: Handoff_Runner_FilePath;

  /**
   * Handoff - Constructor.
   *
   * Remembers where the file lives. Nothing is read until it is asked
   * for, because the helper and both Outposts change it in turn.
   *
   * @param {Handoff_Runner_Constructor_FilePath} filePath - File path.
   *
   * @since 1.0.0
   */
  public constructor(filePath: Handoff_Runner_Constructor_FilePath) {
    this.#filePath = filePath;

    return;
  }

  /**
   * Handoff - Read.
   *
   * Returns the file's contents, or undefined when it is missing, damaged,
   * or written by a version this Outpost doesn't know.
   *
   * @returns {Handoff_Runner_Read_Returns}
   *
   * @since 1.0.0
   */
  public read(): Handoff_Runner_Read_Returns {
    try {
      const parsed: Handoff_Runner_Read_Parsed = handoffSchema.safeParse(JSON.parse(readFileSync(this.#filePath, 'utf-8')));

      return (parsed['success'] === true) ? parsed['data'] : undefined;
    } catch {
      return undefined;
    }
  }

  /**
   * Handoff - Write.
   *
   * Replaces the file through a temporary file and a rename, so a reader
   * never sees half of it. Only Outpost's own user can read it.
   *
   * @param {Handoff_Runner_Write_Handoff} handoff - Handoff.
   *
   * @returns {Handoff_Runner_Write_Returns}
   *
   * @since 1.0.0
   */
  public write(handoff: Handoff_Runner_Write_Handoff): Handoff_Runner_Write_Returns {
    const temporaryPath: Handoff_Runner_Write_TemporaryPath = `${this.#filePath}.tmp`;
    const fileMode: Handoff_Runner_Write_FileMode = parseInt('600', 8);

    mkdirSync(dirname(this.#filePath), { recursive: true });

    writeFileSync(temporaryPath, `${JSON.stringify(handoff, null, 2)}\n`, { mode: fileMode });

    chmodSync(temporaryPath, fileMode);

    renameSync(temporaryPath, this.#filePath);

    return;
  }

  /**
   * Handoff - Record Outcome.
   *
   * Adds how the swap ended to the update in progress. The helper calls this
   * just before it exits; without an update in progress it does nothing.
   *
   * @param {Handoff_Runner_RecordOutcome_Outcome} outcome - Outcome.
   *
   * @returns {Handoff_Runner_RecordOutcome_Returns}
   *
   * @since 1.0.0
   */
  public recordOutcome(outcome: Handoff_Runner_RecordOutcome_Outcome): Handoff_Runner_RecordOutcome_Returns {
    const current: Handoff_Runner_RecordOutcome_Current = this.read();

    if (current === undefined || current['pending'] === undefined) {
      return;
    }

    this.write({
      ...current,
      pending: {
        ...current['pending'],
        outcome,
      },
    });

    return;
  }

  /**
   * Handoff - Settle.
   *
   * Ends the update in progress. A new image that failed to start is kept,
   * so the next checks skip it; with nothing to keep, the file is removed.
   *
   * @param {Handoff_Runner_Settle_FailedImageId} failedImageId - Failed image id.
   *
   * @returns {Handoff_Runner_Settle_Returns}
   *
   * @since 1.0.0
   */
  public settle(failedImageId: Handoff_Runner_Settle_FailedImageId): Handoff_Runner_Settle_Returns {
    if (failedImageId === undefined) {
      this.clear();

      return;
    }

    this.write({
      version: 1,
      failedImageId,
    });

    return;
  }

  /**
   * Handoff - Clear.
   *
   * Removes the file. Removing a file that is already gone is not an
   * error, so finishing twice is harmless.
   *
   * @returns {Handoff_Runner_Clear_Returns}
   *
   * @since 1.0.0
   */
  public clear(): Handoff_Runner_Clear_Returns {
    rmSync(this.#filePath, { force: true });

    return;
  }
}

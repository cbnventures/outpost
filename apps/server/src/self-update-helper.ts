import { join } from 'node:path';

import { DockerEngine } from 'outpost-package-docker-engine';
import { recreateContainer } from 'outpost-package-updater';

import { loadConfig } from './config.js';
import { Runner as Handoff } from './handoff.js';

import type {
  SelfUpdateHelper_Config,
  SelfUpdateHelper_ContainerId,
  SelfUpdateHelper_CurrentImage,
  SelfUpdateHelper_Engine,
  SelfUpdateHelper_ErrorMessage,
  SelfUpdateHelper_Handoff,
  SelfUpdateHelper_Inspected,
  SelfUpdateHelper_Outcome,
  SelfUpdateHelper_Reference,
  SelfUpdateHelper_Result,
} from './types/self-update-helper.d.ts';

/**
 * Self Update Helper - Config.
 *
 * Outpost's own settings, read from the environment it copied into this
 * helper, so the swap uses the same Docker host and timeouts.
 *
 * @since 1.0.0
 */
const config: SelfUpdateHelper_Config = loadConfig(process.env);

/**
 * Self Update Helper - Container ID.
 *
 * The Outpost container to swap, passed in by the Outpost that started
 * this helper.
 *
 * @since 1.0.0
 */
const containerId: SelfUpdateHelper_ContainerId = process.env['OUTPOST_SELF_UPDATE_CONTAINER'] ?? '';

/**
 * Self Update Helper - Reference.
 *
 * The image reference the new Outpost container runs, already pulled
 * by the Outpost that started this helper.
 *
 * @since 1.0.0
 */
const reference: SelfUpdateHelper_Reference = process.env['OUTPOST_SELF_UPDATE_REFERENCE'] ?? '';

/**
 * Self Update Helper - Engine.
 *
 * Docker Engine client for the same socket or host Outpost uses, which
 * the helper reaches through the same mount or network.
 *
 * @since 1.0.0
 */
const engine: SelfUpdateHelper_Engine = new DockerEngine(config['dockerHost']);

/**
 * Self Update Helper - Handoff.
 *
 * The self-update file on the data volume, where the helper writes how
 * the swap ended for the Outpost that runs afterwards.
 *
 * @since 1.0.0
 */
const handoff: SelfUpdateHelper_Handoff = new Handoff(join(config['dataDirectory'], 'self-update.json'));

/**
 * Self Update Helper - Outcome.
 *
 * How the swap ended. It stays "failed" unless the swap finishes,
 * so any early error is still recorded.
 *
 * @since 1.0.0
 */
let outcome: SelfUpdateHelper_Outcome = {
  status: 'failed',
  detail: 'The self-update helper stopped before it swapped Outpost',
};

try {
  if (containerId === '' || reference === '') {
    throw new Error('The self-update helper needs OUTPOST_SELF_UPDATE_CONTAINER and OUTPOST_SELF_UPDATE_REFERENCE.');
  }

  const inspected: SelfUpdateHelper_Inspected = await engine.inspectContainer(containerId);
  const currentImage: SelfUpdateHelper_CurrentImage = await engine.inspectImage(inspected['Image']);

  // The same swap every other container gets: stop, rename, start the new one, wait, or roll back.
  const result: SelfUpdateHelper_Result = await recreateContainer(inspected, (currentImage !== undefined) ? (currentImage['Config'] ?? undefined) : undefined, reference, config['updater'], {
    engine,
    sleep: async (milliseconds) => {
      await new Promise((resolve) => {
        setTimeout(resolve, milliseconds);

        return;
      });

      return;
    },
    now: () => new Date(),
  });

  outcome = {
    status: (result['status'] === 'updated' || result['status'] === 'rolled-back') ? result['status'] : 'failed',
    detail: result['detail'],
  };
} catch (error) {
  const errorMessage: SelfUpdateHelper_ErrorMessage = (error instanceof Error) ? error['message'] : String(error);

  outcome = {
    status: 'failed',
    detail: errorMessage,
  };
}

handoff.recordOutcome({
  ...outcome,
  finishedAt: new Date().toISOString(),
});

process.stdout.write(`Outpost self-update: ${outcome['status']} - ${outcome['detail']}\n`);

process.exitCode = (outcome['status'] === 'updated') ? 0 : 1;

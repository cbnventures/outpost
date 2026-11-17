import { buildCreatePlan } from './plan.js';

import type {
  Recreate_FirstHealthAnswerSeconds_Healthcheck,
  Recreate_FirstHealthAnswerSeconds_Interval,
  Recreate_FirstHealthAnswerSeconds_Returns,
  Recreate_FirstHealthAnswerSeconds_StartPeriod,
  Recreate_RecreateContainer_Container,
  Recreate_RecreateContainer_Created,
  Recreate_RecreateContainer_Dependencies,
  Recreate_RecreateContainer_Engine,
  Recreate_RecreateContainer_ErrorMessage,
  Recreate_RecreateContainer_HealthNote,
  Recreate_RecreateContainer_ImageConfig,
  Recreate_RecreateContainer_InitialRestartCount,
  Recreate_RecreateContainer_KeepErrorMessage,
  Recreate_RecreateContainer_KeptAt,
  Recreate_RecreateContainer_KeptName,
  Recreate_RecreateContainer_KeptTimestamp,
  Recreate_RecreateContainer_NewId,
  Recreate_RecreateContainer_Options,
  Recreate_RecreateContainer_Plan,
  Recreate_RecreateContainer_PreviousContainer,
  Recreate_RecreateContainer_PreviousHealth,
  Recreate_RecreateContainer_PreviousLookupErrorMessage,
  Recreate_RecreateContainer_PreviouslyUnhealthy,
  Recreate_RecreateContainer_PreviousName,
  Recreate_RecreateContainer_Reference,
  Recreate_RecreateContainer_Renamed,
  Recreate_RecreateContainer_Returns,
  Recreate_RecreateContainer_Rollback,
  Recreate_RecreateContainer_RollbackErrorMessage,
  Recreate_RecreateContainer_RollbackMessage,
  Recreate_WaitUntilHealthy_Deadline,
  Recreate_WaitUntilHealthy_Dependencies,
  Recreate_WaitUntilHealthy_FirstAnswerSeconds,
  Recreate_WaitUntilHealthy_HealthStatus,
  Recreate_WaitUntilHealthy_Id,
  Recreate_WaitUntilHealthy_InitialRestartCount,
  Recreate_WaitUntilHealthy_Inspected,
  Recreate_WaitUntilHealthy_Options,
  Recreate_WaitUntilHealthy_Poll,
  Recreate_WaitUntilHealthy_PreviouslyUnhealthy,
  Recreate_WaitUntilHealthy_RestartCount,
  Recreate_WaitUntilHealthy_Returns,
  Recreate_WaitUntilHealthy_SettleDeadline,
  Recreate_WaitUntilHealthy_SlowHealthcheck,
} from './types/recreate.d.ts';

/**
 * Recreate - Container.
 *
 * Swaps a container for one running the new image: stop, rename the old
 * one aside, create and start the replacement, then wait for it to stay
 * up (or become healthy). Any failure rolls back to the old container.
 *
 * @param {Recreate_RecreateContainer_Container}    container    - Container.
 * @param {Recreate_RecreateContainer_ImageConfig}  imageConfig  - Image config.
 * @param {Recreate_RecreateContainer_Reference}    reference    - Reference.
 * @param {Recreate_RecreateContainer_Options}      options      - Options.
 * @param {Recreate_RecreateContainer_Dependencies} dependencies - Dependencies.
 * @param {Recreate_RecreateContainer_Rollback}     [rollback]   - Rollback.
 *
 * @returns {Recreate_RecreateContainer_Returns}
 *
 * @since 0.0.1
 */
export async function recreateContainer(container: Recreate_RecreateContainer_Container, imageConfig: Recreate_RecreateContainer_ImageConfig, reference: Recreate_RecreateContainer_Reference, options: Recreate_RecreateContainer_Options, dependencies: Recreate_RecreateContainer_Dependencies, rollback: Recreate_RecreateContainer_Rollback = true): Recreate_RecreateContainer_Returns {
  const engine: Recreate_RecreateContainer_Engine = dependencies['engine'];
  const plan: Recreate_RecreateContainer_Plan = buildCreatePlan(container, imageConfig, reference);
  const previousName: Recreate_RecreateContainer_PreviousName = `${plan['name']}-outpost-previous`;
  const previousHealth: Recreate_RecreateContainer_PreviousHealth = container['State']['Health'] ?? undefined;
  let previousContainer: Recreate_RecreateContainer_PreviousContainer = undefined;

  // A crash can leave the reserved rollback name behind. Check before stopping anything so the operator can resolve it safely.
  try {
    previousContainer = await engine.inspectContainer(previousName);
  } catch (error) {
    const previousLookupErrorMessage: Recreate_RecreateContainer_PreviousLookupErrorMessage = (error instanceof Error) ? error['message'] : String(error);

    if (previousLookupErrorMessage.startsWith('Docker Engine API returned HTTP 404:') === false) {
      return {
        status: 'failed',
        detail: `Could not check for a leftover container named ${previousName} before updating ${plan['name']}: ${previousLookupErrorMessage}. Outpost did not stop or remove any container`,
      };
    }
  }

  if (previousContainer !== undefined) {
    return {
      status: 'failed',
      detail: `Cannot update ${plan['name']} because the leftover container ${previousName} (${previousContainer['Id']}) already uses Outpost's reserved rollback name. Remove or rename ${previousName}, then retry. Outpost did not stop or remove any container`,
      summary: `Reserved rollback name ${previousName} is already in use; remove or rename it, then retry`,
    };
  }

  // Rolling back to a container that was already unhealthy gains nothing, so its replacement only has to keep running.
  const previouslyUnhealthy: Recreate_RecreateContainer_PreviouslyUnhealthy = previousHealth !== undefined && previousHealth['Status'] === 'unhealthy';
  let renamed: Recreate_RecreateContainer_Renamed = false;
  let newId: Recreate_RecreateContainer_NewId = undefined;

  try {
    await engine.stopContainer(container['Id'], options['stopTimeoutSeconds']);

    await engine.renameContainer(container['Id'], previousName);

    renamed = true;

    newId = await engine.createContainer(plan['name'], plan['body']);

    for (const extraNetwork of plan['extraNetworks']) {
      await engine.connectNetwork(extraNetwork['name'], newId, extraNetwork['endpoint']);
    }

    const created: Recreate_RecreateContainer_Created = await engine.inspectContainer(newId);
    const initialRestartCount: Recreate_RecreateContainer_InitialRestartCount = created['RestartCount'] ?? 0;

    await engine.startContainer(newId);

    const healthNote: Recreate_RecreateContainer_HealthNote = await waitUntilHealthy(newId, initialRestartCount, previouslyUnhealthy, options, dependencies);

    await engine.removeContainer(container['Id']);

    return {
      status: 'updated',
      detail: `Recreated with ${reference}${healthNote}`,
    };
  } catch (error) {
    const errorMessage: Recreate_RecreateContainer_ErrorMessage = (error instanceof Error) ? error['message'] : String(error);

    if (rollback === false && newId !== undefined) {
      const keptAt: Recreate_RecreateContainer_KeptAt = dependencies.now().toISOString();
      const keptTimestamp: Recreate_RecreateContainer_KeptTimestamp = `${keptAt.slice(0, 4)}${keptAt.slice(5, 7)}${keptAt.slice(8, 13)}${keptAt.slice(14, 16)}${keptAt.slice(17, 19)}Z`;
      const keptName: Recreate_RecreateContainer_KeptName = `${plan['name']}-outpost-kept-${keptTimestamp}`;

      try {
        await engine.renameContainer(container['Id'], keptName);
      } catch (keepError) {
        const keepErrorMessage: Recreate_RecreateContainer_KeepErrorMessage = (keepError instanceof Error) ? keepError['message'] : String(keepError);

        return {
          status: 'failed',
          detail: `${errorMessage}; rollback was disabled, but Outpost could not move previous container ${container['Id']} (image ${container['Image']}) from ${previousName} to ${keptName}: ${keepErrorMessage}. Remove or rename ${previousName} before retrying`,
          summary: `Replacement failed and Outpost could not preserve the previous container as ${keptName}`,
        };
      }

      return {
        status: 'kept-unhealthy',
        detail: `${errorMessage}; rollback was disabled, so replacement container ${newId} was kept as Docker left it. Previous container ${container['Id']} (image ${container['Image']}) was renamed to ${keptName} and remains stopped; start or remove ${keptName} when recovery is complete`,
        summary: `Replacement failed its startup check; previous container kept as ${keptName}`,
      };
    }

    let rollbackMessage: Recreate_RecreateContainer_RollbackMessage = 'rolled back to the previous container';

    // Put the old container back exactly where it was.
    try {
      if (newId !== undefined) {
        await engine.removeContainer(newId);
      }

      if (renamed === true) {
        await engine.renameContainer(container['Id'], plan['name']);
      }

      await engine.startContainer(container['Id']);
    } catch (rollbackError) {
      const rollbackErrorMessage: Recreate_RecreateContainer_RollbackErrorMessage = (rollbackError instanceof Error) ? rollbackError['message'] : String(rollbackError);

      rollbackMessage = `rollback failed: ${rollbackErrorMessage}`;

      return {
        status: 'failed',
        detail: `${errorMessage}; ${rollbackMessage}`,
      };
    }

    return {
      status: 'rolled-back',
      detail: `${errorMessage}; ${rollbackMessage}`,
    };
  }
}

/**
 * Recreate - First Health Answer Seconds.
 *
 * Estimates when a healthcheck counts its first result: after the start
 * period, one interval in. Docker's interval defaults to 30 seconds.
 *
 * @param {Recreate_FirstHealthAnswerSeconds_Healthcheck} healthcheck - Healthcheck.
 *
 * @returns {Recreate_FirstHealthAnswerSeconds_Returns}
 *
 * @since 1.0.4
 */
function firstHealthAnswerSeconds(healthcheck: Recreate_FirstHealthAnswerSeconds_Healthcheck): Recreate_FirstHealthAnswerSeconds_Returns {
  const interval: Recreate_FirstHealthAnswerSeconds_Interval = (
    healthcheck !== undefined
    && healthcheck['Interval'] !== undefined
    && healthcheck['Interval'] > 0
  ) ? healthcheck['Interval'] : 30_000_000_000;
  const startPeriod: Recreate_FirstHealthAnswerSeconds_StartPeriod = (healthcheck !== undefined && healthcheck['StartPeriod'] !== undefined) ? healthcheck['StartPeriod'] : 0;

  return Math.ceil((startPeriod + interval) / 1_000_000_000);
}

/**
 * Recreate - Wait Until Healthy.
 *
 * Polls a freshly started container until it is healthy, or, with no usable
 * healthcheck verdict in time, still running after the settle period.
 *
 * @param {Recreate_WaitUntilHealthy_Id}                  id                  - Id.
 * @param {Recreate_WaitUntilHealthy_InitialRestartCount} initialRestartCount - Initial restart count.
 * @param {Recreate_WaitUntilHealthy_PreviouslyUnhealthy} previouslyUnhealthy - Previously unhealthy.
 * @param {Recreate_WaitUntilHealthy_Options}             options             - Options.
 * @param {Recreate_WaitUntilHealthy_Dependencies}        dependencies        - Dependencies.
 *
 * @returns {Recreate_WaitUntilHealthy_Returns}
 *
 * @since 0.0.1
 */
async function waitUntilHealthy(id: Recreate_WaitUntilHealthy_Id, initialRestartCount: Recreate_WaitUntilHealthy_InitialRestartCount, previouslyUnhealthy: Recreate_WaitUntilHealthy_PreviouslyUnhealthy, options: Recreate_WaitUntilHealthy_Options, dependencies: Recreate_WaitUntilHealthy_Dependencies): Recreate_WaitUntilHealthy_Returns {
  const deadline: Recreate_WaitUntilHealthy_Deadline = dependencies.now().getTime() + (options['healthTimeoutSeconds'] * 1000);
  const settleDeadline: Recreate_WaitUntilHealthy_SettleDeadline = dependencies.now().getTime() + (options['settleSeconds'] * 1000);

  /**
   * Recreate - Wait Until Healthy - Poll.
   *
   * Checks the container once and schedules the next check a second
   * later until it is settled, healthy, stopped, or out of time.
   *
   * @returns {Promise<Recreate_WaitUntilHealthy_HealthNote>}
   *
   * @since 0.0.1
   */
  const poll: Recreate_WaitUntilHealthy_Poll = async () => {
    const inspected: Recreate_WaitUntilHealthy_Inspected = await dependencies['engine'].inspectContainer(id);
    const restartCount: Recreate_WaitUntilHealthy_RestartCount = inspected['RestartCount'] ?? 0;

    if (inspected['State']['Restarting'] === true) {
      throw new Error('New container is restarting');
    }

    if (inspected['State']['Running'] === false || inspected['State']['Status'] !== 'running') {
      throw new Error(`New container is not running (${inspected['State']['Status']})`);
    }

    if (restartCount > initialRestartCount) {
      throw new Error(`New container restarted (restart count rose from ${String(initialRestartCount)} to ${String(restartCount)})`);
    }

    const healthStatus: Recreate_WaitUntilHealthy_HealthStatus = (inspected['State']['Health'] !== undefined && inspected['State']['Health'] !== null) ? inspected['State']['Health']['Status'] : undefined;
    const firstAnswerSeconds: Recreate_WaitUntilHealthy_FirstAnswerSeconds = firstHealthAnswerSeconds(inspected['Config']['Healthcheck'] ?? undefined);

    // A healthcheck that first answers after the timeout would roll back every update, however well the container runs.
    const slowHealthcheck: Recreate_WaitUntilHealthy_SlowHealthcheck = healthStatus === 'starting' && firstAnswerSeconds > options['healthTimeoutSeconds'];

    if (healthStatus === 'unhealthy' && previouslyUnhealthy === false) {
      throw new Error('New container is unhealthy');
    }

    if (healthStatus === 'healthy' || healthStatus === undefined) {
      if (healthStatus === 'healthy' || dependencies.now().getTime() >= settleDeadline) {
        return '';
      }
    } else if (
      (
        previouslyUnhealthy === true
        || slowHealthcheck === true
      )
      && dependencies.now().getTime() >= settleDeadline
    ) {
      return (previouslyUnhealthy === true) ? ` (kept while ${healthStatus}, since the previous container was already unhealthy)` : ` (kept while starting, since its healthcheck first answers about ${String(firstAnswerSeconds)}s after start, past the ${String(options['healthTimeoutSeconds'])}s health timeout)`;
    }

    if (dependencies.now().getTime() >= deadline) {
      throw new Error(`New container did not become healthy within ${String(options['healthTimeoutSeconds'])}s`);
    }

    await dependencies.sleep(1000);

    return poll();
  };

  return poll();
}

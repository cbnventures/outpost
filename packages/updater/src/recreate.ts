import { buildCreatePlan } from './plan.js';

import type {
  Recreate_RecreateContainer_Container,
  Recreate_RecreateContainer_Dependencies,
  Recreate_RecreateContainer_Engine,
  Recreate_RecreateContainer_ErrorMessage,
  Recreate_RecreateContainer_ImageConfig,
  Recreate_RecreateContainer_NewId,
  Recreate_RecreateContainer_Options,
  Recreate_RecreateContainer_Plan,
  Recreate_RecreateContainer_PreviousName,
  Recreate_RecreateContainer_Reference,
  Recreate_RecreateContainer_Renamed,
  Recreate_RecreateContainer_Returns,
  Recreate_RecreateContainer_RollbackErrorMessage,
  Recreate_RecreateContainer_RollbackMessage,
  Recreate_WaitUntilHealthy_Deadline,
  Recreate_WaitUntilHealthy_Dependencies,
  Recreate_WaitUntilHealthy_HealthStatus,
  Recreate_WaitUntilHealthy_Id,
  Recreate_WaitUntilHealthy_Inspected,
  Recreate_WaitUntilHealthy_Options,
  Recreate_WaitUntilHealthy_Poll,
  Recreate_WaitUntilHealthy_Returns,
  Recreate_WaitUntilHealthy_SettleDeadline,
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
 *
 * @returns {Recreate_RecreateContainer_Returns}
 *
 * @since 0.0.1
 */
export async function recreateContainer(container: Recreate_RecreateContainer_Container, imageConfig: Recreate_RecreateContainer_ImageConfig, reference: Recreate_RecreateContainer_Reference, options: Recreate_RecreateContainer_Options, dependencies: Recreate_RecreateContainer_Dependencies): Recreate_RecreateContainer_Returns {
  const engine: Recreate_RecreateContainer_Engine = dependencies['engine'];
  const plan: Recreate_RecreateContainer_Plan = buildCreatePlan(container, imageConfig, reference);
  const previousName: Recreate_RecreateContainer_PreviousName = `${plan['name']}-outpost-previous`;
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

    await engine.startContainer(newId);

    await waitUntilHealthy(newId, options, dependencies);

    await engine.removeContainer(container['Id']);

    return {
      status: 'updated',
      detail: `Recreated with ${reference}`,
    };
  } catch (error) {
    const errorMessage: Recreate_RecreateContainer_ErrorMessage = (error instanceof Error) ? error['message'] : String(error);
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
 * Recreate - Wait Until Healthy.
 *
 * Polls a freshly started container. Containers with a healthcheck must
 * report healthy before the timeout; others must still be running after
 * the settle period. Throws when either condition fails.
 *
 * @param {Recreate_WaitUntilHealthy_Id}           id           - Id.
 * @param {Recreate_WaitUntilHealthy_Options}      options      - Options.
 * @param {Recreate_WaitUntilHealthy_Dependencies} dependencies - Dependencies.
 *
 * @returns {Recreate_WaitUntilHealthy_Returns}
 *
 * @since 0.0.1
 */
async function waitUntilHealthy(id: Recreate_WaitUntilHealthy_Id, options: Recreate_WaitUntilHealthy_Options, dependencies: Recreate_WaitUntilHealthy_Dependencies): Recreate_WaitUntilHealthy_Returns {
  const deadline: Recreate_WaitUntilHealthy_Deadline = dependencies.now().getTime() + (options['healthTimeoutSeconds'] * 1000);
  const settleDeadline: Recreate_WaitUntilHealthy_SettleDeadline = dependencies.now().getTime() + (options['settleSeconds'] * 1000);

  /**
   * Recreate - Wait Until Healthy - Poll.
   *
   * Checks the container once and schedules the next check a second
   * later until it is settled, healthy, stopped, or out of time.
   *
   * @returns {Promise<void>}
   *
   * @since 0.0.1
   */
  const poll: Recreate_WaitUntilHealthy_Poll = async () => {
    const inspected: Recreate_WaitUntilHealthy_Inspected = await dependencies['engine'].inspectContainer(id);

    if (inspected['State']['Running'] === false) {
      throw new Error(`New container stopped (${inspected['State']['Status']})`);
    }

    const healthStatus: Recreate_WaitUntilHealthy_HealthStatus = (inspected['State']['Health'] !== undefined && inspected['State']['Health'] !== null) ? inspected['State']['Health']['Status'] : undefined;

    if (healthStatus === 'unhealthy') {
      throw new Error('New container is unhealthy');
    }

    if (
      healthStatus === 'healthy'
      || (
        healthStatus === undefined
        && dependencies.now().getTime() >= settleDeadline
      )
    ) {
      return;
    }

    if (dependencies.now().getTime() >= deadline) {
      throw new Error(`New container did not become healthy within ${String(options['healthTimeoutSeconds'])}s`);
    }

    await dependencies.sleep(1000);

    return poll();
  };

  await poll();

  return;
}

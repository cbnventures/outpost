import { ENABLE_LABEL } from 'outpost-package-updater';

import { logDebug } from './lib/logger.js';

import type {
  SelfUpdate_FinishSelfUpdate_CleanupErrorMessage,
  SelfUpdate_FinishSelfUpdate_CleanupNote,
  SelfUpdate_FinishSelfUpdate_Context,
  SelfUpdate_FinishSelfUpdate_Current,
  SelfUpdate_FinishSelfUpdate_Detail,
  SelfUpdate_FinishSelfUpdate_FailedImageId,
  SelfUpdate_FinishSelfUpdate_ImageNote,
  SelfUpdate_FinishSelfUpdate_Outcome,
  SelfUpdate_FinishSelfUpdate_Pending,
  SelfUpdate_FinishSelfUpdate_Returns,
  SelfUpdate_FinishSelfUpdate_Status,
  SelfUpdate_FinishSelfUpdate_StillRunning,
  SelfUpdate_FinishSelfUpdate_WaitDeadline,
  SelfUpdate_FinishSelfUpdate_Waited,
  SelfUpdate_FinishSelfUpdate_WaitSeconds,
  SelfUpdate_FinishSelfUpdate_WaitStartedAt,
  SelfUpdate_HandOver_Context,
  SelfUpdate_HandOver_Current,
  SelfUpdate_HandOver_Deadline,
  SelfUpdate_HandOver_ErrorMessage,
  SelfUpdate_HandOver_ExitCode,
  SelfUpdate_HandOver_HelperEnding,
  SelfUpdate_HandOver_HelperId,
  SelfUpdate_HandOver_HelperRan,
  SelfUpdate_HandOver_HelperStartedAt,
  SelfUpdate_HandOver_Name,
  SelfUpdate_HandOver_Outcome,
  SelfUpdate_HandOver_Plan,
  SelfUpdate_HandOver_Request,
  SelfUpdate_HandOver_Returns,
  SelfUpdate_HandOver_Row,
  SelfUpdate_HandOver_Trigger,
  SelfUpdate_MountBind_Mount,
  SelfUpdate_MountBind_Returns,
  SelfUpdate_MountBind_Source,
  SelfUpdate_PlanHelper_Binds,
  SelfUpdate_PlanHelper_ConfiguredDataMount,
  SelfUpdate_PlanHelper_Container,
  SelfUpdate_PlanHelper_DataMount,
  SelfUpdate_PlanHelper_HelperImage,
  SelfUpdate_PlanHelper_Identity,
  SelfUpdate_PlanHelper_LegacyDataMount,
  SelfUpdate_PlanHelper_Mounts,
  SelfUpdate_PlanHelper_Name,
  SelfUpdate_PlanHelper_Reference,
  SelfUpdate_PlanHelper_Returns,
  SelfUpdate_PlanHelper_Settings,
  SelfUpdate_PlanHelper_SocketMount,
  SelfUpdate_PlanHelper_SocketPath,
  SelfUpdate_ReadOutcome_File,
  SelfUpdate_ReadOutcome_Handoff,
  SelfUpdate_ReadOutcome_Returns,
  SelfUpdate_RemoveExitedHelpers_Engine,
  SelfUpdate_RemoveExitedHelpers_HelperName,
  SelfUpdate_RemoveExitedHelpers_Helpers,
  SelfUpdate_RemoveExitedHelpers_Returns,
  SelfUpdate_ShortImageId_ImageId,
  SelfUpdate_ShortImageId_Returns,
  SelfUpdate_WaitForExit_Context,
  SelfUpdate_WaitForExit_Deadline,
  SelfUpdate_WaitForExit_ErrorMessage,
  SelfUpdate_WaitForExit_Inspected,
  SelfUpdate_WaitForExit_Name,
  SelfUpdate_WaitForExit_Poll,
  SelfUpdate_WaitForExit_Returns,
  SelfUpdate_WaitForExit_StopAtDeadline,
} from './types/self-update.d.ts';

/**
 * Self Update - Helper Label.
 *
 * Label on every self-update helper container, holding the ID of the Outpost
 * container it swaps. Leftover helpers are found and removed by it.
 *
 * @since 1.0.0
 */
export const HELPER_LABEL = 'io.cbnventures.outpost.self-update-helper';

/**
 * Self Update - Plan Helper.
 *
 * Builds the helper container from the newly pulled image, with Outpost's data
 * and socket mounts, user, and network, but no ports. Returns the reason when
 * it can't.
 *
 * @param {SelfUpdate_PlanHelper_Container}   container   - Container.
 * @param {SelfUpdate_PlanHelper_HelperImage} helperImage - Helper image.
 * @param {SelfUpdate_PlanHelper_Reference}   reference   - Reference.
 * @param {SelfUpdate_PlanHelper_Settings}    settings    - Settings.
 *
 * @returns {SelfUpdate_PlanHelper_Returns}
 *
 * @since 1.0.0
 */
export function planHelper(container: SelfUpdate_PlanHelper_Container, helperImage: SelfUpdate_PlanHelper_HelperImage, reference: SelfUpdate_PlanHelper_Reference, settings: SelfUpdate_PlanHelper_Settings): SelfUpdate_PlanHelper_Returns {
  const name: SelfUpdate_PlanHelper_Name = container['Name'].replace('/', '');
  const mounts: SelfUpdate_PlanHelper_Mounts = container['Mounts'] ?? [];
  const configuredDataMount: SelfUpdate_PlanHelper_ConfiguredDataMount = mounts.find((mount) => mount['Destination'] === settings['dataDirectory']);
  const legacyDataMount: SelfUpdate_PlanHelper_LegacyDataMount = (configuredDataMount === undefined && settings['dataDirectory'] === '/config') ? mounts.find((mount) => mount['Destination'] === '/data') : undefined;
  const dataMount: SelfUpdate_PlanHelper_DataMount = configuredDataMount ?? legacyDataMount;

  // Recreating Outpost without its data volume would lose the account, tokens, and history.
  if (dataMount === undefined) {
    return `Outpost can't update itself because ${settings['dataDirectory']} isn't on a volume, so its account and history would be lost`;
  }

  const binds: SelfUpdate_PlanHelper_Binds = [mountBind(dataMount)];

  if (settings['dockerHost'].startsWith('unix://') === true) {
    const socketPath: SelfUpdate_PlanHelper_SocketPath = settings['dockerHost'].slice('unix://'.length);
    const socketMount: SelfUpdate_PlanHelper_SocketMount = mounts.find((mount) => mount['Destination'] === socketPath);

    if (socketMount === undefined) {
      return `Outpost can't update itself because the Docker socket at ${socketPath} isn't mounted from the host`;
    }

    binds.push(mountBind(socketMount));
  }

  const identity: SelfUpdate_PlanHelper_Identity = settings['identity'];

  return {
    name: `${name}-outpost-self-update`,
    body: {
      Image: helperImage,
      Entrypoint: [
        'node',
        'build/self-update-helper.js',
      ],
      Cmd: [],
      WorkingDir: '/app/apps/server',
      ...((identity['uid'] !== undefined && identity['gid'] !== undefined) ? { User: `${String(identity['uid'])}:${String(identity['gid'])}` } : {}),
      Env: [
        ...(container['Config']['Env'] ?? []).filter((entry) => (
          entry.startsWith('OUTPOST_DATA_DIRECTORY=') === false
          && entry.startsWith('OUTPOST_SELF_UPDATE_') === false
        )),
        `OUTPOST_DATA_DIRECTORY=${dataMount['Destination']}`,
        `OUTPOST_SELF_UPDATE_CONTAINER=${container['Id']}`,
        `OUTPOST_SELF_UPDATE_REFERENCE=${reference}`,
      ],
      Labels: {
        [ENABLE_LABEL]: 'false',
        [HELPER_LABEL]: container['Id'],
      },
      Healthcheck: { Test: ['NONE'] },
      HostConfig: {
        AutoRemove: false,
        Binds: binds,
        GroupAdd: identity['groups'].filter((group) => group !== identity['gid']).map((group) => String(group)),
        Init: true,
        NetworkMode: container['HostConfig']['NetworkMode'] ?? 'default',
        RestartPolicy: { Name: 'no' },
      },
    },
  };
}

/**
 * Self Update - Hand Over.
 *
 * Starts the helper that swaps Outpost's container and waits for it. The helper
 * normally stops this container first, which ends this process mid-wait.
 *
 * @param {SelfUpdate_HandOver_Request} request - Request.
 * @param {SelfUpdate_HandOver_Trigger} trigger - Trigger.
 * @param {SelfUpdate_HandOver_Context} context - Context.
 *
 * @returns {SelfUpdate_HandOver_Returns}
 *
 * @since 1.0.0
 */
export async function handOver(request: SelfUpdate_HandOver_Request, trigger: SelfUpdate_HandOver_Trigger, context: SelfUpdate_HandOver_Context): SelfUpdate_HandOver_Returns {
  const name: SelfUpdate_HandOver_Name = request['container']['Name'].replace('/', '');
  const current: SelfUpdate_HandOver_Current = context['handoff'].read();

  /**
   * Self Update - Hand Over - Row.
   *
   * Builds the result row for Outpost's own container, in the same
   * shape as every other container's row.
   *
   * @param {UpdateStatus} status - Status.
   * @param {string}       detail - Detail.
   *
   * @returns {UpdateResult}
   *
   * @since 1.0.0
   */
  const row: SelfUpdate_HandOver_Row = (status, detail) => ({
    container: name,
    image: request['reference'],
    status,
    detail,
  });

  if (current !== undefined && current['pending'] !== undefined) {
    return row('skipped', 'An earlier self-update hasn\'t finished');
  }

  if (current !== undefined && current['failedImageId'] === request['newImageId']) {
    return row('skipped', `The new image (${shortImageId(request['newImageId'])}) didn't start last time, so Outpost waits for a newer one`);
  }

  const plan: SelfUpdate_HandOver_Plan = planHelper(request['container'], request['newImageReference'], request['reference'], context['settings']);

  if (typeof plan === 'string') {
    return row('skipped', plan);
  }

  // Long enough for the helper to stop Outpost, start the new one, and wait for it to be healthy.
  const deadline: SelfUpdate_HandOver_Deadline = new Date(context.now().getTime() + ((context['settings']['stopTimeoutSeconds'] + context['settings']['healthTimeoutSeconds'] + 60) * 1000)).toISOString();

  context['handoff'].write({
    version: 1,
    ...((current !== undefined && current['failedImageId'] !== undefined) ? { failedImageId: current['failedImageId'] } : {}),
    pending: {
      containerId: request['container']['Id'],
      containerName: name,
      deadline,
      helperName: plan['name'],
      newImageId: request['newImageId'],
      previousImageId: request['container']['Image'],
      reference: request['reference'],
      results: request['results'],
      startedAt: request['startedAt'],
      trigger,
    },
  });

  let helperId: SelfUpdate_HandOver_HelperId = undefined;

  try {
    // A helper left over from an earlier attempt would keep the name taken.
    await context['engine'].removeContainer(plan['name']);

    helperId = await context['engine'].createContainer(plan['name'], plan['body']);

    await context['engine'].startContainer(helperId);
  } catch (error) {
    const errorMessage: SelfUpdate_HandOver_ErrorMessage = (error instanceof Error) ? error['message'] : String(error);

    if (helperId !== undefined) {
      await context['engine'].removeContainer(helperId).catch(() => undefined);
    }

    context['handoff'].settle((current !== undefined) ? current['failedImageId'] : undefined);

    return row('failed', `Couldn't start the self-update helper: ${errorMessage}`);
  }

  const helperStartedAt: SelfUpdate_HandOver_HelperStartedAt = context.now().getTime();

  logDebug('self-update', `Started helper ${plan['name']} to move ${name} to image ${shortImageId(request['newImageId'])}`);

  // Reaching the end of this wait means the helper stopped without swapping Outpost.
  const exitCode: SelfUpdate_HandOver_ExitCode = await waitForExit(helperId, deadline, true, context);
  const outcome: SelfUpdate_HandOver_Outcome = readOutcome(context['handoff']);
  const helperRan: SelfUpdate_HandOver_HelperRan = context.now().getTime() - helperStartedAt;
  let helperEnding: SelfUpdate_HandOver_HelperEnding = 'was gone';

  if (exitCode !== undefined) {
    helperEnding = `stopped with exit code ${String(exitCode)}`;
  } else if (context.now().getTime() >= Date.parse(deadline)) {
    helperEnding = 'was stopped at its deadline';
  }

  logDebug('self-update', `Helper ${plan['name']} ${helperEnding} after ${String(helperRan)} ms, before replacing Outpost`);

  await context['engine'].removeContainer(helperId).catch(() => undefined);

  context['handoff'].settle((current !== undefined) ? current['failedImageId'] : undefined);

  if (outcome === undefined) {
    return row('failed', (exitCode === undefined) ? 'The self-update helper didn\'t finish in time' : `The self-update helper stopped before it finished (exit code ${String(exitCode)})`);
  }

  return row(outcome['status'], outcome['detail']);
}

/**
 * Self Update - Finish Self Update.
 *
 * Run by the Outpost that is running after a swap, new or restored. It waits for
 * the helper without stopping it, then builds the cycle's single report with
 * Outpost's own row.
 *
 * @param {SelfUpdate_FinishSelfUpdate_Pending} pending - Pending.
 * @param {SelfUpdate_FinishSelfUpdate_Context} context - Context.
 *
 * @returns {SelfUpdate_FinishSelfUpdate_Returns}
 *
 * @since 1.0.0
 */
export async function finishSelfUpdate(pending: SelfUpdate_FinishSelfUpdate_Pending, context: SelfUpdate_FinishSelfUpdate_Context): SelfUpdate_FinishSelfUpdate_Returns {
  const current: SelfUpdate_FinishSelfUpdate_Current = context['handoff'].read();
  const waitStartedAt: SelfUpdate_FinishSelfUpdate_WaitStartedAt = context.now().getTime();

  // Counted from this Outpost's start, since a slow host can use up the hand-over deadline before the new container boots.
  const waitSeconds: SelfUpdate_FinishSelfUpdate_WaitSeconds = context['settings']['stopTimeoutSeconds'] + context['settings']['healthTimeoutSeconds'] + 60;
  const waitDeadline: SelfUpdate_FinishSelfUpdate_WaitDeadline = new Date(waitStartedAt + (waitSeconds * 1000)).toISOString();

  logDebug('self-update', `Waiting for helper ${pending['helperName']} to finish moving ${pending['containerName']} to image ${shortImageId(pending['newImageId'])}`);

  await waitForExit(pending['helperName'], waitDeadline, false, context);

  const outcome: SelfUpdate_FinishSelfUpdate_Outcome = readOutcome(context['handoff']);
  const waited: SelfUpdate_FinishSelfUpdate_Waited = context.now().getTime() - waitStartedAt;
  const stillRunning: SelfUpdate_FinishSelfUpdate_StillRunning = outcome === undefined && context.now().getTime() >= Date.parse(waitDeadline);
  let failedImageId: SelfUpdate_FinishSelfUpdate_FailedImageId = (current !== undefined) ? current['failedImageId'] : undefined;
  let status: SelfUpdate_FinishSelfUpdate_Status = 'failed';
  let detail: SelfUpdate_FinishSelfUpdate_Detail = `The self-update helper stopped before it finished; see docker logs ${pending['helperName']}`;

  if (stillRunning === true) {
    logDebug('self-update', `Helper ${pending['helperName']} was still running after ${String(waited)} ms, so it was left to finish`);

    detail = `The self-update helper was still running after ${String(waitSeconds)}s, so Outpost left it to finish; see docker logs ${pending['helperName']}`;
  } else if (outcome === undefined) {
    logDebug('self-update', `Helper ${pending['helperName']} ended after ${String(waited)} ms without saying how the swap went`);
  } else {
    logDebug('self-update', `Helper ${pending['helperName']} reported ${outcome['status']} after ${String(waited)} ms`);
  }

  if (outcome !== undefined && outcome['status'] === 'updated') {
    let cleanupNote: SelfUpdate_FinishSelfUpdate_CleanupNote = '';
    const imageNote: SelfUpdate_FinishSelfUpdate_ImageNote = (outcome['previousImageMetadataAvailable'] === false) ? ' (previous image metadata was unavailable, so its defaults were carried over)' : '';

    // Remove the helper before cleaning the outgoing image after the swap.
    await context['engine'].removeContainer(pending['helperName']).catch(() => undefined);

    if (context['settings']['cleanup'] === true) {
      try {
        await context['engine'].removeImage(pending['previousImageId']);
      } catch (error) {
        const cleanupErrorMessage: SelfUpdate_FinishSelfUpdate_CleanupErrorMessage = (error instanceof Error) ? error['message'] : String(error);

        cleanupNote = ` (warning: could not remove the previous image: ${cleanupErrorMessage})`;
      }
    }

    status = 'updated';
    detail = `${outcome['detail']}${imageNote}${cleanupNote}`;
    failedImageId = undefined;
  } else if (outcome !== undefined && outcome['status'] === 'rolled-back') {
    await context['engine'].removeContainer(pending['helperName']).catch(() => undefined);

    status = 'rolled-back';
    detail = outcome['detail'];
    failedImageId = pending['newImageId'];
  } else if (outcome !== undefined) {
    // The helper is kept so its log shows what went wrong.
    detail = `${outcome['detail']}; see docker logs ${pending['helperName']}`;
    failedImageId = pending['newImageId'];
  }

  context['handoff'].settle(failedImageId);

  return {
    startedAt: pending['startedAt'],
    finishedAt: (outcome !== undefined) ? outcome['finishedAt'] : context.now().toISOString(),
    results: [
      ...pending['results'],
      {
        container: pending['containerName'],
        image: pending['reference'],
        status,
        detail,
      },
    ],
  };
}

/**
 * Self Update - Read Outcome.
 *
 * Returns how the helper said the swap ended, or undefined when no update
 * is in progress or the helper hasn't written it yet.
 *
 * @param {SelfUpdate_ReadOutcome_Handoff} handoff - Handoff.
 *
 * @returns {SelfUpdate_ReadOutcome_Returns}
 *
 * @since 1.0.0
 */
function readOutcome(handoff: SelfUpdate_ReadOutcome_Handoff): SelfUpdate_ReadOutcome_Returns {
  const file: SelfUpdate_ReadOutcome_File = handoff.read();

  if (file === undefined || file['pending'] === undefined) {
    return undefined;
  }

  return file['pending']['outcome'];
}

/**
 * Self Update - Remove Exited Helpers.
 *
 * Removes helper containers that have stopped, such as one kept after a
 * failed update. Running helpers are left alone.
 *
 * @param {SelfUpdate_RemoveExitedHelpers_Engine} engine - Engine.
 *
 * @returns {SelfUpdate_RemoveExitedHelpers_Returns}
 *
 * @since 1.0.0
 */
export async function removeExitedHelpers(engine: SelfUpdate_RemoveExitedHelpers_Engine): SelfUpdate_RemoveExitedHelpers_Returns {
  const helpers: SelfUpdate_RemoveExitedHelpers_Helpers = await engine.listContainersByLabel(HELPER_LABEL);

  for (const helper of helpers) {
    if (helper['State'] !== 'running') {
      const helperName: SelfUpdate_RemoveExitedHelpers_HelperName = (helper['Names'][0] ?? helper['Id']).replace('/', '');

      await engine.removeContainer(helper['Id']);

      logDebug('self-update', `Removed the stopped helper ${helperName}`);
    }
  }

  return;
}

/**
 * Self Update - Wait For Exit.
 *
 * Polls a container once a second until it stops, and returns its exit code.
 * Past the deadline it returns undefined, stopping the container first only
 * when asked to.
 *
 * @param {SelfUpdate_WaitForExit_Name}           name           - Name.
 * @param {SelfUpdate_WaitForExit_Deadline}       deadline       - Deadline.
 * @param {SelfUpdate_WaitForExit_StopAtDeadline} stopAtDeadline - Stop at deadline.
 * @param {SelfUpdate_WaitForExit_Context}        context        - Context.
 *
 * @returns {SelfUpdate_WaitForExit_Returns}
 *
 * @since 1.0.0
 */
async function waitForExit(name: SelfUpdate_WaitForExit_Name, deadline: SelfUpdate_WaitForExit_Deadline, stopAtDeadline: SelfUpdate_WaitForExit_StopAtDeadline, context: SelfUpdate_WaitForExit_Context): SelfUpdate_WaitForExit_Returns {
  /**
   * Self Update - Wait For Exit - Poll.
   *
   * Checks the container once and schedules the next check a second
   * later, until it stops, disappears, or the deadline passes.
   *
   * @returns {Promise<number | undefined>}
   *
   * @since 1.0.0
   */
  const poll: SelfUpdate_WaitForExit_Poll = async () => {
    let inspected: SelfUpdate_WaitForExit_Inspected = undefined;

    try {
      inspected = await context['engine'].inspectContainer(name);
    } catch (error) {
      const errorMessage: SelfUpdate_WaitForExit_ErrorMessage = (error instanceof Error) ? error['message'] : String(error);

      // A container that is gone leaves nothing to wait for. Any other error, such as a busy Docker host, is checked again.
      if (errorMessage.startsWith('Docker Engine API returned HTTP 404:') === true) {
        return undefined;
      }
    }

    if (inspected !== undefined && inspected['State']['Running'] === false) {
      return inspected['State']['ExitCode'];
    }

    if (context.now().getTime() >= Date.parse(deadline)) {
      if (stopAtDeadline === true) {
        await context['engine'].stopContainer(name, 10).catch(() => undefined);
      }

      return undefined;
    }

    await context.sleep(1000);

    return poll();
  };

  return poll();
}

/**
 * Self Update - Mount Bind.
 *
 * Turns one of Outpost's mounts into a bind for the helper: a named volume
 * by name, anything else by its host path.
 *
 * @param {SelfUpdate_MountBind_Mount} mount - Mount.
 *
 * @returns {SelfUpdate_MountBind_Returns}
 *
 * @since 1.0.0
 */
function mountBind(mount: SelfUpdate_MountBind_Mount): SelfUpdate_MountBind_Returns {
  const source: SelfUpdate_MountBind_Source = (mount['Type'] === 'volume' && mount['Name'] !== undefined) ? mount['Name'] : (mount['Source'] ?? '');

  return `${source}:${mount['Destination']}`;
}

/**
 * Self Update - Short Image ID.
 *
 * Shortens an image ID to its first 12 characters, as Docker shows
 * image IDs.
 *
 * @param {SelfUpdate_ShortImageId_ImageId} imageId - Image id.
 *
 * @returns {SelfUpdate_ShortImageId_Returns}
 *
 * @since 1.0.0
 */
function shortImageId(imageId: SelfUpdate_ShortImageId_ImageId): SelfUpdate_ShortImageId_Returns {
  return imageId.replace('sha256:', '').slice(0, 12);
}

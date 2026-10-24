import { sendNotification } from 'outpost-package-notifiers';
import { encodeRegistryAuth, fetchRemoteDigest, parseImageReference } from 'outpost-package-registry';

import { recreateContainer } from './recreate.js';
import {
  MONITOR_ONLY_LABEL,
  selectContainers,
  sortByDependencies,
} from './select.js';

import type {
  Run_CheckContainer_Container,
  Run_CheckContainer_Credentials,
  Run_CheckContainer_CurrentImage,
  Run_CheckContainer_Dependencies,
  Run_CheckContainer_Engine,
  Run_CheckContainer_ImageNote,
  Run_CheckContainer_Inspected,
  Run_CheckContainer_MonitorOnly,
  Run_CheckContainer_Name,
  Run_CheckContainer_NetworkMode,
  Run_CheckContainer_Options,
  Run_CheckContainer_Outcome,
  Run_CheckContainer_PulledImage,
  Run_CheckContainer_Reference,
  Run_CheckContainer_RemoteDigest,
  Run_CheckContainer_Returns,
  Run_CheckContainer_Target,
  Run_NotifyReport_Changed,
  Run_NotifyReport_Dependencies,
  Run_NotifyReport_Errors,
  Run_NotifyReport_Failed,
  Run_NotifyReport_Lines,
  Run_NotifyReport_Noun,
  Run_NotifyReport_Options,
  Run_NotifyReport_Report,
  Run_NotifyReport_Returns,
  Run_NotifyReport_Title,
  Run_RunUpdateCycle_Candidates,
  Run_RunUpdateCycle_ContainerIds,
  Run_RunUpdateCycle_Containers,
  Run_RunUpdateCycle_Dependencies,
  Run_RunUpdateCycle_ErrorMessage,
  Run_RunUpdateCycle_Options,
  Run_RunUpdateCycle_Ordered,
  Run_RunUpdateCycle_Report,
  Run_RunUpdateCycle_Result,
  Run_RunUpdateCycle_Results,
  Run_RunUpdateCycle_Returns,
  Run_RunUpdateCycle_Selection,
  Run_RunUpdateCycle_StartedAt,
} from './types/run.d.ts';

/**
 * Run - Update Cycle.
 *
 * Checks the selected containers (or only the given IDs) one at a time
 * in dependency order. Failures are recorded instead of stopping the
 * cycle, and the report is sent to the notification targets.
 *
 * @param {Run_RunUpdateCycle_Options}      options        - Options.
 * @param {Run_RunUpdateCycle_Dependencies} dependencies   - Dependencies.
 * @param {Run_RunUpdateCycle_ContainerIds} [containerIds] - Container ids.
 *
 * @returns {Run_RunUpdateCycle_Returns}
 *
 * @since 0.0.1
 */
export async function runUpdateCycle(options: Run_RunUpdateCycle_Options, dependencies: Run_RunUpdateCycle_Dependencies, containerIds?: Run_RunUpdateCycle_ContainerIds): Run_RunUpdateCycle_Returns {
  const startedAt: Run_RunUpdateCycle_StartedAt = dependencies.now().toISOString();
  const containers: Run_RunUpdateCycle_Containers = await dependencies['engine'].listContainers();
  const selection: Run_RunUpdateCycle_Selection = selectContainers(containers, options);

  // A targeted run (from the dashboard) only checks the requested containers.
  const candidates: Run_RunUpdateCycle_Candidates = (containerIds === undefined) ? selection['candidates'] : selection['candidates'].filter((candidate) => containerIds.some((containerId) => candidate['Id'].startsWith(containerId)));
  const ordered: Run_RunUpdateCycle_Ordered = sortByDependencies(candidates);
  const results: Run_RunUpdateCycle_Results = (containerIds === undefined) ? [...selection['skipped']] : [];

  for (const container of ordered) {
    let result: Run_RunUpdateCycle_Result = undefined;

    try {
      result = await checkContainer(container, options, dependencies);
    } catch (error) {
      const errorMessage: Run_RunUpdateCycle_ErrorMessage = (error instanceof Error) ? error['message'] : String(error);

      result = {
        container: (container['Names'][0] ?? container['Id']).replace('/', ''),
        image: container['Image'],
        status: 'failed',
        detail: errorMessage,
      };
    }

    results.push(result);
  }

  const report: Run_RunUpdateCycle_Report = {
    startedAt,
    finishedAt: dependencies.now().toISOString(),
    results,
  };

  await notifyReport(report, options, dependencies);

  return report;
}

/**
 * Run - Check Container.
 *
 * Decides whether one container has a newer image. The registry digest
 * is compared first so up-to-date containers are never pulled; if the
 * registry cannot be asked, the image is pulled and its ID compared.
 *
 * @param {Run_CheckContainer_Container}    container    - Container.
 * @param {Run_CheckContainer_Options}      options      - Options.
 * @param {Run_CheckContainer_Dependencies} dependencies - Dependencies.
 *
 * @returns {Run_CheckContainer_Returns}
 *
 * @since 0.0.1
 */
async function checkContainer(container: Run_CheckContainer_Container, options: Run_CheckContainer_Options, dependencies: Run_CheckContainer_Dependencies): Run_CheckContainer_Returns {
  const engine: Run_CheckContainer_Engine = dependencies['engine'];
  const inspected: Run_CheckContainer_Inspected = await engine.inspectContainer(container['Id']);
  const name: Run_CheckContainer_Name = inspected['Name'].replace('/', '');
  const reference: Run_CheckContainer_Reference = inspected['Config']['Image'] ?? container['Image'];
  const networkMode: Run_CheckContainer_NetworkMode = inspected['HostConfig']['NetworkMode'] ?? '';

  // The container list shows an image ID once the tag moves, so pinning is judged from the config.
  if (reference.includes('@') === true || reference.startsWith('sha256:') === true) {
    return {
      container: name,
      image: reference,
      status: 'skipped',
      detail: 'Image is pinned to a digest or ID',
    };
  }

  if (networkMode.startsWith('container:') === true) {
    return {
      container: name,
      image: reference,
      status: 'skipped',
      detail: 'Shares another container\'s network namespace',
    };
  }

  const target: Run_CheckContainer_Target = parseImageReference(reference);
  const credentials: Run_CheckContainer_Credentials = dependencies.findCredentials(options['dockerConfigPath'], target['registry']);
  const currentImage: Run_CheckContainer_CurrentImage = await engine.inspectImage(inspected['Image']);
  let remoteDigest: Run_CheckContainer_RemoteDigest = undefined;

  try {
    remoteDigest = await fetchRemoteDigest(reference, credentials, dependencies['fetchFunction']);
  } catch {
    // Fall back to pulling and comparing image IDs.
    remoteDigest = undefined;
  }

  if (
    remoteDigest !== undefined
    && currentImage !== undefined
    && (currentImage['RepoDigests'] ?? []).some((repoDigest) => repoDigest.endsWith(`@${remoteDigest}`)) === true
  ) {
    return {
      container: name,
      image: reference,
      status: 'up-to-date',
      detail: remoteDigest,
    };
  }

  const monitorOnly: Run_CheckContainer_MonitorOnly = options['monitorOnly'] === true || (inspected['Config']['Labels'] ?? {})[MONITOR_ONLY_LABEL] === 'true';

  if (monitorOnly === true && remoteDigest !== undefined) {
    return {
      container: name,
      image: reference,
      status: 'available',
      detail: `New digest ${remoteDigest}`,
    };
  }

  await engine.pullImage(reference, encodeRegistryAuth(credentials, target['registry']));

  const pulledImage: Run_CheckContainer_PulledImage = await engine.inspectImage(reference);

  if (pulledImage === undefined || pulledImage['Id'] === inspected['Image']) {
    return {
      container: name,
      image: reference,
      status: 'up-to-date',
      detail: 'Pulled image matches the running image',
    };
  }

  if (monitorOnly === true) {
    return {
      container: name,
      image: reference,
      status: 'available',
      detail: `New image ${pulledImage['Id']}`,
    };
  }

  const outcome: Run_CheckContainer_Outcome = await recreateContainer(inspected, (currentImage !== undefined) ? (currentImage['Config'] ?? undefined) : undefined, reference, options, dependencies);

  if (outcome['status'] === 'updated' && options['cleanup'] === true) {
    await engine.removeImage(inspected['Image']);
  }

  // Without the old image's config, its defaults (such as env) cannot be told apart from user settings.
  const imageNote: Run_CheckContainer_ImageNote = (outcome['status'] === 'updated' && currentImage === undefined) ? ' (previous image metadata was unavailable, so its defaults were carried over)' : '';

  return {
    container: name,
    image: reference,
    status: outcome['status'],
    detail: `${outcome['detail']}${imageNote}`,
  };
}

/**
 * Run - Notify Report.
 *
 * Sends one summary notification when a cycle updated, found, or failed
 * something. Quiet cycles do not notify.
 *
 * @param {Run_NotifyReport_Report}       report       - Report.
 * @param {Run_NotifyReport_Options}      options      - Options.
 * @param {Run_NotifyReport_Dependencies} dependencies - Dependencies.
 *
 * @returns {Run_NotifyReport_Returns}
 *
 * @since 0.0.1
 */
async function notifyReport(report: Run_NotifyReport_Report, options: Run_NotifyReport_Options, dependencies: Run_NotifyReport_Dependencies): Run_NotifyReport_Returns {
  const changed: Run_NotifyReport_Changed = report['results'].filter((result) => result['status'] !== 'up-to-date' && result['status'] !== 'skipped');

  if (changed.length === 0) {
    return;
  }

  const failed: Run_NotifyReport_Failed = changed.some((result) => result['status'] === 'failed' || result['status'] === 'rolled-back');
  const lines: Run_NotifyReport_Lines = changed.map((result) => `${result['container']} (${result['image']}): ${result['status']} - ${result['detail']}`);
  const noun: Run_NotifyReport_Noun = (changed.length === 1) ? 'container needs' : 'containers need';
  const title: Run_NotifyReport_Title = `Outpost: ${String(changed.length)} ${noun} attention`;
  const errors: Run_NotifyReport_Errors = await sendNotification(options['notificationTargets'], {
    title,
    message: lines.join('\n'),
    tags: [(failed === true) ? 'warning' : 'whale'],
    priority: (failed === true) ? 'high' : 'default',
    payload: report,
  }, dependencies['fetchFunction']);

  // Delivery problems never affect the cycle, but they are logged so they can be fixed.
  for (const error of errors) {
    process.stderr.write(`${error}\n`);
  }

  return;
}

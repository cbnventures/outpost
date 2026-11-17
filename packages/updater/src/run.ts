import {
  encodeRegistryAuth,
  fetchRemoteDigest,
  parseImageReference,
} from 'outpost-package-registry';

import { recreateContainer } from './recreate.js';
import {
  MONITOR_ONLY_LABEL,
  selectContainers,
  sortByDependencies,
} from './select.js';

import type {
  Run_CheckContainer_CleanupErrorMessage,
  Run_CheckContainer_CleanupNote,
  Run_CheckContainer_Container,
  Run_CheckContainer_CredentialCache,
  Run_CheckContainer_Credentials,
  Run_CheckContainer_CurrentImage,
  Run_CheckContainer_Cycle,
  Run_CheckContainer_Dependencies,
  Run_CheckContainer_Engine,
  Run_CheckContainer_ImageConfig,
  Run_CheckContainer_ImageNote,
  Run_CheckContainer_Inspected,
  Run_CheckContainer_LiveImageConfig,
  Run_CheckContainer_Lookup,
  Run_CheckContainer_LookupError,
  Run_CheckContainer_LookupStatus,
  Run_CheckContainer_MonitorOnly,
  Run_CheckContainer_Name,
  Run_CheckContainer_NetworkMode,
  Run_CheckContainer_NewImageReference,
  Run_CheckContainer_Options,
  Run_CheckContainer_Origin,
  Run_CheckContainer_Outcome,
  Run_CheckContainer_PulledImage,
  Run_CheckContainer_PulledImageConfig,
  Run_CheckContainer_RecoveryNote,
  Run_CheckContainer_Reference,
  Run_CheckContainer_RejectedImage,
  Run_CheckContainer_RejectedRemoteImage,
  Run_CheckContainer_RemoteDigest,
  Run_CheckContainer_Returns,
  Run_CheckContainer_Summary,
  Run_CheckContainer_TaggedImage,
  Run_CheckContainer_Target,
  Run_ImageOrigin_Builds,
  Run_ImageOrigin_Descriptor,
  Run_ImageOrigin_Identity,
  Run_ImageOrigin_Image,
  Run_ImageOrigin_Pulls,
  Run_ImageOrigin_RepoDigests,
  Run_ImageOrigin_Returns,
  Run_ManualRecoveryDetail_Container,
  Run_ManualRecoveryDetail_EnvironmentVariables,
  Run_ManualRecoveryDetail_ExposedPorts,
  Run_ManualRecoveryDetail_Mounts,
  Run_ManualRecoveryDetail_Networks,
  Run_ManualRecoveryDetail_Returns,
  Run_ManualRecoveryDetail_Summary,
  Run_RunUpdateCycle_Action,
  Run_RunUpdateCycle_Candidates,
  Run_RunUpdateCycle_ContainerIds,
  Run_RunUpdateCycle_Containers,
  Run_RunUpdateCycle_CredentialCache,
  Run_RunUpdateCycle_CycleLabel,
  Run_RunUpdateCycle_Dependencies,
  Run_RunUpdateCycle_ErrorMessage,
  Run_RunUpdateCycle_IsSelf,
  Run_RunUpdateCycle_Options,
  Run_RunUpdateCycle_Ordered,
  Run_RunUpdateCycle_Report,
  Run_RunUpdateCycle_Result,
  Run_RunUpdateCycle_Results,
  Run_RunUpdateCycle_Returns,
  Run_RunUpdateCycle_Rollback,
  Run_RunUpdateCycle_Selection,
  Run_RunUpdateCycle_Sorted,
  Run_RunUpdateCycle_StartedAt,
} from './types/run.d.ts';

/**
 * Run - Update Cycle.
 *
 * Checks or updates the selected containers (or only the given IDs) one at a
 * time in dependency order. Update cycles put Outpost's own last since
 * updating it restarts Outpost. Failures are recorded in the returned report.
 *
 * @param {Run_RunUpdateCycle_Options}      options        - Options.
 * @param {Run_RunUpdateCycle_Dependencies} dependencies   - Dependencies.
 * @param {Run_RunUpdateCycle_ContainerIds} [containerIds] - Container ids.
 * @param {Run_RunUpdateCycle_Action}       [action]       - Action.
 * @param {Run_RunUpdateCycle_Rollback}     [rollback]     - Rollback.
 *
 * @returns {Run_RunUpdateCycle_Returns}
 *
 * @since 1.1.0
 */
export async function runUpdateCycle(options: Run_RunUpdateCycle_Options, dependencies: Run_RunUpdateCycle_Dependencies, containerIds?: Run_RunUpdateCycle_ContainerIds, action: Run_RunUpdateCycle_Action = 'update', rollback: Run_RunUpdateCycle_Rollback = true): Run_RunUpdateCycle_Returns {
  const startedAt: Run_RunUpdateCycle_StartedAt = dependencies.now().toISOString();
  let report: Run_RunUpdateCycle_Report = undefined;

  try {
    // Each registry's sign-in is read once per cycle, the first time a container needs it.
    const credentialCache: Run_RunUpdateCycle_CredentialCache = new Map();
    const containers: Run_RunUpdateCycle_Containers = await dependencies['engine'].listContainers();
    const selection: Run_RunUpdateCycle_Selection = selectContainers(containers, options);

    if (dependencies['pruneImageConfigs'] !== undefined) {
      await dependencies.pruneImageConfigs();
    }

    // A targeted API or dashboard run only operates on the requested containers.
    const candidates: Run_RunUpdateCycle_Candidates = (containerIds === undefined) ? selection['candidates'] : selection['candidates'].filter((candidate) => containerIds.some((containerId) => candidate['Id'].startsWith(containerId)));
    const sorted: Run_RunUpdateCycle_Sorted = sortByDependencies(candidates);

    /**
     * Run - Run Update Cycle - Is Self.
     *
     * Reports whether a container is Outpost's own. That container is
     * checked last, after every other one.
     *
     * @param {Shared_ContainerSummary} container - Container.
     *
     * @returns {boolean}
     *
     * @since 1.0.0
     */
    const isSelf: Run_RunUpdateCycle_IsSelf = (container) => options['selfId'] !== undefined && container['Id'].startsWith(options['selfId']) === true;
    const ordered: Run_RunUpdateCycle_Ordered = [
      ...sorted.filter((container) => isSelf(container) === false),
      ...sorted.filter((container) => isSelf(container) === true),
    ];
    const results: Run_RunUpdateCycle_Results = (containerIds === undefined) ? [...selection['skipped']] : [];

    for (const container of ordered) {
      let result: Run_RunUpdateCycle_Result = undefined;

      try {
        result = await checkContainer(container, options, dependencies, credentialCache, {
          action,
          rollback,
          results,
          startedAt,
          targeted: containerIds !== undefined,
        });
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

    report = {
      startedAt,
      finishedAt: dependencies.now().toISOString(),
      results,
    };
  } catch (error) {
    const errorMessage: Run_RunUpdateCycle_ErrorMessage = (error instanceof Error) ? error['message'] : String(error);
    const cycleLabel: Run_RunUpdateCycle_CycleLabel = (action === 'check') ? 'Check cycle' : 'Update cycle';

    report = {
      startedAt,
      finishedAt: dependencies.now().toISOString(),
      error: errorMessage,
      results: [{
        container: 'Outpost',
        image: cycleLabel.toLowerCase(),
        status: 'failed',
        detail: `${cycleLabel} failed: ${errorMessage}`,
      }],
    };
  }

  return report;
}

/**
 * Run - Check Container.
 *
 * Decides whether one container has a newer image: its registry first, then
 * a pull. Built images, Outpost's own container, and an image this container
 * was rolled back from are left to other steps or skipped.
 *
 * @param {Run_CheckContainer_Container}       container       - Container.
 * @param {Run_CheckContainer_Options}         options         - Options.
 * @param {Run_CheckContainer_Dependencies}    dependencies    - Dependencies.
 * @param {Run_CheckContainer_CredentialCache} credentialCache - Credential cache.
 * @param {Run_CheckContainer_Cycle}           cycle           - Cycle.
 *
 * @returns {Run_CheckContainer_Returns}
 *
 * @since 0.0.1
 */
async function checkContainer(container: Run_CheckContainer_Container, options: Run_CheckContainer_Options, dependencies: Run_CheckContainer_Dependencies, credentialCache: Run_CheckContainer_CredentialCache, cycle: Run_CheckContainer_Cycle): Run_CheckContainer_Returns {
  const engine: Run_CheckContainer_Engine = dependencies['engine'];
  const inspected: Run_CheckContainer_Inspected = await engine.inspectContainer(container['Id']);
  const name: Run_CheckContainer_Name = inspected['Name'].replace('/', '');
  const reference: Run_CheckContainer_Reference = inspected['Config']['Image'] ?? container['Image'];
  const networkMode: Run_CheckContainer_NetworkMode = inspected['HostConfig']['NetworkMode'] ?? '';

  if (
    cycle['action'] === 'update'
    && cycle['rollback'] === false
    && options['selfId'] !== undefined
    && inspected['Id'].startsWith(options['selfId']) === true
  ) {
    return {
      container: name,
      image: reference,
      status: 'failed',
      detail: 'Rollback cannot be disabled when updating Outpost itself',
    };
  }

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

  if (inspected['HostConfig']['AutoRemove'] === true) {
    return {
      container: name,
      image: reference,
      status: 'skipped',
      detail: 'Container is configured for automatic removal',
    };
  }

  const currentImage: Run_CheckContainer_CurrentImage = await engine.inspectImage(inspected['Image']);
  const liveImageConfig: Run_CheckContainer_LiveImageConfig = (currentImage !== undefined) ? (currentImage['Config'] ?? undefined) : undefined;
  let imageConfig: Run_CheckContainer_ImageConfig = liveImageConfig;

  if (liveImageConfig !== undefined && dependencies['rememberImageConfig'] !== undefined) {
    dependencies.rememberImageConfig(inspected['Image'], liveImageConfig);
  }

  if (imageConfig === undefined && dependencies['findImageConfig'] !== undefined) {
    imageConfig = dependencies.findImageConfig(inspected['Image']);
  }

  const origin: Run_CheckContainer_Origin = (currentImage !== undefined) ? imageOrigin(currentImage) : 'unknown';

  // No registry has an image Docker built here, even one that shares its name.
  if (origin === 'built') {
    return {
      container: name,
      image: reference,
      status: 'skipped',
      detail: 'Image is locally built or has no published registry digest',
    };
  }

  const target: Run_CheckContainer_Target = parseImageReference(reference);
  let credentials: Run_CheckContainer_Credentials = credentialCache.get(target['registry']);

  if (credentialCache.has(target['registry']) === false) {
    credentials = dependencies.findCredentials(target['registry']);

    credentialCache.set(target['registry'], credentials);
  }

  let remoteDigest: Run_CheckContainer_RemoteDigest = undefined;
  let lookupStatus: Run_CheckContainer_LookupStatus = undefined;
  let lookupError: Run_CheckContainer_LookupError = undefined;

  try {
    const lookup: Run_CheckContainer_Lookup = await fetchRemoteDigest(reference, credentials, dependencies['fetchFunction']);

    remoteDigest = lookup['digest'];
    lookupStatus = lookup['status'];
  } catch (error) {
    lookupError = (error instanceof Error) ? error['message'] : String(error);

    // An update cycle can fall back to pulling and comparing image IDs.
    remoteDigest = undefined;
  }

  // The registry has nothing under this name, for an image Docker can't place.
  if (
    (
      lookupStatus === 'not-found'
      || lookupStatus === 'denied'
    )
    && origin === 'unknown'
  ) {
    return {
      container: name,
      image: reference,
      status: 'skipped',
      detail: (lookupStatus === 'denied') ? 'Image is locally built, or its registry needs credentials Outpost doesn\'t have' : 'Image is locally built or has no published registry digest',
    };
  }

  // On Docker's containerd image store, an image's ID is its registry digest.
  if (
    remoteDigest !== undefined
    && currentImage !== undefined
    && (
      currentImage['Id'] === remoteDigest
      || (currentImage['RepoDigests'] ?? []).some((repoDigest) => repoDigest.endsWith(`@${remoteDigest}`)) === true
    )
  ) {
    return {
      container: name,
      image: reference,
      status: 'up-to-date',
      detail: remoteDigest,
    };
  }

  const rejectedImage: Run_CheckContainer_RejectedImage = dependencies.findRejectedImage(name);
  let rejectedRemoteImage: Run_CheckContainer_RejectedRemoteImage = false;

  if (rejectedImage !== undefined && remoteDigest !== undefined) {
    if (rejectedImage['imageId'] === remoteDigest) {
      rejectedRemoteImage = true;
    } else {
      const taggedImage: Run_CheckContainer_TaggedImage = await engine.inspectImage(reference);

      rejectedRemoteImage = taggedImage !== undefined
        && taggedImage['Id'] === rejectedImage['imageId']
        && (taggedImage['RepoDigests'] ?? []).some((repoDigest) => repoDigest.endsWith(`@${remoteDigest}`));
    }
  }

  // A check cycle is deliberately registry-only: it never pulls or mutates Docker state.
  if (cycle['action'] === 'check') {
    if (remoteDigest !== undefined) {
      if (rejectedRemoteImage === true) {
        return {
          container: name,
          image: reference,
          status: 'held',
          detail: 'Rolled back last time; waiting for a newer image. Update this container with rollback disabled to keep and inspect the rejected image',
        };
      }

      return {
        container: name,
        image: reference,
        status: 'available',
        detail: `New digest ${remoteDigest}`,
      };
    }

    let detail: Run_CheckContainer_LookupError = lookupError;

    if (detail === undefined) {
      if (lookupStatus === 'denied') {
        detail = 'Registry denied the digest check';
      } else if (lookupStatus === 'not-found') {
        detail = 'Registry image was not found';
      } else {
        detail = 'Registry did not return an image digest';
      }
    }

    return {
      container: name,
      image: reference,
      status: 'failed',
      detail,
    };
  }

  // Bulk updates and ordinary targeted updates leave a rejected remote image
  // untouched. Only the explicit one-container no-rollback path retries it.
  if (rejectedRemoteImage === true && cycle['rollback'] !== false) {
    return {
      container: name,
      image: reference,
      status: 'held',
      detail: 'Rolled back last time; waiting for a newer image. Update this container with rollback disabled to keep and inspect the rejected image',
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
    const pulledImageConfig: Run_CheckContainer_PulledImageConfig = (pulledImage !== undefined) ? (pulledImage['Config'] ?? undefined) : undefined;

    if (pulledImageConfig !== undefined && dependencies['rememberImageConfig'] !== undefined) {
      dependencies.rememberImageConfig(inspected['Image'], pulledImageConfig);
    }

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

  // Outpost can't stop itself and still watch its replacement, so a helper container swaps it.
  if (options['selfId'] !== undefined && inspected['Id'].startsWith(options['selfId']) === true) {
    if (dependencies['updateSelf'] === undefined) {
      return {
        container: name,
        image: reference,
        status: 'skipped',
        detail: 'Outpost doesn\'t update itself in this setup',
      };
    }

    const newImageReference: Run_CheckContainer_NewImageReference = (pulledImage['RepoDigests'] ?? [])[0] ?? pulledImage['Id'];

    return dependencies.updateSelf({
      container: inspected,
      newImageId: pulledImage['Id'],
      newImageReference,
      reference,
      results: [...cycle['results']],
      startedAt: cycle['startedAt'],
    });
  }

  // Only an explicit no-rollback update retries an image that Outpost already rejected.
  if (
    rejectedImage !== undefined
    && rejectedImage['imageId'] === pulledImage['Id']
    && cycle['rollback'] !== false
  ) {
    return {
      container: name,
      image: reference,
      status: 'held',
      detail: `Rolled back last time; waiting for a newer image (${pulledImage['Id'].replace('sha256:', '').slice(0, 12)}). Update this container with rollback disabled to keep and inspect the rejected image`,
    };
  }

  const outcome: Run_CheckContainer_Outcome = await recreateContainer(inspected, imageConfig, reference, options, dependencies, cycle['rollback']);
  let cleanupNote: Run_CheckContainer_CleanupNote = '';

  if (outcome['status'] === 'updated' || outcome['status'] === 'kept-unhealthy') {
    const pulledImageConfig: Run_CheckContainer_PulledImageConfig = pulledImage['Config'] ?? undefined;

    if (pulledImageConfig !== undefined && dependencies['rememberImageConfig'] !== undefined) {
      dependencies.rememberImageConfig(pulledImage['Id'], pulledImageConfig);
    }

    if (dependencies['pruneImageConfigs'] !== undefined) {
      await dependencies.pruneImageConfigs();
    }
  }

  if (outcome['status'] === 'rolled-back' || outcome['status'] === 'kept-unhealthy') {
    dependencies.rememberRejectedImage(name, pulledImage['Id']);
  }

  if (outcome['status'] === 'updated') {
    dependencies.forgetRejectedImage(name);
  }

  if (
    outcome['status'] === 'updated'
    && options['cleanup'] === true
    && cycle['rollback'] !== false
  ) {
    try {
      await engine.removeImage(inspected['Image']);
    } catch (error) {
      const cleanupErrorMessage: Run_CheckContainer_CleanupErrorMessage = (error instanceof Error) ? error['message'] : String(error);

      cleanupNote = ` (warning: could not remove the previous image: ${cleanupErrorMessage})`;
    }
  }

  // Without the old image's config, its defaults (such as env) cannot be told apart from user settings.
  const imageNote: Run_CheckContainer_ImageNote = (outcome['status'] === 'updated' && imageConfig === undefined) ? ' (previous image metadata was unavailable, so its defaults were carried over)' : '';
  const recoveryNote: Run_CheckContainer_RecoveryNote = (cycle['rollback'] === false) ? manualRecoveryDetail(inspected) : '';
  const summary: Run_CheckContainer_Summary = outcome['summary'] ?? ((cycle['rollback'] === false) ? outcome['detail'] : undefined);

  return {
    container: name,
    image: reference,
    status: outcome['status'],
    detail: `${outcome['detail']}${imageNote}${cleanupNote}${recoveryNote}`,
    ...((summary === undefined) ? {} : { summary }),
  };
}

/**
 * Run - Manual Recovery Detail.
 *
 * Records enough non-secret configuration to identify the previous container
 * and image after a run that deliberately kept a failed replacement.
 *
 * @param {Run_ManualRecoveryDetail_Container} container - Container.
 *
 * @returns {Run_ManualRecoveryDetail_Returns}
 *
 * @since 1.1.0
 */
function manualRecoveryDetail(container: Run_ManualRecoveryDetail_Container): Run_ManualRecoveryDetail_Returns {
  const environmentVariables: Run_ManualRecoveryDetail_EnvironmentVariables = (container['Config']['Env'] ?? []).map((entry) => entry.split('=', 1)[0] ?? '').filter((name) => name !== '');
  const exposedPorts: Run_ManualRecoveryDetail_ExposedPorts = Object.keys(container['Config']['ExposedPorts'] ?? {});
  const mounts: Run_ManualRecoveryDetail_Mounts = (container['Mounts'] ?? []).map((mount) => mount['Destination']);
  const networks: Run_ManualRecoveryDetail_Networks = Object.keys(container['NetworkSettings']['Networks'] ?? {});
  const summary: Run_ManualRecoveryDetail_Summary = {
    configuredImage: container['Config']['Image'] ?? '',
    containerId: container['Id'],
    environmentVariables,
    exposedPorts,
    mounts,
    name: container['Name'].replace('/', ''),
    networks,
  };

  return `; rollback was disabled for this run; previous image ID: ${container['Image']}; previous container config summary: ${JSON.stringify(summary)}`;
}

/**
 * Run - Image Origin.
 *
 * Says whether Docker pulled an image or built it here. Docker 29 records it
 * as the image's identity; before that, only classic Docker's registry
 * digests tell, and an image neither explains is unknown.
 *
 * @param {Run_ImageOrigin_Image} image - Image.
 *
 * @returns {Run_ImageOrigin_Returns}
 *
 * @since 1.0.0
 */
function imageOrigin(image: Run_ImageOrigin_Image): Run_ImageOrigin_Returns {
  const identity: Run_ImageOrigin_Identity = image['Identity'] ?? undefined;
  const pulls: Run_ImageOrigin_Pulls = (identity !== undefined) ? (identity['Pull'] ?? []) : [];
  const builds: Run_ImageOrigin_Builds = (identity !== undefined) ? (identity['Build'] ?? []) : [];
  const repoDigests: Run_ImageOrigin_RepoDigests = image['RepoDigests'] ?? [];
  const descriptor: Run_ImageOrigin_Descriptor = image['Descriptor'] ?? undefined;

  // A local build that was pushed lists both, and its registry can be asked like any other.
  if (pulls.length > 0) {
    return 'pulled';
  }

  if (builds.length > 0) {
    return 'built';
  }

  // Classic Docker records a registry digest that differs from the image ID for every image it pulled.
  if (repoDigests.some((repoDigest) => repoDigest.endsWith(`@${image['Id']}`) === false) === true) {
    return 'pulled';
  }

  // It records none for a local build. The containerd image store, which adds a descriptor, leaves none on an untagged image too.
  if (repoDigests.length === 0 && descriptor === undefined) {
    return 'built';
  }

  return 'unknown';
}

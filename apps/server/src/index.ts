import { join } from 'node:path';

import { Cron } from 'croner';
import { DockerEngine } from 'outpost-package-docker-engine';
import {
  runUpdateCycle,
  selectContainers,
} from 'outpost-package-updater';

import { createApp } from './app.js';
import {
  applyRuntimeSettings,
  defaultRuntimeSettings,
  loadConfig,
} from './config.js';
import { Runner as Handoff } from './handoff.js';
import { Runner as History } from './history.js';
import {
  pruneImageConfigs,
  resolveImageConfig,
  Runner as ImageConfigCache,
} from './image-config-cache.js';
import { timedEngine, timedFetch } from './lib/debug-timing.js';
import { isDebugLogging, logInfo, setDebugLogging } from './lib/logger.js';
import { Runner as Notifier } from './lib/notifier.js';
import { Runner as State } from './lib/state.js';
import {
  Runner as Scheduler,
  scheduledCycleAction,
} from './scheduler.js';
import {
  finishSelfUpdate,
  handOver,
  removeExitedHelpers,
} from './self-update.js';

import type {
  Index_App,
  Index_CheckReport,
  Index_Config,
  Index_Engine,
  Index_Handoff,
  Index_History,
  Index_ImageConfigCache,
  Index_Job,
  Index_ManagedContainers,
  Index_ModeSuffix,
  Index_NextRun,
  Index_NextRunAt,
  Index_NextRunLabel,
  Index_Notifier,
  Index_PendingSelfUpdate,
  Index_Report,
  Index_Scheduler,
  Index_SelfContainer,
  Index_SelfUpdateContext,
  Index_SetupClaim,
  Index_StartupContainers,
  Index_State,
} from './types/index.d.ts';

/**
 * Index - Config.
 *
 * Settings validated from the environment. Startup stops here with a
 * readable message when a value is invalid.
 *
 * @since 0.0.1
 */
const config: Index_Config = loadConfig(process.env);

/**
 * Index - Engine.
 *
 * Docker Engine client for the mounted socket (or DOCKER_HOST), shared
 * by every update cycle.
 *
 * @since 0.0.1
 */
const engine: Index_Engine = timedEngine(new DockerEngine(config['dockerHost']));

await engine.ping();

/**
 * Index - Handoff.
 *
 * The self-update file on the data volume. It holds a check that an earlier
 * Outpost handed to the helper, and a new image that failed to start.
 *
 * @since 1.0.0
 */
const handoff: Index_Handoff = new Handoff(join(config['dataDirectory'], 'self-update.json'));

/**
 * Index - Image Config Cache.
 *
 * Image defaults saved on the data volume let recreation distinguish image
 * defaults from user settings after Docker removes an old image record.
 *
 * @since 1.1.0
 */
const imageConfigCache: Index_ImageConfigCache = new ImageConfigCache(join(config['dataDirectory'], 'image-config-cache.json'));

try {
  await pruneImageConfigs(imageConfigCache, engine, handoff);

  const startupContainers: Index_StartupContainers = await engine.listContainers();
  const managedContainers: Index_ManagedContainers = selectContainers(startupContainers, config['updater'])['candidates'];
  const selfContainer: Index_SelfContainer = (config['updater']['selfId'] === undefined) ? undefined : managedContainers.find((container) => container['Id'].startsWith(config['updater']['selfId'] ?? ''));

  if (selfContainer !== undefined) {
    await resolveImageConfig(selfContainer['ImageID'], engine, imageConfigCache);
  }
} catch {
  // A check retries cache maintenance without preventing the dashboard from starting.
}

/**
 * Index - History.
 *
 * The last 50 update reports, kept on the data volume so the dashboard
 * shows past runs after a restart.
 *
 * @since 0.0.1
 */
const history: Index_History = new History(join(config['dataDirectory'], 'history.json'), 50);

/**
 * Index - State.
 *
 * The SQLite store on the data volume for the dashboard account, sessions,
 * sign-in methods, and access tokens. An old account.json is moved into it.
 *
 * @since 1.0.0
 */
const state: Index_State = new State(config['dataDirectory'], undefined, config['databaseDirectory'], config['installationKeyFile']);

applyRuntimeSettings(config, state.getRuntimeSettings(defaultRuntimeSettings));

setDebugLogging(state.getDebugLogging());

/**
 * Index - Notifier.
 *
 * Sends notifications to the destinations set up on the dashboard. A lost
 * encryption key is reported here, once, after the state removes what it sealed.
 *
 * @since 1.0.0
 */
const notifier: Index_Notifier = new Notifier(state);

notifier.notifySecretsRemoved(state.getKeyReplacement());

/**
 * Index - Setup Claim.
 *
 * One-time code that creates the account, printed to the container log
 * while no account exists. Every start prints a new one.
 *
 * @since 1.0.0
 */
const setupClaim: Index_SetupClaim = state.prepareSetupClaim();

/**
 * Index - Self Update Context.
 *
 * What the self-update steps need: Docker, the self-update file, timing,
 * and the user, groups, and mounts the helper container copies.
 *
 * @since 1.0.0
 */
const selfUpdateContext: Index_SelfUpdateContext = {
  engine,
  handoff,
  now: () => new Date(),
  settings: {
    cleanup: config['updater']['cleanup'],
    dataDirectory: config['dataDirectory'],
    dockerHost: config['dockerHost'],
    healthTimeoutSeconds: config['updater']['healthTimeoutSeconds'],
    identity: {
      gid: (process.getgid !== undefined) ? process.getgid() : undefined,
      groups: (process.getgroups !== undefined) ? process.getgroups() : [],
      uid: (process.getuid !== undefined) ? process.getuid() : undefined,
    },
    stopTimeoutSeconds: config['updater']['stopTimeoutSeconds'],
  },
  sleep: async (milliseconds) => {
    await new Promise((resolve) => {
      setTimeout(resolve, milliseconds);

      return;
    });

    return;
  },
};

/**
 * Index - Scheduler.
 *
 * Serializes update cycles started by the schedule, the API, and the
 * dashboard so two cycles never touch the same container at once.
 *
 * @since 0.0.1
 */
const scheduler: Index_Scheduler = new Scheduler(async (containerIds, source, action, rollback) => {
  const report: Index_Report = await runUpdateCycle(config['updater'], {
    engine,
    fetchFunction: timedFetch(fetch),
    sleep: selfUpdateContext['sleep'],
    now: () => new Date(),
    findCredentials: (registry) => state.findRegistryCredentials(registry),
    findRejectedImage: (container) => state.findRejectedImage(container),
    findImageConfig: (imageId) => imageConfigCache.find(imageId),
    rememberRejectedImage: (container, imageId) => state.rememberRejectedImage(container, imageId),
    rememberImageConfig: (imageId, imageConfig) => imageConfigCache.remember(imageId, imageConfig),
    forgetRejectedImage: (container) => state.forgetRejectedImage(container),
    pruneImageConfigs: async () => {
      try {
        await pruneImageConfigs(imageConfigCache, engine, handoff);
      } catch {
        // Cache maintenance never prevents a container check or update.
      }

      return;
    },
    updateSelf: async (request) => handOver(request, source, selfUpdateContext),
  }, containerIds, action, rollback);

  const checkReport: Index_CheckReport = {
    ...report,
    action,
    ...((action === 'update' && rollback === false) ? { rollback: false } : {}),
    trigger: source,
  };

  notifier.notifyUpdateReport(checkReport);

  return report;
}, history, () => {
  // A callback-less Cron only computes times; it never schedules anything.
  const nextRun: Index_NextRun = new Cron(config['schedule']).nextRun();

  return (nextRun !== null) ? nextRun : undefined;
});

/**
 * Index - Pending Self Update.
 *
 * A check an earlier Outpost started before handing itself to the helper.
 * This Outpost, new or restored, finishes it and records one report.
 *
 * @since 1.0.0
 */
const pendingSelfUpdate: Index_PendingSelfUpdate = (handoff.read() ?? { version: 1 })['pending'];

if (pendingSelfUpdate !== undefined) {
  scheduler.resume(pendingSelfUpdate['trigger'], pendingSelfUpdate['startedAt'], async () => {
    const report: Index_Report = await finishSelfUpdate(pendingSelfUpdate, selfUpdateContext);

    notifier.notifyUpdateReport(report);

    return report;
  });
} else {
  removeExitedHelpers(engine).catch(() => undefined);
}

/**
 * Index - Job.
 *
 * Cron job that triggers a cycle on the saved schedule (six fields, with
 * seconds; daily at 04:00 by default). Saving settings replaces this job.
 *
 * @since 0.0.1
 */
let job: Index_Job = new Cron(config['schedule'], () => {
  scheduler.trigger('schedule', undefined, scheduledCycleAction(config['updater']['monitorOnly']));

  return;
});

/**
 * Index - App.
 *
 * HTTP server for the dashboard, its API, first-run setup, health checks,
 * and the Watchtower-style endpoints. Listens on 22601 inside the container.
 *
 * @since 0.0.1
 */
const app: Index_App = createApp({
  config,
  history,
  inspectContainer: async (id) => engine.inspectContainer(id),
  listContainers: async () => engine.listContainers(),
  notifier,
  onRuntimeSettingsChanged: () => {
    Reflect.set(selfUpdateContext['settings'], 'cleanup', config['updater']['cleanup']);
    Reflect.set(selfUpdateContext['settings'], 'healthTimeoutSeconds', config['updater']['healthTimeoutSeconds']);
    Reflect.set(selfUpdateContext['settings'], 'stopTimeoutSeconds', config['updater']['stopTimeoutSeconds']);

    job.stop();

    job = new Cron(config['schedule'], () => {
      scheduler.trigger('schedule', undefined, scheduledCycleAction(config['updater']['monitorOnly']));

      return;
    });

    scheduler.refresh();

    return;
  },
  scheduler,
  state,
});

app.listen(config['port'], (error) => {
  if (error !== undefined) {
    throw error;
  }

  const nextRunAt: Index_NextRunAt = job.nextRun();
  const nextRunLabel: Index_NextRunLabel = (nextRunAt !== null) ? nextRunAt.toISOString() : 'never';
  const modeSuffix: Index_ModeSuffix = (config['updater']['monitorOnly'] === true) ? ', monitor only' : '';

  logInfo('server', `Dashboard: http://localhost:${String(config['port'])}/admin/`);
  logInfo('server', `Schedule: ${config['schedule']} (next run ${nextRunLabel})`);
  logInfo('server', `Mode: ${config['updater']['labelMode']}${modeSuffix}`);

  if (isDebugLogging() === true) {
    logInfo('server', 'Debug logging is on.');
  }

  if (setupClaim !== undefined) {
    logInfo('server', 'No account exists yet. Open the dashboard to create it with the setup code.');
    logInfo('server', `Setup code: ${setupClaim['code']}`);
    logInfo('server', `Setup code expires: ${setupClaim['expiresAt']}`);
  }

  // A check finished after a self-update counts as this start's check.
  if (config['runOnStart'] === true && pendingSelfUpdate === undefined) {
    scheduler.trigger('startup', undefined, scheduledCycleAction(config['updater']['monitorOnly']));
  }

  return;
});

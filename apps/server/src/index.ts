import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { Cron } from 'croner';
import { DockerEngine } from 'outpost-package-docker-engine';
import { findCredentials } from 'outpost-package-registry';
import { runUpdateCycle } from 'outpost-package-updater';

import { createAdminRouter } from './admin.js';
import { createApp } from './app.js';
import { loadConfig } from './config.js';
import { Runner as History } from './history.js';
import { Runner as Scheduler } from './scheduler.js';
import { Runner as Sessions } from './session.js';

import type {
  Index_App,
  Index_Config,
  Index_Engine,
  Index_History,
  Index_Job,
  Index_LockedSuffix,
  Index_ModeSuffix,
  Index_NextRun,
  Index_NextRunAt,
  Index_NextRunLabel,
  Index_PublicDirectory,
  Index_Scheduler,
  Index_Sessions,
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
const engine: Index_Engine = new DockerEngine(config['dockerHost']);

await engine.ping();

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
 * Index - Scheduler.
 *
 * Serializes update cycles started by the schedule, the API, and the
 * dashboard so two cycles never touch the same container at once.
 *
 * @since 0.0.1
 */
const scheduler: Index_Scheduler = new Scheduler(async (containerIds) => {
  return runUpdateCycle(config['updater'], {
    engine,
    fetchFunction: fetch,
    sleep: async (milliseconds) => {
      await new Promise((resolve) => {
        setTimeout(resolve, milliseconds);

        return;
      });

      return;
    },
    now: () => new Date(),
    findCredentials,
  }, containerIds);
}, history, () => {
  // A callback-less Cron only computes times; it never schedules anything.
  const nextRun: Index_NextRun = new Cron(config['schedule']).nextRun();

  return (nextRun !== null) ? nextRun : undefined;
});

/**
 * Index - Job.
 *
 * Cron job that triggers a cycle on OUTPOST_SCHEDULE (six fields, with
 * seconds; daily at 04:00 by default).
 *
 * @since 0.0.1
 */
const job: Index_Job = new Cron(config['schedule'], () => {
  scheduler.trigger();

  return;
});

/**
 * Index - Public Directory.
 *
 * Location of the dashboard's static files, resolved from the built
 * entry point so it works both in the image and in development.
 *
 * @since 0.0.1
 */
const publicDirectory: Index_PublicDirectory = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'admin');

/**
 * Index - Sessions.
 *
 * Dashboard logins for the administrator. The dashboard stays locked
 * until OUTPOST_ADMIN_PASSWORD_FILE or OUTPOST_ADMIN_PASSWORD is set.
 *
 * @since 0.0.1
 */
const sessions: Index_Sessions = new Sessions(config['adminUsername'], config['adminPassword'], () => Date.now());

/**
 * Index - App.
 *
 * HTTP server for the dashboard, health checks, manual triggers,
 * status, and metrics. Listens on PORT (3000 by default).
 *
 * @since 0.0.1
 */
const app: Index_App = createApp(scheduler, config['apiToken'], createAdminRouter({
  sessions,
  scheduler,
  history,
  listContainers: async () => engine.listContainers(),
  config,
  assetsDirectory: join(publicDirectory, 'assets'),
  indexPath: join(publicDirectory, 'index.html'),
}), config['trustProxy']);

app.listen(config['port'], (error) => {
  if (error !== undefined) {
    throw error;
  }

  const nextRunAt: Index_NextRunAt = job.nextRun();
  const nextRunLabel: Index_NextRunLabel = (nextRunAt !== null) ? nextRunAt.toISOString() : 'never';
  const lockedSuffix: Index_LockedSuffix = (sessions.isEnabled() === true) ? '' : ' (locked: set OUTPOST_ADMIN_PASSWORD_FILE)';
  const modeSuffix: Index_ModeSuffix = (config['updater']['monitorOnly'] === true) ? ', monitor only' : '';

  process.stdout.write([
    'Outpost',
    `  Dashboard: http://localhost:${String(config['port'])}/admin/${lockedSuffix}`,
    `  Schedule: ${config['schedule']} (next run ${nextRunLabel})`,
    `  Mode: ${config['updater']['labelMode']}${modeSuffix}`,
    '',
  ].join('\n'));

  if (config['runOnStart'] === true) {
    scheduler.trigger();
  }

  return;
});

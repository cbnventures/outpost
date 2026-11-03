import type { Cron } from 'croner';
import type { Express } from 'express';
import type { DockerEngine } from 'outpost-package-docker-engine';
import type { UpdateReport } from 'outpost-package-updater';

import type { Runner as Handoff } from '../handoff.js';
import type { Runner as History } from '../history.js';
import type { Runner as Notifier } from '../lib/notifier.js';
import type { Runner as State } from '../lib/state.js';
import type { Runner as Scheduler } from '../scheduler.js';
import type { Config_LoadConfig_Settings } from './config.d.ts';
import type { Handoff_Pending } from './handoff.d.ts';
import type { Lib_State_Runner_PrepareSetupClaim_Returns } from './lib/state.d.ts';
import type { SelfUpdate_Context } from './self-update.d.ts';

/**
 * Index.
 *
 * @since 0.0.1
 */
export type Index_Config = Config_LoadConfig_Settings;

export type Index_Engine = DockerEngine;

export type Index_Scheduler = Scheduler;

export type Index_Job = Cron;

export type Index_App = Express;

export type Index_History = History;

export type Index_State = State;

export type Index_Notifier = Notifier;

export type Index_Report = UpdateReport;

export type Index_SetupClaim = Lib_State_Runner_PrepareSetupClaim_Returns;

export type Index_NextRun = Date | null;

export type Index_NextRunAt = Date | null;

export type Index_NextRunLabel = string;

export type Index_ModeSuffix = string;

export type Index_Handoff = Handoff;

export type Index_SelfUpdateContext = SelfUpdate_Context;

export type Index_PendingSelfUpdate = Handoff_Pending | undefined;

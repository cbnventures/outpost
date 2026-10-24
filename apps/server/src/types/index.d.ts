import type { Cron } from 'croner';
import type { Express } from 'express';
import type { DockerEngine } from 'outpost-package-docker-engine';

import type { Runner as History } from '../history.js';
import type { Runner as Scheduler } from '../scheduler.js';
import type { Runner as Sessions } from '../session.js';
import type { Config_LoadConfig_Settings } from './config.d.ts';

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

export type Index_Sessions = Sessions;

export type Index_PublicDirectory = string;

export type Index_NextRun = Date | null;

export type Index_NextRunAt = Date | null;

export type Index_NextRunLabel = string;

export type Index_LockedSuffix = string;

export type Index_ModeSuffix = string;

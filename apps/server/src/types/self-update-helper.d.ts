import type {
  DockerContainerConfig,
  DockerContainerInspect,
  DockerEngine,
} from 'outpost-package-docker-engine';
import type { UpdateStatus } from 'outpost-package-updater';

import type { Runner as Handoff } from '../handoff.js';
import type { Runner as ImageConfigCache } from '../image-config-cache.js';
import type { Config_LoadConfig_Settings } from './config.d.ts';
import type { Handoff_Outcome_Status } from './handoff.d.ts';

/**
 * Self Update Helper.
 *
 * @since 1.0.0
 */
export type SelfUpdateHelper_Config = Config_LoadConfig_Settings;

export type SelfUpdateHelper_ContainerId = string;

export type SelfUpdateHelper_Reference = string;

export type SelfUpdateHelper_Engine = DockerEngine;

export type SelfUpdateHelper_Handoff = Handoff;

export type SelfUpdateHelper_ImageConfigCache = ImageConfigCache;

export type SelfUpdateHelper_Outcome_Status = Handoff_Outcome_Status;

export type SelfUpdateHelper_Outcome_Detail = string;

export type SelfUpdateHelper_Outcome_PreviousImageMetadataAvailable = boolean | undefined;

export type SelfUpdateHelper_Outcome = {
  status: SelfUpdateHelper_Outcome_Status;
  detail: SelfUpdateHelper_Outcome_Detail;
  previousImageMetadataAvailable?: SelfUpdateHelper_Outcome_PreviousImageMetadataAvailable;
};

export type SelfUpdateHelper_Inspected = DockerContainerInspect;

export type SelfUpdateHelper_ImageConfig = DockerContainerConfig | undefined;

export type SelfUpdateHelper_Result_Status = UpdateStatus;

export type SelfUpdateHelper_Result_Detail = string;

export type SelfUpdateHelper_Result = {
  status: SelfUpdateHelper_Result_Status;
  detail: SelfUpdateHelper_Result_Detail;
};

export type SelfUpdateHelper_ErrorMessage = string;

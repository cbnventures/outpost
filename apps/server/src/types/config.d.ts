import type { UpdaterOptions } from 'outpost-package-updater';

import type { Shared_RuntimeSettings } from './shared.d.ts';

/**
 * Config - Default Runtime Settings.
 *
 * @since 1.0.0
 */
export type Config_DefaultRuntimeSettings = Shared_RuntimeSettings;

/**
 * Config - Load Config.
 *
 * @since 0.0.1
 */
export type Config_LoadConfig_Environment = Record<string, string | undefined>;

export type Config_LoadConfig_Settings_Port = number;

export type Config_LoadConfig_Settings_DockerHost = string;

export type Config_LoadConfig_Settings_Schedule = string;

export type Config_LoadConfig_Settings_RunOnStart = boolean;

export type Config_LoadConfig_Settings_DataDirectory = string;

export type Config_LoadConfig_Settings_Updater = UpdaterOptions;

export type Config_LoadConfig_Settings = {
  port: Config_LoadConfig_Settings_Port;
  dockerHost: Config_LoadConfig_Settings_DockerHost;
  schedule: Config_LoadConfig_Settings_Schedule;
  runOnStart: Config_LoadConfig_Settings_RunOnStart;
  dataDirectory: Config_LoadConfig_Settings_DataDirectory;
  updater: Config_LoadConfig_Settings_Updater;
};

export type Config_LoadConfig_Returns = Config_LoadConfig_Settings;

/**
 * Config - Apply Runtime Settings.
 *
 * @since 1.0.0
 */
export type Config_ApplyRuntimeSettings_Config = Config_LoadConfig_Settings;

export type Config_ApplyRuntimeSettings_Settings = Shared_RuntimeSettings;

export type Config_ApplyRuntimeSettings_Returns = void;

/**
 * Config - Runtime Settings From Config.
 *
 * @since 1.0.0
 */
export type Config_RuntimeSettingsFromConfig_Config = Config_LoadConfig_Settings;

export type Config_RuntimeSettingsFromConfig_Returns = Shared_RuntimeSettings;

/**
 * Config - Read Number.
 *
 * @since 0.0.1
 */
export type Config_ReadNumber_Name = string;

export type Config_ReadNumber_Value = string | undefined;

export type Config_ReadNumber_Fallback = number;

export type Config_ReadNumber_Returns = number;

export type Config_ReadNumber_Parsed = number;

/**
 * Config - Read Self ID.
 *
 * @since 1.0.0
 */
export type Config_ReadSelfId_Hostname = string | undefined;

export type Config_ReadSelfId_ReadFile = (path: string, encoding: BufferEncoding) => string;

export type Config_ReadSelfId_Returns = string | undefined;

export type Config_ReadSelfId_Cgroup = string;

export type Config_ReadSelfId_CgroupMatch = RegExpExecArray | null;

export type Config_ReadSelfId_MountInfo = string;

export type Config_ReadSelfId_MountInfoMatch = RegExpExecArray | null;

/**
 * Config - Read String.
 *
 * @since 0.0.1
 */
export type Config_ReadString_Value = string | undefined;

export type Config_ReadString_Fallback = string | undefined;

export type Config_ReadString_Returns<Fallback> = string | Fallback;

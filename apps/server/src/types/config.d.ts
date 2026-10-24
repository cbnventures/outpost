import type { UpdaterOptions } from 'outpost-package-updater';

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

export type Config_LoadConfig_Settings_ApiToken = string | undefined;

export type Config_LoadConfig_Settings_AdminUsername = string;

export type Config_LoadConfig_Settings_AdminPassword = string | undefined;

export type Config_LoadConfig_Settings_DataDirectory = string;

export type Config_LoadConfig_Settings_TrustProxy = boolean;

export type Config_LoadConfig_Settings_Updater = UpdaterOptions;

export type Config_LoadConfig_Settings = {
  port: Config_LoadConfig_Settings_Port;
  dockerHost: Config_LoadConfig_Settings_DockerHost;
  schedule: Config_LoadConfig_Settings_Schedule;
  runOnStart: Config_LoadConfig_Settings_RunOnStart;
  apiToken: Config_LoadConfig_Settings_ApiToken;
  adminUsername: Config_LoadConfig_Settings_AdminUsername;
  adminPassword: Config_LoadConfig_Settings_AdminPassword;
  dataDirectory: Config_LoadConfig_Settings_DataDirectory;
  trustProxy: Config_LoadConfig_Settings_TrustProxy;
  updater: Config_LoadConfig_Settings_Updater;
};

export type Config_LoadConfig_Returns = Config_LoadConfig_Settings;

export type Config_LoadConfig_LabelMode = string;

/**
 * Config - Read Flag.
 *
 * @since 0.0.1
 */
export type Config_ReadFlag_Name = string;

export type Config_ReadFlag_Value = string | undefined;

export type Config_ReadFlag_Fallback = boolean;

export type Config_ReadFlag_Returns = boolean;

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
 * Config - Read Secret.
 *
 * @since 0.0.1
 */
export type Config_ReadSecret_Name = string;

export type Config_ReadSecret_Value = string | undefined;

export type Config_ReadSecret_FilePath = string | undefined;

export type Config_ReadSecret_Returns = string | undefined;

export type Config_ReadSecret_FileValue = string;

/**
 * Config - Read String.
 *
 * @since 0.0.1
 */
export type Config_ReadString_Value = string | undefined;

export type Config_ReadString_Fallback = string | undefined;

export type Config_ReadString_Returns<Fallback> = string | Fallback;

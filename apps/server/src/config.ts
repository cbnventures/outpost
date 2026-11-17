import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import {
  cgroupContainerIdPattern,
  containerHostnamePattern,
  mountInfoContainerIdPattern,
} from './regex.js';

import type {
  Config_ApplyRuntimeSettings_Config,
  Config_ApplyRuntimeSettings_Returns,
  Config_ApplyRuntimeSettings_Settings,
  Config_ConsolePort,
  Config_DefaultRuntimeSettings,
  Config_LoadConfig_Environment,
  Config_LoadConfig_Returns,
  Config_LoadConfig_Settings_DataDirectory,
  Config_ReadSelfId_Cgroup,
  Config_ReadSelfId_CgroupMatch,
  Config_ReadSelfId_Hostname,
  Config_ReadSelfId_MountInfo,
  Config_ReadSelfId_MountInfoMatch,
  Config_ReadSelfId_ReadFile,
  Config_ReadSelfId_Returns,
  Config_ReadString_Fallback,
  Config_ReadString_Returns,
  Config_ReadString_Value,
  Config_RuntimeSettingsFromConfig_Config,
  Config_RuntimeSettingsFromConfig_Returns,
} from './types/config.d.ts';

/**
 * Config - Console Port.
 *
 * The port the dashboard and HTTP API listen on inside the container. A
 * different host port is chosen with the port mapping, such as
 * `-p 8080:22601`.
 *
 * @since 1.1.0
 */
export const consolePort: Config_ConsolePort = 22601;

/**
 * Config - Default Runtime Settings.
 *
 * Seeds a new installation's database. After the first start, the Settings
 * page owns these values and environment variables do not override them.
 *
 * @since 1.0.0
 */
export const defaultRuntimeSettings: Config_DefaultRuntimeSettings = {
  schedule: '0 0 4 * * *',
  runOnStart: false,
  labelMode: 'opt-out',
  monitorOnly: false,
  cleanup: true,
  stopTimeoutSeconds: 30,
  healthTimeoutSeconds: 120,
  settleSeconds: 10,
};

/**
 * Config - Load Config.
 *
 * Validates the environment and turns it into the server settings and
 * updater options. Invalid values stop startup with a readable message.
 *
 * @param {Config_LoadConfig_Environment} environment - Environment.
 *
 * @returns {Config_LoadConfig_Returns}
 *
 * @since 0.0.1
 */
export function loadConfig(environment: Config_LoadConfig_Environment): Config_LoadConfig_Returns {
  const dataDirectory: Config_LoadConfig_Settings_DataDirectory = readString(environment['OUTPOST_DATA_DIRECTORY'], '/config');

  return {
    port: consolePort,
    dockerHost: readString(environment['DOCKER_HOST'], 'unix:///var/run/docker.sock'),
    schedule: defaultRuntimeSettings['schedule'],
    runOnStart: defaultRuntimeSettings['runOnStart'],
    dataDirectory,
    databaseDirectory: readString(environment['NOVA_DATABASE_DIRECTORY'], join(dataDirectory, 'database')),
    installationKeyFile: readString(environment['NOVA_INSTALLATION_KEY_FILE'], join(dataDirectory, 'keys', 'installation.key')),
    updater: {
      labelMode: defaultRuntimeSettings['labelMode'],
      monitorOnly: defaultRuntimeSettings['monitorOnly'],
      cleanup: defaultRuntimeSettings['cleanup'],
      stopTimeoutSeconds: defaultRuntimeSettings['stopTimeoutSeconds'],
      healthTimeoutSeconds: defaultRuntimeSettings['healthTimeoutSeconds'],
      settleSeconds: defaultRuntimeSettings['settleSeconds'],
      selfId: readSelfId(environment['HOSTNAME']),
    },
  };
}

/**
 * Config - Apply Runtime Settings.
 *
 * Copies the database-backed behavior into the live configuration object.
 * Existing closures keep the same object reference and see changes immediately.
 *
 * @param {Config_ApplyRuntimeSettings_Config}   config   - Config.
 * @param {Config_ApplyRuntimeSettings_Settings} settings - Settings.
 *
 * @returns {Config_ApplyRuntimeSettings_Returns}
 *
 * @since 1.0.0
 */
export function applyRuntimeSettings(config: Config_ApplyRuntimeSettings_Config, settings: Config_ApplyRuntimeSettings_Settings): Config_ApplyRuntimeSettings_Returns {
  Reflect.set(config, 'schedule', settings['schedule']);
  Reflect.set(config, 'runOnStart', settings['runOnStart']);
  Reflect.set(config['updater'], 'labelMode', settings['labelMode']);
  Reflect.set(config['updater'], 'monitorOnly', settings['monitorOnly']);
  Reflect.set(config['updater'], 'cleanup', settings['cleanup']);
  Reflect.set(config['updater'], 'stopTimeoutSeconds', settings['stopTimeoutSeconds']);
  Reflect.set(config['updater'], 'healthTimeoutSeconds', settings['healthTimeoutSeconds']);
  Reflect.set(config['updater'], 'settleSeconds', settings['settleSeconds']);

  return;
}

/**
 * Config - Runtime Settings From Config.
 *
 * Projects the mutable behavior out of the full live configuration without
 * exposing the container's socket or data path.
 *
 * @param {Config_RuntimeSettingsFromConfig_Config} config - Config.
 *
 * @returns {Config_RuntimeSettingsFromConfig_Returns}
 *
 * @since 1.0.0
 */
export function runtimeSettingsFromConfig(config: Config_RuntimeSettingsFromConfig_Config): Config_RuntimeSettingsFromConfig_Returns {
  return {
    schedule: config['schedule'],
    runOnStart: config['runOnStart'],
    labelMode: config['updater']['labelMode'],
    monitorOnly: config['updater']['monitorOnly'],
    cleanup: config['updater']['cleanup'],
    stopTimeoutSeconds: config['updater']['stopTimeoutSeconds'],
    healthTimeoutSeconds: config['updater']['healthTimeoutSeconds'],
    settleSeconds: config['updater']['settleSeconds'],
  };
}

/**
 * Config - Read Self ID.
 *
 * Finds the current container ID in cgroup or mount metadata, which remains
 * available when host networking makes HOSTNAME unreliable. A Docker-style
 * hostname is retained only as a final fallback.
 *
 * @param {Config_ReadSelfId_Hostname} hostname   - Hostname.
 * @param {Config_ReadSelfId_ReadFile} [readFile] - Read file.
 *
 * @returns {Config_ReadSelfId_Returns}
 *
 * @since 1.0.0
 */
export function readSelfId(hostname: Config_ReadSelfId_Hostname, readFile: Config_ReadSelfId_ReadFile = readFileSync): Config_ReadSelfId_Returns {
  try {
    const cgroup: Config_ReadSelfId_Cgroup = readFile('/proc/self/cgroup', 'utf-8');
    const cgroupMatch: Config_ReadSelfId_CgroupMatch = new RegExp(cgroupContainerIdPattern, 'm').exec(cgroup);

    if (cgroupMatch !== null && cgroupMatch[1] !== undefined) {
      return cgroupMatch[1];
    }
  } catch {
    // /proc is unavailable outside Linux containers.
  }

  try {
    const mountInfo: Config_ReadSelfId_MountInfo = readFile('/proc/self/mountinfo', 'utf-8');
    const mountInfoMatch: Config_ReadSelfId_MountInfoMatch = new RegExp(mountInfoContainerIdPattern, 'm').exec(mountInfo);

    if (mountInfoMatch !== null && mountInfoMatch[1] !== undefined) {
      return mountInfoMatch[1];
    }
  } catch {
    // /proc is unavailable outside Linux containers.
  }

  return (hostname !== undefined && containerHostnamePattern.test(hostname) === true) ? hostname : undefined;
}

/**
 * Config - Read String.
 *
 * Reads a text variable, treating an empty value the same as an unset
 * one so blank lines in env files fall back to defaults.
 *
 * @param {Config_ReadString_Value}    value    - Value.
 * @param {Config_ReadString_Fallback} fallback - Fallback.
 *
 * @returns {Config_ReadString_Returns}
 *
 * @since 0.0.1
 */
function readString<Fallback extends Config_ReadString_Fallback>(value: Config_ReadString_Value, fallback: Fallback): Config_ReadString_Returns<Fallback> {
  return (value === undefined || value === '') ? fallback : value;
}

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import type {
  Config_LoadConfig_Environment,
  Config_LoadConfig_LabelMode,
  Config_LoadConfig_Returns,
  Config_ReadFlag_Fallback,
  Config_ReadFlag_Name,
  Config_ReadFlag_Returns,
  Config_ReadFlag_Value,
  Config_ReadNumber_Fallback,
  Config_ReadNumber_Name,
  Config_ReadNumber_Parsed,
  Config_ReadNumber_Returns,
  Config_ReadNumber_Value,
  Config_ReadSecret_FilePath,
  Config_ReadSecret_FileValue,
  Config_ReadSecret_Name,
  Config_ReadSecret_Returns,
  Config_ReadSecret_Value,
  Config_ReadString_Fallback,
  Config_ReadString_Returns,
  Config_ReadString_Value,
} from './types/config.d.ts';

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
  const labelMode: Config_LoadConfig_LabelMode = readString(environment['OUTPOST_LABEL_MODE'], 'opt-out');

  if (labelMode !== 'opt-in' && labelMode !== 'opt-out') {
    throw new Error(`OUTPOST_LABEL_MODE must be "opt-in" or "opt-out", received "${labelMode}".`);
  }

  return {
    port: readNumber('PORT', environment['PORT'], 3000),
    dockerHost: readString(environment['DOCKER_HOST'], 'unix:///var/run/docker.sock'),
    schedule: readString(environment['OUTPOST_SCHEDULE'], '0 0 4 * * *'),
    runOnStart: readFlag('OUTPOST_RUN_ON_START', environment['OUTPOST_RUN_ON_START'], false),
    apiToken: readString(environment['OUTPOST_API_TOKEN'], undefined),
    adminUsername: readString(environment['OUTPOST_ADMIN_USERNAME'], 'admin'),
    adminPassword: readSecret('OUTPOST_ADMIN_PASSWORD', environment['OUTPOST_ADMIN_PASSWORD'], environment['OUTPOST_ADMIN_PASSWORD_FILE']),
    dataDirectory: readString(environment['OUTPOST_DATA_DIRECTORY'], '/data'),
    trustProxy: readFlag('OUTPOST_TRUST_PROXY', environment['OUTPOST_TRUST_PROXY'], false),
    updater: {
      labelMode,
      monitorOnly: readFlag('OUTPOST_MONITOR_ONLY', environment['OUTPOST_MONITOR_ONLY'], false),
      cleanup: readFlag('OUTPOST_CLEANUP', environment['OUTPOST_CLEANUP'], true),
      stopTimeoutSeconds: readNumber('OUTPOST_STOP_TIMEOUT', environment['OUTPOST_STOP_TIMEOUT'], 30),
      healthTimeoutSeconds: readNumber('OUTPOST_HEALTH_TIMEOUT', environment['OUTPOST_HEALTH_TIMEOUT'], 120),
      settleSeconds: readNumber('OUTPOST_SETTLE_SECONDS', environment['OUTPOST_SETTLE_SECONDS'], 10),
      selfId: readString(environment['HOSTNAME'], undefined),
      dockerConfigPath: join(readString(environment['DOCKER_CONFIG'], '/config'), 'config.json'),
      notificationTargets: {
        ntfyUrl: readString(environment['OUTPOST_NTFY_URL'], undefined),
        ntfyToken: readString(environment['OUTPOST_NTFY_TOKEN'], undefined),
        webhookUrl: readString(environment['OUTPOST_WEBHOOK_URL'], undefined),
      },
    },
  };
}

/**
 * Config - Read Flag.
 *
 * Reads a "true"/"false" variable. Unset or empty values use the
 * fallback; anything else is rejected so typos do not pass silently.
 *
 * @param {Config_ReadFlag_Name}     name     - Name.
 * @param {Config_ReadFlag_Value}    value    - Value.
 * @param {Config_ReadFlag_Fallback} fallback - Fallback.
 *
 * @returns {Config_ReadFlag_Returns}
 *
 * @since 0.0.1
 */
function readFlag(name: Config_ReadFlag_Name, value: Config_ReadFlag_Value, fallback: Config_ReadFlag_Fallback): Config_ReadFlag_Returns {
  if (value === undefined || value === '') {
    return fallback;
  }

  if (value !== 'true' && value !== 'false') {
    throw new Error(`${name} must be "true" or "false", received "${value}".`);
  }

  return value === 'true';
}

/**
 * Config - Read Number.
 *
 * Reads a positive integer variable. Unset or empty values use the
 * fallback; anything else that is not a positive integer is rejected.
 *
 * @param {Config_ReadNumber_Name}     name     - Name.
 * @param {Config_ReadNumber_Value}    value    - Value.
 * @param {Config_ReadNumber_Fallback} fallback - Fallback.
 *
 * @returns {Config_ReadNumber_Returns}
 *
 * @since 0.0.1
 */
function readNumber(name: Config_ReadNumber_Name, value: Config_ReadNumber_Value, fallback: Config_ReadNumber_Fallback): Config_ReadNumber_Returns {
  if (value === undefined || value === '') {
    return fallback;
  }

  const parsed: Config_ReadNumber_Parsed = Number(value);

  if (Number.isInteger(parsed) === false || parsed < 1) {
    throw new Error(`${name} must be a positive integer, received "${value}".`);
  }

  return parsed;
}

/**
 * Config - Read Secret.
 *
 * Reads a secret from its variable or, preferably, from the file named
 * by the matching _FILE variable (such as a Docker secret).
 *
 * @param {Config_ReadSecret_Name}     name     - Name.
 * @param {Config_ReadSecret_Value}    value    - Value.
 * @param {Config_ReadSecret_FilePath} filePath - File path.
 *
 * @returns {Config_ReadSecret_Returns}
 *
 * @since 0.0.1
 */
function readSecret(name: Config_ReadSecret_Name, value: Config_ReadSecret_Value, filePath: Config_ReadSecret_FilePath): Config_ReadSecret_Returns {
  if (filePath !== undefined && filePath !== '') {
    let fileValue: Config_ReadSecret_FileValue = '';

    try {
      fileValue = readFileSync(filePath, 'utf-8').trim();
    } catch {
      throw new Error(`${name}_FILE points at "${filePath}", which cannot be read.`);
    }

    if (fileValue === '') {
      throw new Error(`${name}_FILE points at "${filePath}", which is empty.`);
    }

    return fileValue;
  }

  return (value === undefined || value === '') ? undefined : value;
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

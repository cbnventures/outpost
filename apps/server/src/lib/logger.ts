import type {
  Lib_Logger_DebugLogging,
  Lib_Logger_IsDebugLogging_Returns,
  Lib_Logger_LogDebug_Message,
  Lib_Logger_LogDebug_Returns,
  Lib_Logger_SetDebugLogging_Enabled,
  Lib_Logger_SetDebugLogging_Returns,
} from '../types/lib/logger.d.ts';

/**
 * Lib - Logger - Debug Logging.
 *
 * Whether DEBUG lines are written, as set by Debug logging on the Settings page.
 * It starts off and follows the saved setting once Outpost reads it.
 *
 * @since 1.1.0
 */
let debugLogging: Lib_Logger_DebugLogging = false;

/**
 * Lib - Logger - Is Debug Logging.
 *
 * Says whether Debug logging is on, so a caller can skip timing work while it's off.
 * The answer follows the latest setDebugLogging call.
 *
 * @returns {Lib_Logger_IsDebugLogging_Returns}
 *
 * @since 1.1.0
 */
export function isDebugLogging(): Lib_Logger_IsDebugLogging_Returns {
  return debugLogging;
}

/**
 * Lib - Logger - Log Debug.
 *
 * Writes a DEBUG line to standard output while Debug logging is on.
 * Callers name the work, its outcome, and how long it took, never a secret.
 *
 * @param {Lib_Logger_LogDebug_Message} message - Message.
 *
 * @returns {Lib_Logger_LogDebug_Returns}
 *
 * @since 1.1.0
 */
export function logDebug(message: Lib_Logger_LogDebug_Message): Lib_Logger_LogDebug_Returns {
  if (debugLogging === false) {
    return;
  }

  process.stdout.write(`DEBUG ${message}\n`);

  return;
}

/**
 * Lib - Logger - Set Debug Logging.
 *
 * Turns DEBUG lines on or off for the whole process at once.
 * Outpost calls it at startup with the saved setting and whenever the setting changes.
 *
 * @param {Lib_Logger_SetDebugLogging_Enabled} enabled - Enabled.
 *
 * @returns {Lib_Logger_SetDebugLogging_Returns}
 *
 * @since 1.1.0
 */
export function setDebugLogging(enabled: Lib_Logger_SetDebugLogging_Enabled): Lib_Logger_SetDebugLogging_Returns {
  debugLogging = enabled;

  return;
}

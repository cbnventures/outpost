import type {
  Lib_Logger_DebugLogging,
  Lib_Logger_IsDebugLogging_Returns,
  Lib_Logger_LogDebug_Component,
  Lib_Logger_LogDebug_Message,
  Lib_Logger_LogDebug_Returns,
  Lib_Logger_LogError_Component,
  Lib_Logger_LogError_Message,
  Lib_Logger_LogError_Returns,
  Lib_Logger_LogInfo_Component,
  Lib_Logger_LogInfo_Message,
  Lib_Logger_LogInfo_Returns,
  Lib_Logger_LogWarn_Component,
  Lib_Logger_LogWarn_Message,
  Lib_Logger_LogWarn_Returns,
  Lib_Logger_SetDebugLogging_Enabled,
  Lib_Logger_SetDebugLogging_Returns,
  Lib_Logger_WriteLog_Component,
  Lib_Logger_WriteLog_Level,
  Lib_Logger_WriteLog_Line,
  Lib_Logger_WriteLog_Message,
  Lib_Logger_WriteLog_NormalizedMessage,
  Lib_Logger_WriteLog_Returns,
  Lib_Logger_WriteLog_Timestamp,
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
export function logDebug(component: Lib_Logger_LogDebug_Component, message: Lib_Logger_LogDebug_Message): Lib_Logger_LogDebug_Returns {
  if (debugLogging === false) {
    return;
  }

  writeLog('DEBUG', component, message);

  return;
}

/**
 * Lib - Logger - Log Error.
 *
 * Writes one structured ERROR fact to standard error.
 * Line breaks in the fact are flattened so each record remains one line.
 *
 * @param {Lib_Logger_LogError_Component} component - Component.
 * @param {Lib_Logger_LogError_Message}   message   - Message.
 *
 * @returns {Lib_Logger_LogError_Returns}
 *
 * @since 1.2.0
 */
export function logError(component: Lib_Logger_LogError_Component, message: Lib_Logger_LogError_Message): Lib_Logger_LogError_Returns {
  writeLog('ERROR', component, message);

  return;
}

/**
 * Lib - Logger - Log Info.
 *
 * Writes one structured INFO fact to standard output.
 * Line breaks in the fact are flattened so each record remains one line.
 *
 * @param {Lib_Logger_LogInfo_Component} component - Component.
 * @param {Lib_Logger_LogInfo_Message}   message   - Message.
 *
 * @returns {Lib_Logger_LogInfo_Returns}
 *
 * @since 1.2.0
 */
export function logInfo(component: Lib_Logger_LogInfo_Component, message: Lib_Logger_LogInfo_Message): Lib_Logger_LogInfo_Returns {
  writeLog('INFO', component, message);

  return;
}

/**
 * Lib - Logger - Log Warn.
 *
 * Writes one structured WARN fact to standard error.
 * Line breaks in the fact are flattened so each record remains one line.
 *
 * @param {Lib_Logger_LogWarn_Component} component - Component.
 * @param {Lib_Logger_LogWarn_Message}   message   - Message.
 *
 * @returns {Lib_Logger_LogWarn_Returns}
 *
 * @since 1.2.0
 */
export function logWarn(component: Lib_Logger_LogWarn_Component, message: Lib_Logger_LogWarn_Message): Lib_Logger_LogWarn_Returns {
  writeLog('WARN', component, message);

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

/**
 * Lib - Logger - Write Log.
 *
 * Adds the shared timestamp, level, and component fields before writing one line.
 * WARN and ERROR records go to standard error; INFO and DEBUG go to standard output.
 *
 * @param {Lib_Logger_WriteLog_Level}     level     - Level.
 * @param {Lib_Logger_WriteLog_Component} component - Component.
 * @param {Lib_Logger_WriteLog_Message}   message   - Message.
 *
 * @returns {Lib_Logger_WriteLog_Returns}
 *
 * @since 1.2.0
 */
function writeLog(level: Lib_Logger_WriteLog_Level, component: Lib_Logger_WriteLog_Component, message: Lib_Logger_WriteLog_Message): Lib_Logger_WriteLog_Returns {
  const timestamp: Lib_Logger_WriteLog_Timestamp = `${new Date().toISOString().slice(0, 19)}Z`;
  const normalizedMessage: Lib_Logger_WriteLog_NormalizedMessage = message.split('\r').join(' ').split('\n').join(' ');
  const line: Lib_Logger_WriteLog_Line = `${timestamp} ${level} ${component}: ${normalizedMessage}\n`;

  if (level === 'ERROR' || level === 'WARN') {
    process.stderr.write(line);
  } else {
    process.stdout.write(line);
  }

  return;
}

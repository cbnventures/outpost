/**
 * Lib - Logger - Debug Logging.
 *
 * @since 1.1.0
 */
export type Lib_Logger_DebugLogging = boolean;

/**
 * Lib - Logger - Component.
 *
 * @since 1.2.0
 */
export type Lib_Logger_Component = string;

/**
 * Lib - Logger - Is Debug Logging.
 *
 * @since 1.1.0
 */
export type Lib_Logger_IsDebugLogging_Returns = boolean;

/**
 * Lib - Logger - Log Debug.
 *
 * @since 1.1.0
 */
export type Lib_Logger_LogDebug_Message = string;

export type Lib_Logger_LogDebug_Component = Lib_Logger_Component;

export type Lib_Logger_LogDebug_Returns = void;

/**
 * Lib - Logger - Log Error.
 *
 * @since 1.2.0
 */
export type Lib_Logger_LogError_Component = Lib_Logger_Component;

export type Lib_Logger_LogError_Message = string;

export type Lib_Logger_LogError_Returns = void;

/**
 * Lib - Logger - Log Info.
 *
 * @since 1.2.0
 */
export type Lib_Logger_LogInfo_Component = Lib_Logger_Component;

export type Lib_Logger_LogInfo_Message = string;

export type Lib_Logger_LogInfo_Returns = void;

/**
 * Lib - Logger - Log Warn.
 *
 * @since 1.2.0
 */
export type Lib_Logger_LogWarn_Component = Lib_Logger_Component;

export type Lib_Logger_LogWarn_Message = string;

export type Lib_Logger_LogWarn_Returns = void;

/**
 * Lib - Logger - Set Debug Logging.
 *
 * @since 1.1.0
 */
export type Lib_Logger_SetDebugLogging_Enabled = boolean;

export type Lib_Logger_SetDebugLogging_Returns = void;

/**
 * Lib - Logger - Write Log.
 *
 * @since 1.2.0
 */
export type Lib_Logger_WriteLog_Component = Lib_Logger_Component;

export type Lib_Logger_WriteLog_Level = 'DEBUG' | 'ERROR' | 'INFO' | 'WARN';

export type Lib_Logger_WriteLog_Line = string;

export type Lib_Logger_WriteLog_Message = string;

export type Lib_Logger_WriteLog_NormalizedMessage = string;

export type Lib_Logger_WriteLog_Returns = void;

export type Lib_Logger_WriteLog_Timestamp = string;

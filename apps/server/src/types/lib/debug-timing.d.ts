/**
 * Lib - Debug Timing - Describe Address.
 *
 * @since 1.1.0
 */
export type Lib_DebugTiming_DescribeAddress_Input = Parameters<typeof fetch>[0];

export type Lib_DebugTiming_DescribeAddress_Returns = string;

export type Lib_DebugTiming_DescribeAddress_Href = string;

/**
 * Lib - Debug Timing - Reason.
 *
 * @since 1.1.0
 */
export type Lib_DebugTiming_Reason_Error = unknown;

export type Lib_DebugTiming_Reason_Returns = string;

/**
 * Lib - Debug Timing - Slow Docker Milliseconds.
 *
 * @since 1.1.0
 */
export type Lib_DebugTiming_SlowDockerMilliseconds = number;

/**
 * Lib - Debug Timing - Time Engine Call.
 *
 * @since 1.1.0
 */
export type Lib_DebugTiming_TimeEngineCall_Name = string;

export type Lib_DebugTiming_TimeEngineCall_StartedAt = number;

export type Lib_DebugTiming_TimeEngineCall_Pending = Promise<unknown>;

export type Lib_DebugTiming_TimeEngineCall_Returns = Promise<unknown>;

export type Lib_DebugTiming_TimeEngineCall_Resolved = unknown;

export type Lib_DebugTiming_TimeEngineCall_Elapsed = number;

/**
 * Lib - Debug Timing - Timed Engine.
 *
 * @since 1.1.0
 */
export type Lib_DebugTiming_TimedEngine_Engine<Engine extends object> = Engine;

export type Lib_DebugTiming_TimedEngine_Returns<Engine extends object> = Engine;

export type Lib_DebugTiming_TimedEngine_Value = unknown;

export type Lib_DebugTiming_TimedEngine_Method = (...methodArguments: unknown[]) => unknown;

export type Lib_DebugTiming_TimedEngine_Result = unknown;

export type Lib_DebugTiming_TimedEngine_StartedAt = number;

/**
 * Lib - Debug Timing - Timed Fetch.
 *
 * @since 1.1.0
 */
export type Lib_DebugTiming_TimedFetch_FetchFunction = typeof fetch;

export type Lib_DebugTiming_TimedFetch_Returns = typeof fetch;

export type Lib_DebugTiming_TimedFetch_Method = string;

export type Lib_DebugTiming_TimedFetch_Address = string;

export type Lib_DebugTiming_TimedFetch_StartedAt = number;

export type Lib_DebugTiming_TimedFetch_Response = Response;

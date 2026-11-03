/**
 * Lib - Attempts - Runner - Constructor.
 *
 * @since 1.0.0
 */
export type Lib_Attempts_Runner_Constructor_Now = () => number;

export type Lib_Attempts_Runner_Constructor_OnLimitReached = (key: string) => void;

/**
 * Lib - Attempts - Runner - Failures.
 *
 * @since 1.0.0
 */
export type Lib_Attempts_Runner_Failures_Key = string;

export type Lib_Attempts_Runner_Failures_Time = number;

export type Lib_Attempts_Runner_Failures_Times = Lib_Attempts_Runner_Failures_Time[];

export type Lib_Attempts_Runner_Failures = Map<Lib_Attempts_Runner_Failures_Key, Lib_Attempts_Runner_Failures_Times>;

/**
 * Lib - Attempts - Runner - Get Recent Failures.
 *
 * @since 1.0.0
 */
export type Lib_Attempts_Runner_GetRecentFailures_Key = string;

export type Lib_Attempts_Runner_GetRecentFailures_Now = number;

export type Lib_Attempts_Runner_GetRecentFailures_Returns = number[];

export type Lib_Attempts_Runner_GetRecentFailures_Failures = number[];

/**
 * Lib - Attempts - Runner - Get Retry After Seconds.
 *
 * @since 1.0.0
 */
export type Lib_Attempts_Runner_GetRetryAfterSeconds_Key = string;

export type Lib_Attempts_Runner_GetRetryAfterSeconds_Returns = number;

export type Lib_Attempts_Runner_GetRetryAfterSeconds_Now = number;

export type Lib_Attempts_Runner_GetRetryAfterSeconds_Failures = number[];

export type Lib_Attempts_Runner_GetRetryAfterSeconds_OldestFailure = number | undefined;

/**
 * Lib - Attempts - Runner - Is Allowed.
 *
 * @since 1.0.0
 */
export type Lib_Attempts_Runner_IsAllowed_Key = string;

export type Lib_Attempts_Runner_IsAllowed_Returns = boolean;

/**
 * Lib - Attempts - Runner - Limit.
 *
 * @since 1.0.0
 */
export type Lib_Attempts_Runner_Limit = number;

/**
 * Lib - Attempts - Runner - Maximum Keys.
 *
 * @since 1.0.0
 */
export type Lib_Attempts_Runner_MaximumKeys = number;

/**
 * Lib - Attempts - Runner - Now.
 *
 * @since 1.0.0
 */
export type Lib_Attempts_Runner_Now = () => number;

export type Lib_Attempts_Runner_OnLimitReached = ((key: string) => void) | undefined;

/**
 * Lib - Attempts - Runner - Prune.
 *
 * @since 1.0.0
 */
export type Lib_Attempts_Runner_Prune_Now = number;

export type Lib_Attempts_Runner_Prune_Returns = void;

/**
 * Lib - Attempts - Runner - Record Failure.
 *
 * @since 1.0.0
 */
export type Lib_Attempts_Runner_RecordFailure_Key = string;

export type Lib_Attempts_Runner_RecordFailure_Returns = void;

export type Lib_Attempts_Runner_RecordFailure_Now = number;

export type Lib_Attempts_Runner_RecordFailure_Failures = number[];

/**
 * Lib - Attempts - Runner - Reset.
 *
 * @since 1.0.0
 */
export type Lib_Attempts_Runner_Reset_Key = string;

export type Lib_Attempts_Runner_Reset_Returns = void;

/**
 * Lib - Attempts - Runner - Window Milliseconds.
 *
 * @since 1.0.0
 */
export type Lib_Attempts_Runner_WindowMilliseconds = number;

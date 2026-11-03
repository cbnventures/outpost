import type { Runner as Attempts } from '../../lib/attempts.js';

/**
 * Lib - Attempts - Sign In Attempts - Clears The Count After A Successful Sign In.
 *
 * @since 1.0.0
 */
export type Lib_Attempts_SignInAttempts_ClearsTheCountAfterASuccessfulSignIn_Attempts = Attempts;

/**
 * Lib - Attempts - Sign In Attempts - Refuses The Eleventh Attempt Within Fifteen Minutes.
 *
 * @since 1.0.0
 */
export type Lib_Attempts_SignInAttempts_RefusesTheEleventhAttemptWithinFifteenMinutes_Clock_Value = number;

export type Lib_Attempts_SignInAttempts_RefusesTheEleventhAttemptWithinFifteenMinutes_Clock = {
  value: Lib_Attempts_SignInAttempts_RefusesTheEleventhAttemptWithinFifteenMinutes_Clock_Value;
};

export type Lib_Attempts_SignInAttempts_RefusesTheEleventhAttemptWithinFifteenMinutes_Attempts = Attempts;

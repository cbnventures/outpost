import {
  describe,
  expect,
  it,
} from 'vitest';

import { Runner as Attempts } from './attempts.js';

import type {
  Lib_Attempts_SignInAttempts_ClearsTheCountAfterASuccessfulSignIn_Attempts,
  Lib_Attempts_SignInAttempts_RefusesTheEleventhAttemptWithinFifteenMinutes_Attempts,
  Lib_Attempts_SignInAttempts_RefusesTheEleventhAttemptWithinFifteenMinutes_Clock,
} from '../types/lib/attempts.test.d.ts';

/**
 * Lib - Attempts - Sign-in Attempts.
 *
 * Checks the shared limit of ten failures per address in fifteen minutes,
 * the Retry-After value, and that a success clears the count.
 *
 * @since 1.0.0
 */
describe('sign-in attempts', () => {
  it('refuses the eleventh attempt within fifteen minutes', () => {
    const clock: Lib_Attempts_SignInAttempts_RefusesTheEleventhAttemptWithinFifteenMinutes_Clock = { value: Date.parse('2026-10-24T12:00:00.000Z') };
    const attempts: Lib_Attempts_SignInAttempts_RefusesTheEleventhAttemptWithinFifteenMinutes_Attempts = new Attempts(() => clock['value']);

    for (let failure = 0; failure < 10; failure += 1) {
      expect(attempts.isAllowed('sign-in:203.0.113.10')).toBe(true);

      attempts.recordFailure('sign-in:203.0.113.10');

      Reflect.set(clock, 'value', clock['value'] + 1);
    }

    expect(attempts.isAllowed('sign-in:203.0.113.10')).toBe(false);

    expect(attempts.getRetryAfterSeconds('sign-in:203.0.113.10')).toBe(900);

    expect(attempts.isAllowed('sign-in:203.0.113.11')).toBe(true);

    Reflect.set(clock, 'value', clock['value'] + (15 * 60 * 1000));

    expect(attempts.isAllowed('sign-in:203.0.113.10')).toBe(true);

    return;
  });

  it('clears the count after a successful sign-in', () => {
    const attempts: Lib_Attempts_SignInAttempts_ClearsTheCountAfterASuccessfulSignIn_Attempts = new Attempts(() => 0);

    for (let failure = 0; failure < 10; failure += 1) {
      attempts.recordFailure('sign-in:203.0.113.10');
    }

    attempts.reset('sign-in:203.0.113.10');

    expect(attempts.isAllowed('sign-in:203.0.113.10')).toBe(true);

    expect(attempts.getRetryAfterSeconds('sign-in:203.0.113.10')).toBe(0);

    return;
  });

  return;
});

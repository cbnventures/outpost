import {
  describe,
  expect,
  it,
} from 'vitest';

import { Runner as Sessions } from './session.js';

import type {
  Session_Sessions_ExpiresIdleSessions_Clock,
  Session_Sessions_ExpiresIdleSessions_Login,
  Session_Sessions_ExpiresIdleSessions_Sessions,
  Session_Sessions_LimitsFailedAttemptsPerAddress_Sessions,
  Session_Sessions_RefusesLoginsWithoutAPassword_Sessions,
  Session_Sessions_SignsInAndOut_Login,
  Session_Sessions_SignsInAndOut_Sessions,
} from './types/session.test.d.ts';

/**
 * Session - Sessions.
 *
 * Exercises login, expiry, logout, the failed-attempt limit, and the
 * locked state with a controllable clock.
 *
 * @since 0.0.1
 */
describe('sessions', () => {
  it('signs in and out', () => {
    const sessions: Session_Sessions_SignsInAndOut_Sessions = new Sessions('admin', 'correct horse', () => 0);
    const login: Session_Sessions_SignsInAndOut_Login = sessions.login('admin', 'correct horse', '10.0.0.1');

    expect(login['outcome']).toBe('success');

    if (('sessionId' in login) === false) {
      return;
    }

    expect(sessions.verify(login['sessionId'])).toStrictEqual({
      csrfToken: login['csrfToken'],
      username: 'admin',
    });

    sessions.logout(login['sessionId']);

    expect(sessions.verify(login['sessionId'])).toBeUndefined();

    expect(sessions.login('admin', 'wrong', '10.0.0.1')['outcome']).toBe('invalid');

    return;
  });

  it('expires idle sessions', () => {
    let clock: Session_Sessions_ExpiresIdleSessions_Clock = 0;
    const sessions: Session_Sessions_ExpiresIdleSessions_Sessions = new Sessions('admin', 'secret', () => clock);
    const login: Session_Sessions_ExpiresIdleSessions_Login = sessions.login('admin', 'secret', '10.0.0.1');

    clock = 31 * 60 * 1000;

    expect(('sessionId' in login) === true && sessions.verify(login['sessionId']) === undefined).toBe(true);

    return;
  });

  it('limits failed attempts per address', () => {
    const sessions: Session_Sessions_LimitsFailedAttemptsPerAddress_Sessions = new Sessions('admin', 'secret', () => 0);

    for (let i = 0; i < 10; i += 1) {
      sessions.login('admin', 'guess', '10.0.0.2');
    }

    expect(sessions.login('admin', 'secret', '10.0.0.2')['outcome']).toBe('rate-limited');

    expect(sessions.login('admin', 'secret', '10.0.0.3')['outcome']).toBe('success');

    return;
  });

  it('refuses logins without a password', () => {
    const sessions: Session_Sessions_RefusesLoginsWithoutAPassword_Sessions = new Sessions('admin', undefined, () => 0);

    expect(sessions.isEnabled()).toBe(false);

    expect(sessions.login('admin', '', '10.0.0.1')['outcome']).toBe('disabled');

    return;
  });

  return;
});

import type { Runner as Sessions } from '../session.js';

/**
 * Session - Sessions - Expires Idle Sessions.
 *
 * @since 0.0.1
 */
export type Session_Sessions_ExpiresIdleSessions_Clock = number;

export type Session_Sessions_ExpiresIdleSessions_Sessions = Sessions;

export type Session_Sessions_ExpiresIdleSessions_Login = ReturnType<Sessions['login']>;

/**
 * Session - Sessions - Limits Failed Attempts Per Address.
 *
 * @since 0.0.1
 */
export type Session_Sessions_LimitsFailedAttemptsPerAddress_Sessions = Sessions;

/**
 * Session - Sessions - Refuses Logins Without A Password.
 *
 * @since 0.0.1
 */
export type Session_Sessions_RefusesLoginsWithoutAPassword_Sessions = Sessions;

/**
 * Session - Sessions - Signs In And Out.
 *
 * @since 0.0.1
 */
export type Session_Sessions_SignsInAndOut_Sessions = Sessions;

export type Session_Sessions_SignsInAndOut_Login = ReturnType<Sessions['login']>;

import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';

import type {
  Session_Runner_Attempts,
  Session_Runner_Constructor_Now,
  Session_Runner_Constructor_Password,
  Session_Runner_Constructor_Username,
  Session_Runner_Digest_Returns,
  Session_Runner_Digest_Value,
  Session_Runner_IsEnabled_Returns,
  Session_Runner_Login_Address,
  Session_Runner_Login_Attempt,
  Session_Runner_Login_CsrfToken,
  Session_Runner_Login_Matches,
  Session_Runner_Login_Password,
  Session_Runner_Login_Returns,
  Session_Runner_Login_SessionId,
  Session_Runner_Login_Username,
  Session_Runner_Logout_Returns,
  Session_Runner_Logout_SessionId,
  Session_Runner_Now,
  Session_Runner_PasswordDigest,
  Session_Runner_Sessions,
  Session_Runner_Username,
  Session_Runner_UsernameDigest,
  Session_Runner_Verify_Returns,
  Session_Runner_Verify_Session,
  Session_Runner_Verify_SessionId,
} from './types/session.d.ts';

/**
 * Session - Lifetime Milliseconds.
 *
 * Idle time after which a dashboard session expires. Every
 * authenticated request extends it.
 *
 * @since 0.0.1
 */
const sessionLifetimeMilliseconds = 30 * 60 * 1000;

/**
 * Session - Attempt Window Milliseconds.
 *
 * Window in which failed logins from one address are counted before
 * further attempts are refused.
 *
 * @since 0.0.1
 */
const attemptWindowMilliseconds = 15 * 60 * 1000;

/**
 * Session - Attempt Limit.
 *
 * Failed logins allowed from one address inside the attempt window
 * before that address must wait.
 *
 * @since 0.0.1
 */
const attemptLimit = 10;

/**
 * Session.
 *
 * In-memory dashboard sessions for the single administrator configured
 * through OUTPOST_ADMIN_USERNAME and OUTPOST_ADMIN_PASSWORD(_FILE),
 * with a CSRF token per session and a failed-login limit per address.
 *
 * @since 0.0.1
 */
export class Runner {
  /**
   * Session - Username.
   *
   * Administrator username, shown in the dashboard header after a
 * successful login.
   *
   * @private
   *
   * @since 0.0.1
   */
  readonly #username: Session_Runner_Username;

  /**
   * Session - Username Digest.
   *
   * SHA-256 of the username, compared in constant time so its length
   * and content cannot be probed through timing.
   *
   * @private
   *
   * @since 0.0.1
   */
  readonly #usernameDigest: Session_Runner_UsernameDigest;

  /**
   * Session - Password Digest.
   *
   * SHA-256 of the configured password, or undefined when no password is
   * set and the dashboard stays locked.
   *
   * @private
   *
   * @since 0.0.1
   */
  readonly #passwordDigest: Session_Runner_PasswordDigest;

  /**
   * Session - Now.
   *
   * Clock in milliseconds, injected so tests can move time forward to
   * check expiry and the attempt window.
   *
   * @private
   *
   * @since 0.0.1
   */
  readonly #now: Session_Runner_Now;

  /**
   * Session - Sessions.
   *
   * Active sessions by ID with their CSRF token and expiry. Sessions do
   * not survive a restart, which simply asks for a new login.
   *
   * @private
   *
   * @since 0.0.1
   */
  readonly #sessions: Session_Runner_Sessions = new Map();

  /**
   * Session - Attempts.
   *
   * Recent failed login times per client address, used to slow down
   * password guessing.
   *
   * @private
   *
   * @since 0.0.1
   */
  readonly #attempts: Session_Runner_Attempts = new Map();

  /**
   * Session - Constructor.
   *
   * Stores digests of the credentials instead of the raw password so the
   * value is only compared, never kept for display.
   *
   * @param {Session_Runner_Constructor_Username} username - Username.
   * @param {Session_Runner_Constructor_Password} password - Password.
   * @param {Session_Runner_Constructor_Now}      now      - Now.
   *
   * @since 0.0.1
   */
  public constructor(username: Session_Runner_Constructor_Username, password: Session_Runner_Constructor_Password, now: Session_Runner_Constructor_Now) {
    this.#username = username;
    this.#usernameDigest = Runner.digest(username);
    this.#passwordDigest = (password !== undefined) ? Runner.digest(password) : undefined;
    this.#now = now;

    return;
  }

  /**
   * Session - Is Enabled.
   *
   * Whether a dashboard password is configured. Without one, logins are
   * refused and the dashboard explains how to set it.
   *
   * @returns {Session_Runner_IsEnabled_Returns}
   *
   * @since 0.0.1
   */
  public isEnabled(): Session_Runner_IsEnabled_Returns {
    return this.#passwordDigest !== undefined;
  }

  /**
   * Session - Login.
   *
   * Checks the credentials in constant time and opens a session. Too many
   * failures from one address are refused until the window passes.
   *
   * @param {Session_Runner_Login_Username} username - Username.
   * @param {Session_Runner_Login_Password} password - Password.
   * @param {Session_Runner_Login_Address}  address  - Address.
   *
   * @returns {Session_Runner_Login_Returns}
   *
   * @since 0.0.1
   */
  public login(username: Session_Runner_Login_Username, password: Session_Runner_Login_Password, address: Session_Runner_Login_Address): Session_Runner_Login_Returns {
    if (this.#passwordDigest === undefined) {
      return { outcome: 'disabled' };
    }

    const attempt: Session_Runner_Login_Attempt = (this.#attempts.get(address) ?? []).filter((time) => this.#now() - time < attemptWindowMilliseconds);

    if (attempt.length >= attemptLimit) {
      return { outcome: 'rate-limited' };
    }

    const matches: Session_Runner_Login_Matches = timingSafeEqual(Runner.digest(username), this.#usernameDigest) === true
      && timingSafeEqual(Runner.digest(password), this.#passwordDigest) === true;

    if (matches === false) {
      this.#attempts.set(address, [
        ...attempt,
        this.#now(),
      ]);

      return { outcome: 'invalid' };
    }

    this.#attempts.delete(address);

    const sessionId: Session_Runner_Login_SessionId = randomBytes(32).toString('base64url');
    const csrfToken: Session_Runner_Login_CsrfToken = randomBytes(32).toString('base64url');

    this.#sessions.set(sessionId, {
      csrfToken,
      expiresAt: this.#now() + sessionLifetimeMilliseconds,
    });

    return {
      outcome: 'success',
      sessionId,
      csrfToken,
      username: this.#username,
    };
  }

  /**
   * Session - Verify.
   *
   * Returns the session for an ID and extends its expiry, or undefined
   * when the ID is unknown or the session has expired.
   *
   * @param {Session_Runner_Verify_SessionId} sessionId - Session id.
   *
   * @returns {Session_Runner_Verify_Returns}
   *
   * @since 0.0.1
   */
  public verify(sessionId: Session_Runner_Verify_SessionId): Session_Runner_Verify_Returns {
    if (sessionId === undefined) {
      return undefined;
    }

    const session: Session_Runner_Verify_Session = this.#sessions.get(sessionId);

    if (session === undefined || session['expiresAt'] <= this.#now()) {
      this.#sessions.delete(sessionId);

      return undefined;
    }

    Reflect.set(session, 'expiresAt', this.#now() + sessionLifetimeMilliseconds);

    return {
      csrfToken: session['csrfToken'],
      username: this.#username,
    };
  }

  /**
   * Session - Logout.
   *
   * Ends a session so its cookie stops working immediately, even if the
 * browser keeps sending it.
   *
   * @param {Session_Runner_Logout_SessionId} sessionId - Session id.
   *
   * @returns {Session_Runner_Logout_Returns}
   *
   * @since 0.0.1
   */
  public logout(sessionId: Session_Runner_Logout_SessionId): Session_Runner_Logout_Returns {
    if (sessionId !== undefined) {
      this.#sessions.delete(sessionId);
    }

    return;
  }

  /**
   * Session - Digest.
   *
   * Hashes a value to a fixed-length buffer so constant-time comparison
   * works for inputs of any length.
   *
   * @param {Session_Runner_Digest_Value} value - Value.
   *
   * @private
   *
   * @returns {Session_Runner_Digest_Returns}
   *
   * @since 0.0.1
   */
  private static digest(value: Session_Runner_Digest_Value): Session_Runner_Digest_Returns {
    return createHash('sha256').update(value).digest();
  }
}

/**
 * Session.
 *
 * @since 0.0.1
 */
export type Session_Runner_Username = string;

export type Session_Runner_UsernameDigest = Buffer;

export type Session_Runner_PasswordDigest = Buffer | undefined;

export type Session_Runner_Now = () => number;

export type Session_Runner_Sessions_Entry_CsrfToken = string;

export type Session_Runner_Sessions_Entry_ExpiresAt = number;

export type Session_Runner_Sessions_Entry = {
  csrfToken: Session_Runner_Sessions_Entry_CsrfToken;
  expiresAt: Session_Runner_Sessions_Entry_ExpiresAt;
};

export type Session_Runner_Sessions = Map<string, Session_Runner_Sessions_Entry>;

export type Session_Runner_Attempt = number;

export type Session_Runner_Attempts = Map<string, Session_Runner_Attempt[]>;

/**
 * Session - Constructor.
 *
 * @since 0.0.1
 */
export type Session_Runner_Constructor_Username = string;

export type Session_Runner_Constructor_Password = string | undefined;

export type Session_Runner_Constructor_Now = () => number;

/**
 * Session - Digest.
 *
 * @since 0.0.1
 */
export type Session_Runner_Digest_Value = string;

export type Session_Runner_Digest_Returns = Buffer;

/**
 * Session - Is Enabled.
 *
 * @since 0.0.1
 */
export type Session_Runner_IsEnabled_Returns = boolean;

/**
 * Session - Login.
 *
 * @since 0.0.1
 */
export type Session_Runner_Login_Username = string;

export type Session_Runner_Login_Password = string;

export type Session_Runner_Login_Address = string;

export type Session_Runner_Login_Result_Failure_Outcome = 'disabled' | 'rate-limited' | 'invalid';

export type Session_Runner_Login_Result_Failure = {
  outcome: Session_Runner_Login_Result_Failure_Outcome;
};

export type Session_Runner_Login_Result_Success_Outcome = 'success';

export type Session_Runner_Login_Result_Success_SessionId = string;

export type Session_Runner_Login_Result_Success_CsrfToken = string;

export type Session_Runner_Login_Result_Success_Username = string;

export type Session_Runner_Login_Result_Success = {
  outcome: Session_Runner_Login_Result_Success_Outcome;
  sessionId: Session_Runner_Login_Result_Success_SessionId;
  csrfToken: Session_Runner_Login_Result_Success_CsrfToken;
  username: Session_Runner_Login_Result_Success_Username;
};

export type Session_Runner_Login_Result = Session_Runner_Login_Result_Failure | Session_Runner_Login_Result_Success;

export type Session_Runner_Login_Returns = Session_Runner_Login_Result;

export type Session_Runner_Login_Attempt = number[];

export type Session_Runner_Login_Matches = boolean;

export type Session_Runner_Login_SessionId = string;

export type Session_Runner_Login_CsrfToken = string;

/**
 * Session - Logout.
 *
 * @since 0.0.1
 */
export type Session_Runner_Logout_SessionId = string | undefined;

export type Session_Runner_Logout_Returns = void;

/**
 * Session - Verify.
 *
 * @since 0.0.1
 */
export type Session_Runner_Verify_SessionId = string | undefined;

export type Session_Runner_Verify_Active_CsrfToken = string;

export type Session_Runner_Verify_Active_Username = string;

export type Session_Runner_Verify_Active = {
  csrfToken: Session_Runner_Verify_Active_CsrfToken;
  username: Session_Runner_Verify_Active_Username;
};

export type Session_Runner_Verify_Returns = Session_Runner_Verify_Active | undefined;

export type Session_Runner_Verify_Session = Session_Runner_Sessions_Entry | undefined;

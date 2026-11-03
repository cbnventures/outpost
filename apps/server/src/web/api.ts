import { z } from 'zod';

import {
  createPasskey,
  getPasskey,
} from '@/web/passkeys.ts';

import type {
  Web_Api_AccountSecurity,
  Web_Api_AuthenticationResponse,
  Web_Api_CheckStarted,
  Web_Api_ClaimInput,
  Web_Api_Container,
  Web_Api_CreatedToken,
  Web_Api_CreateTokenInput,
  Web_Api_ErrorEnvelope,
  Web_Api_ErrorIssue,
  Web_Api_Events_Close,
  Web_Api_Events_Handlers,
  Web_Api_LoginInput,
  Web_Api_LoginResult,
  Web_Api_Overview,
  Web_Api_Passkey,
  Web_Api_PasskeyCeremony,
  Web_Api_Principal,
  Web_Api_RecoveryCodes,
  Web_Api_Registry,
  Web_Api_RegistryInput,
  Web_Api_RegistryUpdateInput,
  Web_Api_RemovedSecret,
  Web_Api_Report,
  Web_Api_Request_Options,
  Web_Api_RuntimeSettings,
  Web_Api_Schema,
  Web_Api_Settings,
  Web_Api_SetupStatus,
  Web_Api_Token,
  Web_Api_TotpSetup,
  Web_Api_UpdateSettingsInput,
  Web_Api_UpdateTokenInput,
} from '@/types/web/api.d.ts';
import type {
  Web_Notifications_CreateInput,
  Web_Notifications_Event,
  Web_Notifications_Target,
  Web_Notifications_TestResult,
  Web_Notifications_UpdateInput,
} from '@/types/web/notifications.d.ts';

/**
 * API - Error envelope schema.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
const errorEnvelopeSchema: Web_Api_Schema<Web_Api_ErrorEnvelope> = z.object({
  error: z.object({
    code: z.string(),
    issues: z.array(z.object({
      field: z.string(),
      message: z.string(),
      path: z.array(z.string()),
    })).optional(),
    message: z.string(),
  }),
});

/**
 * API - Setup status schema.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
const setupStatusSchema: Web_Api_Schema<Web_Api_SetupStatus> = z.object({
  claimExpiresAt: z.string().optional(),
  claimRequired: z.boolean(),
});

/**
 * API - Removed secret schema.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
const removedSecretSchema: Web_Api_Schema<Web_Api_RemovedSecret> = z.object({
  kind: z.enum([
    'authenticator',
    'notification',
    'registry',
  ]),
  name: z.string().optional(),
  notificationId: z.string().optional(),
  registryId: z.string().optional(),
  removedAt: z.string(),
});

/**
 * API - Notification target schema.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
const notificationTargetSchema: Web_Api_Schema<Web_Notifications_Target> = z.object({
  createdAt: z.string(),
  events: z.array(z.string()),
  id: z.string(),
  lastAttemptAt: z.string().nullable(),
  lastError: z.string().nullable(),
  name: z.string(),
  secrets: z.record(z.string(), z.literal(true)),
  secretsMissing: z.array(z.string()),
  service: z.enum([
    'apprise',
    'discord',
    'email',
    'gotify',
    'matrix',
    'ntfy',
    'ntfy-reverse-proxy',
    'pushover',
    'slack',
    'telegram',
    'webhook',
  ]),
  settings: z.record(z.string(), z.string()),
  updatedAt: z.string(),
});

/**
 * API - Notification targets response schema.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
const notificationTargetsResponseSchema = z.object({
  items: z.array(notificationTargetSchema),
});

/**
 * API - Notification events response schema.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
const notificationEventsResponseSchema = z.object({
  items: z.array(z.object({
    defaultEnabled: z.boolean(),
    description: z.string(),
    key: z.string(),
    label: z.string(),
  })),
});

/**
 * API - Notification test schema.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
const notificationTestSchema: Web_Api_Schema<Web_Notifications_TestResult> = z.object({
  delivered: z.boolean(),
  message: z.string().optional(),
});

/**
 * API - Registry schema.
 *
 * Checks one private registry sign-in as the API lists it.
 * The password never comes back, only whether a lost key removed it.
 *
 * @since 1.0.0
 */
const registrySchema: Web_Api_Schema<Web_Api_Registry> = z.object({
  createdAt: z.string(),
  id: z.string(),
  passwordMissing: z.boolean(),
  registry: z.string(),
  updatedAt: z.string(),
  username: z.string(),
});

/**
 * API - Registries response schema.
 *
 * Checks the items envelope the registry list arrives in.
 * The server sorts the sign-ins by registry host.
 *
 * @since 1.0.0
 */
const registriesResponseSchema = z.object({
  items: z.array(registrySchema),
});

/**
 * API - Principal schema.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
const principalSchema: Web_Api_Schema<Web_Api_Principal> = z.object({
  administratorId: z.string().optional(),
  authenticationType: z.enum([
    'session',
    'token',
  ]),
  id: z.string(),
  removedSecrets: z.array(removedSecretSchema).optional(),
  scopes: z.array(z.string()).optional(),
  username: z.string().optional(),
});

/**
 * API - Authentication response schema.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
const authenticationResponseSchema: Web_Api_Schema<Web_Api_AuthenticationResponse> = z.object({
  administrator: z.object({
    id: z.string(),
    username: z.string(),
  }),
  csrfToken: z.string(),
  expiresAt: z.string(),
  status: z.literal('authenticated'),
});

/**
 * API - Login result schema.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
const loginResultSchema: Web_Api_Schema<Web_Api_LoginResult> = z.union([
  authenticationResponseSchema,
  z.object({
    challenge: z.string(),
    expiresAt: z.string(),
    status: z.literal('second_factor_required'),
  }),
]);

/**
 * API - Passkey schema.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
const passkeySchema: Web_Api_Schema<Web_Api_Passkey> = z.object({
  createdAt: z.string(),
  hostname: z.string().nullable(),
  id: z.string(),
  lastUsedAt: z.string().nullable(),
  name: z.string(),
});

/**
 * API - Account security schema.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
const accountSecuritySchema: Web_Api_Schema<Web_Api_AccountSecurity> = z.object({
  hostname: z.string(),
  passkeys: z.array(passkeySchema),
  passkeysAvailable: z.boolean(),
  recoveryCodesRemaining: z.number(),
  totpEnabled: z.boolean(),
  username: z.string(),
});

/**
 * API - TOTP setup schema.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
const totpSetupSchema: Web_Api_Schema<Web_Api_TotpSetup> = z.object({
  expiresAt: z.string(),
  qrCode: z.string(),
  secret: z.string(),
  uri: z.string(),
});

/**
 * API - Recovery codes schema.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
const recoveryCodesSchema: Web_Api_Schema<Web_Api_RecoveryCodes> = z.object({
  recoveryCodes: z.array(z.string()),
});

/**
 * API - Passkey ceremony schema.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
const passkeyCeremonySchema: Web_Api_Schema<Web_Api_PasskeyCeremony> = z.object({
  ceremonyId: z.string(),
  options: z.record(z.string(), z.unknown()),
});

/**
 * API - Scope schema.
 *
 * Encapsulates the related behavior behind one reusable interface.
 * Callers share the same lifecycle and state management.
 *
 * @since 1.0.0
 */
const scopeSchema = z.enum([
  'metrics:read',
  'status:read',
  'updates:run',
]);

/**
 * API - Token schema.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
const tokenSchema: Web_Api_Schema<Web_Api_Token> = z.object({
  createdAt: z.string(),
  expiresAt: z.string().nullable(),
  id: z.string(),
  lastUsedAt: z.string().nullable(),
  name: z.string(),
  scopes: z.array(scopeSchema),
});

/**
 * API - Tokens response schema.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
const tokensResponseSchema = z.object({
  items: z.array(tokenSchema),
});

/**
 * API - Created token schema.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
const createdTokenSchema: Web_Api_Schema<Web_Api_CreatedToken> = z.object({
  plaintext: z.string(),
  token: tokenSchema,
});

/**
 * API - Result status schema.
 *
 * Encapsulates the related behavior behind one reusable interface.
 * Callers share the same lifecycle and state management.
 *
 * @since 1.0.0
 */
const resultStatusSchema = z.enum([
  'available',
  'failed',
  'rolled-back',
  'skipped',
  'up-to-date',
  'updated',
]);

/**
 * API - Report schema.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
const reportSchema: Web_Api_Schema<Web_Api_Report> = z.object({
  error: z.string().nullish(),
  finishedAt: z.string(),
  results: z.array(z.object({
    container: z.string(),
    detail: z.string(),
    image: z.string(),
    status: resultStatusSchema,
  })),
  startedAt: z.string(),
  trigger: z.string().nullish(),
});

/**
 * API - History response schema.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
const historyResponseSchema = z.object({
  items: z.array(reportSchema),
});

/**
 * API - Overview schema.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
const overviewSchema: Web_Api_Schema<Web_Api_Overview> = z.object({
  labelMode: z.enum([
    'opt-in',
    'opt-out',
  ]),
  lastError: z.string().nullish(),
  lastReport: reportSchema.nullish(),
  monitorOnly: z.boolean(),
  nextRun: z.string().nullish(),
  running: z.boolean(),
  schedule: z.string(),
  startedAt: z.string().nullish(),
  timeZone: z.string(),
  totals: z.object({
    cycles: z.number(),
    failed: z.number(),
    updated: z.number(),
  }),
});

/**
 * API - Container schema.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
const containerSchema: Web_Api_Schema<Web_Api_Container> = z.object({
  id: z.string(),
  image: z.string(),
  lastCheckedAt: z.string().nullish(),
  lastDetail: z.string().nullish(),
  lastStatus: resultStatusSchema.nullish(),
  managed: z.boolean(),
  monitorOnly: z.boolean(),
  name: z.string(),
  note: z.string(),
  self: z.boolean(),
  state: z.string(),
});

/**
 * API - Containers response schema.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
const containersResponseSchema = z.object({
  items: z.array(containerSchema),
});

/**
 * API - Runtime settings schema.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
const runtimeSettingsSchema: Web_Api_Schema<Web_Api_RuntimeSettings> = z.object({
  cleanup: z.boolean(),
  healthTimeoutSeconds: z.number(),
  labelMode: z.enum([
    'opt-in',
    'opt-out',
  ]),
  monitorOnly: z.boolean(),
  runOnStart: z.boolean(),
  schedule: z.string(),
  settleSeconds: z.number(),
  stopTimeoutSeconds: z.number(),
});

/**
 * API - Settings response schema.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
const settingsResponseSchema: Web_Api_Schema<Web_Api_Settings> = z.object({
  runtime: runtimeSettingsSchema,
  system: z.object({
    dataDirectory: z.string(),
    dockerHost: z.string(),
    timeZone: z.string(),
  }),
});

/**
 * API - Check started schema.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
const checkStartedSchema: Web_Api_Schema<Web_Api_CheckStarted> = z.object({
  started: z.boolean(),
});

/**
 * API.
 *
 * Keeps the machine-readable code and field issues from the shared error envelope so
 * screens can react to specific failures and show each message next to its field.
 *
 * @since 1.0.0
 */
export class ApiError extends Error {
  /**
   * API - Code.
   *
   * Stores this module-level value in one named location.
   * Related code reuses it instead of duplicating the definition.
   *
   * @since 1.0.0
   */
  public readonly code: string;

  /**
   * API - Status.
   *
   * Stores this module-level value in one named location.
   * Related code reuses it instead of duplicating the definition.
   *
   * @since 1.0.0
   */
  public readonly status: number;

  /**
   * API - Issues.
   *
   * Stores this module-level value in one named location.
   * Related code reuses it instead of duplicating the definition.
   *
   * @since 1.0.0
   */
  public readonly issues: Web_Api_ErrorIssue[];

  /**
   * API - Constructor.
   *
   * Stores this module-level value in one named location.
   * Related code reuses it instead of duplicating the definition.
   *
   * @since 1.0.0
   */
  public constructor(message: string, code: string, status: number, issues: Web_Api_ErrorIssue[]) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.issues = issues;
  }
}

// issueFor returns the message the API attached to one form field, if any.

/**
 * API - Issue for.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 1.0.0
 */
export const issueFor = (caughtError: unknown, field: string): string => {
  if (!(caughtError instanceof ApiError)) {
    return '';
  }

  const issue: Web_Api_ErrorIssue | undefined = caughtError.issues.find(
    (candidate: Web_Api_ErrorIssue): boolean => candidate['field'] === field,
  );

  return (issue === undefined) ? '' : issue['message'];
};

// summaryFor returns the banner text for an error, or nothing when a shown field already carries it.

/**
 * API - Summary for.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 1.0.0
 */
export const summaryFor = (caughtError: unknown, shownFields: string[], fallback: string): string => {
  if (caughtError === null || caughtError === undefined) {
    return '';
  }

  if (caughtError instanceof ApiError && caughtError.issues.some(
    (issue: Web_Api_ErrorIssue): boolean => shownFields.includes(issue['field']),
  )) {
    return '';
  }

  if (caughtError instanceof DOMException && caughtError.name === 'NotAllowedError') {
    return 'The passkey prompt was closed before it finished.';
  }

  if (caughtError instanceof DOMException && caughtError.name === 'InvalidStateError') {
    return 'This device already has a passkey for this account.';
  }

  return (caughtError instanceof Error) ? caughtError.message : fallback;
};

// responseError converts the stable API error envelope into an ApiError.

/**
 * API - Response error.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 1.0.0
 */
const responseError = async (response: Response): Promise<ApiError> => {
  const responseValue: unknown = await response.json().catch(() => undefined);
  const parsedError = errorEnvelopeSchema.safeParse(responseValue);
  if (parsedError.success) {
    return new ApiError(
      parsedError.data['error']['message'],
      parsedError.data['error']['code'],
      response.status,
      parsedError.data['error']['issues'] ?? [],
    );
  }

  return new ApiError(`Request failed with status ${response.status}.`, 'request_failed', response.status, []);
};

// readCookie returns one non-HTTP-only same-origin cookie.

/**
 * API - Reads cookie.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 1.0.0
 */
const readCookie = (name: string): string | undefined => {
  const prefix: string = `${name}=`;
  const parts: string[] = document.cookie.split(';');
  const matchingPart: string | undefined = parts
    .map((part: string): string => part.trim())
    .find((part: string): boolean => part.startsWith(prefix));

  return (matchingPart === undefined) ? undefined : decodeURIComponent(matchingPart.slice(prefix.length));
};

// buildRequest adds the JSON body, the CSRF header for mutations, and same-origin cookies.

/**
 * API - Builds request.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 1.0.0
 */
const buildRequest = (options: Web_Api_Request_Options): RequestInit => {
  const headers: Headers = new Headers(options.headers);
  const method: string = options.method ?? 'GET';

  if (options.body !== undefined) {
    headers.set('Content-Type', 'application/json');
  }

  if (method !== 'GET') {
    const csrfToken: string | undefined = readCookie('outpost_csrf');
    if (csrfToken !== undefined) {
      headers.set('X-CSRF-Token', csrfToken);
    }
  }

  return {
    ...((options.body === undefined) ? {} : { body: JSON.stringify(options.body) }),
    credentials: 'same-origin',
    headers,
    method,
  };
};

// requestJSON performs one same-origin request and validates its response contract.

/**
 * API - Request JSON.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
const requestJSON = async <ResponseValue>(
  path: string,
  schema: Web_Api_Schema<ResponseValue>,
  options: Web_Api_Request_Options = {},
): Promise<ResponseValue> => {
  const response: Response = await fetch(path, buildRequest(options));
  if (!response.ok) {
    throw await responseError(response);
  }

  const responseValue: unknown = await response.json();

  return schema.parse(responseValue);
};

// requestVoid performs one mutation whose successful response has no body.

/**
 * API - Request void.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
const requestVoid = async (
  path: string,
  options: Web_Api_Request_Options,
): Promise<void> => {
  const response: Response = await fetch(path, buildRequest(options));
  if (!response.ok) {
    throw await responseError(response);
  }
};

/**
 * API - Gets setup status.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 1.0.0
 */
export const getSetupStatus = async (): Promise<Web_Api_SetupStatus> => requestJSON(
  '/api/v1/setup/status',
  setupStatusSchema,
);

/**
 * API - Gets current principal.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 1.0.0
 */
export const getCurrentPrincipal = async (): Promise<Web_Api_Principal | null> => {
  const response: Response = await fetch('/api/v1/auth/me', {
    credentials: 'same-origin',
  });
  if (response.status === 401) {
    return null;
  }
  if (!response.ok) {
    throw await responseError(response);
  }

  const responseValue: unknown = await response.json();

  return principalSchema.parse(responseValue);
};

/**
 * API - Claim installation.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
export const claimInstallation = async (
  input: Web_Api_ClaimInput,
): Promise<Web_Api_AuthenticationResponse> => requestJSON(
  '/api/v1/setup/claim',
  authenticationResponseSchema,
  {
    body: {
      claimCode: input['claimCode'].trim(),
      password: input['password'],
      username: input['username'].trim(),
    },
    method: 'POST',
  },
);

/**
 * API - Login.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
export const login = async (
  input: Web_Api_LoginInput,
): Promise<Web_Api_LoginResult> => requestJSON(
  '/api/v1/auth/login',
  loginResultSchema,
  {
    body: {
      password: input['password'],
      username: input['username'].trim(),
    },
    method: 'POST',
  },
);

/**
 * API - Submit second factor.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
export const submitSecondFactor = async (
  challenge: string,
  code: string,
): Promise<Web_Api_AuthenticationResponse> => requestJSON(
  '/api/v1/auth/login/second-factor',
  authenticationResponseSchema,
  {
    body: {
      challenge,
      code: code.trim(),
    },
    method: 'POST',
  },
);

/**
 * API - Sign in with passkey.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 1.0.0
 */
export const signInWithPasskey = async (): Promise<Web_Api_AuthenticationResponse> => {
  const ceremony: Web_Api_PasskeyCeremony = await requestJSON(
    '/api/v1/auth/passkeys/login/options',
    passkeyCeremonySchema,
    { method: 'POST' },
  );
  const credential: Record<string, unknown> = await getPasskey(ceremony['options']);

  return requestJSON(
    '/api/v1/auth/passkeys/login/verify',
    authenticationResponseSchema,
    {
      body: {
        ceremonyId: ceremony['ceremonyId'],
        credential,
      },
      method: 'POST',
    },
  );
};

/**
 * API - Logout.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 1.0.0
 */
export const logout = async (): Promise<void> => requestVoid(
  '/api/v1/auth/logout',
  { method: 'POST' },
);

/**
 * API - Dismiss removed secrets.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 1.0.0
 */
export const dismissRemovedSecrets = async (): Promise<void> => requestVoid(
  '/api/v1/auth/removed-secrets',
  { method: 'DELETE' },
);

/**
 * API - Gets account security.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 1.0.0
 */
export const getAccountSecurity = async (): Promise<Web_Api_AccountSecurity> => requestJSON(
  '/api/v1/auth/security',
  accountSecuritySchema,
);

/**
 * API - Change password.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
export const changePassword = async (
  currentPassword: string,
  newPassword: string,
): Promise<void> => requestVoid(
  '/api/v1/auth/password',
  {
    body: {
      currentPassword,
      newPassword,
    },
    method: 'POST',
  },
);

/**
 * API - Change username.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
export const changeUsername = async (
  username: string,
  password: string,
): Promise<void> => {
  await requestJSON(
    '/api/v1/auth/username',
    z.object({
      administrator: z.object({
        id: z.string(),
        username: z.string(),
      }),
    }),
    {
      body: {
        password,
        username: username.trim(),
      },
      method: 'POST',
    },
  );
};

/**
 * API - Starts TOTP setup.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 1.0.0
 */
export const startTotpSetup = async (password: string): Promise<Web_Api_TotpSetup> => requestJSON(
  '/api/v1/auth/totp/setup',
  totpSetupSchema,
  {
    body: { password },
    method: 'POST',
  },
);

/**
 * API - Enable TOTP.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 1.0.0
 */
export const enableTotp = async (code: string): Promise<Web_Api_RecoveryCodes> => requestJSON(
  '/api/v1/auth/totp/enable',
  recoveryCodesSchema,
  {
    body: { code: code.trim() },
    method: 'POST',
  },
);

/**
 * API - Disable TOTP.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 1.0.0
 */
export const disableTotp = async (password: string): Promise<void> => requestVoid(
  '/api/v1/auth/totp/disable',
  {
    body: { password },
    method: 'POST',
  },
);

/**
 * API - Regenerate recovery codes.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 1.0.0
 */
export const regenerateRecoveryCodes = async (password: string): Promise<Web_Api_RecoveryCodes> => requestJSON(
  '/api/v1/auth/recovery-codes',
  recoveryCodesSchema,
  {
    body: { password },
    method: 'POST',
  },
);

/**
 * API - Adds passkey.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 1.0.0
 */
export const addPasskey = async (name: string, password: string): Promise<Web_Api_Passkey> => {
  const ceremony: Web_Api_PasskeyCeremony = await requestJSON(
    '/api/v1/auth/passkeys/register/options',
    passkeyCeremonySchema,
    {
      body: {
        name: name.trim(),
        password,
      },
      method: 'POST',
    },
  );
  const credential: Record<string, unknown> = await createPasskey(ceremony['options']);

  return requestJSON(
    '/api/v1/auth/passkeys/register/verify',
    passkeySchema,
    {
      body: {
        ceremonyId: ceremony['ceremonyId'],
        credential,
      },
      method: 'POST',
    },
  );
};

/**
 * API - Removes passkey.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 1.0.0
 */
export const removePasskey = async (passkeyId: string, password: string): Promise<void> => requestVoid(
  `/api/v1/auth/passkeys/${encodeURIComponent(passkeyId)}`,
  {
    body: { password },
    method: 'DELETE',
  },
);

/**
 * API - Gets overview.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 1.0.0
 */
export const getOverview = async (): Promise<Web_Api_Overview> => requestJSON(
  '/api/v1/overview',
  overviewSchema,
);

/**
 * API - Gets containers.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 1.0.0
 */
export const getContainers = async (): Promise<Web_Api_Container[]> => {
  const response = await requestJSON('/api/v1/containers', containersResponseSchema);

  return response['items'];
};

/**
 * API - Gets history.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 1.0.0
 */
export const getHistory = async (): Promise<Web_Api_Report[]> => {
  const response = await requestJSON('/api/v1/history', historyResponseSchema);

  return response['items'];
};

/**
 * API - Gets settings.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 1.0.0
 */
export const getSettings = async (): Promise<Web_Api_Settings> => requestJSON('/api/v1/settings', settingsResponseSchema);

/**
 * API - Updates settings.
 *
 * Persists editable runtime behavior and returns the complete current settings document.
 * The browser session and CSRF token protect this administrative mutation.
 *
 * @since 1.0.0
 */
export const updateSettings = async (input: Web_Api_UpdateSettingsInput): Promise<Web_Api_Settings> => requestJSON(
  '/api/v1/settings',
  settingsResponseSchema,
  {
    body: input,
    method: 'PUT',
  },
);

/**
 * API - Starts check.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 1.0.0
 */
export const startCheck = async (containerId?: string): Promise<Web_Api_CheckStarted> => requestJSON(
  '/api/v1/checks',
  checkStartedSchema,
  {
    body: (containerId === undefined) ? {} : { containerId },
    method: 'POST',
  },
);

/**
 * API - Gets tokens.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 1.0.0
 */
export const getTokens = async (): Promise<Web_Api_Token[]> => {
  const response = await requestJSON('/api/v1/auth/tokens', tokensResponseSchema);

  return response['items'];
};

/**
 * API - Create token.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
export const createToken = async (
  input: Web_Api_CreateTokenInput,
): Promise<Web_Api_CreatedToken> => requestJSON(
  '/api/v1/auth/tokens',
  createdTokenSchema,
  {
    body: {
      ...((input['expiresAt'] === undefined) ? {} : { expiresAt: input['expiresAt'] }),
      name: input['name'].trim(),
      scopes: input['scopes'],
    },
    method: 'POST',
  },
);

/**
 * API - Update token.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
export const updateToken = async (
  tokenId: string,
  input: Web_Api_UpdateTokenInput,
): Promise<Web_Api_Token> => requestJSON(
  `/api/v1/auth/tokens/${encodeURIComponent(tokenId)}`,
  tokenSchema,
  {
    body: {
      ...((input['expiresAt'] === undefined) ? {} : { expiresAt: input['expiresAt'] }),
      name: input['name'].trim(),
      scopes: input['scopes'],
    },
    method: 'PUT',
  },
);

/**
 * API - Revoke token.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 1.0.0
 */
export const revokeToken = async (tokenId: string): Promise<void> => requestVoid(
  `/api/v1/auth/tokens/${encodeURIComponent(tokenId)}`,
  { method: 'DELETE' },
);

/**
 * API - Gets notifications.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 1.0.0
 */
export const getNotifications = async (): Promise<Web_Notifications_Target[]> => {
  const response = await requestJSON('/api/v1/notifications', notificationTargetsResponseSchema);

  return response['items'];
};

/**
 * API - Gets notification events.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 1.0.0
 */
export const getNotificationEvents = async (): Promise<Web_Notifications_Event[]> => {
  const response = await requestJSON('/api/v1/notifications/events', notificationEventsResponseSchema);

  return response['items'];
};

/**
 * API - Create notification.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
export const createNotification = async (
  input: Web_Notifications_CreateInput,
): Promise<Web_Notifications_Target> => requestJSON(
  '/api/v1/notifications',
  notificationTargetSchema,
  {
    body: {
      events: input['events'],
      name: input['name'].trim(),
      service: input['service'],
      settings: input['settings'],
    },
    method: 'POST',
  },
);

/**
 * API - Update notification.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
export const updateNotification = async (
  notificationId: string,
  input: Web_Notifications_UpdateInput,
): Promise<Web_Notifications_Target> => requestJSON(
  `/api/v1/notifications/${encodeURIComponent(notificationId)}`,
  notificationTargetSchema,
  {
    body: {
      clearSecrets: input['clearSecrets'],
      events: input['events'],
      name: input['name'].trim(),
      settings: input['settings'],
    },
    method: 'PUT',
  },
);

/**
 * API - Removes notification.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 1.0.0
 */
export const removeNotification = async (notificationId: string): Promise<void> => requestVoid(
  `/api/v1/notifications/${encodeURIComponent(notificationId)}`,
  { method: 'DELETE' },
);

/**
 * API - Test notification.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 1.0.0
 */
export const testNotification = async (notificationId: string): Promise<Web_Notifications_TestResult> => requestJSON(
  `/api/v1/notifications/${encodeURIComponent(notificationId)}/test`,
  notificationTestSchema,
  { method: 'POST' },
);

/**
 * API - Gets registries.
 *
 * Lists the private registry sign-ins Outpost uses for checks and pulls.
 * Only a signed-in browser session can read them, and passwords never come back.
 *
 * @since 1.0.0
 */
export const getRegistries = async (): Promise<Web_Api_Registry[]> => {
  const response = await requestJSON('/api/v1/registries', registriesResponseSchema);

  return response['items'];
};

/**
 * API - Create registry.
 *
 * Saves a sign-in for one registry host and returns it without the password.
 * A host that already has a sign-in is refused with an issue on the registry field.
 *
 * @since 1.0.0
 */
export const createRegistry = async (
  input: Web_Api_RegistryInput,
): Promise<Web_Api_Registry> => requestJSON(
  '/api/v1/registries',
  registrySchema,
  {
    body: {
      password: input['password'],
      registry: input['registry'].trim(),
      username: input['username'].trim(),
    },
    method: 'POST',
  },
);

/**
 * API - Update registry.
 *
 * Changes a sign-in's host and username, and its password only when a new one is given.
 * Leaving the password out keeps the saved one.
 *
 * @since 1.0.0
 */
export const updateRegistry = async (
  registryId: string,
  input: Web_Api_RegistryUpdateInput,
): Promise<Web_Api_Registry> => requestJSON(
  `/api/v1/registries/${encodeURIComponent(registryId)}`,
  registrySchema,
  {
    body: {
      ...((input['password'] === undefined) ? {} : { password: input['password'] }),
      registry: input['registry'].trim(),
      username: input['username'].trim(),
    },
    method: 'PUT',
  },
);

/**
 * API - Removes registry.
 *
 * Deletes one sign-in so later checks reach that registry without a login.
 * Other sign-ins are unaffected.
 *
 * @since 1.0.0
 */
export const removeRegistry = async (registryId: string): Promise<void> => requestVoid(
  `/api/v1/registries/${encodeURIComponent(registryId)}`,
  { method: 'DELETE' },
);

// parseEventData reads one event's JSON, or nothing when it isn't JSON.

/**
 * API - Parses event data.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 1.0.0
 */
const parseEventData = (data: string): unknown => {
  try {
    return JSON.parse(data);
  } catch {
    return undefined;
  }
};

// connectEvents follows the live stream: the scheduler state on connect and on every change, and each finished check.

/**
 * API - Connect events.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 1.0.0
 */
export const connectEvents = (handlers: Web_Api_Events_Handlers): Web_Api_Events_Close => {
  const source: EventSource = new EventSource('/api/v1/events');
  let opened: boolean = false;

  source.addEventListener('open', (): void => {
    // A second open is a reconnect, and checks that finished in between were missed.
    if (opened) {
      handlers.onReconnect();
    }

    opened = true;
  });

  source.addEventListener('state', (event: MessageEvent<string>): void => {
    const parsedState = overviewSchema.safeParse(parseEventData(event.data));
    if (parsedState.success) {
      handlers.onState(parsedState.data);
    }
  });

  source.addEventListener('check', (event: MessageEvent<string>): void => {
    const parsedReport = reportSchema.safeParse(parseEventData(event.data));
    if (parsedReport.success) {
      handlers.onCheck(parsedReport.data);
    }
  });

  source.addEventListener('error', (): void => {
    // EventSource retries on its own; once it gives up, for example after a 401, the stream stays closed.
    if (source.readyState === EventSource.CLOSED) {
      handlers.onClosed();
    }
  });

  return (): void => {
    source.close();
  };
};

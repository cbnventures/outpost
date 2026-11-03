import { Cron } from 'croner';
import { normalizeRegistryHost } from 'outpost-package-registry';
import { z } from 'zod';

import {
  base64UrlPattern,
  containerIdPattern,
  personalAccessTokenIdPattern,
  registryHostPattern,
  registryIdPattern,
  scryptPasswordHashPattern,
  sha256HashPattern,
  totpCodePattern,
  usernamePattern,
} from '../regex.js';
import { notificationServiceSchema } from './notifications.js';

/**
 * Lib - Schema - Expiry Format Message.
 *
 * Explains the accepted expiry format when a value can't be read as a date and time.
 * The example shows the time zone the value must carry.
 *
 * @since 1.0.0
 */
const expiryFormatMessage = 'Use an ISO 8601 date and time with a time zone, like 2030-01-01T00:00:00Z.';

/**
 * Lib - Schema - Username Rule Message.
 *
 * Describes the username rule in the words the sibling apps use, both for a
 * name that is too short and for one with characters outside the rule.
 *
 * @since 1.0.0
 */
const usernameRuleMessage = 'Use 3 to 64 letters, numbers, periods, underscores, or hyphens, starting with a letter or number.';

/**
 * Lib - Schema - Offset Date Time.
 *
 * Reads an ISO 8601 date and time that carries Z or a numeric time zone offset.
 * Values without a time zone are refused, so an expiry never shifts with the server clock.
 *
 * @since 1.0.0
 */
const offsetDateTime = z.iso.datetime({ offset: true });

/**
 * Lib - Schema - Future Date Time.
 *
 * Validates an offset-aware timestamp that has not already passed.
 * An unreadable value gets only the format message, never the future one too.
 *
 * @since 1.0.0
 */
const futureDateTime = z.string({ error: expiryFormatMessage }).superRefine((value, context) => {
  if (offsetDateTime.safeParse(value).success === false) {
    context.addIssue({
      code: 'custom',
      message: expiryFormatMessage,
    });

    return;
  }

  if (Date.parse(value) <= Date.now()) {
    context.addIssue({
      code: 'custom',
      message: 'Choose an expiration date in the future.',
    });
  }

  return;
});

/**
 * Lib - Schema - Administrator Password.
 *
 * Applies the shared password policy for setup and password changes.
 * Length is the only rule, so long passphrases are always accepted.
 *
 * @since 1.0.0
 */
const administratorPassword = z.string({ error: 'Use at least 12 characters.' })
  .min(12, 'Use at least 12 characters.')
  .max(1024, 'Use 1024 characters or fewer.');

/**
 * Lib - Schema - Administrator Username.
 *
 * Applies the username rule shared with the sibling apps for setup and changes.
 * A missing name gets its own message instead of the rule.
 *
 * @since 1.0.0
 */
const administratorUsername = z.string({ error: 'Enter a username.' })
  .trim()
  .min(1, {
    abort: true,
    error: 'Enter a username.',
  })
  .regex(usernamePattern, usernameRuleMessage);

/**
 * Lib - Schema - Confirmation Password.
 *
 * Accepts the current password typed to confirm a sensitive change.
 * The value is only compared with the stored hash, so no policy applies.
 *
 * @since 1.0.0
 */
const confirmationPassword = z.string({ error: 'Enter your password.' })
  .min(1, 'Enter your password.')
  .max(1024, 'Use 1024 characters or fewer.');

/**
 * Lib - Schema - Ceremony Identifier.
 *
 * Bounds the opaque identifier that links a browser prompt to its stored challenge.
 * The identifier is random and carries no account information.
 *
 * @since 1.0.0
 */
const ceremonyIdentifier = z.string().min(32).max(128).regex(base64UrlPattern);

/**
 * Lib - Schema - Personal Access Token Name.
 *
 * Defines the friendly label given to a token, like the app that uses it.
 * It follows the passkey name rule and is unique ignoring letter case.
 *
 * @since 1.0.0
 */
const personalAccessTokenName = z.string({ error: 'Name this token.' })
  .trim()
  .min(1, 'Name this token.')
  .max(80, 'Use 80 characters or fewer.');

/**
 * Lib - Schema - Personal Access Token Scope.
 *
 * Defines the closed capabilities that can be granted to API clients.
 * Route authorization never accepts a scope string nobody reviewed.
 *
 * @since 1.0.0
 */
export const personalAccessTokenScope = z.enum([
  'metrics:read',
  'status:read',
  'updates:run',
], { error: 'Choose from: metrics:read, status:read, updates:run.' });

/**
 * Lib - Schema - Personal Access Token Scopes.
 *
 * Requires at least one scope for every token, each named once.
 * Duplicates are rejected so stored scope rows stay unambiguous.
 *
 * @since 1.0.0
 */
const personalAccessTokenScopes = z.array(personalAccessTokenScope, { error: 'Choose at least one scope.' })
  .min(1, 'Choose at least one scope.')
  .refine((scopes) => new Set(scopes).size === scopes.length, { message: 'Choose each scope only once.' });

/**
 * Lib - Schema - Personal Access Token Identifier.
 *
 * Defines the generated identifier used in the token edit and revoke routes.
 * Identifiers of any other shape could never exist.
 *
 * @since 1.0.0
 */
export const personalAccessTokenIdentifier = z.string().regex(personalAccessTokenIdPattern);

/**
 * Lib - Schema - Passkey Credential Identifier.
 *
 * Defines the bounded Base64URL identifier shared by WebAuthn responses and routes.
 * Credential identifiers are public metadata but remain structurally validated.
 *
 * @since 1.0.0
 */
export const passkeyCredentialIdentifier = z.string().min(1).max(2048).regex(base64UrlPattern);

/**
 * Lib - Schema - Registry Host.
 *
 * Validates the registry a sign-in belongs to, after reducing it to the host lookups use.
 * A pasted address such as https://index.docker.io/v1/ is saved as docker.io.
 *
 * @since 1.0.0
 */
const registryHost = z.string({ error: 'Enter a registry host, like ghcr.io.' })
  .overwrite(normalizeRegistryHost)
  .min(1, {
    abort: true,
    error: 'Enter a registry host, like ghcr.io.',
  })
  .max(255, {
    abort: true,
    error: 'Use 255 characters or fewer.',
  })
  .regex(registryHostPattern, 'Use a host name with an optional port, like registry.example.com:5000.');

/**
 * Lib - Schema - Registry Username.
 *
 * Validates the account name a registry sign-in uses.
 * Registries have their own rules for names, so only the length is checked.
 *
 * @since 1.0.0
 */
const registryUsername = z.string({ error: 'Enter a username.' })
  .trim()
  .min(1, 'Enter a username.')
  .max(255, 'Use 255 characters or fewer.');

/**
 * Lib - Schema - Registry Password.
 *
 * Validates the password or access token a registry sign-in uses.
 * It is sealed with the encryption key and never returned.
 *
 * @since 1.0.0
 */
const registryPassword = z.string({ error: 'Enter a password or access token.' })
  .min(1, 'Enter a password or access token.')
  .max(4096, 'Use 4096 characters or fewer.');

/**
 * Lib - Schema - Check Start.
 *
 * Validates the optional container a check is limited to.
 * Without one, the check covers every managed container.
 *
 * @since 1.0.0
 */
export const checkStart = z.strictObject({
  containerId: z.string({ error: 'Use a container ID of 12 to 64 hexadecimal characters.' })
    .regex(containerIdPattern, 'Use a container ID of 12 to 64 hexadecimal characters.')
    .optional(),
}, { error: 'Check the highlighted fields.' });

/**
 * Lib - Schema - Runtime Settings.
 *
 * Validates the behavior saved from the Settings page. The cron expression is
 * parsed before anything is written so a bad schedule cannot disable checks.
 *
 * @since 1.0.0
 */
export const runtimeSettings = z.strictObject({
  schedule: z.string({ error: 'Enter a schedule.' })
    .trim()
    .min(1, 'Enter a schedule.')
    .refine((schedule) => {
      try {
        return new Cron(schedule) instanceof Cron;
      } catch {
        return false;
      }
    }, 'Enter a valid cron expression.'),
  runOnStart: z.boolean({ error: 'Choose whether to check when Outpost starts.' }),
  labelMode: z.enum([
    'opt-in',
    'opt-out',
  ], { error: 'Choose opt-in or opt-out.' }),
  monitorOnly: z.boolean({ error: 'Choose whether Outpost should only monitor updates.' }),
  cleanup: z.boolean({ error: 'Choose whether Outpost should remove old images.' }),
  stopTimeoutSeconds: z.number({ error: 'Enter a stop timeout.' }).int('Use whole seconds.').positive('Use at least 1 second.'),
  healthTimeoutSeconds: z.number({ error: 'Enter a health timeout.' }).int('Use whole seconds.').positive('Use at least 1 second.'),
  settleSeconds: z.number({ error: 'Enter a settle period.' }).int('Use whole seconds.').positive('Use at least 1 second.'),
}, { error: 'Check the highlighted fields.' });

/**
 * Lib - Schema - Legacy Account File.
 *
 * Validates the account.json file written before the account moved into SQLite.
 * Only a well-formed username and scrypt hash are imported.
 *
 * @since 1.0.0
 */
export const legacyAccountFile = z.object({
  passwordHash: z.string().regex(scryptPasswordHashPattern),
  username: z.string().regex(usernamePattern),
});

/**
 * Lib - Schema - Passkey Registration Start.
 *
 * Names a credential and requires the current password before it is added.
 * Names are display-only and never take part in credential verification.
 *
 * @since 1.0.0
 */
export const passkeyRegistrationStart = z.strictObject({
  name: z.string({ error: 'Name this passkey.' }).trim().min(1, 'Name this passkey.').max(80, 'Use 80 characters or fewer.'),
  password: confirmationPassword,
}, { error: 'Check the highlighted fields.' });

/**
 * Lib - Schema - Webauthn Registration Response.
 *
 * Bounds the browser's JSON-safe public-key credential before cryptographic verification.
 * Unknown fields that newer browsers add are dropped, and a null attachment means none.
 *
 * @since 1.0.0
 */
export const webauthnRegistrationResponse = z.object({
  authenticatorAttachment: z.enum([
    'cross-platform',
    'platform',
  ]).nullable().optional().transform((value) => value ?? undefined),
  clientExtensionResults: z.record(z.string(), z.unknown()),
  id: passkeyCredentialIdentifier,
  rawId: passkeyCredentialIdentifier,
  response: z.object({
    attestationObject: z.string().min(1).max(65536).regex(base64UrlPattern),
    authenticatorData: z.string().min(1).max(65536).regex(base64UrlPattern).optional(),
    clientDataJSON: z.string().min(1).max(65536).regex(base64UrlPattern),
    publicKey: z.string().min(1).max(65536).regex(base64UrlPattern).optional(),
    publicKeyAlgorithm: z.number().int().optional(),
    transports: z.array(z.string().min(1).max(32)).max(16).optional(),
  }),
  type: z.literal('public-key'),
});

/**
 * Lib - Schema - Webauthn Authentication Response.
 *
 * Bounds an assertion before its signature, origin, relying party, and counter are checked.
 * A missing or null user handle fails the later check against the stored administrator.
 *
 * @since 1.0.0
 */
export const webauthnAuthenticationResponse = z.object({
  authenticatorAttachment: z.enum([
    'cross-platform',
    'platform',
  ]).nullable().optional().transform((value) => value ?? undefined),
  clientExtensionResults: z.record(z.string(), z.unknown()),
  id: passkeyCredentialIdentifier,
  rawId: passkeyCredentialIdentifier,
  response: z.object({
    authenticatorData: z.string().min(1).max(65536).regex(base64UrlPattern),
    clientDataJSON: z.string().min(1).max(65536).regex(base64UrlPattern),
    signature: z.string().min(1).max(65536).regex(base64UrlPattern),
    userHandle: z.string().min(1).max(128).regex(base64UrlPattern).nullable().optional().transform((value) => value ?? undefined),
  }),
  type: z.literal('public-key'),
});

/**
 * Lib - Schema - Passkey Registration Verify.
 *
 * Couples one browser attestation with its short-lived stored ceremony.
 * WebAuthn cryptographic verification runs only after this structural boundary.
 *
 * @since 1.0.0
 */
export const passkeyRegistrationVerify = z.strictObject({
  ceremonyId: ceremonyIdentifier,
  credential: webauthnRegistrationResponse,
});

/**
 * Lib - Schema - Passkey Sign In Verify.
 *
 * Couples one browser assertion with its anonymous short-lived sign-in ceremony.
 * Credential ownership is resolved only from verified stored state.
 *
 * @since 1.0.0
 */
export const passkeySignInVerify = z.strictObject({
  ceremonyId: ceremonyIdentifier,
  credential: webauthnAuthenticationResponse,
});

/**
 * Lib - Schema - Password Change.
 *
 * Requires the current password next to the replacement.
 * The new password follows the same policy as first-run setup.
 *
 * @since 1.0.0
 */
export const passwordChange = z.strictObject({
  currentPassword: z.string({ error: 'Enter your current password.' }).min(1, 'Enter your current password.').max(1024, 'Use 1024 characters or fewer.'),
  newPassword: administratorPassword,
}, { error: 'Check the highlighted fields.' });

/**
 * Lib - Schema - Password Confirmation.
 *
 * Carries the current password for changes to sign-in methods.
 * A stolen browser session alone cannot weaken or take over the account.
 *
 * @since 1.0.0
 */
export const passwordConfirmation = z.strictObject({
  password: confirmationPassword,
}, { error: 'Check the highlighted fields.' });

/**
 * Lib - Schema - Registry Create.
 *
 * Validates a new private registry sign-in from the Settings page.
 * Each registry host can have one sign-in.
 *
 * @since 1.0.0
 */
export const registryCreate = z.strictObject({
  password: registryPassword,
  registry: registryHost,
  username: registryUsername,
}, { error: 'Check the highlighted fields.' });

/**
 * Lib - Schema - Registry Update.
 *
 * Validates a changed registry sign-in. A password left out keeps the saved
 * one, so the dashboard never needs to show it.
 *
 * @since 1.0.0
 */
export const registryUpdate = z.strictObject({
  password: registryPassword.optional(),
  registry: registryHost,
  username: registryUsername,
}, { error: 'Check the highlighted fields.' });

/**
 * Lib - Schema - Setup Claim.
 *
 * Validates the one-time code and the first account created on a new container.
 * The code itself is normalized and compared against its digest in memory.
 *
 * @since 1.0.0
 */
export const setupClaim = z.strictObject({
  claimCode: z.string({ error: 'Enter the setup code from the container log.' }).trim().min(1, 'Enter the setup code from the container log.'),
  password: administratorPassword,
  username: administratorUsername,
}, { error: 'Check the highlighted fields.' });

/**
 * Lib - Schema - Sign In.
 *
 * Validates the credentials used to start a browser session.
 * The password is compared against a slow stored hash and never kept.
 *
 * @since 1.0.0
 */
export const signIn = z.strictObject({
  password: z.string({ error: 'Enter your password.' }).min(1, 'Enter your password.'),
  username: z.string({ error: 'Enter your username.' }).trim().min(1, 'Enter your username.'),
}, { error: 'Check the highlighted fields.' });

/**
 * Lib - Schema - Sign In Second Factor.
 *
 * Pairs the password step's challenge with an authenticator or recovery code.
 * The challenge is opaque and only works with its stored server-side record.
 *
 * @since 1.0.0
 */
export const signInSecondFactor = z.strictObject({
  challenge: ceremonyIdentifier,
  code: z.string({ error: 'Enter the code from your authenticator app, or a recovery code.' }).trim().min(1, 'Enter the code from your authenticator app, or a recovery code.'),
}, { error: 'Check the highlighted fields.' });

/**
 * Lib - Schema - Token Create.
 *
 * Validates the token details accepted from the dashboard.
 * Token values stay server-generated so browser input cannot reduce their entropy.
 *
 * @since 1.0.0
 */
export const tokenCreate = z.strictObject({
  expiresAt: futureDateTime.nullable().optional(),
  name: personalAccessTokenName,
  scopes: personalAccessTokenScopes,
}, { error: 'Check the highlighted fields.' });

/**
 * Lib - Schema - Token Update.
 *
 * Validates the name, scopes, and expiry that can change on a token.
 * Identifiers and token hashes stay the same so a revoked token stays revoked.
 *
 * @since 1.0.0
 */
export const tokenUpdate = z.strictObject({
  expiresAt: futureDateTime.nullable().optional(),
  name: personalAccessTokenName,
  scopes: personalAccessTokenScopes,
}, { error: 'Check the highlighted fields.' });

/**
 * Lib - Schema - Totp Enable.
 *
 * Accepts the first code from the authenticator app to finish its setup.
 * A correct code proves the app holds the secret shown on screen.
 *
 * @since 1.0.0
 */
export const totpEnable = z.strictObject({
  code: z.string({ error: 'Enter the 6-digit code from your app.' }).trim().regex(totpCodePattern, 'Enter the 6-digit code from your app.'),
}, { error: 'Check the highlighted fields.' });

/**
 * Lib - Schema - Username Change.
 *
 * Requires the current password before the account is renamed.
 * The new username follows the same rule as first-run setup.
 *
 * @since 1.0.0
 */
export const usernameChange = z.strictObject({
  password: confirmationPassword,
  username: administratorUsername,
}, { error: 'Check the highlighted fields.' });

/**
 * Lib - Schema - Stored Administrator.
 *
 * Validates one administrator row read from SQLite before authentication uses it.
 * The password hash stays internal and is removed from every browser response.
 *
 * @since 1.0.0
 */
export const storedAdministrator = z.strictObject({
  createdAt: offsetDateTime,
  id: z.uuid(),
  passwordHash: z.string().min(1),
  updatedAt: offsetDateTime,
  username: z.string().regex(usernamePattern),
});

/**
 * Lib - Schema - Stored Administrator Totp.
 *
 * Validates the encrypted authenticator record read from SQLite.
 * Plaintext secrets never enter the stored representation.
 *
 * @since 1.0.0
 */
export const storedAdministratorTotp = z.strictObject({
  administratorId: z.uuid(),
  createdAt: offsetDateTime,
  lastUsedStep: z.number().int().nonnegative().nullable(),
  secretAuthTag: z.string().min(1),
  secretCiphertext: z.string().min(1),
  secretIv: z.string().min(1),
});

/**
 * Lib - Schema - Stored Administrator Passkey.
 *
 * Validates a verified WebAuthn credential and its replay counter from SQLite.
 * The RP ID records the hostname the passkey was created on.
 *
 * @since 1.0.0
 */
export const storedAdministratorPasskey = z.strictObject({
  administratorId: z.uuid(),
  backedUp: z.boolean(),
  counter: z.number().int().nonnegative(),
  createdAt: offsetDateTime,
  deviceType: z.enum([
    'multiDevice',
    'singleDevice',
  ]),
  id: passkeyCredentialIdentifier,
  lastUsedAt: offsetDateTime.nullable(),
  name: z.string().min(1).max(80),
  publicKey: z.instanceof(Uint8Array),
  rpId: z.string().min(1).max(253).nullable(),
  transports: z.array(z.string().min(1).max(32)).max(16),
});

/**
 * Lib - Schema - Stored Personal Access Token.
 *
 * Validates one hashed access token read from SQLite before authentication uses it.
 * Raw token values never enter this representation.
 *
 * @since 1.0.0
 */
export const storedPersonalAccessToken = z.strictObject({
  createdAt: offsetDateTime,
  expiresAt: offsetDateTime.optional(),
  id: personalAccessTokenIdentifier,
  name: z.string().min(1).max(80),
  scopes: z.array(personalAccessTokenScope).min(1),
  tokenHash: z.string().regex(sha256HashPattern),
});

/**
 * Lib - Schema - Stored Notification Keys.
 *
 * Validates a JSON list of event keys or field names stored with a destination.
 * Each entry is a short identifier, never a secret value.
 *
 * @since 1.0.0
 */
export const storedNotificationKeys = z.array(z.string().min(1).max(64));

/**
 * Lib - Schema - Stored Notification Target.
 *
 * Validates one notification destination row read from SQLite.
 * Lists and settings stay JSON text here and are parsed on their own.
 *
 * @since 1.0.0
 */
export const storedNotificationTarget = z.strictObject({
  createdAt: offsetDateTime,
  events: z.string(),
  id: z.string().min(1),
  lastAttemptAt: offsetDateTime.nullable(),
  lastError: z.string().nullable(),
  missingSecrets: z.string(),
  name: z.string().min(1).max(80),
  secretFields: z.string(),
  secretsAuthTag: z.string().min(1).nullable(),
  secretsCiphertext: z.string().min(1).nullable(),
  secretsIv: z.string().min(1).nullable(),
  service: notificationServiceSchema,
  settings: z.string(),
  updatedAt: offsetDateTime,
});

/**
 * Lib - Schema - Stored Notification Values.
 *
 * Validates the plain settings or opened secrets of one destination.
 * Every value is text, as the service fields are.
 *
 * @since 1.0.0
 */
export const storedNotificationValues = z.record(z.string(), z.string());

/**
 * Lib - Schema - Stored Registry Credential.
 *
 * Validates one private registry sign-in row read from SQLite.
 * The password stays sealed, and a lost key leaves its three columns empty.
 *
 * @since 1.0.0
 */
export const storedRegistryCredential = z.strictObject({
  createdAt: offsetDateTime,
  id: z.string().regex(registryIdPattern),
  passwordAuthTag: z.string().min(1).nullable(),
  passwordCiphertext: z.string().min(1).nullable(),
  passwordIv: z.string().min(1).nullable(),
  registry: z.string().min(1).max(255),
  updatedAt: offsetDateTime,
  username: z.string().min(1).max(255),
});

/**
 * Lib - Schema - Stored Removed Secret.
 *
 * Validates one record of a secret removed with a lost encryption key.
 * The dashboard lists these so they can be entered again.
 *
 * @since 1.0.0
 */
export const storedRemovedSecret = z.strictObject({
  kind: z.enum([
    'authenticator',
    'notification',
    'registry',
  ]),
  name: z.string().min(1).max(255).nullable(),
  notificationId: z.string().min(1).nullable(),
  registryId: z.string().min(1).nullable(),
  removedAt: offsetDateTime,
});

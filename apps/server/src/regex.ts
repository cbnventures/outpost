/**
 * Regex - Base64 URL Pattern.
 *
 * Accepts the unpadded Base64URL text used by WebAuthn responses and ceremony IDs.
 * Request-size limits still provide the upper bound for encoded binary fields.
 *
 * @since 1.0.0
 */
const base64UrlPattern = /^[A-Za-z0-9_-]+$/;

/**
 * Regex - Bearer Authorization Pattern.
 *
 * Matches a complete Bearer authorization header and captures its credential.
 * Anchoring prevents other authorization schemes or trailing content from passing.
 *
 * @since 1.0.0
 */
const bearerAuthorizationPattern = /^Bearer +(.+)$/;

/**
 * Regex - Cgroup Container ID Pattern.
 *
 * Matches a full Docker, containerd, or Podman container ID embedded in
 * Linux cgroup metadata.
 *
 * @since 1.0.0
 */
const cgroupContainerIdPattern = /(?:^|\/)(?:docker-|cri-containerd-|libpod-)?([0-9a-f]{64})(?:\.scope)?(?:$|\/)/;

/**
 * Regex - Container Hostname Pattern.
 *
 * Matches the short or full hexadecimal container ID Docker normally uses
 * as a container hostname.
 *
 * @since 1.0.0
 */
const containerHostnamePattern = /^[0-9a-f]{12,64}$/;

/**
 * Regex - Container ID Pattern.
 *
 * Matches the short or full hexadecimal container ID sent to check one container.
 * The dashboard sends the 12-character ID shown in its container list.
 *
 * @since 1.0.0
 */
const containerIdPattern = /^[0-9a-f]{12,64}$/;

/**
 * Regex - Csrf Token Pattern.
 *
 * Matches the fixed prefix and Base64URL payload of a browser session's CSRF value.
 * Malformed header or cookie values are rejected before any digest comparison.
 *
 * @since 1.0.0
 */
const csrfTokenPattern = /^opc_[A-Za-z0-9_-]{32}$/;

/**
 * Regex - Encryption Key Pattern.
 *
 * Matches the 32-byte hexadecimal key that encrypts authenticator secrets at rest.
 * Fixed-length input prevents a damaged key file from being used.
 *
 * @since 1.0.0
 */
const encryptionKeyPattern = /^[0-9a-fA-F]{64}$/;

/**
 * Regex - Host Header Pattern.
 *
 * Matches a hostname or bracketed IPv6 address with an optional port.
 * Anything else in Host or X-Forwarded-Host is ignored when building the own address.
 *
 * @since 1.0.0
 */
const hostHeaderPattern = /^(\[[0-9A-Fa-f:.]+\]|[A-Za-z0-9.-]+)(:[0-9]{1,5})?$/;

/**
 * Regex - Mount Info Container ID Pattern.
 *
 * Matches a full Docker container ID in the bind-mounted host files listed
 * by Linux mountinfo.
 *
 * @since 1.0.0
 */
const mountInfoContainerIdPattern = /\/containers\/([0-9a-f]{64})\/(?:hosts|hostname|resolv\.conf)(?:\s|$)/;

/**
 * Regex - Notification Target ID Pattern.
 *
 * Matches the identifier of a notification destination in a route path.
 * Identifiers are a fixed prefix and 16 hexadecimal characters.
 *
 * @since 1.0.0
 */
const notificationTargetIdPattern = /^ntf-[0-9a-f]{16}$/;

/**
 * Regex - Personal Access Token ID Pattern.
 *
 * Matches the generated identifier of an access token in token routes.
 * Identifiers that could never exist are answered without a database lookup.
 *
 * @since 1.0.0
 */
const personalAccessTokenIdPattern = /^tok-[0-9a-f]{16}$/;

/**
 * Regex - Personal Access Token Pattern.
 *
 * Matches the fixed prefix and Base64URL payload emitted by the token generator.
 * A closed shape rejects arbitrary Bearer values before hash comparison.
 *
 * @since 1.0.0
 */
const personalAccessTokenPattern = /^outpost_[A-Za-z0-9_-]{43}$/;

/**
 * Regex - Recovery Code Pattern.
 *
 * Matches a normalized single-use recovery code after spaces and dashes are removed.
 * The alphabet omits look-alike characters so codes survive being written down.
 *
 * @since 1.0.0
 */
const recoveryCodePattern = /^[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{10}$/;

/**
 * Regex - Registry Host Pattern.
 *
 * Matches a registry host name or bracketed IPv6 address with an optional port, the
 * way Docker reads one from an image name. Hosts are checked after they are lowercased.
 *
 * @since 1.0.0
 */
const registryHostPattern = /^(?:\[[0-9a-f:.]+\]|[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)*)(?::[0-9]{1,5})?$/;

/**
 * Regex - Registry ID Pattern.
 *
 * Matches the identifier of a private registry sign-in in a route path.
 * Identifiers are a fixed prefix and 16 hexadecimal characters.
 *
 * @since 1.0.0
 */
const registryIdPattern = /^reg-[0-9a-f]{16}$/;

/**
 * Regex - Scrypt Password Hash Pattern.
 *
 * Matches the scrypt$N$r$p$salt$key password hash with a 16-byte salt and 64-byte key.
 * The account file written before the database used the same format.
 *
 * @since 1.0.0
 */
const scryptPasswordHashPattern = /^scrypt\$32768\$8\$1\$[A-Za-z0-9_-]{22}\$[A-Za-z0-9_-]{86}$/;

/**
 * Regex - Session Token Pattern.
 *
 * Matches the fixed prefix and Base64URL payload of an opaque browser session cookie.
 * Values with any other shape never reach the session lookup.
 *
 * @since 1.0.0
 */
const sessionTokenPattern = /^ops_[A-Za-z0-9_-]{43}$/;

/**
 * Regex - Setup Code Pattern.
 *
 * Matches a normalized one-time setup code printed to the container log.
 * Three groups of five characters keep the code easy to read and type.
 *
 * @since 1.0.0
 */
const setupCodePattern = /^[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{5}-[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{5}-[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{5}$/;

/**
 * Regex - Sha256 Hash Pattern.
 *
 * Matches the lowercase hexadecimal digest stored instead of a raw access token.
 * Fixed-length values make timing-safe comparisons safe to perform.
 *
 * @since 1.0.0
 */
const sha256HashPattern = /^[0-9a-f]{64}$/;

/**
 * Regex - Totp Code Pattern.
 *
 * Matches the six decimal digits emitted by RFC 6238 authenticator apps.
 * The value remains a string so leading zeroes survive validation.
 *
 * @since 1.0.0
 */
const totpCodePattern = /^[0-9]{6}$/;

/**
 * Regex - Username Pattern.
 *
 * Matches a dashboard username of 3 to 64 letters, numbers, periods, underscores,
 * or hyphens that starts with a letter or number, the rule every sibling app uses.
 *
 * @since 1.0.0
 */
const usernamePattern = /^[A-Za-z0-9][A-Za-z0-9._-]{2,63}$/;

/**
 * Regex - Whitespace Pattern.
 *
 * Matches a run of whitespace so a setup code copied from the log can be
 * compared without the spaces a terminal or chat window may add.
 *
 * @since 1.0.0
 */
const whitespacePattern = /\s+/;

export {
  base64UrlPattern,
  bearerAuthorizationPattern,
  cgroupContainerIdPattern,
  containerHostnamePattern,
  containerIdPattern,
  csrfTokenPattern,
  encryptionKeyPattern,
  hostHeaderPattern,
  mountInfoContainerIdPattern,
  notificationTargetIdPattern,
  personalAccessTokenIdPattern,
  personalAccessTokenPattern,
  recoveryCodePattern,
  registryHostPattern,
  registryIdPattern,
  scryptPasswordHashPattern,
  sessionTokenPattern,
  setupCodePattern,
  sha256HashPattern,
  totpCodePattern,
  usernamePattern,
  whitespacePattern,
};

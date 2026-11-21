/**
 * Regex - Administrator Username Pattern.
 *
 * Matches the 3 to 64 character username the mock dashboard accepts for a new
 * administrator, starting with a letter or number.
 *
 * @since 1.2.1
 */
export const administratorUsernamePattern = /^[A-Za-z0-9][A-Za-z0-9._-]{2,63}$/;

/**
 * Regex - Base64 Padding Pattern.
 *
 * Matches the trailing padding that Base64URL encoding drops from WebAuthn
 * credential fields.
 *
 * @since 1.2.1
 */
export const base64PaddingPattern = /=+$/;

/**
 * Regex - Checked Label Pattern.
 *
 * Matches the "Checked" label in rendered container rows, so tests can count
 * how many rows show a last-checked time.
 *
 * @since 1.2.1
 */
export const checkedLabelPattern = /Checked /;

/**
 * Regex - Container ID Pattern.
 *
 * Matches a short or full hexadecimal container ID sent to the mock API.
 * Anything else is rejected as a bad request.
 *
 * @since 1.2.1
 */
export const containerIdPattern = /^[0-9a-f]{12,64}$/;

/**
 * Regex - Content Disposition Filename Pattern.
 *
 * Captures the quoted filename from a download response header, so a saved
 * export keeps the name the server chose.
 *
 * @since 1.2.1
 */
export const contentDispositionFilenamePattern = /filename="([^"]+)"/;

/**
 * Regex - Cron Number Pattern.
 *
 * Matches a one or two digit number in a cron field, which the schedule
 * reader accepts as a fixed minute or hour.
 *
 * @since 1.2.1
 */
export const cronNumberPattern = /^\d{1,2}$/;

/**
 * Regex - Cron Step Pattern.
 *
 * Captures the step from a cron hour field written as an asterisk and a
 * one or two digit interval.
 *
 * @since 1.2.1
 */
export const cronStepPattern = /^\*\/(\d{1,2})$/;

/**
 * Regex - Digest Split Pattern.
 *
 * Captures a full 64 character hexadecimal digest, so image names can be split
 * around it without dropping the digest itself.
 *
 * @since 1.2.1
 */
export const digestSplitPattern = /([0-9a-f]{64})/;

/**
 * Regex - Digit Pattern.
 *
 * Matches one digit when the password meter checks which character groups a
 * password uses.
 *
 * @since 1.2.1
 */
export const digitPattern = /\d/;

/**
 * Regex - Dotted Hostname Pattern.
 *
 * Matches a hostname made only of digits and dots, which marks an IPv4
 * address that passkeys cannot use as a relying party.
 *
 * @since 1.2.1
 */
export const dottedHostnamePattern = /^[\d.]+$/;

/**
 * Regex - HTTP Scheme Pattern.
 *
 * Matches a leading http or https scheme, so a typed registry address can be
 * reduced to its host.
 *
 * @since 1.2.1
 */
export const httpSchemePattern = /^https?:\/\//;

/**
 * Regex - Iso Timestamp Pattern.
 *
 * Matches an ISO 8601 date and time with an optional seconds part and a
 * required UTC or offset zone.
 *
 * @since 1.2.1
 */
export const isoTimestampPattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:\d{2})$/;

/**
 * Regex - Long Digest Pattern.
 *
 * Captures the first 12 characters of a standalone 64 character hexadecimal
 * digest, so long digests can be shortened for display.
 *
 * @since 1.2.1
 */
export const longDigestPattern = /\b([0-9a-f]{12})[0-9a-f]{52}\b/;

/**
 * Regex - Long Digest Reference Pattern.
 *
 * Captures the first 12 characters of a sha256 digest reference, so long
 * references can be shortened for display.
 *
 * @since 1.2.1
 */
export const longDigestReferencePattern = /sha256:([0-9a-f]{12})[0-9a-f]{52}/;

/**
 * Regex - Lowercase Letter Pattern.
 *
 * Matches one lowercase letter when the password meter checks which character
 * groups a password uses.
 *
 * @since 1.2.1
 */
export const lowercaseLetterPattern = /[a-z]/;

/**
 * Regex - Name Separator End Pattern.
 *
 * Matches an image name part that ends with a slash, colon, or at sign, where
 * a long name may break onto the next line.
 *
 * @since 1.2.1
 */
export const nameSeparatorEndPattern = /[/:@]$/;

/**
 * Regex - Non Digit Pattern.
 *
 * Matches one character that is not a digit, so code fields can strip
 * everything except the numbers a person typed or pasted.
 *
 * @since 1.2.1
 */
export const nonDigitPattern = /\D/;

/**
 * Regex - Notification Path Pattern.
 *
 * Captures the notification ID and the optional test suffix from a mock
 * notification route.
 *
 * @since 1.2.1
 */
export const notificationPathPattern = /^\/api\/v1\/notifications\/(ntf-[0-9a-f]{16})(\/test)?$/;

/**
 * Regex - Notification Target ID Pattern.
 *
 * Matches the fixed prefix and hexadecimal body of a notification target ID
 * inside a backup file.
 *
 * @since 1.2.1
 */
export const notificationTargetIdPattern = /^ntf-[0-9a-f]{16}$/;

/**
 * Regex - Registry Address Pattern.
 *
 * Matches a registry host name with an optional port inside a backup file.
 * Anything else is rejected before import.
 *
 * @since 1.2.1
 */
export const registryAddressPattern = /^(?:[A-Za-z0-9](?:[A-Za-z0-9.-]*[A-Za-z0-9])?)(?::[0-9]{1,5})?$/;

/**
 * Regex - Registry Host Pattern.
 *
 * Matches a bracketed IP address or a lowercase host name, with an optional
 * port, when the mock API checks a registry address.
 *
 * @since 1.2.1
 */
export const registryHostPattern = /^(?:\[[0-9a-f:.]+\]|[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)*)(?::[0-9]{1,5})?$/;

/**
 * Regex - Registry ID Pattern.
 *
 * Matches the fixed prefix and hexadecimal body of a registry ID inside a
 * backup file.
 *
 * @since 1.2.1
 */
export const registryIdPattern = /^reg-[0-9a-f]{16}$/;

/**
 * Regex - Registry Path Pattern.
 *
 * Captures the registry ID from a mock registry route.
 * The ID stops at the next slash.
 *
 * @since 1.2.1
 */
export const registryPathPattern = /^\/api\/v1\/registries\/([^/]+)$/;

/**
 * Regex - Separators Pattern.
 *
 * Matches one whitespace character or hyphen, so a typed recovery code can be
 * compared without its grouping.
 *
 * @since 1.2.1
 */
export const separatorsPattern = /[\s-]/;

/**
 * Regex - Sha256 Hash Pattern.
 *
 * Matches a lowercase hexadecimal SHA-256 digest inside a backup file.
 * Anything else is rejected before import.
 *
 * @since 1.2.1
 */
export const sha256HashPattern = /^[0-9a-f]{64}$/;

/**
 * Regex - Symbol Pattern.
 *
 * Matches one character that is neither a letter nor a digit when the password
 * meter checks which character groups a password uses.
 *
 * @since 1.2.1
 */
export const symbolPattern = /[^a-zA-Z\d]/;

/**
 * Regex - Token ID Pattern.
 *
 * Matches the fixed prefix and hexadecimal body of an access token ID inside
 * a backup file.
 *
 * @since 1.2.1
 */
export const tokenIdPattern = /^tok-[0-9a-f]{16}$/;

/**
 * Regex - Token Path Pattern.
 *
 * Captures the token ID from a mock access token route.
 * The ID stops at the next slash.
 *
 * @since 1.2.1
 */
export const tokenPathPattern = /^\/api\/v1\/auth\/tokens\/([^/]+)$/;

/**
 * Regex - Totp Code Pattern.
 *
 * Matches the six digit code an authenticator app shows.
 * The mock dashboard checks typed codes against it.
 *
 * @since 1.2.1
 */
export const totpCodePattern = /^[0-9]{6}$/;

/**
 * Regex - Uppercase Letter Pattern.
 *
 * Matches one uppercase letter when the password meter checks which character
 * groups a password uses.
 *
 * @since 1.2.1
 */
export const uppercaseLetterPattern = /[A-Z]/;

/**
 * Regex - Whitespace Character Pattern.
 *
 * Matches a single whitespace character while an image name is split into
 * display parts.
 *
 * @since 1.2.1
 */
export const whitespaceCharacterPattern = /\s/;

/**
 * Regex - Whitespace Only Pattern.
 *
 * Matches a part made only of whitespace, which is rendered as-is instead of
 * as a name segment.
 *
 * @since 1.2.1
 */
export const whitespaceOnlyPattern = /^\s+$/;

/**
 * Regex - Whitespace Pattern.
 *
 * Matches a run of whitespace, so a copied setup key can be compared without
 * the spaces that group it on screen.
 *
 * @since 1.2.1
 */
export const whitespacePattern = /\s+/;

/**
 * Regex - Word Separator End Pattern.
 *
 * Matches an image name part that ends with a hyphen or underscore, where a
 * long name may break when name separators are allowed.
 *
 * @since 1.2.1
 */
export const wordSeparatorEndPattern = /[-_]$/;

/**
 * Regex - Year Pattern.
 *
 * Matches a four digit year from 1900 to 2099, which the password meter treats
 * as a guessable pattern.
 *
 * @since 1.2.1
 */
export const yearPattern = /(?:19|20)\d\d/;

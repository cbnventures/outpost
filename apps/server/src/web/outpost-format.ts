import { formatDate } from '@/web/format.ts';

import type {
  Web_OutpostFormat_FormatUntil_Now,
  Web_OutpostFormat_FormatUntil_Returns,
  Web_OutpostFormat_FormatUntil_Value,
  Web_OutpostFormat_ShortDigests_Returns,
  Web_OutpostFormat_ShortDigests_Text,
} from '@/types/web/outpost-format.d.ts';

/**
 * Outpost Format - Format until.
 *
 * Describes the time until a scheduled check in the largest whole unit.
 * Outpost's scheduler copy uses it without extending shared date formatting.
 *
 * @param {Web_OutpostFormat_FormatUntil_Value} value - Value.
 * @param {Web_OutpostFormat_FormatUntil_Now}   now   - Now.
 *
 * @returns {Web_OutpostFormat_FormatUntil_Returns}
 *
 * @since 1.1.0
 */
export const formatUntil = (
  value: Web_OutpostFormat_FormatUntil_Value,
  now: Web_OutpostFormat_FormatUntil_Now = Date.now(),
): Web_OutpostFormat_FormatUntil_Returns => {
  if (value === null || value === undefined || value === '') {
    return 'not scheduled';
  }

  const timestamp: number = new Date(value).getTime();
  if (Number.isNaN(timestamp)) {
    return 'unknown';
  }

  const seconds: number = Math.round((timestamp - now) / 1000);
  if (seconds < 45) {
    return 'in under a minute';
  }

  const formatter: Intl.RelativeTimeFormat = new Intl.RelativeTimeFormat(undefined, {
    numeric: 'auto',
  });
  const minutes: number = Math.round(seconds / 60);
  if (minutes < 60) {
    return formatter.format(minutes, 'minute');
  }

  const hours: number = Math.round(minutes / 60);
  if (hours < 24) {
    return formatter.format(hours, 'hour');
  }

  const days: number = Math.round(hours / 24);
  if (days < 30) {
    return formatter.format(days, 'day');
  }

  return formatDate(value);
};

/**
 * Outpost Format - Short digests.
 *
 * Shortens Docker digests to the familiar 12-character form in narrow views.
 * Outpost keeps this container-specific formatter outside the shared helpers.
 *
 * @param {Web_OutpostFormat_ShortDigests_Text} text - Text.
 *
 * @returns {Web_OutpostFormat_ShortDigests_Returns}
 *
 * @since 1.1.0
 */
export const shortDigests = (
  text: Web_OutpostFormat_ShortDigests_Text,
): Web_OutpostFormat_ShortDigests_Returns => text
  .replace(/sha256:([0-9a-f]{12})[0-9a-f]{52}/gu, 'sha256:$1…')
  .replace(/\b([0-9a-f]{12})[0-9a-f]{52}\b/gu, '$1…');

import { formatDate } from '@/web/format.ts';
import {
  longDigestPattern,
  longDigestReferencePattern,
} from '@/web/regex.js';

import type {
  Web_OutpostFormat_FormatUntil_Days,
  Web_OutpostFormat_FormatUntil_Formatter,
  Web_OutpostFormat_FormatUntil_Hours,
  Web_OutpostFormat_FormatUntil_Minutes,
  Web_OutpostFormat_FormatUntil_Now,
  Web_OutpostFormat_FormatUntil_Returns,
  Web_OutpostFormat_FormatUntil_Seconds,
  Web_OutpostFormat_FormatUntil_Timestamp,
  Web_OutpostFormat_FormatUntil_Value,
  Web_OutpostFormat_ShortDigests_Returns,
  Web_OutpostFormat_ShortDigests_Text,
} from '@/types/web/outpost-format.d.ts';

/**
 * Outpost Format - Format Until.
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
  if (
    value === null
    || value === undefined
    || value === ''
  ) {
    return 'not scheduled';
  }

  const timestamp: Web_OutpostFormat_FormatUntil_Timestamp = new Date(value).getTime();
  if (Number.isNaN(timestamp) === true) {
    return 'unknown';
  }

  const seconds: Web_OutpostFormat_FormatUntil_Seconds = Math.round((timestamp - now) / 1000);
  if (seconds < 45) {
    return 'in under a minute';
  }

  const formatter: Web_OutpostFormat_FormatUntil_Formatter = new Intl.RelativeTimeFormat(undefined, {
    numeric: 'auto',
  });
  const minutes: Web_OutpostFormat_FormatUntil_Minutes = Math.round(seconds / 60);
  if (minutes < 60) {
    return formatter.format(minutes, 'minute');
  }

  const hours: Web_OutpostFormat_FormatUntil_Hours = Math.round(minutes / 60);
  if (hours < 24) {
    return formatter.format(hours, 'hour');
  }

  const days: Web_OutpostFormat_FormatUntil_Days = Math.round(hours / 24);
  if (days < 30) {
    return formatter.format(days, 'day');
  }

  return formatDate(value);
};

/**
 * Outpost Format - Short Digests.
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
  .replace(new RegExp(longDigestReferencePattern, 'gu'), 'sha256:$1…')
  .replace(new RegExp(longDigestPattern, 'gu'), '$1…');

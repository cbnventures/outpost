import { Cron } from 'croner';

import {
  cronNumberPattern,
  cronStepPattern,
  whitespacePattern,
} from '@/web/regex.js';

import type {
  Web_Schedule_BuildSchedule_Days,
  Web_Schedule_BuildSchedule_Hour,
  Web_Schedule_BuildSchedule_Minute,
  Web_Schedule_BuildSchedule_Returns,
  Web_Schedule_BuildSchedule_Simple,
  Web_Schedule_BuildSchedule_TimeParts,
  Web_Schedule_DescribeSchedule_Cron,
  Web_Schedule_DescribeSchedule_Days,
  Web_Schedule_DescribeSchedule_DayText,
  Web_Schedule_DescribeSchedule_FirstDay,
  Web_Schedule_DescribeSchedule_Labels,
  Web_Schedule_DescribeSchedule_Last,
  Web_Schedule_DescribeSchedule_Returns,
  Web_Schedule_DescribeSchedule_Simple,
  Web_Schedule_DescribeSchedule_TimeZone,
  Web_Schedule_NextRun_Cron,
  Web_Schedule_NextRun_DateText,
  Web_Schedule_NextRun_Job,
  Web_Schedule_NextRun_Next,
  Web_Schedule_NextRun_Returns,
  Web_Schedule_NextRun_TimeText,
  Web_Schedule_NextRun_TimeZone,
  Web_Schedule_NumberInRange_Field,
  Web_Schedule_NumberInRange_Highest,
  Web_Schedule_NumberInRange_Lowest,
  Web_Schedule_NumberInRange_Returns,
  Web_Schedule_NumberInRange_Value,
  Web_Schedule_ParseSchedule_AllFields,
  Web_Schedule_ParseSchedule_Cron,
  Web_Schedule_ParseSchedule_Custom,
  Web_Schedule_ParseSchedule_DayFields,
  Web_Schedule_ParseSchedule_DayOfWeek,
  Web_Schedule_ParseSchedule_Days,
  Web_Schedule_ParseSchedule_Fields,
  Web_Schedule_ParseSchedule_Hour,
  Web_Schedule_ParseSchedule_Interval,
  Web_Schedule_ParseSchedule_Minute,
  Web_Schedule_ParseSchedule_Returns,
  Web_Schedule_ParseSchedule_Time,
  Web_Schedule_ScheduleDays,
  Web_Schedule_ScheduleIntervals,
} from '@/types/web/schedule.d.ts';

/**
 * Schedule - Intervals.
 *
 * The hour steps "Every few hours" offers. Each divides a day evenly,
 * so the checks land at the same times every day.
 *
 * @since 1.0.0
 */
export const scheduleIntervals: Web_Schedule_ScheduleIntervals = [
  2,
  3,
  4,
  6,
  8,
  12,
];

/**
 * Schedule - Days.
 *
 * The weekdays in cron order, Sunday first.
 * Each has the short label shown and the full name read aloud.
 *
 * @since 1.0.0
 */
export const scheduleDays: Web_Schedule_ScheduleDays = [
  {
    label: 'Sun',
    name: 'Sunday',
    value: 0,
  },
  {
    label: 'Mon',
    name: 'Monday',
    value: 1,
  },
  {
    label: 'Tue',
    name: 'Tuesday',
    value: 2,
  },
  {
    label: 'Wed',
    name: 'Wednesday',
    value: 3,
  },
  {
    label: 'Thu',
    name: 'Thursday',
    value: 4,
  },
  {
    label: 'Fri',
    name: 'Friday',
    value: 5,
  },
  {
    label: 'Sat',
    name: 'Saturday',
    value: 6,
  },
];

/**
 * Schedule - Number In Range.
 *
 * Checks that a cron field is a plain number between the two bounds.
 * Steps, ranges, and lists don't count as a plain number.
 *
 * @param {Web_Schedule_NumberInRange_Field}   field   - Field.
 * @param {Web_Schedule_NumberInRange_Lowest}  lowest  - Lowest.
 * @param {Web_Schedule_NumberInRange_Highest} highest - Highest.
 *
 * @returns {Web_Schedule_NumberInRange_Returns}
 *
 * @since 1.0.0
 */
const numberInRange = (field: Web_Schedule_NumberInRange_Field, lowest: Web_Schedule_NumberInRange_Lowest, highest: Web_Schedule_NumberInRange_Highest): Web_Schedule_NumberInRange_Returns => {
  if (new RegExp(cronNumberPattern, 'u').test(field) === false) {
    return false;
  }

  const value: Web_Schedule_NumberInRange_Value = Number(field);

  return value >= lowest && value <= highest;
};

/**
 * Schedule - Parse Schedule.
 *
 * Reads a cron string into the simple choices when it matches one: every hour,
 * every few hours, every day at a time, or chosen weekdays at a time.
 * Anything else is custom. Five-field cron reads like six fields with zero seconds.
 *
 * @param {Web_Schedule_ParseSchedule_Cron} cron - Cron.
 *
 * @returns {Web_Schedule_ParseSchedule_Returns}
 *
 * @since 1.0.0
 */
export const parseSchedule = (cron: Web_Schedule_ParseSchedule_Cron): Web_Schedule_ParseSchedule_Returns => {
  const fields: Web_Schedule_ParseSchedule_Fields = cron.trim().split(new RegExp(whitespacePattern, 'u'));
  const allFields: Web_Schedule_ParseSchedule_AllFields = (fields.length === 5) ? [
    '0',
    ...fields,
  ] : fields;
  const custom: Web_Schedule_ParseSchedule_Custom = {
    days: [1],
    frequency: 'custom',
    interval: 6,
    time: '04:00',
  };

  if (
    allFields.length !== 6
    || allFields[0] !== '0'
    || allFields[3] !== '*'
    || allFields[4] !== '*'
  ) {
    return custom;
  }

  const minute: Web_Schedule_ParseSchedule_Minute = allFields[1] ?? '';
  const hour: Web_Schedule_ParseSchedule_Hour = allFields[2] ?? '';
  const dayOfWeek: Web_Schedule_ParseSchedule_DayOfWeek = allFields[5] ?? '';
  const interval: Web_Schedule_ParseSchedule_Interval = Number((new RegExp(cronStepPattern, 'u').exec(hour) ?? [])[1]);

  if (
    minute === '0'
    && hour === '*'
    && dayOfWeek === '*'
  ) {
    return {
      ...custom,
      frequency: 'hourly',
    };
  }

  if (
    minute === '0'
    && dayOfWeek === '*'
    && scheduleIntervals.includes(interval) === true
  ) {
    return {
      ...custom,
      frequency: 'hours',
      interval,
    };
  }

  if (numberInRange(minute, 0, 59) === false || numberInRange(hour, 0, 23) === false) {
    return custom;
  }

  const time: Web_Schedule_ParseSchedule_Time = `${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`;

  if (dayOfWeek === '*') {
    return {
      ...custom,
      frequency: 'daily',
      time,
    };
  }

  const dayFields: Web_Schedule_ParseSchedule_DayFields = dayOfWeek.split(',');

  if (dayFields.every((dayField) => numberInRange(dayField, 0, 7)) === false) {
    return {
      ...custom,
      time,
    };
  }

  // Cron allows 7 for Sunday too, so both read as 0.
  const days: Web_Schedule_ParseSchedule_Days = [...new Set(dayFields.map((dayField) => Number(dayField) % 7))].sort((left, right) => left - right);

  return {
    ...custom,
    days,
    frequency: 'weekly',
    time,
  };
};

/**
 * Schedule - Build Schedule.
 *
 * Writes the simple choices back as six-field cron, the format Outpost saves.
 * Custom isn't built here, because the cron field holds it as typed.
 *
 * @param {Web_Schedule_BuildSchedule_Simple} simple - Simple.
 *
 * @returns {Web_Schedule_BuildSchedule_Returns}
 *
 * @since 1.0.0
 */
export const buildSchedule = (simple: Web_Schedule_BuildSchedule_Simple): Web_Schedule_BuildSchedule_Returns => {
  const timeParts: Web_Schedule_BuildSchedule_TimeParts = simple['time'].split(':');
  const hour: Web_Schedule_BuildSchedule_Hour = Number(timeParts[0] ?? '4');
  const minute: Web_Schedule_BuildSchedule_Minute = Number(timeParts[1] ?? '0');

  if (simple['frequency'] === 'hourly') {
    return '0 0 * * * *';
  }

  if (simple['frequency'] === 'hours') {
    return `0 0 */${String(simple['interval'])} * * *`;
  }

  if (simple['frequency'] === 'weekly') {
    const days: Web_Schedule_BuildSchedule_Days = [...simple['days']].sort((left, right) => left - right);

    return `0 ${String(minute)} ${String(hour)} * * ${days.join(',')}`;
  }

  return `0 ${String(minute)} ${String(hour)} * * *`;
};

/**
 * Schedule - Describe Schedule.
 *
 * Says the schedule in words, like "Every day at 04:00 (UTC)", so it reads
 * without knowing cron. A schedule with a time of day names the time zone it runs in.
 *
 * @param {Web_Schedule_DescribeSchedule_Cron}     cron     - Cron.
 * @param {Web_Schedule_DescribeSchedule_TimeZone} timeZone - Time zone.
 *
 * @returns {Web_Schedule_DescribeSchedule_Returns}
 *
 * @since 1.0.0
 */
export const describeSchedule = (cron: Web_Schedule_DescribeSchedule_Cron, timeZone: Web_Schedule_DescribeSchedule_TimeZone): Web_Schedule_DescribeSchedule_Returns => {
  const simple: Web_Schedule_DescribeSchedule_Simple = parseSchedule(cron);

  if (simple['frequency'] === 'hourly') {
    return 'Every hour';
  }

  if (simple['frequency'] === 'hours') {
    return `Every ${String(simple['interval'])} hours`;
  }

  if (simple['frequency'] === 'custom') {
    return `Custom schedule (${timeZone})`;
  }

  const days: Web_Schedule_DescribeSchedule_Days = scheduleDays.filter((day) => simple['days'].includes(day['value']));
  let dayText: Web_Schedule_DescribeSchedule_DayText = 'day';

  if (simple['frequency'] === 'weekly' && days.length === 1) {
    const firstDay: Web_Schedule_DescribeSchedule_FirstDay = days[0];

    dayText = (firstDay !== undefined) ? firstDay['name'] : 'day';
  } else if (simple['frequency'] === 'weekly' && simple['days'].join(',') === '1,2,3,4,5') {
    dayText = 'weekday';
  } else if (simple['frequency'] === 'weekly' && days.length < 7) {
    const labels: Web_Schedule_DescribeSchedule_Labels = days.map((day) => day['label']);
    const last: Web_Schedule_DescribeSchedule_Last = labels.pop() ?? '';

    dayText = (labels.length === 1) ? `${labels[0] ?? ''} and ${last}` : `${labels.join(', ')}, and ${last}`;
  }

  return `Every ${dayText} at ${simple['time']} (${timeZone})`;
};

/**
 * Schedule - Next Run.
 *
 * Says when the schedule runs next, in the time zone Outpost runs in,
 * like "Wed, Nov 4 at 04:00". Returns null when the cron isn't valid,
 * so the page can ask for a valid one instead.
 *
 * @param {Web_Schedule_NextRun_Cron}     cron     - Cron.
 * @param {Web_Schedule_NextRun_TimeZone} timeZone - Time zone.
 *
 * @returns {Web_Schedule_NextRun_Returns}
 *
 * @since 1.0.0
 */
export const nextRun = (cron: Web_Schedule_NextRun_Cron, timeZone: Web_Schedule_NextRun_TimeZone): Web_Schedule_NextRun_Returns => {
  let next: Web_Schedule_NextRun_Next = null;

  try {
    const job: Web_Schedule_NextRun_Job = new Cron(cron.trim(), {
      paused: true,
      timezone: timeZone,
    });

    next = job.nextRun();
    job.stop();
  } catch {
    return null;
  }

  if (next === null) {
    return null;
  }

  const dateText: Web_Schedule_NextRun_DateText = new Intl.DateTimeFormat(undefined, {
    day: 'numeric',
    month: 'short',
    timeZone,
    weekday: 'short',
  }).format(next);
  const timeText: Web_Schedule_NextRun_TimeText = new Intl.DateTimeFormat(undefined, {
    hour: '2-digit',
    hourCycle: 'h23',
    minute: '2-digit',
    timeZone,
  }).format(next);

  return `${dateText} at ${timeText}`;
};

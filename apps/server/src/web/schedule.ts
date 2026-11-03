import { Cron } from 'croner';

import type {
  Web_Schedule_Build_Returns,
  Web_Schedule_Build_Simple,
  Web_Schedule_Day,
  Web_Schedule_Describe_Cron,
  Web_Schedule_Describe_Returns,
  Web_Schedule_Describe_TimeZone,
  Web_Schedule_NextRun_Cron,
  Web_Schedule_NextRun_Returns,
  Web_Schedule_NextRun_TimeZone,
  Web_Schedule_Parse_Cron,
  Web_Schedule_Parse_Returns,
  Web_Schedule_Simple,
} from '@/types/web/schedule.d.ts';

/**
 * Schedule - Intervals.
 *
 * The hour steps "Every few hours" offers. Each divides a day evenly,
 * so the checks land at the same times every day.
 *
 * @since 1.0.0
 */
export const scheduleIntervals: number[] = [
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
export const scheduleDays: Web_Schedule_Day[] = [
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
 * Schedule - Number in range.
 *
 * Checks that a cron field is a plain number between the two bounds.
 * Steps, ranges, and lists don't count as a plain number.
 *
 * @since 1.0.0
 */
const numberInRange = (field: string, lowest: number, highest: number): boolean => {
  if (!/^\d{1,2}$/u.test(field)) {
    return false;
  }

  const value: number = Number(field);

  return value >= lowest && value <= highest;
};

/**
 * Schedule - Parse schedule.
 *
 * Reads a cron string into the simple choices when it matches one: every hour,
 * every few hours, every day at a time, or chosen weekdays at a time.
 * Anything else is custom. Five-field cron reads like six fields with zero seconds.
 *
 * @since 1.0.0
 */
export const parseSchedule = (cron: Web_Schedule_Parse_Cron): Web_Schedule_Parse_Returns => {
  const fields: string[] = cron.trim().split(/\s+/u);
  const allFields: string[] = (fields.length === 5) ? [
    '0',
    ...fields,
  ] : fields;
  const custom: Web_Schedule_Simple = {
    days: [1],
    frequency: 'custom',
    interval: 6,
    time: '04:00',
  };

  if (allFields.length !== 6 || allFields[0] !== '0' || allFields[3] !== '*' || allFields[4] !== '*') {
    return custom;
  }

  const minute: string = allFields[1] ?? '';
  const hour: string = allFields[2] ?? '';
  const dayOfWeek: string = allFields[5] ?? '';
  const interval: number = Number((/^\*\/(\d{1,2})$/u.exec(hour) ?? [])[1]);

  if (minute === '0' && hour === '*' && dayOfWeek === '*') {
    return {
      ...custom,
      frequency: 'hourly',
    };
  }

  if (minute === '0' && dayOfWeek === '*' && scheduleIntervals.includes(interval)) {
    return {
      ...custom,
      frequency: 'hours',
      interval,
    };
  }

  if (!numberInRange(minute, 0, 59) || !numberInRange(hour, 0, 23)) {
    return custom;
  }

  const time: string = `${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`;

  if (dayOfWeek === '*') {
    return {
      ...custom,
      frequency: 'daily',
      time,
    };
  }

  const dayFields: string[] = dayOfWeek.split(',');

  if (!dayFields.every((dayField: string): boolean => numberInRange(dayField, 0, 7))) {
    return {
      ...custom,
      time,
    };
  }

  // Cron allows 7 for Sunday too, so both read as 0.
  const days: number[] = [...new Set(dayFields.map((dayField: string): number => Number(dayField) % 7))].sort((left: number, right: number): number => left - right);

  return {
    ...custom,
    days,
    frequency: 'weekly',
    time,
  };
};

/**
 * Schedule - Build schedule.
 *
 * Writes the simple choices back as six-field cron, the format Outpost saves.
 * Custom isn't built here, because the cron field holds it as typed.
 *
 * @since 1.0.0
 */
export const buildSchedule = (simple: Web_Schedule_Build_Simple): Web_Schedule_Build_Returns => {
  const timeParts: string[] = simple['time'].split(':');
  const hour: number = Number(timeParts[0] ?? '4');
  const minute: number = Number(timeParts[1] ?? '0');

  if (simple['frequency'] === 'hourly') {
    return '0 0 * * * *';
  }

  if (simple['frequency'] === 'hours') {
    return `0 0 */${String(simple['interval'])} * * *`;
  }

  if (simple['frequency'] === 'weekly') {
    const days: number[] = [...simple['days']].sort((left: number, right: number): number => left - right);

    return `0 ${String(minute)} ${String(hour)} * * ${days.join(',')}`;
  }

  return `0 ${String(minute)} ${String(hour)} * * *`;
};

/**
 * Schedule - Describe schedule.
 *
 * Says the schedule in words, like "Every day at 04:00 (UTC)", so it reads
 * without knowing cron. A schedule with a time of day names the time zone it runs in.
 *
 * @since 1.0.0
 */
export const describeSchedule = (cron: Web_Schedule_Describe_Cron, timeZone: Web_Schedule_Describe_TimeZone): Web_Schedule_Describe_Returns => {
  const simple: Web_Schedule_Simple = parseSchedule(cron);

  if (simple['frequency'] === 'hourly') {
    return 'Every hour';
  }

  if (simple['frequency'] === 'hours') {
    return `Every ${String(simple['interval'])} hours`;
  }

  if (simple['frequency'] === 'custom') {
    return `Custom schedule (${timeZone})`;
  }

  const days: Web_Schedule_Day[] = scheduleDays.filter((day: Web_Schedule_Day): boolean => simple['days'].includes(day['value']));
  let dayText: string = 'day';

  if (simple['frequency'] === 'weekly' && days.length === 1) {
    dayText = days[0]?.['name'] ?? 'day';
  } else if (simple['frequency'] === 'weekly' && simple['days'].join(',') === '1,2,3,4,5') {
    dayText = 'weekday';
  } else if (simple['frequency'] === 'weekly' && days.length < 7) {
    const labels: string[] = days.map((day: Web_Schedule_Day): string => day['label']);
    const last: string = labels.pop() ?? '';

    dayText = (labels.length === 1) ? `${labels[0] ?? ''} and ${last}` : `${labels.join(', ')}, and ${last}`;
  }

  return `Every ${dayText} at ${simple['time']} (${timeZone})`;
};

/**
 * Schedule - Next run.
 *
 * Says when the schedule runs next, in the time zone Outpost runs in,
 * like "Wed, Nov 4 at 04:00". Returns null when the cron isn't valid,
 * so the page can ask for a valid one instead.
 *
 * @since 1.0.0
 */
export const nextRun = (cron: Web_Schedule_NextRun_Cron, timeZone: Web_Schedule_NextRun_TimeZone): Web_Schedule_NextRun_Returns => {
  let next: Date | null = null;

  try {
    const job: Cron = new Cron(cron.trim(), {
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

  const dateText: string = new Intl.DateTimeFormat(undefined, {
    day: 'numeric',
    month: 'short',
    timeZone,
    weekday: 'short',
  }).format(next);
  const timeText: string = new Intl.DateTimeFormat(undefined, {
    hour: '2-digit',
    hourCycle: 'h23',
    minute: '2-digit',
    timeZone,
  }).format(next);

  return `${dateText} at ${timeText}`;
};

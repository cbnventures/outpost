import type { Cron } from 'croner';

/**
 * Schedule.
 *
 * @since 1.2.1
 */
export type Web_Schedule_BuildSchedule_Simple = Web_Schedule_Simple;
export type Web_Schedule_BuildSchedule_Returns = string;
export type Web_Schedule_BuildSchedule_TimeParts = string[];
export type Web_Schedule_BuildSchedule_Hour = number;
export type Web_Schedule_BuildSchedule_Minute = number;
export type Web_Schedule_BuildSchedule_Days = number[];

/**
 * Schedule.
 *
 * @since 1.0.0
 */
export type Web_Schedule_Day = {
  label: string;
  name: string;
  value: number;
};

/**
 * Schedule.
 *
 * @since 1.2.1
 */
export type Web_Schedule_DescribeSchedule_Cron = string;
export type Web_Schedule_DescribeSchedule_TimeZone = string;
export type Web_Schedule_DescribeSchedule_Returns = string;
export type Web_Schedule_DescribeSchedule_Simple = Web_Schedule_Simple;
export type Web_Schedule_DescribeSchedule_Days = Web_Schedule_Day[];
export type Web_Schedule_DescribeSchedule_DayText = string;
export type Web_Schedule_DescribeSchedule_FirstDay = Web_Schedule_Day | undefined;
export type Web_Schedule_DescribeSchedule_Labels = string[];
export type Web_Schedule_DescribeSchedule_Last = string;

/**
 * Schedule.
 *
 * @since 1.0.0
 */
export type Web_Schedule_Frequency = 'custom' | 'daily' | 'hourly' | 'hours' | 'weekly';

/**
 * Schedule.
 *
 * @since 1.2.1
 */
export type Web_Schedule_NextRun_Cron = string;
export type Web_Schedule_NextRun_TimeZone = string;
export type Web_Schedule_NextRun_Returns = string | null;
export type Web_Schedule_NextRun_Next = Date | null;
export type Web_Schedule_NextRun_Job = Cron;
export type Web_Schedule_NextRun_DateText = string;
export type Web_Schedule_NextRun_TimeText = string;

/**
 * Schedule.
 *
 * @since 1.2.1
 */
export type Web_Schedule_NumberInRange_Field = string;
export type Web_Schedule_NumberInRange_Lowest = number;
export type Web_Schedule_NumberInRange_Highest = number;
export type Web_Schedule_NumberInRange_Returns = boolean;
export type Web_Schedule_NumberInRange_Value = number;

/**
 * Schedule.
 *
 * @since 1.2.1
 */
export type Web_Schedule_ParseSchedule_Cron = string;
export type Web_Schedule_ParseSchedule_Returns = Web_Schedule_Simple;
export type Web_Schedule_ParseSchedule_Fields = string[];
export type Web_Schedule_ParseSchedule_AllFields = string[];
export type Web_Schedule_ParseSchedule_Custom = Web_Schedule_Simple;
export type Web_Schedule_ParseSchedule_Minute = string;
export type Web_Schedule_ParseSchedule_Hour = string;
export type Web_Schedule_ParseSchedule_DayOfWeek = string;
export type Web_Schedule_ParseSchedule_Interval = number;
export type Web_Schedule_ParseSchedule_Time = string;
export type Web_Schedule_ParseSchedule_DayFields = string[];
export type Web_Schedule_ParseSchedule_Days = number[];

/**
 * Schedule.
 *
 * @since 1.2.1
 */
export type Web_Schedule_ScheduleDays = Web_Schedule_Day[];

/**
 * Schedule.
 *
 * @since 1.2.1
 */
export type Web_Schedule_ScheduleIntervals = number[];

/**
 * Schedule.
 *
 * @since 1.0.0
 */
export type Web_Schedule_Simple = {
  days: number[];
  frequency: Web_Schedule_Frequency;
  interval: number;
  time: string;
};

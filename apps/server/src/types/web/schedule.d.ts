/**
 * Schedule.
 *
 * @since 1.0.0
 */
export type Web_Schedule_Frequency = 'custom' | 'daily' | 'hourly' | 'hours' | 'weekly';

export type Web_Schedule_Simple = {
  days: number[];
  frequency: Web_Schedule_Frequency;
  interval: number;
  time: string;
};

export type Web_Schedule_Day = {
  label: string;
  name: string;
  value: number;
};

export type Web_Schedule_Parse_Cron = string;
export type Web_Schedule_Parse_Returns = Web_Schedule_Simple;
export type Web_Schedule_Build_Simple = Web_Schedule_Simple;
export type Web_Schedule_Build_Returns = string;
export type Web_Schedule_NextRun_Cron = string;
export type Web_Schedule_NextRun_TimeZone = string;
export type Web_Schedule_NextRun_Returns = string | null;
export type Web_Schedule_Describe_Cron = string;
export type Web_Schedule_Describe_TimeZone = string;
export type Web_Schedule_Describe_Returns = string;

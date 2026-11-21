import type {
  Dispatch,
  MutableRefObject,
  ReactElement,
  SetStateAction,
} from 'react';

import type {
  Web_Schedule_Frequency,
  Web_Schedule_Simple,
} from '@/types/web/schedule.d.ts';

/**
 * Schedule Picker.
 *
 * @since 1.2.1
 */
export type Web_SchedulePicker_SchedulePicker_Returns = ReactElement;
export type Web_SchedulePicker_SchedulePicker_Issue = string;
export type Web_SchedulePicker_SchedulePicker_MonitorOnly = boolean;
export type Web_SchedulePicker_SchedulePicker_OnChange = (cron: string) => void;
export type Web_SchedulePicker_SchedulePicker_TimeZone = string;
export type Web_SchedulePicker_SchedulePicker_Value = string;
export type Web_SchedulePicker_SchedulePicker_SimpleState = [Web_Schedule_Simple, Dispatch<SetStateAction<Web_Schedule_Simple>>];
export type Web_SchedulePicker_SchedulePicker_Simple = Web_Schedule_Simple;
export type Web_SchedulePicker_SchedulePicker_SetSimple = Dispatch<SetStateAction<Web_Schedule_Simple>>;
export type Web_SchedulePicker_SchedulePicker_Emitted = MutableRefObject<string>;
export type Web_SchedulePicker_SchedulePicker_ScheduledAction = string;
export type Web_SchedulePicker_SchedulePicker_ChangeSimple_Next = Web_Schedule_Simple;
export type Web_SchedulePicker_SchedulePicker_ChangeSimple_Returns = void;
export type Web_SchedulePicker_SchedulePicker_ChangeSimple = (next: Web_SchedulePicker_SchedulePicker_ChangeSimple_Next) => Web_SchedulePicker_SchedulePicker_ChangeSimple_Returns;
export type Web_SchedulePicker_SchedulePicker_ChangeSimple_Cron = string;
export type Web_SchedulePicker_SchedulePicker_ToggleDay_Day = number;
export type Web_SchedulePicker_SchedulePicker_ToggleDay_Returns = void;
export type Web_SchedulePicker_SchedulePicker_ToggleDay = (day: Web_SchedulePicker_SchedulePicker_ToggleDay_Day) => Web_SchedulePicker_SchedulePicker_ToggleDay_Returns;
export type Web_SchedulePicker_SchedulePicker_ToggleDay_Selected = boolean;
export type Web_SchedulePicker_SchedulePicker_Frequency = Web_Schedule_Frequency;
export type Web_SchedulePicker_SchedulePicker_ShowTime = boolean;
export type Web_SchedulePicker_SchedulePicker_ShowInterval = boolean;
export type Web_SchedulePicker_SchedulePicker_Next = string | null;

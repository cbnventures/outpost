import {
  useEffect,
  useRef,
  useState,
} from 'react';

import { FieldLabel } from '@/web/field-label.tsx';
import { Icon } from '@/web/primitives.tsx';
import {
  buildSchedule,
  nextRun,
  parseSchedule,
  scheduleDays,
  scheduleIntervals,
} from '@/web/schedule.ts';

import type { Web_Components_SchedulePicker_Props } from '@/types/web/components.d.ts';
import type {
  Web_SchedulePicker_SchedulePicker_ChangeSimple,
  Web_SchedulePicker_SchedulePicker_ChangeSimple_Cron,
  Web_SchedulePicker_SchedulePicker_ChangeSimple_Next,
  Web_SchedulePicker_SchedulePicker_ChangeSimple_Returns,
  Web_SchedulePicker_SchedulePicker_Emitted,
  Web_SchedulePicker_SchedulePicker_Frequency,
  Web_SchedulePicker_SchedulePicker_Issue,
  Web_SchedulePicker_SchedulePicker_MonitorOnly,
  Web_SchedulePicker_SchedulePicker_Next,
  Web_SchedulePicker_SchedulePicker_OnChange,
  Web_SchedulePicker_SchedulePicker_Returns,
  Web_SchedulePicker_SchedulePicker_ScheduledAction,
  Web_SchedulePicker_SchedulePicker_SetSimple,
  Web_SchedulePicker_SchedulePicker_ShowInterval,
  Web_SchedulePicker_SchedulePicker_ShowTime,
  Web_SchedulePicker_SchedulePicker_Simple,
  Web_SchedulePicker_SchedulePicker_SimpleState,
  Web_SchedulePicker_SchedulePicker_TimeZone,
  Web_SchedulePicker_SchedulePicker_ToggleDay,
  Web_SchedulePicker_SchedulePicker_ToggleDay_Day,
  Web_SchedulePicker_SchedulePicker_ToggleDay_Returns,
  Web_SchedulePicker_SchedulePicker_ToggleDay_Selected,
  Web_SchedulePicker_SchedulePicker_Value,
} from '@/types/web/schedule-picker.d.ts';

/**
 * Schedule Picker - Schedule Picker.
 *
 * Picks when checks run without writing cron: every hour, every few hours, every day,
 * or chosen days, at a time. Custom shows the cron field for anyone who prefers it.
 *
 * @param {Web_Components_SchedulePicker_Props} props - Props.
 *
 * @returns {Web_SchedulePicker_SchedulePicker_Returns}
 *
 * @since 1.0.0
 */
export const SchedulePicker = (props: Web_Components_SchedulePicker_Props): Web_SchedulePicker_SchedulePicker_Returns => {
  const issue: Web_SchedulePicker_SchedulePicker_Issue = props['issue'];
  const monitorOnly: Web_SchedulePicker_SchedulePicker_MonitorOnly = props['monitorOnly'];
  const onChange: Web_SchedulePicker_SchedulePicker_OnChange = props['onChange'];
  const timeZone: Web_SchedulePicker_SchedulePicker_TimeZone = props['timeZone'];
  const value: Web_SchedulePicker_SchedulePicker_Value = props['value'];
  const simpleState: Web_SchedulePicker_SchedulePicker_SimpleState = useState<Web_SchedulePicker_SchedulePicker_Simple>(parseSchedule(value));
  const simple: Web_SchedulePicker_SchedulePicker_Simple = simpleState[0];
  const setSimple: Web_SchedulePicker_SchedulePicker_SetSimple = simpleState[1];
  const emitted: Web_SchedulePicker_SchedulePicker_Emitted = useRef<Web_SchedulePicker_SchedulePicker_Value>(value);
  const scheduledAction: Web_SchedulePicker_SchedulePicker_ScheduledAction = (monitorOnly === true) ? 'check' : 'update';

  // A value from outside, like Discard, picks the matching choice again; the picker's own edits don't.
  useEffect(() => {
    if (value === emitted.current) {
      return;
    }

    emitted.current = value;
    setSimple(parseSchedule(value));

    return;
  }, [value]);

  /**
   * Schedule Picker - Change Simple.
   *
   * Applies one choice and sends the cron it makes. Custom keeps the current cron,
   * so switching to it starts from the schedule already picked.
   *
   * @param {Web_SchedulePicker_SchedulePicker_ChangeSimple_Next} next - Next.
   *
   * @returns {Web_SchedulePicker_SchedulePicker_ChangeSimple_Returns}
   *
   * @since 1.0.0
   */
  const changeSimple: Web_SchedulePicker_SchedulePicker_ChangeSimple = (next: Web_SchedulePicker_SchedulePicker_ChangeSimple_Next): Web_SchedulePicker_SchedulePicker_ChangeSimple_Returns => {
    setSimple(next);

    if (next['frequency'] === 'custom') {
      return;
    }

    const cron: Web_SchedulePicker_SchedulePicker_ChangeSimple_Cron = buildSchedule(next);

    emitted.current = cron;
    onChange(cron);

    return;
  };

  /**
   * Schedule Picker - Toggle Day.
   *
   * Adds or removes one weekday. The last day can't be removed,
   * so a weekly schedule always runs.
   *
   * @param {Web_SchedulePicker_SchedulePicker_ToggleDay_Day} day - Day.
   *
   * @returns {Web_SchedulePicker_SchedulePicker_ToggleDay_Returns}
   *
   * @since 1.0.0
   */
  const toggleDay: Web_SchedulePicker_SchedulePicker_ToggleDay = (day: Web_SchedulePicker_SchedulePicker_ToggleDay_Day): Web_SchedulePicker_SchedulePicker_ToggleDay_Returns => {
    const selected: Web_SchedulePicker_SchedulePicker_ToggleDay_Selected = simple['days'].includes(day);

    if (selected === true && simple['days'].length === 1) {
      return;
    }

    changeSimple({
      ...simple,
      days: (selected === true) ? simple['days'].filter((candidate) => candidate !== day) : [
        ...simple['days'],
        day,
      ],
    });

    return;
  };

  const frequency: Web_SchedulePicker_SchedulePicker_Frequency = simple['frequency'];
  const showTime: Web_SchedulePicker_SchedulePicker_ShowTime = frequency === 'daily' || frequency === 'weekly';
  const showInterval: Web_SchedulePicker_SchedulePicker_ShowInterval = frequency === 'hours';
  const next: Web_SchedulePicker_SchedulePicker_Next = nextRun(value, timeZone);

  return (
    <div className="schedule-picker">
      <div className={(showTime === true || showInterval === true) ? 'schedule-fields schedule-fields-split' : 'schedule-fields'}>
        <FieldLabel>
          <span>Frequency</span>
          <select
            className="select-control"
            onChange={(event) => changeSimple({
              ...simple,
              frequency: event.currentTarget.value as Web_SchedulePicker_SchedulePicker_Frequency,
            })}
            value={frequency}
          >
            <option value="hourly">Every hour</option>
            <option value="hours">Every few hours</option>
            <option value="daily">Every day</option>
            <option value="weekly">Every week</option>
            <option value="custom">Custom (cron)</option>
          </select>
        </FieldLabel>
        {(showInterval === true) ? (
          <FieldLabel>
            <span>Interval</span>
            <select
              className="select-control"
              onChange={(event) => changeSimple({
                ...simple,
                interval: Number(event.currentTarget.value),
              })}
              value={simple['interval']}
            >
              {scheduleIntervals.map((interval) => <option key={interval} value={interval}>{`${String(interval)} hours`}</option>)}
            </select>
          </FieldLabel>
        ) : null}
        {(showTime === true) ? (
          <FieldLabel>
            <span>Time</span>
            <input
              onChange={(event) => {
                if (event.currentTarget.value !== '') {
                  changeSimple({
                    ...simple,
                    time: event.currentTarget.value,
                  });
                }

                return;
              }}
              type="time"
              value={simple['time']}
            />
          </FieldLabel>
        ) : null}
      </div>

      {(frequency === 'weekly') ? (
        <fieldset className="schedule-days">
          <legend>Days</legend>
          <div>
            {scheduleDays.map((day) => (
              <button
                aria-label={day['name']}
                aria-pressed={simple['days'].includes(day['value'])}
                key={day['value']}
                onClick={() => toggleDay(day['value'])}
                type="button"
              >
                {day['label']}
              </button>
            ))}
          </div>
        </fieldset>
      ) : null}

      {(frequency === 'custom') ? (
        <FieldLabel>
          <span>Cron expression</span>
          <input
            aria-invalid={issue !== ''}
            className="monospace"
            onChange={(event) => {
              emitted.current = event.currentTarget.value;
              onChange(event.currentTarget.value);

              return;
            }}
            spellCheck={false}
            value={value}
          />
          {(issue === '') ? <small>Five or six fields. Seconds are optional.</small> : <small className="field-error">{issue}</small>}
        </FieldLabel>
      ) : null}

      <div className="schedule-next" role="status">
        <span>
          <Icon name="clock" size={16} />
          {(next === null) ? `Enter a valid cron schedule to see the next ${scheduledAction}.` : (
            <>
              {`Next ${scheduledAction}: `}
              <strong>{next}</strong>
              {` (${timeZone})`}
            </>
          )}
        </span>
        <code>{value.trim()}</code>
      </div>
      {(issue !== '' && frequency !== 'custom') ? <small className="field-error">{issue}</small> : null}
    </div>
  );
};

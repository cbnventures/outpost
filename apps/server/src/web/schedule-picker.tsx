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

import type {
  MutableRefObject,
  ReactElement,
} from 'react';

import type { Web_Components_SchedulePicker_Props } from '@/types/web/components.d.ts';
import type {
  Web_Schedule_Day,
  Web_Schedule_Frequency,
  Web_Schedule_Simple,
} from '@/types/web/schedule.d.ts';

/**
 * Schedule Picker.
 *
 * Picks when checks run without writing cron: every hour, every few hours, every day,
 * or chosen days, at a time. Custom shows the cron field for anyone who prefers it.
 *
 * @since 1.0.0
 */
export const SchedulePicker = ({
  issue,
  onChange,
  timeZone,
  value,
}: Web_Components_SchedulePicker_Props): ReactElement => {
  const [
    simple,
    setSimple,
  ] = useState<Web_Schedule_Simple>(parseSchedule(value));
  const emitted: MutableRefObject<string> = useRef<string>(value);

  // A value from outside, like Discard, picks the matching choice again; the picker's own edits don't.
  useEffect((): void => {
    if (value === emitted.current) {
      return;
    }

    emitted.current = value;
    setSimple(parseSchedule(value));
  }, [value]);

  /**
   * Schedule Picker - Change simple.
   *
   * Applies one choice and sends the cron it makes. Custom keeps the current cron,
   * so switching to it starts from the schedule already picked.
   *
   * @since 1.0.0
   */
  const changeSimple = (next: Web_Schedule_Simple): void => {
    setSimple(next);

    if (next['frequency'] === 'custom') {
      return;
    }

    const cron: string = buildSchedule(next);

    emitted.current = cron;
    onChange(cron);
  };

  /**
   * Schedule Picker - Toggle day.
   *
   * Adds or removes one weekday. The last day can't be removed,
   * so a weekly schedule always runs.
   *
   * @since 1.0.0
   */
  const toggleDay = (day: number): void => {
    const selected: boolean = simple['days'].includes(day);

    if (selected && simple['days'].length === 1) {
      return;
    }

    changeSimple({
      ...simple,
      days: (selected) ? simple['days'].filter((candidate: number): boolean => candidate !== day) : [
        ...simple['days'],
        day,
      ],
    });
  };

  const frequency: Web_Schedule_Frequency = simple['frequency'];
  const showTime: boolean = frequency === 'daily' || frequency === 'weekly';
  const showInterval: boolean = frequency === 'hours';
  const next: string | null = nextRun(value, timeZone);

  return (
    <div className="schedule-picker">
      <div className={(showTime || showInterval) ? 'schedule-fields schedule-fields-split' : 'schedule-fields'}>
        <FieldLabel>
          <span>Frequency</span>
          <select
            className="select-control"
            onChange={(event): void => changeSimple({
              ...simple,
              frequency: event.currentTarget.value as Web_Schedule_Frequency,
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
        {(showInterval) ? (
          <FieldLabel>
            <span>Interval</span>
            <select
              className="select-control"
              onChange={(event): void => changeSimple({
                ...simple,
                interval: Number(event.currentTarget.value),
              })}
              value={simple['interval']}
            >
              {scheduleIntervals.map((interval: number): ReactElement => <option key={interval} value={interval}>{`${String(interval)} hours`}</option>)}
            </select>
          </FieldLabel>
        ) : null}
        {(showTime) ? (
          <FieldLabel>
            <span>Time</span>
            <input
              onChange={(event): void => {
                if (event.currentTarget.value !== '') {
                  changeSimple({
                    ...simple,
                    time: event.currentTarget.value,
                  });
                }
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
            {scheduleDays.map((day: Web_Schedule_Day): ReactElement => (
              <button
                aria-label={day['name']}
                aria-pressed={simple['days'].includes(day['value'])}
                key={day['value']}
                onClick={(): void => toggleDay(day['value'])}
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
            onChange={(event): void => {
              emitted.current = event.currentTarget.value;
              onChange(event.currentTarget.value);
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
          {(next === null) ? 'Enter a valid cron schedule to see the next check.' : (
            <>
              {'Next check: '}
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

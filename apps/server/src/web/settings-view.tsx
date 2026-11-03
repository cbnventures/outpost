import {
  useEffect,
  useState,
} from 'react';

import {
  issueFor,
  summaryFor,
} from '@/web/api.ts';
import { Button } from '@/web/primitives.tsx';
import { RegistriesSection } from '@/web/registries-section.tsx';
import { SchedulePicker } from '@/web/schedule-picker.tsx';
import { showToast } from '@/web/toast.ts';

import type {
  FormEvent,
  ReactElement,
} from 'react';

import type {
  Web_Api_RuntimeSettings,
  Web_Api_Settings,
} from '@/types/web/api.d.ts';
import type { Web_Components_SettingsView_Props } from '@/types/web/components.d.ts';

/**
 * Settings View - Timing fields.
 *
 * The wait times shown under Timing, each with its label and what it waits for.
 * Each key matches a field in the saved settings.
 *
 * @since 1.0.0
 */
const timingFields = [
  [
    'stopTimeoutSeconds',
    'Stop timeout',
    'Wait for a container to stop cleanly.',
  ],
  [
    'healthTimeoutSeconds',
    'Health timeout',
    'Wait for the replacement to become healthy.',
  ],
  [
    'settleSeconds',
    'Settle time',
    'Watch the replacement after it starts.',
  ],
] as const;

/**
 * Settings View - Switch fields.
 *
 * The on and off settings, each with its name and what it does.
 * Each key matches a field in the saved settings.
 *
 * @since 1.0.0
 */
const switchFields = {
  cleanup: [
    'Clean up old images',
    'Remove the superseded image after a successful update.',
  ],
  monitorOnly: [
    'Monitor only',
    'Report available updates without replacing containers.',
  ],
  runOnStart: [
    'Check when Outpost starts',
    'Run one update check after a normal container start.',
  ],
} as const;

/**
 * Settings View.
 *
 * Edits update behavior stored in Outpost's database, one setting per row.
 * A save bar appears once something changes. Private registry sign-ins
 * save on their own, apart from the bar.
 *
 * @since 1.0.0
 */
export const SettingsView = ({
  error,
  onSave,
  settings,
}: Web_Components_SettingsView_Props): ReactElement => {
  const [
    values,
    setValues,
  ] = useState<Web_Api_RuntimeSettings | null>((settings === null) ? null : settings['runtime']);
  const [
    busy,
    setBusy,
  ] = useState<boolean>(false);
  const [
    saveError,
    setSaveError,
  ] = useState<unknown>(null);

  useEffect((): void => {
    setValues((settings === null) ? null : settings['runtime']);
  }, [settings]);

  /**
   * Settings View - Changes value.
   *
   * Updates one editable field while preserving every sibling setting.
   * The save bar shows once the values differ from the saved ones.
   *
   * @since 1.0.0
   */
  const changeValue = <Key extends keyof Web_Api_RuntimeSettings>(key: Key, value: Web_Api_RuntimeSettings[Key]): void => {
    setValues((current: Web_Api_RuntimeSettings | null): Web_Api_RuntimeSettings | null => ((current === null) ? null : {
      ...current,
      [key]: value,
    }));
  };

  /**
   * Settings View - Discard.
   *
   * Puts every field back to the saved settings and clears their errors.
   * The save bar goes away with the changes.
   *
   * @since 1.0.0
   */
  const discard = (): void => {
    setValues((settings === null) ? null : settings['runtime']);
    setSaveError(null);
  };

  /**
   * Settings View - Submit.
   *
   * Saves the complete behavior document so no field can accidentally retain a stale value.
   * Field errors stay beside their field; any other error shows as a toast.
   *
   * @since 1.0.0
   */
  const submit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    if (values === null) {
      return;
    }

    setBusy(true);
    setSaveError(null);

    try {
      const nextSettings: Web_Api_Settings = await onSave(values);

      setValues(nextSettings['runtime']);
      showToast('Settings saved.', true);
    } catch (caughtError) {
      const message: string = summaryFor(caughtError, [
        'cleanup',
        'healthTimeoutSeconds',
        'labelMode',
        'monitorOnly',
        'runOnStart',
        'schedule',
        'settleSeconds',
        'stopTimeoutSeconds',
      ], 'The settings could not be saved.');

      setSaveError(caughtError);

      if (message !== '') {
        showToast(message, false);
      }
    } finally {
      setBusy(false);
    }
  };

  if (settings === null || values === null) {
    return (
      <section className="workspace-section">
        <div className="workspace-heading">
          <h1>Settings</h1>
          <p>Control when Outpost checks for updates and how it manages containers.</p>
        </div>
        <div className="detail-loading">
          {(error === null) ? (
            <>
              <span className="spinner" />
              Loading the settings…
            </>
          ) : summaryFor(error, [], 'The settings could not be loaded.')}
        </div>
      </section>
    );
  }

  const changeCount: number = (Object.keys(values) as Array<keyof Web_Api_RuntimeSettings>).filter((key: keyof Web_Api_RuntimeSettings): boolean => values[key] !== settings['runtime'][key]).length;

  /**
   * Settings View - Switch row.
   *
   * One on and off setting, with its name and what it does on the left
   * and the switch on the right.
   *
   * @since 1.0.0
   */
  const switchRow = (key: keyof typeof switchFields): ReactElement => (
    <div className="setting-row">
      <div className="setting-copy">
        <div className="setting-title">
          <span>{switchFields[key][0]}</span>
        </div>
        <p>{switchFields[key][1]}</p>
      </div>
      <div className="setting-control">
        <label className="switch-control">
          <input aria-label={switchFields[key][0]} checked={values[key]} onChange={(event): void => changeValue(key, event.currentTarget.checked)} type="checkbox" />
          <span className="switch-track"><span /></span>
        </label>
      </div>
    </div>
  );

  return (
    <section className="workspace-section">
      <div className="workspace-heading">
        <h1>Settings</h1>
        <p>Update behavior is stored in Outpost and applies without restarting the container.</p>
      </div>

      <form noValidate onSubmit={submit}>
        <div className="panel settings-panel">
          <section className="form-section">
            <div className="form-section-head">
              <div>
                <h2>Schedule</h2>
                <p>Choose when automatic checks run.</p>
              </div>
            </div>
            <SchedulePicker
              issue={issueFor(saveError, 'schedule')}
              onChange={(cron: string): void => changeValue('schedule', cron)}
              timeZone={settings['system']['timeZone']}
              value={values['schedule']}
            />
            <div className="setting-list">
              {switchRow('runOnStart')}
            </div>
          </section>

          <section className="form-section">
            <div className="form-section-head">
              <div>
                <h2>Updates</h2>
                <p>Decide which containers Outpost manages and what it may change.</p>
              </div>
            </div>
            <div className="setting-list">
              <div className="setting-row">
                <div className="setting-copy">
                  <div className="setting-title">
                    <span id="settings-label-mode">Container selection</span>
                  </div>
                  <p>
                    {(values['labelMode'] === 'opt-in') ? 'Only containers labeled ' : 'Every container, except ones labeled '}
                    <code>{`io.cbnventures.outpost.enable=${(values['labelMode'] === 'opt-in') ? 'true' : 'false'}`}</code>
                    .
                  </p>
                </div>
                <div className="setting-control">
                  <div aria-labelledby="settings-label-mode" className="segmented settings-segmented" role="group">
                    <button aria-pressed={values['labelMode'] === 'opt-out'} onClick={(): void => changeValue('labelMode', 'opt-out')} type="button">Opt-out</button>
                    <button aria-pressed={values['labelMode'] === 'opt-in'} onClick={(): void => changeValue('labelMode', 'opt-in')} type="button">Opt-in</button>
                  </div>
                </div>
              </div>
              {switchRow('monitorOnly')}
              {switchRow('cleanup')}
            </div>
          </section>

          <section className="form-section">
            <div className="form-section-head">
              <div>
                <h2>Timing</h2>
                <p>How long Outpost waits during a container replacement.</p>
              </div>
            </div>
            <div className="setting-list">
              {timingFields.map(([
                key,
                label,
                hint,
              ]): ReactElement => (
                <div className="setting-row" key={key}>
                  <div className="setting-copy">
                    <div className="setting-title">
                      <span>{label}</span>
                    </div>
                    <p>{hint}</p>
                    {(issueFor(saveError, key) === '') ? null : <p className="field-error">{issueFor(saveError, key)}</p>}
                  </div>
                  <div className="setting-control">
                    <input
                      aria-invalid={issueFor(saveError, key) !== ''}
                      aria-label={`${label} in seconds`}
                      className="setting-input setting-input-number"
                      inputMode="numeric"
                      min="1"
                      onChange={(event): void => changeValue(key, Number(event.currentTarget.value))}
                      type="number"
                      value={values[key]}
                    />
                    <span className="setting-unit">seconds</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {(changeCount > 0 || busy) ? (
          <div aria-label="Unsaved changes" className="save-bar" role="region">
            <strong>{`${String(changeCount)} unsaved ${(changeCount === 1) ? 'change' : 'changes'}`}</strong>
            <Button disabled={busy} onClick={discard}>Discard</Button>
            <Button disabled={busy} type="submit" variant="primary">{(busy) ? 'Saving…' : 'Save'}</Button>
          </div>
        ) : null}
      </form>

      <RegistriesSection />

      <div className="panel settings-panel">
        <section className="form-section">
          <div className="form-section-head">
            <div>
              <h2>Container runtime</h2>
              <p>Set in Compose. Change them there and restart the container.</p>
            </div>
          </div>
          <dl className="details details-plain">
            <div>
              <dt>Docker host</dt>
              <dd>{settings['system']['dockerHost']}</dd>
            </div>
            <div>
              <dt>Data directory</dt>
              <dd>{settings['system']['dataDirectory']}</dd>
            </div>
          </dl>
        </section>
      </div>
    </section>
  );
};

import {
  useEffect,
  useState,
} from 'react';

import {
  issueFor,
  summaryFor,
} from '@/web/api.ts';
import { BackupView } from '@/web/backup-view.tsx';
import { DebugLoggingPanel } from '@/web/debug-logging-panel.tsx';
import { Button } from '@/web/primitives.tsx';
import { RegistriesSection } from '@/web/registries-section.tsx';
import { SchedulePicker } from '@/web/schedule-picker.tsx';
import { showToast } from '@/web/toast.ts';

import type { Web_Components_SettingsView_Props } from '@/types/web/components.d.ts';
import type {
  Web_SettingsView_SettingsView_Busy,
  Web_SettingsView_SettingsView_BusyState,
  Web_SettingsView_SettingsView_ChangeCount,
  Web_SettingsView_SettingsView_ChangeNoun,
  Web_SettingsView_SettingsView_ChangeValue,
  Web_SettingsView_SettingsView_ChangeValue_Key,
  Web_SettingsView_SettingsView_ChangeValue_Returns,
  Web_SettingsView_SettingsView_ChangeValue_Value,
  Web_SettingsView_SettingsView_ConfigurationRevision,
  Web_SettingsView_SettingsView_ConfigurationRevisionState,
  Web_SettingsView_SettingsView_Discard,
  Web_SettingsView_SettingsView_Discard_Returns,
  Web_SettingsView_SettingsView_Error,
  Web_SettingsView_SettingsView_LabelValue,
  Web_SettingsView_SettingsView_OnImported,
  Web_SettingsView_SettingsView_OnSave,
  Web_SettingsView_SettingsView_Returns,
  Web_SettingsView_SettingsView_RuntimeKeys,
  Web_SettingsView_SettingsView_SaveError,
  Web_SettingsView_SettingsView_SaveErrorState,
  Web_SettingsView_SettingsView_ScheduledActions,
  Web_SettingsView_SettingsView_SetBusy,
  Web_SettingsView_SettingsView_SetConfigurationRevision,
  Web_SettingsView_SettingsView_SetSaveError,
  Web_SettingsView_SettingsView_Settings,
  Web_SettingsView_SettingsView_SetValues,
  Web_SettingsView_SettingsView_Submit,
  Web_SettingsView_SettingsView_Submit_Event,
  Web_SettingsView_SettingsView_Submit_Message,
  Web_SettingsView_SettingsView_Submit_NextSettings,
  Web_SettingsView_SettingsView_Submit_Returns,
  Web_SettingsView_SettingsView_SwitchRow,
  Web_SettingsView_SettingsView_SwitchRow_Key,
  Web_SettingsView_SettingsView_SwitchRow_Returns,
  Web_SettingsView_SettingsView_TimingFieldHint,
  Web_SettingsView_SettingsView_TimingFieldKey,
  Web_SettingsView_SettingsView_TimingFieldLabel,
  Web_SettingsView_SettingsView_Values,
  Web_SettingsView_SettingsView_ValuesState,
} from '@/types/web/settings-view.d.ts';

/**
 * Settings View - Timing Fields.
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
 * Settings View - Switch Fields.
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
 * Settings View - Settings View.
 *
 * Edits update behavior stored in Outpost's database, one setting per row.
 * A save bar appears once something changes. Private registry sign-ins
 * save on their own, apart from the bar.
 *
 * @param {Web_Components_SettingsView_Props} props - Props.
 *
 * @returns {Web_SettingsView_SettingsView_Returns}
 *
 * @since 1.0.0
 */
export const SettingsView = (props: Web_Components_SettingsView_Props): Web_SettingsView_SettingsView_Returns => {
  const error: Web_SettingsView_SettingsView_Error = props['error'];
  const onImported: Web_SettingsView_SettingsView_OnImported = props['onImported'];
  const onSave: Web_SettingsView_SettingsView_OnSave = props['onSave'];
  const settings: Web_SettingsView_SettingsView_Settings = props['settings'];
  const valuesState: Web_SettingsView_SettingsView_ValuesState = useState<Web_SettingsView_SettingsView_Values>((settings === null) ? null : settings['runtime']);
  const values: Web_SettingsView_SettingsView_Values = valuesState[0];
  const setValues: Web_SettingsView_SettingsView_SetValues = valuesState[1];
  const busyState: Web_SettingsView_SettingsView_BusyState = useState<Web_SettingsView_SettingsView_Busy>(false);
  const busy: Web_SettingsView_SettingsView_Busy = busyState[0];
  const setBusy: Web_SettingsView_SettingsView_SetBusy = busyState[1];
  const saveErrorState: Web_SettingsView_SettingsView_SaveErrorState = useState<Web_SettingsView_SettingsView_SaveError>(null);
  const saveError: Web_SettingsView_SettingsView_SaveError = saveErrorState[0];
  const setSaveError: Web_SettingsView_SettingsView_SetSaveError = saveErrorState[1];
  const configurationRevisionState: Web_SettingsView_SettingsView_ConfigurationRevisionState = useState<Web_SettingsView_SettingsView_ConfigurationRevision>(0);
  const configurationRevision: Web_SettingsView_SettingsView_ConfigurationRevision = configurationRevisionState[0];
  const setConfigurationRevision: Web_SettingsView_SettingsView_SetConfigurationRevision = configurationRevisionState[1];

  useEffect(() => {
    setValues((settings === null) ? null : settings['runtime']);

    return;
  }, [settings]);

  /**
   * Settings View - Change Value.
   *
   * Updates one editable field while preserving every sibling setting.
   * The save bar shows once the values differ from the saved ones.
   *
   * @param {Web_SettingsView_SettingsView_ChangeValue_Key}   key   - Key.
   * @param {Web_SettingsView_SettingsView_ChangeValue_Value} value - Value.
   *
   * @returns {Web_SettingsView_SettingsView_ChangeValue_Returns}
   *
   * @since 1.0.0
   */
  const changeValue: Web_SettingsView_SettingsView_ChangeValue = (key: Web_SettingsView_SettingsView_ChangeValue_Key, value: Web_SettingsView_SettingsView_ChangeValue_Value): Web_SettingsView_SettingsView_ChangeValue_Returns => {
    setValues((current) => ((current === null) ? null : {
      ...current,
      [key]: value,
    }));

    return;
  };

  /**
   * Settings View - Discard.
   *
   * Puts every field back to the saved settings and clears their errors.
   * The save bar goes away with the changes.
   *
   * @returns {Web_SettingsView_SettingsView_Discard_Returns}
   *
   * @since 1.0.0
   */
  const discard: Web_SettingsView_SettingsView_Discard = (): Web_SettingsView_SettingsView_Discard_Returns => {
    setValues((settings === null) ? null : settings['runtime']);
    setSaveError(null);

    return;
  };

  /**
   * Settings View - Submit.
   *
   * Saves the complete behavior document so no field can accidentally retain a stale value.
   * Field errors stay beside their field; any other error shows as a toast.
   *
   * @param {Web_SettingsView_SettingsView_Submit_Event} event - Event.
   *
   * @returns {Web_SettingsView_SettingsView_Submit_Returns}
   *
   * @since 1.0.0
   */
  const submit: Web_SettingsView_SettingsView_Submit = async (event: Web_SettingsView_SettingsView_Submit_Event): Web_SettingsView_SettingsView_Submit_Returns => {
    event.preventDefault();

    if (values === null) {
      return;
    }

    setBusy(true);
    setSaveError(null);

    try {
      const nextSettings: Web_SettingsView_SettingsView_Submit_NextSettings = await onSave(values);

      setValues(nextSettings['runtime']);
      showToast('Settings saved.', true);
    } catch (caughtError) {
      const message: Web_SettingsView_SettingsView_Submit_Message = summaryFor(caughtError, [
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

    return;
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

  const runtimeKeys: Web_SettingsView_SettingsView_RuntimeKeys = Object.keys(values) as Web_SettingsView_SettingsView_RuntimeKeys;
  const changeCount: Web_SettingsView_SettingsView_ChangeCount = runtimeKeys.filter((runtimeKey) => values[runtimeKey] !== settings['runtime'][runtimeKey]).length;
  const scheduledActions: Web_SettingsView_SettingsView_ScheduledActions = (values['monitorOnly'] === true) ? 'checks' : 'updates';
  const labelValue: Web_SettingsView_SettingsView_LabelValue = (values['labelMode'] === 'opt-in') ? 'true' : 'false';
  const changeNoun: Web_SettingsView_SettingsView_ChangeNoun = (changeCount === 1) ? 'change' : 'changes';

  /**
   * Settings View - Switch Row.
   *
   * One on and off setting, with its name and what it does on the left
   * and the switch on the right.
   *
   * @param {Web_SettingsView_SettingsView_SwitchRow_Key} key - Key.
   *
   * @returns {Web_SettingsView_SettingsView_SwitchRow_Returns}
   *
   * @since 1.0.0
   */
  const switchRow: Web_SettingsView_SettingsView_SwitchRow = (key: Web_SettingsView_SettingsView_SwitchRow_Key): Web_SettingsView_SettingsView_SwitchRow_Returns => (
    <div className="setting-row">
      <div className="setting-copy">
        <div className="setting-title">
          <span>{switchFields[key][0]}</span>
        </div>
        <p>{switchFields[key][1]}</p>
      </div>
      <div className="setting-control">
        <label className="switch-control">
          <input aria-label={switchFields[key][0]} checked={values[key]} onChange={(event) => changeValue(key, event.currentTarget.checked)} type="checkbox" />
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
                <p>{`Choose when automatic ${scheduledActions} run.`}</p>
              </div>
            </div>
            <SchedulePicker
              issue={issueFor(saveError, 'schedule')}
              monitorOnly={values['monitorOnly']}
              onChange={(cron) => changeValue('schedule', cron)}
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
                    <code>{`io.cbnventures.outpost.enable=${labelValue}`}</code>
                    .
                  </p>
                </div>
                <div className="setting-control">
                  <div aria-labelledby="settings-label-mode" className="segmented settings-segmented" role="group">
                    <button aria-pressed={values['labelMode'] === 'opt-out'} onClick={() => changeValue('labelMode', 'opt-out')} type="button">Opt-out</button>
                    <button aria-pressed={values['labelMode'] === 'opt-in'} onClick={() => changeValue('labelMode', 'opt-in')} type="button">Opt-in</button>
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
              {timingFields.map((timingField) => {
                const timingFieldKey: Web_SettingsView_SettingsView_TimingFieldKey = timingField[0];
                const timingFieldLabel: Web_SettingsView_SettingsView_TimingFieldLabel = timingField[1];
                const timingFieldHint: Web_SettingsView_SettingsView_TimingFieldHint = timingField[2];

                return (
                  <div className="setting-row" key={timingFieldKey}>
                    <div className="setting-copy">
                      <div className="setting-title">
                        <span>{timingFieldLabel}</span>
                      </div>
                      <p>{timingFieldHint}</p>
                      {(issueFor(saveError, timingFieldKey) === '') ? null : <p className="field-error">{issueFor(saveError, timingFieldKey)}</p>}
                    </div>
                    <div className="setting-control">
                      <input
                        aria-invalid={issueFor(saveError, timingFieldKey) !== ''}
                        aria-label={`${timingFieldLabel} in seconds`}
                        className="setting-input setting-input-number"
                        inputMode="numeric"
                        min="1"
                        onChange={(event) => changeValue(timingFieldKey, Number(event.currentTarget.value))}
                        type="number"
                        value={values[timingFieldKey]}
                      />
                      <span className="setting-unit">seconds</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {(changeCount > 0 || busy === true) ? (
          <div aria-label="Unsaved changes" className="save-bar" role="region">
            <strong>{`${String(changeCount)} unsaved ${changeNoun}`}</strong>
            <Button disabled={busy} onClick={discard}>Discard</Button>
            <Button disabled={busy} type="submit" variant="primary">{(busy === true) ? 'Saving…' : 'Save'}</Button>
          </div>
        ) : null}
      </form>

      <RegistriesSection key={configurationRevision} />

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

      <BackupView
        currentSettings={settings['runtime']}
        onImported={async () => {
          await onImported();
          setConfigurationRevision((revision) => revision + 1);

          return;
        }}
        timeZone={settings['system']['timeZone']}
      />

      <DebugLoggingPanel />
    </section>
  );
};

import {
  useEffect,
  useId,
  useState,
} from 'react';

import {
  createRegistry,
  issueFor,
  summaryFor,
  updateRegistry,
} from '@/web/api.ts';
import { FieldLabel } from '@/web/field-label.tsx';
import {
  Button,
  Icon,
  passwordManagerIgnore,
} from '@/web/primitives.tsx';
import { showToast } from '@/web/toast.ts';
import { useDialogFocus } from '@/web/use-dialog-focus.ts';
import { useEscapeKey } from '@/web/use-escape-key.ts';

import type { Web_Components_RegistryDialog_Props } from '@/types/web/components.d.ts';
import type {
  Web_RegistryDialog_RegistryDialog_Busy,
  Web_RegistryDialog_RegistryDialog_BusyState,
  Web_RegistryDialog_RegistryDialog_DialogRef,
  Web_RegistryDialog_RegistryDialog_Editing,
  Web_RegistryDialog_RegistryDialog_Error,
  Web_RegistryDialog_RegistryDialog_ErrorState,
  Web_RegistryDialog_RegistryDialog_Host,
  Web_RegistryDialog_RegistryDialog_HostIssue,
  Web_RegistryDialog_RegistryDialog_HostState,
  Web_RegistryDialog_RegistryDialog_OnClose,
  Web_RegistryDialog_RegistryDialog_OnSaved,
  Web_RegistryDialog_RegistryDialog_Open,
  Web_RegistryDialog_RegistryDialog_Password,
  Web_RegistryDialog_RegistryDialog_PasswordHint,
  Web_RegistryDialog_RegistryDialog_PasswordIssue,
  Web_RegistryDialog_RegistryDialog_PasswordState,
  Web_RegistryDialog_RegistryDialog_Registry,
  Web_RegistryDialog_RegistryDialog_Returns,
  Web_RegistryDialog_RegistryDialog_SetBusy,
  Web_RegistryDialog_RegistryDialog_SetError,
  Web_RegistryDialog_RegistryDialog_SetHost,
  Web_RegistryDialog_RegistryDialog_SetPassword,
  Web_RegistryDialog_RegistryDialog_SetUsername,
  Web_RegistryDialog_RegistryDialog_Submit,
  Web_RegistryDialog_RegistryDialog_Submit_Event,
  Web_RegistryDialog_RegistryDialog_Submit_Returns,
  Web_RegistryDialog_RegistryDialog_Submit_Saved,
  Web_RegistryDialog_RegistryDialog_Summary,
  Web_RegistryDialog_RegistryDialog_TitleId,
  Web_RegistryDialog_RegistryDialog_Username,
  Web_RegistryDialog_RegistryDialog_UsernameIssue,
  Web_RegistryDialog_RegistryDialog_UsernameState,
} from '@/types/web/registry-dialog.d.ts';

/**
 * Registry Dialog - Registry Dialog.
 *
 * Adds a private registry sign-in or edits one. When editing, an empty password
 * keeps the saved one, so only the host or username can change.
 *
 * @param {Web_Components_RegistryDialog_Props} props - Props.
 *
 * @returns {Web_RegistryDialog_RegistryDialog_Returns}
 *
 * @since 1.0.0
 */
export const RegistryDialog = (props: Web_Components_RegistryDialog_Props): Web_RegistryDialog_RegistryDialog_Returns => {
  const onClose: Web_RegistryDialog_RegistryDialog_OnClose = props['onClose'];
  const onSaved: Web_RegistryDialog_RegistryDialog_OnSaved = props['onSaved'];
  const open: Web_RegistryDialog_RegistryDialog_Open = props['open'];
  const registry: Web_RegistryDialog_RegistryDialog_Registry = props['registry'];
  const hostState: Web_RegistryDialog_RegistryDialog_HostState = useState<Web_RegistryDialog_RegistryDialog_Host>('');
  const host: Web_RegistryDialog_RegistryDialog_Host = hostState[0];
  const setHost: Web_RegistryDialog_RegistryDialog_SetHost = hostState[1];
  const usernameState: Web_RegistryDialog_RegistryDialog_UsernameState = useState<Web_RegistryDialog_RegistryDialog_Username>('');
  const username: Web_RegistryDialog_RegistryDialog_Username = usernameState[0];
  const setUsername: Web_RegistryDialog_RegistryDialog_SetUsername = usernameState[1];
  const passwordState: Web_RegistryDialog_RegistryDialog_PasswordState = useState<Web_RegistryDialog_RegistryDialog_Password>('');
  const password: Web_RegistryDialog_RegistryDialog_Password = passwordState[0];
  const setPassword: Web_RegistryDialog_RegistryDialog_SetPassword = passwordState[1];
  const busyState: Web_RegistryDialog_RegistryDialog_BusyState = useState<Web_RegistryDialog_RegistryDialog_Busy>(false);
  const busy: Web_RegistryDialog_RegistryDialog_Busy = busyState[0];
  const setBusy: Web_RegistryDialog_RegistryDialog_SetBusy = busyState[1];
  const errorState: Web_RegistryDialog_RegistryDialog_ErrorState = useState<Web_RegistryDialog_RegistryDialog_Error>(null);
  const error: Web_RegistryDialog_RegistryDialog_Error = errorState[0];
  const setError: Web_RegistryDialog_RegistryDialog_SetError = errorState[1];
  const titleId: Web_RegistryDialog_RegistryDialog_TitleId = useId();
  const dialogRef: Web_RegistryDialog_RegistryDialog_DialogRef = useDialogFocus(open);
  const editing: Web_RegistryDialog_RegistryDialog_Editing = registry !== null;

  // Each opening starts from the registry being edited, or from empty fields for a new one.
  useEffect(() => {
    if (open === false) {
      return;
    }

    setHost((registry === null) ? '' : registry['registry']);
    setUsername((registry === null) ? '' : registry['username']);
    setPassword('');
    setError(null);

    return;
  }, [
    open,
    registry,
  ]);

  useEscapeKey(() => {
    if (busy === false) {
      onClose();
    }

    return;
  }, open);

  if (open === false) {
    return null;
  }

  /**
   * Registry Dialog - Submit.
   *
   * Saves the sign-in, refreshes the list, and confirms it with a toast.
   * Field errors show beside their field; others show above the buttons.
   *
   * @param {Web_RegistryDialog_RegistryDialog_Submit_Event} event - Event.
   *
   * @returns {Web_RegistryDialog_RegistryDialog_Submit_Returns}
   *
   * @since 1.0.0
   */
  const submit: Web_RegistryDialog_RegistryDialog_Submit = async (event: Web_RegistryDialog_RegistryDialog_Submit_Event): Web_RegistryDialog_RegistryDialog_Submit_Returns => {
    event.preventDefault();

    setBusy(true);
    setError(null);

    try {
      const saved: Web_RegistryDialog_RegistryDialog_Submit_Saved = (registry === null) ? await createRegistry({
        password,
        registry: host,
        username,
      }) : await updateRegistry(registry['id'], {
        ...((password === '') ? {} : { password }),
        registry: host,
        username,
      });

      await onSaved();
      showToast((registry === null) ? `${saved['registry']} added.` : `${saved['registry']} saved.`, true);
      onClose();
    } catch (caughtError) {
      setError(caughtError);
    } finally {
      setBusy(false);
    }

    return;
  };

  const hostIssue: Web_RegistryDialog_RegistryDialog_HostIssue = issueFor(error, 'registry');
  const usernameIssue: Web_RegistryDialog_RegistryDialog_UsernameIssue = issueFor(error, 'username');
  const passwordIssue: Web_RegistryDialog_RegistryDialog_PasswordIssue = issueFor(error, 'password');
  const summary: Web_RegistryDialog_RegistryDialog_Summary = summaryFor(error, [
    'password',
    'registry',
    'username',
  ], 'The registry could not be saved.');
  let passwordHint: Web_RegistryDialog_RegistryDialog_PasswordHint = 'A password, or an access token if the registry offers one.';

  if (registry !== null && registry['passwordMissing'] === true) {
    passwordHint = 'The saved password was removed. Enter it again.';
  } else if (registry !== null) {
    passwordHint = 'Leave it empty to keep the saved one.';
  }

  return (
    <div className="dialog-backdrop" role="presentation">
      <section aria-labelledby={titleId} aria-modal="true" className="dialog" ref={dialogRef} role="dialog" tabIndex={-1}>
        <div className="dialog-heading">
          <div>
            <h2 id={titleId}>{(registry === null) ? 'Add registry' : `Edit ${registry['registry']}`}</h2>
            <p>Outpost signs in with this when it checks or pulls images from the registry.</p>
          </div>
          <button aria-label="Close" className="icon-button" disabled={busy} onClick={onClose} type="button">
            <Icon name="x" size={18} />
          </button>
        </div>

        <form noValidate onSubmit={submit}>
          <FieldLabel>
            <span>Registry</span>
            <input
              aria-invalid={hostIssue !== ''}
              autoCapitalize="none"
              className="monospace"
              onChange={(event) => setHost(event.currentTarget.value)}
              placeholder="e.g. ghcr.io"
              spellCheck={false}
              value={host}
            />
            {(hostIssue === '') ? <small>Its address, like ghcr.io or registry.example.com:5000. Use docker.io for Docker Hub.</small> : <small className="field-error">{hostIssue}</small>}
          </FieldLabel>
          <div className="field-row">
            <FieldLabel>
              <span>Username</span>
              <input
                {...passwordManagerIgnore}
                aria-invalid={usernameIssue !== ''}
                autoCapitalize="none"
                autoComplete="off"
                onChange={(event) => setUsername(event.currentTarget.value)}
                spellCheck={false}
                value={username}
              />
              {(usernameIssue === '') ? null : <small className="field-error">{usernameIssue}</small>}
            </FieldLabel>
            <FieldLabel>
              <span>Password</span>
              <input
                {...passwordManagerIgnore}
                aria-invalid={passwordIssue !== ''}
                autoComplete="off"
                onChange={(event) => setPassword(event.currentTarget.value)}
                type="password"
                value={password}
              />
              {(passwordIssue === '') ? <small>{passwordHint}</small> : <small className="field-error">{passwordIssue}</small>}
            </FieldLabel>
          </div>

          {(summary === '') ? null : (
            <div className="form-error" role="alert">
              <Icon name="warning" size={16} />
              <span>{summary}</span>
            </div>
          )}

          <div className="dialog-actions">
            <Button disabled={busy} onClick={onClose}>Cancel</Button>
            <Button
              disabled={(
                busy === true
                || host.trim() === ''
                || username.trim() === ''
                || (
                  editing === false
                  && password === ''
                )
              )}
              type="submit"
              variant="primary"
            >
              {(editing === true) ? 'Save' : 'Add registry'}
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
};

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
} from '@/web/primitives.tsx';
import { showToast } from '@/web/toast.ts';
import { useDialogFocus } from '@/web/use-dialog-focus.ts';
import { useEscapeKey } from '@/web/use-escape-key.ts';

import type {
  FormEvent,
  ReactElement,
} from 'react';

import type { Web_Api_Registry } from '@/types/web/api.d.ts';
import type { Web_Components_RegistryDialog_Props } from '@/types/web/components.d.ts';

/**
 * Registry Dialog.
 *
 * Adds a private registry sign-in or edits one. When editing, an empty password
 * keeps the saved one, so only the host or username can change.
 *
 * @since 1.0.0
 */
export const RegistryDialog = ({
  onClose,
  onSaved,
  open,
  registry,
}: Web_Components_RegistryDialog_Props): ReactElement | null => {
  const [
    host,
    setHost,
  ] = useState<string>('');
  const [
    username,
    setUsername,
  ] = useState<string>('');
  const [
    password,
    setPassword,
  ] = useState<string>('');
  const [
    busy,
    setBusy,
  ] = useState<boolean>(false);
  const [
    error,
    setError,
  ] = useState<unknown>(null);
  const titleId: string = useId();
  const dialogRef = useDialogFocus(open);
  const editing: boolean = registry !== null;

  // Each opening starts from the registry being edited, or from empty fields for a new one.
  useEffect((): void => {
    if (!open) {
      return;
    }

    setHost((registry === null) ? '' : registry['registry']);
    setUsername((registry === null) ? '' : registry['username']);
    setPassword('');
    setError(null);
  }, [
    open,
    registry,
  ]);

  useEscapeKey((): void => {
    if (!busy) {
      onClose();
    }
  }, open);

  if (!open) {
    return null;
  }

  /**
   * Registry Dialog - Submit.
   *
   * Saves the sign-in, refreshes the list, and confirms it with a toast.
   * Field errors show beside their field; others show above the buttons.
   *
   * @since 1.0.0
   */
  const submit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setBusy(true);
    setError(null);

    try {
      const saved: Web_Api_Registry = (registry === null) ? await createRegistry({
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
  };

  const hostIssue: string = issueFor(error, 'registry');
  const usernameIssue: string = issueFor(error, 'username');
  const passwordIssue: string = issueFor(error, 'password');
  const summary: string = summaryFor(error, [
    'password',
    'registry',
    'username',
  ], 'The registry could not be saved.');
  let passwordHint: string = 'A password, or an access token if the registry offers one.';

  if (registry !== null && registry['passwordMissing']) {
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
              onChange={(event): void => setHost(event.currentTarget.value)}
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
                aria-invalid={usernameIssue !== ''}
                autoCapitalize="none"
                autoComplete="off"
                onChange={(event): void => setUsername(event.currentTarget.value)}
                spellCheck={false}
                value={username}
              />
              {(usernameIssue === '') ? null : <small className="field-error">{usernameIssue}</small>}
            </FieldLabel>
            <FieldLabel>
              <span>Password</span>
              <input
                aria-invalid={passwordIssue !== ''}
                autoComplete="new-password"
                onChange={(event): void => setPassword(event.currentTarget.value)}
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
            <Button disabled={busy || host.trim() === '' || username.trim() === '' || (!editing && password === '')} type="submit" variant="primary">
              {(editing) ? 'Save' : 'Add registry'}
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
};

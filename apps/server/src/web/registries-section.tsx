import {
  useEffect,
  useState,
} from 'react';

import {
  getRegistries,
  removeRegistry,
  summaryFor,
} from '@/web/api.ts';
import { ConfirmDialog } from '@/web/confirm-dialog.tsx';
import {
  formatShortDate,
  keepTogether,
} from '@/web/format.ts';
import { Button } from '@/web/primitives.tsx';
import { RegistryDialog } from '@/web/registry-dialog.tsx';
import { showToast } from '@/web/toast.ts';

import type { ReactElement } from 'react';

import type { Web_Api_Registry } from '@/types/web/api.d.ts';

/**
 * Registries Section.
 *
 * Lists the private registry sign-ins Outpost pulls with. Each one is added,
 * edited, and removed on its own, apart from the settings form's save bar.
 *
 * @since 1.0.0
 */
export const RegistriesSection = (): ReactElement => {
  const [
    registries,
    setRegistries,
  ] = useState<Web_Api_Registry[] | null>(null);
  const [
    loadError,
    setLoadError,
  ] = useState<string>('');
  const [
    dialogOpen,
    setDialogOpen,
  ] = useState<boolean>(false);
  const [
    editing,
    setEditing,
  ] = useState<Web_Api_Registry | null>(null);
  const [
    removing,
    setRemoving,
  ] = useState<Web_Api_Registry | null>(null);
  const [
    removeError,
    setRemoveError,
  ] = useState<string>('');
  const [
    busy,
    setBusy,
  ] = useState<boolean>(false);

  /**
   * Registries Section - Load.
   *
   * Reads the sign-ins again after the page opens or one of them changes.
   * A failure shows above the list instead of the rows.
   *
   * @since 1.0.0
   */
  const load = async (): Promise<void> => {
    try {
      setRegistries(await getRegistries());
      setLoadError('');
    } catch (caughtError) {
      setLoadError(summaryFor(caughtError, [], 'The registries could not be loaded.'));
    }
  };

  useEffect((): void => {
    void load();
  }, []);

  /**
   * Registries Section - Remove.
   *
   * Removes the sign-in picked in the confirm dialog.
   * A failure stays in the dialog so it can be tried again.
   *
   * @since 1.0.0
   */
  const remove = async (registry: Web_Api_Registry): Promise<void> => {
    setBusy(true);
    setRemoveError('');

    try {
      await removeRegistry(registry['id']);
      setRemoving(null);
      showToast(`${registry['registry']} removed.`, true);
      await load();
    } catch (caughtError) {
      setRemoveError(summaryFor(caughtError, [], 'The registry could not be removed.'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="panel settings-panel">
      <section className="form-section">
        <div className="form-section-head">
          <div>
            <h2>Private registries</h2>
            <p>Sign-ins Outpost uses to pull private images.</p>
          </div>
          <Button
            disabled={registries === null}
            icon="add"
            onClick={(): void => {
              setEditing(null);
              setDialogOpen(true);
            }}
          >
            Add registry
          </Button>
        </div>

        {(loadError === '') ? null : <p className="field-error">{loadError}</p>}
        {(registries === null && loadError === '') ? <p className="form-section-note">Loading…</p> : null}
        {(registries !== null && registries.length === 0) ? <p className="form-section-note">No sign-ins yet. Public images don&apos;t need one.</p> : null}
        {(registries === null || registries.length === 0) ? null : (
          <div className="setting-list">
            {registries.map((registry: Web_Api_Registry): ReactElement => (
              <div className="setting-row" key={registry['id']}>
                <div className="setting-copy">
                  <div className="setting-title">
                    <span className="mono">{registry['registry']}</span>
                  </div>
                  <p>{`${registry['username']} · ${keepTogether(`added ${formatShortDate(registry['createdAt'])}`)}`}</p>
                  {(registry['passwordMissing']) ? <p className="field-error">The saved password was removed. Edit this sign-in to enter it again.</p> : null}
                </div>
                <div className="setting-control">
                  <Button
                    icon="edit"
                    onClick={(): void => {
                      setEditing(registry);
                      setDialogOpen(true);
                    }}
                    variant="quiet"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={(): void => {
                      setRemoveError('');
                      setRemoving(registry);
                    }}
                    variant="danger"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <RegistryDialog
        onClose={(): void => setDialogOpen(false)}
        onSaved={load}
        open={dialogOpen}
        registry={editing}
      />

      <ConfirmDialog
        busy={busy}
        busyLabel="Removing…"
        confirmLabel="Remove"
        error={removeError}
        message="Outpost stops signing in to this registry, so updates for its private images fail until it's added again."
        onCancel={(): void => setRemoving(null)}
        onConfirm={(): void => {
          if (removing !== null) {
            void remove(removing);
          }
        }}
        open={removing !== null}
        title={`Remove ${removing?.['registry'] ?? 'registry'}?`}
      />
    </div>
  );
};

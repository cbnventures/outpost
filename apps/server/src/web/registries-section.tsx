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

import type {
  Web_RegistriesSection_RegistriesSection_Busy,
  Web_RegistriesSection_RegistriesSection_BusyState,
  Web_RegistriesSection_RegistriesSection_DialogOpen,
  Web_RegistriesSection_RegistriesSection_DialogOpenState,
  Web_RegistriesSection_RegistriesSection_Editing,
  Web_RegistriesSection_RegistriesSection_EditingState,
  Web_RegistriesSection_RegistriesSection_Load,
  Web_RegistriesSection_RegistriesSection_Load_Returns,
  Web_RegistriesSection_RegistriesSection_LoadError,
  Web_RegistriesSection_RegistriesSection_LoadErrorState,
  Web_RegistriesSection_RegistriesSection_Registries,
  Web_RegistriesSection_RegistriesSection_RegistriesState,
  Web_RegistriesSection_RegistriesSection_Remove,
  Web_RegistriesSection_RegistriesSection_Remove_Registry,
  Web_RegistriesSection_RegistriesSection_Remove_Returns,
  Web_RegistriesSection_RegistriesSection_RemoveError,
  Web_RegistriesSection_RegistriesSection_RemoveErrorState,
  Web_RegistriesSection_RegistriesSection_Removing,
  Web_RegistriesSection_RegistriesSection_RemovingName,
  Web_RegistriesSection_RegistriesSection_RemovingState,
  Web_RegistriesSection_RegistriesSection_Returns,
  Web_RegistriesSection_RegistriesSection_SetBusy,
  Web_RegistriesSection_RegistriesSection_SetDialogOpen,
  Web_RegistriesSection_RegistriesSection_SetEditing,
  Web_RegistriesSection_RegistriesSection_SetLoadError,
  Web_RegistriesSection_RegistriesSection_SetRegistries,
  Web_RegistriesSection_RegistriesSection_SetRemoveError,
  Web_RegistriesSection_RegistriesSection_SetRemoving,
} from '@/types/web/registries-section.d.ts';

/**
 * Registries Section - Registries Section.
 *
 * Lists the private registry sign-ins Outpost pulls with. Each one is added,
 * edited, and removed on its own, apart from the settings form's save bar.
 *
 * @returns {Web_RegistriesSection_RegistriesSection_Returns}
 *
 * @since 1.0.0
 */
export const RegistriesSection = (): Web_RegistriesSection_RegistriesSection_Returns => {
  const registriesState: Web_RegistriesSection_RegistriesSection_RegistriesState = useState<Web_RegistriesSection_RegistriesSection_Registries>(null);
  const registries: Web_RegistriesSection_RegistriesSection_Registries = registriesState[0];
  const setRegistries: Web_RegistriesSection_RegistriesSection_SetRegistries = registriesState[1];
  const loadErrorState: Web_RegistriesSection_RegistriesSection_LoadErrorState = useState<Web_RegistriesSection_RegistriesSection_LoadError>('');
  const loadError: Web_RegistriesSection_RegistriesSection_LoadError = loadErrorState[0];
  const setLoadError: Web_RegistriesSection_RegistriesSection_SetLoadError = loadErrorState[1];
  const dialogOpenState: Web_RegistriesSection_RegistriesSection_DialogOpenState = useState<Web_RegistriesSection_RegistriesSection_DialogOpen>(false);
  const dialogOpen: Web_RegistriesSection_RegistriesSection_DialogOpen = dialogOpenState[0];
  const setDialogOpen: Web_RegistriesSection_RegistriesSection_SetDialogOpen = dialogOpenState[1];
  const editingState: Web_RegistriesSection_RegistriesSection_EditingState = useState<Web_RegistriesSection_RegistriesSection_Editing>(null);
  const editing: Web_RegistriesSection_RegistriesSection_Editing = editingState[0];
  const setEditing: Web_RegistriesSection_RegistriesSection_SetEditing = editingState[1];
  const removingState: Web_RegistriesSection_RegistriesSection_RemovingState = useState<Web_RegistriesSection_RegistriesSection_Removing>(null);
  const removing: Web_RegistriesSection_RegistriesSection_Removing = removingState[0];
  const setRemoving: Web_RegistriesSection_RegistriesSection_SetRemoving = removingState[1];
  const removeErrorState: Web_RegistriesSection_RegistriesSection_RemoveErrorState = useState<Web_RegistriesSection_RegistriesSection_RemoveError>('');
  const removeError: Web_RegistriesSection_RegistriesSection_RemoveError = removeErrorState[0];
  const setRemoveError: Web_RegistriesSection_RegistriesSection_SetRemoveError = removeErrorState[1];
  const busyState: Web_RegistriesSection_RegistriesSection_BusyState = useState<Web_RegistriesSection_RegistriesSection_Busy>(false);
  const busy: Web_RegistriesSection_RegistriesSection_Busy = busyState[0];
  const setBusy: Web_RegistriesSection_RegistriesSection_SetBusy = busyState[1];

  /**
   * Registries Section - Load.
   *
   * Reads the sign-ins again after the page opens or one of them changes.
   * A failure shows above the list instead of the rows.
   *
   * @returns {Web_RegistriesSection_RegistriesSection_Load_Returns}
   *
   * @since 1.0.0
   */
  const load: Web_RegistriesSection_RegistriesSection_Load = async (): Web_RegistriesSection_RegistriesSection_Load_Returns => {
    try {
      setRegistries(await getRegistries());
      setLoadError('');
    } catch (caughtError) {
      setLoadError(summaryFor(caughtError, [], 'The registries could not be loaded.'));
    }

    return;
  };

  useEffect(() => {
    void load();

    return;
  }, []);

  /**
   * Registries Section - Remove.
   *
   * Removes the sign-in picked in the confirm dialog.
   * A failure stays in the dialog so it can be tried again.
   *
   * @param {Web_RegistriesSection_RegistriesSection_Remove_Registry} registry - Registry.
   *
   * @returns {Web_RegistriesSection_RegistriesSection_Remove_Returns}
   *
   * @since 1.0.0
   */
  const remove: Web_RegistriesSection_RegistriesSection_Remove = async (registry: Web_RegistriesSection_RegistriesSection_Remove_Registry): Web_RegistriesSection_RegistriesSection_Remove_Returns => {
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

    return;
  };

  const removingName: Web_RegistriesSection_RegistriesSection_RemovingName = (removing === null) ? 'registry' : removing['registry'];

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
            onClick={() => {
              setEditing(null);
              setDialogOpen(true);

              return;
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
            {registries.map((registry) => (
              <div className="setting-row" key={registry['id']}>
                <div className="setting-copy">
                  <div className="setting-title">
                    <span className="mono">{registry['registry']}</span>
                  </div>
                  <p>{`${registry['username']} · ${keepTogether(`added ${formatShortDate(registry['createdAt'])}`)}`}</p>
                  {(registry['passwordMissing'] === true) ? <p className="field-error">The saved password was removed. Edit this sign-in to enter it again.</p> : null}
                </div>
                <div className="setting-control">
                  <Button
                    icon="edit"
                    onClick={() => {
                      setEditing(registry);
                      setDialogOpen(true);

                      return;
                    }}
                    variant="quiet"
                  >
                    Edit
                  </Button>
                  <Button
                    icon="remove"
                    onClick={() => {
                      setRemoveError('');
                      setRemoving(registry);

                      return;
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
        onClose={() => setDialogOpen(false)}
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
        onCancel={() => setRemoving(null)}
        onConfirm={() => {
          if (removing !== null) {
            void remove(removing);
          }

          return;
        }}
        open={removing !== null}
        title={`Remove ${removingName}?`}
      />
    </div>
  );
};

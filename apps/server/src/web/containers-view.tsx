import {
  useEffect,
  useState,
} from 'react';

import {
  ApiError,
  summaryFor,
} from '@/web/api.ts';
import { ConfirmDialog } from '@/web/confirm-dialog.tsx';
import { formatRelative } from '@/web/format.ts';
import {
  BreakableText,
  ImageName,
} from '@/web/image-name.tsx';
import {
  statusClasses,
  statusLabels,
} from '@/web/labels.ts';
import {
  Button,
  Icon,
} from '@/web/primitives.tsx';
import { showToast } from '@/web/toast.ts';

import type {
  Web_Components_ContainerCell_Props,
  Web_Components_ContainersView_Props,
  Web_Components_UpdateConfirmationDialog_Props,
} from '@/types/web/components.d.ts';
import type {
  Web_ContainersView_ActionLabel_Checking,
  Web_ContainersView_ActionLabel_Container,
  Web_ContainersView_ActionLabel_Returns,
  Web_ContainersView_ActionLabel_Updating,
  Web_ContainersView_ContainersView_ActionError,
  Web_ContainersView_ContainersView_ActionErrorState,
  Web_ContainersView_ContainersView_AvailableCount,
  Web_ContainersView_ContainersView_Busy,
  Web_ContainersView_ContainersView_BusyState,
  Web_ContainersView_ContainersView_Check,
  Web_ContainersView_ContainersView_Check_Container,
  Web_ContainersView_ContainersView_Check_Returns,
  Web_ContainersView_ContainersView_Checking,
  Web_ContainersView_ContainersView_CheckingState,
  Web_ContainersView_ContainersView_ConfirmedContainer,
  Web_ContainersView_ContainersView_ConfirmingUpdate,
  Web_ContainersView_ContainersView_ConfirmingUpdateAll,
  Web_ContainersView_ContainersView_ConfirmingUpdateAllState,
  Web_ContainersView_ContainersView_ConfirmingUpdateState,
  Web_ContainersView_ContainersView_Containers,
  Web_ContainersView_ContainersView_Content,
  Web_ContainersView_ContainersView_Error,
  Web_ContainersView_ContainersView_OnRefresh,
  Web_ContainersView_ContainersView_OnStartCheck,
  Web_ContainersView_ContainersView_OnStartUpdate,
  Web_ContainersView_ContainersView_Overview,
  Web_ContainersView_ContainersView_Refresh,
  Web_ContainersView_ContainersView_Refresh_Returns,
  Web_ContainersView_ContainersView_Returns,
  Web_ContainersView_ContainersView_Running,
  Web_ContainersView_ContainersView_SetActionError,
  Web_ContainersView_ContainersView_SetBusy,
  Web_ContainersView_ContainersView_SetChecking,
  Web_ContainersView_ContainersView_SetConfirmingUpdate,
  Web_ContainersView_ContainersView_SetConfirmingUpdateAll,
  Web_ContainersView_ContainersView_SetUpdating,
  Web_ContainersView_ContainersView_Update,
  Web_ContainersView_ContainersView_Update_Container,
  Web_ContainersView_ContainersView_Update_Returns,
  Web_ContainersView_ContainersView_Update_Rollback,
  Web_ContainersView_ContainersView_Updating,
  Web_ContainersView_ContainersView_UpdatingState,
  Web_ContainersView_LastResult_CheckedVerb,
  Web_ContainersView_LastResult_Container,
  Web_ContainersView_LastResult_Detail,
  Web_ContainersView_LastResult_DetailNote,
  Web_ContainersView_LastResult_Returns,
  Web_ContainersView_LastResult_Status,
  Web_ContainersView_Managed_Container,
  Web_ContainersView_Managed_Returns,
  Web_ContainersView_ManagedNote_Container,
  Web_ContainersView_ManagedNote_Returns,
  Web_ContainersView_UpdateConfirmationDialog_Container,
  Web_ContainersView_UpdateConfirmationDialog_Held,
  Web_ContainersView_UpdateConfirmationDialog_KeepNewContainer,
  Web_ContainersView_UpdateConfirmationDialog_KeepNewContainerState,
  Web_ContainersView_UpdateConfirmationDialog_Message,
  Web_ContainersView_UpdateConfirmationDialog_OnCancel,
  Web_ContainersView_UpdateConfirmationDialog_OnConfirm,
  Web_ContainersView_UpdateConfirmationDialog_Returns,
  Web_ContainersView_UpdateConfirmationDialog_SetKeepNewContainer,
} from '@/types/web/containers-view.d.ts';

// LastResult shows what the last check did with a container, or that none has looked at it yet.

/**
 * Containers View - Last Result.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @param {Web_Components_ContainerCell_Props} props - Props.
 *
 * @returns {Web_ContainersView_LastResult_Returns}
 *
 * @since 1.0.0
 */
const LastResult = (props: Web_Components_ContainerCell_Props): Web_ContainersView_LastResult_Returns => {
  const container: Web_ContainersView_LastResult_Container = props['container'];
  const status: Web_ContainersView_LastResult_Status = container['lastStatus'];
  const detail: Web_ContainersView_LastResult_Detail = container['lastSummary'] ?? container['lastDetail'];

  if (status === null || status === undefined) {
    return <span className="container-note">Not checked yet</span>;
  }

  const checkedVerb: Web_ContainersView_LastResult_CheckedVerb = (status === 'updated') ? 'Updated' : 'Checked';
  let detailNote: Web_ContainersView_LastResult_DetailNote = null;

  if (
    detail !== null
    && detail !== undefined
    && detail !== ''
  ) {
    detailNote = (
      <BreakableText breakAtNameSeparators className="container-note container-detail" text={detail} title={detail} />
    );
  }

  return (
    <>
      <span className="container-status">
        <span aria-hidden="true" className={statusClasses[status]} />
        {statusLabels[status]}
      </span>
      {detailNote}
      {(container['lastCheckedAt'] === null || container['lastCheckedAt'] === undefined) ? null : (
        <span className="container-note">{`${checkedVerb} ${formatRelative(container['lastCheckedAt'])}`}</span>
      )}
    </>
  );
};

// actionLabel names the operation a row can start from its latest status.

/**
 * Containers View - Action Label.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_ContainersView_ActionLabel_Container} container - Container.
 * @param {Web_ContainersView_ActionLabel_Checking}  checking  - Checking.
 * @param {Web_ContainersView_ActionLabel_Updating}  updating  - Updating.
 *
 * @returns {Web_ContainersView_ActionLabel_Returns}
 *
 * @since 1.1.0
 */
const actionLabel = (container: Web_ContainersView_ActionLabel_Container, checking: Web_ContainersView_ActionLabel_Checking, updating: Web_ContainersView_ActionLabel_Updating): Web_ContainersView_ActionLabel_Returns => {
  if (updating === true) {
    return 'Updating…';
  }

  if (checking === true) {
    return 'Checking…';
  }

  return (
    (
      container['lastStatus'] === 'available'
      || container['lastStatus'] === 'held'
    )
    && container['monitorOnly'] === false
  ) ? 'Update' : 'Check';
};

// Managed says whether Outpost updates a container, and why not when it doesn't.

/**
 * Containers View - Managed.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @param {Web_Components_ContainerCell_Props} props - Props.
 *
 * @returns {Web_ContainersView_Managed_Returns}
 *
 * @since 1.0.0
 */
const Managed = (props: Web_Components_ContainerCell_Props): Web_ContainersView_Managed_Returns => {
  const container: Web_ContainersView_Managed_Container = props['container'];

  if (container['managed'] === false) {
    return (
      <>
        <span>No</span>
        <span className="container-note">{container['note']}</span>
      </>
    );
  }

  return (
    <>
      <span>Yes</span>
      {(container['self'] === true) ? <span className="container-note">Outpost itself</span> : null}
      {(container['monitorOnly'] === true) ? <span className="container-note">Monitor only</span> : null}
    </>
  );
};

// managedNote sums up a managed container on small screens, where the Managed column is hidden.

/**
 * Containers View - Managed Note.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_ContainersView_ManagedNote_Container} container - Container.
 *
 * @returns {Web_ContainersView_ManagedNote_Returns}
 *
 * @since 1.0.0
 */
const managedNote = (container: Web_ContainersView_ManagedNote_Container): Web_ContainersView_ManagedNote_Returns => [
  'Managed',
  ...((container['self'] === true) ? ['Outpost itself'] : []),
  ...((container['monitorOnly'] === true) ? ['Monitor only'] : []),
].join('\u00a0·\u00a0');

/**
 * Containers View - Update Confirmation Dialog.
 *
 * Confirms every one-container update. Non-self containers can deliberately
 * keep a failed replacement, while Outpost itself always keeps rollback on.
 *
 * @param {Web_Components_UpdateConfirmationDialog_Props} props - Props.
 *
 * @returns {Web_ContainersView_UpdateConfirmationDialog_Returns}
 *
 * @since 1.1.0
 */
export const UpdateConfirmationDialog = (props: Web_Components_UpdateConfirmationDialog_Props): Web_ContainersView_UpdateConfirmationDialog_Returns => {
  const container: Web_ContainersView_UpdateConfirmationDialog_Container = props['container'];
  const onCancel: Web_ContainersView_UpdateConfirmationDialog_OnCancel = props['onCancel'];
  const onConfirm: Web_ContainersView_UpdateConfirmationDialog_OnConfirm = props['onConfirm'];
  const keepNewContainerState: Web_ContainersView_UpdateConfirmationDialog_KeepNewContainerState = useState<Web_ContainersView_UpdateConfirmationDialog_KeepNewContainer>(container['lastStatus'] === 'held' && container['self'] === false);
  const keepNewContainer: Web_ContainersView_UpdateConfirmationDialog_KeepNewContainer = keepNewContainerState[0];
  const setKeepNewContainer: Web_ContainersView_UpdateConfirmationDialog_SetKeepNewContainer = keepNewContainerState[1];
  const held: Web_ContainersView_UpdateConfirmationDialog_Held = container['lastStatus'] === 'held' && container['self'] === false;
  let message: Web_ContainersView_UpdateConfirmationDialog_Message = `Outpost will recreate ${container['name']} with the new image and normally roll back if its health check fails.`;

  if (container['self'] === true) {
    message = 'Outpost updates itself after every other selected container, then the dashboard reconnects on its own.';
  } else if (held === true) {
    message = `${container['name']} was rolled back from this image last time. Outpost is waiting for a newer image; proceeding now requires rollback to stay off so you can keep and inspect the rejected replacement.`;
  }

  return (
    <ConfirmDialog
      busy={false}
      busyLabel=""
      confirmLabel={(held === true) ? 'Update without rollback' : 'Update'}
      error=""
      message={message}
      onCancel={onCancel}
      onConfirm={() => onConfirm(keepNewContainer === false)}
      open
      title={(container['self'] === true) ? 'Update Outpost itself?' : `Update ${container['name']}?`}
      tone="primary"
    >
      {(container['self'] === true) ? null : (
        <label aria-label="Keep the new container even if it fails its health check (don't roll back)" className="check-row check-row-danger">
          <input checked={keepNewContainer} disabled={held} onChange={(event) => setKeepNewContainer(event.currentTarget.checked)} type="checkbox" />
          <span>
            <strong>{'Keep the new container even if it fails its health check (don\'t roll back)'}</strong>
            <small>The replacement may be stopped, unhealthy, or unable to serve traffic. Use the saved history detail to recover manually.</small>
          </span>
        </label>
      )}
    </ConfirmDialog>
  );
};

/**
 * Containers View - Containers View.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @param {Web_Components_ContainersView_Props} props - Props.
 *
 * @returns {Web_ContainersView_ContainersView_Returns}
 *
 * @since 1.0.0
 */
export const ContainersView = (props: Web_Components_ContainersView_Props): Web_ContainersView_ContainersView_Returns => {
  const containers: Web_ContainersView_ContainersView_Containers = props['containers'];
  const error: Web_ContainersView_ContainersView_Error = props['error'];
  const onRefresh: Web_ContainersView_ContainersView_OnRefresh = props['onRefresh'];
  const onStartCheck: Web_ContainersView_ContainersView_OnStartCheck = props['onStartCheck'];
  const onStartUpdate: Web_ContainersView_ContainersView_OnStartUpdate = props['onStartUpdate'];
  const overview: Web_ContainersView_ContainersView_Overview = props['overview'];
  const busyState: Web_ContainersView_ContainersView_BusyState = useState<Web_ContainersView_ContainersView_Busy>(false);
  const busy: Web_ContainersView_ContainersView_Busy = busyState[0];
  const setBusy: Web_ContainersView_ContainersView_SetBusy = busyState[1];
  const checkingState: Web_ContainersView_ContainersView_CheckingState = useState<Web_ContainersView_ContainersView_Checking>('');
  const checking: Web_ContainersView_ContainersView_Checking = checkingState[0];
  const setChecking: Web_ContainersView_ContainersView_SetChecking = checkingState[1];
  const updatingState: Web_ContainersView_ContainersView_UpdatingState = useState<Web_ContainersView_ContainersView_Updating>('');
  const updating: Web_ContainersView_ContainersView_Updating = updatingState[0];
  const setUpdating: Web_ContainersView_ContainersView_SetUpdating = updatingState[1];
  const actionErrorState: Web_ContainersView_ContainersView_ActionErrorState = useState<Web_ContainersView_ContainersView_ActionError>('');
  const actionError: Web_ContainersView_ContainersView_ActionError = actionErrorState[0];
  const setActionError: Web_ContainersView_ContainersView_SetActionError = actionErrorState[1];
  const confirmingUpdateState: Web_ContainersView_ContainersView_ConfirmingUpdateState = useState<Web_ContainersView_ContainersView_ConfirmingUpdate>(null);
  const confirmingUpdate: Web_ContainersView_ContainersView_ConfirmingUpdate = confirmingUpdateState[0];
  const setConfirmingUpdate: Web_ContainersView_ContainersView_SetConfirmingUpdate = confirmingUpdateState[1];
  const confirmingUpdateAllState: Web_ContainersView_ContainersView_ConfirmingUpdateAllState = useState<Web_ContainersView_ContainersView_ConfirmingUpdateAll>(false);
  const confirmingUpdateAll: Web_ContainersView_ContainersView_ConfirmingUpdateAll = confirmingUpdateAllState[0];
  const setConfirmingUpdateAll: Web_ContainersView_ContainersView_SetConfirmingUpdateAll = confirmingUpdateAllState[1];
  const running: Web_ContainersView_ContainersView_Running = overview !== null && overview['running'] === true;

  // A row says "Checking…" only until the check it started is done.
  useEffect(() => {
    if (running === false) {
      setChecking('');
      setUpdating('');
    }

    return;
  }, [running]);

  /**
   * Containers View - Check.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @param {Web_ContainersView_ContainersView_Check_Container} container - Container.
   *
   * @returns {Web_ContainersView_ContainersView_Check_Returns}
   *
   * @since 1.0.0
   */
  const check: Web_ContainersView_ContainersView_Check = async (container: Web_ContainersView_ContainersView_Check_Container): Web_ContainersView_ContainersView_Check_Returns => {
    setBusy(true);
    setActionError('');
    try {
      await onStartCheck(container['id']);
      setChecking(container['id']);
      showToast('Check started.', true);
    } catch (caughtError) {
      setActionError((caughtError instanceof Error) ? caughtError.message : 'The check could not be started.');
    } finally {
      setBusy(false);
    }

    return;
  };

  /**
   * Containers View - Update.
   *
   * Starts an apply cycle for one container, or for all managed containers.
   * The scheduler completion event refreshes each row with its new result.
   *
   * @param {Web_ContainersView_ContainersView_Update_Container} [container] - Container.
   * @param {Web_ContainersView_ContainersView_Update_Rollback}  [rollback]  - Rollback.
   *
   * @returns {Web_ContainersView_ContainersView_Update_Returns}
   *
   * @since 1.1.0
   */
  const update: Web_ContainersView_ContainersView_Update = async (container?: Web_ContainersView_ContainersView_Update_Container, rollback: Web_ContainersView_ContainersView_Update_Rollback = true): Web_ContainersView_ContainersView_Update_Returns => {
    setBusy(true);
    setActionError('');
    try {
      await onStartUpdate((container === undefined) ? undefined : container['id'], rollback);
      setUpdating((container === undefined) ? '*' : container['id']);
      showToast((container === undefined) ? 'Update started.' : `${container['name']} update started.`, true);
    } catch (caughtError) {
      setActionError((caughtError instanceof Error) ? caughtError.message : 'The update could not be started.');
    } finally {
      setBusy(false);
    }

    return;
  };

  /**
   * Containers View - Refresh.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @returns {Web_ContainersView_ContainersView_Refresh_Returns}
   *
   * @since 1.0.0
   */
  const refresh: Web_ContainersView_ContainersView_Refresh = async (): Web_ContainersView_ContainersView_Refresh_Returns => {
    setBusy(true);
    try {
      await onRefresh();
    } finally {
      setBusy(false);
    }

    return;
  };

  const availableCount: Web_ContainersView_ContainersView_AvailableCount = (containers === null) ? 0 : containers.filter((container) => {
    return (
      container['managed'] === true
      && container['monitorOnly'] === false
      && container['lastStatus'] === 'available'
    );
  }).length;

  let content: Web_ContainersView_ContainersView_Content = null;

  if (
    containers === null
    && error instanceof ApiError
    && error.code === 'docker_unreachable'
  ) {
    content = (
      <div className="empty-state">
        <span><Icon name="warning" size={22} /></span>
        <h2>{'Can\'t reach Docker'}</h2>
        <p>{error.message}</p>
      </div>
    );
  } else if (containers === null) {
    content = (
      <div className="detail-loading">
        {(error === null) ? (
          <>
            <span className="spinner" />
            Loading the containers…
          </>
        ) : summaryFor(error, [], 'The containers could not be loaded.')}
      </div>
    );
  } else if (containers.length === 0) {
    content = (
      <div className="empty-state">
        <span><Icon name="containers" size={22} /></span>
        <h2>No running containers</h2>
        <p>Containers show up here once Docker is running them.</p>
      </div>
    );
  } else {
    content = (
      <table className="container-table">
        <thead>
          <tr>
            <th scope="col">Container</th>
            <th className="column-wide cell-image" scope="col">Image</th>
            <th className="column-wide cell-result" scope="col">Last result</th>
            <th className="column-wide cell-managed" scope="col">Managed</th>
            <th className="cell-actions" scope="col"><span className="visually-hidden">Actions</span></th>
          </tr>
        </thead>
        <tbody>
          {containers.map((container) => (
            <tr key={container['id']}>
              <td className="cell-container">
                <BreakableText breakAtNameSeparators className="container-name" text={container['name']} />
                <BreakableText className="container-note mono container-id" text={container['id']} title={container['fullId']} />
                <ImageName className="container-note container-inline-image" image={container['image']} />
                <span className="container-inline">
                  <LastResult container={container} />
                  {(container['managed'] === true) ? (
                    <span className="container-note">{managedNote(container)}</span>
                  ) : (
                    <span className="container-note">{`Not managed\u00a0·\u00a0${container['note']}`}</span>
                  )}
                </span>
              </td>
              <td className="column-wide cell-image">
                <ImageName image={container['image']} />
              </td>
              <td className="column-wide cell-result">
                <LastResult container={container} />
              </td>
              <td className="column-wide cell-managed">
                <Managed container={container} />
              </td>
              <td className="cell-actions">
                {(container['managed'] === true) ? (
                  <Button
                    disabled={busy || running}
                    onClick={() => {
                      if (
                        (
                          container['lastStatus'] === 'available'
                          || container['lastStatus'] === 'held'
                        )
                        && container['monitorOnly'] === false
                      ) {
                        setConfirmingUpdate(container);

                        return;
                      }

                      void check(container);

                      return;
                    }}
                  >
                    {actionLabel(container, running && checking === container['id'], running && updating === container['id'])}
                  </Button>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  return (
    <section className="workspace-section">
      <div className="workspace-heading workspace-heading-split">
        <div>
          <h1>Containers</h1>
          <p>Running containers and what Outpost last did with each one.</p>
        </div>
        <div className="panel-actions">
          {(availableCount === 0) ? null : (
            <Button
              disabled={busy || running}
              onClick={() => setConfirmingUpdateAll(true)}
            >
              {`Update all (${availableCount})`}
            </Button>
          )}
          <Button
            disabled={busy}
            icon="refresh"
            onClick={() => {
              void refresh();

              return;
            }}
          >
            Refresh
          </Button>
        </div>
      </div>

      {(actionError === '') ? null : (
        <div className="form-error" role="alert">
          <Icon name="warning" size={16} />
          <span>{actionError}</span>
        </div>
      )}

      {(containers !== null && error !== null) ? (
        <div className="form-error" role="alert">
          <Icon name="warning" size={16} />
          <span>{summaryFor(error, [], 'The containers could not be loaded.')}</span>
        </div>
      ) : null}

      <div className="table-card">{content}</div>

      {(confirmingUpdate === null) ? null : (
        <UpdateConfirmationDialog
          container={confirmingUpdate}
          onCancel={() => setConfirmingUpdate(null)}
          onConfirm={(rollback) => {
            const confirmedContainer: Web_ContainersView_ContainersView_ConfirmedContainer = confirmingUpdate;

            setConfirmingUpdate(null);

            void update(confirmedContainer, rollback);

            return;
          }}
        />
      )}

      <ConfirmDialog
        busy={false}
        busyLabel=""
        confirmLabel="Update all"
        error=""
        message="Outpost checks every managed container, applies newer images, and updates itself last if needed. Monitor-only containers stay unchanged."
        onCancel={() => setConfirmingUpdateAll(false)}
        onConfirm={() => {
          setConfirmingUpdateAll(false);

          void update();

          return;
        }}
        open={confirmingUpdateAll}
        title="Update all available containers?"
        tone="primary"
      />
    </section>
  );
};

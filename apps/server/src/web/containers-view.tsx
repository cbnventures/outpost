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

import type { ReactElement } from 'react';

import type { Web_Api_Container } from '@/types/web/api.d.ts';
import type {
  Web_Components_ContainerCell_Props,
  Web_Components_ContainersView_Props,
  Web_Components_UpdateConfirmationDialog_Props,
} from '@/types/web/components.d.ts';

// LastResult shows what the last check did with a container, or that none has looked at it yet.

/**
 * Containers View - Last result.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
const LastResult = ({
  container,
}: Web_Components_ContainerCell_Props): ReactElement => {
  const status: Web_Api_Container['lastStatus'] = container['lastStatus'];
  const detail: Web_Api_Container['lastDetail'] = container['lastSummary'] ?? container['lastDetail'];

  if (status === null || status === undefined) {
    return <span className="container-note">Not checked yet</span>;
  }

  return (
    <>
      <span className="container-status">
        <span aria-hidden="true" className={statusClasses[status]} />
        {statusLabels[status]}
      </span>
      {(detail === null || detail === undefined || detail === '') ? null : (
        <BreakableText breakAtNameSeparators className="container-note container-detail" text={detail} title={detail} />
      )}
      {(container['lastCheckedAt'] === null || container['lastCheckedAt'] === undefined) ? null : (
        <span className="container-note">{`${(status === 'updated') ? 'Updated' : 'Checked'} ${formatRelative(container['lastCheckedAt'])}`}</span>
      )}
    </>
  );
};

// actionLabel names the operation a row can start from its latest status.

/**
 * Containers View - Action label.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 1.1.0
 */
const actionLabel = (container: Web_Api_Container, checking: boolean, updating: boolean): string => {
  if (updating) {
    return 'Updating…';
  }

  if (checking) {
    return 'Checking…';
  }

  return ((container['lastStatus'] === 'available' || container['lastStatus'] === 'held') && !container['monitorOnly']) ? 'Update' : 'Check';
};

// Managed says whether Outpost updates a container, and why not when it doesn't.

/**
 * Containers View - Managed.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
const Managed = ({
  container,
}: Web_Components_ContainerCell_Props): ReactElement => {
  if (!container['managed']) {
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
      {(container['self']) ? <span className="container-note">Outpost itself</span> : null}
      {(container['monitorOnly']) ? <span className="container-note">Monitor only</span> : null}
    </>
  );
};

// managedNote sums up a managed container on small screens, where the Managed column is hidden.

/**
 * Containers View - Managed note.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 1.0.0
 */
const managedNote = (container: Web_Api_Container): string => [
  'Managed',
  ...((container['self']) ? ['Outpost itself'] : []),
  ...((container['monitorOnly']) ? ['Monitor only'] : []),
].join('\u00a0·\u00a0');

/**
 * Containers View - Update Confirmation Dialog.
 *
 * Confirms every one-container update. Non-self containers can deliberately
 * keep a failed replacement, while Outpost itself always keeps rollback on.
 *
 * @since 1.1.0
 */
export const UpdateConfirmationDialog = ({
  container,
  onCancel,
  onConfirm,
}: Web_Components_UpdateConfirmationDialog_Props): ReactElement => {
  const [
    keepNewContainer,
    setKeepNewContainer,
  ] = useState<boolean>(container['lastStatus'] === 'held' && !container['self']);
  const held: boolean = container['lastStatus'] === 'held' && !container['self'];
  let message: string = `Outpost will recreate ${container['name']} with the new image and normally roll back if its health check fails.`;

  if (container['self']) {
    message = 'Outpost updates itself after every other selected container, then the dashboard reconnects on its own.';
  } else if (held) {
    message = `${container['name']} was rolled back from this image last time. Outpost is waiting for a newer image; proceeding now requires rollback to stay off so you can keep and inspect the rejected replacement.`;
  }

  return (
    <ConfirmDialog
      busy={false}
      busyLabel=""
      confirmLabel={(held) ? 'Update without rollback' : 'Update'}
      error=""
      message={message}
      onCancel={onCancel}
      onConfirm={(): void => onConfirm(!keepNewContainer)}
      open
      title={(container['self']) ? 'Update Outpost itself?' : `Update ${container['name']}?`}
      tone="primary"
    >
      {(container['self']) ? null : (
        <label aria-label="Keep the new container even if it fails its health check (don't roll back)" className="check-row check-row-danger">
          <input checked={keepNewContainer} disabled={held} onChange={(event): void => setKeepNewContainer(event.currentTarget.checked)} type="checkbox" />
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
 * Containers View.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
export const ContainersView = ({
  containers,
  error,
  onRefresh,
  onStartCheck,
  onStartUpdate,
  overview,
}: Web_Components_ContainersView_Props): ReactElement => {
  const [
    busy,
    setBusy,
  ] = useState<boolean>(false);
  const [
    checking,
    setChecking,
  ] = useState<string>('');
  const [
    updating,
    setUpdating,
  ] = useState<string>('');
  const [
    actionError,
    setActionError,
  ] = useState<string>('');
  const [
    confirmingUpdate,
    setConfirmingUpdate,
  ] = useState<Web_Api_Container | null>(null);
  const [
    confirmingUpdateAll,
    setConfirmingUpdateAll,
  ] = useState<boolean>(false);
  const running: boolean = overview !== null && overview['running'];

  // A row says "Checking…" only until the check it started is done.
  useEffect((): void => {
    if (!running) {
      setChecking('');
      setUpdating('');
    }
  }, [running]);

  /**
   * Containers View - Check.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @since 1.0.0
   */
  const check = async (container: Web_Api_Container): Promise<void> => {
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
  };

  /**
   * Containers View - Update.
   *
   * Starts an apply cycle for one container, or for all managed containers.
   * The scheduler completion event refreshes each row with its new result.
   *
   * @since 1.1.0
   */
  const update = async (container?: Web_Api_Container, rollback: boolean = true): Promise<void> => {
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
  };

  /**
   * Containers View - Refresh.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @since 1.0.0
   */
  const refresh = async (): Promise<void> => {
    setBusy(true);
    try {
      await onRefresh();
    } finally {
      setBusy(false);
    }
  };

  const availableCount: number = (containers === null) ? 0 : containers.filter((container: Web_Api_Container): boolean => container['managed'] && !container['monitorOnly'] && container['lastStatus'] === 'available').length;

  let content: ReactElement | null = null;

  if (containers === null && error instanceof ApiError && error.code === 'docker_unreachable') {
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
          {containers.map((container: Web_Api_Container): ReactElement => (
            <tr key={container['id']}>
              <td className="cell-container">
                <BreakableText breakAtNameSeparators className="container-name" text={container['name']} />
                <BreakableText className="container-note mono container-id" text={container['id']} title={container['fullId']} />
                <ImageName className="container-note container-inline-image" image={container['image']} />
                <span className="container-inline">
                  <LastResult container={container} />
                  {(container['managed']) ? (
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
                {(container['managed']) ? (
                  <Button
                    disabled={busy || running}
                    onClick={(): void => {
                      if ((container['lastStatus'] === 'available' || container['lastStatus'] === 'held') && !container['monitorOnly']) {
                        setConfirmingUpdate(container);

                        return;
                      }

                      void check(container);
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
              onClick={(): void => setConfirmingUpdateAll(true)}
            >
              {`Update all (${availableCount})`}
            </Button>
          )}
          <Button
            disabled={busy}
            icon="refresh"
            onClick={(): void => {
              void refresh();
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
          onCancel={(): void => setConfirmingUpdate(null)}
          onConfirm={(rollback): void => {
            const container: Web_Api_Container = confirmingUpdate;

            setConfirmingUpdate(null);

            void update(container, rollback);
          }}
        />
      )}

      <ConfirmDialog
        busy={false}
        busyLabel=""
        confirmLabel="Update all"
        error=""
        message="Outpost checks every managed container, applies newer images, and updates itself last if needed. Monitor-only containers stay unchanged."
        onCancel={(): void => setConfirmingUpdateAll(false)}
        onConfirm={(): void => {
          setConfirmingUpdateAll(false);

          void update();
        }}
        open={confirmingUpdateAll}
        title="Update all available containers?"
        tone="primary"
      />
    </section>
  );
};

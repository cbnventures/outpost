import {
  useEffect,
  useState,
} from 'react';

import {
  ApiError,
  summaryFor,
} from '@/web/api.ts';
import { ConfirmDialog } from '@/web/confirm-dialog.tsx';
import {
  formatRelative,
  shortDigests,
} from '@/web/format.ts';
import { ImageName } from '@/web/image-name.tsx';
import {
  statusClasses,
  statusLabels,
} from '@/web/labels.ts';
import {
  Button,
  Icon,
} from '@/web/primitives.tsx';

import type { ReactElement } from 'react';

import type { Web_Api_Container } from '@/types/web/api.d.ts';
import type {
  Web_Components_ContainerCell_Props,
  Web_Components_ContainersView_Props,
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

  if (status === null || status === undefined) {
    return <span className="container-note">Not checked yet</span>;
  }

  return (
    <>
      <span className="container-status">
        <span aria-hidden="true" className={statusClasses[status]} />
        {statusLabels[status]}
      </span>
      {(container['lastDetail'] === null || container['lastDetail'] === undefined || container['lastDetail'] === '') ? null : (
        <span className="container-note" title={container['lastDetail']}>{shortDigests(container['lastDetail'])}</span>
      )}
      {(container['lastCheckedAt'] === null || container['lastCheckedAt'] === undefined) ? null : (
        <span className="container-note">{`Checked ${formatRelative(container['lastCheckedAt'])}`}</span>
      )}
    </>
  );
};

// checkLabel names a row's button: monitor-only containers are only checked.

/**
 * Containers View - Checks label.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 1.0.0
 */
const checkLabel = (container: Web_Api_Container, checking: boolean): string => {
  if (checking) {
    return 'Checking…';
  }

  return (container['monitorOnly']) ? 'Check' : 'Check & update';
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
].join(' · ');

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
    actionError,
    setActionError,
  ] = useState<string>('');
  const [
    confirmingSelf,
    setConfirmingSelf,
  ] = useState<Web_Api_Container | null>(null);
  const running: boolean = overview !== null && overview['running'];

  // A row says "Checking…" only until the check it started is done.
  useEffect((): void => {
    if (!running) {
      setChecking('');
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
    } catch (caughtError) {
      setActionError((caughtError instanceof Error) ? caughtError.message : 'The check could not be started.');
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
                <span className="container-name">{container['name']}</span>
                <span className="container-note mono container-id">{container['id']}</span>
                <ImageName className="container-note container-inline-image" image={container['image']} />
                <span className="container-inline">
                  <LastResult container={container} />
                  {(container['managed']) ? (
                    <span className="container-note">{managedNote(container)}</span>
                  ) : (
                    <span className="container-note">{`Not managed · ${container['note']}`}</span>
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
                      // Updating Outpost restarts it, so its own row asks first.
                      if (container['self'] && !container['monitorOnly']) {
                        setConfirmingSelf(container);

                        return;
                      }

                      void check(container);
                    }}
                  >
                    {checkLabel(container, running && checking === container['id'])}
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

      <ConfirmDialog
        busy={false}
        busyLabel=""
        confirmLabel="Check and update"
        error=""
        message={'If there\'s a newer Outpost image, Outpost restarts on it. The dashboard reconnects on its own, and the check shows in History once it\'s done.'}
        onCancel={(): void => setConfirmingSelf(null)}
        onConfirm={(): void => {
          if (confirmingSelf !== null) {
            setConfirmingSelf(null);

            void check(confirmingSelf);
          }
        }}
        open={confirmingSelf !== null}
        title="Update Outpost itself?"
        tone="primary"
      />
    </section>
  );
};

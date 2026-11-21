import {
  useEffect,
  useState,
} from 'react';

import { summaryFor } from '@/web/api.ts';
import { ConfirmDialog } from '@/web/confirm-dialog.tsx';
import {
  formatDate,
  formatDuration,
  formatRelative,
} from '@/web/format.ts';
import { ResultList } from '@/web/history-view.tsx';
import {
  checkDuration,
  cycleActionLabel,
  cycleActionRunningLabel,
  failedCount,
  modeSummary,
  triggerLabel,
} from '@/web/labels.ts';
import {
  Button,
  Icon,
} from '@/web/primitives.tsx';
import { describeSchedule } from '@/web/schedule.ts';
import { showToast } from '@/web/toast.ts';

import type { Web_Components_OverviewView_Props } from '@/types/web/components.d.ts';
import type {
  Web_OverviewView_CountOf_Report,
  Web_OverviewView_CountOf_Returns,
  Web_OverviewView_CountOf_Status,
  Web_OverviewView_OverviewView_ActionError,
  Web_OverviewView_OverviewView_ActionErrorState,
  Web_OverviewView_OverviewView_Available,
  Web_OverviewView_OverviewView_AvailableCount,
  Web_OverviewView_OverviewView_Busy,
  Web_OverviewView_OverviewView_BusyState,
  Web_OverviewView_OverviewView_CheckNow,
  Web_OverviewView_OverviewView_CheckNow_Returns,
  Web_OverviewView_OverviewView_ConfirmingUpdateAll,
  Web_OverviewView_OverviewView_ConfirmingUpdateAllState,
  Web_OverviewView_OverviewView_Containers,
  Web_OverviewView_OverviewView_Error,
  Web_OverviewView_OverviewView_Failed,
  Web_OverviewView_OverviewView_LastActionLabel,
  Web_OverviewView_OverviewView_LastErrorNotice,
  Web_OverviewView_OverviewView_LastReport,
  Web_OverviewView_OverviewView_ManagedCount,
  Web_OverviewView_OverviewView_Now,
  Web_OverviewView_OverviewView_NowState,
  Web_OverviewView_OverviewView_OnOpenContainers,
  Web_OverviewView_OverviewView_OnOpenHistory,
  Web_OverviewView_OverviewView_OnStartCheck,
  Web_OverviewView_OverviewView_OnStartUpdate,
  Web_OverviewView_OverviewView_Overview,
  Web_OverviewView_OverviewView_Returns,
  Web_OverviewView_OverviewView_Running,
  Web_OverviewView_OverviewView_RunningActionLabel,
  Web_OverviewView_OverviewView_ScheduledActionLabel,
  Web_OverviewView_OverviewView_SetActionError,
  Web_OverviewView_OverviewView_SetBusy,
  Web_OverviewView_OverviewView_SetConfirmingUpdateAll,
  Web_OverviewView_OverviewView_SetNow,
  Web_OverviewView_OverviewView_StartedBy,
  Web_OverviewView_OverviewView_Timer,
  Web_OverviewView_OverviewView_UpdateAll,
  Web_OverviewView_OverviewView_UpdateAll_Returns,
} from '@/types/web/overview-view.d.ts';

// countOf counts one status in a check's results.

/**
 * Overview View - Count Of.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_OverviewView_CountOf_Report} report - Report.
 * @param {Web_OverviewView_CountOf_Status} status - Status.
 *
 * @returns {Web_OverviewView_CountOf_Returns}
 *
 * @since 1.0.0
 */
const countOf = (report: Web_OverviewView_CountOf_Report, status: Web_OverviewView_CountOf_Status): Web_OverviewView_CountOf_Returns => report['results'].filter(
  (result) => result['status'] === status,
).length;

/**
 * Overview View - Overview View.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @param {Web_Components_OverviewView_Props} props - Props.
 *
 * @returns {Web_OverviewView_OverviewView_Returns}
 *
 * @since 1.0.0
 */
export const OverviewView = (props: Web_Components_OverviewView_Props): Web_OverviewView_OverviewView_Returns => {
  const containers: Web_OverviewView_OverviewView_Containers = props['containers'];
  const error: Web_OverviewView_OverviewView_Error = props['error'];
  const onOpenContainers: Web_OverviewView_OverviewView_OnOpenContainers = props['onOpenContainers'];
  const onOpenHistory: Web_OverviewView_OverviewView_OnOpenHistory = props['onOpenHistory'];
  const onStartCheck: Web_OverviewView_OverviewView_OnStartCheck = props['onStartCheck'];
  const onStartUpdate: Web_OverviewView_OverviewView_OnStartUpdate = props['onStartUpdate'];
  const overview: Web_OverviewView_OverviewView_Overview = props['overview'];
  const busyState: Web_OverviewView_OverviewView_BusyState = useState<Web_OverviewView_OverviewView_Busy>(false);
  const busy: Web_OverviewView_OverviewView_Busy = busyState[0];
  const setBusy: Web_OverviewView_OverviewView_SetBusy = busyState[1];
  const actionErrorState: Web_OverviewView_OverviewView_ActionErrorState = useState<Web_OverviewView_OverviewView_ActionError>('');
  const actionError: Web_OverviewView_OverviewView_ActionError = actionErrorState[0];
  const setActionError: Web_OverviewView_OverviewView_SetActionError = actionErrorState[1];
  const confirmingUpdateAllState: Web_OverviewView_OverviewView_ConfirmingUpdateAllState = useState<Web_OverviewView_OverviewView_ConfirmingUpdateAll>(false);
  const confirmingUpdateAll: Web_OverviewView_OverviewView_ConfirmingUpdateAll = confirmingUpdateAllState[0];
  const setConfirmingUpdateAll: Web_OverviewView_OverviewView_SetConfirmingUpdateAll = confirmingUpdateAllState[1];
  const nowState: Web_OverviewView_OverviewView_NowState = useState<Web_OverviewView_OverviewView_Now>(Date.now());
  const now: Web_OverviewView_OverviewView_Now = nowState[0];
  const setNow: Web_OverviewView_OverviewView_SetNow = nowState[1];
  const running: Web_OverviewView_OverviewView_Running = overview !== null && overview['running'] === true;

  // While a check runs, "started … ago" keeps counting.
  useEffect(() => {
    if (running === false) {
      return undefined;
    }

    setNow(Date.now());

    const timer: Web_OverviewView_OverviewView_Timer = window.setInterval(() => setNow(Date.now()), 15_000);

    return () => window.clearInterval(timer);
  }, [running]);

  /**
   * Overview View - Check Now.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @returns {Web_OverviewView_OverviewView_CheckNow_Returns}
   *
   * @since 1.1.0
   */
  const checkNow: Web_OverviewView_OverviewView_CheckNow = async (): Web_OverviewView_OverviewView_CheckNow_Returns => {
    setBusy(true);
    setActionError('');
    try {
      await onStartCheck();
      showToast('Check started.', true);
    } catch (caughtError) {
      setActionError((caughtError instanceof Error) ? caughtError.message : 'The check could not be started.');
    } finally {
      setBusy(false);
    }

    return;
  };

  /**
   * Overview View - Update All.
   *
   * Starts the apply cycle after the confirmation dialog closes.
   * The shared scheduler state disables both actions while it runs.
   *
   * @returns {Web_OverviewView_OverviewView_UpdateAll_Returns}
   *
   * @since 1.1.0
   */
  const updateAll: Web_OverviewView_OverviewView_UpdateAll = async (): Web_OverviewView_OverviewView_UpdateAll_Returns => {
    setBusy(true);
    setActionError('');
    try {
      await onStartUpdate();
      showToast('Update started.', true);
    } catch (caughtError) {
      setActionError((caughtError instanceof Error) ? caughtError.message : 'The update could not be started.');
    } finally {
      setBusy(false);
    }

    return;
  };

  if (overview === null) {
    return (
      <div className="detail-loading">
        {(error === null) ? (
          <>
            <span className="spinner" />
            Loading the overview…
          </>
        ) : summaryFor(error, [], 'The overview could not be loaded.')}
      </div>
    );
  }

  const lastReport: Web_OverviewView_OverviewView_LastReport = overview['lastReport'] ?? null;
  const managedCount: Web_OverviewView_OverviewView_ManagedCount = (containers === null) ? 0 : containers.filter((container) => container['managed']).length;
  const availableCount: Web_OverviewView_OverviewView_AvailableCount = (containers === null) ? 0 : containers.filter((container) => {
    return (
      container['managed'] === true
      && container['monitorOnly'] === false
      && container['lastStatus'] === 'available'
    );
  }).length;
  const failed: Web_OverviewView_OverviewView_Failed = (lastReport === null) ? 0 : failedCount(lastReport['results']);
  const available: Web_OverviewView_OverviewView_Available = (lastReport === null) ? 0 : countOf(lastReport, 'available');
  const startedBy: Web_OverviewView_OverviewView_StartedBy = (lastReport === null) ? '' : triggerLabel(lastReport['trigger']);
  const runningActionLabel: Web_OverviewView_OverviewView_RunningActionLabel = cycleActionRunningLabel(overview['action']);
  const lastActionLabel: Web_OverviewView_OverviewView_LastActionLabel = cycleActionLabel((lastReport === null) ? undefined : lastReport['action']).toLowerCase();
  const scheduledActionLabel: Web_OverviewView_OverviewView_ScheduledActionLabel = (overview['monitorOnly'] === true) ? 'check' : 'update';
  let lastErrorNotice: Web_OverviewView_OverviewView_LastErrorNotice = null;

  if (
    overview['lastError'] !== null
    && overview['lastError'] !== undefined
    && overview['lastError'] !== ''
  ) {
    lastErrorNotice = (
      <div className="form-error" role="alert">
        <Icon name="warning" size={16} />
        <span>{`The last ${lastActionLabel} failed: ${overview['lastError']}`}</span>
      </div>
    );
  }

  return (
    <section className="workspace-section">
      <div className="workspace-heading workspace-heading-split">
        <div>
          <h1>Overview</h1>
          <p>{modeSummary(overview)}</p>
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
            disabled={busy || running}
            icon="refresh"
            onClick={() => {
              void checkNow();

              return;
            }}
            variant="primary"
          >
            {(running === true) ? `${runningActionLabel}…` : 'Check now'}
          </Button>
        </div>
      </div>

      {(actionError === '') ? null : (
        <div className="form-error" role="alert">
          <Icon name="warning" size={16} />
          <span>{actionError}</span>
        </div>
      )}

      {lastErrorNotice}

      <div className="panel">
        <section className="form-section">
          <div className="form-section-head">
            <h2>Scheduler</h2>
            <button className="text-button" onClick={onOpenContainers} type="button">View containers</button>
          </div>
          <dl className="details">
            <div>
              <dt>Status</dt>
              <dd className={(running === true) ? 'details-status-connecting' : 'details-status-protected'}>
                <span className="status-dot" />
                {(running === true) ? runningActionLabel : 'Idle'}
              </dd>
            </div>
            {(running === true) ? (
              <div>
                <dt>Started</dt>
                <dd>{formatRelative(overview['startedAt'], now)}</dd>
              </div>
            ) : (
              <div>
                <dt>{`Next ${scheduledActionLabel}`}</dt>
                <dd>{(overview['nextRun'] === null || overview['nextRun'] === undefined) ? 'Not scheduled' : formatDate(overview['nextRun'])}</dd>
              </div>
            )}
            <div>
              <dt>Schedule</dt>
              <dd className="details-schedule">
                <span>{describeSchedule(overview['schedule'], overview['timeZone'])}</span>
                <code>{overview['schedule']}</code>
              </dd>
            </div>
            <div>
              <dt>Mode</dt>
              <dd>{(overview['labelMode'] === 'opt-in') ? 'Opt-in' : 'Opt-out'}</dd>
            </div>
            <div>
              <dt>Monitor only</dt>
              <dd>{(overview['monitorOnly'] === true) ? 'On' : 'Off'}</dd>
            </div>
            <div>
              <dt>Managed containers</dt>
              <dd>{(containers === null) ? '—' : `${managedCount} of ${containers.length}`}</dd>
            </div>
          </dl>
        </section>

        <section className="form-section">
          <div className="form-section-head">
            <h2>Last run</h2>
            <button className="text-button" onClick={onOpenHistory} type="button">View history</button>
          </div>
          {(lastReport === null) ? (
            <p className="select-list select-list-empty">No checks or updates have run yet. Use &quot;Check now&quot; to run a check.</p>
          ) : (
            <>
              <dl className="details">
                <div>
                  <dt>Finished</dt>
                  <dd>{formatDate(lastReport['finishedAt'])}</dd>
                </div>
                <div>
                  <dt>Action</dt>
                  <dd>{cycleActionLabel(lastReport['action'])}</dd>
                </div>
                <div>
                  <dt>Took</dt>
                  <dd>{formatDuration(checkDuration(lastReport))}</dd>
                </div>
                {(startedBy === '') ? null : (
                  <div>
                    <dt>Started by</dt>
                    <dd>{startedBy}</dd>
                  </div>
                )}
                <div>
                  <dt>Updated</dt>
                  <dd>{countOf(lastReport, 'updated')}</dd>
                </div>
                <div>
                  <dt>Up to date</dt>
                  <dd>{countOf(lastReport, 'up-to-date')}</dd>
                </div>
                <div>
                  <dt>Failed</dt>
                  <dd className={(failed > 0) ? 'details-status-blocked' : undefined}>
                    {(failed > 0) ? <span className="status-dot" /> : null}
                    {failed}
                  </dd>
                </div>
                {(available === 0) ? null : (
                  <div>
                    <dt>Updates available</dt>
                    <dd>{available}</dd>
                  </div>
                )}
              </dl>
              <ResultList compact results={lastReport['results']} />
            </>
          )}
        </section>
      </div>

      <ConfirmDialog
        busy={false}
        busyLabel=""
        confirmLabel="Update all"
        error=""
        message="Outpost checks every managed container, applies newer images, and updates itself last if needed. Monitor-only containers stay unchanged."
        onCancel={() => setConfirmingUpdateAll(false)}
        onConfirm={() => {
          setConfirmingUpdateAll(false);

          void updateAll();

          return;
        }}
        open={confirmingUpdateAll}
        title="Update all available containers?"
        tone="primary"
      />
    </section>
  );
};

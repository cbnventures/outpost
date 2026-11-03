import {
  useEffect,
  useState,
} from 'react';

import { summaryFor } from '@/web/api.ts';
import {
  formatDate,
  formatDuration,
  formatRelative,
} from '@/web/format.ts';
import { ResultList } from '@/web/history-view.tsx';
import {
  checkDuration,
  failedCount,
  modeSummary,
  triggerLabel,
} from '@/web/labels.ts';
import {
  Button,
  Icon,
} from '@/web/primitives.tsx';
import { describeSchedule } from '@/web/schedule.ts';

import type { ReactElement } from 'react';

import type {
  Web_Api_Container,
  Web_Api_Report,
  Web_Api_Result,
  Web_Api_ResultStatus,
} from '@/types/web/api.d.ts';
import type { Web_Components_OverviewView_Props } from '@/types/web/components.d.ts';

// countOf counts one status in a check's results.

/**
 * Overview View - Count of.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 1.0.0
 */
const countOf = (report: Web_Api_Report, status: Web_Api_ResultStatus): number => report['results'].filter(
  (result: Web_Api_Result): boolean => result['status'] === status,
).length;

/**
 * Overview View.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
export const OverviewView = ({
  containers,
  error,
  onOpenContainers,
  onOpenHistory,
  onStartCheck,
  overview,
}: Web_Components_OverviewView_Props): ReactElement => {
  const [
    busy,
    setBusy,
  ] = useState<boolean>(false);
  const [
    actionError,
    setActionError,
  ] = useState<string>('');
  const [
    now,
    setNow,
  ] = useState<number>(Date.now());
  const running: boolean = overview !== null && overview['running'];

  // While a check runs, "started … ago" keeps counting.
  useEffect((): (() => void) | undefined => {
    if (!running) {
      return undefined;
    }

    setNow(Date.now());

    const timer: number = window.setInterval((): void => setNow(Date.now()), 15_000);

    return (): void => window.clearInterval(timer);
  }, [running]);

  /**
   * Overview View - Checks now.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @since 1.0.0
   */
  const checkNow = async (): Promise<void> => {
    setBusy(true);
    setActionError('');
    try {
      await onStartCheck();
    } catch (caughtError) {
      setActionError((caughtError instanceof Error) ? caughtError.message : 'The check could not be started.');
    } finally {
      setBusy(false);
    }
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

  const lastReport: Web_Api_Report | null = overview['lastReport'] ?? null;
  const managedCount: number = (containers === null) ? 0 : containers.filter((container: Web_Api_Container): boolean => container['managed']).length;
  const failed: number = (lastReport === null) ? 0 : failedCount(lastReport['results']);
  const available: number = (lastReport === null) ? 0 : countOf(lastReport, 'available');
  const startedBy: string = (lastReport === null) ? '' : triggerLabel(lastReport['trigger']);

  return (
    <section className="workspace-section">
      <div className="workspace-heading workspace-heading-split">
        <div>
          <h1>Overview</h1>
          <p>{modeSummary(overview)}</p>
        </div>
        <Button
          disabled={busy || running}
          icon="refresh"
          onClick={(): void => {
            void checkNow();
          }}
          variant="primary"
        >
          {(running) ? 'Checking…' : 'Check now'}
        </Button>
      </div>

      {(actionError === '') ? null : (
        <div className="form-error" role="alert">
          <Icon name="warning" size={16} />
          <span>{actionError}</span>
        </div>
      )}

      {(overview['lastError'] === null || overview['lastError'] === undefined || overview['lastError'] === '') ? null : (
        <div className="form-error" role="alert">
          <Icon name="warning" size={16} />
          <span>{`The last check failed: ${overview['lastError']}`}</span>
        </div>
      )}

      <div className="panel">
        <section className="form-section">
          <div className="form-section-head">
            <h2>Scheduler</h2>
            <button className="text-button" onClick={onOpenContainers} type="button">View containers</button>
          </div>
          <dl className="details">
            <div>
              <dt>Status</dt>
              <dd className={(running) ? 'details-status-connecting' : 'details-status-protected'}>
                <span className="status-dot" />
                {(running) ? 'Checking' : 'Idle'}
              </dd>
            </div>
            {(running) ? (
              <div>
                <dt>Started</dt>
                <dd>{formatRelative(overview['startedAt'], now)}</dd>
              </div>
            ) : (
              <div>
                <dt>Next check</dt>
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
              <dd>{(overview['monitorOnly']) ? 'On' : 'Off'}</dd>
            </div>
            <div>
              <dt>Managed containers</dt>
              <dd>{(containers === null) ? '—' : `${managedCount} of ${containers.length}`}</dd>
            </div>
          </dl>
        </section>

        <section className="form-section">
          <div className="form-section-head">
            <h2>Last check</h2>
            <button className="text-button" onClick={onOpenHistory} type="button">View history</button>
          </div>
          {(lastReport === null) ? (
            <p className="select-list select-list-empty">No checks have run yet. Use &quot;Check now&quot; to run one.</p>
          ) : (
            <>
              <dl className="details">
                <div>
                  <dt>Finished</dt>
                  <dd>{formatDate(lastReport['finishedAt'])}</dd>
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
    </section>
  );
};

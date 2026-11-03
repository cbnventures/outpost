import { useState } from 'react';

import { summaryFor } from '@/web/api.ts';
import {
  formatDate,
  formatDuration,
  formatRelative,
  keepTogether,
  shortDigests,
} from '@/web/format.ts';
import { ImageName } from '@/web/image-name.tsx';
import {
  checkDuration,
  countLabel,
  countResults,
  reportFailed,
  statusClasses,
  statusLabels,
  triggerLabel,
} from '@/web/labels.ts';
import {
  Button,
  Icon,
} from '@/web/primitives.tsx';

import type { ReactElement } from 'react';

import type {
  Web_Api_Report,
  Web_Api_Result,
} from '@/types/web/api.d.ts';
import type {
  Web_Components_HistoryView_Props,
  Web_Components_ResultCount,
  Web_Components_ResultList_Props,
} from '@/types/web/components.d.ts';

// reportKey tells checks apart; two checks never start and finish at the same moments.

/**
 * History View - Report key.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 1.0.0
 */
const reportKey = (report: Web_Api_Report): string => `${report['startedAt']}/${report['finishedAt']}`;

// reportDot is green when something was updated, red when anything failed, and neutral otherwise.

/**
 * History View - Report dot.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 1.0.0
 */
const reportDot = (report: Web_Api_Report): string => {
  if (reportFailed(report)) {
    return 'status-dot status-error';
  }

  return (report['results'].some((result: Web_Api_Result): boolean => result['status'] === 'updated')) ? 'status-dot status-seeding' : 'status-dot status-paused';
};

/**
 * History View - Result list.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
export const ResultList = ({
  compact = false,
  results,
}: Web_Components_ResultList_Props): ReactElement => {
  if (results.length === 0) {
    return <p className="select-list select-list-empty">No containers were checked.</p>;
  }

  return (
    <ul className={(compact) ? 'activity-list activity-list-compact' : 'activity-list'}>
      {results.map((result: Web_Api_Result, index: number): ReactElement => (
        <li className="activity-row" key={`${result['container']}-${index}`}>
          <span aria-label={statusLabels[result['status']]} className={statusClasses[result['status']]} role="img" />
          <span className="activity-main">
            <span>{result['container']}</span>
            <small title={result['detail']}>
              <ImageName image={result['image']} />
              {(result['detail'] === '') ? null : ` · ${shortDigests(result['detail'])}`}
            </small>
          </span>
          <span className="activity-time">{statusLabels[result['status']]}</span>
        </li>
      ))}
    </ul>
  );
};

/**
 * History View.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
export const HistoryView = ({
  error,
  history,
  onRefresh,
}: Web_Components_HistoryView_Props): ReactElement => {
  const [
    expanded,
    setExpanded,
  ] = useState<string[]>([]);
  const [
    refreshing,
    setRefreshing,
  ] = useState<boolean>(false);

  /**
   * History View - Refresh.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @since 1.0.0
   */
  const refresh = async (): Promise<void> => {
    setRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setRefreshing(false);
    }
  };

  /**
   * History View - Toggle.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @since 1.0.0
   */
  const toggle = (key: string): void => {
    setExpanded((current: string[]): string[] => (
      (current.includes(key)) ? current.filter((candidate: string): boolean => candidate !== key) : [
        ...current,
        key,
      ]
    ));
  };

  let content: ReactElement | null = null;

  if (history === null) {
    content = (
      <div className="detail-loading">
        {(error === null) ? (
          <>
            <span className="spinner" />
            Loading the history…
          </>
        ) : summaryFor(error, [], 'The history could not be loaded.')}
      </div>
    );
  } else if (history.length === 0) {
    content = <p className="select-list select-list-empty">No checks have run yet.</p>;
  } else {
    content = (
      <ul className="history-list">
        {history.map((report: Web_Api_Report, index: number): ReactElement => {
          const key: string = reportKey(report);
          const open: boolean = expanded.includes(key);
          const started: string = triggerLabel(report['trigger']);
          const summary: string[] = [
            `took ${formatDuration(checkDuration(report))}`,
            ...countResults(report['results']).map((entry: Web_Components_ResultCount): string => countLabel(entry)),
          ];

          return (
            <li className={(open) ? 'history-item history-item-open' : 'history-item'} key={key}>
              <button
                aria-controls={`history-check-${index}`}
                aria-expanded={open}
                className="history-row"
                onClick={(): void => toggle(key)}
                type="button"
              >
                <span aria-label={(reportFailed(report)) ? 'Failed' : 'Finished'} className={reportDot(report)} role="img" />
                <span className="history-main">
                  <span className="history-title">
                    <time dateTime={report['startedAt']}>{formatDate(report['startedAt'])}</time>
                    {(started === '') ? null : <span className="tag">{started}</span>}
                  </span>
                  <small>{summary.map((part: string): string => keepTogether(part)).join(' · ')}</small>
                </span>
                <span className="activity-time">{formatRelative(report['startedAt'])}</span>
                <Icon name={(open) ? 'chevron-down' : 'chevron'} size={16} />
              </button>
              {(open) ? (
                <div className="history-results" id={`history-check-${index}`}>
                  {(report['error'] === null || report['error'] === undefined || report['error'] === '') ? null : (
                    <div className="form-error" role="alert">
                      <Icon name="warning" size={16} />
                      <span>{`The check failed: ${report['error']}`}</span>
                    </div>
                  )}
                  <ResultList results={report['results']} />
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <section className="workspace-section">
      <div className="workspace-heading workspace-heading-split">
        <div>
          <h1>History</h1>
          <p>The last 50 checks, newest first.</p>
        </div>
        <Button
          disabled={refreshing}
          icon="refresh"
          onClick={(): void => {
            void refresh();
          }}
        >
          Refresh
        </Button>
      </div>

      {(history !== null && error !== null) ? (
        <div className="form-error" role="alert">
          <Icon name="warning" size={16} />
          <span>{summaryFor(error, [], 'The history could not be loaded.')}</span>
        </div>
      ) : null}

      <div className="panel">{content}</div>
    </section>
  );
};

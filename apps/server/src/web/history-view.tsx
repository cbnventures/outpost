import { useState } from 'react';

import { summaryFor } from '@/web/api.ts';
import {
  formatDate,
  formatDuration,
  formatRelative,
  keepTogether,
} from '@/web/format.ts';
import {
  BreakableText,
  ImageName,
} from '@/web/image-name.tsx';
import {
  checkDuration,
  countLabel,
  countResults,
  cycleActionLabel,
  reportFailed,
  statusClasses,
  statusLabels,
  triggerLabel,
} from '@/web/labels.ts';
import {
  Button,
  Icon,
} from '@/web/primitives.tsx';

import type {
  Web_Components_HistoryView_Props,
  Web_Components_ResultList_Detail,
  Web_Components_ResultList_Props,
} from '@/types/web/components.d.ts';
import type {
  Web_HistoryView_HistoryView_Action,
  Web_HistoryView_HistoryView_Content,
  Web_HistoryView_HistoryView_Error,
  Web_HistoryView_HistoryView_ErrorNotice,
  Web_HistoryView_HistoryView_Expanded,
  Web_HistoryView_HistoryView_ExpandedState,
  Web_HistoryView_HistoryView_History,
  Web_HistoryView_HistoryView_Key,
  Web_HistoryView_HistoryView_OnRefresh,
  Web_HistoryView_HistoryView_Open,
  Web_HistoryView_HistoryView_Refresh,
  Web_HistoryView_HistoryView_Refresh_Returns,
  Web_HistoryView_HistoryView_Refreshing,
  Web_HistoryView_HistoryView_RefreshingState,
  Web_HistoryView_HistoryView_Returns,
  Web_HistoryView_HistoryView_SetExpanded,
  Web_HistoryView_HistoryView_SetRefreshing,
  Web_HistoryView_HistoryView_Started,
  Web_HistoryView_HistoryView_Summary,
  Web_HistoryView_HistoryView_Toggle,
  Web_HistoryView_HistoryView_Toggle_Key,
  Web_HistoryView_HistoryView_Toggle_Returns,
  Web_HistoryView_ReportDot_Report,
  Web_HistoryView_ReportDot_Returns,
  Web_HistoryView_ReportKey_Report,
  Web_HistoryView_ReportKey_Returns,
  Web_HistoryView_ResultList_Compact,
  Web_HistoryView_ResultList_Results,
  Web_HistoryView_ResultList_Returns,
} from '@/types/web/history-view.d.ts';

// reportKey tells checks apart; two checks never start and finish at the same moments.

/**
 * History View - Report Key.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_HistoryView_ReportKey_Report} report - Report.
 *
 * @returns {Web_HistoryView_ReportKey_Returns}
 *
 * @since 1.0.0
 */
const reportKey = (report: Web_HistoryView_ReportKey_Report): Web_HistoryView_ReportKey_Returns => `${report['startedAt']}/${report['finishedAt']}`;

// reportDot is green when something was updated, red when anything failed, and neutral otherwise.

/**
 * History View - Report Dot.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_HistoryView_ReportDot_Report} report - Report.
 *
 * @returns {Web_HistoryView_ReportDot_Returns}
 *
 * @since 1.0.0
 */
const reportDot = (report: Web_HistoryView_ReportDot_Report): Web_HistoryView_ReportDot_Returns => {
  if (reportFailed(report) === true) {
    return 'status-dot status-error';
  }

  return (report['results'].some((result) => result['status'] === 'updated') === true) ? 'status-dot status-seeding' : 'status-dot status-paused';
};

/**
 * History View - Result List.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @param {Web_Components_ResultList_Props} props - Props.
 *
 * @returns {Web_HistoryView_ResultList_Returns}
 *
 * @since 1.0.0
 */
export const ResultList = (props: Web_Components_ResultList_Props): Web_HistoryView_ResultList_Returns => {
  const compact: Web_HistoryView_ResultList_Compact = props['compact'] ?? false;
  const results: Web_HistoryView_ResultList_Results = props['results'];

  if (results.length === 0) {
    return <p className="select-list select-list-empty">No containers were checked.</p>;
  }

  return (
    <ul className={(compact === true) ? 'activity-list activity-list-compact' : 'activity-list'}>
      {results.map((result, index) => {
        const detail: Web_Components_ResultList_Detail = (compact === true) ? (result['summary'] ?? result['detail']) : result['detail'];

        return (
          <li className="activity-row" key={`${result['container']}-${index}`}>
            <span aria-label={statusLabels[result['status']]} className={statusClasses[result['status']]} role="img" />
            <span className="activity-main">
              <span>{result['container']}</span>
              <small title={detail}>
                <ImageName image={result['image']} />
                {(detail === '') ? null : (
                  <>
                    {'\u00a0·\u00a0'}
                    <BreakableText breakAtNameSeparators text={detail} />
                  </>
                )}
              </small>
            </span>
            <span className="activity-time">{statusLabels[result['status']]}</span>
          </li>
        );
      })}
    </ul>
  );
};

/**
 * History View - History View.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @param {Web_Components_HistoryView_Props} props - Props.
 *
 * @returns {Web_HistoryView_HistoryView_Returns}
 *
 * @since 1.0.0
 */
export const HistoryView = (props: Web_Components_HistoryView_Props): Web_HistoryView_HistoryView_Returns => {
  const error: Web_HistoryView_HistoryView_Error = props['error'];
  const history: Web_HistoryView_HistoryView_History = props['history'];
  const onRefresh: Web_HistoryView_HistoryView_OnRefresh = props['onRefresh'];
  const expandedState: Web_HistoryView_HistoryView_ExpandedState = useState<Web_HistoryView_HistoryView_Expanded>([]);
  const expanded: Web_HistoryView_HistoryView_Expanded = expandedState[0];
  const setExpanded: Web_HistoryView_HistoryView_SetExpanded = expandedState[1];
  const refreshingState: Web_HistoryView_HistoryView_RefreshingState = useState<Web_HistoryView_HistoryView_Refreshing>(false);
  const refreshing: Web_HistoryView_HistoryView_Refreshing = refreshingState[0];
  const setRefreshing: Web_HistoryView_HistoryView_SetRefreshing = refreshingState[1];

  /**
   * History View - Refresh.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @returns {Web_HistoryView_HistoryView_Refresh_Returns}
   *
   * @since 1.0.0
   */
  const refresh: Web_HistoryView_HistoryView_Refresh = async (): Web_HistoryView_HistoryView_Refresh_Returns => {
    setRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setRefreshing(false);
    }

    return;
  };

  /**
   * History View - Toggle.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @param {Web_HistoryView_HistoryView_Toggle_Key} key - Key.
   *
   * @returns {Web_HistoryView_HistoryView_Toggle_Returns}
   *
   * @since 1.0.0
   */
  const toggle: Web_HistoryView_HistoryView_Toggle = (key: Web_HistoryView_HistoryView_Toggle_Key): Web_HistoryView_HistoryView_Toggle_Returns => {
    setExpanded((current) => (
      (current.includes(key) === true) ? current.filter((candidate) => candidate !== key) : [
        ...current,
        key,
      ]
    ));

    return;
  };

  let content: Web_HistoryView_HistoryView_Content = null;

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
        {history.map((report, index) => {
          const key: Web_HistoryView_HistoryView_Key = reportKey(report);
          const open: Web_HistoryView_HistoryView_Open = expanded.includes(key);
          const action: Web_HistoryView_HistoryView_Action = cycleActionLabel(report['action']);
          const started: Web_HistoryView_HistoryView_Started = triggerLabel(report['trigger']);
          const summary: Web_HistoryView_HistoryView_Summary = [
            `took ${formatDuration(checkDuration(report))}`,
            ...countResults(report['results']).map((entry) => countLabel(entry)),
          ];
          let errorNotice: Web_HistoryView_HistoryView_ErrorNotice = null;

          if (
            report['error'] !== null
            && report['error'] !== undefined
            && report['error'] !== ''
          ) {
            errorNotice = (
              <div className="form-error" role="alert">
                <Icon name="warning" size={16} />
                <span>{`The ${action.toLowerCase()} failed: ${report['error']}`}</span>
              </div>
            );
          }

          return (
            <li className={(open === true) ? 'history-item history-item-open' : 'history-item'} key={key}>
              <button
                aria-controls={`history-check-${index}`}
                aria-expanded={open}
                className="history-row"
                onClick={() => toggle(key)}
                type="button"
              >
                <span aria-label={(reportFailed(report) === true) ? 'Failed' : 'Finished'} className={reportDot(report)} role="img" />
                <span className="history-main">
                  <span className="history-title">
                    <time dateTime={report['startedAt']}>{formatDate(report['startedAt'])}</time>
                    <span className="tag">{action}</span>
                    {(started === '') ? null : <span className="tag">{started}</span>}
                    {(report['rollback'] === false) ? <span className="tag tag-warning">Rollback disabled</span> : null}
                  </span>
                  <small>{summary.map((part) => keepTogether(part)).join('\u00a0· ')}</small>
                </span>
                <span className="activity-time">{formatRelative(report['startedAt'])}</span>
                <Icon name={(open === true) ? 'chevron-down' : 'chevron'} size={16} />
              </button>
              {(open === true) ? (
                <div className="history-results" id={`history-check-${index}`}>
                  {errorNotice}
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
          <p>The last 50 checks and updates, newest first.</p>
        </div>
        <Button
          disabled={refreshing}
          icon="refresh"
          onClick={() => {
            void refresh();

            return;
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

import type {
  Dispatch,
  ReactElement,
  SetStateAction,
} from 'react';

import type {
  Web_Api_Report,
  Web_Api_Result,
} from '@/types/web/api.d.ts';

/**
 * History View.
 *
 * @since 1.2.1
 */
export type Web_HistoryView_HistoryView_Returns = ReactElement;
export type Web_HistoryView_HistoryView_Error = unknown;
export type Web_HistoryView_HistoryView_History = Web_Api_Report[] | null;
export type Web_HistoryView_HistoryView_OnRefresh = () => Promise<void>;
export type Web_HistoryView_HistoryView_ExpandedState = [string[], Dispatch<SetStateAction<string[]>>];
export type Web_HistoryView_HistoryView_Expanded = string[];
export type Web_HistoryView_HistoryView_SetExpanded = Dispatch<SetStateAction<string[]>>;
export type Web_HistoryView_HistoryView_RefreshingState = [boolean, Dispatch<SetStateAction<boolean>>];
export type Web_HistoryView_HistoryView_Refreshing = boolean;
export type Web_HistoryView_HistoryView_SetRefreshing = Dispatch<SetStateAction<boolean>>;
export type Web_HistoryView_HistoryView_Refresh_Returns = Promise<void>;
export type Web_HistoryView_HistoryView_Refresh = () => Web_HistoryView_HistoryView_Refresh_Returns;
export type Web_HistoryView_HistoryView_Toggle_Key = string;
export type Web_HistoryView_HistoryView_Toggle_Returns = void;
export type Web_HistoryView_HistoryView_Toggle = (key: Web_HistoryView_HistoryView_Toggle_Key) => Web_HistoryView_HistoryView_Toggle_Returns;
export type Web_HistoryView_HistoryView_Content = ReactElement | null;
export type Web_HistoryView_HistoryView_Key = string;
export type Web_HistoryView_HistoryView_Open = boolean;
export type Web_HistoryView_HistoryView_Action = string;
export type Web_HistoryView_HistoryView_Started = string;
export type Web_HistoryView_HistoryView_Summary = string[];
export type Web_HistoryView_HistoryView_ErrorNotice = ReactElement | null;

/**
 * History View.
 *
 * @since 1.2.1
 */
export type Web_HistoryView_ReportDot_Report = Web_Api_Report;
export type Web_HistoryView_ReportDot_Returns = string;

/**
 * History View.
 *
 * @since 1.2.1
 */
export type Web_HistoryView_ReportKey_Report = Web_Api_Report;
export type Web_HistoryView_ReportKey_Returns = string;

/**
 * History View.
 *
 * @since 1.2.1
 */
export type Web_HistoryView_ResultList_Returns = ReactElement;
export type Web_HistoryView_ResultList_Compact = boolean;
export type Web_HistoryView_ResultList_Results = Web_Api_Result[];

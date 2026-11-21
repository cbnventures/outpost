import type {
  Dispatch,
  ReactElement,
  SetStateAction,
} from 'react';

import type {
  Web_Api_Container,
  Web_Api_Overview,
  Web_Api_Report,
  Web_Api_ResultStatus,
} from '@/types/web/api.d.ts';
import type {
  Web_Components_StartCheck,
  Web_Components_StartUpdate,
} from '@/types/web/components.d.ts';

/**
 * Overview View.
 *
 * @since 1.2.1
 */
export type Web_OverviewView_CountOf_Report = Web_Api_Report;
export type Web_OverviewView_CountOf_Status = Web_Api_ResultStatus;
export type Web_OverviewView_CountOf_Returns = number;

/**
 * Overview View.
 *
 * @since 1.2.1
 */
export type Web_OverviewView_OverviewView_Returns = ReactElement;
export type Web_OverviewView_OverviewView_Containers = Web_Api_Container[] | null;
export type Web_OverviewView_OverviewView_Error = unknown;
export type Web_OverviewView_OverviewView_OnOpenContainers = () => void;
export type Web_OverviewView_OverviewView_OnOpenHistory = () => void;
export type Web_OverviewView_OverviewView_OnStartCheck = Web_Components_StartCheck;
export type Web_OverviewView_OverviewView_OnStartUpdate = Web_Components_StartUpdate;
export type Web_OverviewView_OverviewView_Overview = Web_Api_Overview | null;
export type Web_OverviewView_OverviewView_BusyState = [boolean, Dispatch<SetStateAction<boolean>>];
export type Web_OverviewView_OverviewView_Busy = boolean;
export type Web_OverviewView_OverviewView_SetBusy = Dispatch<SetStateAction<boolean>>;
export type Web_OverviewView_OverviewView_ActionErrorState = [string, Dispatch<SetStateAction<string>>];
export type Web_OverviewView_OverviewView_ActionError = string;
export type Web_OverviewView_OverviewView_SetActionError = Dispatch<SetStateAction<string>>;
export type Web_OverviewView_OverviewView_ConfirmingUpdateAllState = [boolean, Dispatch<SetStateAction<boolean>>];
export type Web_OverviewView_OverviewView_ConfirmingUpdateAll = boolean;
export type Web_OverviewView_OverviewView_SetConfirmingUpdateAll = Dispatch<SetStateAction<boolean>>;
export type Web_OverviewView_OverviewView_NowState = [number, Dispatch<SetStateAction<number>>];
export type Web_OverviewView_OverviewView_Now = number;
export type Web_OverviewView_OverviewView_SetNow = Dispatch<SetStateAction<number>>;
export type Web_OverviewView_OverviewView_Running = boolean;
export type Web_OverviewView_OverviewView_Timer = number;
export type Web_OverviewView_OverviewView_CheckNow_Returns = Promise<void>;
export type Web_OverviewView_OverviewView_CheckNow = () => Web_OverviewView_OverviewView_CheckNow_Returns;
export type Web_OverviewView_OverviewView_UpdateAll_Returns = Promise<void>;
export type Web_OverviewView_OverviewView_UpdateAll = () => Web_OverviewView_OverviewView_UpdateAll_Returns;
export type Web_OverviewView_OverviewView_LastReport = Web_Api_Report | null;
export type Web_OverviewView_OverviewView_ManagedCount = number;
export type Web_OverviewView_OverviewView_AvailableCount = number;
export type Web_OverviewView_OverviewView_Failed = number;
export type Web_OverviewView_OverviewView_Available = number;
export type Web_OverviewView_OverviewView_StartedBy = string;
export type Web_OverviewView_OverviewView_RunningActionLabel = string;
export type Web_OverviewView_OverviewView_LastActionLabel = string;
export type Web_OverviewView_OverviewView_ScheduledActionLabel = string;
export type Web_OverviewView_OverviewView_LastErrorNotice = ReactElement | null;

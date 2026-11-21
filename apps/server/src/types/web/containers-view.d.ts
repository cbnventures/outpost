import type {
  Dispatch,
  ReactElement,
  SetStateAction,
} from 'react';

import type {
  Web_Api_Container,
  Web_Api_Overview,
} from '@/types/web/api.d.ts';
import type {
  Web_Components_StartCheck,
  Web_Components_StartUpdate,
} from '@/types/web/components.d.ts';

/**
 * Containers View.
 *
 * @since 1.2.1
 */
export type Web_ContainersView_ActionLabel_Container = Web_Api_Container;
export type Web_ContainersView_ActionLabel_Checking = boolean;
export type Web_ContainersView_ActionLabel_Updating = boolean;
export type Web_ContainersView_ActionLabel_Returns = string;

/**
 * Containers View.
 *
 * @since 1.2.1
 */
export type Web_ContainersView_ContainersView_Returns = ReactElement;
export type Web_ContainersView_ContainersView_Containers = Web_Api_Container[] | null;
export type Web_ContainersView_ContainersView_Error = unknown;
export type Web_ContainersView_ContainersView_OnRefresh = () => Promise<void>;
export type Web_ContainersView_ContainersView_OnStartCheck = Web_Components_StartCheck;
export type Web_ContainersView_ContainersView_OnStartUpdate = Web_Components_StartUpdate;
export type Web_ContainersView_ContainersView_Overview = Web_Api_Overview | null;
export type Web_ContainersView_ContainersView_BusyState = [boolean, Dispatch<SetStateAction<boolean>>];
export type Web_ContainersView_ContainersView_Busy = boolean;
export type Web_ContainersView_ContainersView_SetBusy = Dispatch<SetStateAction<boolean>>;
export type Web_ContainersView_ContainersView_CheckingState = [string, Dispatch<SetStateAction<string>>];
export type Web_ContainersView_ContainersView_Checking = string;
export type Web_ContainersView_ContainersView_SetChecking = Dispatch<SetStateAction<string>>;
export type Web_ContainersView_ContainersView_UpdatingState = [string, Dispatch<SetStateAction<string>>];
export type Web_ContainersView_ContainersView_Updating = string;
export type Web_ContainersView_ContainersView_SetUpdating = Dispatch<SetStateAction<string>>;
export type Web_ContainersView_ContainersView_ActionErrorState = [string, Dispatch<SetStateAction<string>>];
export type Web_ContainersView_ContainersView_ActionError = string;
export type Web_ContainersView_ContainersView_SetActionError = Dispatch<SetStateAction<string>>;
export type Web_ContainersView_ContainersView_ConfirmingUpdateState = [Web_Api_Container | null, Dispatch<SetStateAction<Web_Api_Container | null>>];
export type Web_ContainersView_ContainersView_ConfirmingUpdate = Web_Api_Container | null;
export type Web_ContainersView_ContainersView_SetConfirmingUpdate = Dispatch<SetStateAction<Web_Api_Container | null>>;
export type Web_ContainersView_ContainersView_ConfirmingUpdateAllState = [boolean, Dispatch<SetStateAction<boolean>>];
export type Web_ContainersView_ContainersView_ConfirmingUpdateAll = boolean;
export type Web_ContainersView_ContainersView_SetConfirmingUpdateAll = Dispatch<SetStateAction<boolean>>;
export type Web_ContainersView_ContainersView_Running = boolean;
export type Web_ContainersView_ContainersView_Check_Container = Web_Api_Container;
export type Web_ContainersView_ContainersView_Check_Returns = Promise<void>;
export type Web_ContainersView_ContainersView_Check = (container: Web_ContainersView_ContainersView_Check_Container) => Web_ContainersView_ContainersView_Check_Returns;
export type Web_ContainersView_ContainersView_Update_Container = Web_Api_Container;
export type Web_ContainersView_ContainersView_Update_Rollback = boolean;
export type Web_ContainersView_ContainersView_Update_Returns = Promise<void>;
export type Web_ContainersView_ContainersView_Update = (container?: Web_ContainersView_ContainersView_Update_Container, rollback?: Web_ContainersView_ContainersView_Update_Rollback) => Web_ContainersView_ContainersView_Update_Returns;
export type Web_ContainersView_ContainersView_Refresh_Returns = Promise<void>;
export type Web_ContainersView_ContainersView_Refresh = () => Web_ContainersView_ContainersView_Refresh_Returns;
export type Web_ContainersView_ContainersView_AvailableCount = number;
export type Web_ContainersView_ContainersView_Content = ReactElement | null;
export type Web_ContainersView_ContainersView_ConfirmedContainer = Web_Api_Container;

/**
 * Containers View.
 *
 * @since 1.2.1
 */
export type Web_ContainersView_LastResult_Returns = ReactElement;
export type Web_ContainersView_LastResult_Container = Web_Api_Container;
export type Web_ContainersView_LastResult_Status = Web_Api_Container['lastStatus'];
export type Web_ContainersView_LastResult_Detail = Web_Api_Container['lastDetail'];
export type Web_ContainersView_LastResult_CheckedVerb = string;
export type Web_ContainersView_LastResult_DetailNote = ReactElement | null;

/**
 * Containers View.
 *
 * @since 1.2.1
 */
export type Web_ContainersView_Managed_Returns = ReactElement;
export type Web_ContainersView_Managed_Container = Web_Api_Container;

/**
 * Containers View.
 *
 * @since 1.2.1
 */
export type Web_ContainersView_ManagedNote_Container = Web_Api_Container;
export type Web_ContainersView_ManagedNote_Returns = string;

/**
 * Containers View.
 *
 * @since 1.2.1
 */
export type Web_ContainersView_UpdateConfirmationDialog_Returns = ReactElement;
export type Web_ContainersView_UpdateConfirmationDialog_Container = Web_Api_Container;
export type Web_ContainersView_UpdateConfirmationDialog_OnCancel = () => void;
export type Web_ContainersView_UpdateConfirmationDialog_OnConfirm = (rollback: boolean) => void;
export type Web_ContainersView_UpdateConfirmationDialog_KeepNewContainerState = [boolean, Dispatch<SetStateAction<boolean>>];
export type Web_ContainersView_UpdateConfirmationDialog_KeepNewContainer = boolean;
export type Web_ContainersView_UpdateConfirmationDialog_SetKeepNewContainer = Dispatch<SetStateAction<boolean>>;
export type Web_ContainersView_UpdateConfirmationDialog_Held = boolean;
export type Web_ContainersView_UpdateConfirmationDialog_Message = string;

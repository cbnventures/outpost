import type {
  Dispatch,
  MutableRefObject,
  ReactElement,
  SetStateAction,
} from 'react';

import type {
  Web_Api_Container,
  Web_Api_Overview,
  Web_Api_Principal,
  Web_Api_RemovedSecret,
  Web_Api_Report,
  Web_Api_Settings,
  Web_Api_SetupStatus,
  Web_Api_Token,
  Web_Api_UpdateSettingsInput,
} from '@/types/web/api.d.ts';
import type { Web_AppNavigation_Route } from '@/types/web/app-navigation.d.ts';
import type { Web_Components_View } from '@/types/web/components.d.ts';

/**
 * App.
 *
 * @since 1.2.1
 */
export type Web_App_App_Returns = ReactElement;
export type Web_App_App_Phase = Web_App_Phase;
export type Web_App_App_SetPhase = Dispatch<SetStateAction<Web_App_App_Phase>>;
export type Web_App_App_PhaseState = [Web_App_App_Phase, Web_App_App_SetPhase];
export type Web_App_App_Username = string;
export type Web_App_App_SetUsername = Dispatch<SetStateAction<Web_App_App_Username>>;
export type Web_App_App_UsernameState = [Web_App_App_Username, Web_App_App_SetUsername];
export type Web_App_App_ActiveRoute = Web_AppNavigation_Route;
export type Web_App_App_SetActiveRoute = Dispatch<SetStateAction<Web_App_App_ActiveRoute>>;
export type Web_App_App_ActiveRouteState = [Web_App_App_ActiveRoute, Web_App_App_SetActiveRoute];
export type Web_App_App_Overview = Web_Api_Overview | null;
export type Web_App_App_SetOverview = Dispatch<SetStateAction<Web_App_App_Overview>>;
export type Web_App_App_OverviewState = [Web_App_App_Overview, Web_App_App_SetOverview];
export type Web_App_App_OverviewError = unknown;
export type Web_App_App_SetOverviewError = Dispatch<SetStateAction<Web_App_App_OverviewError>>;
export type Web_App_App_OverviewErrorState = [Web_App_App_OverviewError, Web_App_App_SetOverviewError];
export type Web_App_App_Containers = Web_Api_Container[] | null;
export type Web_App_App_SetContainers = Dispatch<SetStateAction<Web_App_App_Containers>>;
export type Web_App_App_ContainersState = [Web_App_App_Containers, Web_App_App_SetContainers];
export type Web_App_App_ContainersError = unknown;
export type Web_App_App_SetContainersError = Dispatch<SetStateAction<Web_App_App_ContainersError>>;
export type Web_App_App_ContainersErrorState = [Web_App_App_ContainersError, Web_App_App_SetContainersError];
export type Web_App_App_History = Web_Api_Report[] | null;
export type Web_App_App_SetHistory = Dispatch<SetStateAction<Web_App_App_History>>;
export type Web_App_App_HistoryState = [Web_App_App_History, Web_App_App_SetHistory];
export type Web_App_App_HistoryError = unknown;
export type Web_App_App_SetHistoryError = Dispatch<SetStateAction<Web_App_App_HistoryError>>;
export type Web_App_App_HistoryErrorState = [Web_App_App_HistoryError, Web_App_App_SetHistoryError];
export type Web_App_App_Settings = Web_Api_Settings | null;
export type Web_App_App_SetSettings = Dispatch<SetStateAction<Web_App_App_Settings>>;
export type Web_App_App_SettingsState = [Web_App_App_Settings, Web_App_App_SetSettings];
export type Web_App_App_SettingsError = unknown;
export type Web_App_App_SetSettingsError = Dispatch<SetStateAction<Web_App_App_SettingsError>>;
export type Web_App_App_SettingsErrorState = [Web_App_App_SettingsError, Web_App_App_SetSettingsError];
export type Web_App_App_Tokens = Web_Api_Token[];
export type Web_App_App_SetTokens = Dispatch<SetStateAction<Web_App_App_Tokens>>;
export type Web_App_App_TokensState = [Web_App_App_Tokens, Web_App_App_SetTokens];
export type Web_App_App_RemovedSecrets = Web_Api_RemovedSecret[];
export type Web_App_App_SetRemovedSecrets = Dispatch<SetStateAction<Web_App_App_RemovedSecrets>>;
export type Web_App_App_RemovedSecretsState = [Web_App_App_RemovedSecrets, Web_App_App_SetRemovedSecrets];
export type Web_App_App_StartupError = string;
export type Web_App_App_SetStartupError = Dispatch<SetStateAction<Web_App_App_StartupError>>;
export type Web_App_App_StartupErrorState = [Web_App_App_StartupError, Web_App_App_SetStartupError];
export type Web_App_App_StreamAttempt = number;
export type Web_App_App_SetStreamAttempt = Dispatch<SetStateAction<Web_App_App_StreamAttempt>>;
export type Web_App_App_StreamAttemptState = [Web_App_App_StreamAttempt, Web_App_App_SetStreamAttempt];
export type Web_App_App_WasRunning = MutableRefObject<boolean>;
export type Web_App_App_ResetSession_Returns = void;
export type Web_App_App_ResetSession = () => Web_App_App_ResetSession_Returns;
export type Web_App_App_Guard_Action = () => Promise<void>;
export type Web_App_App_Guard_Returns = Promise<void>;
export type Web_App_App_Guard = (action: Web_App_App_Guard_Action) => Web_App_App_Guard_Returns;
export type Web_App_App_Load_Action = () => Promise<void>;
export type Web_App_App_Load_OnError = (error: unknown) => void;
export type Web_App_App_Load_Returns = Promise<void>;
export type Web_App_App_Load = (action: Web_App_App_Load_Action, onError: Web_App_App_Load_OnError) => Web_App_App_Load_Returns;
export type Web_App_App_LoadOverview_Returns = Promise<void>;
export type Web_App_App_LoadOverview = () => Web_App_App_LoadOverview_Returns;
export type Web_App_App_LoadContainers_Returns = Promise<void>;
export type Web_App_App_LoadContainers = () => Web_App_App_LoadContainers_Returns;
export type Web_App_App_LoadHistory_Returns = Promise<void>;
export type Web_App_App_LoadHistory = () => Web_App_App_LoadHistory_Returns;
export type Web_App_App_LoadSettings_Returns = Promise<void>;
export type Web_App_App_LoadSettings = () => Web_App_App_LoadSettings_Returns;
export type Web_App_App_SaveSettings_Input = Web_Api_UpdateSettingsInput;
export type Web_App_App_SaveSettings_Returns = Promise<Web_Api_Settings>;
export type Web_App_App_SaveSettings = (input: Web_App_App_SaveSettings_Input) => Web_App_App_SaveSettings_Returns;
export type Web_App_App_SaveSettings_NextSettings = Web_Api_Settings;
export type Web_App_App_LoadTokens_Returns = Promise<void>;
export type Web_App_App_LoadTokens = () => Web_App_App_LoadTokens_Returns;
export type Web_App_App_LoadRemovedSecrets_Returns = Promise<void>;
export type Web_App_App_LoadRemovedSecrets = () => Web_App_App_LoadRemovedSecrets_Returns;
export type Web_App_App_LoadRemovedSecrets_Principal = Web_Api_Principal | null;
export type Web_App_App_ApplyAppRoute_Route = Web_AppNavigation_Route;
export type Web_App_App_ApplyAppRoute_Returns = void;
export type Web_App_App_ApplyAppRoute = (route: Web_App_App_ApplyAppRoute_Route) => Web_App_App_ApplyAppRoute_Returns;
export type Web_App_App_EnterApplication_Returns = Promise<void>;
export type Web_App_App_EnterApplication = () => Web_App_App_EnterApplication_Returns;
export type Web_App_App_EnterApplication_Principal = Web_Api_Principal | null;
export type Web_App_App_Bootstrap_Returns = Promise<void>;
export type Web_App_App_Bootstrap = () => Web_App_App_Bootstrap_Returns;
export type Web_App_App_Bootstrap_SetupStatus = Web_Api_SetupStatus;
export type Web_App_App_RetryTimer = number | undefined;
export type Web_App_App_Retry_Returns = void;
export type Web_App_App_Retry = () => Web_App_App_Retry_Returns;
export type Web_App_App_CloseEvents = () => void;
export type Web_App_App_Running = boolean;
export type Web_App_App_Timer = number;
export type Web_App_App_LatestReport = Web_Api_Report | undefined;
export type Web_App_App_LatestReportFinishedAt = string | undefined;
export type Web_App_App_LastReport = Web_Api_Report | null | undefined;
export type Web_App_App_LastReportFinishedAt = string | undefined;
export type Web_App_App_RunCheck_ContainerId = string;
export type Web_App_App_RunCheck_Returns = Promise<void>;
export type Web_App_App_RunCheck = (containerId?: Web_App_App_RunCheck_ContainerId) => Web_App_App_RunCheck_Returns;
export type Web_App_App_RunUpdate_ContainerId = string;
export type Web_App_App_RunUpdate_Rollback = boolean;
export type Web_App_App_RunUpdate_Returns = Promise<void>;
export type Web_App_App_RunUpdate = (containerId?: Web_App_App_RunUpdate_ContainerId, rollback?: Web_App_App_RunUpdate_Rollback) => Web_App_App_RunUpdate_Returns;
export type Web_App_App_OpenRoute_Route = Web_AppNavigation_Route;
export type Web_App_App_OpenRoute_Returns = void;
export type Web_App_App_OpenRoute = (route: Web_App_App_OpenRoute_Route) => Web_App_App_OpenRoute_Returns;
export type Web_App_App_OpenView_View = Web_Components_View;
export type Web_App_App_OpenView_Returns = void;
export type Web_App_App_OpenView = (view: Web_App_App_OpenView_View) => Web_App_App_OpenView_Returns;
export type Web_App_App_SignOut_Returns = Promise<void>;
export type Web_App_App_SignOut = () => Web_App_App_SignOut_Returns;
export type Web_App_App_RenderView_Returns = ReactElement;
export type Web_App_App_RenderView = () => Web_App_App_RenderView_Returns;
export type Web_App_App_LastRemovedSecret = Web_Api_RemovedSecret | undefined;
export type Web_App_App_RemovedAt = string;
export type Web_App_App_Notice = ReactElement | null;
export type Web_App_App_RemovedSecretTarget = string;
export type Web_App_App_DockerUnreachable = boolean;

/**
 * App.
 *
 * @since 1.2.1
 */
export type Web_App_DescribeRemovedSecret_RemovedSecret = Web_Api_RemovedSecret;
export type Web_App_DescribeRemovedSecret_Returns = Web_App_RemovedSecretAction;

/**
 * App.
 *
 * @since 1.0.0
 */
export type Web_App_Phase = 'application' | 'claim' | 'loading' | 'login';

/**
 * App.
 *
 * @since 1.2.1
 */
export type Web_App_ReconnectDelay = number;

/**
 * App.
 *
 * @since 1.0.0
 */
export type Web_App_RemovedSecretAction = {
  label: string;
  view: Web_Components_View;
};

/**
 * App.
 *
 * @since 1.2.1
 */
export type Web_App_RunningPollInterval = number;

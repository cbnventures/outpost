import {
  useEffect,
  useRef,
  useState,
} from 'react';

import { AccessView } from '@/web/access-view.tsx';
import {
  ApiError,
  connectEvents,
  createToken,
  dismissRemovedSecrets,
  getContainers,
  getCurrentPrincipal,
  getHistory,
  getOverview,
  getSettings,
  getSetupStatus,
  getTokens,
  logout,
  revokeToken,
  startCheck,
  startUpdate,
  updateSettings,
  updateToken,
} from '@/web/api.ts';
import {
  appRouteForView,
  resolveAppNavigationPath,
} from '@/web/app-navigation.ts';
import { AppShell } from '@/web/app-shell.tsx';
import { AuthenticationScreen } from '@/web/auth-screen.tsx';
import { ContainersView } from '@/web/containers-view.tsx';
import { HistoryView } from '@/web/history-view.tsx';
import { KeyNotice } from '@/web/key-notice.tsx';
import { describeScheduler } from '@/web/labels.ts';
import {
  applyNavigationPath,
  pushNavigationPath,
  replaceNavigationPath,
  startNavigationHistory,
} from '@/web/navigation.ts';
import { NotificationsView } from '@/web/notifications-view.tsx';
import { OverviewView } from '@/web/overview-view.tsx';
import { BrandMark } from '@/web/primitives.tsx';
import { SecurityView } from '@/web/security-view.tsx';
import { SettingsView } from '@/web/settings-view.tsx';

import type { Web_Api_CreatedToken } from '@/types/web/api.d.ts';
import type { Web_AppNavigation_PathMatch } from '@/types/web/app-navigation.d.ts';
import type {
  Web_App_App_ActiveRoute,
  Web_App_App_ActiveRouteState,
  Web_App_App_ApplyAppRoute,
  Web_App_App_ApplyAppRoute_Returns,
  Web_App_App_ApplyAppRoute_Route,
  Web_App_App_Bootstrap,
  Web_App_App_Bootstrap_Returns,
  Web_App_App_Bootstrap_SetupStatus,
  Web_App_App_CloseEvents,
  Web_App_App_Containers,
  Web_App_App_ContainersError,
  Web_App_App_ContainersErrorState,
  Web_App_App_ContainersState,
  Web_App_App_DockerUnreachable,
  Web_App_App_EnterApplication,
  Web_App_App_EnterApplication_Principal,
  Web_App_App_EnterApplication_Returns,
  Web_App_App_Guard,
  Web_App_App_Guard_Action,
  Web_App_App_Guard_Returns,
  Web_App_App_History,
  Web_App_App_HistoryError,
  Web_App_App_HistoryErrorState,
  Web_App_App_HistoryState,
  Web_App_App_LastRemovedSecret,
  Web_App_App_LastReport,
  Web_App_App_LastReportFinishedAt,
  Web_App_App_LatestReport,
  Web_App_App_LatestReportFinishedAt,
  Web_App_App_Load,
  Web_App_App_Load_Action,
  Web_App_App_Load_OnError,
  Web_App_App_Load_Returns,
  Web_App_App_LoadContainers,
  Web_App_App_LoadContainers_Returns,
  Web_App_App_LoadHistory,
  Web_App_App_LoadHistory_Returns,
  Web_App_App_LoadOverview,
  Web_App_App_LoadOverview_Returns,
  Web_App_App_LoadRemovedSecrets,
  Web_App_App_LoadRemovedSecrets_Principal,
  Web_App_App_LoadRemovedSecrets_Returns,
  Web_App_App_LoadSettings,
  Web_App_App_LoadSettings_Returns,
  Web_App_App_LoadTokens,
  Web_App_App_LoadTokens_Returns,
  Web_App_App_Notice,
  Web_App_App_OpenRoute,
  Web_App_App_OpenRoute_Returns,
  Web_App_App_OpenRoute_Route,
  Web_App_App_OpenView,
  Web_App_App_OpenView_Returns,
  Web_App_App_OpenView_View,
  Web_App_App_Overview,
  Web_App_App_OverviewError,
  Web_App_App_OverviewErrorState,
  Web_App_App_OverviewState,
  Web_App_App_Phase,
  Web_App_App_PhaseState,
  Web_App_App_RemovedAt,
  Web_App_App_RemovedSecrets,
  Web_App_App_RemovedSecretsState,
  Web_App_App_RemovedSecretTarget,
  Web_App_App_RenderView,
  Web_App_App_RenderView_Returns,
  Web_App_App_ResetSession,
  Web_App_App_ResetSession_Returns,
  Web_App_App_Retry,
  Web_App_App_Retry_Returns,
  Web_App_App_RetryTimer,
  Web_App_App_Returns,
  Web_App_App_RunCheck,
  Web_App_App_RunCheck_ContainerId,
  Web_App_App_RunCheck_Returns,
  Web_App_App_Running,
  Web_App_App_RunUpdate,
  Web_App_App_RunUpdate_ContainerId,
  Web_App_App_RunUpdate_Returns,
  Web_App_App_RunUpdate_Rollback,
  Web_App_App_SaveSettings,
  Web_App_App_SaveSettings_Input,
  Web_App_App_SaveSettings_NextSettings,
  Web_App_App_SaveSettings_Returns,
  Web_App_App_SetActiveRoute,
  Web_App_App_SetContainers,
  Web_App_App_SetContainersError,
  Web_App_App_SetHistory,
  Web_App_App_SetHistoryError,
  Web_App_App_SetOverview,
  Web_App_App_SetOverviewError,
  Web_App_App_SetPhase,
  Web_App_App_SetRemovedSecrets,
  Web_App_App_SetSettings,
  Web_App_App_SetSettingsError,
  Web_App_App_SetStartupError,
  Web_App_App_SetStreamAttempt,
  Web_App_App_Settings,
  Web_App_App_SettingsError,
  Web_App_App_SettingsErrorState,
  Web_App_App_SettingsState,
  Web_App_App_SetTokens,
  Web_App_App_SetUsername,
  Web_App_App_SignOut,
  Web_App_App_SignOut_Returns,
  Web_App_App_StartupError,
  Web_App_App_StartupErrorState,
  Web_App_App_StreamAttempt,
  Web_App_App_StreamAttemptState,
  Web_App_App_Timer,
  Web_App_App_Tokens,
  Web_App_App_TokensState,
  Web_App_App_Username,
  Web_App_App_UsernameState,
  Web_App_App_WasRunning,
  Web_App_DescribeRemovedSecret_RemovedSecret,
  Web_App_DescribeRemovedSecret_Returns,
  Web_App_ReconnectDelay,
  Web_App_RunningPollInterval,
} from '@/types/web/app.d.ts';
import type {
  Web_Components_SchedulerStatus,
  Web_Components_ShellStatus,
  Web_Components_View,
} from '@/types/web/components.d.ts';

// How long to wait before opening the event stream again after it closed.

/**
 * App - Reconnect Delay.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
const reconnectDelay: Web_App_ReconnectDelay = 5000;

// How often the overview is fetched while a check runs, in case a proxy holds back the event stream.

/**
 * App - Running Poll Interval.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
const runningPollInterval: Web_App_RunningPollInterval = 5000;

// What each secret removed with a lost key asks for, and the page where it is entered again.

/**
 * App - Describe Removed Secret.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_App_DescribeRemovedSecret_RemovedSecret} removedSecret - Removed secret.
 *
 * @returns {Web_App_DescribeRemovedSecret_Returns}
 *
 * @since 1.0.0
 */
const describeRemovedSecret = (removedSecret: Web_App_DescribeRemovedSecret_RemovedSecret): Web_App_DescribeRemovedSecret_Returns => {
  if (removedSecret['kind'] === 'notification') {
    return {
      label: `Set up the ${removedSecret['name'] ?? 'removed'} notification again`,
      view: 'notifications',
    };
  }

  if (removedSecret['kind'] === 'registry') {
    return {
      label: `Set up the ${removedSecret['name'] ?? 'removed'} registry sign-in again`,
      view: 'settings',
    };
  }

  return {
    label: 'Set up the authenticator app',
    view: 'security',
  };
};

/**
 * App - App.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {Web_App_App_Returns}
 *
 * @since 1.0.0
 */
export const App = (): Web_App_App_Returns => {
  const initialNavigation: Web_AppNavigation_PathMatch = resolveAppNavigationPath(window.location.pathname);
  const phaseState: Web_App_App_PhaseState = useState<Web_App_App_Phase>('loading');
  const phase: Web_App_App_Phase = phaseState[0];
  const setPhase: Web_App_App_SetPhase = phaseState[1];
  const usernameState: Web_App_App_UsernameState = useState<Web_App_App_Username>('');
  const username: Web_App_App_Username = usernameState[0];
  const setUsername: Web_App_App_SetUsername = usernameState[1];
  const activeRouteState: Web_App_App_ActiveRouteState = useState<Web_App_App_ActiveRoute>(initialNavigation['route']);
  const activeRoute: Web_App_App_ActiveRoute = activeRouteState[0];
  const setActiveRoute: Web_App_App_SetActiveRoute = activeRouteState[1];
  const activeView: Web_Components_View = activeRoute['view'];
  const overviewState: Web_App_App_OverviewState = useState<Web_App_App_Overview>(null);
  const overview: Web_App_App_Overview = overviewState[0];
  const setOverview: Web_App_App_SetOverview = overviewState[1];
  const overviewErrorState: Web_App_App_OverviewErrorState = useState<Web_App_App_OverviewError>(null);
  const overviewError: Web_App_App_OverviewError = overviewErrorState[0];
  const setOverviewError: Web_App_App_SetOverviewError = overviewErrorState[1];
  const containersState: Web_App_App_ContainersState = useState<Web_App_App_Containers>(null);
  const containers: Web_App_App_Containers = containersState[0];
  const setContainers: Web_App_App_SetContainers = containersState[1];
  const containersErrorState: Web_App_App_ContainersErrorState = useState<Web_App_App_ContainersError>(null);
  const containersError: Web_App_App_ContainersError = containersErrorState[0];
  const setContainersError: Web_App_App_SetContainersError = containersErrorState[1];
  const historyState: Web_App_App_HistoryState = useState<Web_App_App_History>(null);
  const history: Web_App_App_History = historyState[0];
  const setHistory: Web_App_App_SetHistory = historyState[1];
  const historyErrorState: Web_App_App_HistoryErrorState = useState<Web_App_App_HistoryError>(null);
  const historyError: Web_App_App_HistoryError = historyErrorState[0];
  const setHistoryError: Web_App_App_SetHistoryError = historyErrorState[1];
  const settingsState: Web_App_App_SettingsState = useState<Web_App_App_Settings>(null);
  const settings: Web_App_App_Settings = settingsState[0];
  const setSettings: Web_App_App_SetSettings = settingsState[1];
  const settingsErrorState: Web_App_App_SettingsErrorState = useState<Web_App_App_SettingsError>(null);
  const settingsError: Web_App_App_SettingsError = settingsErrorState[0];
  const setSettingsError: Web_App_App_SetSettingsError = settingsErrorState[1];
  const tokensState: Web_App_App_TokensState = useState<Web_App_App_Tokens>([]);
  const tokens: Web_App_App_Tokens = tokensState[0];
  const setTokens: Web_App_App_SetTokens = tokensState[1];
  const removedSecretsState: Web_App_App_RemovedSecretsState = useState<Web_App_App_RemovedSecrets>([]);
  const removedSecrets: Web_App_App_RemovedSecrets = removedSecretsState[0];
  const setRemovedSecrets: Web_App_App_SetRemovedSecrets = removedSecretsState[1];
  const startupErrorState: Web_App_App_StartupErrorState = useState<Web_App_App_StartupError>('');
  const startupError: Web_App_App_StartupError = startupErrorState[0];
  const setStartupError: Web_App_App_SetStartupError = startupErrorState[1];
  const streamAttemptState: Web_App_App_StreamAttemptState = useState<Web_App_App_StreamAttempt>(0);
  const streamAttempt: Web_App_App_StreamAttempt = streamAttemptState[0];
  const setStreamAttempt: Web_App_App_SetStreamAttempt = streamAttemptState[1];
  const wasRunning: Web_App_App_WasRunning = useRef(false);

  /**
   * App - Reset Session.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @returns {Web_App_App_ResetSession_Returns}
   *
   * @since 1.0.0
   */
  const resetSession: Web_App_App_ResetSession = (): Web_App_App_ResetSession_Returns => {
    setUsername('');
    setOverview(null);
    setOverviewError(null);
    setContainers(null);
    setContainersError(null);
    setHistory(null);
    setHistoryError(null);
    setSettings(null);
    setSettingsError(null);
    setTokens([]);
    setRemovedSecrets([]);
    setPhase('login');

    return;
  };

  // A request that finds the session gone sends the browser back to sign-in.

  /**
   * App - Guard.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @param {Web_App_App_Guard_Action} action - Action.
   *
   * @returns {Web_App_App_Guard_Returns}
   *
   * @since 1.0.0
   */
  const guard: Web_App_App_Guard = async (action: Web_App_App_Guard_Action): Web_App_App_Guard_Returns => {
    try {
      await action();
    } catch (caughtError) {
      if (caughtError instanceof ApiError && caughtError.status === 401) {
        resetSession();

        return;
      }

      throw caughtError;
    }

    return;
  };

  // Each screen keeps its last data and shows a failed load next to it.

  /**
   * App - Load.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @param {Web_App_App_Load_Action}  action  - Action.
   * @param {Web_App_App_Load_OnError} onError - On error.
   *
   * @returns {Web_App_App_Load_Returns}
   *
   * @since 1.0.0
   */
  const load: Web_App_App_Load = async (action: Web_App_App_Load_Action, onError: Web_App_App_Load_OnError): Web_App_App_Load_Returns => guard(async () => {
    try {
      await action();

      onError(null);
    } catch (caughtError) {
      if (caughtError instanceof ApiError && caughtError.status === 401) {
        throw caughtError;
      }

      onError(caughtError);
    }

    return;
  });

  /**
   * App - Load Overview.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @returns {Web_App_App_LoadOverview_Returns}
   *
   * @since 1.0.0
   */
  const loadOverview: Web_App_App_LoadOverview = async (): Web_App_App_LoadOverview_Returns => load(async () => {
    setOverview(await getOverview());

    return;
  }, setOverviewError);

  /**
   * App - Load Containers.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @returns {Web_App_App_LoadContainers_Returns}
   *
   * @since 1.0.0
   */
  const loadContainers: Web_App_App_LoadContainers = async (): Web_App_App_LoadContainers_Returns => load(async () => {
    setContainers(await getContainers());

    return;
  }, setContainersError);

  /**
   * App - Load History.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @returns {Web_App_App_LoadHistory_Returns}
   *
   * @since 1.0.0
   */
  const loadHistory: Web_App_App_LoadHistory = async (): Web_App_App_LoadHistory_Returns => load(async () => {
    setHistory(await getHistory());

    return;
  }, setHistoryError);

  /**
   * App - Load Settings.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @returns {Web_App_App_LoadSettings_Returns}
   *
   * @since 1.0.0
   */
  const loadSettings: Web_App_App_LoadSettings = async (): Web_App_App_LoadSettings_Returns => load(async () => {
    setSettings(await getSettings());

    return;
  }, setSettingsError);

  /**
   * App - Save Settings.
   *
   * Persists runtime behavior and refreshes the overview with the new schedule and mode.
   * The settings view receives the canonical document returned by the server.
   *
   * @param {Web_App_App_SaveSettings_Input} input - Input.
   *
   * @returns {Web_App_App_SaveSettings_Returns}
   *
   * @since 1.0.0
   */
  const saveSettings: Web_App_App_SaveSettings = async (input: Web_App_App_SaveSettings_Input): Web_App_App_SaveSettings_Returns => {
    const nextSettings: Web_App_App_SaveSettings_NextSettings = await updateSettings(input);

    setSettings(nextSettings);

    await loadOverview();

    return nextSettings;
  };

  /**
   * App - Load Tokens.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @returns {Web_App_App_LoadTokens_Returns}
   *
   * @since 1.0.0
   */
  const loadTokens: Web_App_App_LoadTokens = async (): Web_App_App_LoadTokens_Returns => guard(async () => {
    setTokens(await getTokens());

    return;
  });

  // The notice shrinks as secrets are entered again, so the list is read again after each one.

  /**
   * App - Load Removed Secrets.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @returns {Web_App_App_LoadRemovedSecrets_Returns}
   *
   * @since 1.0.0
   */
  const loadRemovedSecrets: Web_App_App_LoadRemovedSecrets = async (): Web_App_App_LoadRemovedSecrets_Returns => guard(async () => {
    const principal: Web_App_App_LoadRemovedSecrets_Principal = await getCurrentPrincipal();

    if (principal === null) {
      resetSession();

      return;
    }

    setRemovedSecrets(principal['removedSecrets'] ?? []);

    return;
  });

  /**
   * App - Apply App Route.
   *
   * Keeps the rendered page synchronized with a resolved browser address.
   * Browser Back and Forward reuse this transition without pushing history.
   *
   * @param {Web_App_App_ApplyAppRoute_Route} route - Route.
   *
   * @returns {Web_App_App_ApplyAppRoute_Returns}
   *
   * @since 1.1.0
   */
  const applyAppRoute: Web_App_App_ApplyAppRoute = (route: Web_App_App_ApplyAppRoute_Route): Web_App_App_ApplyAppRoute_Returns => {
    setActiveRoute(route);

    window.scrollTo(0, 0);

    return;
  };

  useEffect(() => startNavigationHistory(
    window,
    resolveAppNavigationPath,
    applyAppRoute,
  ), []);

  /**
   * App - Enter Application.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @returns {Web_App_App_EnterApplication_Returns}
   *
   * @since 1.0.0
   */
  const enterApplication: Web_App_App_EnterApplication = async (): Web_App_App_EnterApplication_Returns => {
    const principal: Web_App_App_EnterApplication_Principal = await getCurrentPrincipal();

    if (principal === null || principal['authenticationType'] !== 'session') {
      setPhase('login');

      return;
    }

    setUsername(principal['username'] ?? 'Administrator');
    setRemovedSecrets(principal['removedSecrets'] ?? []);
    applyNavigationPath(
      window,
      resolveAppNavigationPath,
      applyAppRoute,
    );
    setPhase('application');

    await Promise.all([
      loadOverview(),
      loadContainers(),
      loadTokens(),
    ]);

    return;
  };

  useEffect(() => {
    /**
     * App - Bootstrap.
     *
     * Centralizes this operation for the surrounding workflow.
     * Callers reuse one implementation instead of repeating the behavior.
     *
     * @returns {Web_App_App_Bootstrap_Returns}
     *
     * @since 1.0.0
     */
    const bootstrap: Web_App_App_Bootstrap = async (): Web_App_App_Bootstrap_Returns => {
      setStartupError('');

      try {
        const setupStatus: Web_App_App_Bootstrap_SetupStatus = await getSetupStatus();

        if (setupStatus['claimRequired'] === true) {
          setPhase('claim');

          return;
        }

        await enterApplication();
      } catch (caughtError) {
        setStartupError((caughtError instanceof Error) ? caughtError.message : 'The dashboard could not be loaded.');
      }

      return;
    };

    void bootstrap();

    return;
  }, []);

  useEffect(() => {
    if (phase !== 'application') {
      return;
    }

    if (activeRoute['view'] === 'history') {
      void loadHistory();
    } else if (activeRoute['view'] === 'settings') {
      void loadSettings();
    }

    return;
  }, [
    activeRoute,
    phase,
  ]);

  // The overview follows the scheduler live, and each finished check lands in the history.
  useEffect(() => {
    if (phase !== 'application') {
      return undefined;
    }

    let retryTimer: Web_App_App_RetryTimer = undefined;

    /**
     * App - Retry.
     *
     * Centralizes this operation for the surrounding workflow.
     * Callers reuse one implementation instead of repeating the behavior.
     *
     * @returns {Web_App_App_Retry_Returns}
     *
     * @since 1.0.0
     */
    const retry: Web_App_App_Retry = (): Web_App_App_Retry_Returns => {
      retryTimer = window.setTimeout(() => setStreamAttempt((attempt) => attempt + 1), reconnectDelay);

      return;
    };

    const closeEvents: Web_App_App_CloseEvents = connectEvents({
      onCheck: (report) => {
        setHistory((current) => {
          if (current === null) {
            return current;
          }

          if (current.some((candidate) => candidate['startedAt'] === report['startedAt'] && candidate['finishedAt'] === report['finishedAt']) === true) {
            return current;
          }

          return [
            report,
            ...current,
          ].slice(0, 50);
        });

        return;
      },
      onClosed: () => {
        // The stream only stops for good when the session is gone; otherwise it opens again shortly.
        void getCurrentPrincipal().then((principal) => {
          if (principal === null) {
            resetSession();

            return;
          }

          retry();

          return;
        }).catch(() => retry());

        return;
      },
      onReconnect: () => {
        void loadContainers();
        void loadHistory();

        return;
      },
      onState: (nextOverview) => {
        setOverview(nextOverview);
        setOverviewError(null);

        return;
      },
    });

    return () => {
      closeEvents();

      window.clearTimeout(retryTimer);

      return;
    };
  }, [
    phase,
    streamAttempt,
  ]);

  const running: Web_App_App_Running = overview !== null && overview['running'] === true;

  useEffect(() => {
    if (running === false) {
      return undefined;
    }

    const timer: Web_App_App_Timer = window.setInterval(() => {
      void loadOverview();

      return;
    }, runningPollInterval);

    return () => window.clearInterval(timer);
  }, [running]);

  // A finished check changes every container's last result, and the history if the stream missed it.
  useEffect(() => {
    if (wasRunning.current === true && running === false) {
      void loadContainers();

      const latestReport: Web_App_App_LatestReport = (history !== null) ? history[0] : undefined;
      const latestReportFinishedAt: Web_App_App_LatestReportFinishedAt = (latestReport !== undefined) ? latestReport['finishedAt'] : undefined;
      const lastReport: Web_App_App_LastReport = (overview !== null) ? overview['lastReport'] : undefined;
      const lastReportFinishedAt: Web_App_App_LastReportFinishedAt = (lastReport !== undefined && lastReport !== null) ? lastReport['finishedAt'] : undefined;

      if (history !== null && latestReportFinishedAt !== lastReportFinishedAt) {
        void loadHistory();
      }
    }

    wasRunning.current = running;

    return;
  }, [running]);

  /**
   * App - Run Check.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @param {Web_App_App_RunCheck_ContainerId} [containerId] - Container id.
   *
   * @returns {Web_App_App_RunCheck_Returns}
   *
   * @since 1.0.0
   */
  const runCheck: Web_App_App_RunCheck = async (containerId?: Web_App_App_RunCheck_ContainerId): Web_App_App_RunCheck_Returns => guard(async () => {
    await startCheck(containerId);
    await loadOverview();

    return;
  });

  /**
   * App - Run Update.
   *
   * Starts an apply cycle for all managed containers or one selected container.
   * Reloading the overview exposes the scheduler lock immediately.
   *
   * @param {Web_App_App_RunUpdate_ContainerId} [containerId] - Container id.
   * @param {Web_App_App_RunUpdate_Rollback}    [rollback]    - Rollback.
   *
   * @returns {Web_App_App_RunUpdate_Returns}
   *
   * @since 1.1.0
   */
  const runUpdate: Web_App_App_RunUpdate = async (containerId?: Web_App_App_RunUpdate_ContainerId, rollback: Web_App_App_RunUpdate_Rollback = true): Web_App_App_RunUpdate_Returns => guard(async () => {
    await startUpdate(containerId, rollback);
    await loadOverview();

    return;
  });

  /**
   * App - Open Route.
   *
   * Pushes browser history, applies the selected page, and keeps each page's
   * existing refresh behavior when navigation comes from the interface.
   *
   * @param {Web_App_App_OpenRoute_Route} route - Route.
   *
   * @returns {Web_App_App_OpenRoute_Returns}
   *
   * @since 1.1.0
   */
  const openRoute: Web_App_App_OpenRoute = (route: Web_App_App_OpenRoute_Route): Web_App_App_OpenRoute_Returns => {
    pushNavigationPath(window, route['path']);
    applyAppRoute(route);

    if (route['view'] === 'overview') {
      void loadOverview();
      void loadContainers();
    } else if (route['view'] === 'containers') {
      void loadContainers();
    } else if (route['view'] === 'access') {
      void loadTokens();
    }

    return;
  };

  /**
   * App - Open View.
   *
   * Resolves shell destinations through the app-owned path table before the
   * shared History API transition runs.
   *
   * @param {Web_App_App_OpenView_View} view - View.
   *
   * @returns {Web_App_App_OpenView_Returns}
   *
   * @since 1.1.0
   */
  const openView: Web_App_App_OpenView = (view: Web_App_App_OpenView_View): Web_App_App_OpenView_Returns => {
    openRoute(appRouteForView(view));

    return;
  };

  /**
   * App - Sign Out.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @returns {Web_App_App_SignOut_Returns}
   *
   * @since 1.0.0
   */
  const signOut: Web_App_App_SignOut = async (): Web_App_App_SignOut_Returns => {
    try {
      await logout();
    } finally {
      const rootNavigation: Web_AppNavigation_PathMatch = resolveAppNavigationPath('/');

      replaceNavigationPath(window, rootNavigation['path']);
      applyAppRoute(rootNavigation['route']);
      resetSession();
    }

    return;
  };

  if (phase === 'loading') {
    return (
      <main className="startup-screen">
        <BrandMark />
        <span className="spinner" />
        <strong>Opening Outpost</strong>
        {(startupError === '') ? null : <p role="alert">{startupError}</p>}
      </main>
    );
  }

  if (phase === 'claim' || phase === 'login') {
    return <AuthenticationScreen mode={phase} onSignedIn={enterApplication} />;
  }

  /**
   * App - Render View.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @returns {Web_App_App_RenderView_Returns}
   *
   * @since 1.0.0
   */
  const renderView: Web_App_App_RenderView = (): Web_App_App_RenderView_Returns => {
    switch (activeView) {
      case 'access': {
        return (
          <AccessView
            onCreateToken={async (input) => {
              const nextToken: Web_Api_CreatedToken = await createToken(input);

              await loadTokens();

              return nextToken;
            }}
            onRevokeToken={async (tokenId) => {
              await revokeToken(tokenId);
              await loadTokens();

              return;
            }}
            onUpdateToken={async (tokenId, input) => {
              await updateToken(tokenId, input);
              await loadTokens();

              return;
            }}
            tokens={tokens}
          />
        );
      }

      case 'containers': {
        return (
          <ContainersView
            containers={containers}
            error={containersError}
            onRefresh={loadContainers}
            onStartCheck={runCheck}
            onStartUpdate={runUpdate}
            overview={overview}
          />
        );
      }

      case 'history': {
        return <HistoryView error={historyError} history={history} onRefresh={loadHistory} />;
      }

      case 'notifications': {
        return (
          <NotificationsView
            interpreter="outpost"
            onChange={() => {
              void loadRemovedSecrets();

              return;
            }}
          />
        );
      }

      case 'security': {
        return (
          <SecurityView
            onAuthenticatorEnabled={() => {
              void loadRemovedSecrets();

              return;
            }}
            onUsernameChanged={setUsername}
          />
        );
      }

      case 'settings': {
        return (
          <SettingsView
            error={settingsError}
            onImported={async () => {
              await Promise.all([
                loadSettings(),
                loadTokens(),
                loadRemovedSecrets(),
              ]);

              return;
            }}
            onSave={saveSettings}
            settings={settings}
          />
        );
      }

      default: {
        return (
          <OverviewView
            containers={containers}
            error={overviewError}
            onOpenContainers={() => openView('containers')}
            onOpenHistory={() => openView('history')}
            onStartCheck={runCheck}
            onStartUpdate={runUpdate}
            overview={overview}
          />
        );
      }
    }
  };

  const lastRemovedSecret: Web_App_App_LastRemovedSecret = removedSecrets.at(-1);
  const removedAt: Web_App_App_RemovedAt = (lastRemovedSecret !== undefined) ? lastRemovedSecret['removedAt'] : '';
  const notice: Web_App_App_Notice = (removedSecrets.length === 0) ? null : (
    <KeyNotice
      appName="Outpost"
      items={removedSecrets.map((removedSecret) => {
        const removedSecretTarget: Web_App_App_RemovedSecretTarget = (
          removedSecret['notificationId']
          ?? removedSecret['registryId']
          ?? ''
        );

        return {
          id: `${removedSecret['kind']}:${removedSecretTarget}`,
          label: describeRemovedSecret(removedSecret)['label'],
          onOpen: () => openView(describeRemovedSecret(removedSecret)['view']),
        };
      })}
      keyName="encryption key"
      onDismiss={async () => {
        await dismissRemovedSecrets();

        setRemovedSecrets([]);

        return;
      }}
      removedAt={removedAt}
    />
  );
  const dockerUnreachable: Web_App_App_DockerUnreachable = containersError instanceof ApiError && containersError.code === 'docker_unreachable';
  const schedulerStatus: Web_Components_SchedulerStatus = describeScheduler(overview, dockerUnreachable);
  const shellStatus: Web_Components_ShellStatus = {
    ...schedulerStatus,
    onOpen: () => openView('overview'),
  };

  return (
    <AppShell
      activeView={activeView}
      notice={notice}
      onLogout={() => {
        void signOut();

        return;
      }}
      onViewChange={openView}
      status={shellStatus}
      username={username}
    >
      {renderView()}
    </AppShell>
  );
};

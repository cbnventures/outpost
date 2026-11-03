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
  updateSettings,
  updateToken,
} from '@/web/api.ts';
import { AppShell } from '@/web/app-shell.tsx';
import { AuthenticationScreen } from '@/web/auth-screen.tsx';
import { ContainersView } from '@/web/containers-view.tsx';
import { HistoryView } from '@/web/history-view.tsx';
import { KeyNotice } from '@/web/key-notice.tsx';
import { NotificationsView } from '@/web/notifications-view.tsx';
import { OverviewView } from '@/web/overview-view.tsx';
import { BrandMark } from '@/web/primitives.tsx';
import { SecurityView } from '@/web/security-view.tsx';
import { SettingsView } from '@/web/settings-view.tsx';

import type {
  MutableRefObject,
  ReactElement,
} from 'react';

import type {
  Web_Api_Container,
  Web_Api_CreatedToken,
  Web_Api_CreateTokenInput,
  Web_Api_Overview,
  Web_Api_Principal,
  Web_Api_RemovedSecret,
  Web_Api_Report,
  Web_Api_Settings,
  Web_Api_Token,
  Web_Api_UpdateSettingsInput,
  Web_Api_UpdateTokenInput,
} from '@/types/web/api.d.ts';
import type {
  Web_App_Phase,
  Web_App_RemovedSecretAction,
} from '@/types/web/app.d.ts';
import type { Web_Components_View } from '@/types/web/components.d.ts';

// How long to wait before opening the event stream again after it closed.

/**
 * App - Reconnect delay.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
const reconnectDelay: number = 5000;

// How often the overview is fetched while a check runs, in case a proxy holds back the event stream.

/**
 * App - Running poll interval.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
const runningPollInterval: number = 5000;

// What each secret removed with a lost key asks for, and the page where it is entered again.

/**
 * App - Describe removed secret.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 1.0.0
 */
const describeRemovedSecret = (removedSecret: Web_Api_RemovedSecret): Web_App_RemovedSecretAction => {
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
 * App.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 1.0.0
 */
export const App = (): ReactElement => {
  const [
    phase,
    setPhase,
  ] = useState<Web_App_Phase>('loading');
  const [
    username,
    setUsername,
  ] = useState<string>('');
  const [
    activeView,
    setActiveView,
  ] = useState<Web_Components_View>('overview');
  const [
    overview,
    setOverview,
  ] = useState<Web_Api_Overview | null>(null);
  const [
    overviewError,
    setOverviewError,
  ] = useState<unknown>(null);
  const [
    containers,
    setContainers,
  ] = useState<Web_Api_Container[] | null>(null);
  const [
    containersError,
    setContainersError,
  ] = useState<unknown>(null);
  const [
    history,
    setHistory,
  ] = useState<Web_Api_Report[] | null>(null);
  const [
    historyError,
    setHistoryError,
  ] = useState<unknown>(null);
  const [
    settings,
    setSettings,
  ] = useState<Web_Api_Settings | null>(null);
  const [
    settingsError,
    setSettingsError,
  ] = useState<unknown>(null);
  const [
    tokens,
    setTokens,
  ] = useState<Web_Api_Token[]>([]);
  const [
    createdToken,
    setCreatedToken,
  ] = useState<Web_Api_CreatedToken | null>(null);
  const [
    removedSecrets,
    setRemovedSecrets,
  ] = useState<Web_Api_RemovedSecret[]>([]);
  const [
    startupError,
    setStartupError,
  ] = useState<string>('');
  const [
    streamAttempt,
    setStreamAttempt,
  ] = useState<number>(0);
  const wasRunning: MutableRefObject<boolean> = useRef<boolean>(false);

  /**
   * App - Reset session.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @since 1.0.0
   */
  const resetSession = (): void => {
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
    setCreatedToken(null);
    setRemovedSecrets([]);
    setActiveView('overview');
    setPhase('login');
  };

  // A request that finds the session gone sends the browser back to sign-in.

  /**
   * App - Guard.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @since 1.0.0
   */
  const guard = async (action: () => Promise<void>): Promise<void> => {
    try {
      await action();
    } catch (caughtError) {
      if (caughtError instanceof ApiError && caughtError.status === 401) {
        resetSession();

        return;
      }

      throw caughtError;
    }
  };

  // Each screen keeps its last data and shows a failed load next to it.

  /**
   * App - Load.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @since 1.0.0
   */
  const load = async (action: () => Promise<void>, onError: (error: unknown) => void): Promise<void> => guard(async (): Promise<void> => {
    try {
      await action();
      onError(null);
    } catch (caughtError) {
      if (caughtError instanceof ApiError && caughtError.status === 401) {
        throw caughtError;
      }

      onError(caughtError);
    }
  });

  /**
   * App - Loads overview.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @since 1.0.0
   */
  const loadOverview = async (): Promise<void> => load(async (): Promise<void> => {
    setOverview(await getOverview());
  }, setOverviewError);

  /**
   * App - Loads containers.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @since 1.0.0
   */
  const loadContainers = async (): Promise<void> => load(async (): Promise<void> => {
    setContainers(await getContainers());
  }, setContainersError);

  /**
   * App - Loads history.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @since 1.0.0
   */
  const loadHistory = async (): Promise<void> => load(async (): Promise<void> => {
    setHistory(await getHistory());
  }, setHistoryError);

  /**
   * App - Loads settings.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @since 1.0.0
   */
  const loadSettings = async (): Promise<void> => load(async (): Promise<void> => {
    setSettings(await getSettings());
  }, setSettingsError);

  /**
   * App - Saves settings.
   *
   * Persists runtime behavior and refreshes the overview with the new schedule and mode.
   * The settings view receives the canonical document returned by the server.
   *
   * @since 1.0.0
   */
  const saveSettings = async (input: Web_Api_UpdateSettingsInput): Promise<Web_Api_Settings> => {
    const nextSettings: Web_Api_Settings = await updateSettings(input);

    setSettings(nextSettings);
    await loadOverview();

    return nextSettings;
  };

  /**
   * App - Loads tokens.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @since 1.0.0
   */
  const loadTokens = async (): Promise<void> => guard(async (): Promise<void> => {
    setTokens(await getTokens());
  });

  // The notice shrinks as secrets are entered again, so the list is read again after each one.

  /**
   * App - Loads removed secrets.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @since 1.0.0
   */
  const loadRemovedSecrets = async (): Promise<void> => guard(async (): Promise<void> => {
    const principal: Web_Api_Principal | null = await getCurrentPrincipal();
    if (principal === null) {
      resetSession();

      return;
    }

    setRemovedSecrets(principal['removedSecrets'] ?? []);
  });

  /**
   * App - Enter application.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @since 1.0.0
   */
  const enterApplication = async (): Promise<void> => {
    const principal: Web_Api_Principal | null = await getCurrentPrincipal();
    if (principal === null || principal['authenticationType'] !== 'session') {
      setPhase('login');

      return;
    }

    setUsername(principal['username'] ?? 'Administrator');
    setRemovedSecrets(principal['removedSecrets'] ?? []);
    setPhase('application');

    await Promise.all([
      loadOverview(),
      loadContainers(),
      loadTokens(),
    ]);
  };

  useEffect((): void => {
    /**
     * App - Bootstrap.
     *
     * Centralizes this operation for the surrounding workflow.
     * Callers reuse one implementation instead of repeating the behavior.
     *
     * @since 1.0.0
     */
    const bootstrap = async (): Promise<void> => {
      setStartupError('');
      try {
        const setupStatus = await getSetupStatus();
        if (setupStatus['claimRequired']) {
          setPhase('claim');

          return;
        }

        await enterApplication();
      } catch (caughtError) {
        setStartupError((caughtError instanceof Error) ? caughtError.message : 'The dashboard could not be loaded.');
      }
    };

    void bootstrap();
  }, []);

  // The overview follows the scheduler live, and each finished check lands in the history.
  useEffect((): (() => void) | undefined => {
    if (phase !== 'application') {
      return undefined;
    }

    let retryTimer: number | undefined = undefined;

    /**
     * App - Retry.
     *
     * Centralizes this operation for the surrounding workflow.
     * Callers reuse one implementation instead of repeating the behavior.
     *
     * @since 1.0.0
     */
    const retry = (): void => {
      retryTimer = window.setTimeout((): void => setStreamAttempt((attempt: number): number => attempt + 1), reconnectDelay);
    };

    const closeEvents = connectEvents({
      onCheck: (report: Web_Api_Report): void => {
        setHistory((current: Web_Api_Report[] | null): Web_Api_Report[] | null => {
          if (current === null || current.some((candidate: Web_Api_Report): boolean => candidate['startedAt'] === report['startedAt'] && candidate['finishedAt'] === report['finishedAt'])) {
            return current;
          }

          return [
            report,
            ...current,
          ].slice(0, 50);
        });
      },
      onClosed: (): void => {
        // The stream only stops for good when the session is gone; otherwise it opens again shortly.
        void getCurrentPrincipal().then((principal: Web_Api_Principal | null): void => {
          if (principal === null) {
            resetSession();

            return;
          }

          retry();
        }).catch((): void => retry());
      },
      onReconnect: (): void => {
        void loadContainers();
        void loadHistory();
      },
      onState: (nextOverview: Web_Api_Overview): void => {
        setOverview(nextOverview);
        setOverviewError(null);
      },
    });

    return (): void => {
      closeEvents();
      window.clearTimeout(retryTimer);
    };
  }, [
    phase,
    streamAttempt,
  ]);

  const running: boolean = overview !== null && overview['running'];

  useEffect((): (() => void) | undefined => {
    if (!running) {
      return undefined;
    }

    const timer: number = window.setInterval((): void => {
      void loadOverview();
    }, runningPollInterval);

    return (): void => window.clearInterval(timer);
  }, [running]);

  // A finished check changes every container's last result, and the history if the stream missed it.
  useEffect((): void => {
    if (wasRunning.current && !running) {
      void loadContainers();

      if (history !== null && history[0]?.['finishedAt'] !== overview?.['lastReport']?.['finishedAt']) {
        void loadHistory();
      }
    }

    wasRunning.current = running;
  }, [running]);

  /**
   * App - Run check.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @since 1.0.0
   */
  const runCheck = async (containerId?: string): Promise<void> => guard(async (): Promise<void> => {
    await startCheck(containerId);
    await loadOverview();
  });

  /**
   * App - Opens view.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @since 1.0.0
   */
  const openView = (view: Web_Components_View): void => {
    setActiveView(view);
    window.scrollTo(0, 0);

    if (view === 'overview') {
      void loadOverview();
      void loadContainers();
    } else if (view === 'containers') {
      void loadContainers();
    } else if (view === 'history') {
      void loadHistory();
    } else if (view === 'settings') {
      void loadSettings();
    } else if (view === 'access') {
      void loadTokens();
    }
  };

  /**
   * App - Sign out.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @since 1.0.0
   */
  const signOut = async (): Promise<void> => {
    try {
      await logout();
    } finally {
      resetSession();
    }
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
   * App - Renders view.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @since 1.0.0
   */
  const renderView = (): ReactElement => {
    switch (activeView) {
      case 'access': {
        return (
          <AccessView
            createdToken={createdToken}
            onCreateToken={async (input: Web_Api_CreateTokenInput): Promise<void> => {
              const nextToken: Web_Api_CreatedToken = await createToken(input);

              setCreatedToken(nextToken);
              await loadTokens();
            }}
            onDismissCreatedToken={(): void => setCreatedToken(null)}
            onRevokeToken={async (tokenId: string): Promise<void> => {
              await revokeToken(tokenId);
              await loadTokens();
            }}
            onUpdateToken={async (tokenId: string, input: Web_Api_UpdateTokenInput): Promise<void> => {
              await updateToken(tokenId, input);
              await loadTokens();
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
            onChange={(): void => {
              void loadRemovedSecrets();
            }}
          />
        );
      }
      case 'security': {
        return (
          <SecurityView
            onAuthenticatorEnabled={(): void => {
              void loadRemovedSecrets();
            }}
            onUsernameChanged={setUsername}
          />
        );
      }
      case 'settings': {
        return <SettingsView error={settingsError} onSave={saveSettings} settings={settings} />;
      }
      default: {
        return (
          <OverviewView
            containers={containers}
            error={overviewError}
            onOpenContainers={(): void => openView('containers')}
            onOpenHistory={(): void => openView('history')}
            onStartCheck={runCheck}
            overview={overview}
          />
        );
      }
    }
  };

  const notice: ReactElement | null = (removedSecrets.length === 0) ? null : (
    <KeyNotice
      appName="Outpost"
      items={removedSecrets.map((removedSecret: Web_Api_RemovedSecret) => ({
        id: `${removedSecret['kind']}:${removedSecret['notificationId'] ?? removedSecret['registryId'] ?? ''}`,
        label: describeRemovedSecret(removedSecret)['label'],
        onOpen: (): void => openView(describeRemovedSecret(removedSecret)['view']),
      }))}
      keyName="encryption key"
      onDismiss={async (): Promise<void> => {
        await dismissRemovedSecrets();
        setRemovedSecrets([]);
      }}
      removedAt={removedSecrets.at(-1)?.['removedAt'] ?? ''}
    />
  );

  return (
    <AppShell
      activeView={activeView}
      dockerUnreachable={containersError instanceof ApiError && containersError.code === 'docker_unreachable'}
      notice={notice}
      onLogout={(): void => {
        void signOut();
      }}
      onViewChange={openView}
      overview={overview}
      username={username}
    >
      {renderView()}
    </AppShell>
  );
};

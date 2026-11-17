import {
  describe,
  expect,
  it,
} from 'vitest';

import {
  appNavigationItems,
  appNavigationPaths,
  appRouteForView,
  resolveAppNavigationPath,
} from '@/web/app-navigation.ts';
import {
  applyNavigationPath,
  closeNavSheetStack,
  createMoreNavSheetLevel,
  createNavSheetLevel,
  firstNavigationView,
  navigationItemHasSheet,
  navigationItemHoldsView,
  openNavSheetStack,
  PHONE_TABS,
  phoneNavigationLabel,
  phoneTabs,
  popNavSheetStack,
  pushNavigationPath,
  pushNavSheetStack,
  startNavigationHistory,
  visibleNavigationItems,
} from '@/web/navigation.ts';

import type { Web_AppNavigation_Route } from '@/types/web/app-navigation.d.ts';
import type {
  Web_Navigation_Browser,
  Web_Navigation_HistoryURL,
  Web_Navigation_Location,
  Web_Navigation_PopStateListener,
} from '@/types/web/navigation.d.ts';
import type {
  Web_Navigation_DashboardNavigation_KeepsDesktopAndPhoneDestinationsAligned_MoreGroup,
  Web_Navigation_DashboardNavigation_KeepsDesktopAndPhoneDestinationsAligned_MoreLevel,
  Web_Navigation_DashboardNavigation_KeepsDesktopAndPhoneDestinationsAligned_Tabs,
  Web_Navigation_DashboardNavigation_MarksAParentCurrentForDeclaredChildViews_Item,
  Web_Navigation_DashboardNavigation_OpensAGroupAtTheFirstPageCurrentRoleCanUse_GroupedItem,
  Web_Navigation_DashboardNavigation_OpensAGroupAtTheFirstPageCurrentRoleCanUse_VisibleGroup,
  Web_Navigation_DashboardNavigation_OpensAGroupAtTheFirstPageCurrentRoleCanUse_VisibleItems,
  Web_Navigation_DashboardNavigation_OpensAGroupAtTheFirstPageCurrentRoleCanUse_VisibleLevel,
  Web_Navigation_DashboardNavigation_OpensAGroupAtTheFirstPageCurrentRoleCanUse_VisibleSheetGroup,
  Web_Navigation_DashboardNavigation_UsesShortLabelsOnlyInPhoneBar_Item,
  Web_Navigation_HistoryFixture,
  Web_Navigation_HistoryPosition,
  Web_Navigation_NavigationSheetStack_OpensPushesPopsAndClosesWithoutMutation_ChildLevel,
  Web_Navigation_NavigationSheetStack_OpensPushesPopsAndClosesWithoutMutation_GroupedItem,
  Web_Navigation_NavigationSheetStack_OpensPushesPopsAndClosesWithoutMutation_MoreLevel,
  Web_Navigation_NavigationSheetStack_OpensPushesPopsAndClosesWithoutMutation_PushedStack,
  Web_Navigation_NavigationSheetStack_OpensPushesPopsAndClosesWithoutMutation_RootStack,
  Web_Navigation_RouteState,
} from '@/types/web/navigation.test.d.ts';

/**
 * Web - Navigation Test - Path From History URL.
 *
 * Normalizes the URL shapes accepted by History API calls for the in-memory
 * browser fixture. Relative strings resolve against a stable test origin.
 *
 * @param {Web_Navigation_HistoryURL} url         - Url.
 * @param {string}                    currentPath - Current path.
 *
 * @returns {string}
 *
 * @since 1.1.0
 */
const pathFromHistoryURL = (
  url: Web_Navigation_HistoryURL,
  currentPath: string,
): string => {
  if (url === undefined || url === null) {
    return currentPath;
  }

  if (url instanceof URL) {
    return url.pathname;
  }

  return new URL(url, 'http://navigation.test').pathname;
};

/**
 * Web - Navigation Test - Create History Browser.
 *
 * Provides the shared navigation helpers with a deterministic browser history.
 * Tests can move Back and Forward without depending on a DOM environment.
 *
 * @param {string} initialPath - Initial path.
 *
 * @returns {Web_Navigation_HistoryFixture}
 *
 * @since 1.1.0
 */
const createHistoryBrowser = (initialPath: string): Web_Navigation_HistoryFixture => {
  const entries: string[] = [initialPath];
  const position: Web_Navigation_HistoryPosition = { value: 0 };
  const listeners: Set<Web_Navigation_PopStateListener> = new Set<Web_Navigation_PopStateListener>();
  const location: Web_Navigation_Location = { pathname: initialPath };

  /**
   * Web - Navigation Test - Create History Browser - Move.
   *
   * Moves to an existing entry and emits the browser's popstate notification.
   * Attempts beyond either end of the history list leave state unchanged.
   *
   * @param {number} direction - Direction.
   *
   * @since 1.1.0
   */
  const move = (direction: number): void => {
    const nextPosition: number = position['value'] + direction;
    if (nextPosition < 0 || nextPosition >= entries.length) {
      return;
    }

    const nextPath: string | undefined = entries.at(nextPosition);
    if (nextPath === undefined) {
      return;
    }

    position.value = nextPosition;
    location.pathname = nextPath;
    for (const listener of listeners) {
      listener();
    }

    return;
  };

  const browser: Web_Navigation_Browser = {
    addEventListener: (_type, listener): void => {
      listeners.add(listener);

      return;
    },
    history: {
      pushState: (_data, _unused, url): void => {
        const nextPath: string = pathFromHistoryURL(url, location['pathname']);

        entries.splice(position['value'] + 1);
        entries.push(nextPath);
        position.value = entries.length - 1;
        location.pathname = nextPath;

        return;
      },
      replaceState: (_data, _unused, url): void => {
        const nextPath: string = pathFromHistoryURL(url, location['pathname']);

        entries.splice(position['value'], 1, nextPath);
        location.pathname = nextPath;

        return;
      },
    },
    location,
    removeEventListener: (_type, listener): void => {
      listeners.delete(listener);

      return;
    },
  };

  return {
    back: (): void => move(-1),
    browser,
    entries,
    forward: (): void => move(1),
  };
};

describe('dashboard navigation', () => {
  it('keeps desktop and phone destinations aligned', () => {
    const tabs: Web_Navigation_DashboardNavigation_KeepsDesktopAndPhoneDestinationsAligned_Tabs = phoneTabs(appNavigationItems);

    expect(appNavigationItems.map((item) => item['label'])).toEqual([
      'Overview',
      'Containers',
      'History',
      'Settings',
      'Access tokens',
      'Notifications',
    ]);

    expect(PHONE_TABS).toBe(4);

    expect(tabs['tabs'].map((item) => item['id'])).toEqual([
      'overview',
      'containers',
      'history',
    ]);

    expect(tabs['more'].map((item) => item['id'])).toEqual([
      'settings',
      'access',
      'notifications',
    ]);

    expect(tabs['tabs'].length + 1).toBeLessThanOrEqual(PHONE_TABS);

    const moreLevel: Web_Navigation_DashboardNavigation_KeepsDesktopAndPhoneDestinationsAligned_MoreLevel = createMoreNavSheetLevel(tabs['more']);
    const moreGroup: Web_Navigation_DashboardNavigation_KeepsDesktopAndPhoneDestinationsAligned_MoreGroup = moreLevel['groups'].at(0);

    if (moreGroup === undefined) {
      throw new Error('The More sheet needs a row group.');
    }

    expect(moreGroup['rows']).toMatchObject([
      {
        description: 'Schedule and update rules',
        label: 'Settings',
      },
      {
        description: 'Tokens for scripts and tools',
        label: 'Access tokens',
      },
      {
        description: 'Where alerts are sent',
        label: 'Notifications',
      },
    ]);

    return;
  });

  it('opens a group at the first page current role can use', () => {
    const groupedItem: Web_Navigation_DashboardNavigation_OpensAGroupAtTheFirstPageCurrentRoleCanUse_GroupedItem = {
      groups: [{
        id: 'settings',
        label: 'Settings',
        pages: [
          {
            id: 'access',
            label: 'Access tokens',
            permission: 'tokens:write',
          },
          {
            id: 'notifications',
            label: 'Notifications',
            permission: 'notifications:write',
          },
        ],
      }],
      icon: 'settings',
      id: 'settings',
      isGroup: true,
      label: 'Settings',
    };
    const visibleItems: Web_Navigation_DashboardNavigation_OpensAGroupAtTheFirstPageCurrentRoleCanUse_VisibleItems = visibleNavigationItems(
      [groupedItem],
      (permission) => permission === 'notifications:write',
    );
    const visibleGroup: Web_Navigation_DashboardNavigation_OpensAGroupAtTheFirstPageCurrentRoleCanUse_VisibleGroup = visibleItems.at(0);

    if (visibleGroup === undefined) {
      throw new Error('The Settings group needs one visible page.');
    }

    const visibleLevel: Web_Navigation_DashboardNavigation_OpensAGroupAtTheFirstPageCurrentRoleCanUse_VisibleLevel = createNavSheetLevel(visibleGroup);
    const visibleSheetGroup: Web_Navigation_DashboardNavigation_OpensAGroupAtTheFirstPageCurrentRoleCanUse_VisibleSheetGroup = visibleLevel['groups'].at(0);

    if (visibleSheetGroup === undefined) {
      throw new Error('The Settings sheet needs a row group.');
    }

    expect(firstNavigationView(visibleGroup)).toBe('notifications');

    expect(navigationItemHasSheet(visibleGroup)).toBe(true);

    expect(visibleSheetGroup['rows'].map((row) => row['label'])).toEqual(['Notifications']);

    return;
  });

  it('marks a parent current for declared child views', () => {
    const item: Web_Navigation_DashboardNavigation_MarksAParentCurrentForDeclaredChildViews_Item = {
      groups: [{
        id: 'overview',
        label: 'Overview',
        pages: [{
          activeViews: ['security'],
          id: 'overview',
          label: 'Overview',
        }],
      }],
      icon: 'overview',
      id: 'overview',
      label: 'Overview',
    };

    expect(navigationItemHoldsView(item, 'overview')).toBe(true);

    expect(navigationItemHoldsView(item, 'security')).toBe(true);

    expect(navigationItemHoldsView(item, 'containers')).toBe(false);

    return;
  });

  it('uses short labels only in phone bar', () => {
    const item: Web_Navigation_DashboardNavigation_UsesShortLabelsOnlyInPhoneBar_Item = {
      groups: [{
        id: 'access',
        label: 'Access tokens',
        pages: [{
          id: 'access',
          label: 'Access tokens',
        }],
      }],
      icon: 'key',
      id: 'access',
      label: 'Access tokens',
      shortLabel: 'Tokens',
    };

    expect(item['label']).toBe('Access tokens');

    expect(phoneNavigationLabel(item)).toBe('Tokens');

    return;
  });

  it('maps every full console page through the app path table', () => {
    expect(appNavigationPaths).toEqual({
      account: '/account',
      accessTokens: '/access-tokens',
      containers: '/containers',
      history: '/history',
      notifications: '/notifications',
      overview: '/overview',
      root: '/',
      settings: '/settings',
    });

    expect(resolveAppNavigationPath('/')['route']).toMatchObject({
      path: '/',
      view: 'overview',
    });

    expect(resolveAppNavigationPath('/overview')['route']).toEqual(appRouteForView('overview'));

    expect(resolveAppNavigationPath('/containers')['route']).toEqual(appRouteForView('containers'));

    expect(resolveAppNavigationPath('/history')['route']).toEqual(appRouteForView('history'));

    expect(resolveAppNavigationPath('/settings')['route']).toEqual(appRouteForView('settings'));

    expect(resolveAppNavigationPath('/access-tokens')['route']).toEqual(appRouteForView('access'));

    expect(resolveAppNavigationPath('/notifications')['route']).toEqual(appRouteForView('notifications'));

    expect(resolveAppNavigationPath('/account')['route']).toEqual(appRouteForView('security'));

    expect(resolveAppNavigationPath('/missing')).toEqual({
      path: '/overview',
      replace: true,
      route: appRouteForView('overview'),
    });

    return;
  });

  return;
});

describe('browser history', () => {
  it('pushes page entries and restores them with Back and Forward', () => {
    const fixture: Web_Navigation_HistoryFixture = createHistoryBrowser('/');
    const routeState: Web_Navigation_RouteState = {
      value: resolveAppNavigationPath('/')['route'],
    };
    /**
     * Web - Navigation Test - Remember Route.
     *
     * Records each route published by initial and popstate navigation.
     * Assertions read the same mutable holder after every transition.
     *
     * @param {Web_AppNavigation_Route} route - Route.
     *
     * @since 1.1.0
     */
    const rememberRoute = (route: Web_AppNavigation_Route): void => {
      routeState.value = route;

      return;
    };
    const stop: () => void = startNavigationHistory(
      fixture['browser'],
      resolveAppNavigationPath,
      rememberRoute,
    );
    const containersRoute: Web_AppNavigation_Route = appRouteForView('containers');

    pushNavigationPath(fixture['browser'], containersRoute['path']);
    applyNavigationPath(fixture['browser'], resolveAppNavigationPath, rememberRoute);

    const settingsRoute: Web_AppNavigation_Route = appRouteForView('settings');

    pushNavigationPath(fixture['browser'], settingsRoute['path']);
    applyNavigationPath(fixture['browser'], resolveAppNavigationPath, rememberRoute);

    expect(fixture['entries']).toEqual([
      '/',
      '/containers',
      '/settings',
    ]);

    expect(routeState['value']).toEqual(settingsRoute);

    fixture.back();

    expect(routeState['value']).toEqual(containersRoute);

    expect(fixture['browser']['location']['pathname']).toBe('/containers');

    fixture.forward();

    expect(routeState['value']).toEqual(settingsRoute);

    expect(fixture['browser']['location']['pathname']).toBe('/settings');

    stop();

    return;
  });

  it('replaces an unknown path with the first page', () => {
    const fixture: Web_Navigation_HistoryFixture = createHistoryBrowser('/missing');
    const routeState: Web_Navigation_RouteState = {
      value: resolveAppNavigationPath('/')['route'],
    };
    const stop: () => void = startNavigationHistory(
      fixture['browser'],
      resolveAppNavigationPath,
      (route: Web_AppNavigation_Route): void => {
        routeState.value = route;

        return;
      },
    );

    expect(fixture['entries']).toEqual(['/overview']);

    expect(fixture['browser']['location']['pathname']).toBe('/overview');

    expect(routeState['value']).toEqual(appRouteForView('overview'));

    stop();

    return;
  });

  it('restores the requested address after sign-in or first-run setup', () => {
    const fixture: Web_Navigation_HistoryFixture = createHistoryBrowser('/account');
    const routeState: Web_Navigation_RouteState = {
      value: resolveAppNavigationPath('/')['route'],
    };
    /**
     * Web - Navigation Test - Remember Route.
     *
     * Records repeated address application around authentication completion.
     * The stable holder verifies those applications do not change history.
     *
     * @param {Web_AppNavigation_Route} route - Route.
     *
     * @since 1.1.0
     */
    const rememberRoute = (route: Web_AppNavigation_Route): void => {
      routeState.value = route;

      return;
    };
    const stop: () => void = startNavigationHistory(
      fixture['browser'],
      resolveAppNavigationPath,
      rememberRoute,
    );

    applyNavigationPath(fixture['browser'], resolveAppNavigationPath, rememberRoute);
    applyNavigationPath(fixture['browser'], resolveAppNavigationPath, rememberRoute);

    expect(fixture['entries']).toEqual(['/account']);

    expect(routeState['value']).toEqual(appRouteForView('security'));

    stop();

    return;
  });

  return;
});

describe('navigation sheet stack', () => {
  it('opens pushes pops and closes without mutation', () => {
    const groupedItem: Web_Navigation_NavigationSheetStack_OpensPushesPopsAndClosesWithoutMutation_GroupedItem = {
      groups: [{
        id: 'settings',
        label: 'Settings',
        pages: [
          {
            id: 'access',
            label: 'Access tokens',
          },
          {
            id: 'notifications',
            label: 'Notifications',
          },
        ],
      }],
      icon: 'settings',
      id: 'settings',
      isGroup: true,
      label: 'Settings',
    };
    const moreLevel: Web_Navigation_NavigationSheetStack_OpensPushesPopsAndClosesWithoutMutation_MoreLevel = createMoreNavSheetLevel([groupedItem]);
    const childLevel: Web_Navigation_NavigationSheetStack_OpensPushesPopsAndClosesWithoutMutation_ChildLevel = createNavSheetLevel(groupedItem, 'More');
    const rootStack: Web_Navigation_NavigationSheetStack_OpensPushesPopsAndClosesWithoutMutation_RootStack = openNavSheetStack(moreLevel);
    const pushedStack: Web_Navigation_NavigationSheetStack_OpensPushesPopsAndClosesWithoutMutation_PushedStack = pushNavSheetStack(rootStack, childLevel);

    expect(rootStack).toEqual([moreLevel]);

    expect(pushedStack).toEqual([
      moreLevel,
      childLevel,
    ]);

    expect(popNavSheetStack(pushedStack)).toEqual([moreLevel]);

    expect(popNavSheetStack(rootStack)).toBe(rootStack);

    expect(closeNavSheetStack()).toEqual([]);

    return;
  });

  return;
});

import type {
  Web_AppNavigation_Items,
  Web_AppNavigation_PathMatch,
  Web_AppNavigation_Paths,
  Web_AppNavigation_ResolveAppNavigationPath_Pathname,
  Web_AppNavigation_Route,
} from '@/types/web/app-navigation.d.ts';
import type { Web_Components_View } from '@/types/web/components.d.ts';

/**
 * App Navigation - App Navigation Paths.
 *
 * Owns every bookmarkable console address. Shared history code consumes the
 * routes produced here while dialogs, sheets, and filters stay local state.
 *
 * @since 1.1.0
 */
export const appNavigationPaths: Web_AppNavigation_Paths = {
  account: '/account',
  accessTokens: '/access-tokens',
  containers: '/containers',
  history: '/history',
  notifications: '/notifications',
  overview: '/overview',
  root: '/',
  settings: '/settings',
};

/**
 * App Navigation - App Navigation Items.
 *
 * Defines Outpost navigation separately from the shared shell and helpers.
 * Desktop keeps all six pages while phones derive their four destinations.
 *
 * @since 1.1.0
 */
export const appNavigationItems: Web_AppNavigation_Items = [
  {
    groups: [{
      id: 'overview',
      label: 'Overview',
      pages: [{
        id: 'overview',
        label: 'Overview',
      }],
    }],
    icon: 'overview',
    id: 'overview',
    label: 'Overview',
  },
  {
    groups: [{
      id: 'containers',
      label: 'Containers',
      pages: [{
        id: 'containers',
        label: 'Containers',
      }],
    }],
    icon: 'containers',
    id: 'containers',
    label: 'Containers',
  },
  {
    groups: [{
      id: 'history',
      label: 'History',
      pages: [{
        id: 'history',
        label: 'History',
      }],
    }],
    icon: 'history',
    id: 'history',
    label: 'History',
  },
  {
    description: 'Schedule and update rules',
    groups: [{
      id: 'settings',
      label: 'Settings',
      pages: [{
        id: 'settings',
        label: 'Settings',
      }],
    }],
    icon: 'settings',
    id: 'settings',
    label: 'Settings',
  },
  {
    description: 'Tokens for scripts and tools',
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
  },
  {
    description: 'Where alerts are sent',
    groups: [{
      id: 'notifications',
      label: 'Notifications',
      pages: [{
        id: 'notifications',
        label: 'Notifications',
      }],
    }],
    icon: 'bell',
    id: 'notifications',
    label: 'Notifications',
  },
];

/**
 * App Navigation - App Route For View.
 *
 * Returns the canonical path used by shell navigation. The root address is a
 * valid Overview alias, while explicit Overview navigation uses /overview.
 *
 * @param {Web_Components_View} view - View.
 *
 * @returns {Web_AppNavigation_Route}
 *
 * @since 1.1.0
 */
export const appRouteForView = (view: Web_Components_View): Web_AppNavigation_Route => {
  switch (view) {
    case 'access': {
      return {
        path: appNavigationPaths['accessTokens'],
        view,
      };
    }

    case 'containers': {
      return {
        path: appNavigationPaths['containers'],
        view,
      };
    }

    case 'history': {
      return {
        path: appNavigationPaths['history'],
        view,
      };
    }

    case 'notifications': {
      return {
        path: appNavigationPaths['notifications'],
        view,
      };
    }

    case 'security': {
      return {
        path: appNavigationPaths['account'],
        view,
      };
    }

    case 'settings': {
      return {
        path: appNavigationPaths['settings'],
        view,
      };
    }

    default: {
      return {
        path: appNavigationPaths['overview'],
        view: 'overview',
      };
    }
  }
};

/**
 * App Navigation - Resolve App Navigation Path.
 *
 * Parses every full console page. Unknown paths fall back to Overview and
 * request a History API replacement instead of adding a Back destination.
 *
 * @param {Web_AppNavigation_ResolveAppNavigationPath_Pathname} pathname - Pathname.
 *
 * @returns {Web_AppNavigation_PathMatch}
 *
 * @since 1.1.0
 */
export const resolveAppNavigationPath = (pathname: Web_AppNavigation_ResolveAppNavigationPath_Pathname): Web_AppNavigation_PathMatch => {
  if (pathname === appNavigationPaths['root']) {
    return {
      path: pathname,
      replace: false,
      route: {
        path: pathname,
        view: 'overview',
      },
    };
  }

  for (const view of [
    'overview',
    'containers',
    'history',
    'settings',
    'access',
    'notifications',
    'security',
  ] as const) {
    const route: Web_AppNavigation_Route = appRouteForView(view);
    if (pathname === route['path']) {
      return {
        path: route['path'],
        replace: false,
        route,
      };
    }
  }

  const route: Web_AppNavigation_Route = appRouteForView('overview');

  return {
    path: route['path'],
    replace: true,
    route,
  };
};

import {
  useEffect,
  useState,
} from 'react';

import { describeScheduler } from '@/web/labels.ts';
import {
  BrandMark,
  Icon,
} from '@/web/primitives.tsx';
import {
  applyThemePreference,
  readThemePreference,
  themeOptions,
} from '@/web/theme.ts';
import { useEscapeKey } from '@/web/use-escape-key.ts';

import type { ReactElement } from 'react';

import type {
  Web_Components_AccountMenu_Props,
  Web_Components_AppShell_Props,
  Web_Components_NavigationItem,
  Web_Components_SchedulerStatus,
  Web_Components_View,
} from '@/types/web/components.d.ts';
import type {
  Web_Theme_Option,
  Web_Theme_Preference,
} from '@/types/web/theme.d.ts';

/**
 * App Shell - Navigation items.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
const navigationItems: Web_Components_NavigationItem[] = [
  {
    id: 'overview',
    icon: 'overview',
    label: 'Overview',
  },
  {
    id: 'containers',
    icon: 'containers',
    label: 'Containers',
  },
  {
    id: 'history',
    icon: 'history',
    label: 'History',
  },
  {
    id: 'settings',
    icon: 'settings',
    label: 'Settings',
  },
];

// Access tokens, Notifications, and Security sit under Settings: in the sidebar, and in the account menu on small screens.

/**
 * App Shell - Settings items.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
const settingsItems: Web_Components_NavigationItem[] = [
  {
    id: 'access',
    icon: 'key',
    label: 'Access tokens',
  },
  {
    id: 'notifications',
    icon: 'bell',
    label: 'Notifications',
  },
  {
    id: 'security',
    icon: 'shield',
    label: 'Security',
  },
];

/**
 * App Shell - Account menu.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
const AccountMenu = ({
  compact,
  onLogout,
  onViewChange,
  username,
}: Web_Components_AccountMenu_Props): ReactElement => {
  const [
    open,
    setOpen,
  ] = useState<boolean>(false);
  const [
    themePreference,
    setThemePreference,
  ] = useState<Web_Theme_Preference>(readThemePreference);

  useEffect((): void => applyThemePreference(themePreference), [themePreference]);

  useEscapeKey((): void => setOpen(false), open);

  return (
    <div className="account">
      <button
        aria-expanded={open}
        aria-haspopup="menu"
        className="account-button"
        onClick={(): void => setOpen(!open)}
        type="button"
      >
        <span aria-hidden="true" className="avatar">{username.slice(0, 1).toUpperCase()}</span>
        <span>{username}</span>
        <Icon name="more" size={18} />
      </button>

      {(open) ? (
        <>
          <button
            aria-label="Close menu"
            className="menu-scrim"
            onClick={(): void => setOpen(false)}
            type="button"
          />
          <div className="menu account-menu" role="menu">
            <div className="account-menu-section">
              <span id={(compact) ? 'appearance-label-compact' : 'appearance-label'}>Appearance</span>
              <div aria-labelledby={(compact) ? 'appearance-label-compact' : 'appearance-label'} className="segmented" role="group">
                {themeOptions.map((option: Web_Theme_Option): ReactElement => (
                  <button
                    aria-pressed={themePreference === option['id']}
                    key={option['id']}
                    onClick={(): void => setThemePreference(option['id'])}
                    type="button"
                  >
                    {option['label']}
                  </button>
                ))}
              </div>
            </div>
            <hr />
            {(compact) ? settingsItems.map((item: Web_Components_NavigationItem): ReactElement => (
              <button
                key={item['id']}
                onClick={(): void => {
                  setOpen(false);
                  onViewChange(item['id']);
                }}
                role="menuitem"
                type="button"
              >
                <Icon name={item['icon']} size={16} />
                {item['label']}
              </button>
            )) : null}
            {(compact) ? <hr /> : null}
            <button
              onClick={(): void => {
                setOpen(false);
                onLogout();
              }}
              role="menuitem"
              type="button"
            >
              <Icon name="logout" size={16} />
              Sign out
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
};

/**
 * App Shell.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
export const AppShell = ({
  activeView,
  children,
  dockerUnreachable,
  notice,
  onLogout,
  onViewChange,
  overview,
  username,
}: Web_Components_AppShell_Props): ReactElement => {
  const status: Web_Components_SchedulerStatus = describeScheduler(overview, dockerUnreachable);
  // On small screens the Settings tab stays current for the pages under it.
  const currentTab: Web_Components_View = (activeView === 'access' || activeView === 'notifications' || activeView === 'security') ? 'settings' : activeView;

  /**
   * App Shell - Renders item.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @since 1.0.0
   */
  const renderItem = (item: Web_Components_NavigationItem): ReactElement => (
    <button
      aria-current={(activeView === item['id']) ? 'page' : undefined}
      className="nav-item"
      key={item['id']}
      onClick={(): void => onViewChange(item['id'])}
      type="button"
    >
      <Icon name={item['icon']} size={18} />
      {item['label']}
    </button>
  );

  return (
    <div className="app">
      <aside className="app-sidebar">
        <div className="brand">
          <BrandMark />
          <span>Outpost</span>
        </div>

        <nav aria-label="Main" className="nav">
          {navigationItems.map(renderItem)}
          {settingsItems.map(renderItem)}
        </nav>

        <div className="sidebar-footer">
          <button
            className={`protection-card protection-${status['tone']}`}
            onClick={(): void => onViewChange('overview')}
            type="button"
          >
            <span className="status-dot" />
            <strong>{status['label']}</strong>
            <small>{status['detail']}</small>
          </button>
          <AccountMenu compact={false} onLogout={onLogout} onViewChange={onViewChange} username={username} />
        </div>
      </aside>

      <header className="mobile-header">
        <div className="brand">
          <BrandMark />
          <span>Outpost</span>
        </div>
        <div className="mobile-header-end">
          <button
            className={`protection-pill protection-${status['tone']}`}
            onClick={(): void => onViewChange('overview')}
            type="button"
          >
            <span className="status-dot" />
            {status['label']}
          </button>
          <AccountMenu compact onLogout={onLogout} onViewChange={onViewChange} username={username} />
        </div>
      </header>

      <main className="app-main">
        {notice}
        {children}
      </main>

      <nav aria-label="Main" className="tab-bar">
        {navigationItems.map((item: Web_Components_NavigationItem): ReactElement => (
          <button
            aria-current={(currentTab === item['id']) ? 'page' : undefined}
            key={item['id']}
            onClick={(): void => onViewChange(item['id'])}
            type="button"
          >
            <Icon name={item['icon']} size={20} />
            {item['label']}
          </button>
        ))}
      </nav>
    </div>
  );
};

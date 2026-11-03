import type {
  ReactElement,
  ReactNode,
} from 'react';

import type {
  Web_Api_Container,
  Web_Api_CreatedToken,
  Web_Api_CreateTokenInput,
  Web_Api_Overview,
  Web_Api_Registry,
  Web_Api_Report,
  Web_Api_Result,
  Web_Api_ResultStatus,
  Web_Api_Scope,
  Web_Api_Settings,
  Web_Api_Token,
  Web_Api_UpdateSettingsInput,
  Web_Api_UpdateTokenInput,
} from '@/types/web/api.d.ts';

/**
 * Components.
 *
 * @since 1.0.0
 */
export type Web_Components_Icon_Name =
  'activity'
  | 'add'
  | 'bell'
  | 'check'
  | 'chevron'
  | 'chevron-down'
  | 'clock'
  | 'containers'
  | 'copy'
  | 'download'
  | 'edit'
  | 'history'
  | 'key'
  | 'logout'
  | 'more'
  | 'overview'
  | 'refresh'
  | 'remove'
  | 'send'
  | 'server'
  | 'settings'
  | 'shield'
  | 'warning'
  | 'x';

export type Web_Components_Icon_Props = {
  name: Web_Components_Icon_Name;
  size?: number;
};
export type Web_Components_Icon_Returns = ReactElement;

/**
 * Components.
 *
 * @since 1.0.0
 */
export type Web_Components_Button_Variant = 'primary' | 'secondary' | 'quiet' | 'danger';
export type Web_Components_Button_Props = {
  block?: boolean;
  children: ReactNode;
  disabled?: boolean;
  icon?: Web_Components_Icon_Name;
  onClick?: () => void;
  type?: 'button' | 'submit';
  variant?: Web_Components_Button_Variant;
};

/**
 * Components.
 *
 * @since 1.0.0
 */
export type Web_Components_ConfirmDialog_Tone = 'danger' | 'primary';
export type Web_Components_ConfirmDialog_Props = {
  busy: boolean;
  busyLabel: string;
  children?: ReactNode;
  confirmDisabled?: boolean;
  confirmLabel: string;
  error: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
  open: boolean;
  title: string;
  tone?: Web_Components_ConfirmDialog_Tone;
};

/**
 * Components.
 *
 * @since 1.0.0
 */
export type Web_Components_TotpDialog_Mode = 'disable' | 'recovery' | 'setup';
export type Web_Components_TotpDialog_Step = 'codes' | 'password' | 'scan';
export type Web_Components_TotpDialog_Props = {
  mode: Web_Components_TotpDialog_Mode | null;
  onAuthenticatorEnabled: () => void;
  onChanged: () => Promise<void>;
  onClose: () => void;
};

/**
 * Components.
 *
 * @since 1.0.0
 */
export type Web_Components_View = 'access' | 'containers' | 'history' | 'notifications' | 'overview' | 'security' | 'settings';

/**
 * Components.
 *
 * @since 1.0.0
 */
export type Web_Components_NavigationItem = {
  icon: Web_Components_Icon_Name;
  id: Web_Components_View;
  label: string;
};

/**
 * Components.
 *
 * @since 1.0.0
 */
export type Web_Components_StatusTone = 'blocked' | 'connecting' | 'idle' | 'protected';

/**
 * Components.
 *
 * @since 1.0.0
 */
export type Web_Components_SchedulerStatus = {
  detail: string;
  label: string;
  tone: Web_Components_StatusTone;
};

/**
 * Components.
 *
 * @since 1.0.0
 */
export type Web_Components_AppShell_Props = {
  activeView: Web_Components_View;
  children: ReactNode;
  dockerUnreachable: boolean;
  notice: ReactNode;
  onLogout: () => void;
  onViewChange: (view: Web_Components_View) => void;
  overview: Web_Api_Overview | null;
  username: string;
};

/**
 * Components.
 *
 * @since 1.0.0
 */
export type Web_Components_AccountMenu_Props = {
  compact: boolean;
  onLogout: () => void;
  onViewChange: (view: Web_Components_View) => void;
  username: string;
};

/**
 * Components.
 *
 * @since 1.0.0
 */
export type Web_Components_AuthenticationScreen_Mode = 'claim' | 'login';
export type Web_Components_AuthenticationScreen_Props = {
  mode: Web_Components_AuthenticationScreen_Mode;
  onSignedIn: () => Promise<void>;
};

/**
 * Components.
 *
 * @since 1.0.0
 */
export type Web_Components_SecurityView_ErrorContext = 'page' | 'passkey' | 'password' | 'prompt' | 'username';
export type Web_Components_SecurityView_Props = {
  onAuthenticatorEnabled: () => void;
  onUsernameChanged: (username: string) => void;
};

/**
 * Components.
 *
 * @since 1.0.0
 */
export type Web_Components_KeyNotice_Item = {
  id: string;
  label: string;
  onOpen: () => void;
};
export type Web_Components_KeyNotice_Props = {
  appName: string;
  items: Web_Components_KeyNotice_Item[];
  keyName: string;
  onDismiss: () => Promise<void>;
  removedAt: string;
};

/**
 * Components.
 *
 * @since 1.0.0
 */
export type Web_Components_StartCheck = (containerId?: string) => Promise<void>;

/**
 * Components.
 *
 * @since 1.0.0
 */
export type Web_Components_OverviewView_Props = {
  containers: Web_Api_Container[] | null;
  error: unknown;
  onOpenContainers: () => void;
  onOpenHistory: () => void;
  onStartCheck: Web_Components_StartCheck;
  overview: Web_Api_Overview | null;
};

/**
 * Components.
 *
 * @since 1.0.0
 */
export type Web_Components_ContainersView_Props = {
  containers: Web_Api_Container[] | null;
  error: unknown;
  onRefresh: () => Promise<void>;
  onStartCheck: Web_Components_StartCheck;
  overview: Web_Api_Overview | null;
};

/**
 * Components.
 *
 * @since 1.0.0
 */
export type Web_Components_ContainerCell_Props = {
  container: Web_Api_Container;
};

/**
 * Components.
 *
 * @since 1.0.0
 */
export type Web_Components_HistoryView_Props = {
  error: unknown;
  history: Web_Api_Report[] | null;
  onRefresh: () => Promise<void>;
};

/**
 * Components.
 *
 * @since 1.0.0
 */
export type Web_Components_ResultList_Props = {
  compact?: boolean;
  results: Web_Api_Result[];
};

/**
 * Components.
 *
 * @since 1.0.0
 */
export type Web_Components_ResultCount = {
  count: number;
  status: Web_Api_ResultStatus;
};

/**
 * Components.
 *
 * @since 1.0.0
 */
export type Web_Components_SettingsView_Props = {
  error: unknown;
  onSave: (input: Web_Api_UpdateSettingsInput) => Promise<Web_Api_Settings>;
  settings: Web_Api_Settings | null;
};

/**
 * Components.
 *
 * @since 1.0.0
 */
export type Web_Components_SchedulePicker_Props = {
  issue: string;
  onChange: (cron: string) => void;
  timeZone: string;
  value: string;
};

/**
 * Components.
 *
 * @since 1.0.0
 */
export type Web_Components_RegistryDialog_Props = {
  onClose: () => void;
  onSaved: () => Promise<void>;
  open: boolean;
  registry: Web_Api_Registry | null;
};

/**
 * Components.
 *
 * @since 1.0.0
 */
export type Web_Components_AccessView_Props = {
  createdToken: Web_Api_CreatedToken | null;
  onCreateToken: (input: Web_Api_CreateTokenInput) => Promise<void>;
  onDismissCreatedToken: () => void;
  onRevokeToken: (tokenId: string) => Promise<void>;
  onUpdateToken: (tokenId: string, input: Web_Api_UpdateTokenInput) => Promise<void>;
  tokens: Web_Api_Token[];
};

/**
 * Components.
 *
 * @since 1.0.0
 */
export type Web_Components_Endpoint = {
  method: 'GET' | 'POST';
  path: string;
  scope: Web_Api_Scope;
};

/**
 * Components.
 *
 * @since 1.0.0
 */
export type Web_Components_TokenDialog_Expiry = '30' | '90' | '365' | 'keep' | 'never';
export type Web_Components_TokenDialog_Props = {
  onClose: () => void;
  onCreate: (input: Web_Api_CreateTokenInput) => Promise<void>;
  onUpdate: (tokenId: string, input: Web_Api_UpdateTokenInput) => Promise<void>;
  open: boolean;
  token: Web_Api_Token | null;
};

/**
 * Components.
 *
 * @since 1.0.0
 */
export type Web_Components_ScopeOption = {
  description: string;
  endpoints: string[];
  id: Web_Api_Scope;
};

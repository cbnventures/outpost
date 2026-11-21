import type { Web_AppNavigation_Route } from '@/types/web/app-navigation.d.ts';
import type {
  Web_Navigation_Browser,
  Web_Navigation_HistoryURL,
  Web_Navigation_Item,
  Web_Navigation_Items,
  Web_Navigation_PopStateListener,
  Web_Navigation_SheetGroup,
  Web_Navigation_SheetLevel,
  Web_Navigation_SheetStack,
  Web_Navigation_Tabs,
} from '@/types/web/navigation.d.ts';

/**
 * Navigation.
 *
 * @since 1.2.1
 */
export type Web_Navigation_BrowserHistory_PushesPageEntriesAndRestoresThemWithBackAndForward_RememberRoute_Route = Web_AppNavigation_Route;
export type Web_Navigation_BrowserHistory_PushesPageEntriesAndRestoresThemWithBackAndForward_RememberRoute_Returns = void;
export type Web_Navigation_BrowserHistory_PushesPageEntriesAndRestoresThemWithBackAndForward_RememberRoute = (route: Web_Navigation_BrowserHistory_PushesPageEntriesAndRestoresThemWithBackAndForward_RememberRoute_Route) => Web_Navigation_BrowserHistory_PushesPageEntriesAndRestoresThemWithBackAndForward_RememberRoute_Returns;
export type Web_Navigation_BrowserHistory_PushesPageEntriesAndRestoresThemWithBackAndForward_Stop = () => void;

/**
 * Navigation.
 *
 * @since 1.2.1
 */
export type Web_Navigation_BrowserHistory_ReplacesAnUnknownPathWithTheFirstPage_Stop = () => void;

/**
 * Navigation.
 *
 * @since 1.2.1
 */
export type Web_Navigation_BrowserHistory_RestoresTheRequestedAddressAfterSignInOrFirstRunSetup_RememberRoute_Route = Web_AppNavigation_Route;
export type Web_Navigation_BrowserHistory_RestoresTheRequestedAddressAfterSignInOrFirstRunSetup_RememberRoute_Returns = void;
export type Web_Navigation_BrowserHistory_RestoresTheRequestedAddressAfterSignInOrFirstRunSetup_RememberRoute = (route: Web_Navigation_BrowserHistory_RestoresTheRequestedAddressAfterSignInOrFirstRunSetup_RememberRoute_Route) => Web_Navigation_BrowserHistory_RestoresTheRequestedAddressAfterSignInOrFirstRunSetup_RememberRoute_Returns;
export type Web_Navigation_BrowserHistory_RestoresTheRequestedAddressAfterSignInOrFirstRunSetup_Stop = () => void;

/**
 * Navigation.
 *
 * @since 1.2.1
 */
export type Web_Navigation_CreateHistoryBrowser_InitialPath = string;
export type Web_Navigation_CreateHistoryBrowser_Returns = Web_Navigation_HistoryFixture;
export type Web_Navigation_CreateHistoryBrowser_Entries = string[];
export type Web_Navigation_CreateHistoryBrowser_Listeners = Set<Web_Navigation_PopStateListener>;
export type Web_Navigation_CreateHistoryBrowser_Move_Direction = number;
export type Web_Navigation_CreateHistoryBrowser_Move_Returns = void;
export type Web_Navigation_CreateHistoryBrowser_Move = (direction: Web_Navigation_CreateHistoryBrowser_Move_Direction) => Web_Navigation_CreateHistoryBrowser_Move_Returns;
export type Web_Navigation_CreateHistoryBrowser_Move_NextPosition = number;
export type Web_Navigation_CreateHistoryBrowser_Move_NextPath = string | undefined;
export type Web_Navigation_CreateHistoryBrowser_NextPath = string;

/**
 * Navigation.
 *
 * @since 1.1.0
 */
export type Web_Navigation_DashboardNavigation_KeepsDesktopAndPhoneDestinationsAligned_Tabs = Web_Navigation_Tabs;
export type Web_Navigation_DashboardNavigation_KeepsDesktopAndPhoneDestinationsAligned_MoreLevel = Web_Navigation_SheetLevel;
export type Web_Navigation_DashboardNavigation_KeepsDesktopAndPhoneDestinationsAligned_MoreGroup = Web_Navigation_SheetGroup | undefined;

/**
 * Navigation.
 *
 * @since 1.1.0
 */
export type Web_Navigation_DashboardNavigation_MarksAParentCurrentForDeclaredChildViews_Item = Web_Navigation_Item;

/**
 * Navigation.
 *
 * @since 1.1.0
 */
export type Web_Navigation_DashboardNavigation_OpensAGroupAtTheFirstPageCurrentRoleCanUse_GroupedItem = Web_Navigation_Item;
export type Web_Navigation_DashboardNavigation_OpensAGroupAtTheFirstPageCurrentRoleCanUse_VisibleItems = Web_Navigation_Items;
export type Web_Navigation_DashboardNavigation_OpensAGroupAtTheFirstPageCurrentRoleCanUse_VisibleGroup = Web_Navigation_Item | undefined;
export type Web_Navigation_DashboardNavigation_OpensAGroupAtTheFirstPageCurrentRoleCanUse_VisibleLevel = Web_Navigation_SheetLevel;
export type Web_Navigation_DashboardNavigation_OpensAGroupAtTheFirstPageCurrentRoleCanUse_VisibleSheetGroup = Web_Navigation_SheetGroup | undefined;

/**
 * Navigation.
 *
 * @since 1.1.0
 */
export type Web_Navigation_DashboardNavigation_UsesShortLabelsOnlyInPhoneBar_Item = Web_Navigation_Item;

/**
 * Navigation.
 *
 * @since 1.1.0
 */
export type Web_Navigation_HistoryFixture = {
  back: () => void;
  browser: Web_Navigation_Browser;
  entries: string[];
  forward: () => void;
};

/**
 * Navigation.
 *
 * @since 1.1.0
 */
export type Web_Navigation_HistoryPosition = {
  value: number;
};

/**
 * Navigation.
 *
 * @since 1.1.0
 */
export type Web_Navigation_NavigationSheetStack_OpensPushesPopsAndClosesWithoutMutation_GroupedItem = Web_Navigation_Item;
export type Web_Navigation_NavigationSheetStack_OpensPushesPopsAndClosesWithoutMutation_MoreLevel = Web_Navigation_SheetLevel;
export type Web_Navigation_NavigationSheetStack_OpensPushesPopsAndClosesWithoutMutation_ChildLevel = Web_Navigation_SheetLevel;
export type Web_Navigation_NavigationSheetStack_OpensPushesPopsAndClosesWithoutMutation_RootStack = Web_Navigation_SheetStack;
export type Web_Navigation_NavigationSheetStack_OpensPushesPopsAndClosesWithoutMutation_PushedStack = Web_Navigation_SheetStack;

/**
 * Navigation.
 *
 * @since 1.2.1
 */
export type Web_Navigation_PathFromHistoryUrl_Url = Web_Navigation_HistoryURL;
export type Web_Navigation_PathFromHistoryUrl_CurrentPath = string;
export type Web_Navigation_PathFromHistoryUrl_Returns = string;

/**
 * Navigation.
 *
 * @since 1.1.0
 */
export type Web_Navigation_RouteState = {
  value: Web_AppNavigation_Route;
};

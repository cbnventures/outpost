import type { Web_AppNavigation_Route } from '@/types/web/app-navigation.d.ts';
import type {
  Web_Navigation_Browser,
  Web_Navigation_Item,
  Web_Navigation_Items,
  Web_Navigation_SheetGroup,
  Web_Navigation_SheetLevel,
  Web_Navigation_SheetStack,
  Web_Navigation_Tabs,
} from '@/types/web/navigation.d.ts';

/**
 * Web - Navigation - History fixture.
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
 * Web - Navigation - History position.
 *
 * @since 1.1.0
 */
export type Web_Navigation_HistoryPosition = {
  value: number;
};

/**
 * Web - Navigation - Route state.
 *
 * @since 1.1.0
 */
export type Web_Navigation_RouteState = {
  value: Web_AppNavigation_Route;
};

/**
 * Web - Navigation - Dashboard navigation - Keeps desktop and phone destinations aligned.
 *
 * @since 1.1.0
 */
export type Web_Navigation_DashboardNavigation_KeepsDesktopAndPhoneDestinationsAligned_Tabs = Web_Navigation_Tabs;
export type Web_Navigation_DashboardNavigation_KeepsDesktopAndPhoneDestinationsAligned_MoreLevel = Web_Navigation_SheetLevel;
export type Web_Navigation_DashboardNavigation_KeepsDesktopAndPhoneDestinationsAligned_MoreGroup = Web_Navigation_SheetGroup | undefined;

/**
 * Web - Navigation - Dashboard navigation - Marks a parent current for declared child views.
 *
 * @since 1.1.0
 */
export type Web_Navigation_DashboardNavigation_MarksAParentCurrentForDeclaredChildViews_Item = Web_Navigation_Item;

/**
 * Web - Navigation - Dashboard navigation - Opens a group at the first page current role can use.
 *
 * @since 1.1.0
 */
export type Web_Navigation_DashboardNavigation_OpensAGroupAtTheFirstPageCurrentRoleCanUse_GroupedItem = Web_Navigation_Item;
export type Web_Navigation_DashboardNavigation_OpensAGroupAtTheFirstPageCurrentRoleCanUse_VisibleItems = Web_Navigation_Items;
export type Web_Navigation_DashboardNavigation_OpensAGroupAtTheFirstPageCurrentRoleCanUse_VisibleGroup = Web_Navigation_Item | undefined;
export type Web_Navigation_DashboardNavigation_OpensAGroupAtTheFirstPageCurrentRoleCanUse_VisibleLevel = Web_Navigation_SheetLevel;
export type Web_Navigation_DashboardNavigation_OpensAGroupAtTheFirstPageCurrentRoleCanUse_VisibleSheetGroup = Web_Navigation_SheetGroup | undefined;

/**
 * Web - Navigation - Dashboard navigation - Uses short labels only in phone bar.
 *
 * @since 1.1.0
 */
export type Web_Navigation_DashboardNavigation_UsesShortLabelsOnlyInPhoneBar_Item = Web_Navigation_Item;

/**
 * Web - Navigation - Navigation sheet stack - Opens pushes pops and closes without mutation.
 *
 * @since 1.1.0
 */
export type Web_Navigation_NavigationSheetStack_OpensPushesPopsAndClosesWithoutMutation_GroupedItem = Web_Navigation_Item;
export type Web_Navigation_NavigationSheetStack_OpensPushesPopsAndClosesWithoutMutation_MoreLevel = Web_Navigation_SheetLevel;
export type Web_Navigation_NavigationSheetStack_OpensPushesPopsAndClosesWithoutMutation_ChildLevel = Web_Navigation_SheetLevel;
export type Web_Navigation_NavigationSheetStack_OpensPushesPopsAndClosesWithoutMutation_RootStack = Web_Navigation_SheetStack;
export type Web_Navigation_NavigationSheetStack_OpensPushesPopsAndClosesWithoutMutation_PushedStack = Web_Navigation_SheetStack;

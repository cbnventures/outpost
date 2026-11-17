import type { Mock } from 'vitest';

import type {
  Web_Api_Container,
  Web_Api_Overview,
} from './api.d.ts';
import type { Web_Components_UpdateConfirmationDialog_Props } from './components.d.ts';

/**
 * Web - Containers View - Containers view - Renders an accessible Actions header.
 *
 * @since 1.1.0
 */
export type Web_ContainersView_ContainersView_RendersAnAccessibleActionsHeader_Container = Web_Api_Container;

export type Web_ContainersView_ContainersView_RendersAnAccessibleActionsHeader_Overview = Web_Api_Overview;

export type Web_ContainersView_ContainersView_RendersAnAccessibleActionsHeader_Html = string;

/**
 * Web - Containers View - Containers view - Uses result neutral checked labels.
 *
 * @since 1.1.0
 */
export type Web_ContainersView_ContainersView_UsesResultNeutralCheckedLabels_Containers = Web_Api_Container[];

export type Web_ContainersView_ContainersView_UsesResultNeutralCheckedLabels_Overview = Web_Api_Overview;

export type Web_ContainersView_ContainersView_UsesResultNeutralCheckedLabels_Html = string;

/**
 * Web - Containers View - Containers view - Uses the short result summary.
 *
 * @since 1.1.0
 */
export type Web_ContainersView_ContainersView_UsesTheShortResultSummary_Container = Web_Api_Container;

export type Web_ContainersView_ContainersView_UsesTheShortResultSummary_Overview = Web_Api_Overview;

export type Web_ContainersView_ContainersView_UsesTheShortResultSummary_Html = string;

/**
 * Web - Containers View - Image name - Wraps only after image delimiters.
 *
 * @since 1.1.0
 */
export type Web_ContainersView_ImageName_WrapsOnlyAfterImageDelimiters_Html = string;

/**
 * Web - Containers View - Update confirmation dialog.
 *
 * @since 1.1.0
 */
export type Web_ContainersView_UpdateConfirmationDialog_Container = Web_Api_Container;

export type Web_ContainersView_UpdateConfirmationDialog_Html = string;

export type Web_ContainersView_UpdateConfirmationDialog_OnCancel = Mock<Web_Components_UpdateConfirmationDialog_Props['onCancel']>;

export type Web_ContainersView_UpdateConfirmationDialog_OnConfirm = Mock<Web_Components_UpdateConfirmationDialog_Props['onConfirm']>;

import type { Shared_ContainerSummary, Shared_Result } from './shared.d.ts';

/**
 * Select.
 *
 * @since 0.0.1
 */
export type Select_Containers = Shared_ContainerSummary[];

/**
 * Select - Select Containers - Applies Label Modes To Outpost Too.
 *
 * @since 0.0.1
 */
export type Select_SelectContainers_AppliesLabelModesToOutpostToo_Selection_Candidates = Shared_ContainerSummary[];

export type Select_SelectContainers_AppliesLabelModesToOutpostToo_Selection_Skipped = Shared_Result[];

export type Select_SelectContainers_AppliesLabelModesToOutpostToo_Selection = {
  candidates: Select_SelectContainers_AppliesLabelModesToOutpostToo_Selection_Candidates;
  skipped: Select_SelectContainers_AppliesLabelModesToOutpostToo_Selection_Skipped;
};

/**
 * Select - Select Containers - Leaves Outpost Images Alone When Its Own Id Is Unknown.
 *
 * @since 1.0.0
 */
export type Select_SelectContainers_LeavesOutpostImagesAloneWhenItsOwnIdIsUnknown_Selection = {
  candidates: Select_SelectContainers_AppliesLabelModesToOutpostToo_Selection_Candidates;
  skipped: Select_SelectContainers_AppliesLabelModesToOutpostToo_Selection_Skipped;
};

/**
 * Select - Select Containers - Skips Network Namespace Pairs And Auto Remove.
 *
 * @since 1.0.0
 */
export type Select_SelectContainers_SkipsNetworkNamespacePairsAndAutoRemove_Selection = {
  candidates: Select_SelectContainers_AppliesLabelModesToOutpostToo_Selection_Candidates;
  skipped: Select_SelectContainers_AppliesLabelModesToOutpostToo_Selection_Skipped;
};

/**
 * Select - Sort By Dependencies - Updates Dependencies First.
 *
 * @since 0.0.1
 */
export type Select_SortByDependencies_UpdatesDependenciesFirst_Name = string;

export type Select_SortByDependencies_UpdatesDependenciesFirst_Names = Select_SortByDependencies_UpdatesDependenciesFirst_Name[];

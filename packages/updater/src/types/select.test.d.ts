import type { Shared_ContainerSummary, Shared_Result } from './shared.d.ts';

/**
 * Select.
 *
 * @since 0.0.1
 */
export type Select_Containers = Shared_ContainerSummary[];

/**
 * Select - Select Containers - Applies Label Modes And Skips Self.
 *
 * @since 0.0.1
 */
export type Select_SelectContainers_AppliesLabelModesAndSkipsSelf_Selection_Candidates = Shared_ContainerSummary[];

export type Select_SelectContainers_AppliesLabelModesAndSkipsSelf_Selection_Skipped = Shared_Result[];

export type Select_SelectContainers_AppliesLabelModesAndSkipsSelf_Selection = {
  candidates: Select_SelectContainers_AppliesLabelModesAndSkipsSelf_Selection_Candidates;
  skipped: Select_SelectContainers_AppliesLabelModesAndSkipsSelf_Selection_Skipped;
};

/**
 * Select - Sort By Dependencies - Updates Dependencies First.
 *
 * @since 0.0.1
 */
export type Select_SortByDependencies_UpdatesDependenciesFirst_Name = string;

export type Select_SortByDependencies_UpdatesDependenciesFirst_Names = Select_SortByDependencies_UpdatesDependenciesFirst_Name[];

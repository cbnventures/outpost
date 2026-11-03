import type {
  Shared_ContainerSummary,
  Shared_Options,
  Shared_Result,
} from './shared.d.ts';

/**
 * Select - Is Outpost Image.
 *
 * @since 1.0.0
 */
export type Select_IsOutpostImage_Image = string;

export type Select_IsOutpostImage_Returns = boolean;

export type Select_IsOutpostImage_Name = string;

export type Select_IsOutpostImage_LastSegment = string;

/**
 * Select - Select Containers.
 *
 * @since 0.0.1
 */
export type Select_SelectContainers_Containers = Shared_ContainerSummary[];

export type Select_SelectContainers_Options = Pick<Shared_Options, 'labelMode' | 'selfId'>;

export type Select_SelectContainers_Returns = Select_SelectContainers_Selection;

export type Select_SelectContainers_Selection_Candidates = Shared_ContainerSummary[];

export type Select_SelectContainers_Selection_Skipped = Shared_Result[];

export type Select_SelectContainers_Selection = {
  candidates: Select_SelectContainers_Selection_Candidates;
  skipped: Select_SelectContainers_Selection_Skipped;
};

export type Select_SelectContainers_Labels = Record<string, string>;

export type Select_SelectContainers_EnableLabel = string | undefined;

export type Select_SelectContainers_Name = string;

export type Select_SelectContainers_Image = string;

export type Select_SelectContainers_NetworkMode = string;

export type Select_SelectContainers_IsNetworkNamespaceOwner = boolean;

/**
 * Select - Sort By Dependencies.
 *
 * @since 0.0.1
 */
export type Select_SortByDependencies_Containers = Shared_ContainerSummary[];

export type Select_SortByDependencies_Returns = Shared_ContainerSummary[];

export type Select_SortByDependencies_KeyOf = (container: Shared_ContainerSummary) => string;

export type Select_SortByDependencies_Labels = Record<string, string>;

export type Select_SortByDependencies_Sorted = Shared_ContainerSummary[];

export type Select_SortByDependencies_Visited = Set<string>;

export type Select_SortByDependencies_Visit = (container: Shared_ContainerSummary) => void;

export type Select_SortByDependencies_Key = string;

export type Select_SortByDependencies_Project = string;

export type Select_SortByDependencies_Dependency = string;

export type Select_SortByDependencies_DependsOn = Select_SortByDependencies_Dependency[];

export type Select_SortByDependencies_DependencyContainer = Shared_ContainerSummary | undefined;

/**
 * Select - Uses Network Namespace Of.
 *
 * @since 1.0.0
 */
export type Select_UsesNetworkNamespaceOf_Container = Shared_ContainerSummary;

export type Select_UsesNetworkNamespaceOf_Containers = Shared_ContainerSummary[];

export type Select_UsesNetworkNamespaceOf_Returns = boolean;

export type Select_UsesNetworkNamespaceOf_Names = Set<string>;

export type Select_UsesNetworkNamespaceOf_NetworkMode = string;

export type Select_UsesNetworkNamespaceOf_Reference = string;

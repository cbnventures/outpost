import type {
  Select_SelectContainers_Containers,
  Select_SelectContainers_EnableLabel,
  Select_SelectContainers_Image,
  Select_SelectContainers_Labels,
  Select_SelectContainers_Name,
  Select_SelectContainers_Options,
  Select_SelectContainers_Returns,
  Select_SelectContainers_Selection,
  Select_SortByDependencies_Containers,
  Select_SortByDependencies_DependencyContainer,
  Select_SortByDependencies_DependsOn,
  Select_SortByDependencies_Key,
  Select_SortByDependencies_KeyOf,
  Select_SortByDependencies_Labels,
  Select_SortByDependencies_Project,
  Select_SortByDependencies_Returns,
  Select_SortByDependencies_Sorted,
  Select_SortByDependencies_Visit,
  Select_SortByDependencies_Visited,
} from './types/select.d.ts';

/**
 * Select - Enable Label.
 *
 * Container label that opts a container in ("true") or out ("false") of
 * updates, depending on the label mode.
 *
 * @since 0.0.1
 */
export const ENABLE_LABEL = 'io.cbnventures.outpost.enable';

/**
 * Select - Monitor Only Label.
 *
 * Container label that limits a container to update notifications even
 * when Outpost is allowed to update everything else.
 *
 * @since 0.0.1
 */
export const MONITOR_ONLY_LABEL = 'io.cbnventures.outpost.monitor-only';

/**
 * Select - Containers.
 *
 * Splits running containers into update candidates and skipped ones,
 * applying the label mode and leaving out Outpost itself. Pinned images
 * are detected later from the inspected config.
 *
 * @param {Select_SelectContainers_Containers} containers - Containers.
 * @param {Select_SelectContainers_Options}    options    - Options.
 *
 * @returns {Select_SelectContainers_Returns}
 *
 * @since 0.0.1
 */
export function selectContainers(containers: Select_SelectContainers_Containers, options: Select_SelectContainers_Options): Select_SelectContainers_Returns {
  const selection: Select_SelectContainers_Selection = {
    candidates: [],
    skipped: [],
  };

  for (const container of containers) {
    const labels: Select_SelectContainers_Labels = container['Labels'] ?? {};
    const enableLabel: Select_SelectContainers_EnableLabel = labels[ENABLE_LABEL];
    const name: Select_SelectContainers_Name = (container['Names'][0] ?? container['Id']).replace('/', '');
    const image: Select_SelectContainers_Image = container['Image'];

    if (
      enableLabel === 'false'
      || (
        options['labelMode'] === 'opt-in'
        && enableLabel !== 'true'
      )
    ) {
      continue;
    }

    if (options['selfId'] !== undefined && container['Id'].startsWith(options['selfId']) === true) {
      selection['skipped'].push({
        container: name,
        image,
        status: 'skipped',
        detail: 'Outpost does not update itself while running',
      });

      continue;
    }

    selection['candidates'].push(container);
  }

  return selection;
}

/**
 * Select - Sort By Dependencies.
 *
 * Orders containers so Compose dependencies (from the depends_on label)
 * are updated before the services that depend on them. Containers from
 * different projects keep their relative order.
 *
 * @param {Select_SortByDependencies_Containers} containers - Containers.
 *
 * @returns {Select_SortByDependencies_Returns}
 *
 * @since 0.0.1
 */
export function sortByDependencies(containers: Select_SortByDependencies_Containers): Select_SortByDependencies_Returns {
  /**
   * Select - Sort By Dependencies - Key Of.
   *
   * Builds a project-scoped service key so services with the same name
   * in different Compose projects never collide.
   *
   * @param {Shared_ContainerSummary} container - Container.
   *
   * @returns {string}
   *
   * @since 0.0.1
   */
  const keyOf: Select_SortByDependencies_KeyOf = (container) => {
    const labels: Select_SortByDependencies_Labels = container['Labels'] ?? {};

    return `${labels['com.docker.compose.project'] ?? ''}/${labels['com.docker.compose.service'] ?? container['Id']}`;
  };
  const sorted: Select_SortByDependencies_Sorted = [];
  const visited: Select_SortByDependencies_Visited = new Set();

  /**
   * Select - Sort By Dependencies - Visit.
   *
   * Depth-first walk that appends a container after its dependencies.
   * Already visited keys are skipped, which also breaks cycles.
   *
   * @param {Shared_ContainerSummary} container - Container.
   *
   * @returns {void}
   *
   * @since 0.0.1
   */
  const visit: Select_SortByDependencies_Visit = (container) => {
    const key: Select_SortByDependencies_Key = keyOf(container);

    if (visited.has(key) === true) {
      return;
    }

    visited.add(key);

    const labels: Select_SortByDependencies_Labels = container['Labels'] ?? {};
    const project: Select_SortByDependencies_Project = labels['com.docker.compose.project'] ?? '';
    const dependsOn: Select_SortByDependencies_DependsOn = (labels['com.docker.compose.depends_on'] ?? '').split(',').map((dependency) => dependency.split(':')[0] ?? '').filter((dependency) => dependency !== '');

    for (const dependency of dependsOn) {
      const dependencyContainer: Select_SortByDependencies_DependencyContainer = containers.find((candidate) => keyOf(candidate) === `${project}/${dependency}`);

      if (dependencyContainer !== undefined) {
        visit(dependencyContainer);
      }
    }

    sorted.push(container);

    return;
  };

  for (const container of containers) {
    visit(container);
  }

  return sorted;
}

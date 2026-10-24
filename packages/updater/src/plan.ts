import { isDeepStrictEqual } from 'node:util';

import type {
  Plan_BuildCreatePlan_Binds,
  Plan_BuildCreatePlan_BoundTargets,
  Plan_BuildCreatePlan_Config,
  Plan_BuildCreatePlan_Container,
  Plan_BuildCreatePlan_CopiedEndpoint,
  Plan_BuildCreatePlan_DefaultEnv,
  Plan_BuildCreatePlan_DefaultLabels,
  Plan_BuildCreatePlan_Endpoint,
  Plan_BuildCreatePlan_EndpointsConfig,
  Plan_BuildCreatePlan_ExtraNetworks,
  Plan_BuildCreatePlan_HostConfig,
  Plan_BuildCreatePlan_ImageConfig,
  Plan_BuildCreatePlan_Labels,
  Plan_BuildCreatePlan_Mode,
  Plan_BuildCreatePlan_Mounts,
  Plan_BuildCreatePlan_Name,
  Plan_BuildCreatePlan_NetworkMode,
  Plan_BuildCreatePlan_NetworkName,
  Plan_BuildCreatePlan_NetworkNames,
  Plan_BuildCreatePlan_Networks,
  Plan_BuildCreatePlan_PrimaryNetwork,
  Plan_BuildCreatePlan_Reference,
  Plan_BuildCreatePlan_Returns,
  Plan_BuildCreatePlan_ShortId,
  Plan_CopyEndpoint_Aliases,
  Plan_CopyEndpoint_Endpoint,
  Plan_CopyEndpoint_IncludeAliases,
  Plan_CopyEndpoint_Returns,
  Plan_CopyEndpoint_ShortId,
  Plan_DropImageDefaults_Config,
  Plan_DropImageDefaults_ImageConfig,
  Plan_DropImageDefaults_Keys,
  Plan_DropImageDefaults_Returns,
  Plan_DropMatchingKeys_Defaults,
  Plan_DropMatchingKeys_Kept,
  Plan_DropMatchingKeys_Key,
  Plan_DropMatchingKeys_Returns,
  Plan_DropMatchingKeys_Value,
  Plan_DropMatchingKeys_Values,
} from './types/plan.d.ts';

/**
 * Plan - Build Create Plan.
 *
 * Turns an inspected container into the body for an identical container
 * on the new image. Old image defaults are dropped so the new ones apply,
 * while volumes and networks carry over so data survives the swap.
 *
 * @param {Plan_BuildCreatePlan_Container}   container   - Container.
 * @param {Plan_BuildCreatePlan_ImageConfig} imageConfig - Image config.
 * @param {Plan_BuildCreatePlan_Reference}   reference   - Reference.
 *
 * @returns {Plan_BuildCreatePlan_Returns}
 *
 * @since 0.0.1
 */
export function buildCreatePlan(container: Plan_BuildCreatePlan_Container, imageConfig: Plan_BuildCreatePlan_ImageConfig, reference: Plan_BuildCreatePlan_Reference): Plan_BuildCreatePlan_Returns {
  const name: Plan_BuildCreatePlan_Name = container['Name'].replace('/', '');
  const shortId: Plan_BuildCreatePlan_ShortId = container['Id'].slice(0, 12);
  const config: Plan_BuildCreatePlan_Config = dropImageDefaults(structuredClone(container['Config']), imageConfig);
  const hostConfig: Plan_BuildCreatePlan_HostConfig = structuredClone(container['HostConfig']);

  Reflect.set(config, 'Image', reference);

  // The default hostname is the old container's short ID; let Docker assign a new one.
  if (config['Hostname'] === shortId) {
    Reflect.deleteProperty(config, 'Hostname');
  }

  // Env and labels are dropped entry by entry so user-set values survive.
  const defaultEnv: Plan_BuildCreatePlan_DefaultEnv = new Set((imageConfig !== undefined) ? (imageConfig['Env'] ?? []) : []);
  const defaultLabels: Plan_BuildCreatePlan_DefaultLabels = (imageConfig !== undefined) ? (imageConfig['Labels'] ?? {}) : {};
  const labels: Plan_BuildCreatePlan_Labels = dropMatchingKeys(config['Labels'] ?? {}, defaultLabels);

  Reflect.set(config, 'Env', (config['Env'] ?? []).filter((entry) => defaultEnv.has(entry) === false));
  Reflect.set(config, 'Labels', labels);

  // Anonymous volumes would be recreated empty, so reattach them by name.
  const binds: Plan_BuildCreatePlan_Binds = [...((Array.isArray(hostConfig['Binds']) === true) ? hostConfig['Binds'] as Plan_BuildCreatePlan_Binds : [])];
  const mounts: Plan_BuildCreatePlan_Mounts = (Array.isArray(hostConfig['Mounts']) === true) ? hostConfig['Mounts'] as Plan_BuildCreatePlan_Mounts : [];
  const boundTargets: Plan_BuildCreatePlan_BoundTargets = new Set([
    ...binds.map((bind) => bind.split(':')[1] ?? ''),
    ...mounts.map((mount) => String(mount['Target'] ?? '')),
  ]);

  for (const mount of container['Mounts'] ?? []) {
    if (
      mount['Type'] === 'volume'
      && mount['Name'] !== undefined
      && boundTargets.has(mount['Destination']) === false
    ) {
      const mode: Plan_BuildCreatePlan_Mode = (mount['RW'] === false) ? ':ro' : '';

      binds.push(`${mount['Name']}:${mount['Destination']}${mode}`);
    }
  }

  if (binds.length > 0) {
    Reflect.set(hostConfig, 'Binds', binds);
  }

  // Only one network can be attached at creation; the rest are connected afterwards.
  const networkMode: Plan_BuildCreatePlan_NetworkMode = hostConfig['NetworkMode'] ?? 'default';
  const networks: Plan_BuildCreatePlan_Networks = container['NetworkSettings']['Networks'] ?? {};
  const extraNetworks: Plan_BuildCreatePlan_ExtraNetworks = [];
  const endpointsConfig: Plan_BuildCreatePlan_EndpointsConfig = {};

  if (
    networkMode !== 'host'
    && networkMode !== 'none'
    && networkMode.startsWith('container:') === false
  ) {
    const networkNames: Plan_BuildCreatePlan_NetworkNames = Object.keys(networks);
    const primaryNetwork: Plan_BuildCreatePlan_PrimaryNetwork = (networkNames.includes(networkMode) === true) ? networkMode : networkNames[0];

    for (const network of Object.entries(networks)) {
      const networkName: Plan_BuildCreatePlan_NetworkName = network[0];
      const endpoint: Plan_BuildCreatePlan_Endpoint = network[1];
      const copiedEndpoint: Plan_BuildCreatePlan_CopiedEndpoint = copyEndpoint(endpoint, shortId, networkName !== 'bridge');

      if (networkName === primaryNetwork) {
        Reflect.set(endpointsConfig, networkName, copiedEndpoint);
      } else {
        extraNetworks.push({
          name: networkName,
          endpoint: copiedEndpoint,
        });
      }
    }
  }

  return {
    name,
    body: {
      ...config,
      HostConfig: hostConfig,
      NetworkingConfig: { EndpointsConfig: endpointsConfig },
    },
    extraNetworks,
  };
}

/**
 * Plan - Copy Endpoint.
 *
 * Copies the user-defined parts of a network attachment (aliases, static
 * IP config, links, driver options) and leaves out runtime state. The old
 * container's short ID alias is removed because the ID changes.
 *
 * @param {Plan_CopyEndpoint_Endpoint}       endpoint       - Endpoint.
 * @param {Plan_CopyEndpoint_ShortId}        shortId        - Short id.
 * @param {Plan_CopyEndpoint_IncludeAliases} includeAliases - Include aliases.
 *
 * @returns {Plan_CopyEndpoint_Returns}
 *
 * @since 0.0.1
 */
function copyEndpoint(endpoint: Plan_CopyEndpoint_Endpoint, shortId: Plan_CopyEndpoint_ShortId, includeAliases: Plan_CopyEndpoint_IncludeAliases): Plan_CopyEndpoint_Returns {
  const aliases: Plan_CopyEndpoint_Aliases = (endpoint['Aliases'] ?? []).filter((alias) => alias !== shortId);

  return {
    ...((includeAliases === true && aliases.length > 0) ? { Aliases: aliases } : {}),
    ...((endpoint['IPAMConfig'] !== undefined && endpoint['IPAMConfig'] !== null) ? { IPAMConfig: endpoint['IPAMConfig'] } : {}),
    ...((endpoint['Links'] !== undefined && endpoint['Links'] !== null) ? { Links: endpoint['Links'] } : {}),
    ...((endpoint['DriverOpts'] !== undefined && endpoint['DriverOpts'] !== null) ? { DriverOpts: endpoint['DriverOpts'] } : {}),
  };
}

/**
 * Plan - Drop Image Defaults.
 *
 * Removes whole-value settings (command, entrypoint, working directory,
 * user, healthcheck, stop signal) and per-key ports and volumes that
 * were inherited unchanged from the old image.
 *
 * @param {Plan_DropImageDefaults_Config}      config      - Config.
 * @param {Plan_DropImageDefaults_ImageConfig} imageConfig - Image config.
 *
 * @returns {Plan_DropImageDefaults_Returns}
 *
 * @since 0.0.1
 */
function dropImageDefaults(config: Plan_DropImageDefaults_Config, imageConfig: Plan_DropImageDefaults_ImageConfig): Plan_DropImageDefaults_Returns {
  if (imageConfig === undefined) {
    return config;
  }

  const keys: Plan_DropImageDefaults_Keys = [
    'Cmd',
    'Entrypoint',
    'WorkingDir',
    'User',
    'Healthcheck',
    'StopSignal',
  ];

  for (const key of keys) {
    if (config[key] !== undefined && isDeepStrictEqual(config[key], imageConfig[key]) === true) {
      Reflect.deleteProperty(config, key);
    }
  }

  Reflect.set(config, 'ExposedPorts', dropMatchingKeys(config['ExposedPorts'] ?? {}, imageConfig['ExposedPorts'] ?? {}));
  Reflect.set(config, 'Volumes', dropMatchingKeys(config['Volumes'] ?? {}, imageConfig['Volumes'] ?? {}));

  return config;
}

/**
 * Plan - Drop Matching Keys.
 *
 * Returns a copy of a record without the keys whose value is identical
 * to the default record's value for the same key.
 *
 * @param {Plan_DropMatchingKeys_Values}   values   - Values.
 * @param {Plan_DropMatchingKeys_Defaults} defaults - Defaults.
 *
 * @returns {Plan_DropMatchingKeys_Returns}
 *
 * @since 0.0.1
 */
function dropMatchingKeys(values: Plan_DropMatchingKeys_Values, defaults: Plan_DropMatchingKeys_Defaults): Plan_DropMatchingKeys_Returns {
  const kept: Plan_DropMatchingKeys_Kept = {};

  for (const entry of Object.entries(values)) {
    const key: Plan_DropMatchingKeys_Key = entry[0];
    const value: Plan_DropMatchingKeys_Value = entry[1];

    if (key in defaults === false || isDeepStrictEqual(defaults[key], value) === false) {
      Reflect.set(kept, key, value);
    }
  }

  return kept;
}

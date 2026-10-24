import type {
  Shared_ContainerConfig,
  Shared_ContainerInspect,
  Shared_CreatePlan,
  Shared_CreatePlan_ExtraNetwork,
} from './shared.d.ts';

/**
 * Plan - Build Create Plan.
 *
 * @since 0.0.1
 */
export type Plan_BuildCreatePlan_Container = Shared_ContainerInspect;

export type Plan_BuildCreatePlan_ImageConfig = Shared_ContainerConfig | undefined;

export type Plan_BuildCreatePlan_Reference = string;

export type Plan_BuildCreatePlan_Returns = Shared_CreatePlan;

export type Plan_BuildCreatePlan_Name = string;

export type Plan_BuildCreatePlan_ShortId = string;

export type Plan_BuildCreatePlan_Config = Shared_ContainerConfig;

export type Plan_BuildCreatePlan_HostConfig = Shared_ContainerInspect['HostConfig'];

export type Plan_BuildCreatePlan_DefaultEnv = Set<string>;

export type Plan_BuildCreatePlan_DefaultLabels = Record<string, string>;

export type Plan_BuildCreatePlan_Labels = Record<string, unknown>;

export type Plan_BuildCreatePlan_Bind = string;

export type Plan_BuildCreatePlan_Binds = Plan_BuildCreatePlan_Bind[];

export type Plan_BuildCreatePlan_Mode = string;

export type Plan_BuildCreatePlan_Mount = Record<string, unknown>;

export type Plan_BuildCreatePlan_Mounts = Plan_BuildCreatePlan_Mount[];

export type Plan_BuildCreatePlan_BoundTargets = Set<string>;

export type Plan_BuildCreatePlan_NetworkMode = string;

export type Plan_BuildCreatePlan_Networks = NonNullable<Shared_ContainerInspect['NetworkSettings']['Networks']>;

export type Plan_BuildCreatePlan_ExtraNetworks = Shared_CreatePlan_ExtraNetwork[];

export type Plan_BuildCreatePlan_EndpointsConfig = Record<string, unknown>;

export type Plan_BuildCreatePlan_NetworkName = string;

export type Plan_BuildCreatePlan_Endpoint = Plan_BuildCreatePlan_Networks[string];

export type Plan_BuildCreatePlan_NetworkNames = Plan_BuildCreatePlan_NetworkName[];

export type Plan_BuildCreatePlan_PrimaryNetwork = string | undefined;

export type Plan_BuildCreatePlan_CopiedEndpoint = Record<string, unknown>;

/**
 * Plan - Copy Endpoint.
 *
 * @since 0.0.1
 */
export type Plan_CopyEndpoint_Endpoint = Plan_BuildCreatePlan_Networks[string];

export type Plan_CopyEndpoint_ShortId = string;

export type Plan_CopyEndpoint_IncludeAliases = boolean;

export type Plan_CopyEndpoint_Returns = Record<string, unknown>;

export type Plan_CopyEndpoint_Alias = string;

export type Plan_CopyEndpoint_Aliases = Plan_CopyEndpoint_Alias[];

/**
 * Plan - Drop Image Defaults.
 *
 * @since 0.0.1
 */
export type Plan_DropImageDefaults_Config = Shared_ContainerConfig;

export type Plan_DropImageDefaults_ImageConfig = Shared_ContainerConfig | undefined;

export type Plan_DropImageDefaults_Returns = Shared_ContainerConfig;

export type Plan_DropImageDefaults_Key = 'Cmd' | 'Entrypoint' | 'WorkingDir' | 'User' | 'Healthcheck' | 'StopSignal';

export type Plan_DropImageDefaults_Keys = Plan_DropImageDefaults_Key[];

/**
 * Plan - Drop Matching Keys.
 *
 * @since 0.0.1
 */
export type Plan_DropMatchingKeys_Values = Record<string, unknown>;

export type Plan_DropMatchingKeys_Defaults = Record<string, unknown>;

export type Plan_DropMatchingKeys_Returns = Record<string, unknown>;

export type Plan_DropMatchingKeys_Kept = Record<string, unknown>;

export type Plan_DropMatchingKeys_Key = string;

export type Plan_DropMatchingKeys_Value = unknown;

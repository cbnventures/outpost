import type { Shared_ContainerConfig, Shared_ContainerInspect, Shared_CreatePlan } from './shared.d.ts';

/**
 * Plan - Build Create Plan.
 *
 * @since 0.0.1
 */
export type Plan_BuildCreatePlan_Container = Shared_ContainerInspect;

export type Plan_BuildCreatePlan_ImageConfig = Shared_ContainerConfig;

/**
 * Plan - Build Create Plan - Carries User Settings And Drops Image Defaults.
 *
 * @since 0.0.1
 */
export type Plan_BuildCreatePlan_CarriesUserSettingsAndDropsImageDefaults_Plan = Shared_CreatePlan;

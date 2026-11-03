import type { Config_LoadConfig_Settings } from './config.d.ts';
import type { Shared_RuntimeSettings } from './shared.d.ts';

/**
 * Config - Load Config - Applies Defaults.
 *
 * @since 0.0.1
 */
export type Config_LoadConfig_AppliesDefaults_Config = Config_LoadConfig_Settings;

/**
 * Config - Load Config - Reads Bootstrap Overrides.
 *
 * @since 0.0.1
 */
export type Config_LoadConfig_ReadsBootstrapOverrides_Config = Config_LoadConfig_Settings;

/**
 * Config - Runtime Settings - Applies Database Backed Values.
 *
 * @since 1.0.0
 */
export type Config_RuntimeSettings_AppliesDatabaseBackedValues_Config = Config_LoadConfig_Settings;

export type Config_RuntimeSettings_AppliesDatabaseBackedValues_Settings = Shared_RuntimeSettings;

/**
 * Config - Read Self ID - Uses Process Metadata.
 *
 * @since 1.0.0
 */
export type Config_ReadSelfId_UsesProcessMetadata_ContainerId = string;

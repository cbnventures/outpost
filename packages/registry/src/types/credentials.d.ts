import type { Shared_Credentials } from './shared.d.ts';

/**
 * Credentials - Encode Registry Auth.
 *
 * @since 0.0.1
 */
export type Credentials_EncodeRegistryAuth_Credentials = Shared_Credentials | undefined;

export type Credentials_EncodeRegistryAuth_Registry = string;

export type Credentials_EncodeRegistryAuth_Returns = string | undefined;

/**
 * Credentials - Normalize Registry Host.
 *
 * @since 1.0.0
 */
export type Credentials_NormalizeRegistryHost_Registry = string;

export type Credentials_NormalizeRegistryHost_Returns = string;

export type Credentials_NormalizeRegistryHost_Host = string;

export type Credentials_NormalizeRegistryHost_SlashIndex = number;

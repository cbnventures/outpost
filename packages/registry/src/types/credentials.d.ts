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
 * Credentials - Find Credentials.
 *
 * @since 0.0.1
 */
export type Credentials_FindCredentials_ConfigPath = string;

export type Credentials_FindCredentials_Registry = string;

export type Credentials_FindCredentials_Returns = Shared_Credentials | undefined;

export type Credentials_FindCredentials_Entry_Auth = string | undefined;

export type Credentials_FindCredentials_Entry_Username = string | undefined;

export type Credentials_FindCredentials_Entry_Password = string | undefined;

export type Credentials_FindCredentials_Entry = {
  auth?: Credentials_FindCredentials_Entry_Auth;
  username?: Credentials_FindCredentials_Entry_Username;
  password?: Credentials_FindCredentials_Entry_Password;
} | undefined;

export type Credentials_FindCredentials_Auths = Record<string, Credentials_FindCredentials_Entry>;

export type Credentials_FindCredentials_Candidate = string;

export type Credentials_FindCredentials_Candidates = Credentials_FindCredentials_Candidate[];

export type Credentials_FindCredentials_Decoded = string;

export type Credentials_FindCredentials_SeparatorIndex = number;

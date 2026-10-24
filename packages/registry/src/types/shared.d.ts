/**
 * Shared - Credentials.
 *
 * @since 0.0.1
 */
export type Shared_Credentials_Username = string;

export type Shared_Credentials_Password = string;

export type Shared_Credentials = {
  username: Shared_Credentials_Username;
  password: Shared_Credentials_Password;
};

/**
 * Shared - Image Reference.
 *
 * @since 0.0.1
 */
export type Shared_ImageReference_Registry = string;

export type Shared_ImageReference_Repository = string;

export type Shared_ImageReference_Tag = string;

export type Shared_ImageReference_Digest = string | undefined;

export type Shared_ImageReference = {
  registry: Shared_ImageReference_Registry;
  repository: Shared_ImageReference_Repository;
  tag: Shared_ImageReference_Tag;
  digest: Shared_ImageReference_Digest;
};

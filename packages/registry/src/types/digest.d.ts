import type { z } from 'zod';

import type { tokenResponseSchema } from '../schema.js';
import type {
  Shared_Credentials,
  Shared_ImageReference,
  Shared_RemoteDigest,
} from './shared.d.ts';

/**
 * Digest - Fetch Function.
 *
 * @since 0.0.1
 */
export type Digest_FetchFunction = (input: string, init: RequestInit) => Promise<Response>;

/**
 * Digest - Challenge.
 *
 * @since 0.0.1
 */
export type Digest_Challenge_Scheme = string;

export type Digest_Challenge_Parameters = Map<string, string>;

export type Digest_Challenge = {
  scheme: Digest_Challenge_Scheme;
  parameters: Digest_Challenge_Parameters;
};

/**
 * Digest - Fetch Remote Digest.
 *
 * @since 0.0.1
 */
export type Digest_FetchRemoteDigest_Reference = string;

export type Digest_FetchRemoteDigest_Credentials = Shared_Credentials | undefined;

export type Digest_FetchRemoteDigest_FetchFunction = Digest_FetchFunction;

export type Digest_FetchRemoteDigest_Returns = Promise<Shared_RemoteDigest>;

export type Digest_FetchRemoteDigest_Target = Shared_ImageReference;

export type Digest_FetchRemoteDigest_ManifestUrl = string;

export type Digest_FetchRemoteDigest_Response = Response;

export type Digest_FetchRemoteDigest_Challenge = Digest_Challenge;

export type Digest_FetchRemoteDigest_Authorization = string | undefined;

export type Digest_FetchRemoteDigest_Token = string | undefined;

export type Digest_FetchRemoteDigest_Digest = string | null;

/**
 * Digest - Parse Challenge.
 *
 * @since 0.0.1
 */
export type Digest_ParseChallenge_Header = string;

export type Digest_ParseChallenge_Returns = Digest_Challenge;

export type Digest_ParseChallenge_Parameters = Map<string, string>;

export type Digest_ParseChallenge_Cursor = number;

export type Digest_ParseChallenge_EqualsIndex = number;

export type Digest_ParseChallenge_ClosingIndex = number;

export type Digest_ParseChallenge_Key = string;

export type Digest_ParseChallenge_Scheme = string;

/**
 * Digest - Request Bearer Token.
 *
 * @since 0.0.1
 */
export type Digest_RequestBearerToken_Challenge = Digest_Challenge;

export type Digest_RequestBearerToken_Credentials = Shared_Credentials | undefined;

export type Digest_RequestBearerToken_FetchFunction = Digest_FetchFunction;

export type Digest_RequestBearerToken_Returns = Promise<string | undefined>;

export type Digest_RequestBearerToken_Realm = string | undefined;

export type Digest_RequestBearerToken_TokenUrl = URL;

export type Digest_RequestBearerToken_ParameterValue = string | undefined;

export type Digest_RequestBearerToken_Response = Response;

export type Digest_RequestBearerToken_Token = z.infer<typeof tokenResponseSchema>;

export type Digest_RequestBearerToken_TokenValue = string | undefined;

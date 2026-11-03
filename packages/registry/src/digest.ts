import { parseImageReference } from './reference.js';
import { tokenResponseSchema } from './schema.js';

import type {
  Digest_FetchRemoteDigest_Authorization,
  Digest_FetchRemoteDigest_Challenge,
  Digest_FetchRemoteDigest_Credentials,
  Digest_FetchRemoteDigest_Digest,
  Digest_FetchRemoteDigest_FetchFunction,
  Digest_FetchRemoteDigest_ManifestUrl,
  Digest_FetchRemoteDigest_Reference,
  Digest_FetchRemoteDigest_Response,
  Digest_FetchRemoteDigest_Returns,
  Digest_FetchRemoteDigest_Target,
  Digest_FetchRemoteDigest_Token,
  Digest_ParseChallenge_ClosingIndex,
  Digest_ParseChallenge_Cursor,
  Digest_ParseChallenge_EqualsIndex,
  Digest_ParseChallenge_Header,
  Digest_ParseChallenge_Key,
  Digest_ParseChallenge_Parameters,
  Digest_ParseChallenge_Returns,
  Digest_ParseChallenge_Scheme,
  Digest_RequestBearerToken_Challenge,
  Digest_RequestBearerToken_Credentials,
  Digest_RequestBearerToken_FetchFunction,
  Digest_RequestBearerToken_ParameterValue,
  Digest_RequestBearerToken_Realm,
  Digest_RequestBearerToken_Response,
  Digest_RequestBearerToken_Returns,
  Digest_RequestBearerToken_Token,
  Digest_RequestBearerToken_TokenUrl,
  Digest_RequestBearerToken_TokenValue,
} from './types/digest.d.ts';

/**
 * Digest - Manifest Accept.
 *
 * Media types accepted for manifest lookups. Including the index types
 * makes the registry return the multi-platform digest that Docker records
 * in RepoDigests when an image is pulled by tag.
 *
 * @since 0.0.1
 */
const manifestAccept = [
  'application/vnd.oci.image.index.v1+json',
  'application/vnd.docker.distribution.manifest.list.v2+json',
  'application/vnd.oci.image.manifest.v1+json',
  'application/vnd.docker.distribution.manifest.v2+json',
].join(', ');

/**
 * Digest - Fetch Remote Digest.
 *
 * Asks the registry for the current manifest digest of an image tag with
 * a HEAD request, answering its auth challenge. A registry that has no
 * such image, or won't show it, is reported instead of thrown.
 *
 * @param {Digest_FetchRemoteDigest_Reference}     reference     - Reference.
 * @param {Digest_FetchRemoteDigest_Credentials}   credentials   - Credentials.
 * @param {Digest_FetchRemoteDigest_FetchFunction} fetchFunction - Fetch function.
 *
 * @returns {Digest_FetchRemoteDigest_Returns}
 *
 * @since 0.0.1
 */
export async function fetchRemoteDigest(reference: Digest_FetchRemoteDigest_Reference, credentials: Digest_FetchRemoteDigest_Credentials, fetchFunction: Digest_FetchRemoteDigest_FetchFunction): Digest_FetchRemoteDigest_Returns {
  const target: Digest_FetchRemoteDigest_Target = parseImageReference(reference);
  const manifestUrl: Digest_FetchRemoteDigest_ManifestUrl = `https://${target['registry']}/v2/${target['repository']}/manifests/${target['tag']}`;
  let response: Digest_FetchRemoteDigest_Response = await fetchFunction(manifestUrl, {
    method: 'HEAD',
    headers: { Accept: manifestAccept },
  });

  if (response['status'] === 401) {
    const challenge: Digest_FetchRemoteDigest_Challenge = parseChallenge(response['headers'].get('WWW-Authenticate') ?? '');
    let authorization: Digest_FetchRemoteDigest_Authorization = undefined;

    if (challenge['scheme'] === 'bearer') {
      const token: Digest_FetchRemoteDigest_Token = await requestBearerToken(challenge, credentials, fetchFunction);

      authorization = (token !== undefined) ? `Bearer ${token}` : undefined;
    } else if (challenge['scheme'] === 'basic' && credentials !== undefined) {
      authorization = `Basic ${Buffer.from(`${credentials['username']}:${credentials['password']}`).toString('base64')}`;
    }

    if (authorization === undefined) {
      return {
        status: 'denied',
        digest: undefined,
      };
    }

    response = await fetchFunction(manifestUrl, {
      method: 'HEAD',
      headers: {
        Accept: manifestAccept,
        Authorization: authorization,
      },
    });
  }

  // Docker Hub answers 401 for a repository that doesn't exist, the same as for a private one.
  if (response['status'] === 401 || response['status'] === 403) {
    return {
      status: 'denied',
      digest: undefined,
    };
  }

  if (response['status'] === 404) {
    return {
      status: 'not-found',
      digest: undefined,
    };
  }

  if (response['ok'] === false) {
    throw new Error(`Registry "${target['registry']}" returned HTTP ${String(response['status'])} for "${target['repository']}:${target['tag']}".`);
  }

  const digest: Digest_FetchRemoteDigest_Digest = response['headers'].get('Docker-Content-Digest');

  return {
    status: 'found',
    digest: (digest !== null && digest !== '') ? digest : undefined,
  };
}

/**
 * Digest - Request Bearer Token.
 *
 * Exchanges an auth challenge for a short-lived pull token, using Basic
 * credentials when available. Returns undefined when access is refused.
 *
 * @param {Digest_RequestBearerToken_Challenge}     challenge     - Challenge.
 * @param {Digest_RequestBearerToken_Credentials}   credentials   - Credentials.
 * @param {Digest_RequestBearerToken_FetchFunction} fetchFunction - Fetch function.
 *
 * @returns {Digest_RequestBearerToken_Returns}
 *
 * @since 0.0.1
 */
async function requestBearerToken(challenge: Digest_RequestBearerToken_Challenge, credentials: Digest_RequestBearerToken_Credentials, fetchFunction: Digest_RequestBearerToken_FetchFunction): Digest_RequestBearerToken_Returns {
  const realm: Digest_RequestBearerToken_Realm = challenge['parameters'].get('realm');

  if (realm === undefined) {
    throw new Error('Registry auth challenge did not include a token realm.');
  }

  const tokenUrl: Digest_RequestBearerToken_TokenUrl = new URL(realm);

  for (const key of [
    'service',
    'scope',
  ]) {
    const parameterValue: Digest_RequestBearerToken_ParameterValue = challenge['parameters'].get(key);

    if (parameterValue !== undefined) {
      tokenUrl.searchParams.set(key, parameterValue);
    }
  }

  const response: Digest_RequestBearerToken_Response = await fetchFunction(tokenUrl.toString(), {
    headers: (credentials !== undefined) ? {
      Authorization: `Basic ${Buffer.from(`${credentials['username']}:${credentials['password']}`).toString('base64')}`,
    } : {},
  });

  if (response['status'] === 401 || response['status'] === 403) {
    return undefined;
  }

  if (response['ok'] === false) {
    throw new Error(`Registry token request failed with HTTP ${String(response['status'])}.`);
  }

  const token: Digest_RequestBearerToken_Token = tokenResponseSchema.parse(await response.json());
  const tokenValue: Digest_RequestBearerToken_TokenValue = token['token'] ?? token['access_token'];

  if (tokenValue === undefined) {
    throw new Error('Registry token response did not include a token.');
  }

  return tokenValue;
}

/**
 * Digest - Parse Challenge.
 *
 * Parses a WWW-Authenticate header into its scheme and key="value"
 * parameters (realm, service, scope).
 *
 * @param {Digest_ParseChallenge_Header} header - Header.
 *
 * @returns {Digest_ParseChallenge_Returns}
 *
 * @since 0.0.1
 */
export function parseChallenge(header: Digest_ParseChallenge_Header): Digest_ParseChallenge_Returns {
  const parameters: Digest_ParseChallenge_Parameters = new Map();
  let cursor: Digest_ParseChallenge_Cursor = header.indexOf(' ') + 1;

  // Walk key="value" pairs by hand; quoted values (like scopes) may contain commas.
  while (cursor > 0 && cursor < header.length) {
    const equalsIndex: Digest_ParseChallenge_EqualsIndex = header.indexOf('="', cursor);

    if (equalsIndex < 0) {
      break;
    }

    const closingIndex: Digest_ParseChallenge_ClosingIndex = header.indexOf('"', equalsIndex + 2);

    if (closingIndex < 0) {
      break;
    }

    const key: Digest_ParseChallenge_Key = header.slice(cursor, equalsIndex).replace(',', '').trim();

    parameters.set(key, header.slice(equalsIndex + 2, closingIndex));

    cursor = closingIndex + 1;
  }

  const scheme: Digest_ParseChallenge_Scheme = header.split(' ')[0] ?? '';

  return {
    scheme: scheme.toLowerCase(),
    parameters,
  };
}

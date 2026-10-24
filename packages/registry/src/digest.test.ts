import {
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { fetchRemoteDigest, parseChallenge } from './digest.js';

import type { Digest_FetchFunction } from './types/digest.d.ts';
import type {
  Digest_FetchRemoteDigest_AnswersBearerChallenges_Digest,
  Digest_FetchRemoteDigest_AnswersBearerChallenges_FetchFunction,
  Digest_ParseChallenge_ReadsQuotedParameters_Challenge,
} from './types/digest.test.d.ts';

/**
 * Digest - Parse Challenge.
 *
 * Confirms quoted parameter values that contain commas survive parsing,
 * as Docker Hub scopes do.
 *
 * @since 0.0.1
 */
describe('parseChallenge', () => {
  it('reads quoted parameters', () => {
    const challenge: Digest_ParseChallenge_ReadsQuotedParameters_Challenge = parseChallenge('Bearer realm="https://auth.test/token",service="registry.test",scope="repository:app:pull,push"');

    expect(challenge['scheme']).toBe('bearer');

    expect(challenge['parameters'].get('scope')).toBe('repository:app:pull,push');

    expect(challenge['parameters'].get('realm')).toBe('https://auth.test/token');

    return;
  });

  return;
});

/**
 * Digest - Fetch Remote Digest.
 *
 * Simulates a registry that answers the first HEAD with a Bearer
 * challenge and the retried HEAD with a digest header.
 *
 * @since 0.0.1
 */
describe('fetchRemoteDigest', () => {
  it('answers bearer challenges', async () => {
    const fetchFunction: Digest_FetchRemoteDigest_AnswersBearerChallenges_FetchFunction = vi.fn<Digest_FetchFunction>(async (input, init) => {
      if (input.startsWith('https://auth.test/token') === true) {
        return new Response(JSON.stringify({ token: 'abc' }));
      }

      if (new Headers(init.headers).get('Authorization') === 'Bearer abc') {
        return new Response(null, {
          status: 200,
          headers: { 'Docker-Content-Digest': 'sha256:new' },
        });
      }

      return new Response(null, {
        status: 401,
        headers: { 'WWW-Authenticate': 'Bearer realm="https://auth.test/token",service="registry.test",scope="repository:team/app:pull"' },
      });
    });
    const digest: Digest_FetchRemoteDigest_AnswersBearerChallenges_Digest = await fetchRemoteDigest('registry.test/team/app:1', undefined, fetchFunction);

    expect(digest).toBe('sha256:new');

    expect(fetchFunction).toHaveBeenCalledWith('https://auth.test/token?service=registry.test&scope=repository%3Ateam%2Fapp%3Apull', { headers: {} });

    return;
  });

  return;
});

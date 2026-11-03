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
  Digest_FetchRemoteDigest_ReportsMissingAndRefusedImages_FetchFunction,
  Digest_FetchRemoteDigest_ReportsMissingAndRefusedImages_Missing,
  Digest_FetchRemoteDigest_ReportsMissingAndRefusedImages_PrivateImage,
  Digest_FetchRemoteDigest_ReportsMissingAndRefusedImages_Unknown,
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
 * Simulates registries that answer the first HEAD with a Bearer challenge,
 * then with a digest, a refusal, or no such image.
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

    expect(digest).toStrictEqual({
      status: 'found',
      digest: 'sha256:new',
    });

    expect(fetchFunction).toHaveBeenCalledWith('https://auth.test/token?service=registry.test&scope=repository%3Ateam%2Fapp%3Apull', { headers: {} });

    return;
  });

  it('reports missing and refused images', async () => {
    const fetchFunction: Digest_FetchRemoteDigest_ReportsMissingAndRefusedImages_FetchFunction = vi.fn<Digest_FetchFunction>(async (input, init) => {
      // The token service refuses the private repository outright.
      if (input.startsWith('https://auth.test/token') === true) {
        return (input.includes('private') === true) ? new Response(null, { status: 401 }) : new Response(JSON.stringify({ token: 'abc' }));
      }

      if (input.includes('/team/missing/') === true) {
        return new Response(null, { status: 404 });
      }

      // Docker Hub's answer for a repository that doesn't exist, even with a token.
      if (new Headers(init.headers).get('Authorization') === 'Bearer abc') {
        return new Response(null, { status: 401 });
      }

      if (input.includes('/team/private/') === true) {
        return new Response(null, {
          status: 401,
          headers: { 'WWW-Authenticate': 'Bearer realm="https://auth.test/token",service="registry.test",scope="repository:team/private:pull"' },
        });
      }

      return new Response(null, {
        status: 401,
        headers: { 'WWW-Authenticate': 'Bearer realm="https://auth.test/token",service="registry.test",scope="repository:team/unknown:pull"' },
      });
    });
    const missing: Digest_FetchRemoteDigest_ReportsMissingAndRefusedImages_Missing = await fetchRemoteDigest('registry.test/team/missing:1', undefined, fetchFunction);
    const unknown: Digest_FetchRemoteDigest_ReportsMissingAndRefusedImages_Unknown = await fetchRemoteDigest('registry.test/team/unknown:1', undefined, fetchFunction);
    const privateImage: Digest_FetchRemoteDigest_ReportsMissingAndRefusedImages_PrivateImage = await fetchRemoteDigest('registry.test/team/private:1', undefined, fetchFunction);

    expect(missing).toStrictEqual({
      status: 'not-found',
      digest: undefined,
    });

    expect(unknown).toStrictEqual({
      status: 'denied',
      digest: undefined,
    });

    expect(privateImage).toStrictEqual({
      status: 'denied',
      digest: undefined,
    });

    return;
  });

  return;
});

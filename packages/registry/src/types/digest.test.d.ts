import type { Mock } from 'vitest';

import type { Digest_Challenge, Digest_FetchFunction } from './digest.d.ts';

/**
 * Digest - Fetch Remote Digest - Answers Bearer Challenges.
 *
 * @since 0.0.1
 */
export type Digest_FetchRemoteDigest_AnswersBearerChallenges_FetchFunction = Mock<Digest_FetchFunction>;

export type Digest_FetchRemoteDigest_AnswersBearerChallenges_Digest = string | undefined;

/**
 * Digest - Parse Challenge - Reads Quoted Parameters.
 *
 * @since 0.0.1
 */
export type Digest_ParseChallenge_ReadsQuotedParameters_Challenge = Digest_Challenge;

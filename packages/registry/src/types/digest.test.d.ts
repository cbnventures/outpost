import type { Mock } from 'vitest';

import type { Digest_Challenge, Digest_FetchFunction } from './digest.d.ts';
import type { Shared_RemoteDigest } from './shared.d.ts';

/**
 * Digest - Fetch Remote Digest - Answers Bearer Challenges.
 *
 * @since 0.0.1
 */
export type Digest_FetchRemoteDigest_AnswersBearerChallenges_FetchFunction = Mock<Digest_FetchFunction>;

export type Digest_FetchRemoteDigest_AnswersBearerChallenges_Digest = Shared_RemoteDigest;

/**
 * Digest - Fetch Remote Digest - Reports Missing And Refused Images.
 *
 * @since 1.0.0
 */
export type Digest_FetchRemoteDigest_ReportsMissingAndRefusedImages_FetchFunction = Mock<Digest_FetchFunction>;

export type Digest_FetchRemoteDigest_ReportsMissingAndRefusedImages_Missing = Shared_RemoteDigest;

export type Digest_FetchRemoteDigest_ReportsMissingAndRefusedImages_Unknown = Shared_RemoteDigest;

export type Digest_FetchRemoteDigest_ReportsMissingAndRefusedImages_PrivateImage = Shared_RemoteDigest;

/**
 * Digest - Parse Challenge - Reads Quoted Parameters.
 *
 * @since 0.0.1
 */
export type Digest_ParseChallenge_ReadsQuotedParameters_Challenge = Digest_Challenge;

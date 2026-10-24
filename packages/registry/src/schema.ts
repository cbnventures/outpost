import { z } from 'zod';

/**
 * Schema - Docker Config Schema.
 *
 * Validates the parts of a Docker client config.json that hold registry
 * credentials. Credential helpers are not supported by Outpost.
 *
 * @since 0.0.1
 */
export const dockerConfigSchema = z.looseObject({
  auths: z.record(z.string(), z.looseObject({
    auth: z.string().optional(),
    username: z.string().optional(),
    password: z.string().optional(),
    identitytoken: z.string().optional(),
  })).optional(),
});

/**
 * Schema - Token Response Schema.
 *
 * Validates the response of a registry token endpoint, which returns the
 * bearer token under either "token" or "access_token".
 *
 * @since 0.0.1
 */
export const tokenResponseSchema = z.looseObject({
  token: z.string().optional(),
  access_token: z.string().optional(),
});

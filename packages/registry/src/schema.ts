import { z } from 'zod';

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

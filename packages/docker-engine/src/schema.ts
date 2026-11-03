import { z } from 'zod';

/**
 * Schema - Container Summary Schema.
 *
 * Validates one entry of the container list endpoint. Only the fields
 * Outpost reads are declared; everything else is kept as-is.
 *
 * @since 0.0.1
 */
export const containerSummarySchema = z.looseObject({
  Id: z.string(),
  Names: z.array(z.string()),
  Image: z.string(),
  ImageID: z.string(),
  Labels: z.record(z.string(), z.string()).nullable().optional(),
  HostConfig: z.looseObject({
    NetworkMode: z.string().optional(),
    AutoRemove: z.boolean().optional(),
  }).optional(),
  State: z.string(),
});

/**
 * Schema - Container Summaries Schema.
 *
 * Validates the full response of the container list endpoint, an
 * array of container summaries.
 *
 * @since 0.0.1
 */
export const containerSummariesSchema = z.array(containerSummarySchema);

/**
 * Schema - Container Config Schema.
 *
 * Validates the creation-time config of a container or image. Unknown
 * keys are preserved because recreation must copy them verbatim.
 *
 * @since 0.0.1
 */
export const containerConfigSchema = z.looseObject({
  Image: z.string().optional(),
  Hostname: z.string().optional(),
  Env: z.array(z.string()).nullable().optional(),
  Labels: z.record(z.string(), z.string()).nullable().optional(),
  Cmd: z.array(z.string()).nullable().optional(),
  Entrypoint: z.array(z.string()).nullable().optional(),
  WorkingDir: z.string().optional(),
  User: z.string().optional(),
  ExposedPorts: z.record(z.string(), z.unknown()).nullable().optional(),
  Volumes: z.record(z.string(), z.unknown()).nullable().optional(),
  Healthcheck: z.unknown().optional(),
  StopSignal: z.string().optional(),
});

/**
 * Schema - Container Inspect Schema.
 *
 * Validates the inspect response of a container: identity, config,
 * host config, network attachments, mounts, and runtime state.
 *
 * @since 0.0.1
 */
export const containerInspectSchema = z.looseObject({
  Id: z.string(),
  Name: z.string(),
  Image: z.string(),
  Config: containerConfigSchema,
  HostConfig: z.looseObject({
    NetworkMode: z.string().optional(),
    AutoRemove: z.boolean().optional(),
  }),
  NetworkSettings: z.looseObject({
    Networks: z.record(z.string(), z.looseObject({
      Aliases: z.array(z.string()).nullable().optional(),
      IPAMConfig: z.unknown().optional(),
      Links: z.array(z.string()).nullable().optional(),
      DriverOpts: z.record(z.string(), z.string()).nullable().optional(),
    })).nullable().optional(),
  }),
  Mounts: z.array(z.looseObject({
    Type: z.string(),
    Name: z.string().optional(),
    Source: z.string().optional(),
    Destination: z.string(),
    RW: z.boolean().optional(),
  })).optional(),
  State: z.looseObject({
    Running: z.boolean(),
    Restarting: z.boolean().optional(),
    Status: z.string(),
    ExitCode: z.number().int().optional(),
    Health: z.looseObject({
      Status: z.string(),
    }).nullable().optional(),
  }),
  RestartCount: z.number().int().nonnegative().optional(),
});

/**
 * Schema - Image Inspect Schema.
 *
 * Validates the inspect response of an image, used to compare digests, to
 * tell pulled images from local builds, and to diff container config.
 *
 * @since 0.0.1
 */
export const imageInspectSchema = z.looseObject({
  Id: z.string(),
  RepoTags: z.array(z.string()).nullable().optional(),
  RepoDigests: z.array(z.string()).nullable().optional(),
  Config: containerConfigSchema.nullable().optional(),
  Descriptor: z.looseObject({}).nullable().optional(),
  Identity: z.looseObject({
    Build: z.array(z.looseObject({})).nullable().optional(),
    Pull: z.array(z.looseObject({})).nullable().optional(),
  }).nullable().optional(),
});

/**
 * Schema - Create Container Response Schema.
 *
 * Validates the response of the container create endpoint, which
 * returns the new container ID and any warnings.
 *
 * @since 0.0.1
 */
export const createContainerResponseSchema = z.looseObject({
  Id: z.string(),
  Warnings: z.array(z.string()).nullable().optional(),
});

/**
 * Schema - Error Response Schema.
 *
 * Validates the error body the Engine API returns for failed requests
 * so its message can be surfaced to the user.
 *
 * @since 0.0.1
 */
export const errorResponseSchema = z.object({
  message: z.string(),
});

/**
 * Schema - Pull Progress Schema.
 *
 * Validates one line of the streamed image pull progress, which carries
 * an error field when the pull fails part-way through.
 *
 * @since 0.0.1
 */
export const pullProgressSchema = z.looseObject({
  status: z.string().optional(),
  error: z.string().optional(),
});

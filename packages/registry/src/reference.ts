import type {
  Reference_ParseImageReference_AtIndex,
  Reference_ParseImageReference_Digest,
  Reference_ParseImageReference_FirstSegment,
  Reference_ParseImageReference_Name,
  Reference_ParseImageReference_Reference,
  Reference_ParseImageReference_Registry,
  Reference_ParseImageReference_Remainder,
  Reference_ParseImageReference_Repository,
  Reference_ParseImageReference_Returns,
  Reference_ParseImageReference_SlashIndex,
  Reference_ParseImageReference_Tag,
  Reference_ParseImageReference_TagIndex,
} from './types/reference.d.ts';

/**
 * Reference - Docker Hub Registry.
 *
 * Host that serves Docker Hub's registry API. Image references without a
 * registry host, or with "docker.io", resolve to it.
 *
 * @since 0.0.1
 */
export const DOCKER_HUB_REGISTRY = 'registry-1.docker.io';

/**
 * Reference - Parse Image Reference.
 *
 * Splits an image reference such as "nginx", "ghcr.io/org/app:1.2" or
 * "localhost:5000/app@sha256:..." into registry, repository, tag, and
 * digest, applying Docker Hub's defaults ("library/" and "latest").
 *
 * @param {Reference_ParseImageReference_Reference} reference - Reference.
 *
 * @returns {Reference_ParseImageReference_Returns}
 *
 * @since 0.0.1
 */
export function parseImageReference(reference: Reference_ParseImageReference_Reference): Reference_ParseImageReference_Returns {
  const atIndex: Reference_ParseImageReference_AtIndex = reference.indexOf('@');
  const digest: Reference_ParseImageReference_Digest = (atIndex >= 0) ? reference.slice(atIndex + 1) : undefined;
  const name: Reference_ParseImageReference_Name = (atIndex >= 0) ? reference.slice(0, atIndex) : reference;
  const slashIndex: Reference_ParseImageReference_SlashIndex = name.indexOf('/');
  const firstSegment: Reference_ParseImageReference_FirstSegment = (slashIndex >= 0) ? name.slice(0, slashIndex) : '';
  let registry: Reference_ParseImageReference_Registry = DOCKER_HUB_REGISTRY;
  let remainder: Reference_ParseImageReference_Remainder = name;

  // A first segment with a dot, a port, or "localhost" names a registry host.
  if (
    firstSegment !== ''
    && (
      firstSegment.includes('.') === true
      || firstSegment.includes(':') === true
      || firstSegment === 'localhost'
    )
  ) {
    registry = (firstSegment === 'docker.io' || firstSegment === 'index.docker.io') ? DOCKER_HUB_REGISTRY : firstSegment;
    remainder = name.slice(slashIndex + 1);
  }

  const tagIndex: Reference_ParseImageReference_TagIndex = remainder.lastIndexOf(':');
  const tag: Reference_ParseImageReference_Tag = (tagIndex >= 0) ? remainder.slice(tagIndex + 1) : 'latest';
  let repository: Reference_ParseImageReference_Repository = (tagIndex >= 0) ? remainder.slice(0, tagIndex) : remainder;

  if (registry === DOCKER_HUB_REGISTRY && repository.includes('/') === false) {
    repository = `library/${repository}`;
  }

  return {
    registry,
    repository,
    tag,
    digest,
  };
}

import { shortDigests } from '@/web/format.ts';

import type { ReactElement } from 'react';

import type { Web_ImageName_Props } from '@/types/web/image-name.d.ts';

// imageParts splits an image reference where a line may wrap: after each "/", before the
// tag's ":", and before an "@" digest, which stays in one piece.

/**
 * Image Name - Image parts.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 1.0.0
 */
const imageParts = (image: string): string[] => {
  const digestStart: number = image.indexOf('@');
  const name: string = (digestStart === -1) ? image : image.slice(0, digestStart);
  const parts: string[] = name.split(/(?<=\/)|(?=:)/u);

  return (digestStart === -1) ? parts : [
    ...parts,
    image.slice(digestStart),
  ];
};

// ImageName shows an image reference that wraps only between its parts, never inside a name
// like "home-assistant". Digests show their first 12 characters; the tooltip has the full name.

/**
 * Image Name.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
export const ImageName = ({
  className,
  image,
}: Web_ImageName_Props): ReactElement => (
  <span className={(className === undefined) ? 'image-name mono' : `image-name mono ${className}`} title={image}>
    {imageParts(shortDigests(image)).map((part: string, index: number): ReactElement => <span key={`${index}-${part}`}>{part}</span>)}
  </span>
);

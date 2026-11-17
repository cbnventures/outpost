import { Fragment } from 'react';

import { shortDigests } from '@/web/outpost-format.ts';

import type { ReactElement } from 'react';

import type {
  Web_ImageName_BreakableText_DisplayPart,
  Web_ImageName_BreakableText_PartTitle,
  Web_ImageName_BreakableText_Props,
  Web_ImageName_Props,
} from '@/types/web/image-name.d.ts';

// imageParts ends each token at a safe wrap point and keeps whitespace separate.
// A tag, digest, or path segment stays whole.

/**
 * Image Name - Image parts.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 1.0.0
 */
const imageParts = (image: string, breakAtNameSeparators: boolean): string[] => {
  const parts: string[] = [];
  let part: string = '';

  for (const character of image) {
    if (/\s/u.test(character)) {
      if (part !== '') {
        parts.push(part);
        part = '';
      }

      const lastPart: string | undefined = parts.at(-1);

      if (lastPart !== undefined && /^\s+$/u.test(lastPart)) {
        parts[parts.length - 1] = `${lastPart}${character}`;
      } else {
        parts.push(character);
      }

      continue;
    }

    part += character;

    if (
      character === '/'
      || character === ':'
      || character === '@'
      || (breakAtNameSeparators === true && (character === '-' || character === '_'))
    ) {
      parts.push(part);
      part = '';
    }
  }

  if (part !== '') {
    parts.push(part);
  }

  return parts.flatMap((value: string): string[] => value.split(/([0-9a-f]{64})/gu).filter((candidate: string): boolean => candidate !== ''));
};

/**
 * Image Name - Breakable text.
 *
 * Adds wrap opportunities after image delimiters. Ordinary spaces still wrap
 * naturally, while tags, digests, and path segments stay whole.
 *
 * @param {Web_ImageName_BreakableText_Props} props - Props.
 *
 * @returns {ReactElement}
 *
 * @since 1.1.0
 */
export const BreakableText = ({
  breakAtNameSeparators = false,
  className,
  text,
  title,
}: Web_ImageName_BreakableText_Props): ReactElement => (
  <span className={(className === undefined) ? 'breakable-text' : `breakable-text ${className}`} title={title ?? text}>
    {imageParts(text, breakAtNameSeparators).map((part: string, index: number, parts: string[]): ReactElement => {
      const displayPart: Web_ImageName_BreakableText_DisplayPart = shortDigests(part);
      const partTitle: Web_ImageName_BreakableText_PartTitle = (displayPart === part) ? undefined : part;

      return (
        <Fragment key={`${index}-${part}`}>
          {(/^\s+$/u.test(part)) ? part : <span data-full-value={partTitle} title={partTitle}>{displayPart}</span>}
          {((/[/:@]$/u.test(part) || (breakAtNameSeparators === true && /[-_]$/u.test(part))) && index < parts.length - 1) ? <wbr /> : null}
        </Fragment>
      );
    })}
  </span>
);

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
}: Web_ImageName_Props): ReactElement => <BreakableText className={(className === undefined) ? 'image-name mono' : `image-name mono ${className}`} text={image} title={image} />;

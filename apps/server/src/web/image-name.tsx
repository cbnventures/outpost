import { Fragment } from 'react';

import { shortDigests } from '@/web/outpost-format.ts';
import {
  digestSplitPattern,
  nameSeparatorEndPattern,
  whitespaceCharacterPattern,
  whitespaceOnlyPattern,
  wordSeparatorEndPattern,
} from '@/web/regex.js';

import type {
  Web_ImageName_BreakableText_BreakAfter,
  Web_ImageName_BreakableText_BreakAtNameSeparators,
  Web_ImageName_BreakableText_ClassName,
  Web_ImageName_BreakableText_DisplayPart,
  Web_ImageName_BreakableText_EndsAtDelimiter,
  Web_ImageName_BreakableText_EndsAtNameSeparator,
  Web_ImageName_BreakableText_PartTitle,
  Web_ImageName_BreakableText_Props,
  Web_ImageName_BreakableText_Returns,
  Web_ImageName_BreakableText_Text,
  Web_ImageName_BreakableText_Title,
  Web_ImageName_ImageName_ClassName,
  Web_ImageName_ImageName_Image,
  Web_ImageName_ImageName_Props,
  Web_ImageName_ImageName_Returns,
  Web_ImageName_ImageParts_BreakAtNameSeparators,
  Web_ImageName_ImageParts_Image,
  Web_ImageName_ImageParts_LastPart,
  Web_ImageName_ImageParts_Part,
  Web_ImageName_ImageParts_Parts,
  Web_ImageName_ImageParts_Returns,
} from '@/types/web/image-name.d.ts';

// imageParts ends each token at a safe wrap point and keeps whitespace separate.
// A tag, digest, or path segment stays whole.

/**
 * Image Name - Image Parts.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_ImageName_ImageParts_Image}                 image                 - Image.
 * @param {Web_ImageName_ImageParts_BreakAtNameSeparators} breakAtNameSeparators - Break at name separators.
 *
 * @returns {Web_ImageName_ImageParts_Returns}
 *
 * @since 1.0.0
 */
const imageParts = (image: Web_ImageName_ImageParts_Image, breakAtNameSeparators: Web_ImageName_ImageParts_BreakAtNameSeparators): Web_ImageName_ImageParts_Returns => {
  const parts: Web_ImageName_ImageParts_Parts = [];
  let part: Web_ImageName_ImageParts_Part = '';

  for (const character of image) {
    if (new RegExp(whitespaceCharacterPattern, 'u').test(character) === true) {
      if (part !== '') {
        parts.push(part);
        part = '';
      }

      const lastPart: Web_ImageName_ImageParts_LastPart = parts.at(-1);

      if (
        lastPart !== undefined
        && new RegExp(whitespaceOnlyPattern, 'u').test(lastPart) === true
      ) {
        Reflect.set(parts, parts.length - 1, `${lastPart}${character}`);
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
      || (
        breakAtNameSeparators === true
        && (
          character === '-'
          || character === '_'
        )
      )
    ) {
      parts.push(part);
      part = '';
    }
  }

  if (part !== '') {
    parts.push(part);
  }

  return parts.flatMap((value) => {
    return value.split(new RegExp(digestSplitPattern, 'gu')).filter((candidate) => candidate !== '');
  });
};

/**
 * Image Name - Breakable Text.
 *
 * Adds wrap opportunities after image delimiters. Ordinary spaces still wrap
 * naturally, while tags, digests, and path segments stay whole.
 *
 * @param {Web_ImageName_BreakableText_Props} props - Props.
 *
 * @returns {Web_ImageName_BreakableText_Returns}
 *
 * @since 1.1.0
 */
export const BreakableText = (props: Web_ImageName_BreakableText_Props): Web_ImageName_BreakableText_Returns => {
  const breakAtNameSeparators: Web_ImageName_BreakableText_BreakAtNameSeparators = props['breakAtNameSeparators'] ?? false;
  const className: Web_ImageName_BreakableText_ClassName = props['className'];
  const text: Web_ImageName_BreakableText_Text = props['text'];
  const title: Web_ImageName_BreakableText_Title = props['title'];

  return (
    <span className={(className === undefined) ? 'breakable-text' : `breakable-text ${className}`} title={title ?? text}>
      {imageParts(text, breakAtNameSeparators).map((part, index, parts) => {
        const displayPart: Web_ImageName_BreakableText_DisplayPart = shortDigests(part);
        const partTitle: Web_ImageName_BreakableText_PartTitle = (displayPart === part) ? undefined : part;
        const endsAtDelimiter: Web_ImageName_BreakableText_EndsAtDelimiter = new RegExp(nameSeparatorEndPattern, 'u').test(part);
        const endsAtNameSeparator: Web_ImageName_BreakableText_EndsAtNameSeparator = new RegExp(wordSeparatorEndPattern, 'u').test(part);
        const breakAfter: Web_ImageName_BreakableText_BreakAfter = (
          (
            endsAtDelimiter === true
            || (
              breakAtNameSeparators === true
              && endsAtNameSeparator === true
            )
          )
          && index < parts.length - 1
        );

        return (
          <Fragment key={`${index}-${part}`}>
            {(new RegExp(whitespaceOnlyPattern, 'u').test(part) === true) ? part : <span data-full-value={partTitle} title={partTitle}>{displayPart}</span>}
            {(breakAfter === true) ? <wbr /> : null}
          </Fragment>
        );
      })}
    </span>
  );
};

// ImageName shows an image reference that wraps only between its parts, never inside a name
// like "home-assistant". Digests show their first 12 characters; the tooltip has the full name.

/**
 * Image Name - Image Name.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @param {Web_ImageName_ImageName_Props} props - Props.
 *
 * @returns {Web_ImageName_ImageName_Returns}
 *
 * @since 1.0.0
 */
export const ImageName = (props: Web_ImageName_ImageName_Props): Web_ImageName_ImageName_Returns => {
  const className: Web_ImageName_ImageName_ClassName = props['className'];
  const image: Web_ImageName_ImageName_Image = props['image'];

  return <BreakableText className={(className === undefined) ? 'image-name mono' : `image-name mono ${className}`} text={image} title={image} />;
};

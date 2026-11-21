import type { ReactElement } from 'react';

/**
 * Image Name.
 *
 * @since 1.0.0
 */
export type Web_ImageName_BreakableText_Props = {
  breakAtNameSeparators?: boolean;
  className?: string;
  text: string;
  title?: string;
};
export type Web_ImageName_BreakableText_Returns = ReactElement;
export type Web_ImageName_BreakableText_BreakAtNameSeparators = boolean;
export type Web_ImageName_BreakableText_ClassName = string | undefined;
export type Web_ImageName_BreakableText_Text = string;
export type Web_ImageName_BreakableText_Title = string | undefined;
export type Web_ImageName_BreakableText_DisplayPart = string;
export type Web_ImageName_BreakableText_PartTitle = string | undefined;
export type Web_ImageName_BreakableText_EndsAtDelimiter = boolean;
export type Web_ImageName_BreakableText_EndsAtNameSeparator = boolean;
export type Web_ImageName_BreakableText_BreakAfter = boolean;

/**
 * Image Name.
 *
 * @since 1.2.1
 */
export type Web_ImageName_ImageName_Props = {
  className?: string;
  image: string;
};
export type Web_ImageName_ImageName_Returns = ReactElement;
export type Web_ImageName_ImageName_ClassName = string | undefined;
export type Web_ImageName_ImageName_Image = string;

/**
 * Image Name.
 *
 * @since 1.2.1
 */
export type Web_ImageName_ImageParts_Image = string;
export type Web_ImageName_ImageParts_BreakAtNameSeparators = boolean;
export type Web_ImageName_ImageParts_Returns = string[];
export type Web_ImageName_ImageParts_Parts = string[];
export type Web_ImageName_ImageParts_Part = string;
export type Web_ImageName_ImageParts_LastPart = string | undefined;

import type { Request } from 'express';
import type { z } from 'zod';

/**
 * Lib - HTTP - Cookies And Validation Issues - Points Each Validation Issue At Its Field.
 *
 * @since 1.0.0
 */
export type Lib_Http_CookiesAndValidationIssues_PointsEachValidationIssueAtItsField_Result_Data_Connection_Port = number;

export type Lib_Http_CookiesAndValidationIssues_PointsEachValidationIssueAtItsField_Result_Data_Connection = {
  port: Lib_Http_CookiesAndValidationIssues_PointsEachValidationIssueAtItsField_Result_Data_Connection_Port;
};

export type Lib_Http_CookiesAndValidationIssues_PointsEachValidationIssueAtItsField_Result_Data_Username = string;

export type Lib_Http_CookiesAndValidationIssues_PointsEachValidationIssueAtItsField_Result_Data = {
  connection: Lib_Http_CookiesAndValidationIssues_PointsEachValidationIssueAtItsField_Result_Data_Connection;
  username: Lib_Http_CookiesAndValidationIssues_PointsEachValidationIssueAtItsField_Result_Data_Username;
};

export type Lib_Http_CookiesAndValidationIssues_PointsEachValidationIssueAtItsField_Result = z.ZodSafeParseResult<Lib_Http_CookiesAndValidationIssues_PointsEachValidationIssueAtItsField_Result_Data>;

/**
 * Lib - HTTP - Create Request.
 *
 * @since 1.0.0
 */
export type Lib_Http_CreateRequest_Options_Headers = Record<string, string>;

export type Lib_Http_CreateRequest_Options_Ip = string | undefined;

export type Lib_Http_CreateRequest_Options_Protocol = string;

export type Lib_Http_CreateRequest_Options_RemoteAddress = string | undefined;

export type Lib_Http_CreateRequest_Options = {
  headers: Lib_Http_CreateRequest_Options_Headers;
  ip: Lib_Http_CreateRequest_Options_Ip;
  protocol: Lib_Http_CreateRequest_Options_Protocol;
  remoteAddress: Lib_Http_CreateRequest_Options_RemoteAddress;
};

export type Lib_Http_CreateRequest_Returns = Request;

export type Lib_Http_CreateRequest_Headers = Record<string, string | undefined>;

export type Lib_Http_CreateRequest_Name = string;

export type Lib_Http_CreateRequest_Unknown = unknown;

export type Lib_Http_CreateRequest_Request = Request;

/**
 * Lib - HTTP - Own Address Per Request - Builds The Passkey Origin And RP ID From The Visitor Scheme And Host.
 *
 * @since 1.0.0
 */
export type Lib_Http_OwnAddressPerRequest_BuildsThePasskeyOriginAndRpIdFromTheVisitorSchemeAndHost_Request = Request;

/**
 * Lib - HTTP - Own Address Per Request - Uses X Forwarded Host Only From A Trusted Proxy.
 *
 * @since 1.0.0
 */
export type Lib_Http_OwnAddressPerRequest_UsesXForwardedHostOnlyFromATrustedProxy_Headers = Record<string, string>;

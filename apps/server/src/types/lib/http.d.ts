import type { BlockList } from 'node:net';

import type { Request, Response } from 'express';
import type { z } from 'zod';

import type {
  Shared_ErrorIssue,
  Shared_ErrorIssues,
  Shared_WebauthnConfiguration,
} from '../shared.d.ts';

/**
 * Lib - HTTP - Build Cookie.
 *
 * @since 1.0.0
 */
export type Lib_Http_BuildCookie_Name = string;

export type Lib_Http_BuildCookie_Value = string;

export type Lib_Http_BuildCookie_Options_HttpOnly = boolean;

export type Lib_Http_BuildCookie_Options_MaxAge = number;

export type Lib_Http_BuildCookie_Options_Secure = boolean;

export type Lib_Http_BuildCookie_Options = {
  httpOnly: Lib_Http_BuildCookie_Options_HttpOnly;
  maxAge: Lib_Http_BuildCookie_Options_MaxAge;
  secure: Lib_Http_BuildCookie_Options_Secure;
};

export type Lib_Http_BuildCookie_Returns = string;

/**
 * Lib - HTTP - Create Trusted Proxy Ranges.
 *
 * @since 1.0.0
 */
export type Lib_Http_CreateTrustedProxyRanges_Returns = BlockList;

export type Lib_Http_CreateTrustedProxyRanges_Ranges = BlockList;

/**
 * Lib - HTTP - Expand Ipv6.
 *
 * @since 1.0.3
 */
export type Lib_Http_ExpandIpv6_Address = string;

export type Lib_Http_ExpandIpv6_Returns = number[];

export type Lib_Http_ExpandIpv6_Halves = string[];

export type Lib_Http_ExpandIpv6_Head = number[];

export type Lib_Http_ExpandIpv6_Tail = number[];

/**
 * Lib - HTTP - Get Client Address.
 *
 * @since 1.0.0
 */
export type Lib_Http_GetClientAddress_Request = Request;

export type Lib_Http_GetClientAddress_Returns = string;

export type Lib_Http_GetClientAddress_Address = string | undefined;

/**
 * Lib - HTTP - Get Client Limit Key.
 *
 * @since 1.0.3
 */
export type Lib_Http_GetClientLimitKey_Request = Request;

export type Lib_Http_GetClientLimitKey_Returns = string;

export type Lib_Http_GetClientLimitKey_Address = string;

/**
 * Lib - HTTP - Get Request Host.
 *
 * @since 1.0.0
 */
export type Lib_Http_GetRequestHost_Request = Request;

export type Lib_Http_GetRequestHost_Returns = string;

export type Lib_Http_GetRequestHost_ForwardedHost = string | undefined;

export type Lib_Http_GetRequestHost_Host = string;

/**
 * Lib - HTTP - Get Request Hostname.
 *
 * @since 1.0.0
 */
export type Lib_Http_GetRequestHostname_Request = Request;

export type Lib_Http_GetRequestHostname_Returns = string;

export type Lib_Http_GetRequestHostname_Host = string;

export type Lib_Http_GetRequestHostname_PortIndex = number;

/**
 * Lib - HTTP - Get Request Origin.
 *
 * @since 1.0.0
 */
export type Lib_Http_GetRequestOrigin_Request = Request;

export type Lib_Http_GetRequestOrigin_Returns = string;

/**
 * Lib - HTTP - Get Request Scheme.
 *
 * @since 1.0.0
 */
export type Lib_Http_GetRequestScheme_Request = Request;

export type Lib_Http_GetRequestScheme_Returns = 'http' | 'https';

/**
 * Lib - HTTP - Get Validation Issues.
 *
 * @since 1.0.0
 */
export type Lib_Http_GetValidationIssues_Error = z.ZodError;

export type Lib_Http_GetValidationIssues_Returns = Shared_ErrorIssues;

export type Lib_Http_GetValidationIssues_PathSegment = string;

export type Lib_Http_GetValidationIssues_Path = Lib_Http_GetValidationIssues_PathSegment[];

/**
 * Lib - HTTP - Get Webauthn Configuration.
 *
 * @since 1.0.0
 */
export type Lib_Http_GetWebauthnConfiguration_Request = Request;

export type Lib_Http_GetWebauthnConfiguration_RpName = string;

export type Lib_Http_GetWebauthnConfiguration_Returns = Shared_WebauthnConfiguration;

/**
 * Lib - HTTP - Ipv6 Limit Prefix Length.
 *
 * @since 1.0.3
 */
export type Lib_Http_Ipv6LimitPrefixLength = number;

/**
 * Lib - HTTP - Is Passkey Available.
 *
 * @since 1.0.0
 */
export type Lib_Http_IsPasskeyAvailable_Request = Request;

export type Lib_Http_IsPasskeyAvailable_Returns = boolean;

export type Lib_Http_IsPasskeyAvailable_Hostname = string;

export type Lib_Http_IsPasskeyAvailable_UnbracketedHostname = string;

/**
 * Lib - HTTP - Is Trusted Proxy Address.
 *
 * @since 1.0.0
 */
export type Lib_Http_IsTrustedProxyAddress_Address = string | undefined;

export type Lib_Http_IsTrustedProxyAddress_Returns = boolean;

export type Lib_Http_IsTrustedProxyAddress_NormalizedAddress = string;

/**
 * Lib - HTTP - Normalize Address.
 *
 * @since 1.0.0
 */
export type Lib_Http_NormalizeAddress_Address = string;

export type Lib_Http_NormalizeAddress_Returns = string;

export type Lib_Http_NormalizeAddress_Unmapped = string;

/**
 * Lib - HTTP - Read Cookie.
 *
 * @since 1.0.0
 */
export type Lib_Http_ReadCookie_Request = Request;

export type Lib_Http_ReadCookie_Name = string;

export type Lib_Http_ReadCookie_Returns = string | undefined;

export type Lib_Http_ReadCookie_CookieHeader = string | undefined;

export type Lib_Http_ReadCookie_CookiePrefix = string;

export type Lib_Http_ReadCookie_Match = string | undefined;

/**
 * Lib - HTTP - Send Error.
 *
 * @since 1.0.0
 */
export type Lib_Http_SendError_Response = Response;

export type Lib_Http_SendError_Status = number;

export type Lib_Http_SendError_Code = string;

export type Lib_Http_SendError_Message = string;

export type Lib_Http_SendError_Issues = Shared_ErrorIssues;

export type Lib_Http_SendError_Returns = void;

/**
 * Lib - HTTP - Send Validation Error.
 *
 * @since 1.0.0
 */
export type Lib_Http_SendValidationError_Response = Response;

export type Lib_Http_SendValidationError_Status = number;

export type Lib_Http_SendValidationError_Error = z.ZodError;

export type Lib_Http_SendValidationError_Message = string;

export type Lib_Http_SendValidationError_Returns = void;

export type Lib_Http_SendValidationError_Issues = Shared_ErrorIssues;

export type Lib_Http_SendValidationError_FirstIssue = Shared_ErrorIssue | undefined;

/**
 * Lib - HTTP - To Ipv6 Groups.
 *
 * @since 1.0.3
 */
export type Lib_Http_ToIpv6Groups_Part = string | undefined;

export type Lib_Http_ToIpv6Groups_Returns = number[];

/**
 * Lib - HTTP - To Ipv6 Network.
 *
 * @since 1.0.3
 */
export type Lib_Http_ToIpv6Network_Address = string;

export type Lib_Http_ToIpv6Network_PrefixLength = number;

export type Lib_Http_ToIpv6Network_Returns = string;

export type Lib_Http_ToIpv6Network_Network = number[];

export type Lib_Http_ToIpv6Network_KeptBits = number;

export type Lib_Http_ToIpv6Network_Hostname = string;

/**
 * Lib - HTTP - Trusted Proxy Ranges.
 *
 * @since 1.0.0
 */
export type Lib_Http_TrustedProxyRanges = BlockList;

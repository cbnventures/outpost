import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';

import type { Mock } from 'vitest';

import type { Admin_BuildContainerRows_Returns } from './admin.d.ts';

/**
 * Admin - Build Container Rows - Marks Managed And Excluded Containers.
 *
 * @since 0.0.1
 */
export type Admin_BuildContainerRows_MarksManagedAndExcludedContainers_Rows = Admin_BuildContainerRows_Returns;

/**
 * Admin - Dashboard.
 *
 * @since 0.0.1
 */
export type Admin_Dashboard_PublicDirectory = string;

export type Admin_Dashboard_Trigger = Mock<(containerIds?: string[]) => boolean>;

export type Admin_Dashboard_Server = Server;

export type Admin_Dashboard_BaseUrl_Value = string;

export type Admin_Dashboard_BaseUrl = {
  value: Admin_Dashboard_BaseUrl_Value;
};

export type Admin_Dashboard_Address = AddressInfo | string | null;

/**
 * Admin - Dashboard - Serves The Page With Security Headers.
 *
 * @since 0.0.1
 */
export type Admin_Dashboard_ServesThePageWithSecurityHeaders_Response = Response;

/**
 * Admin - Dashboard - Signs In And Protects Changes.
 *
 * @since 0.0.1
 */
export type Admin_Dashboard_SignsInAndProtectsChanges_Login = Response;

export type Admin_Dashboard_SignsInAndProtectsChanges_Cookie = string;

export type Admin_Dashboard_SignsInAndProtectsChanges_Session = Record<string, unknown>;

/**
 * Admin - Read Session ID - Finds The Session Cookie.
 *
 * @since 0.0.1
 */
export type Admin_ReadSessionId_FindsTheSessionCookie_SessionId = string | undefined;

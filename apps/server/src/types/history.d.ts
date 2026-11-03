import type { z } from 'zod';

import type { Shared_CheckReport, Shared_CheckReports } from './shared.d.ts';

/**
 * History.
 *
 * @since 0.0.1
 */
export type History_Runner_FilePath = string;

export type History_Runner_Limit = number;

export type History_Runner_Reports = Shared_CheckReports;

/**
 * History - Add.
 *
 * @since 0.0.1
 */
export type History_Runner_Add_Report = Shared_CheckReport;

export type History_Runner_Add_Returns = void;

/**
 * History - Constructor.
 *
 * @since 0.0.1
 */
export type History_Runner_Constructor_FilePath = string;

export type History_Runner_Constructor_Limit = number;

/**
 * History - List.
 *
 * @since 0.0.1
 */
export type History_Runner_List_Returns = Shared_CheckReports;

/**
 * History - Load.
 *
 * @since 0.0.1
 */
export type History_Runner_Load_Returns = Shared_CheckReports;

export type History_Runner_Load_Parsed = z.ZodSafeParseResult<Shared_CheckReports>;

/**
 * History - Save.
 *
 * @since 0.0.1
 */
export type History_Runner_Save_Returns = void;

export type History_Runner_Save_TemporaryPath = string;

export type History_Runner_Save_ErrorMessage = string;

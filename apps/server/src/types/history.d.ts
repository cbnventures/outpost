import type { UpdateReport } from 'outpost-package-updater';
import type { z } from 'zod';

/**
 * History.
 *
 * @since 0.0.1
 */
export type History_Runner_FilePath = string;

export type History_Runner_Limit = number;

export type History_Runner_Reports = UpdateReport[];

/**
 * History - Add.
 *
 * @since 0.0.1
 */
export type History_Runner_Add_Report = UpdateReport;

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
export type History_Runner_List_Returns = UpdateReport[];

/**
 * History - Load.
 *
 * @since 0.0.1
 */
export type History_Runner_Load_Returns = UpdateReport[];

export type History_Runner_Load_Parsed = z.ZodSafeParseResult<UpdateReport[]>;

/**
 * History - Save.
 *
 * @since 0.0.1
 */
export type History_Runner_Save_Returns = void;

export type History_Runner_Save_TemporaryPath = string;

export type History_Runner_Save_ErrorMessage = string;

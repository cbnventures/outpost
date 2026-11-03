import type { Runner as Handoff } from '../handoff.js';
import type { Handoff_Pending } from './handoff.d.ts';

/**
 * Handoff.
 *
 * @since 1.0.0
 */
export type Handoff_Directory = string;

/**
 * Handoff - Handoff - Ignores Damaged Or Unknown Files.
 *
 * @since 1.0.0
 */
export type Handoff_Handoff_IgnoresDamagedOrUnknownFiles_FilePath = string;

export type Handoff_Handoff_IgnoresDamagedOrUnknownFiles_Handoff = Handoff;

/**
 * Handoff - Handoff - Keeps And Settles An Update In Progress.
 *
 * @since 1.0.0
 */
export type Handoff_Handoff_KeepsAndSettlesAnUpdateInProgress_FilePath = string;

export type Handoff_Handoff_KeepsAndSettlesAnUpdateInProgress_Handoff = Handoff;

export type Handoff_Handoff_KeepsAndSettlesAnUpdateInProgress_Pending = Handoff_Pending;

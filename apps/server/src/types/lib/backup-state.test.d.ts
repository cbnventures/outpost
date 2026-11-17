import type { DatabaseSync } from 'node:sqlite';

import type { Runner as State } from '../../lib/state.js';
import type { Shared_RuntimeSettings } from '../shared.d.ts';
import type {
  Lib_Backup_Document,
  Lib_Backup_ImportResult,
} from './backup.d.ts';
import type {
  Lib_State_Runner_CreateToken_Returns,
  Lib_State_Runner_PrepareSetupClaim_Returns,
} from './state.d.ts';

export type Lib_BackupStateTest_Directory = string;
export type Lib_BackupStateTest_State = State;
export type Lib_BackupStateTest_Settings = Shared_RuntimeSettings;
export type Lib_BackupStateTest_Document = Lib_Backup_Document;
export type Lib_BackupStateTest_Result = Lib_Backup_ImportResult;
export type Lib_BackupStateTest_Serialized = string;
export type Lib_BackupStateTest_CreatedToken = Lib_State_Runner_CreateToken_Returns;
export type Lib_BackupStateTest_SetupClaim = Lib_State_Runner_PrepareSetupClaim_Returns;
export type Lib_BackupStateTest_Database = DatabaseSync;

import type { GrantStore } from '../../lib/backup.js';
import type {
  Lib_Backup_Document,
  Lib_Backup_Grant,
} from './backup.d.ts';

export type Lib_BackupTest_Document = Lib_Backup_Document;
export type Lib_BackupTest_Grant = Lib_Backup_Grant;
export type Lib_BackupTest_Now = number;
export type Lib_BackupTest_Store = GrantStore;
export type Lib_BackupTest_UnknownDocument = Record<string, unknown>;

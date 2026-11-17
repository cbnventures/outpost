import type { ZodType } from 'zod';

import type {
  Shared_PersonalAccessTokenScope,
  Shared_RuntimeSettings,
} from '../shared.d.ts';
import type {
  Lib_Notifications_Field,
  Lib_Notifications_NotificationInputSchema_Returns,
  Lib_Notifications_Service,
} from './notifications.d.ts';

export type Lib_Backup_Purpose = 'export' | 'import';

export type Lib_Backup_ExportSections = {
  accessTokens: boolean;
  notifications: boolean;
  registries: boolean;
  settings: boolean;
};

export type Lib_Backup_Registry = {
  id: string;
  password: string | null;
  registry: string;
  username: string;
};

export type Lib_Backup_Notification = {
  events: string[];
  id: string;
  missingSecrets: string[];
  name: string;
  secrets: Record<string, string>;
  service: Lib_Notifications_Service;
  settings: Record<string, string>;
};

export type Lib_Backup_AccessToken = {
  createdAt: string;
  expiresAt: string | null;
  id: string;
  lastUsedAt: string | null;
  name: string;
  scopes: Shared_PersonalAccessTokenScope[];
  tokenHash: string;
};

export type Lib_Backup_Document = {
  accessTokens?: Lib_Backup_AccessToken[] | undefined;
  appVersion: string;
  exportedAt: string;
  format: 'outpost-export';
  notifications?: Lib_Backup_Notification[] | undefined;
  registries?: Lib_Backup_Registry[] | undefined;
  settings?: Shared_RuntimeSettings | undefined;
  version: 1;
};

export type Lib_Backup_SectionId = 'settings' | 'registries' | 'notifications' | 'accessTokens';

export type Lib_Backup_ImportSectionPreview = {
  file: string;
  here: string;
  id: Lib_Backup_SectionId;
  label: string;
  reason?: string | undefined;
  willImport: boolean;
};

export type Lib_Backup_ImportSummary = {
  accessTokens: {
    added: number;
    skipped: number;
  };
  notifications: {
    added: number;
    replaced: number;
  };
  registries: {
    added: number;
    replaced: number;
  };
  settings: {
    changed: number;
  };
};

export type Lib_Backup_ImportPreview = {
  appVersion: string;
  exportedAt: string;
  sections: Lib_Backup_ImportSectionPreview[];
  summary: Lib_Backup_ImportSummary;
};

export type Lib_Backup_ImportResult = Lib_Backup_ImportSummary & {
  importedSections: Lib_Backup_SectionId[];
};

export type Lib_Backup_Schema<Value> = ZodType<Value>;
export type Lib_Backup_DocumentSchema = ZodType<Lib_Backup_Document>;

export type Lib_Backup_Grant = {
  expiresAt: string;
  grant: string;
};

export type Lib_Backup_GrantRecord = {
  expiresAt: number;
  purpose: Lib_Backup_Purpose;
  sessionId: string;
};

export type Lib_Backup_GrantStore_Clock = () => number;
export type Lib_Backup_GrantStore_Grants = Map<string, Lib_Backup_GrantRecord>;
export type Lib_Backup_GrantStore_Issue_Returns = Lib_Backup_Grant;
export type Lib_Backup_GrantStore_Consume_Returns = boolean;
export type Lib_Backup_GrantStore_Prune_Returns = void;
export type Lib_Backup_GrantStore_DurationMilliseconds = number;
export type Lib_Backup_GrantStore_SessionId = string;
export type Lib_Backup_GrantStore_Grant = string;
export type Lib_Backup_GrantStore_Now = number;
export type Lib_Backup_GrantStore_ExpiresAt = number;
export type Lib_Backup_GrantStore_Digest = string;
export type Lib_Backup_GrantStore_Record = Lib_Backup_GrantRecord | undefined;
export type Lib_Backup_GrantStore_Entry = [string, Lib_Backup_GrantRecord];

export type Lib_Backup_NotificationEventKeys = [string, ...string[]];
export type Lib_Backup_StringMapSchema = ZodType<Record<string, string>>;
export type Lib_Backup_NotificationSchema = ZodType<Lib_Backup_Notification>;
export type Lib_Backup_NotificationRefinement = Parameters<Lib_Backup_NotificationSchema['superRefine']>[0];
export type Lib_Backup_DocumentRefinement = Parameters<Lib_Backup_Schema<Lib_Backup_Document>['superRefine']>[0];
export type Lib_Backup_NotificationEvents = string[];
export type Lib_Backup_IsUnique = boolean;
export type Lib_Backup_NotificationEventsPredicate = (events: Lib_Backup_NotificationEvents) => Lib_Backup_IsUnique;
export type Lib_Backup_AccessTokenScopes = Lib_Backup_AccessToken['scopes'];
export type Lib_Backup_AccessTokenScopesPredicate = (scopes: Lib_Backup_AccessTokenScopes) => Lib_Backup_IsUnique;
export type Lib_Backup_NotificationFields = Lib_Notifications_Field[];
export type Lib_Backup_NotificationFieldPredicate = (field: Lib_Notifications_Field) => boolean;
export type Lib_Backup_NotificationFieldMapper = (field: Lib_Notifications_Field) => string;
export type Lib_Backup_StringSet = Set<string>;
export type Lib_Backup_ParsedNotification = ReturnType<Lib_Notifications_NotificationInputSchema_Returns['safeParse']>;
export type Lib_Backup_NotificationMapper = (notification: Lib_Backup_Notification) => string;
export type Lib_Backup_RegistryMapper = (registry: Lib_Backup_Registry) => string;
export type Lib_Backup_AccessTokenMapper = (token: Lib_Backup_AccessToken) => string;
export type Lib_Backup_StringList = string[];
export type Lib_Backup_ParseBackupDocument_Value = unknown;
export type Lib_Backup_ParseBackupDocument_Returns = Lib_Backup_Document;
export type Lib_Backup_GetPackageVersion_PackageJsonRaw = string;
export type Lib_Backup_GetPackageVersion_PackageJson = unknown;
export type Lib_Backup_GetPackageVersion_Version = unknown;
export type Lib_Backup_GetPackageVersion_Returns = string;

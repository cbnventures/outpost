import type { Web_Api_RuntimeSettings } from './api.d.ts';
import type { Web_BackupComponents_ImportProgressJob } from './backup-components.d.ts';
import type { Web_Notifications_Service } from './notifications.d.ts';

export type Web_Backup_Purpose = 'export' | 'import';
export type Web_Backup_ExportSections = {
  accessTokens: boolean;
  notifications: boolean;
  registries: boolean;
  settings: boolean;
};
export type Web_Backup_Registry = {
  id: string;
  password: string | null;
  registry: string;
  username: string;
};
export type Web_Backup_Notification = {
  events: string[];
  id: string;
  missingSecrets: string[];
  name: string;
  secrets: Record<string, string>;
  service: Web_Notifications_Service;
  settings: Record<string, string>;
};
export type Web_Backup_AccessToken = {
  createdAt: string;
  expiresAt: string | null;
  id: string;
  lastUsedAt: string | null;
  name: string;
  scopes: Array<'metrics:read' | 'status:read' | 'updates:run'>;
  tokenHash: string;
};
export type Web_Backup_Document = {
  accessTokens?: Web_Backup_AccessToken[] | undefined;
  appVersion: string;
  exportedAt: string;
  format: 'outpost-export';
  notifications?: Web_Backup_Notification[] | undefined;
  registries?: Web_Backup_Registry[] | undefined;
  settings?: Web_Api_RuntimeSettings | undefined;
  version: 1;
};
export type Web_Backup_Grant = {
  expiresAt: string;
  grant: string;
};
export type Web_Backup_SectionId = 'settings' | 'registries' | 'notifications' | 'accessTokens';
export type Web_Backup_ImportSectionPreview = {
  file: string;
  here: string;
  id: Web_Backup_SectionId;
  label: string;
  reason?: string | undefined;
  willImport: boolean;
};
export type Web_Backup_ImportSummary = {
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
export type Web_Backup_ImportPreview = {
  appVersion: string;
  exportedAt: string;
  sections: Web_Backup_ImportSectionPreview[];
  summary: Web_Backup_ImportSummary;
};
export type Web_Backup_ImportResult = Web_Backup_ImportSummary & {
  importedSections: Web_Backup_SectionId[];
};
export type Web_Backup_ViewStep = 'source' | 'settings' | 'review' | 'confirm' | 'importing';
export type Web_Backup_ViewProps = {
  currentSettings: Web_Api_RuntimeSettings;
  onImported: () => Promise<void>;
  timeZone: string;
};
export type Web_Backup_ProgressJob = Web_BackupComponents_ImportProgressJob;
export type Web_Backup_SettingKey = keyof Web_Api_RuntimeSettings;

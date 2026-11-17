/**
 * Lib - State Layout - Database File Name.
 *
 * @since 1.2.0
 */
export type Lib_StateLayout_DatabaseFileName = 'outpost.sqlite3' | 'outpost.sqlite3-shm' | 'outpost.sqlite3-wal';

/**
 * Lib - State Layout - Database File Names.
 *
 * @since 1.2.0
 */
export type Lib_StateLayout_DatabaseFileNames = readonly Lib_StateLayout_DatabaseFileName[];

/**
 * Lib - State Layout - Migrate Database.
 *
 * @since 1.2.0
 */
export type Lib_StateLayout_MigrateDatabase_DatabaseDirectory = string;

export type Lib_StateLayout_MigrateDatabase_DestinationFiles = Lib_StateLayout_MigrationFile[];

export type Lib_StateLayout_MigrateDatabase_ErrorMessage = string;

export type Lib_StateLayout_MigrateDatabase_Files = Lib_StateLayout_MigrationFile[];

export type Lib_StateLayout_MigrateDatabase_MovedFiles = Lib_StateLayout_MigrationFile[];

export type Lib_StateLayout_MigrateDatabase_Returns = void;

export type Lib_StateLayout_MigrateDatabase_RollbackError = string | undefined;

export type Lib_StateLayout_MigrateDatabase_SourceFiles = Lib_StateLayout_MigrationFile[];

export type Lib_StateLayout_MigrateDatabase_StateDirectory = string;

/**
 * Lib - State Layout - Migration File.
 *
 * @since 1.2.0
 */
export type Lib_StateLayout_MigrationFile = {
  destination: string;
  name: Lib_StateLayout_DatabaseFileName;
  source: string;
};

/**
 * Lib - State Layout - Normalize Installation Key.
 *
 * @since 1.2.0
 */
export type Lib_StateLayout_NormalizeInstallationKey_Directory = string;

export type Lib_StateLayout_NormalizeInstallationKey_InstallationKeyFile = string;

export type Lib_StateLayout_NormalizeInstallationKey_KeyBytes = Buffer;

export type Lib_StateLayout_NormalizeInstallationKey_NormalizedKey = string;

export type Lib_StateLayout_NormalizeInstallationKey_Returns = void;

export type Lib_StateLayout_NormalizeInstallationKey_StoredKey = string;

export type Lib_StateLayout_NormalizeInstallationKey_TemporaryFile = string;

/**
 * Lib - State Layout - Prepare State Layout.
 *
 * @since 1.2.0
 */
export type Lib_StateLayout_PrepareStateLayout_DatabaseDirectory = string;

export type Lib_StateLayout_PrepareStateLayout_InstallationKeyFile = string;

export type Lib_StateLayout_PrepareStateLayout_Returns = void;

export type Lib_StateLayout_PrepareStateLayout_StateDirectory = string;

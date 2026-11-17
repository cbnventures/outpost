import {
  chmodSync,
  existsSync,
  mkdirSync,
  readFileSync,
  renameSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import {
  dirname,
  join,
  resolve,
} from 'node:path';

import { encryptionKeyPattern } from '../regex.js';
import { logInfo } from './logger.js';

import type {
  Lib_StateLayout_DatabaseFileNames,
  Lib_StateLayout_MigrateDatabase_DatabaseDirectory,
  Lib_StateLayout_MigrateDatabase_DestinationFiles,
  Lib_StateLayout_MigrateDatabase_ErrorMessage,
  Lib_StateLayout_MigrateDatabase_Files,
  Lib_StateLayout_MigrateDatabase_MovedFiles,
  Lib_StateLayout_MigrateDatabase_Returns,
  Lib_StateLayout_MigrateDatabase_RollbackError,
  Lib_StateLayout_MigrateDatabase_SourceFiles,
  Lib_StateLayout_MigrateDatabase_StateDirectory,
  Lib_StateLayout_NormalizeInstallationKey_Directory,
  Lib_StateLayout_NormalizeInstallationKey_InstallationKeyFile,
  Lib_StateLayout_NormalizeInstallationKey_KeyBytes,
  Lib_StateLayout_NormalizeInstallationKey_NormalizedKey,
  Lib_StateLayout_NormalizeInstallationKey_Returns,
  Lib_StateLayout_NormalizeInstallationKey_StoredKey,
  Lib_StateLayout_NormalizeInstallationKey_TemporaryFile,
  Lib_StateLayout_PrepareStateLayout_DatabaseDirectory,
  Lib_StateLayout_PrepareStateLayout_InstallationKeyFile,
  Lib_StateLayout_PrepareStateLayout_Returns,
  Lib_StateLayout_PrepareStateLayout_StateDirectory,
} from '../types/lib/state-layout.d.ts';

/**
 * Lib - State Layout - Database File Names.
 *
 * Lists the SQLite database and the two WAL companion files that can exist
 * beside it when an old installation stops.
 *
 * @since 1.2.0
 */
const databaseFileNames: Lib_StateLayout_DatabaseFileNames = [
  'outpost.sqlite3',
  'outpost.sqlite3-shm',
  'outpost.sqlite3-wal',
];

/**
 * Lib - State Layout - Prepare State Layout.
 *
 * Normalizes the installation key and moves an old flat SQLite database into
 * Nova's database directory before State opens either one.
 *
 * @param {Lib_StateLayout_PrepareStateLayout_StateDirectory}      stateDirectory      - State directory.
 * @param {Lib_StateLayout_PrepareStateLayout_DatabaseDirectory}   databaseDirectory   - Database directory.
 * @param {Lib_StateLayout_PrepareStateLayout_InstallationKeyFile} installationKeyFile - Installation key file.
 *
 * @returns {Lib_StateLayout_PrepareStateLayout_Returns}
 *
 * @since 1.2.0
 */
export function prepareStateLayout(stateDirectory: Lib_StateLayout_PrepareStateLayout_StateDirectory, databaseDirectory: Lib_StateLayout_PrepareStateLayout_DatabaseDirectory, installationKeyFile: Lib_StateLayout_PrepareStateLayout_InstallationKeyFile): Lib_StateLayout_PrepareStateLayout_Returns {
  mkdirSync(databaseDirectory, {
    recursive: true,
  });

  mkdirSync(dirname(installationKeyFile), {
    mode: parseInt('700', 8),
    recursive: true,
  });

  normalizeInstallationKey(installationKeyFile);

  migrateDatabase(stateDirectory, databaseDirectory);

  return;
}

/**
 * Lib - State Layout - Migrate Database.
 *
 * Moves the complete old SQLite set only when the contract destination is
 * empty. Any conflict or partial old layout stops startup without overwriting.
 *
 * @param {Lib_StateLayout_MigrateDatabase_StateDirectory}    stateDirectory    - State directory.
 * @param {Lib_StateLayout_MigrateDatabase_DatabaseDirectory} databaseDirectory - Database directory.
 *
 * @returns {Lib_StateLayout_MigrateDatabase_Returns}
 *
 * @since 1.2.0
 */
function migrateDatabase(stateDirectory: Lib_StateLayout_MigrateDatabase_StateDirectory, databaseDirectory: Lib_StateLayout_MigrateDatabase_DatabaseDirectory): Lib_StateLayout_MigrateDatabase_Returns {
  if (resolve(stateDirectory) === resolve(databaseDirectory)) {
    return;
  }

  const files: Lib_StateLayout_MigrateDatabase_Files = databaseFileNames.map((name) => ({
    destination: join(databaseDirectory, name),
    name,
    source: join(stateDirectory, name),
  }));
  const sourceFiles: Lib_StateLayout_MigrateDatabase_SourceFiles = files.filter((file) => existsSync(file['source']) === true);
  const destinationFiles: Lib_StateLayout_MigrateDatabase_DestinationFiles = files.filter((file) => existsSync(file['destination']) === true);

  if (sourceFiles.length > 0 && sourceFiles.some((file) => file['name'] === 'outpost.sqlite3') === false) {
    throw new Error(`Refusing to migrate SQLite companions without ${join(stateDirectory, 'outpost.sqlite3')}.`);
  }

  if (destinationFiles.length > 0 && destinationFiles.some((file) => file['name'] === 'outpost.sqlite3') === false) {
    throw new Error(`Refusing to use SQLite companions without ${join(databaseDirectory, 'outpost.sqlite3')}.`);
  }

  if (sourceFiles.length > 0 && destinationFiles.length > 0) {
    throw new Error(`App state has SQLite files in both ${stateDirectory} and ${databaseDirectory}; refusing to overwrite either layout.`);
  }

  if (sourceFiles.length === 0) {
    return;
  }

  const movedFiles: Lib_StateLayout_MigrateDatabase_MovedFiles = [];

  try {
    for (const file of sourceFiles) {
      renameSync(file['source'], file['destination']);

      movedFiles.push(file);
    }
  } catch (error) {
    let rollbackError: Lib_StateLayout_MigrateDatabase_RollbackError = undefined;

    for (const file of movedFiles.toReversed()) {
      try {
        renameSync(file['destination'], file['source']);
      } catch (rollbackFailure) {
        rollbackError = (rollbackFailure instanceof Error) ? rollbackFailure.message : String(rollbackFailure);
      }
    }

    const errorMessage: Lib_StateLayout_MigrateDatabase_ErrorMessage = (error instanceof Error) ? error.message : String(error);

    if (rollbackError !== undefined) {
      throw new Error(`Could not move the old SQLite database into ${databaseDirectory}: ${errorMessage}. Rollback also failed: ${rollbackError}`);
    }

    throw new Error(`Could not move the old SQLite database into ${databaseDirectory}: ${errorMessage}`);
  }

  for (const file of movedFiles) {
    logInfo('state-migration', `Moved ${file['source']} to ${file['destination']}.`);
  }

  return;
}

/**
 * Lib - State Layout - Normalize Installation Key.
 *
 * Preserves the original 32 key bytes while converting raw bytes, uppercase
 * hexadecimal text, or missing final newlines into the contract file format.
 *
 * @param {Lib_StateLayout_NormalizeInstallationKey_InstallationKeyFile} installationKeyFile - Installation key file.
 *
 * @returns {Lib_StateLayout_NormalizeInstallationKey_Returns}
 *
 * @since 1.2.0
 */
function normalizeInstallationKey(installationKeyFile: Lib_StateLayout_NormalizeInstallationKey_InstallationKeyFile): Lib_StateLayout_NormalizeInstallationKey_Returns {
  const directory: Lib_StateLayout_NormalizeInstallationKey_Directory = dirname(installationKeyFile);

  chmodSync(directory, parseInt('700', 8));

  if (existsSync(installationKeyFile) === false) {
    return;
  }

  const keyBytes: Lib_StateLayout_NormalizeInstallationKey_KeyBytes = readFileSync(installationKeyFile);
  let normalizedKey: Lib_StateLayout_NormalizeInstallationKey_NormalizedKey = '';

  if (keyBytes.length === 32) {
    normalizedKey = keyBytes.toString('hex');
  } else {
    const storedKey: Lib_StateLayout_NormalizeInstallationKey_StoredKey = keyBytes.toString('utf8').trim();

    if (encryptionKeyPattern.test(storedKey) === false) {
      throw new Error(`The encryption key file at "${installationKeyFile}" is not 32 raw bytes or 64 hexadecimal characters.`);
    }

    normalizedKey = storedKey.toLowerCase();
  }

  normalizedKey = `${normalizedKey}\n`;

  if (keyBytes.equals(Buffer.from(normalizedKey, 'utf8')) === false) {
    const temporaryFile: Lib_StateLayout_NormalizeInstallationKey_TemporaryFile = `${installationKeyFile}.nova-migration-${String(process.pid)}`;

    try {
      writeFileSync(temporaryFile, normalizedKey, {
        flag: 'wx',
        mode: parseInt('600', 8),
      });

      renameSync(temporaryFile, installationKeyFile);
    } catch (error) {
      rmSync(temporaryFile, { force: true });

      throw error;
    }

    logInfo('state-migration', `Normalized ${installationKeyFile} without changing its key bytes.`);
  }

  chmodSync(installationKeyFile, parseInt('600', 8));

  return;
}

import {
  existsSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { DatabaseSync } from 'node:sqlite';

import { DOCKER_HUB_REGISTRY } from 'outpost-package-registry';
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import {
  encryptionKeyPattern,
  personalAccessTokenIdPattern,
  personalAccessTokenPattern,
  registryIdPattern,
} from '../regex.js';
import { hashAdministratorPassword } from './auth.js';
import { Runner as State } from './state.js';
import { generateTotpSecret } from './totp.js';

import type {
  Lib_State_AccountFileImport_IgnoresAccountJsonOnceAnAccountExists_AccountPath,
  Lib_State_AccountFileImport_IgnoresAccountJsonOnceAnAccountExists_PasswordHash,
  Lib_State_AccountFileImport_IgnoresAccountJsonOnceAnAccountExists_Reopened,
  Lib_State_AccountFileImport_IgnoresAccountJsonOnceAnAccountExists_State,
  Lib_State_AccountFileImport_LeavesADamagedAccountJsonInPlace_AccountPath,
  Lib_State_AccountFileImport_LeavesADamagedAccountJsonInPlace_State,
  Lib_State_AccountFileImport_LeavesADamagedAccountJsonInPlace_Stderr,
  Lib_State_AccountFileImport_MovesAValidAccountJsonIntoTheDatabaseOnce_AccountPath,
  Lib_State_AccountFileImport_MovesAValidAccountJsonIntoTheDatabaseOnce_PasswordHash,
  Lib_State_AccountFileImport_MovesAValidAccountJsonIntoTheDatabaseOnce_Reopened,
  Lib_State_AccountFileImport_MovesAValidAccountJsonIntoTheDatabaseOnce_State,
  Lib_State_AccountFileImport_MovesAValidAccountJsonIntoTheDatabaseOnce_Stdout,
  Lib_State_CreateClaimedState_Now,
  Lib_State_CreateClaimedState_Returns,
  Lib_State_CreateClaimedState_SetupClaim,
  Lib_State_CreateClaimedState_State,
  Lib_State_DataDirectory,
  Lib_State_FirstRunSetup_ClaimsTheInstallationOnceWithThePrintedSetupCode_Result,
  Lib_State_FirstRunSetup_ClaimsTheInstallationOnceWithThePrintedSetupCode_SetupClaim,
  Lib_State_FirstRunSetup_ClaimsTheInstallationOnceWithThePrintedSetupCode_State,
  Lib_State_FirstRunSetup_KeepsTheNoticeUntilItIsDismissed_Administrator,
  Lib_State_FirstRunSetup_KeepsTheNoticeUntilItIsDismissed_Reopened,
  Lib_State_FirstRunSetup_KeepsTheNoticeUntilItIsDismissed_State,
  Lib_State_FirstRunSetup_KeepsTheNoticeUntilItIsDismissed_Stderr,
  Lib_State_FirstRunSetup_MakesANewKeyAndTurnsOffTheAuthenticatorWhenTheKeyFileIsMissing_Administrator,
  Lib_State_FirstRunSetup_MakesANewKeyAndTurnsOffTheAuthenticatorWhenTheKeyFileIsMissing_KeyPath,
  Lib_State_FirstRunSetup_MakesANewKeyAndTurnsOffTheAuthenticatorWhenTheKeyFileIsMissing_OldKey,
  Lib_State_FirstRunSetup_MakesANewKeyAndTurnsOffTheAuthenticatorWhenTheKeyFileIsMissing_Reopened,
  Lib_State_FirstRunSetup_MakesANewKeyAndTurnsOffTheAuthenticatorWhenTheKeyFileIsMissing_Restarted,
  Lib_State_FirstRunSetup_MakesANewKeyAndTurnsOffTheAuthenticatorWhenTheKeyFileIsMissing_State,
  Lib_State_FirstRunSetup_MakesANewKeyAndTurnsOffTheAuthenticatorWhenTheKeyFileIsMissing_Stderr,
  Lib_State_FirstRunSetup_MakesANewKeyQuietlyWhenNothingUsedTheOldOne_Administrator,
  Lib_State_FirstRunSetup_MakesANewKeyQuietlyWhenNothingUsedTheOldOne_KeyPath,
  Lib_State_FirstRunSetup_MakesANewKeyQuietlyWhenNothingUsedTheOldOne_Reopened,
  Lib_State_FirstRunSetup_MakesANewKeyQuietlyWhenNothingUsedTheOldOne_State,
  Lib_State_FirstRunSetup_MakesANewKeyQuietlyWhenNothingUsedTheOldOne_Stderr,
  Lib_State_FirstRunSetup_RefusesASetupCodeThatExpiredOrWasReplaced_Clock,
  Lib_State_FirstRunSetup_RefusesASetupCodeThatExpiredOrWasReplaced_First,
  Lib_State_FirstRunSetup_RefusesASetupCodeThatExpiredOrWasReplaced_Second,
  Lib_State_FirstRunSetup_RefusesASetupCodeThatExpiredOrWasReplaced_State,
  Lib_State_FirstRunSetup_StartsWithoutAnAccountAndKeepsAGeneratedKeyBesideTheData_Administrator,
  Lib_State_FirstRunSetup_StartsWithoutAnAccountAndKeepsAGeneratedKeyBesideTheData_DatabaseMode,
  Lib_State_FirstRunSetup_StartsWithoutAnAccountAndKeepsAGeneratedKeyBesideTheData_KeyMode,
  Lib_State_FirstRunSetup_StartsWithoutAnAccountAndKeepsAGeneratedKeyBesideTheData_KeyPath,
  Lib_State_FirstRunSetup_StartsWithoutAnAccountAndKeepsAGeneratedKeyBesideTheData_Reopened,
  Lib_State_FirstRunSetup_StartsWithoutAnAccountAndKeepsAGeneratedKeyBesideTheData_Secret,
  Lib_State_FirstRunSetup_StartsWithoutAnAccountAndKeepsAGeneratedKeyBesideTheData_State,
  Lib_State_FirstRunSetup_StopsOnAKeyFileFromAnotherDatabaseOrADamagedOne_Administrator,
  Lib_State_FirstRunSetup_StopsOnAKeyFileFromAnotherDatabaseOrADamagedOne_KeyPath,
  Lib_State_FirstRunSetup_StopsOnAKeyFileFromAnotherDatabaseOrADamagedOne_State,
  Lib_State_FirstRunSetup_TakesNotificationSecretsWithALostKeyAndKeepsTheDestination_Administrator,
  Lib_State_FirstRunSetup_TakesNotificationSecretsWithALostKeyAndKeepsTheDestination_Chat,
  Lib_State_FirstRunSetup_TakesNotificationSecretsWithALostKeyAndKeepsTheDestination_KeyPath,
  Lib_State_FirstRunSetup_TakesNotificationSecretsWithALostKeyAndKeepsTheDestination_Phone,
  Lib_State_FirstRunSetup_TakesNotificationSecretsWithALostKeyAndKeepsTheDestination_Reopened,
  Lib_State_FirstRunSetup_TakesNotificationSecretsWithALostKeyAndKeepsTheDestination_State,
  Lib_State_FirstRunSetup_TakesNotificationSecretsWithALostKeyAndKeepsTheDestination_Stderr,
  Lib_State_FirstRunSetup_TakesRegistryPasswordsWithALostKeyAndKeepsTheSignIns_Administrator,
  Lib_State_FirstRunSetup_TakesRegistryPasswordsWithALostKeyAndKeepsTheSignIns_DockerHub,
  Lib_State_FirstRunSetup_TakesRegistryPasswordsWithALostKeyAndKeepsTheSignIns_Example,
  Lib_State_FirstRunSetup_TakesRegistryPasswordsWithALostKeyAndKeepsTheSignIns_Ghcr,
  Lib_State_FirstRunSetup_TakesRegistryPasswordsWithALostKeyAndKeepsTheSignIns_KeyPath,
  Lib_State_FirstRunSetup_TakesRegistryPasswordsWithALostKeyAndKeepsTheSignIns_Reopened,
  Lib_State_FirstRunSetup_TakesRegistryPasswordsWithALostKeyAndKeepsTheSignIns_State,
  Lib_State_FirstRunSetup_TakesRegistryPasswordsWithALostKeyAndKeepsTheSignIns_Stderr,
  Lib_State_GetDataDirectory_Returns,
  Lib_State_NotificationDestinations_SealsSecretsAndKeepsThemThroughAnEditThatLeavesThemBlank_Created,
  Lib_State_NotificationDestinations_SealsSecretsAndKeepsThemThroughAnEditThatLeavesThemBlank_State,
  Lib_State_RegistrySignIns_KeepsEarlierNoticesWhenAnOlderDatabaseGainsSignIns_Administrator,
  Lib_State_RegistrySignIns_KeepsEarlierNoticesWhenAnOlderDatabaseGainsSignIns_Database,
  Lib_State_RegistrySignIns_KeepsEarlierNoticesWhenAnOlderDatabaseGainsSignIns_Reopened,
  Lib_State_RegistrySignIns_KeepsEarlierNoticesWhenAnOlderDatabaseGainsSignIns_State,
  Lib_State_RegistrySignIns_SealsPasswordsAndFindsEveryDockerHubName_DockerHub,
  Lib_State_RegistrySignIns_SealsPasswordsAndFindsEveryDockerHubName_Ghcr,
  Lib_State_RegistrySignIns_SealsPasswordsAndFindsEveryDockerHubName_State,
  Lib_State_RuntimeSettings_SeedsAndPersistsRuntimeSettings_Reopened,
  Lib_State_RuntimeSettings_SeedsAndPersistsRuntimeSettings_Settings,
  Lib_State_RuntimeSettings_SeedsAndPersistsRuntimeSettings_State,
  Lib_State_SignInState_DiscardsASecondFactorChallengeAfterFiveWrongCodes_Administrator,
  Lib_State_SignInState_DiscardsASecondFactorChallengeAfterFiveWrongCodes_Challenge,
  Lib_State_SignInState_DiscardsASecondFactorChallengeAfterFiveWrongCodes_State,
  Lib_State_SignInState_KeepsBrowserSessionsAcrossRestartsUntilTheyAreSignedOut_Administrator,
  Lib_State_SignInState_KeepsBrowserSessionsAcrossRestartsUntilTheyAreSignedOut_FirstSession,
  Lib_State_SignInState_KeepsBrowserSessionsAcrossRestartsUntilTheyAreSignedOut_Reopened,
  Lib_State_SignInState_KeepsBrowserSessionsAcrossRestartsUntilTheyAreSignedOut_SecondSession,
  Lib_State_SignInState_KeepsBrowserSessionsAcrossRestartsUntilTheyAreSignedOut_State,
  Lib_State_SignInState_RecordsWhenAndFromWhereASessionWasLastSeen_Administrator,
  Lib_State_SignInState_RecordsWhenAndFromWhereASessionWasLastSeen_Clock,
  Lib_State_SignInState_RecordsWhenAndFromWhereASessionWasLastSeen_Database,
  Lib_State_SignInState_RecordsWhenAndFromWhereASessionWasLastSeen_Session,
  Lib_State_SignInState_RecordsWhenAndFromWhereASessionWasLastSeen_SessionRow,
  Lib_State_SignInState_RecordsWhenAndFromWhereASessionWasLastSeen_State,
  Lib_State_SignInState_StoresPasskeysWithTheirHostnameAndUsesEachCeremonyOnce_Administrator,
  Lib_State_SignInState_StoresPasskeysWithTheirHostnameAndUsesEachCeremonyOnce_CeremonyId,
  Lib_State_SignInState_StoresPasskeysWithTheirHostnameAndUsesEachCeremonyOnce_State,
  Lib_State_SignInState_TurnsTheAuthenticatorOnWithSingleUseRecoveryCodesAndRejectsReplay_Administrator,
  Lib_State_SignInState_TurnsTheAuthenticatorOnWithSingleUseRecoveryCodesAndRejectsReplay_RecoveryCodes,
  Lib_State_SignInState_TurnsTheAuthenticatorOnWithSingleUseRecoveryCodesAndRejectsReplay_Secret,
  Lib_State_SignInState_TurnsTheAuthenticatorOnWithSingleUseRecoveryCodesAndRejectsReplay_State,
  Lib_State_TokenState_AppliesTokenLifecycleChangesImmediatelyAndRecordsLastUse_CreatedToken,
  Lib_State_TokenState_AppliesTokenLifecycleChangesImmediatelyAndRecordsLastUse_Database,
  Lib_State_TokenState_AppliesTokenLifecycleChangesImmediatelyAndRecordsLastUse_OtherToken,
  Lib_State_TokenState_AppliesTokenLifecycleChangesImmediatelyAndRecordsLastUse_State,
  Lib_State_TokenState_AppliesTokenLifecycleChangesImmediatelyAndRecordsLastUse_TokenId,
  Lib_State_TokenState_ReportsTheScopesOfALiveTokenOnly_Clock,
  Lib_State_TokenState_ReportsTheScopesOfALiveTokenOnly_CreatedToken,
  Lib_State_TokenState_ReportsTheScopesOfALiveTokenOnly_State,
} from '../types/lib/state.test.d.ts';

/**
 * Lib - State - Data Directory.
 *
 * Points each test at its own temporary directory, standing in for the
 * /data volume. Cleanup never touches a repository folder.
 *
 * @since 1.0.0
 */
let dataDirectory: Lib_State_DataDirectory = undefined;

/**
 * Lib - State - Get Data Directory.
 *
 * Returns the directory the current test set up, and fails loudly when
 * no setup hook ran.
 *
 * @returns {Lib_State_GetDataDirectory_Returns}
 *
 * @since 1.0.0
 */
function getDataDirectory(): Lib_State_GetDataDirectory_Returns {
  if (dataDirectory === undefined) {
    throw new Error('The state test data directory is not initialized.');
  }

  return dataDirectory;
}

/**
 * Lib - State - Create Claimed State.
 *
 * Opens a fresh database and creates the account with the printed setup code,
 * the same way the dashboard's setup screen does.
 *
 * @param {Lib_State_CreateClaimedState_Now} [now] - Now.
 *
 * @returns {Lib_State_CreateClaimedState_Returns}
 *
 * @since 1.0.0
 */
async function createClaimedState(now?: Lib_State_CreateClaimedState_Now): Lib_State_CreateClaimedState_Returns {
  const state: Lib_State_CreateClaimedState_State = new State(getDataDirectory(), now);
  const setupClaim: Lib_State_CreateClaimedState_SetupClaim = state.prepareSetupClaim();

  if (setupClaim === undefined) {
    throw new Error('A fresh installation did not issue a setup code.');
  }

  await state.claimInstallation(setupClaim['code'], 'admin', 'fixture admin password');

  return state;
}

/**
 * Lib - State - First-run Setup.
 *
 * Checks the generated key file, file permissions, the in-memory setup code,
 * the new key made when the file is missing, and the stop on a key from another database.
 *
 * @since 1.0.0
 */
describe('first-run setup', () => {
  beforeEach(() => {
    dataDirectory = mkdtempSync(join(tmpdir(), 'outpost-state-'));

    return;
  });

  afterEach(() => {
    rmSync(getDataDirectory(), {
      force: true,
      recursive: true,
    });

    dataDirectory = undefined;

    return;
  });

  it('starts without an account and keeps a generated key beside the data', async () => {
    const state: Lib_State_FirstRunSetup_StartsWithoutAnAccountAndKeepsAGeneratedKeyBesideTheData_State = new State(getDataDirectory());
    const keyPath: Lib_State_FirstRunSetup_StartsWithoutAnAccountAndKeepsAGeneratedKeyBesideTheData_KeyPath = join(getDataDirectory(), 'keys', 'installation.key');
    const keyMode: Lib_State_FirstRunSetup_StartsWithoutAnAccountAndKeepsAGeneratedKeyBesideTheData_KeyMode = (statSync(keyPath).mode % 512).toString(8);
    const databaseMode: Lib_State_FirstRunSetup_StartsWithoutAnAccountAndKeepsAGeneratedKeyBesideTheData_DatabaseMode = (statSync(join(getDataDirectory(), 'outpost.sqlite3')).mode % 512).toString(8);

    expect(state.hasAdministrator()).toBe(false);

    expect(state.getSetupStatus()).toEqual({
      claimRequired: true,
    });

    expect(readFileSync(keyPath, 'utf8').trim()).toMatch(encryptionKeyPattern);

    expect(keyMode).toBe('600');

    expect(databaseMode).toBe('600');

    state.close();

    const claimed: Lib_State_FirstRunSetup_StartsWithoutAnAccountAndKeepsAGeneratedKeyBesideTheData_State = await createClaimedState();
    const administrator: Lib_State_FirstRunSetup_StartsWithoutAnAccountAndKeepsAGeneratedKeyBesideTheData_Administrator = claimed.getAdministrator();
    const secret: Lib_State_FirstRunSetup_StartsWithoutAnAccountAndKeepsAGeneratedKeyBesideTheData_Secret = generateTotpSecret();

    if (administrator === undefined) {
      throw new Error('The setup code did not create the account.');
    }

    claimed.startTotpEnrollment(administrator['id'], secret);

    expect(readFileSync(join(getDataDirectory(), 'outpost.sqlite3')).includes(secret)).toBe(false);

    claimed.close();

    const reopened: Lib_State_FirstRunSetup_StartsWithoutAnAccountAndKeepsAGeneratedKeyBesideTheData_Reopened = new State(getDataDirectory());

    expect(reopened.getTotpEnrollment(administrator['id'])).toBe(secret);

    reopened.close();

    return;
  });

  it('claims the installation once with the printed setup code', async () => {
    const state: Lib_State_FirstRunSetup_ClaimsTheInstallationOnceWithThePrintedSetupCode_State = new State(getDataDirectory());
    const setupClaim: Lib_State_FirstRunSetup_ClaimsTheInstallationOnceWithThePrintedSetupCode_SetupClaim = state.prepareSetupClaim();

    if (setupClaim === undefined) {
      throw new Error('A fresh installation did not issue a setup code.');
    }

    expect(state.getSetupStatus()).toEqual({
      claimExpiresAt: setupClaim['expiresAt'],
      claimRequired: true,
    });

    expect(await state.claimInstallation('AAAAA-BBBBB-CCCCC', 'admin', 'fixture admin password')).toBe('invalid');

    const result: Lib_State_FirstRunSetup_ClaimsTheInstallationOnceWithThePrintedSetupCode_Result = await state.claimInstallation(` ${setupClaim['code'].toLowerCase().replaceAll('-', ' ')} `, 'admin', 'fixture admin password');

    expect(result).toEqual(expect.objectContaining({
      username: 'admin',
    }));

    expect(await state.claimInstallation(setupClaim['code'], 'intruder', 'fixture admin password')).toBe('unavailable');

    expect(state.getSetupStatus()).toEqual({
      claimRequired: false,
    });

    expect(state.prepareSetupClaim()).toBeUndefined();

    expect(await state.authenticateAdministrator('ADMIN', 'fixture admin password')).toEqual(expect.objectContaining({
      username: 'admin',
    }));

    expect(await state.authenticateAdministrator('admin', 'wrong password guess')).toBeUndefined();

    expect(await state.authenticateAdministrator('someone', 'fixture admin password')).toBeUndefined();

    expect(readFileSync(join(getDataDirectory(), 'outpost.sqlite3')).includes(setupClaim['code'])).toBe(false);

    state.close();

    return;
  });

  it('refuses a setup code that expired or was replaced', async () => {
    const clock: Lib_State_FirstRunSetup_RefusesASetupCodeThatExpiredOrWasReplaced_Clock = { value: 0 };
    const state: Lib_State_FirstRunSetup_RefusesASetupCodeThatExpiredOrWasReplaced_State = new State(getDataDirectory(), () => clock['value']);
    const first: Lib_State_FirstRunSetup_RefusesASetupCodeThatExpiredOrWasReplaced_First = state.prepareSetupClaim();
    const second: Lib_State_FirstRunSetup_RefusesASetupCodeThatExpiredOrWasReplaced_Second = state.prepareSetupClaim();

    if (first === undefined || second === undefined) {
      throw new Error('A fresh installation did not issue a setup code.');
    }

    expect(second['expiresAt']).toBe('1970-01-01T00:30:00.000Z');

    expect(await state.claimInstallation(first['code'], 'admin', 'fixture admin password')).toBe('invalid');

    Reflect.set(clock, 'value', 30 * 60 * 1000);

    expect(await state.claimInstallation(second['code'], 'admin', 'fixture admin password')).toBe('invalid');

    expect(state.hasAdministrator()).toBe(false);

    state.close();

    return;
  });

  it('makes a new key and turns off the authenticator when the key file is missing', async () => {
    const state: Lib_State_FirstRunSetup_MakesANewKeyAndTurnsOffTheAuthenticatorWhenTheKeyFileIsMissing_State = await createClaimedState();
    const administrator: Lib_State_FirstRunSetup_MakesANewKeyAndTurnsOffTheAuthenticatorWhenTheKeyFileIsMissing_Administrator = state.getAdministrator();
    const keyPath: Lib_State_FirstRunSetup_MakesANewKeyAndTurnsOffTheAuthenticatorWhenTheKeyFileIsMissing_KeyPath = join(getDataDirectory(), 'keys', 'installation.key');
    const oldKey: Lib_State_FirstRunSetup_MakesANewKeyAndTurnsOffTheAuthenticatorWhenTheKeyFileIsMissing_OldKey = readFileSync(keyPath, 'utf8');

    if (administrator === undefined) {
      throw new Error('The setup code did not create the account.');
    }

    state.enableTotp(administrator['id'], generateTotpSecret(), 1);

    state.close();

    rmSync(keyPath);

    const stderr: Lib_State_FirstRunSetup_MakesANewKeyAndTurnsOffTheAuthenticatorWhenTheKeyFileIsMissing_Stderr = vi.spyOn(process.stderr, 'write').mockImplementation(() => true);
    const reopened: Lib_State_FirstRunSetup_MakesANewKeyAndTurnsOffTheAuthenticatorWhenTheKeyFileIsMissing_Reopened = new State(getDataDirectory());

    expect(readFileSync(keyPath, 'utf8').trim()).toMatch(encryptionKeyPattern);

    expect(readFileSync(keyPath, 'utf8')).not.toBe(oldKey);

    expect(stderr).toHaveBeenCalledWith(expect.stringContaining('These saved secrets were locked with the old key and were removed: the authenticator app for admin.'));

    expect(reopened.getAdministratorSecurity(administrator['id'])).toEqual(expect.objectContaining({
      recoveryCodesRemaining: 0,
      totpEnabled: false,
    }));

    expect(reopened.getRemovedSecrets(administrator['id'])).toEqual([{
      kind: 'authenticator',
      removedAt: expect.any(String),
    }]);

    expect(await reopened.authenticateAdministrator('admin', 'fixture admin password')).toEqual(expect.objectContaining({
      username: 'admin',
    }));

    reopened.enableTotp(administrator['id'], generateTotpSecret(), 1);

    expect(reopened.getRemovedSecrets(administrator['id'])).toEqual([]);

    reopened.close();

    stderr.mockClear();

    const restarted: Lib_State_FirstRunSetup_MakesANewKeyAndTurnsOffTheAuthenticatorWhenTheKeyFileIsMissing_Restarted = new State(getDataDirectory());

    expect(restarted.getAdministratorSecurity(administrator['id'])['totpEnabled']).toBe(true);

    expect(stderr).not.toHaveBeenCalled();

    restarted.close();

    stderr.mockRestore();

    return;
  });

  it('keeps the notice until it is dismissed', async () => {
    const state: Lib_State_FirstRunSetup_KeepsTheNoticeUntilItIsDismissed_State = await createClaimedState();
    const administrator: Lib_State_FirstRunSetup_KeepsTheNoticeUntilItIsDismissed_Administrator = state.getAdministrator();

    if (administrator === undefined) {
      throw new Error('The setup code did not create the account.');
    }

    state.enableTotp(administrator['id'], generateTotpSecret(), 1);

    state.close();

    rmSync(join(getDataDirectory(), 'keys', 'installation.key'));

    const stderr: Lib_State_FirstRunSetup_KeepsTheNoticeUntilItIsDismissed_Stderr = vi.spyOn(process.stderr, 'write').mockImplementation(() => true);

    new State(getDataDirectory()).close();

    const reopened: Lib_State_FirstRunSetup_KeepsTheNoticeUntilItIsDismissed_Reopened = new State(getDataDirectory());

    expect(reopened.getRemovedSecrets(administrator['id'])).toHaveLength(1);

    reopened.dismissRemovedSecrets(administrator['id']);

    expect(reopened.getRemovedSecrets(administrator['id'])).toEqual([]);

    expect(reopened.getAdministratorSecurity(administrator['id'])['totpEnabled']).toBe(false);

    reopened.close();

    stderr.mockRestore();

    return;
  });

  it('takes notification secrets with a lost key and keeps the destination', async () => {
    const state: Lib_State_FirstRunSetup_TakesNotificationSecretsWithALostKeyAndKeepsTheDestination_State = await createClaimedState();
    const administrator: Lib_State_FirstRunSetup_TakesNotificationSecretsWithALostKeyAndKeepsTheDestination_Administrator = state.getAdministrator();
    const keyPath: Lib_State_FirstRunSetup_TakesNotificationSecretsWithALostKeyAndKeepsTheDestination_KeyPath = join(getDataDirectory(), 'keys', 'installation.key');
    const chat: Lib_State_FirstRunSetup_TakesNotificationSecretsWithALostKeyAndKeepsTheDestination_Chat = state.createNotificationTarget({
      events: ['update-failed'],
      name: 'Homelab chat',
      secrets: { botToken: '123456:telegram-secret' },
      service: 'telegram',
      settings: { chatId: '-1002468013579' },
    });

    const phone: Lib_State_FirstRunSetup_TakesNotificationSecretsWithALostKeyAndKeepsTheDestination_Phone = state.createNotificationTarget({
      events: ['secrets-removed'],
      name: 'Phone',
      secrets: { token: 'ntfy-secret' },
      service: 'ntfy',
      settings: { url: 'https://ntfy.sh/outpost-updates' },
    });

    if (
      administrator === undefined
      || chat === undefined
      || phone === undefined
    ) {
      throw new Error('The fixture account or destination was not created.');
    }

    state.close();

    rmSync(keyPath);

    const stderr: Lib_State_FirstRunSetup_TakesNotificationSecretsWithALostKeyAndKeepsTheDestination_Stderr = vi.spyOn(process.stderr, 'write').mockImplementation(() => true);
    const reopened: Lib_State_FirstRunSetup_TakesNotificationSecretsWithALostKeyAndKeepsTheDestination_Reopened = new State(getDataDirectory());

    expect(reopened.getKeyReplacement()).toEqual([
      'the Homelab chat notification',
      'the Phone notification',
    ]);

    expect(stderr).toHaveBeenCalledWith(expect.stringContaining('were removed: the Homelab chat notification, the Phone notification.'));

    expect(reopened.getNotificationDelivery(chat['id'])).toBe('secrets-missing');

    expect(reopened.getNotificationDelivery(phone['id'])).toBe('secrets-missing');

    expect(reopened.getNotificationTargets()).toEqual([
      expect.objectContaining({
        name: 'Phone',
        secrets: {},
        secretsMissing: ['token'],
      }),
      expect.objectContaining({
        name: 'Homelab chat',
        secrets: {},
        secretsMissing: ['botToken'],
      }),
    ]);

    expect(reopened.getRemovedSecrets(administrator['id'])).toEqual([
      {
        kind: 'notification',
        name: 'Homelab chat',
        notificationId: chat['id'],
        removedAt: expect.any(String),
      },
      {
        kind: 'notification',
        name: 'Phone',
        notificationId: phone['id'],
        removedAt: expect.any(String),
      },
    ]);

    expect(reopened.updateNotificationTarget(phone['id'], {
      events: ['secrets-removed'],
      clearSecrets: ['token'],
      name: 'Phone',
      secrets: {},
      settings: { url: 'https://ntfy.sh/outpost-updates' },
    })).toEqual(expect.objectContaining({
      secrets: {},
      secretsMissing: [],
    }));

    expect(reopened.getNotificationDelivery(phone['id'])).toEqual(expect.objectContaining({
      target: expect.objectContaining({ secrets: {} }),
    }));

    expect(reopened.getRemovedSecrets(administrator['id'])).toEqual([expect.objectContaining({
      notificationId: chat['id'],
    })]);

    expect(reopened.updateNotificationTarget(chat['id'], {
      events: ['update-failed'],
      name: 'Homelab chat',
      secrets: { botToken: '123456:new-telegram-secret' },
      settings: { chatId: '-1002468013579' },
    })).toEqual(expect.objectContaining({
      secrets: { botToken: true },
      secretsMissing: [],
    }));

    expect(reopened.getRemovedSecrets(administrator['id'])).toEqual([]);

    expect(reopened.getNotificationDelivery(chat['id'])).toEqual(expect.objectContaining({
      target: expect.objectContaining({
        secrets: { botToken: '123456:new-telegram-secret' },
      }),
    }));

    reopened.close();

    stderr.mockRestore();

    return;
  });

  it('takes registry passwords with a lost key and keeps the sign-ins', async () => {
    const state: Lib_State_FirstRunSetup_TakesRegistryPasswordsWithALostKeyAndKeepsTheSignIns_State = await createClaimedState();
    const administrator: Lib_State_FirstRunSetup_TakesRegistryPasswordsWithALostKeyAndKeepsTheSignIns_Administrator = state.getAdministrator();
    const keyPath: Lib_State_FirstRunSetup_TakesRegistryPasswordsWithALostKeyAndKeepsTheSignIns_KeyPath = join(getDataDirectory(), 'keys', 'installation.key');
    const ghcr: Lib_State_FirstRunSetup_TakesRegistryPasswordsWithALostKeyAndKeepsTheSignIns_Ghcr = state.createRegistry({
      password: 'ghp_example',
      registry: 'ghcr.io',
      username: 'cbnventures-bot',
    });
    const dockerHub: Lib_State_FirstRunSetup_TakesRegistryPasswordsWithALostKeyAndKeepsTheSignIns_DockerHub = state.createRegistry({
      password: 'dckr_pat_example',
      registry: 'index.docker.io',
      username: 'outpost',
    });
    const example: Lib_State_FirstRunSetup_TakesRegistryPasswordsWithALostKeyAndKeepsTheSignIns_Example = state.createRegistry({
      password: 'deploy-token',
      registry: 'registry.example.com',
      username: 'deploy',
    });

    if (
      administrator === undefined
      || ghcr === undefined
      || dockerHub === undefined
      || example === undefined
    ) {
      throw new Error('The fixture account or sign-ins were not created.');
    }

    state.close();

    rmSync(keyPath);

    const stderr: Lib_State_FirstRunSetup_TakesRegistryPasswordsWithALostKeyAndKeepsTheSignIns_Stderr = vi.spyOn(process.stderr, 'write').mockImplementation(() => true);
    const reopened: Lib_State_FirstRunSetup_TakesRegistryPasswordsWithALostKeyAndKeepsTheSignIns_Reopened = new State(getDataDirectory());

    expect(reopened.getKeyReplacement()).toEqual([
      'the docker.io registry sign-in',
      'the ghcr.io registry sign-in',
      'the registry.example.com registry sign-in',
    ]);

    expect(stderr).toHaveBeenCalledWith(expect.stringContaining('were removed: the docker.io registry sign-in, the ghcr.io registry sign-in, the registry.example.com registry sign-in.'));

    expect(reopened.getRegistries()).toEqual([
      expect.objectContaining({
        id: dockerHub['id'],
        passwordMissing: true,
        registry: 'docker.io',
        username: 'outpost',
      }),
      expect.objectContaining({
        id: ghcr['id'],
        passwordMissing: true,
      }),
      expect.objectContaining({
        id: example['id'],
        passwordMissing: true,
      }),
    ]);

    expect(reopened.findRegistryCredentials(DOCKER_HUB_REGISTRY)).toBeUndefined();

    expect(reopened.getRemovedSecrets(administrator['id'])).toEqual([
      {
        kind: 'registry',
        name: 'docker.io',
        registryId: dockerHub['id'],
        removedAt: expect.any(String),
      },
      {
        kind: 'registry',
        name: 'ghcr.io',
        registryId: ghcr['id'],
        removedAt: expect.any(String),
      },
      {
        kind: 'registry',
        name: 'registry.example.com',
        registryId: example['id'],
        removedAt: expect.any(String),
      },
    ]);

    // An edit that leaves the password out keeps it missing.
    expect(reopened.updateRegistry(ghcr['id'], {
      registry: 'ghcr.io',
      username: 'cbnventures-bot',
    })).toEqual(expect.objectContaining({
      passwordMissing: true,
    }));

    expect(reopened.getRemovedSecrets(administrator['id'])).toHaveLength(3);

    expect(reopened.updateRegistry(ghcr['id'], {
      password: 'ghp_rotated',
      registry: 'ghcr.io',
      username: 'cbnventures-bot',
    })).toEqual(expect.objectContaining({
      passwordMissing: false,
    }));

    expect(reopened.findRegistryCredentials('ghcr.io')).toEqual({
      password: 'ghp_rotated',
      username: 'cbnventures-bot',
    });

    expect(reopened.removeRegistry(example['id'])).toBe('removed');

    expect(reopened.getRemovedSecrets(administrator['id'])).toEqual([expect.objectContaining({
      registryId: dockerHub['id'],
    })]);

    reopened.dismissRemovedSecrets(administrator['id']);

    expect(reopened.getRemovedSecrets(administrator['id'])).toEqual([]);

    expect(reopened.getRegistries()).toEqual([
      expect.objectContaining({
        id: dockerHub['id'],
        passwordMissing: true,
      }),
      expect.objectContaining({
        id: ghcr['id'],
        passwordMissing: false,
      }),
    ]);

    reopened.close();

    stderr.mockRestore();

    return;
  });

  it('makes a new key quietly when nothing used the old one', async () => {
    const state: Lib_State_FirstRunSetup_MakesANewKeyQuietlyWhenNothingUsedTheOldOne_State = await createClaimedState();
    const administrator: Lib_State_FirstRunSetup_MakesANewKeyQuietlyWhenNothingUsedTheOldOne_Administrator = state.getAdministrator();
    const keyPath: Lib_State_FirstRunSetup_MakesANewKeyQuietlyWhenNothingUsedTheOldOne_KeyPath = join(getDataDirectory(), 'keys', 'installation.key');

    if (administrator === undefined) {
      throw new Error('The setup code did not create the account.');
    }

    state.close();

    rmSync(keyPath);

    const stderr: Lib_State_FirstRunSetup_MakesANewKeyQuietlyWhenNothingUsedTheOldOne_Stderr = vi.spyOn(process.stderr, 'write').mockImplementation(() => true);
    const reopened: Lib_State_FirstRunSetup_MakesANewKeyQuietlyWhenNothingUsedTheOldOne_Reopened = new State(getDataDirectory());

    expect(existsSync(keyPath)).toBe(true);

    expect(reopened.getRemovedSecrets(administrator['id'])).toEqual([]);

    expect(stderr).not.toHaveBeenCalled();

    reopened.close();

    stderr.mockRestore();

    return;
  });

  it('stops on a key file from another database or a damaged one', async () => {
    const state: Lib_State_FirstRunSetup_StopsOnAKeyFileFromAnotherDatabaseOrADamagedOne_State = await createClaimedState();
    const administrator: Lib_State_FirstRunSetup_StopsOnAKeyFileFromAnotherDatabaseOrADamagedOne_Administrator = state.getAdministrator();
    const keyPath: Lib_State_FirstRunSetup_StopsOnAKeyFileFromAnotherDatabaseOrADamagedOne_KeyPath = join(getDataDirectory(), 'keys', 'installation.key');

    if (administrator === undefined) {
      throw new Error('The setup code did not create the account.');
    }

    state.enableTotp(administrator['id'], generateTotpSecret(), 1);

    state.close();

    writeFileSync(keyPath, `${'b'.repeat(64)}\n`);

    expect(() => new State(getDataDirectory())).toThrow('doesn\'t belong to this database');

    writeFileSync(keyPath, 'not a key\n');

    expect(() => new State(getDataDirectory())).toThrow('is not 64 hexadecimal characters');

    return;
  });

  return;
});

/**
 * Lib - State - Account File Import.
 *
 * Checks that an account saved in account.json moves into the database once,
 * that the file is removed afterward, and that a damaged file is left alone.
 *
 * @since 1.0.0
 */
describe('account file import', () => {
  beforeEach(() => {
    dataDirectory = mkdtempSync(join(tmpdir(), 'outpost-state-'));

    return;
  });

  afterEach(() => {
    rmSync(getDataDirectory(), {
      force: true,
      recursive: true,
    });

    dataDirectory = undefined;

    vi.restoreAllMocks();

    return;
  });

  it('moves a valid account.json into the database once', async () => {
    const accountPath: Lib_State_AccountFileImport_MovesAValidAccountJsonIntoTheDatabaseOnce_AccountPath = join(getDataDirectory(), 'account.json');
    const passwordHash: Lib_State_AccountFileImport_MovesAValidAccountJsonIntoTheDatabaseOnce_PasswordHash = await hashAdministratorPassword('fixture admin password');
    const stdout: Lib_State_AccountFileImport_MovesAValidAccountJsonIntoTheDatabaseOnce_Stdout = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);

    writeFileSync(accountPath, `${JSON.stringify({
      username: 'Jacky',
      passwordHash,
    }, null, 2)}\n`);

    const state: Lib_State_AccountFileImport_MovesAValidAccountJsonIntoTheDatabaseOnce_State = new State(getDataDirectory());

    expect(state.hasAdministrator()).toBe(true);

    expect(existsSync(accountPath)).toBe(false);

    expect(stdout).toHaveBeenCalledWith('Moved the dashboard account from "account.json" into "outpost.sqlite3".\n');

    expect(state.prepareSetupClaim()).toBeUndefined();

    expect(await state.authenticateAdministrator('jacky', 'fixture admin password')).toEqual(expect.objectContaining({
      username: 'Jacky',
    }));

    state.close();

    const reopened: Lib_State_AccountFileImport_MovesAValidAccountJsonIntoTheDatabaseOnce_Reopened = new State(getDataDirectory());

    expect(reopened.getAdministrator()).toEqual(expect.objectContaining({
      username: 'Jacky',
    }));

    reopened.close();

    return;
  });

  it('leaves a damaged account.json in place', () => {
    const accountPath: Lib_State_AccountFileImport_LeavesADamagedAccountJsonInPlace_AccountPath = join(getDataDirectory(), 'account.json');
    const stderr: Lib_State_AccountFileImport_LeavesADamagedAccountJsonInPlace_Stderr = vi.spyOn(process.stderr, 'write').mockImplementation(() => true);

    writeFileSync(accountPath, '{"username":"jacky"}');

    const state: Lib_State_AccountFileImport_LeavesADamagedAccountJsonInPlace_State = new State(getDataDirectory());

    expect(state.hasAdministrator()).toBe(false);

    expect(existsSync(accountPath)).toBe(true);

    expect(stderr).toHaveBeenCalledWith(expect.stringContaining('it is not a valid account file'));

    expect(state.prepareSetupClaim()).toBeDefined();

    state.close();

    return;
  });

  it('ignores account.json once an account exists', async () => {
    const state: Lib_State_AccountFileImport_IgnoresAccountJsonOnceAnAccountExists_State = await createClaimedState();
    const accountPath: Lib_State_AccountFileImport_IgnoresAccountJsonOnceAnAccountExists_AccountPath = join(getDataDirectory(), 'account.json');
    const passwordHash: Lib_State_AccountFileImport_IgnoresAccountJsonOnceAnAccountExists_PasswordHash = await hashAdministratorPassword('another long password');

    state.close();

    writeFileSync(accountPath, JSON.stringify({
      username: 'intruder',
      passwordHash,
    }));

    const reopened: Lib_State_AccountFileImport_IgnoresAccountJsonOnceAnAccountExists_Reopened = new State(getDataDirectory());

    expect(reopened.getAdministrator()).toEqual(expect.objectContaining({
      username: 'admin',
    }));

    expect(await reopened.authenticateAdministrator('intruder', 'another long password')).toBeUndefined();

    reopened.close();

    return;
  });

  return;
});

/**
 * Lib - State - Sign-in State.
 *
 * Checks sessions across restarts, what a session records about its browser,
 * the authenticator and recovery codes, challenges, and passkeys.
 *
 * @since 1.0.0
 */
describe('sign-in state', () => {
  beforeEach(() => {
    dataDirectory = mkdtempSync(join(tmpdir(), 'outpost-state-'));

    return;
  });

  afterEach(() => {
    rmSync(getDataDirectory(), {
      force: true,
      recursive: true,
    });

    dataDirectory = undefined;

    return;
  });

  it('keeps browser sessions across restarts until they are signed out', async () => {
    const state: Lib_State_SignInState_KeepsBrowserSessionsAcrossRestartsUntilTheyAreSignedOut_State = await createClaimedState();
    const administrator: Lib_State_SignInState_KeepsBrowserSessionsAcrossRestartsUntilTheyAreSignedOut_Administrator = state.getAdministrator();

    if (administrator === undefined) {
      throw new Error('The setup code did not create the account.');
    }

    const firstSession: Lib_State_SignInState_KeepsBrowserSessionsAcrossRestartsUntilTheyAreSignedOut_FirstSession = state.createSession(administrator['id'], '192.168.1.20', 'Fixture browser');
    const secondSession: Lib_State_SignInState_KeepsBrowserSessionsAcrossRestartsUntilTheyAreSignedOut_SecondSession = state.createSession(administrator['id'], '192.168.1.21', 'Fixture browser');

    state.close();

    const reopened: Lib_State_SignInState_KeepsBrowserSessionsAcrossRestartsUntilTheyAreSignedOut_Reopened = new State(getDataDirectory());

    expect(reopened.getSession(firstSession['sessionToken'])).toEqual(expect.objectContaining({
      administratorId: administrator['id'],
      id: firstSession['sessionId'],
      username: 'admin',
    }));

    expect(reopened.getSession(`ops_${'A'.repeat(43)}`)).toBeUndefined();

    await reopened.changeAdministratorPassword(administrator['id'], 'a new fixture password', firstSession['sessionId']);

    expect(reopened.getSession(firstSession['sessionToken'])).toBeDefined();

    expect(reopened.getSession(secondSession['sessionToken'])).toBeUndefined();

    expect(await reopened.authenticateAdministrator('admin', 'fixture admin password')).toBeUndefined();

    expect(await reopened.authenticateAdministrator('admin', 'a new fixture password')).toBeDefined();

    reopened.deleteSession(firstSession['sessionId']);

    expect(reopened.getSession(firstSession['sessionToken'])).toBeUndefined();

    expect(reopened.hasSession(firstSession['sessionId'])).toBe(false);

    reopened.close();

    return;
  });

  it('records when and from where a session was last seen', async () => {
    const clock: Lib_State_SignInState_RecordsWhenAndFromWhereASessionWasLastSeen_Clock = { value: Date.parse('2026-10-25T12:00:00.000Z') };
    const state: Lib_State_SignInState_RecordsWhenAndFromWhereASessionWasLastSeen_State = await createClaimedState(() => clock['value']);
    const administrator: Lib_State_SignInState_RecordsWhenAndFromWhereASessionWasLastSeen_Administrator = state.getAdministrator();

    if (administrator === undefined) {
      throw new Error('The setup code did not create the account.');
    }

    const session: Lib_State_SignInState_RecordsWhenAndFromWhereASessionWasLastSeen_Session = state.createSession(administrator['id'], '192.168.1.20', 'Fixture browser');
    const database: Lib_State_SignInState_RecordsWhenAndFromWhereASessionWasLastSeen_Database = new DatabaseSync(join(getDataDirectory(), 'outpost.sqlite3'));

    Reflect.set(clock, 'value', clock['value'] + (2 * 60 * 1000));

    expect(state.getSession(session['sessionToken'])).toBeDefined();

    const sessionRow: Lib_State_SignInState_RecordsWhenAndFromWhereASessionWasLastSeen_SessionRow = database.prepare('SELECT ip_address AS ipAddress, last_seen_at AS lastSeenAt, user_agent AS userAgent FROM browser_sessions WHERE id = ?').get(session['sessionId']);

    expect(sessionRow).toEqual({
      ipAddress: '192.168.1.20',
      lastSeenAt: '2026-10-25T12:02:00.000Z',
      userAgent: 'Fixture browser',
    });

    expect(state.hasSession(session['sessionId'])).toBe(true);

    Reflect.set(clock, 'value', clock['value'] + (24 * 60 * 60 * 1000));

    expect(state.hasSession(session['sessionId'])).toBe(false);

    expect(state.getSession(session['sessionToken'])).toBeUndefined();

    database.close();

    state.close();

    return;
  });

  it('turns the authenticator on with single-use recovery codes and rejects replay', async () => {
    const state: Lib_State_SignInState_TurnsTheAuthenticatorOnWithSingleUseRecoveryCodesAndRejectsReplay_State = await createClaimedState();
    const administrator: Lib_State_SignInState_TurnsTheAuthenticatorOnWithSingleUseRecoveryCodesAndRejectsReplay_Administrator = state.getAdministrator();
    const secret: Lib_State_SignInState_TurnsTheAuthenticatorOnWithSingleUseRecoveryCodesAndRejectsReplay_Secret = generateTotpSecret();

    if (administrator === undefined) {
      throw new Error('The setup code did not create the account.');
    }

    state.startTotpEnrollment(administrator['id'], secret);

    expect(state.getTotpEnrollment(administrator['id'])).toBe(secret);

    const recoveryCodes: Lib_State_SignInState_TurnsTheAuthenticatorOnWithSingleUseRecoveryCodesAndRejectsReplay_RecoveryCodes = state.enableTotp(administrator['id'], secret, 100);

    if (recoveryCodes === undefined) {
      throw new Error('Turning on the authenticator returned no recovery codes.');
    }

    expect(recoveryCodes).toHaveLength(10);

    expect(state.getTotpEnrollment(administrator['id'])).toBeUndefined();

    expect(state.getAdministratorSecurity(administrator['id'])).toEqual(expect.objectContaining({
      recoveryCodesRemaining: 10,
      totpEnabled: true,
    }));

    expect(state.consumeRecoveryCode(administrator['id'], ` ${(recoveryCodes[0] ?? '').toLowerCase()} `)).toBe(true);

    expect(state.consumeRecoveryCode(administrator['id'], recoveryCodes[0] ?? '')).toBe(false);

    expect(state.getAdministratorSecurity(administrator['id'])['recoveryCodesRemaining']).toBe(9);

    expect(state.verifyTotp(administrator['id'], '000000', 100 * 30000)).toBe(false);

    expect(state.replaceRecoveryCodes(administrator['id'])).toHaveLength(10);

    expect(state.consumeRecoveryCode(administrator['id'], recoveryCodes[1] ?? '')).toBe(false);

    expect(state.disableTotp(administrator['id'])).toBe('disabled');

    expect(state.disableTotp(administrator['id'])).toBe('not-found');

    expect(state.replaceRecoveryCodes(administrator['id'])).toBeUndefined();

    expect(state.getAdministratorSecurity(administrator['id'])).toEqual(expect.objectContaining({
      recoveryCodesRemaining: 0,
      totpEnabled: false,
    }));

    state.close();

    return;
  });

  it('discards a second-factor challenge after five wrong codes', async () => {
    const state: Lib_State_SignInState_DiscardsASecondFactorChallengeAfterFiveWrongCodes_State = await createClaimedState();
    const administrator: Lib_State_SignInState_DiscardsASecondFactorChallengeAfterFiveWrongCodes_Administrator = state.getAdministrator();

    if (administrator === undefined) {
      throw new Error('The setup code did not create the account.');
    }

    const challenge: Lib_State_SignInState_DiscardsASecondFactorChallengeAfterFiveWrongCodes_Challenge = state.createSignInChallenge(administrator['id']);

    expect(state.getSignInChallenge(challenge['challenge'])).toEqual({
      administratorId: administrator['id'],
    });

    for (let failure = 0; failure < 4; failure += 1) {
      expect(state.recordSignInChallengeFailure(challenge['challenge'])).toBe(false);
    }

    expect(state.recordSignInChallengeFailure(challenge['challenge'])).toBe(true);

    expect(state.getSignInChallenge(challenge['challenge'])).toBeUndefined();

    state.close();

    return;
  });

  it('stores passkeys with their hostname and uses each ceremony once', async () => {
    const state: Lib_State_SignInState_StoresPasskeysWithTheirHostnameAndUsesEachCeremonyOnce_State = await createClaimedState();
    const administrator: Lib_State_SignInState_StoresPasskeysWithTheirHostnameAndUsesEachCeremonyOnce_Administrator = state.getAdministrator();

    if (administrator === undefined) {
      throw new Error('The setup code did not create the account.');
    }

    expect(state.createPasskey(administrator['id'], 'A passkey name that is longer than sixty-four characters in all', 'outpost.example.net', {
      backedUp: true,
      counter: 0,
      deviceType: 'multiDevice',
      id: 'credential-one',
      publicKey: new Uint8Array([
        1,
        2,
        3,
      ]),
      transports: ['internal'],
    })).toBe('created');

    expect(state.getAdministratorSecurity(administrator['id'])['passkeys']).toEqual([expect.objectContaining({
      hostname: 'outpost.example.net',
      id: 'credential-one',
      lastUsedAt: null,
      name: 'A passkey name that is longer than sixty-four characters in all',
    })]);

    expect(state.updatePasskeyUsage('credential-one', 1, 'multiDevice', true, 'outpost.example.net')).toBe('updated');

    expect(state.getPasskey('credential-one')).toEqual(expect.objectContaining({
      counter: 1,
      rpId: 'outpost.example.net',
    }));

    const ceremonyId: Lib_State_SignInState_StoresPasskeysWithTheirHostnameAndUsesEachCeremonyOnce_CeremonyId = state.createWebauthnCeremony({
      challenge: 'fixture-challenge',
      kind: 'authentication',
      origin: 'https://outpost.example.net',
      rpId: 'outpost.example.net',
    });

    expect(state.takeWebauthnCeremony(ceremonyId, 'registration')).toBeUndefined();

    expect(state.takeWebauthnCeremony(ceremonyId, 'authentication')).toEqual({
      challenge: 'fixture-challenge',
      origin: 'https://outpost.example.net',
      rpId: 'outpost.example.net',
    });

    expect(state.takeWebauthnCeremony(ceremonyId, 'authentication')).toBeUndefined();

    expect(state.removePasskey(administrator['id'], 'credential-one')).toBe('removed');

    expect(state.removePasskey(administrator['id'], 'credential-one')).toBe('not-found');

    state.close();

    return;
  });

  return;
});

/**
 * Lib - State - Token State.
 *
 * Checks the token lifecycle, newest-first order, last-use times, that only
 * hashes are stored, and the scope check that open event streams use.
 *
 * @since 1.0.0
 */
describe('token state', () => {
  beforeEach(() => {
    dataDirectory = mkdtempSync(join(tmpdir(), 'outpost-state-'));

    return;
  });

  afterEach(() => {
    rmSync(getDataDirectory(), {
      force: true,
      recursive: true,
    });

    dataDirectory = undefined;

    return;
  });

  it('applies token lifecycle changes immediately and records last use', () => {
    const state: Lib_State_TokenState_AppliesTokenLifecycleChangesImmediatelyAndRecordsLastUse_State = new State(getDataDirectory());
    const createdToken: Lib_State_TokenState_AppliesTokenLifecycleChangesImmediatelyAndRecordsLastUse_CreatedToken = state.createToken({
      name: 'Home Assistant',
      scopes: [
        'updates:run',
        'status:read',
      ],
    });

    if (createdToken === undefined) {
      throw new Error('The token was not created.');
    }

    const tokenId: Lib_State_TokenState_AppliesTokenLifecycleChangesImmediatelyAndRecordsLastUse_TokenId = createdToken['token']['id'];

    expect(tokenId).toMatch(personalAccessTokenIdPattern);

    expect(createdToken['personalAccessToken']).toMatch(personalAccessTokenPattern);

    expect(createdToken['token']).toEqual({
      createdAt: expect.any(String),
      expiresAt: null,
      id: tokenId,
      lastUsedAt: null,
      name: 'Home Assistant',
      scopes: [
        'status:read',
        'updates:run',
      ],
    });

    expect(state.createToken({
      name: 'home assistant',
      scopes: ['metrics:read'],
    })).toBeUndefined();

    expect(readFileSync(join(getDataDirectory(), 'outpost.sqlite3')).includes(createdToken['personalAccessToken'])).toBe(false);

    expect(state.authenticateToken(createdToken['personalAccessToken'])).toEqual({
      id: tokenId,
      name: 'Home Assistant',
      scopes: [
        'status:read',
        'updates:run',
      ],
    });

    expect(state.getTokens()).toEqual([expect.objectContaining({
      id: tokenId,
      lastUsedAt: expect.any(String),
    })]);

    const otherToken: Lib_State_TokenState_AppliesTokenLifecycleChangesImmediatelyAndRecordsLastUse_OtherToken = state.createToken({
      name: 'Prometheus',
      scopes: ['metrics:read'],
    });

    if (otherToken === undefined) {
      throw new Error('The second token was not created.');
    }

    expect(state.getTokens().map((token) => token['name'])).toEqual([
      'Prometheus',
      'Home Assistant',
    ]);

    const database: Lib_State_TokenState_AppliesTokenLifecycleChangesImmediatelyAndRecordsLastUse_Database = new DatabaseSync(join(getDataDirectory(), 'outpost.sqlite3'));

    database.prepare('UPDATE api_tokens SET created_at = ? WHERE id = ?').run('2099-01-01T00:00:00.000Z', tokenId);

    database.close();

    expect(state.getTokens().map((token) => token['name'])).toEqual([
      'Home Assistant',
      'Prometheus',
    ]);

    expect(state.updateToken(tokenId, {
      name: 'PROMETHEUS',
      scopes: ['status:read'],
    })).toBe('name-taken');

    expect(state.updateToken(tokenId, {
      expiresAt: '2099-01-01T00:00:00.000Z',
      name: 'home assistant',
      scopes: ['status:read'],
    })).toEqual(expect.objectContaining({
      expiresAt: '2099-01-01T00:00:00.000Z',
      id: tokenId,
      name: 'home assistant',
      scopes: ['status:read'],
    }));

    expect(state.updateToken(tokenId, {
      name: 'Home Assistant',
      scopes: ['status:read'],
    })).toEqual(expect.objectContaining({
      expiresAt: '2099-01-01T00:00:00.000Z',
      name: 'Home Assistant',
    }));

    expect(state.updateToken(tokenId, {
      expiresAt: null,
      name: 'Home Assistant',
      scopes: ['status:read'],
    })).toEqual(expect.objectContaining({
      expiresAt: null,
    }));

    expect(state.authenticateToken(createdToken['personalAccessToken'])).toEqual(expect.objectContaining({
      name: 'Home Assistant',
      scopes: ['status:read'],
    }));

    expect(state.removeToken(tokenId)).toBe('removed');

    expect(state.authenticateToken(createdToken['personalAccessToken'])).toBeUndefined();

    expect(state.removeToken(tokenId)).toBe('not-found');

    expect(state.updateToken(tokenId, {
      name: 'Home Assistant',
      scopes: ['status:read'],
    })).toBe('not-found');

    state.close();

    return;
  });

  it('reports the scopes of a live token only', () => {
    const clock: Lib_State_TokenState_ReportsTheScopesOfALiveTokenOnly_Clock = { value: Date.parse('2026-10-25T00:00:00.000Z') };
    const state: Lib_State_TokenState_ReportsTheScopesOfALiveTokenOnly_State = new State(getDataDirectory(), () => clock['value']);
    const createdToken: Lib_State_TokenState_ReportsTheScopesOfALiveTokenOnly_CreatedToken = state.createToken({
      expiresAt: '2026-10-26T00:00:00.000Z',
      name: 'Home Assistant',
      scopes: ['status:read'],
    });

    if (createdToken === undefined) {
      throw new Error('The token was not created.');
    }

    expect(state.getTokenScopes(createdToken['token']['id'])).toEqual(['status:read']);

    expect(state.authenticateToken(createdToken['personalAccessToken'])).toBeDefined();

    Reflect.set(clock, 'value', Date.parse('2026-10-26T00:00:00.000Z'));

    expect(state.getTokenScopes(createdToken['token']['id'])).toBeUndefined();

    expect(state.authenticateToken(createdToken['personalAccessToken'])).toBeUndefined();

    expect(state.getTokenScopes('tok-0000000000000000')).toBeUndefined();

    state.close();

    return;
  });

  return;
});

/**
 * Lib - State - Runtime Settings.
 *
 * Confirms defaults are written once and later edits survive a database reopen.
 * The persisted document remains the source of truth after the process restarts.
 *
 * @since 1.0.0
 */
describe('runtime settings', () => {
  beforeEach(() => {
    dataDirectory = mkdtempSync(join(tmpdir(), 'outpost-state-'));

    return;
  });

  afterEach(() => {
    rmSync(getDataDirectory(), {
      force: true,
      recursive: true,
    });

    dataDirectory = undefined;

    return;
  });

  it('seeds and persists runtime settings', () => {
    const state: Lib_State_RuntimeSettings_SeedsAndPersistsRuntimeSettings_State = new State(getDataDirectory());
    const settings: Lib_State_RuntimeSettings_SeedsAndPersistsRuntimeSettings_Settings = {
      cleanup: true,
      healthTimeoutSeconds: 120,
      labelMode: 'opt-out',
      monitorOnly: false,
      runOnStart: false,
      schedule: '0 0 4 * * *',
      settleSeconds: 10,
      stopTimeoutSeconds: 30,
    };

    expect(state.getRuntimeSettings(settings)).toEqual(settings);

    Reflect.set(settings, 'monitorOnly', true);
    Reflect.set(settings, 'schedule', '0 15 2 * * *');

    state.setRuntimeSettings(settings);

    state.close();

    const reopened: Lib_State_RuntimeSettings_SeedsAndPersistsRuntimeSettings_Reopened = new State(getDataDirectory());

    expect(reopened.getRuntimeSettings({
      ...settings,
      monitorOnly: false,
      schedule: '0 0 1 * * *',
    })).toEqual(settings);

    reopened.close();

    return;
  });

  return;
});

/**
 * Lib - State - Notification Destinations.
 *
 * Checks that destination secrets are sealed, kept through an edit that leaves them
 * blank, and only sent to the events each destination chose.
 *
 * @since 1.0.0
 */
describe('notification destinations', () => {
  beforeEach(() => {
    dataDirectory = mkdtempSync(join(tmpdir(), 'outpost-state-'));

    return;
  });

  afterEach(() => {
    rmSync(getDataDirectory(), {
      force: true,
      recursive: true,
    });

    dataDirectory = undefined;

    return;
  });

  it('seals secrets and keeps them through an edit that leaves them blank', () => {
    const state: Lib_State_NotificationDestinations_SealsSecretsAndKeepsThemThroughAnEditThatLeavesThemBlank_State = new State(getDataDirectory());
    const created: Lib_State_NotificationDestinations_SealsSecretsAndKeepsThemThroughAnEditThatLeavesThemBlank_Created = state.createNotificationTarget({
      events: [
        'updates-applied',
        'update-failed',
      ],
      name: 'Homelab chat',
      secrets: { botToken: '123456:telegram-secret' },
      service: 'telegram',
      settings: { chatId: '-1002468013579' },
    });

    if (created === undefined) {
      throw new Error('The fixture destination was not created.');
    }

    expect(created).toEqual(expect.objectContaining({
      events: [
        'updates-applied',
        'update-failed',
      ],
      lastAttemptAt: null,
      secrets: { botToken: true },
      secretsMissing: [],
      settings: { chatId: '-1002468013579' },
    }));

    expect(state.createNotificationTarget({
      events: ['update-failed'],
      name: 'HOMELAB CHAT',
      secrets: {},
      service: 'ntfy',
      settings: { url: 'https://ntfy.sh/outpost-updates' },
    })).toBeUndefined();

    expect(state.updateNotificationTarget(created['id'], {
      events: ['update-failed'],
      name: 'Family chat',
      secrets: {},
      settings: { chatId: '-1009876543210' },
    })).toEqual(expect.objectContaining({
      name: 'Family chat',
      secrets: { botToken: true },
    }));

    expect(state.getNotificationDelivery(created['id'])).toEqual({
      id: created['id'],
      name: 'Family chat',
      target: {
        secrets: { botToken: '123456:telegram-secret' },
        service: 'telegram',
        settings: { chatId: '-1009876543210' },
      },
    });

    expect(state.wantsNotification(['update-failed'])).toBe(true);

    expect(state.wantsNotification(['updates-applied'])).toBe(false);

    expect(state.getNotificationDeliveries('updates-available')).toEqual([]);

    state.recordNotificationAttempt(created['id'], 'HTTP 401');

    expect(state.getNotificationTargets()).toEqual([expect.objectContaining({
      lastAttemptAt: expect.any(String),
      lastError: 'HTTP 401',
    })]);

    expect(state.removeNotificationTarget(created['id'])).toBe('removed');

    expect(state.removeNotificationTarget(created['id'])).toBe('not-found');

    expect(state.getNotificationTargets()).toEqual([]);

    state.close();

    return;
  });

  return;
});

/**
 * Lib - State - Registry Sign-ins.
 *
 * Checks that registry passwords are sealed and kept through edits that leave them out,
 * that every Docker Hub name finds the docker.io sign-in, and that an older database keeps
 * its notices when it gains the table.
 *
 * @since 1.0.0
 */
describe('registry sign-ins', () => {
  beforeEach(() => {
    dataDirectory = mkdtempSync(join(tmpdir(), 'outpost-state-'));

    return;
  });

  afterEach(() => {
    rmSync(getDataDirectory(), {
      force: true,
      recursive: true,
    });

    dataDirectory = undefined;

    return;
  });

  it('seals passwords and finds every Docker Hub name', () => {
    const state: Lib_State_RegistrySignIns_SealsPasswordsAndFindsEveryDockerHubName_State = new State(getDataDirectory());
    const dockerHub: Lib_State_RegistrySignIns_SealsPasswordsAndFindsEveryDockerHubName_DockerHub = state.createRegistry({
      password: 'dckr_pat_example',
      registry: '  https://index.docker.io/v1/  ',
      username: 'outpost',
    });
    const ghcr: Lib_State_RegistrySignIns_SealsPasswordsAndFindsEveryDockerHubName_Ghcr = state.createRegistry({
      password: 'ghp_example',
      registry: 'GHCR.io',
      username: 'cbnventures-bot',
    });

    if (dockerHub === undefined || ghcr === undefined) {
      throw new Error('The fixture sign-ins were not created.');
    }

    expect(dockerHub).toEqual({
      createdAt: expect.any(String),
      id: expect.stringMatching(registryIdPattern),
      passwordMissing: false,
      registry: 'docker.io',
      updatedAt: expect.any(String),
      username: 'outpost',
    });

    for (const registry of [
      DOCKER_HUB_REGISTRY,
      'docker.io',
      'index.docker.io',
      'https://index.docker.io/v1/',
    ]) {
      expect(state.findRegistryCredentials(registry)).toEqual({
        password: 'dckr_pat_example',
        username: 'outpost',
      });
    }

    expect(state.findRegistryCredentials('quay.io')).toBeUndefined();

    expect(state.createRegistry({
      password: 'dckr_pat_other',
      registry: 'registry-1.docker.io',
      username: 'someone',
    })).toBeUndefined();

    expect(state.createRegistry({
      password: 'ghp_other',
      registry: 'https://ghcr.io/',
      username: 'someone',
    })).toBeUndefined();

    expect(state.getRegistries().map((registry) => registry['registry'])).toEqual([
      'docker.io',
      'ghcr.io',
    ]);

    // An edit that leaves the password out keeps the saved one.
    expect(state.updateRegistry(ghcr['id'], {
      registry: 'ghcr.io',
      username: 'outpost-bot',
    })).toEqual(expect.objectContaining({
      passwordMissing: false,
      username: 'outpost-bot',
    }));

    expect(state.findRegistryCredentials('ghcr.io')).toEqual({
      password: 'ghp_example',
      username: 'outpost-bot',
    });

    expect(state.updateRegistry(ghcr['id'], {
      password: 'ghp_rotated',
      registry: 'ghcr.io',
      username: 'outpost-bot',
    })).toEqual(expect.objectContaining({
      registry: 'ghcr.io',
    }));

    expect(state.findRegistryCredentials('GHCR.IO')).toEqual({
      password: 'ghp_rotated',
      username: 'outpost-bot',
    });

    expect(state.updateRegistry(ghcr['id'], {
      registry: 'index.docker.io',
      username: 'outpost-bot',
    })).toBe('registry-taken');

    expect(state.updateRegistry('reg-0000000000000000', {
      registry: 'quay.io',
      username: 'outpost-bot',
    })).toBe('not-found');

    expect(state.removeRegistry(dockerHub['id'])).toBe('removed');

    expect(state.removeRegistry(dockerHub['id'])).toBe('not-found');

    expect(state.findRegistryCredentials(DOCKER_HUB_REGISTRY)).toBeUndefined();

    state.close();

    expect(readFileSync(join(getDataDirectory(), 'outpost.sqlite3')).includes('ghp_rotated')).toBe(false);

    return;
  });

  it('keeps earlier notices when an older database gains sign-ins', async () => {
    const state: Lib_State_RegistrySignIns_KeepsEarlierNoticesWhenAnOlderDatabaseGainsSignIns_State = await createClaimedState();
    const administrator: Lib_State_RegistrySignIns_KeepsEarlierNoticesWhenAnOlderDatabaseGainsSignIns_Administrator = state.getAdministrator();

    if (administrator === undefined) {
      throw new Error('The setup code did not create the account.');
    }

    state.close();

    // Put the database back the way version 3 left it, with one notice waiting.
    const database: Lib_State_RegistrySignIns_KeepsEarlierNoticesWhenAnOlderDatabaseGainsSignIns_Database = new DatabaseSync(join(getDataDirectory(), 'outpost.sqlite3'));

    database.exec([
      'DROP TABLE removed_secrets;',
      'DROP TABLE registry_credentials;',
      'DELETE FROM schema_migrations WHERE version = 4;',
      'CREATE TABLE removed_secrets (kind TEXT NOT NULL CHECK (kind IN (\'authenticator\', \'notification\')), administrator_id TEXT REFERENCES administrators(id) ON DELETE CASCADE, notification_id TEXT REFERENCES notification_targets(id) ON DELETE CASCADE, removed_at TEXT NOT NULL, CHECK ((kind = \'authenticator\' AND administrator_id IS NOT NULL AND notification_id IS NULL) OR (kind = \'notification\' AND administrator_id IS NULL AND notification_id IS NOT NULL))) STRICT;',
      'CREATE UNIQUE INDEX removed_secrets_kind_owner ON removed_secrets (kind, COALESCE(administrator_id, \'\'), COALESCE(notification_id, \'\'));',
    ].join('\n'));

    database.prepare('INSERT INTO removed_secrets (kind, administrator_id, notification_id, removed_at) VALUES (\'authenticator\', ?, NULL, \'2026-11-01T00:00:00.000Z\')').run(administrator['id']);

    database.close();

    const reopened: Lib_State_RegistrySignIns_KeepsEarlierNoticesWhenAnOlderDatabaseGainsSignIns_Reopened = new State(getDataDirectory());

    expect(reopened.getRemovedSecrets(administrator['id'])).toEqual([{
      kind: 'authenticator',
      removedAt: '2026-11-01T00:00:00.000Z',
    }]);

    expect(reopened.createRegistry({
      password: 'ghp_example',
      registry: 'ghcr.io',
      username: 'cbnventures-bot',
    })).toEqual(expect.objectContaining({
      registry: 'ghcr.io',
    }));

    reopened.dismissRemovedSecrets(administrator['id']);

    expect(reopened.getRemovedSecrets(administrator['id'])).toEqual([]);

    reopened.close();

    return;
  });

  return;
});

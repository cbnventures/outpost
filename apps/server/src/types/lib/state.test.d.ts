import type { DatabaseSync, SQLOutputValue } from 'node:sqlite';

import type { MockInstance } from 'vitest';

import type { Runner as State } from '../../lib/state.js';
import type { Shared_RuntimeSettings } from '../shared.d.ts';
import type {
  Lib_State_Runner_ClaimInstallation_Returns,
  Lib_State_Runner_CreateNotificationTarget_Returns,
  Lib_State_Runner_CreateRegistry_Returns,
  Lib_State_Runner_CreateSession_Returns,
  Lib_State_Runner_CreateSignInChallenge_Returns,
  Lib_State_Runner_CreateToken_Returns,
  Lib_State_Runner_EnableTotp_Returns,
  Lib_State_Runner_GetAdministrator_Returns,
  Lib_State_Runner_PrepareSetupClaim_Returns,
} from './state.d.ts';

/**
 * Lib - State - Account File Import - Ignores Account Json Once An Account Exists.
 *
 * @since 1.0.0
 */
export type Lib_State_AccountFileImport_IgnoresAccountJsonOnceAnAccountExists_State = State;

export type Lib_State_AccountFileImport_IgnoresAccountJsonOnceAnAccountExists_AccountPath = string;

export type Lib_State_AccountFileImport_IgnoresAccountJsonOnceAnAccountExists_PasswordHash = string;

export type Lib_State_AccountFileImport_IgnoresAccountJsonOnceAnAccountExists_Reopened = State;

/**
 * Lib - State - Account File Import - Leaves A Damaged Account Json In Place.
 *
 * @since 1.0.0
 */
export type Lib_State_AccountFileImport_LeavesADamagedAccountJsonInPlace_AccountPath = string;

export type Lib_State_AccountFileImport_LeavesADamagedAccountJsonInPlace_Stderr = MockInstance<typeof process.stderr.write>;

export type Lib_State_AccountFileImport_LeavesADamagedAccountJsonInPlace_State = State;

/**
 * Lib - State - Account File Import - Moves A Valid Account Json Into The Database Once.
 *
 * @since 1.0.0
 */
export type Lib_State_AccountFileImport_MovesAValidAccountJsonIntoTheDatabaseOnce_AccountPath = string;

export type Lib_State_AccountFileImport_MovesAValidAccountJsonIntoTheDatabaseOnce_PasswordHash = string;

export type Lib_State_AccountFileImport_MovesAValidAccountJsonIntoTheDatabaseOnce_Stdout = MockInstance<typeof process.stdout.write>;

export type Lib_State_AccountFileImport_MovesAValidAccountJsonIntoTheDatabaseOnce_State = State;

export type Lib_State_AccountFileImport_MovesAValidAccountJsonIntoTheDatabaseOnce_Reopened = State;

/**
 * Lib - State - Create Claimed State.
 *
 * @since 1.0.0
 */
export type Lib_State_CreateClaimedState_Now = () => number;

export type Lib_State_CreateClaimedState_Returns = Promise<State>;

export type Lib_State_CreateClaimedState_State = State;

export type Lib_State_CreateClaimedState_SetupClaim = Lib_State_Runner_PrepareSetupClaim_Returns;

/**
 * Lib - State - Data Directory.
 *
 * @since 1.0.0
 */
export type Lib_State_DataDirectory = string | undefined;

/**
 * Lib - State - First Run Setup - Claims The Installation Once With The Printed Setup Code.
 *
 * @since 1.0.0
 */
export type Lib_State_FirstRunSetup_ClaimsTheInstallationOnceWithThePrintedSetupCode_State = State;

export type Lib_State_FirstRunSetup_ClaimsTheInstallationOnceWithThePrintedSetupCode_SetupClaim = Lib_State_Runner_PrepareSetupClaim_Returns;

export type Lib_State_FirstRunSetup_ClaimsTheInstallationOnceWithThePrintedSetupCode_Result = Awaited<Lib_State_Runner_ClaimInstallation_Returns>;

/**
 * Lib - State - First Run Setup - Refuses A Setup Code That Expired Or Was Replaced.
 *
 * @since 1.0.0
 */
export type Lib_State_FirstRunSetup_RefusesASetupCodeThatExpiredOrWasReplaced_Clock_Value = number;

export type Lib_State_FirstRunSetup_RefusesASetupCodeThatExpiredOrWasReplaced_Clock = {
  value: Lib_State_FirstRunSetup_RefusesASetupCodeThatExpiredOrWasReplaced_Clock_Value;
};

export type Lib_State_FirstRunSetup_RefusesASetupCodeThatExpiredOrWasReplaced_State = State;

export type Lib_State_FirstRunSetup_RefusesASetupCodeThatExpiredOrWasReplaced_First = Lib_State_Runner_PrepareSetupClaim_Returns;

export type Lib_State_FirstRunSetup_RefusesASetupCodeThatExpiredOrWasReplaced_Second = Lib_State_Runner_PrepareSetupClaim_Returns;

/**
 * Lib - State - First Run Setup - Keeps The Notice Until It Is Dismissed.
 *
 * @since 1.0.0
 */
export type Lib_State_FirstRunSetup_KeepsTheNoticeUntilItIsDismissed_State = State;

export type Lib_State_FirstRunSetup_KeepsTheNoticeUntilItIsDismissed_Administrator = Lib_State_Runner_GetAdministrator_Returns;

export type Lib_State_FirstRunSetup_KeepsTheNoticeUntilItIsDismissed_Stderr = MockInstance<typeof process.stderr.write>;

export type Lib_State_FirstRunSetup_KeepsTheNoticeUntilItIsDismissed_Reopened = State;

/**
 * Lib - State - First Run Setup - Makes A New Key And Turns Off The Authenticator When The Key File Is Missing.
 *
 * @since 1.0.0
 */
export type Lib_State_FirstRunSetup_MakesANewKeyAndTurnsOffTheAuthenticatorWhenTheKeyFileIsMissing_State = State;

export type Lib_State_FirstRunSetup_MakesANewKeyAndTurnsOffTheAuthenticatorWhenTheKeyFileIsMissing_Administrator = Lib_State_Runner_GetAdministrator_Returns;

export type Lib_State_FirstRunSetup_MakesANewKeyAndTurnsOffTheAuthenticatorWhenTheKeyFileIsMissing_KeyPath = string;

export type Lib_State_FirstRunSetup_MakesANewKeyAndTurnsOffTheAuthenticatorWhenTheKeyFileIsMissing_OldKey = string;

export type Lib_State_FirstRunSetup_MakesANewKeyAndTurnsOffTheAuthenticatorWhenTheKeyFileIsMissing_Stderr = MockInstance<typeof process.stderr.write>;

export type Lib_State_FirstRunSetup_MakesANewKeyAndTurnsOffTheAuthenticatorWhenTheKeyFileIsMissing_Reopened = State;

export type Lib_State_FirstRunSetup_MakesANewKeyAndTurnsOffTheAuthenticatorWhenTheKeyFileIsMissing_Restarted = State;

/**
 * Lib - State - First Run Setup - Makes A New Key Quietly When Nothing Used The Old One.
 *
 * @since 1.0.0
 */
export type Lib_State_FirstRunSetup_MakesANewKeyQuietlyWhenNothingUsedTheOldOne_State = State;

export type Lib_State_FirstRunSetup_MakesANewKeyQuietlyWhenNothingUsedTheOldOne_Administrator = Lib_State_Runner_GetAdministrator_Returns;

export type Lib_State_FirstRunSetup_MakesANewKeyQuietlyWhenNothingUsedTheOldOne_KeyPath = string;

export type Lib_State_FirstRunSetup_MakesANewKeyQuietlyWhenNothingUsedTheOldOne_Stderr = MockInstance<typeof process.stderr.write>;

export type Lib_State_FirstRunSetup_MakesANewKeyQuietlyWhenNothingUsedTheOldOne_Reopened = State;

/**
 * Lib - State - First Run Setup - Starts Without An Account And Keeps A Generated Key Beside The Data.
 *
 * @since 1.0.0
 */
export type Lib_State_FirstRunSetup_StartsWithoutAnAccountAndKeepsAGeneratedKeyBesideTheData_State = State;

export type Lib_State_FirstRunSetup_StartsWithoutAnAccountAndKeepsAGeneratedKeyBesideTheData_KeyPath = string;

export type Lib_State_FirstRunSetup_StartsWithoutAnAccountAndKeepsAGeneratedKeyBesideTheData_KeyMode = string;

export type Lib_State_FirstRunSetup_StartsWithoutAnAccountAndKeepsAGeneratedKeyBesideTheData_DatabaseMode = string;

export type Lib_State_FirstRunSetup_StartsWithoutAnAccountAndKeepsAGeneratedKeyBesideTheData_Administrator = Lib_State_Runner_GetAdministrator_Returns;

export type Lib_State_FirstRunSetup_StartsWithoutAnAccountAndKeepsAGeneratedKeyBesideTheData_Secret = string;

export type Lib_State_FirstRunSetup_StartsWithoutAnAccountAndKeepsAGeneratedKeyBesideTheData_Reopened = State;

/**
 * Lib - State - First Run Setup - Stops On A Key File From Another Database Or A Damaged One.
 *
 * @since 1.0.0
 */
export type Lib_State_FirstRunSetup_StopsOnAKeyFileFromAnotherDatabaseOrADamagedOne_State = State;

export type Lib_State_FirstRunSetup_StopsOnAKeyFileFromAnotherDatabaseOrADamagedOne_Administrator = Lib_State_Runner_GetAdministrator_Returns;

export type Lib_State_FirstRunSetup_StopsOnAKeyFileFromAnotherDatabaseOrADamagedOne_KeyPath = string;

/**
 * Lib - State - Get Data Directory.
 *
 * @since 1.0.0
 */
export type Lib_State_GetDataDirectory_Returns = string;

/**
 * Lib - State - Sign In State - Discards A Second Factor Challenge After Five Wrong Codes.
 *
 * @since 1.0.0
 */
export type Lib_State_SignInState_DiscardsASecondFactorChallengeAfterFiveWrongCodes_State = State;

export type Lib_State_SignInState_DiscardsASecondFactorChallengeAfterFiveWrongCodes_Administrator = Lib_State_Runner_GetAdministrator_Returns;

export type Lib_State_SignInState_DiscardsASecondFactorChallengeAfterFiveWrongCodes_Challenge = Lib_State_Runner_CreateSignInChallenge_Returns;

/**
 * Lib - State - Sign In State - Keeps Browser Sessions Across Restarts Until They Are Signed Out.
 *
 * @since 1.0.0
 */
export type Lib_State_SignInState_KeepsBrowserSessionsAcrossRestartsUntilTheyAreSignedOut_State = State;

export type Lib_State_SignInState_KeepsBrowserSessionsAcrossRestartsUntilTheyAreSignedOut_Administrator = Lib_State_Runner_GetAdministrator_Returns;

export type Lib_State_SignInState_KeepsBrowserSessionsAcrossRestartsUntilTheyAreSignedOut_FirstSession = Lib_State_Runner_CreateSession_Returns;

export type Lib_State_SignInState_KeepsBrowserSessionsAcrossRestartsUntilTheyAreSignedOut_SecondSession = Lib_State_Runner_CreateSession_Returns;

export type Lib_State_SignInState_KeepsBrowserSessionsAcrossRestartsUntilTheyAreSignedOut_Reopened = State;

/**
 * Lib - State - Sign In State - Records When And From Where A Session Was Last Seen.
 *
 * @since 1.0.0
 */
export type Lib_State_SignInState_RecordsWhenAndFromWhereASessionWasLastSeen_Clock_Value = number;

export type Lib_State_SignInState_RecordsWhenAndFromWhereASessionWasLastSeen_Clock = {
  value: Lib_State_SignInState_RecordsWhenAndFromWhereASessionWasLastSeen_Clock_Value;
};

export type Lib_State_SignInState_RecordsWhenAndFromWhereASessionWasLastSeen_State = State;

export type Lib_State_SignInState_RecordsWhenAndFromWhereASessionWasLastSeen_Administrator = Lib_State_Runner_GetAdministrator_Returns;

export type Lib_State_SignInState_RecordsWhenAndFromWhereASessionWasLastSeen_Session = Lib_State_Runner_CreateSession_Returns;

export type Lib_State_SignInState_RecordsWhenAndFromWhereASessionWasLastSeen_Database = DatabaseSync;

export type Lib_State_SignInState_RecordsWhenAndFromWhereASessionWasLastSeen_SessionRow = Record<string, SQLOutputValue> | undefined;

/**
 * Lib - State - Sign In State - Stores Passkeys With Their Hostname And Uses Each Ceremony Once.
 *
 * @since 1.0.0
 */
export type Lib_State_SignInState_StoresPasskeysWithTheirHostnameAndUsesEachCeremonyOnce_State = State;

export type Lib_State_SignInState_StoresPasskeysWithTheirHostnameAndUsesEachCeremonyOnce_Administrator = Lib_State_Runner_GetAdministrator_Returns;

export type Lib_State_SignInState_StoresPasskeysWithTheirHostnameAndUsesEachCeremonyOnce_CeremonyId = string;

/**
 * Lib - State - Sign In State - Turns The Authenticator On With Single Use Recovery Codes And Rejects Replay.
 *
 * @since 1.0.0
 */
export type Lib_State_SignInState_TurnsTheAuthenticatorOnWithSingleUseRecoveryCodesAndRejectsReplay_State = State;

export type Lib_State_SignInState_TurnsTheAuthenticatorOnWithSingleUseRecoveryCodesAndRejectsReplay_Administrator = Lib_State_Runner_GetAdministrator_Returns;

export type Lib_State_SignInState_TurnsTheAuthenticatorOnWithSingleUseRecoveryCodesAndRejectsReplay_Secret = string;

export type Lib_State_SignInState_TurnsTheAuthenticatorOnWithSingleUseRecoveryCodesAndRejectsReplay_RecoveryCodes = Lib_State_Runner_EnableTotp_Returns;

/**
 * Lib - State - Token State - Applies Token Lifecycle Changes Immediately And Records Last Use.
 *
 * @since 1.0.0
 */
export type Lib_State_TokenState_AppliesTokenLifecycleChangesImmediatelyAndRecordsLastUse_State = State;

export type Lib_State_TokenState_AppliesTokenLifecycleChangesImmediatelyAndRecordsLastUse_CreatedToken = Lib_State_Runner_CreateToken_Returns;

export type Lib_State_TokenState_AppliesTokenLifecycleChangesImmediatelyAndRecordsLastUse_TokenId = string;

export type Lib_State_TokenState_AppliesTokenLifecycleChangesImmediatelyAndRecordsLastUse_OtherToken = Lib_State_Runner_CreateToken_Returns;

export type Lib_State_TokenState_AppliesTokenLifecycleChangesImmediatelyAndRecordsLastUse_Database = DatabaseSync;

/**
 * Lib - State - Token State - Reports The Scopes Of A Live Token Only.
 *
 * @since 1.0.0
 */
export type Lib_State_TokenState_ReportsTheScopesOfALiveTokenOnly_Clock_Value = number;

export type Lib_State_TokenState_ReportsTheScopesOfALiveTokenOnly_Clock = {
  value: Lib_State_TokenState_ReportsTheScopesOfALiveTokenOnly_Clock_Value;
};

export type Lib_State_TokenState_ReportsTheScopesOfALiveTokenOnly_State = State;

export type Lib_State_TokenState_ReportsTheScopesOfALiveTokenOnly_CreatedToken = Lib_State_Runner_CreateToken_Returns;

/**
 * Lib - State - First-run Setup - Takes Notification Secrets With A Lost Key.
 *
 * @since 1.0.0
 */
export type Lib_State_FirstRunSetup_TakesNotificationSecretsWithALostKeyAndKeepsTheDestination_State = State;

export type Lib_State_FirstRunSetup_TakesNotificationSecretsWithALostKeyAndKeepsTheDestination_Administrator = Lib_State_Runner_GetAdministrator_Returns;

export type Lib_State_FirstRunSetup_TakesNotificationSecretsWithALostKeyAndKeepsTheDestination_KeyPath = string;

export type Lib_State_FirstRunSetup_TakesNotificationSecretsWithALostKeyAndKeepsTheDestination_Chat = Lib_State_Runner_CreateNotificationTarget_Returns;

export type Lib_State_FirstRunSetup_TakesNotificationSecretsWithALostKeyAndKeepsTheDestination_Phone = Lib_State_Runner_CreateNotificationTarget_Returns;

export type Lib_State_FirstRunSetup_TakesNotificationSecretsWithALostKeyAndKeepsTheDestination_Stderr = MockInstance<typeof process.stderr.write>;

export type Lib_State_FirstRunSetup_TakesNotificationSecretsWithALostKeyAndKeepsTheDestination_Reopened = State;

/**
 * Lib - State - First-run Setup - Takes Registry Passwords With A Lost Key And Keeps The Sign Ins.
 *
 * @since 1.0.0
 */
export type Lib_State_FirstRunSetup_TakesRegistryPasswordsWithALostKeyAndKeepsTheSignIns_State = State;

export type Lib_State_FirstRunSetup_TakesRegistryPasswordsWithALostKeyAndKeepsTheSignIns_Administrator = Lib_State_Runner_GetAdministrator_Returns;

export type Lib_State_FirstRunSetup_TakesRegistryPasswordsWithALostKeyAndKeepsTheSignIns_KeyPath = string;

export type Lib_State_FirstRunSetup_TakesRegistryPasswordsWithALostKeyAndKeepsTheSignIns_Ghcr = Lib_State_Runner_CreateRegistry_Returns;

export type Lib_State_FirstRunSetup_TakesRegistryPasswordsWithALostKeyAndKeepsTheSignIns_DockerHub = Lib_State_Runner_CreateRegistry_Returns;

export type Lib_State_FirstRunSetup_TakesRegistryPasswordsWithALostKeyAndKeepsTheSignIns_Example = Lib_State_Runner_CreateRegistry_Returns;

export type Lib_State_FirstRunSetup_TakesRegistryPasswordsWithALostKeyAndKeepsTheSignIns_Stderr = MockInstance<typeof process.stderr.write>;

export type Lib_State_FirstRunSetup_TakesRegistryPasswordsWithALostKeyAndKeepsTheSignIns_Reopened = State;

/**
 * Lib - State - Notification Destinations.
 *
 * @since 1.0.0
 */
export type Lib_State_NotificationDestinations_SealsSecretsAndKeepsThemThroughAnEditThatLeavesThemBlank_State = State;

export type Lib_State_NotificationDestinations_SealsSecretsAndKeepsThemThroughAnEditThatLeavesThemBlank_Created = Lib_State_Runner_CreateNotificationTarget_Returns;

/**
 * Lib - State - Registry Sign-ins - Keeps Earlier Notices When An Older Database Gains Sign Ins.
 *
 * @since 1.0.0
 */
export type Lib_State_RegistrySignIns_KeepsEarlierNoticesWhenAnOlderDatabaseGainsSignIns_State = State;

export type Lib_State_RegistrySignIns_KeepsEarlierNoticesWhenAnOlderDatabaseGainsSignIns_Administrator = Lib_State_Runner_GetAdministrator_Returns;

export type Lib_State_RegistrySignIns_KeepsEarlierNoticesWhenAnOlderDatabaseGainsSignIns_Database = DatabaseSync;

export type Lib_State_RegistrySignIns_KeepsEarlierNoticesWhenAnOlderDatabaseGainsSignIns_Reopened = State;

/**
 * Lib - State - Registry Sign-ins - Seals Passwords And Finds Every Docker Hub Name.
 *
 * @since 1.0.0
 */
export type Lib_State_RegistrySignIns_SealsPasswordsAndFindsEveryDockerHubName_State = State;

export type Lib_State_RegistrySignIns_SealsPasswordsAndFindsEveryDockerHubName_DockerHub = Lib_State_Runner_CreateRegistry_Returns;

export type Lib_State_RegistrySignIns_SealsPasswordsAndFindsEveryDockerHubName_Ghcr = Lib_State_Runner_CreateRegistry_Returns;

/**
 * Lib - State - Rejected Images - Remembers Rolled Back Images.
 *
 * @since 1.0.3
 */
export type Lib_State_RejectedImages_RemembersRolledBackImages_State = State;

export type Lib_State_RejectedImages_RemembersRolledBackImages_Reopened = State;

/**
 * Lib - State - Runtime Settings - Seeds And Persists Runtime Settings.
 *
 * @since 1.0.0
 */
export type Lib_State_RuntimeSettings_SeedsAndPersistsRuntimeSettings_State = State;

export type Lib_State_RuntimeSettings_SeedsAndPersistsRuntimeSettings_Settings = Shared_RuntimeSettings;

export type Lib_State_RuntimeSettings_SeedsAndPersistsRuntimeSettings_Reopened = State;

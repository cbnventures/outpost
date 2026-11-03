import type {
  Mock,
  MockInstance,
} from 'vitest';

import type { Runner as Notifier } from '../../lib/notifier.js';
import type { Runner as State } from '../../lib/state.js';
import type { Lib_Notifier_Runner_Dependencies } from './notifier.d.ts';

/**
 * Lib - Notifier.
 *
 * @since 1.0.0
 */
export type Lib_Notifier_DataDirectory = string | undefined;

export type Lib_Notifier_GetDataDirectory_Returns = string;

export type Lib_Notifier_Send = Mock<Lib_Notifier_Runner_Dependencies['send']>;

/**
 * Lib - Notifier - Update Reports And Alerts.
 *
 * @since 1.0.0
 */
export type Lib_Notifier_UpdateReportsAndAlerts_ReportsWhatAnUpdateCheckDidOncePerKindOfResult_State = State;

export type Lib_Notifier_UpdateReportsAndAlerts_ReportsWhatAnUpdateCheckDidOncePerKindOfResult_Send = Lib_Notifier_Send;

export type Lib_Notifier_UpdateReportsAndAlerts_ReportsWhatAnUpdateCheckDidOncePerKindOfResult_Notifier = Notifier;

export type Lib_Notifier_UpdateReportsAndAlerts_ReportsALockedAddressOncePerWindow_State = State;

export type Lib_Notifier_UpdateReportsAndAlerts_ReportsALockedAddressOncePerWindow_Send = Lib_Notifier_Send;

export type Lib_Notifier_UpdateReportsAndAlerts_ReportsALockedAddressOncePerWindow_Notifier = Notifier;

export type Lib_Notifier_UpdateReportsAndAlerts_ReportsSecretsALostKeyRemoved_State = State;

export type Lib_Notifier_UpdateReportsAndAlerts_ReportsSecretsALostKeyRemoved_Send = Lib_Notifier_Send;

export type Lib_Notifier_UpdateReportsAndAlerts_ReportsSecretsALostKeyRemoved_Notifier = Notifier;

export type Lib_Notifier_UpdateReportsAndAlerts_StopsDestinationLookupFailuresFromReachingCallers_State = State;

export type Lib_Notifier_UpdateReportsAndAlerts_StopsDestinationLookupFailuresFromReachingCallers_Lookup = MockInstance<State['getNotificationDeliveries']>;

export type Lib_Notifier_UpdateReportsAndAlerts_StopsDestinationLookupFailuresFromReachingCallers_Stderr = MockInstance<typeof process.stderr.write>;

export type Lib_Notifier_UpdateReportsAndAlerts_StopsDestinationLookupFailuresFromReachingCallers_Notifier = Notifier;

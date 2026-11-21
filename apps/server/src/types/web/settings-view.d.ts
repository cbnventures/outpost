import type {
  Dispatch,
  FormEvent,
  ReactElement,
  SetStateAction,
} from 'react';

import type {
  Web_Api_RuntimeSettings,
  Web_Api_Settings,
  Web_Api_UpdateSettingsInput,
} from '@/types/web/api.d.ts';

/**
 * Settings View.
 *
 * @since 1.2.1
 */
export type Web_SettingsView_SettingsView_Returns = ReactElement;
export type Web_SettingsView_SettingsView_Error = unknown;
export type Web_SettingsView_SettingsView_OnImported = () => Promise<void>;
export type Web_SettingsView_SettingsView_OnSave = (input: Web_Api_UpdateSettingsInput) => Promise<Web_Api_Settings>;
export type Web_SettingsView_SettingsView_Settings = Web_Api_Settings | null;
export type Web_SettingsView_SettingsView_ValuesState = [Web_Api_RuntimeSettings | null, Dispatch<SetStateAction<Web_Api_RuntimeSettings | null>>];
export type Web_SettingsView_SettingsView_Values = Web_Api_RuntimeSettings | null;
export type Web_SettingsView_SettingsView_SetValues = Dispatch<SetStateAction<Web_Api_RuntimeSettings | null>>;
export type Web_SettingsView_SettingsView_BusyState = [boolean, Dispatch<SetStateAction<boolean>>];
export type Web_SettingsView_SettingsView_Busy = boolean;
export type Web_SettingsView_SettingsView_SetBusy = Dispatch<SetStateAction<boolean>>;
export type Web_SettingsView_SettingsView_SaveErrorState = [unknown, Dispatch<SetStateAction<unknown>>];
export type Web_SettingsView_SettingsView_SaveError = unknown;
export type Web_SettingsView_SettingsView_SetSaveError = Dispatch<SetStateAction<unknown>>;
export type Web_SettingsView_SettingsView_ConfigurationRevisionState = [number, Dispatch<SetStateAction<number>>];
export type Web_SettingsView_SettingsView_ConfigurationRevision = number;
export type Web_SettingsView_SettingsView_SetConfigurationRevision = Dispatch<SetStateAction<number>>;
export type Web_SettingsView_SettingsView_ChangeValue_Key = keyof Web_Api_RuntimeSettings;
export type Web_SettingsView_SettingsView_ChangeValue_Value = Web_Api_RuntimeSettings[keyof Web_Api_RuntimeSettings];
export type Web_SettingsView_SettingsView_ChangeValue_Returns = void;
export type Web_SettingsView_SettingsView_ChangeValue = (key: Web_SettingsView_SettingsView_ChangeValue_Key, value: Web_SettingsView_SettingsView_ChangeValue_Value) => Web_SettingsView_SettingsView_ChangeValue_Returns;
export type Web_SettingsView_SettingsView_Discard_Returns = void;
export type Web_SettingsView_SettingsView_Discard = () => Web_SettingsView_SettingsView_Discard_Returns;
export type Web_SettingsView_SettingsView_Submit_Event = FormEvent<HTMLFormElement>;
export type Web_SettingsView_SettingsView_Submit_Returns = Promise<void>;
export type Web_SettingsView_SettingsView_Submit = (event: Web_SettingsView_SettingsView_Submit_Event) => Web_SettingsView_SettingsView_Submit_Returns;
export type Web_SettingsView_SettingsView_Submit_NextSettings = Web_Api_Settings;
export type Web_SettingsView_SettingsView_Submit_Message = string;
export type Web_SettingsView_SettingsView_RuntimeKeys = (keyof Web_Api_RuntimeSettings)[];
export type Web_SettingsView_SettingsView_ChangeCount = number;
export type Web_SettingsView_SettingsView_ScheduledActions = string;
export type Web_SettingsView_SettingsView_LabelValue = string;
export type Web_SettingsView_SettingsView_ChangeNoun = string;
export type Web_SettingsView_SettingsView_SwitchRow_Key = 'cleanup' | 'monitorOnly' | 'runOnStart';
export type Web_SettingsView_SettingsView_SwitchRow_Returns = ReactElement;
export type Web_SettingsView_SettingsView_SwitchRow = (key: Web_SettingsView_SettingsView_SwitchRow_Key) => Web_SettingsView_SettingsView_SwitchRow_Returns;
export type Web_SettingsView_SettingsView_TimingFieldKey = 'healthTimeoutSeconds' | 'settleSeconds' | 'stopTimeoutSeconds';
export type Web_SettingsView_SettingsView_TimingFieldLabel = string;
export type Web_SettingsView_SettingsView_TimingFieldHint = string;

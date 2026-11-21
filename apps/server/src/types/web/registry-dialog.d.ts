import type {
  Dispatch,
  FormEvent,
  ReactElement,
  RefObject,
  SetStateAction,
} from 'react';

import type { Web_Api_Registry } from '@/types/web/api.d.ts';

/**
 * Registry Dialog.
 *
 * @since 1.2.1
 */
export type Web_RegistryDialog_RegistryDialog_Returns = ReactElement | null;
export type Web_RegistryDialog_RegistryDialog_OnClose = () => void;
export type Web_RegistryDialog_RegistryDialog_OnSaved = () => Promise<void>;
export type Web_RegistryDialog_RegistryDialog_Open = boolean;
export type Web_RegistryDialog_RegistryDialog_Registry = Web_Api_Registry | null;
export type Web_RegistryDialog_RegistryDialog_HostState = [string, Dispatch<SetStateAction<string>>];
export type Web_RegistryDialog_RegistryDialog_Host = string;
export type Web_RegistryDialog_RegistryDialog_SetHost = Dispatch<SetStateAction<string>>;
export type Web_RegistryDialog_RegistryDialog_UsernameState = [string, Dispatch<SetStateAction<string>>];
export type Web_RegistryDialog_RegistryDialog_Username = string;
export type Web_RegistryDialog_RegistryDialog_SetUsername = Dispatch<SetStateAction<string>>;
export type Web_RegistryDialog_RegistryDialog_PasswordState = [string, Dispatch<SetStateAction<string>>];
export type Web_RegistryDialog_RegistryDialog_Password = string;
export type Web_RegistryDialog_RegistryDialog_SetPassword = Dispatch<SetStateAction<string>>;
export type Web_RegistryDialog_RegistryDialog_BusyState = [boolean, Dispatch<SetStateAction<boolean>>];
export type Web_RegistryDialog_RegistryDialog_Busy = boolean;
export type Web_RegistryDialog_RegistryDialog_SetBusy = Dispatch<SetStateAction<boolean>>;
export type Web_RegistryDialog_RegistryDialog_ErrorState = [unknown, Dispatch<SetStateAction<unknown>>];
export type Web_RegistryDialog_RegistryDialog_Error = unknown;
export type Web_RegistryDialog_RegistryDialog_SetError = Dispatch<SetStateAction<unknown>>;
export type Web_RegistryDialog_RegistryDialog_TitleId = string;
export type Web_RegistryDialog_RegistryDialog_DialogRef = RefObject<HTMLElement | null>;
export type Web_RegistryDialog_RegistryDialog_Editing = boolean;
export type Web_RegistryDialog_RegistryDialog_Submit_Event = FormEvent<HTMLFormElement>;
export type Web_RegistryDialog_RegistryDialog_Submit_Returns = Promise<void>;
export type Web_RegistryDialog_RegistryDialog_Submit = (event: Web_RegistryDialog_RegistryDialog_Submit_Event) => Web_RegistryDialog_RegistryDialog_Submit_Returns;
export type Web_RegistryDialog_RegistryDialog_Submit_Saved = Web_Api_Registry;
export type Web_RegistryDialog_RegistryDialog_HostIssue = string;
export type Web_RegistryDialog_RegistryDialog_UsernameIssue = string;
export type Web_RegistryDialog_RegistryDialog_PasswordIssue = string;
export type Web_RegistryDialog_RegistryDialog_Summary = string;
export type Web_RegistryDialog_RegistryDialog_PasswordHint = string;

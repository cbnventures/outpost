import type {
  Dispatch,
  ReactElement,
  SetStateAction,
} from 'react';

import type { Web_Api_Registry } from '@/types/web/api.d.ts';

/**
 * Registries Section.
 *
 * @since 1.2.1
 */
export type Web_RegistriesSection_RegistriesSection_Returns = ReactElement;
export type Web_RegistriesSection_RegistriesSection_RegistriesState = [Web_Api_Registry[] | null, Dispatch<SetStateAction<Web_Api_Registry[] | null>>];
export type Web_RegistriesSection_RegistriesSection_Registries = Web_Api_Registry[] | null;
export type Web_RegistriesSection_RegistriesSection_SetRegistries = Dispatch<SetStateAction<Web_Api_Registry[] | null>>;
export type Web_RegistriesSection_RegistriesSection_LoadErrorState = [string, Dispatch<SetStateAction<string>>];
export type Web_RegistriesSection_RegistriesSection_LoadError = string;
export type Web_RegistriesSection_RegistriesSection_SetLoadError = Dispatch<SetStateAction<string>>;
export type Web_RegistriesSection_RegistriesSection_DialogOpenState = [boolean, Dispatch<SetStateAction<boolean>>];
export type Web_RegistriesSection_RegistriesSection_DialogOpen = boolean;
export type Web_RegistriesSection_RegistriesSection_SetDialogOpen = Dispatch<SetStateAction<boolean>>;
export type Web_RegistriesSection_RegistriesSection_EditingState = [Web_Api_Registry | null, Dispatch<SetStateAction<Web_Api_Registry | null>>];
export type Web_RegistriesSection_RegistriesSection_Editing = Web_Api_Registry | null;
export type Web_RegistriesSection_RegistriesSection_SetEditing = Dispatch<SetStateAction<Web_Api_Registry | null>>;
export type Web_RegistriesSection_RegistriesSection_RemovingState = [Web_Api_Registry | null, Dispatch<SetStateAction<Web_Api_Registry | null>>];
export type Web_RegistriesSection_RegistriesSection_Removing = Web_Api_Registry | null;
export type Web_RegistriesSection_RegistriesSection_SetRemoving = Dispatch<SetStateAction<Web_Api_Registry | null>>;
export type Web_RegistriesSection_RegistriesSection_RemoveErrorState = [string, Dispatch<SetStateAction<string>>];
export type Web_RegistriesSection_RegistriesSection_RemoveError = string;
export type Web_RegistriesSection_RegistriesSection_SetRemoveError = Dispatch<SetStateAction<string>>;
export type Web_RegistriesSection_RegistriesSection_BusyState = [boolean, Dispatch<SetStateAction<boolean>>];
export type Web_RegistriesSection_RegistriesSection_Busy = boolean;
export type Web_RegistriesSection_RegistriesSection_SetBusy = Dispatch<SetStateAction<boolean>>;
export type Web_RegistriesSection_RegistriesSection_Load_Returns = Promise<void>;
export type Web_RegistriesSection_RegistriesSection_Load = () => Web_RegistriesSection_RegistriesSection_Load_Returns;
export type Web_RegistriesSection_RegistriesSection_Remove_Registry = Web_Api_Registry;
export type Web_RegistriesSection_RegistriesSection_Remove_Returns = Promise<void>;
export type Web_RegistriesSection_RegistriesSection_Remove = (registry: Web_RegistriesSection_RegistriesSection_Remove_Registry) => Web_RegistriesSection_RegistriesSection_Remove_Returns;
export type Web_RegistriesSection_RegistriesSection_RemovingName = string;

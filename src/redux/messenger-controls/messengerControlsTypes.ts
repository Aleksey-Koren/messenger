import {IPlainDataAction} from "../redux-types";
import {GlobalUser} from "../../model/local-storage/localStorageTypes";

export interface IMessengerControlsState {
    isCreateNewPrivateModalOpened: boolean;
    isCreateNewRoomModalOpened: boolean;
    isEditUserTitleModalOpen: boolean;
    isConfirmModalOpen: boolean;
    isLeaveChatConfirmModalOpened: boolean;
    isFetching: boolean,
    globalUserConfigurationState: GlobalUserConfigurationState;
}

export interface GlobalUserConfigurationState {
    isGlobalUserConfigurationModalOpen: boolean;
    globalUserToEdit?: GlobalUser;
}

export type TMessengerControlsState = IMessengerControlsState;
export type TMessengerControlsAction = IPlainDataAction<boolean> | IPlainDataAction<GlobalUserConfigurationState>;

export const SET_IS_CREATE_PRIVATE_MODAL_OPENED = 'SET_IS_CREATE_PRIVATE_MODAL_OPENED';
export const SET_IS_CREATE_ROOM_MODAL_OPENED = 'SET_IS_CREATE_ROOM_MODAL_OPENED';
export const SET_IS_EDIT_USER_TITLE_MODAL_OPEN = 'SET_IS_EDIT_USER_TITLE_MODAL_OPEN';
export const SET_IS_GLOBAL_USER_CONFIGURATION_MODAL_OPEN = 'SET_IS_GLOBAL_USER_CONFIGURATION_MODAL_OPEN';
export const SET_IS_CONFIRM_MODAL_OPEN = 'SET_IS_CONFIRM_MODAL_OPEN';
export const SET_IS_LEAVE_CHAT_CONFIRM_MODAL_OPENED = 'SET_IS_LEAVE_CHAT_CONFIRM_MODAL_OPENED';
export const SET_IS_FETCHING = 'SET_IS_FETCHING';

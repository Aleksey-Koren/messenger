import {IPlainDataAction} from "../redux-types";

export interface IMessengerControlsState {
    isCreateNewPrivateModalOpened: boolean;
    isCreateNewRoomModalOpened: boolean;
    isEditUserTitleModalOpen: boolean;
}

export type TMessengerControlsState = IMessengerControlsState;
export type TMessengerControlsAction = IPlainDataAction<boolean>;

export const SET_IS_CREATE_PRIVATE_MODAL_OPENED = 'SET_IS_CREATE_PRIVATE_MODAL_OPENED';
export const SET_IS_CREATE_ROOM_MODAL_OPENED = 'SET_IS_CREATE_ROOM_MODAL_OPENED';
export const SET_IS_EDIT_USER_TITLE_MODAL_OPEN = 'SET_IS_EDIT_USER_TITLE_MODAL_OPEN';
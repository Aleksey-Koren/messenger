import {IPlainDataAction} from "../redux-types";

interface IMessengerMenuState {
    isMembersModalOpen: boolean;
    isAddUserModalOpened: boolean;
}

export type TMessengerMenuState = IMessengerMenuState;

export type TMessengerMenuAction = IPlainDataAction<boolean>;

export const SET_IS_MEMBERS_MODAL_OPEN = 'SET_IS_MEMBERS_MODAL_OPEN';
export const SET_IS_ADD_USER_MODAL_OPENED = 'SET_IS_ADD_USER_MODAL_OPENED';
import {IPlainDataAction} from "../redux-types";

interface IMessengerMenuState {
    isMembersModalOpen: boolean;
    isBotsModalOpen: boolean;
    isEditRoomTitleModalOpen: boolean;
    isEditGlobalUsersModalOpened: boolean;
}

export type TMessengerMenuState = IMessengerMenuState;

export type TMessengerMenuAction = IPlainDataAction<boolean>;

export const SET_IS_MEMBERS_MODAL_OPEN = 'SET_IS_MEMBERS_MODAL_OPEN';
export const SET_IS_BOTS_MODAL_OPEN = 'SET_IS_BOTS_MODAL_OPEN';
export const SET_IS_EDIT_ROOM_TITLE_MODAL_OPEN = 'SET_IS_EDIT_ROOM_TITLE_MODAL_OPEN'
export const SET_IS_EDIT_GLOBAL_USERS_MODAL_OPENED = 'SET_IS_EDIT_GLOBAL_USERS_MODAL_OPENED'
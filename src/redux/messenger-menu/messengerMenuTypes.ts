import {IPlainDataAction} from "../redux-types";

interface IMessengerMenuState {
    isMembersModalOpen: boolean;
    isEditTitleModalOpen: boolean;
}

export type TMessengerMenuState = IMessengerMenuState;

export type TMessengerMenuAction = IPlainDataAction<boolean>;

export const SET_IS_MEMBERS_MODAL_OPEN = 'SET_IS_MEMBERS_MODAL_OPEN'
export const SET_IS_EDIT_TITLE_MODAL_OPEN = 'SET_IS_EDIT_TITLE_MODAL_OPEN'
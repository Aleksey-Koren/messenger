import {IPlainDataAction} from "../redux-types";

export interface IMessengerControlsState {
    isCreateNewPrivateModalOpened: boolean;
}

export type TMessengerControlsState = IMessengerControlsState;
export type TMessengerControlsAction = IPlainDataAction<boolean>;

export const SET_IS_CREATE_PRIVATE_MODAL_OPENED = 'SET_IS_CREATE_PRIVATE_MODAL_OPENED';
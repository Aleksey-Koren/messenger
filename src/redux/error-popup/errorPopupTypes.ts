import {IPlainDataAction} from "../redux-types";

export interface IErrorPopupState {
    isErrorPopupOpen: boolean;
    errorMessage: string | null;
}

export type TErrorPopupState = IErrorPopupState;

export type TErrorPopupAction = IPlainDataAction<IErrorPopupState>;

export const SET_ERROR_POPUP_STATE = 'SET_ERROR_POPUP_STATE';
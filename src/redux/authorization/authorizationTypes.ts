import {IPlainDataAction} from "../redux-types";
import {ThunkAction} from "redux-thunk";
import {AnyAction} from "redux";
import {RootState} from "@reduxjs/toolkit/dist/query/core/apiState";
import {AppState} from "../../index";

interface IAuthorizationState {
    isWelcomeModalOpen: boolean;
    isLoginModalOpen: boolean;
    isRegistrationModalOpen: boolean;
}

export type TAuthorizationState = IAuthorizationState;

export type TAuthorizationAction = IPlainDataAction<any>;

export const SET_IS_WELCOME_MODAL_OPEN = 'SET_IS_WELCOME_MODAL_OPEN';
export const SET_IS_LOGIN_MODAL_OPEN = 'SET_IS_LOGIN_MODAL_OPEN';
export const SET_IS_REGISTRATION_MODAL_OPEN = 'SET_IS_REGISTRATION_MODAL_OPEN';
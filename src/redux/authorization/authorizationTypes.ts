import {IPlainDataAction} from "../redux-types";

interface IAuthorizationState {
    isWelcomeModalOpen: boolean;
    isLoginModalOpen: boolean;
    isRegistrationModalOpen: boolean;
    isRegistrationGhost: boolean,
    isFetching: boolean;
}

export interface IRegistrationModalPayload {
    isOpen: boolean;
    isGhost: boolean;
}

export type TAuthorizationState = IAuthorizationState;

export type TAuthorizationAction = IPlainDataAction<any>;

export const LOGOUT = 'LOGOUT';
export const SET_IS_WELCOME_MODAL_OPEN = 'SET_IS_WELCOME_MODAL_OPEN';
export const SET_IS_LOGIN_MODAL_OPEN = 'SET_IS_LOGIN_MODAL_OPEN';
export const SET_IS_REGISTRATION_MODAL_OPEN = 'SET_IS_REGISTRATION_MODAL_OPEN';
export const SET_IS_FETCHING = 'SET_IS_FETCHING';
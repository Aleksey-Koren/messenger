import {SET_IS_LOGIN_MODAL_OPEN, SET_IS_REGISTRATION_MODAL_OPEN, SET_IS_WELCOME_MODAL_OPEN} from "./authorizationTypes";
import {IPlainDataAction} from "../redux-types";

export function setIsWelcomeModalOpen(isOpen: boolean): IPlainDataAction<boolean> {

    return {
        type: SET_IS_WELCOME_MODAL_OPEN,
        payload: isOpen
    }
}

export function setIsLoginModalOpen(isOpen: boolean): IPlainDataAction<boolean> {

    return {
        type: SET_IS_LOGIN_MODAL_OPEN,
        payload: isOpen
    }
}

export function setIsRegistrationModalOpen(isOpen: boolean): IPlainDataAction<boolean>{

    return {
        type: SET_IS_REGISTRATION_MODAL_OPEN,
        payload: isOpen
    }
}
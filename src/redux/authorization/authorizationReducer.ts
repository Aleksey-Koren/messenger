import {
    LOGOUT,
    SET_IS_LOGIN_MODAL_OPEN, SET_IS_REGISTRATION_MODAL_OPEN,
    SET_IS_WELCOME_MODAL_OPEN,
    TAuthorizationAction,
    TAuthorizationState
} from "./authorizationTypes";

const initialState: TAuthorizationState = {
    isLoginModalOpen: false,
    isRegistrationModalOpen: false,
    isWelcomeModalOpen: true
}

export function authorizationReducer(state: TAuthorizationState = initialState, action: TAuthorizationAction) {
    switch (action.type) {

        case SET_IS_WELCOME_MODAL_OPEN:
            const isWelcomeModalOpen = action.payload as boolean;
            return {...state, isWelcomeModalOpen: isWelcomeModalOpen}

        case SET_IS_LOGIN_MODAL_OPEN:
            const isLoginModalOpen = action.payload as boolean;
            return {...state, isLoginModalOpen: isLoginModalOpen}
        case SET_IS_REGISTRATION_MODAL_OPEN:
            const isRegistrationModalOpen = action.payload as boolean;
            return {...state, isRegistrationModalOpen: isRegistrationModalOpen}
        case LOGOUT:
            return {isWelcomeModalOpen: true, isLoginModalOpen: false, isRegistrationModalOpen: false}

        default:
            return state;
    }
}

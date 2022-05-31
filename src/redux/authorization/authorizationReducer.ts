import {
    SET_IS_LOGIN_MODAL_OPEN, SET_IS_REGISTRATION_MODAL_OPEN,
    SET_IS_WELCOME_MODAL_OPEN,
    TAuthorizationAction,
    TAuthorizationState
} from "./authorizationTypes";

const initialState: TAuthorizationState = {
    isLoginModalOpen: false,
    isRegistrationModalOpen: false,
    isWelcomeModalOpen: false
}

export function authorizationReducer(state: TAuthorizationState = initialState, action: TAuthorizationAction) {
    switch (action.type) {

        case SET_IS_WELCOME_MODAL_OPEN:
            const isWelcomeModalOpen = action.payload as boolean;
            return {...initialState, isWelcomeModalOpen: isWelcomeModalOpen}

        case SET_IS_LOGIN_MODAL_OPEN:
            const isLoginModalOpen = action.payload as boolean;
            return {...initialState, isLoginModalOpen: isLoginModalOpen}

        case SET_IS_REGISTRATION_MODAL_OPEN:
            const isRegistrationModalOpen = action.payload as boolean;
            return {...initialState, isRegistrationModalOpen: isRegistrationModalOpen}

        default:
            return state;
    }
}

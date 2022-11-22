import {
    IRegistrationModalPayload,
    LOGOUT,
    SET_IS_FETCHING,
    SET_IS_LOGIN_MODAL_OPEN,
    SET_IS_REGISTRATION_MODAL_OPEN,
    SET_IS_WELCOME_MODAL_OPEN,
    TAuthorizationAction,
    TAuthorizationState
} from "./authorizationTypes";

const initialState: TAuthorizationState = {
    isLoginModalOpen: false,
    isRegistrationModalOpen: false,
    isWelcomeModalOpen: true,
    isRegistrationGhost: false,
    isFetching: false,
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
            const payload = action.payload as IRegistrationModalPayload;
            return {...state, isRegistrationModalOpen: payload.isOpen, isRegistrationGhost: payload.isGhost}
        case SET_IS_FETCHING:
            const isFetching = action.payload as boolean;
            return {...state, isFetching: isFetching}
        case LOGOUT:
            return initialState
        default:
            return state;
    }
}

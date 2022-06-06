import {
    SET_IS_ADD_USER_MODAL_OPENED,
    SET_IS_MEMBERS_MODAL_OPEN,
    TMessengerMenuAction,
    TMessengerMenuState
} from "./messengerMenuTypes";

const initialState: TMessengerMenuState = {
    isMembersModalOpen: false,
    isAddUserModalOpened: false,
}

export function messengerMenuReducer(state: TMessengerMenuState = initialState, action: TMessengerMenuAction) {
    switch (action.type) {

        case SET_IS_MEMBERS_MODAL_OPEN:
            return {...initialState, isMembersModalOpen: action.payload}

        case SET_IS_ADD_USER_MODAL_OPENED:
            return {...initialState, isAddUserModalOpened: action.payload}

        default:
            return state;

    }
}
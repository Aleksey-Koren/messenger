import {SET_ERROR_POPUP_STATE, TErrorPopupAction, TErrorPopupState} from "./errorPopupTypes";

const initialState: TErrorPopupState = {
    isErrorPopupOpen: false,
    errorMessage: null
}

export function errorPopupReducer(state: TErrorPopupState = initialState, action: TErrorPopupAction) {

    switch (action.type) {

        case SET_ERROR_POPUP_STATE:
            return {isErrorPopupOpen: action.payload.isErrorPopupOpen, errorMessage: action.payload.errorMessage}

        default:
            return state;
    }
}
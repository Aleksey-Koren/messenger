import {IPlainDataAction} from "../redux-types";
import {IErrorPopupState, SET_ERROR_POPUP_STATE} from "./errorPopupTypes";

export function setErrorPopupState(isErrorPopupOpen: boolean, errorMessage: string | null = null): IPlainDataAction<IErrorPopupState> {

    return {
        type: SET_ERROR_POPUP_STATE,
        payload: {isErrorPopupOpen, errorMessage}
    }

}

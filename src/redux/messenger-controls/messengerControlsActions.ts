import {IPlainDataAction} from "../redux-types";
import {SET_IS_CREATE_PRIVATE_MODAL_OPENED} from "./messengerControlsTypes";

export function setIsNewPrivateModalOpened(isOpened: boolean): IPlainDataAction<boolean> {
    return {
        type: SET_IS_CREATE_PRIVATE_MODAL_OPENED,
        payload: isOpened
    }
}
import {IPlainDataAction} from "../redux-types";
import {SET_IS_EDIT_TITLE_MODAL_OPEN, SET_IS_MEMBERS_MODAL_OPEN} from "./messengerMenuTypes";

export function setIsMembersModalOpen(isOpen: boolean): IPlainDataAction<boolean> {

    return {
        type: SET_IS_MEMBERS_MODAL_OPEN,
        payload: isOpen
    }
}

export function setIsEditTitleModalOpen(isOpen: boolean): IPlainDataAction<boolean> {

    return {
        type: SET_IS_EDIT_TITLE_MODAL_OPEN,
        payload: isOpen
    }
}
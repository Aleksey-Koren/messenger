import {IPlainDataAction} from "../redux-types";
import {
    SET_IS_EDIT_GLOBAL_USERS_MODAL_OPENED,
    SET_IS_EDIT_ROOM_TITLE_MODAL_OPEN,
    SET_IS_MEMBERS_MODAL_OPEN
} from "./messengerMenuTypes";


export function setIsMembersModalOpened(isOpened: boolean): IPlainDataAction<boolean> {
    return {
        type: SET_IS_MEMBERS_MODAL_OPEN,
        payload: isOpened
    }
}

export function setIsEditRoomTitleModalOpen(isOpen: boolean): IPlainDataAction<boolean> {
    return {
        type: SET_IS_EDIT_ROOM_TITLE_MODAL_OPEN,
        payload: isOpen
    }
}

export function setIsEditGlobalUsersModalOpened(isOpened: boolean): IPlainDataAction<boolean> {
    return {
        type: SET_IS_EDIT_GLOBAL_USERS_MODAL_OPENED,
        payload: isOpened
    }
}
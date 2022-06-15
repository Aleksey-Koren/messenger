import {IPlainDataAction} from "../redux-types";
import {
    SET_IS_CREATE_PRIVATE_MODAL_OPENED,
    SET_IS_CREATE_ROOM_MODAL_OPENED,
    SET_IS_EDIT_USER_TITLE_MODAL_OPEN
} from "./messengerControlsTypes";
import {AppState} from "../../index";
import {ThunkDispatch} from "redux-thunk";
import {Action} from "redux";
import {MessageApi} from "../../api/messageApi";
import { setCurrentChat} from "../messenger/messengerActions";
import {setErrorPopupState} from "../error-popup/errorPopupActions";
import {MessageType} from "../../model/messageType";
import {Message} from "../../model/message";
import {setIsMembersModalOpened} from "../messenger-menu/messengerMenuActions";

export function setIsNewPrivateModalOpened(isOpened: boolean): IPlainDataAction<boolean> {
    return {
        type: SET_IS_CREATE_PRIVATE_MODAL_OPENED,
        payload: isOpened
    }
}

export function setIsNewRoomModalOpened(isOpened: boolean): IPlainDataAction<boolean> {
    return {
        type: SET_IS_CREATE_ROOM_MODAL_OPENED,
        payload: isOpened
    }
}

export function setIsEditUserTitleModalOpen(isOpen: boolean): IPlainDataAction<boolean> {
    return {
        type: SET_IS_EDIT_USER_TITLE_MODAL_OPEN,
        payload: isOpen
    }
}

export function createNewRoomTF(title: string) {

    return (dispatch: ThunkDispatch<AppState, void, Action>, getState: () => AppState) => {
        const user = getState().messenger.user;
        if(!user) {
            throw new Error("User not logged in");
        }
        const users = getState().messenger.users;
        MessageApi.sendMessages([{
            type: MessageType.hello,
            sender: user.id!,
            receiver: user.id!,
            data: title
        } as Message], users)
            .then((messages) => {
                const message = messages[0];
                dispatch(setCurrentChat(message.chat));
                dispatch(setIsNewPrivateModalOpened(false));
                dispatch(setIsMembersModalOpened(true));
            }).catch(err => {
            console.error(err)
            dispatch(setErrorPopupState(true, 'Something went wrong. Try again'))
        })
    }
}
import {IPlainDataAction} from "../redux-types";
import {MessageApi} from "../../api/messageApi";
import {User} from "../../model/user";
import {SET_IS_EDIT_ROOM_TITLE_MODAL_OPEN, SET_IS_MEMBERS_MODAL_OPEN} from "./messengerMenuTypes";
import {MessageType} from "../../model/messageType";
import {Message} from "../../model/message";
import {ThunkDispatch} from "redux-thunk";
import {AppState} from "../../index";
import {Action} from "redux";
import {CustomerApi} from "../../api/customerApi";


export function setIsMembersModalOpened(isOpened: boolean): IPlainDataAction<boolean> {

    return {
        type: SET_IS_MEMBERS_MODAL_OPEN,
        payload: isOpened
    }
}

export function addUserToRoomTF(me: User, chatId: string, otherId: string) {
    return (dispatch: ThunkDispatch<AppState, any, Action>, getState: () => AppState) => {
        const currentChat = getState().messenger.chats[getState().messenger.currentChat!];
        return CustomerApi.getCustomer(otherId).then(customer => {
            return MessageApi.sendMessages([{
                type: MessageType.hello,
                receiver: otherId,
                sender: me.id,
                chat: chatId,
                data: currentChat?.title
            } as Message], {[otherId]: customer})
        })
    }
}

export function setIsEditRoomTitleModalOpen(isOpen: boolean): IPlainDataAction<boolean> {

    return {
        type: SET_IS_EDIT_ROOM_TITLE_MODAL_OPEN,
        payload: isOpen
    }
}
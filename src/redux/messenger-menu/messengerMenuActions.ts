import {IPlainDataAction} from "../redux-types";
import {MessageApi} from "../../api/messageApi";
import {User} from "../../model/messenger/user";
import {SET_IS_EDIT_ROOM_TITLE_MODAL_OPEN, SET_IS_MEMBERS_MODAL_OPEN} from "./messengerMenuTypes";
import {MessageType} from "../../model/messenger/messageType";
import {Message} from "../../model/messenger/message";
import {ThunkDispatch} from "redux-thunk";
import {AppState} from "../../index";
import {Action} from "redux";
import {CustomerApi} from "../../api/customerApi";
import {setChats, setCurrentChat} from "../messenger/messengerActions";
import {ChatApi} from "../../api/chatApi";
import {CryptService} from "../../service/cryptService";
import Notification from "../../Notification";


export function setIsMembersModalOpened(isOpened: boolean): IPlainDataAction<boolean> {

    return {
        type: SET_IS_MEMBERS_MODAL_OPEN,
        payload: isOpened
    }
}

export function addUserToRoomTF(me: User, customer:User, otherId: string) {
    return (dispatch: ThunkDispatch<AppState, any, Action>, getState: () => AppState) => {
        const currentChat = getState().messenger.chats[getState().messenger.currentChat!];
        return MessageApi.sendMessages([{
            type: MessageType.HELLO,
            receiver: otherId,
            sender: me.id,
            chat: currentChat?.id,
            data: currentChat?.title
        } as Message], {[otherId]: customer}).then((response) => {
            Notification.add({message: "Invitation sent", severity: 'info'});
            return response;
        })
    }
}
export function leaveChatTF(me: User, chatId: string) {
    return (dispatch: ThunkDispatch<AppState, any, Action>, getState: () => AppState) => {
        const encrypted = CryptService.encrypt(
            CryptService.plainStringToUint8(me.id), me.privateKey!, undefined, me.privateKey!
        )
        ChatApi.quitFromChat(chatId, me.id, {
            nonce: CryptService.uint8ToBase64(encrypted.nonce),
            data: CryptService.uint8ToBase64(encrypted.data)
        }).then(() => {
            const chats = {...getState().messenger.chats};
            delete(chats[chatId]);
            dispatch(setChats(chats));
            let chatSet = false;
            for(let id in chats) {
                chatSet = true;
                dispatch(setCurrentChat(id));
            }
            if(!chatSet) {
                dispatch(setCurrentChat(null));
            }
        })
    }
}

export function setIsEditRoomTitleModalOpen(isOpen: boolean): IPlainDataAction<boolean> {

    return {
        type: SET_IS_EDIT_ROOM_TITLE_MODAL_OPEN,
        payload: isOpen
    }
}
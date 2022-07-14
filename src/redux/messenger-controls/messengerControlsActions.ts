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
import {openChatTF, setChats, setCurrentChat, setGlobalUsers} from "../messenger/messengerActions";
import {MessageType} from "../../model/messenger/messageType";
import {Message} from "../../model/messenger/message";
import {setIsMembersModalOpened} from "../messenger-menu/messengerMenuActions";
import Notification from '../../Notification';
import {Chat} from "../../model/messenger/chat";
import {Builder} from "builder-pattern";

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

export function createNewRoomTF(title: string, userTitle: string) {

    return (dispatch: ThunkDispatch<AppState, void, Action>, getState: () => AppState) => {
        const user = getState().messenger.user;
        const globalUsers = {...getState().messenger.globalUsers};

        if (!user) {
            throw new Error("User is not logged in");
        }

        MessageApi.sendMessages([{
            type: MessageType.hello,
            sender: user.id!,
            receiver: user.id!,
            data: title
        } as Message], globalUsers)
            .then((messages) => {
                const message = messages[0];
                const newChat: Chat = Builder<Chat>()
                    .id(message.chat)
                    .title(title)
                    .isUnreadMessagesExist(false)
                    .lastSeenAt(new Date())
                    .build()
                const state = getState();
                const chats = {...state.messenger.chats};
                chats[newChat.id] = newChat;
                globalUsers[user.id].titles[newChat.id] = userTitle;
                dispatch(setChats(chats));
                dispatch(setGlobalUsers(globalUsers));
                dispatch(setCurrentChat(newChat.id));

                dispatch(setIsNewPrivateModalOpened(false));
                dispatch(setIsMembersModalOpened(true));


                // const message = messages[0];
                // const newChat: Chat = Builder<Chat>()
                //     .id(message.chat)
                //     .title(title)
                //     .isUnreadMessagesExist(false)
                //     .lastSeenAt(new Date())
                //     .build()
                // const state = getState();
                // const chats = {...state.messenger.chats};
                // const globalUsers = {...state.messenger.globalUsers};
                // chats[newChat.id] = newChat;
                // globalUsers[user.id].titles[newChat.id] = userTitle;
                // dispatch(setChats(chats));
                // dispatch(setGlobalUsers(globalUsers));
                // dispatch(openChatTF(newChat.id));

                // dispatch(setIsNewPrivateModalOpened(false));
                // dispatch(setIsMembersModalOpened(true));
            }).catch(err => {
            console.error(err)
            Notification.add({message: 'Something went wrong.', error: err, severity: 'error'});
        })
    }
}
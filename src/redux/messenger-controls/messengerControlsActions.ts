import {IPlainDataAction} from "../redux-types";
import {
    GlobalUserConfigurationState,
    SET_IS_CONFIRM_MODAL_OPEN,
    SET_IS_CREATE_PRIVATE_MODAL_OPENED,
    SET_IS_CREATE_ROOM_MODAL_OPENED,
    SET_IS_EDIT_USER_TITLE_MODAL_OPEN,
    SET_IS_GLOBAL_USER_CONFIGURATION_MODAL_OPEN,
    SET_IS_LEAVE_CHAT_CONFIRM_MODAL_OPENED,
} from "./messengerControlsTypes";
import {AppDispatch, AppState} from "../../index";
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
import {GlobalUser} from "../../model/local-storage/localStorageTypes";
import {CustomerApi} from "../../api/customerApi";
import {ChatApi} from "../../api/chatApi";
import {ChatService} from "../../service/messenger/chatService";
import {StringIndexArray} from "../../model/stringIndexArray";

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

export function setIsGlobalUserConfigurationModalOpen(isOpen: boolean, globalUserToEdit?: GlobalUser): IPlainDataAction<GlobalUserConfigurationState> {
    return {
        type: SET_IS_GLOBAL_USER_CONFIGURATION_MODAL_OPEN,
        payload: {
            isGlobalUserConfigurationModalOpen: isOpen,
            globalUserToEdit: globalUserToEdit
        }
    }
}

export function setIsConfirmModalOpen(isOpen: boolean): IPlainDataAction<boolean> {
    return {
        type: SET_IS_CONFIRM_MODAL_OPEN,
        payload: isOpen
    }
}

export function setIsLeaveChatConfirmModalOpened(isOpened: boolean): IPlainDataAction<boolean> {
    return {
        type: SET_IS_LEAVE_CHAT_CONFIRM_MODAL_OPENED,
        payload: isOpened,
    }
}

export function removeGlobalUserPublicKeyTF(publicKey: string, globalUser: GlobalUser) {
    return (dispatch: AppDispatch, getState: () => AppState) => {

        const globalUsers = {...getState().messenger.globalUsers};
        const globalUserToEdit = globalUsers[globalUser.userId];

        globalUserToEdit.certificates = globalUserToEdit.certificates.filter(certificate => certificate !== publicKey);

        dispatch(setGlobalUsers(globalUsers));
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

            }).catch(err => {
            console.error(err)
            Notification.add({message: 'Something went wrong.', error: err, severity: 'error'});
        })
    }
}

export function leaveChatTF() {
    return (dispatch: ThunkDispatch<AppState, void, Action>, getState: () => AppState) => {
        CustomerApi.getServerUser()
            .then(serverUser => {
                const state = getState();
                MessageApi.sendMessages([{
                    type: MessageType.server,
                    sender: state.messenger.user!.id,
                    receiver: serverUser.id,
                    data: 'LEAVE_CHAT',
                    chat: state.messenger.currentChat!,
                    decrypted: false
                }], state.messenger.globalUsers)
                    .then(() => {
                        return ChatApi.getChats(state.messenger.user!.id)
                            .then(helloMessages => {
                                ChatService.tryDecryptChatsTitles(helloMessages, state.messenger.globalUsers)
                                    .then(chats => {
                                        if(chats.length !== 0) {
                                            //todo sorting doesn't gives an effect... we need something else
                                            chats = chats.sort((a, b) => -(a.lastSeenAt.valueOf() - b.lastSeenAt.valueOf()));

                                            chats.forEach(s => console.log('CHAT TITLE: ' + s.title + ' ' + s.lastSeenAt.toString()));

                                            const currentChat = chats[0];

                                            const stringIndexArrayChats = chats.reduce((prev, next) => {
                                                prev[next.id] = next;
                                                return prev;
                                            }, {} as StringIndexArray<Chat>);

                                            dispatch(setChats(stringIndexArrayChats));
                                            dispatch(openChatTF(currentChat.id));
                                        } else {
                                            dispatch(setChats({}));
                                            dispatch(setCurrentChat(null));
                                        }
                                    })
                            })
                    })
            })
    }
}
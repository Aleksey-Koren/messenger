import {IPlainDataAction} from "../redux-types";
import {User} from "../../model/messenger/user";
import {
    SET_IS_EDIT_GLOBAL_USERS_MODAL_OPENED,
    SET_IS_EDIT_ROOM_TITLE_MODAL_OPEN,
    SET_IS_MEMBERS_MODAL_OPEN,
    SET_IS_BOTS_MODAL_OPEN
} from "./messengerMenuTypes";
import {MessageType} from "../../model/messenger/messageType";
import {Message} from "../../model/messenger/message";
import {ThunkDispatch} from "redux-thunk";
import {AppDispatch, AppState} from "../../index";
import {Action} from "redux";
import {setUsers} from "../messenger/messengerActions";
import {ChatApi} from "../../api/chatApi";
import Notification from "../../Notification";
import {MessageMapper} from "../../mapper/messageMapper";
import {CustomerApi} from "../../api/customerApi";


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

export function setIsBotsModalOpened(isOpen: boolean): IPlainDataAction<boolean> {
    return {
        type: SET_IS_BOTS_MODAL_OPEN,
        payload: isOpen
    }
}

export function setIsEditGlobalUsersModalOpened(isOpened: boolean): IPlainDataAction<boolean> {
    return {
        type: SET_IS_EDIT_GLOBAL_USERS_MODAL_OPENED,
        payload: isOpened
    }
}

export function addUserToRoomTF(me: User, customer: User, otherId: string) {
    return (dispatch: ThunkDispatch<AppState, any, Action>, getState: () => AppState) => {
        const currentChat = getState().messenger.chats[getState().messenger.currentChat!];

        const users = {...getState().messenger.users};
        users[otherId] = customer;
        dispatch(setUsers(users, currentChat.id));

        const messageToSend = {
            type: MessageType.hello,
            receiver: otherId,
            sender: me.id,
            chat: currentChat?.id,
            data: currentChat?.title + "__" + currentChat?.keyAES
        } as Message

        //!!!
        Promise.all([messageToSend].map(message => MessageMapper
            .toDto(message, getState().messenger.globalUsers[message.receiver])))
            .then(dto => {
                getState().messenger.stompClient
                    .send(`/app/chat/send-message/${me.id}`, {}, JSON.stringify(dto))
            })
    }
}

export function removeCustomerFromChat(customerId: string, chatId: string) {
    return async (dispatch: AppDispatch, getState: () => AppState) => {
        const state = getState();
        const user = getState().messenger.user;
        const globalUsers = getState().messenger.globalUsers;

        CustomerApi.getServerUser()
            .then(serverUser => {
                const message = {
                    sender: state.messenger.user!.id,
                    receiver: serverUser.id,
                    data: user!.id,
                    decrypted: false
                } as Message

                Promise.all([message].map(message => MessageMapper.toDto(message, globalUsers[message.receiver])))
                    .then(dto => {
                        const token = `${dto[0].data}_${dto[0].nonce}_${dto[0].sender}`

                        ChatApi.removeCustomerFromChat(customerId, chatId, token)
                            .then(() => {
                                const messagesLeaveChatToSend: Message[] = [];
                                const users = getState().messenger.users;

                                for (let id in users) {
                                    const receiver = users[id];
                                    const messageLeaveChat = {
                                        type: MessageType.LEAVE_CHAT,
                                        sender: customerId,
                                        receiver: receiver.id!,
                                        data: state.messenger.user!.id,
                                        chat: state.messenger.currentChat!,
                                        decrypted: false
                                    } as Message
                                    messagesLeaveChatToSend.push(messageLeaveChat)
                                }

                                Promise.all(messagesLeaveChatToSend.map(message => MessageMapper.toDto(message, globalUsers[message.receiver])))
                                    .then(dto => {
                                        getState().messenger.stompClient
                                            .send(`/app/chat/send-message/${user?.id}`, {}, JSON.stringify(dto))
                                    })

                                Notification.add({severity: 'success', message: "User removed from chat successfully!"})
                            })
                            .catch((e) => {
                                console.error(e)
                                Notification.add({severity: 'error', message: e.response.data.message})
                            });
                    })
            })
    }

}
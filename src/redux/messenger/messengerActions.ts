import {
    IMessengerStateOpt,
    SET_CHATS,
    SET_CURRENT_CHAT, SET_LAST_MESSAGES_FETCH,
    SET_GLOBAL_USERS,
    SET_MESSAGES,
    SET_USER,
    SET_USER_TITLE,
    SET_USERS
} from "./messengerTypes";
import {IPlainDataAction} from "../redux-types";
import {User} from "../../model/messenger/user";
import {AppDispatch, AppState} from "../../index";
import {ChatApi} from "../../api/chatApi";
import {MessageApi} from "../../api/messageApi";
import {Message} from "../../model/messenger/message";
import {Chat} from "../../model/messenger/chat";
import {Action} from "redux";
import {ThunkDispatch} from "redux-thunk";
import {MessageType} from "../../model/messenger/messageType";
import {
    setIsEditUserTitleModalOpen,
    setIsGlobalUserConfigurationModalOpen
} from "../messenger-controls/messengerControlsActions";
import Notification from "../../Notification";
import {StringIndexArray} from "../../model/stringIndexArray";
import {CustomerService} from "../../service/messenger/customerService";
import {MessageProcessingService} from "../../service/messenger/messageProcessingService";
import {ChatService} from "../../service/messenger/chatService";
import {Builder} from "builder-pattern";
import {GlobalUser} from "../../model/local-storage/localStorageTypes";
import {LocalStorageService} from "../../service/local-data/localStorageService";
import {CustomerApi} from "../../api/customerApi";

export function setUser(user: User): IPlainDataAction<IMessengerStateOpt> {

    return {
        type: SET_USER,
        payload: {
            user: user
        }
    }
}

export function setChats(chats: StringIndexArray<Chat>): IPlainDataAction<IMessengerStateOpt> {

    return {
        type: SET_CHATS,
        payload: {
            chats: chats
        }
    }
}

export function setUsers(users: StringIndexArray<User>, currentChat: string): IPlainDataAction<IMessengerStateOpt> {

    return {
        type: SET_USERS,
        payload: {
            users: users,
            currentChat: currentChat,
        }
    }
}

export function setCurrentChat(chatId: string | null): IPlainDataAction<IMessengerStateOpt> {
    return {
        type: SET_CURRENT_CHAT,
        payload: {
            currentChat: chatId
        }
    }
}

export function setMessages(messages: Message[]): IPlainDataAction<IMessengerStateOpt> {

    return {
        type: SET_MESSAGES,
        payload: {
            messages: messages
        }
    }
}

export function setUserTitle(title: string): IPlainDataAction<IMessengerStateOpt> {
    return {
        type: SET_USER_TITLE,
        payload: {
            user: {title: title, id: '', publicKey: new Uint8Array()}
        }
    }
}

export function setLastMessagesFetch(lastMessagesFetch: Date): IPlainDataAction<IMessengerStateOpt> {
    return {
        type: SET_LAST_MESSAGES_FETCH,
        payload: {
            lastMessagesFetch
        }
    }
}

export function setGlobalUsers(globalUsers: StringIndexArray<GlobalUser>): IPlainDataAction<IMessengerStateOpt> {
    return {
        type: SET_GLOBAL_USERS,
        payload: {globalUsers: globalUsers}
    }
}

export function sendMessageNewVersion(messageText: string,
                                      messageType: MessageType,
                                      chatId: string,
                                      receiverId: string) {
    return (dispatch: AppDispatch, getState: () => AppState) => {
        const globalUsers = getState().messenger.globalUsers;

        const messagetoSend = Builder<Message>()
            .chat(chatId)
            .data(messageText)
            .type(messageType)
            .sender(getState().messenger.user?.id!)
            .receiver(receiverId)
            .build();

        MessageApi.sendMessages([messagetoSend], globalUsers)
            .catch((e) => {
                console.error(e)
                Notification.add({severity: 'error', message: 'Message not sent', error: e})
            });
    }
}

export function sendMessage(messageText: string, messageType: MessageType, callback: () => void) {
    return (dispatch: AppDispatch, getState: () => AppState) => {
        const currentChat = getState().messenger.currentChat;
        const user = getState().messenger.user;
        const globalUsers = getState().messenger.globalUsers;
        const users = getState().messenger.users;
        const messagesToSend: Message[] = []

        for (let id in users) {
            const member = users[id];
            const message = {
                chat: currentChat!,
                data: messageText,
                type: messageType,
                sender: user?.id!,
                receiver: member.id!
            } as Message;

            messagesToSend.push(message);
        }

        return MessageApi.sendMessages(messagesToSend, globalUsers)
            .then(response => {
                const messages = []
                for (let i = 0; i < response.length; i++) {
                    if (user?.id === response[i].receiver) {
                        messages.push(response[i]);
                    }
                }
                // dispatch(setMessages(appendMessages(chatMessages, messages)))
            }).then(response => {
                callback();
                return response;
            })
            .catch((e) => Notification.add({severity: 'error', message: 'Message not sent', error: e}));
    }
}


export function fetchMessagesTF() {
    return (dispatch: ThunkDispatch<AppState, void, Action>, getState: () => AppState) => {
        const state = getState();
        const currentChatId = state.messenger.currentChat;
        let currentUser = state.messenger.user;
        if (!currentUser) {
            throw new Error("User is not logged in");
        }
        let nextMessageFetch: Date = new Date();


        if (currentChatId) {
            ChatService.processChatParticipants(dispatch, currentChatId, {...state.messenger.globalUsers}, currentUser.id)
                .then(() => {
                    MessageApi.getMessages({
                        receiver: currentUser?.id!,
                        created: state.messenger.lastMessagesFetch!,
                        before: nextMessageFetch
                    }).then(messagesResp => {
                        dispatch(setLastMessagesFetch(nextMessageFetch));
                        MessageProcessingService.processMessages(dispatch, getState, messagesResp);
                    });
                });
        } else {
            MessageApi.getMessages({
                receiver: currentUser.id!,
                created: state.messenger.lastMessagesFetch!,
                before: nextMessageFetch
            }).then(messagesResp => {
                dispatch(setLastMessagesFetch(nextMessageFetch));
                MessageProcessingService.processMessages(dispatch, getState, messagesResp);
            });
        }
    }
}

export function fetchMessengerStateTF(loggedUserId: string) {

    return (dispatch: ThunkDispatch<AppState, void, Action>, getState: () => AppState) => {
        const currentUser = getState().messenger.user;
        if (!currentUser) {
            throw new Error("user not logged in");
        }

        const globalUsers = {...getState().messenger.globalUsers};
        ChatApi.getChats(loggedUserId)
            .then(chatResp => {
                if (chatResp.length === 0) {
                    return;
                }

                CustomerService.addUnknownUsersToGlobalUsers(chatResp, globalUsers)
                    .then(() => ChatService.tryDecryptChatsTitles(chatResp, globalUsers))
                    .then(chats => {
                        const currentChat = chats[0];
                        const stringIndexArrayChats = chats.reduce((prev, next) => {
                            prev[next.id] = next;
                            return prev;
                        }, {} as StringIndexArray<Chat>);

                        dispatch(setGlobalUsers(globalUsers));
                        dispatch(setChats(stringIndexArrayChats));
                        dispatch(openChatTF(currentChat.id));
                    })
            })
    }
}

export function openChatTF(chatId: string) {

    return (dispatch: ThunkDispatch<AppState, void, Action>, getState: () => AppState) => {
        const currentUser = getState().messenger.user!;
        const globalUsers = {...getState().messenger.globalUsers}
        const chats = {...getState().messenger.chats};
        chats[chatId].lastSeenAt = new Date();
        chats[chatId].isUnreadMessagesExist = false;
        dispatch(setChats(chats))

        dispatch(setCurrentChat(chatId));

        MessageApi.getMessages({
            receiver: currentUser.id,
            chat: chatId,
            page: 0,
            size: 20,
            before: getState().messenger.lastMessagesFetch!
        }).then(messages => {
            dispatch(setMessages(messages.filter(message => message.type !== MessageType.who)))
        })
    }
}


export function updateUserTitle(title: string) {

    return (dispatch: ThunkDispatch<AppState, any, Action>, getState: () => AppState) => {
        const user = getState().messenger.user;
        if (!user) {
            throw new Error("User is not logged in");
        }
        const users = getState().messenger.users!;
        const currentChat = getState().messenger.currentChat!
        if (!currentChat) {
            throw new Error("Chat is not selected");
        }
        const messages: Message[] = []

        for (let key in users) {
            messages.push({
                sender: user.id as string,
                receiver: users[key].id as string,
                chat: currentChat as string,
                type: MessageType.iam,
                data: title
            } as Message);
        }

        return MessageApi.updateUserTitle(messages, getState().messenger.globalUsers)
            .then((response) => {
                dispatch(setIsEditUserTitleModalOpen(false));
                // dispatch(setMessages(appendMessages(getState().messenger.messages, response.filter(message => message.receiver === user.id))));
            })
            .catch((e) => Notification.add({message: 'Fail to update user title', error: e, severity: "error"}));
    }
}

export function addPkToGlobalUserTF(userToEdit: GlobalUser, pkToAdd: string) {
    return (dispatch: ThunkDispatch<AppState, any, Action>, getState: () => AppState) => {

        const state = getState();
        const globalUsers = {...state.messenger.globalUsers};
        if (globalUsers[userToEdit.userId].certificates.indexOf(pkToAdd) === -1) {
            globalUsers[userToEdit.userId].certificates.unshift(pkToAdd);
            dispatch(setGlobalUsers(globalUsers));
        }
    }
}

export function addGhostUserTF(id: string) {
    return (dispatch: ThunkDispatch<AppState, any, Action>, getState: () => AppState) => {
        const globalUsers = {...getState().messenger.globalUsers};
        if (!globalUsers[id]) {

            const newUser = {
                userId: id,
                certificates: [],
                titles: {}
            }
            globalUsers[id] = newUser

            dispatch(setGlobalUsers(globalUsers));
            dispatch(setIsGlobalUserConfigurationModalOpen(true, newUser));
        }
    }
}
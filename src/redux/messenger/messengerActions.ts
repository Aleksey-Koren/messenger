import {
    IMessengerStateOpt,
    SET_CHATS, SET_CHATS_LAST_SEEN_AT,
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
import {setIsEditUserTitleModalOpen} from "../messenger-controls/messengerControlsActions";
import {CustomerApi} from "../../api/customerApi";
import {CryptService} from "../../service/cryptService";
import Notification from "../../Notification";
import {MessageMapper} from "../../mapper/messageMapper";
import {StringIndexArray} from "../../model/stringIndexArray";
import {CustomerService} from "../../service/customerService";
import {GlobalUsers} from "../../model/local-storage/localStorageTypes";
import {MessageProcessingService} from "../../service/messageProcessingService";

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

export function setMessages(messages: StringIndexArray<Message[]>): IPlainDataAction<IMessengerStateOpt> {

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

export function setChatsLastSeenAt(chatsLastSeenAt: StringIndexArray<Date>): IPlainDataAction<IMessengerStateOpt> {
    return {
        type: SET_CHATS_LAST_SEEN_AT,
        payload: {
            chatsLastSeenAt
        }
    }
}

export function setGlobalUsers(globalUsers: GlobalUsers): IPlainDataAction<IMessengerStateOpt> {
    return {
        type: SET_GLOBAL_USERS,
        payload: {globalUsers: globalUsers}
    }
}

export function sendMessage(messageText: string, messageType: MessageType, callback: () => void) {
    return (dispatch: AppDispatch, getState: () => AppState) => {
        const currentChat = getState().messenger.currentChat;
        const user = getState().messenger.user;
        const chatMessages = getState().messenger.messages || [];
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

        return MessageApi.sendMessages(messagesToSend, users)
            .then(response => {
                const messages = []
                for (let i = 0; i < response.length; i++) {
                    if (user?.id === response[i].receiver) {
                        messages.push(response[i]);
                    }
                }
                dispatch(setMessages(appendMessages(chatMessages, messages)))
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
        let currentUser = state.messenger.user;
        if (!currentUser) {
            throw new Error("User is not logged in");
        }
        const nextMessageFetch: Date = new Date();

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

export function appendMessages(existing: Message[], incoming: Message[]) {
    const result = [...existing];
    const map: { [key: string]: 1 } = result.reduce((map, message) => {
            map[message.id!] = 1;
            return map;
        },
        {} as { [key: string]: 1 });
    return existing.concat(incoming.filter(message => {
        return !map[message.id!];
    }))
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
                    .then(() => chatResp.map<Chat>(chatDto => {
                        const sender = globalUsers[chatDto.sender];
                        if (sender) {
                            const chat = MessageMapper.toEntity(chatDto, sender.user);
                            return {
                                id: chat.chat!,
                                title: chat.data!,
                                confirmed: false, //TODO: FLAG DECRYPTED / NON-DECRYPTED??
                            }
                        }
                        return {id: chatDto.chat!, title: chatDto.chat!, confirmed: false}
                    }))
                    .then(chats => {
                        const currentChat = chats[0];
                        const stringIndexArrayChats = chats.reduce((prev, next) => {
                            prev[next.id] = next;
                            return prev;
                        }, {} as StringIndexArray<Chat>);

                        dispatch(openChatNewVersion(currentChat))
                        dispatch(setChats(stringIndexArrayChats));
                    })
            })
    }
}

export function openChatNewVersion(chat: Chat) {

    return (dispatch: ThunkDispatch<AppState, void, Action>, getState: () => AppState) => {
        const currentUser = getState().messenger.user!;

        ChatApi.getParticipants(chat.id)
            .then((chatParticipants) => {
                let users: StringIndexArray<User> = chatParticipants.reduce((previousValue, currentValue) => {
                    previousValue[currentValue.id] = {
                        id: currentValue.id,
                        publicKey: currentValue.publicKey,
                    }
                    return previousValue;
                }, {} as StringIndexArray<User>);

                MessageApi.getMessages({
                    receiver: currentUser.id,
                    chat: chat.id,
                    type: MessageType.iam,
                }, users)
                    .then(knownParticipants => {

                        users = CustomerService.processUnknownChatParticipants(chatParticipants, knownParticipants, chat, currentUser.id);
                        dispatch(setCurrentChat(chat.id));
                        dispatch(setUsers(users, chat.id));

                    })
                    .then(() => {
                        dispatch(fetchMessagesTF());
                    });
            })
    }
}


export function updateUserTitle(title: string) {

    return (dispatch: ThunkDispatch<AppState, any, Action>, getState: () => AppState) => {
        const user = getState().messenger.user;
        if (!user) {
            throw new Error("User not logged in");
        }
        const users = getState().messenger.users!;
        const currentChat = getState().messenger.currentChat!
        if (!currentChat) {
            throw new Error("Chat not selected");
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

        return MessageApi.updateUserTitle(messages, users)
            .then((response) => {
                dispatch(setIsEditUserTitleModalOpen(false));
                dispatch(setMessages(appendMessages(getState().messenger.messages, response.filter(message => message.receiver === user.id))));
            })
            .catch((e) => Notification.add({message: 'Fail to update user title', error: e, severity: "error"}));
    }
}

export function openChatTF(chat: Chat) {
    return (dispatch: ThunkDispatch<AppState, void, Action>) => {
        dispatch(setCurrentChat(chat.id!));
    }
}
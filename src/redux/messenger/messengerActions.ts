import {
    IMessengerStateOpt,
    SET_ADMINISTRATORS,
    SET_CHATS,
    SET_CURRENT_CHAT,
    SET_GLOBAL_USERS,
    SET_LAST_MESSAGES_FETCH,
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
import {AttachmentsServiceUpload} from "../../service/messenger/attachments/attachmentsServiceUpload";
import {getLastMessage, setHasMore, setLastRead} from "../messages-list/messagesListActions";
import {MessagesListService} from "../../service/messenger/messagesListService";
import {over} from "stompjs";
import SockJS from "sockjs-client";
import {MessageMapper} from "../../mapper/messageMapper";
import {AdministratorApi} from "../../api/administratorApi";
import {CustomerApi} from "../../api/customerApi";
import {Administrator} from "../../model/messenger/administrator";

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

export function setAdministrators(administrators: StringIndexArray<Administrator>): IPlainDataAction<IMessengerStateOpt> {
    return {
        type: SET_ADMINISTRATORS,
        payload: {
            administrators: administrators,
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

export function connectStompClient(UUID: string) {
    return (dispatch: ThunkDispatch<AppState, void, Action>, getState: () => AppState) => {
        let stompClient = getState().messenger.stompClient;
        stompClient = over(new SockJS('//localhost:8080/ws'))
        stompClient.connect({},
            () => {
                if (stompClient.connected) {
                    stompClient.subscribe('/user/' + UUID + '/private',
                        (payload: { body: string; }) => dispatch(getLastMessage(JSON.parse(payload.body))));
                    stompClient.send("/app/chat/addUser", {}, UUID)
                }
            },
            () => console.log("ERROR TO CONNECT"));
    }
}

export function sendMessageNewVersion(messageText: string,
                                      messageType: MessageType,
                                      chatId: string,
                                      receiverId: string) {
    return (dispatch: AppDispatch, getState: () => AppState) => {
        const globalUsers = getState().messenger.globalUsers;

        const messageToSend = Builder<Message>()
            .chat(chatId)
            .data(messageText)
            .type(messageType)
            .sender(getState().messenger.user?.id!)
            .receiver(receiverId)
            .build();

        MessageApi.sendMessages([messageToSend], globalUsers)
            .catch((e) => {
                console.error(e)
                Notification.add({severity: 'error', message: 'Message not sent', error: e})
            });
    }
}

export function sendMessage(messageText: string, messageType: MessageType, attachments?: FileList) {
    return async (dispatch: AppDispatch, getState: () => AppState) => {
        const currentChat = getState().messenger.currentChat;
        const user = getState().messenger.user;
        const globalUsers = getState().messenger.globalUsers;
        const users = getState().messenger.users;
        const messagesToSend: Message[] = []
        const attachArrays = !!attachments ? await AttachmentsServiceUpload.prepareByteArrays(attachments) : null;

        for (let id in users) {
            const member = users[id];
            const message = {
                chat: currentChat!,
                data: messageText,
                attachments: attachArrays,
                type: messageType,
                sender: user?.id!,
                receiver: member.id!
            } as Message;

            messagesToSend.push(message);
        }

        Promise.all(messagesToSend.map(message => MessageMapper.toDto(message, globalUsers[message.receiver])))
            .then(dto => {
                getState().messenger.stompClient
                    .send(`/app/chat/send-message/${user?.id}`, {}, JSON.stringify(dto))
            })
    }
}

export function assignRoleToCustomer(customerId: string, chatId: string, role: string) {
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
                        const request = {
                            chatId: chatId,
                            customerId: customerId,
                            role: role,
                        }
                        const token = `${dto[0].data}_${dto[0].nonce}_${dto[0].sender}`

                        AdministratorApi.assignRole(request, token)
                            .then((newAdmin) => {
                                const administrators = getState().messenger.administrators;
                                administrators[newAdmin.id] = newAdmin
                                dispatch(setAdministrators(administrators))

                                Notification.add({severity: 'success', message: "Role assigned successfully!"})
                            })
                            .catch((e) => {
                                console.error(e)
                                Notification.add({severity: 'error', message: e.response.data.message})
                            });
                    })
            })
    }
}

export function denyRoleFromCustomer(customerId: string, chatId: string) {
    console.log("denyRoleFromCustomer")
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
                        AdministratorApi.denyRole(customerId, chatId, token)
                            .then(() => {
                                const administrators = getState().messenger.administrators;
                                for (let id in administrators) {
                                    const admin = administrators[id]
                                    if (admin.userId === customerId) {
                                        delete (administrators[admin.id]);
                                        break
                                    }
                                }
                                dispatch(setAdministrators(administrators))

                                Notification.add({severity: 'success', message: "Role denied successfully!"})
                            })
                            .catch((e) => {
                                console.error(e)
                                Notification.add({severity: 'error', message: e.response.data.message})
                            });
                    })
            })
    }
}


export function fetchMessagesTF() {
    return (dispatch: ThunkDispatch<AppState, void, Action>, getState: () => AppState) => {
        console.log("fetchMessagesTF")
        const state = getState();
        const currentChatId = state.messenger.currentChat;
        let currentUser = state.messenger.user;
        if (!currentUser) {
            throw new Error("User is not logged in");
        }
        let nextMessageFetch: Date = new Date();


        if (currentChatId) {
            ChatService.processChatParticipants(dispatch, currentChatId,
                {...state.messenger.globalUsers}, currentUser.id, getState)
                .then(() => {
                    MessageApi.getMessages({
                        receiver: currentUser?.id!,
                        created: state.messenger.lastMessagesFetch!,
                        before: nextMessageFetch
                    }).then(messagesResp => {
                        // console.log(messagesResp)
                        dispatch(setLastMessagesFetch(nextMessageFetch));
                        MessageProcessingService.processMessages(dispatch, getState, messagesResp);
                    });
                });
        } else {
            // MessageApi.getMessages({
            //     receiver: currentUser.id!,
            //     created: state.messenger.lastMessagesFetch!,
            //     before: nextMessageFetch
            // }).then(messagesResp => {
            //     MessageProcessingService.processMessages(dispatch, getState, messagesResp);
            //     dispatch(setLastMessagesFetch(nextMessageFetch));
            // });
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
                        const stringIndexArrayChats = chats.reduce((collector, next) => {
                            collector[next.id] = next;
                            return collector;
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

        AdministratorApi.getAllAdministratorsByChatId(chatId)
            .then(administrators => {
                dispatch(setAdministrators(administrators))
            })

        MessageApi.getMessages({
            receiver: currentUser.id,
            chat: chatId,
            page: 0,
            size: 20,
            before: getState().messenger.lastMessagesFetch!
        }).then(messages => {
            console.log(messages)
            messages = messages.filter(message => message.type !== MessageType.who);
            if (messages.length < 20) {
                dispatch(setHasMore(false))
            }
            dispatch(setMessages(messages));
            dispatch(setLastRead(MessagesListService.mapMessageToHTMLId(messages[0])));

            ChatApi.getParticipants(chatId)
                .then((chatParticipants) => {
                    return MessageApi.getMessages({
                        receiver: currentUser.id,
                        chat: chatId,
                        type: MessageType.iam,
                    }).then(s => {
                        return {
                            knownParticipants: s,
                            chatParticipants: chatParticipants
                        }
                    })
                }).then(s => {
                CustomerService.processUnknownChatParticipants(s.chatParticipants, s.knownParticipants,
                    chatId, currentUser.id, dispatch, getState);
                CustomerService.updateChatParticipantsCertificates(globalUsers, s.chatParticipants, dispatch);
            });
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
        const globalUsers = getState().messenger.globalUsers
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

        return MessageApi.updateUserTitle(messages, globalUsers)
            .then((response) => {
                dispatch(setIsEditUserTitleModalOpen(false));
                Promise.all(messages.map(message => MessageMapper.toDto(message, globalUsers[message.receiver])))
                    .then(dto => {
                        getState().messenger.stompClient
                            .send(`/app/chat/send-message/${user?.id}`, {}, JSON.stringify(dto))
                    })
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
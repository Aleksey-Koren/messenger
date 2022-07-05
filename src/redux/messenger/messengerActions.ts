import {
    IMessengerStateOpt,
    SET_CHATS,
    SET_CURRENT_CHAT,
    SET_MESSAGES,
    SET_USER,
    SET_USER_TITLE,
    SET_USERS
} from "./messengerTypes";
import {IPlainDataAction} from "../redux-types";
import {User} from "../../model/user";
import {AppDispatch, AppState} from "../../index";
import {ChatApi} from "../../api/chatApi";
import {MessageApi} from "../../api/messageApi";
import {Message} from "../../model/message";
import {Chat} from "../../model/chat";
import {CustomerService} from "../../service/customerService";
import {Action} from "redux";
import {ThunkDispatch} from "redux-thunk";
import {MessageType} from "../../model/messageType";
import {setIsEditUserTitleModalOpen} from "../messenger-controls/messengerControlsActions";
import {CustomerApi} from "../../api/customerApi";
import {CryptService} from "../../service/cryptService";
import Notification from "../../Notification";
import {MessageMapper} from "../../mapper/messageMapper";

export function setUser(user: User): IPlainDataAction<IMessengerStateOpt> {

    return {
        type: SET_USER,
        payload: {
            user: user
        }
    }
}
export function setChats(chats: {[key:string]:Chat}): IPlainDataAction<IMessengerStateOpt> {

    return {
        type: SET_CHATS,
        payload: {
            chats: chats
        }
    }
}
export function setUsers(users: {[key:string]:User}, currentChat:string): IPlainDataAction<IMessengerStateOpt> {

    return {
        type: SET_USERS,
        payload: {
            users: users,
            currentChat: currentChat,
        }
    }
}

export function setCurrentChat(chatId: string|null): IPlainDataAction<IMessengerStateOpt> {
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
            user:  {title: title, id: '', publicKey: new Uint8Array()}
        }
    }
}

export function sendMessage(messageText: string, messageType:MessageType, callback: () => void) {
    return (dispatch: AppDispatch, getState: () => AppState) => {
        const currentChat = getState().messenger.currentChat;
        const user = getState().messenger.user;
        const chatMessages = getState().messenger.messages || [];
        const users = getState().messenger.users;
        const messagesToSend: Message[] = []

        for(let id in users) {
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
                for(let i = 0; i < response.length; i++) {
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
        if(!currentUser) {
            throw new Error("User not logged in");
        }
        const currentChat = getState().messenger.currentChat;

        let users:{[key:string]:User} = getState().messenger.users;
        MessageApi.getMessages({
            receiver: currentUser.id!,
            chat: currentChat!
        }, users).then(messagesResp => {
            processMessages(dispatch, getState, messagesResp, users, currentUser);
        });
    }
}

export function appendMessages(existing:Message[], incoming:Message[]) {
    const result = [...existing];
    const map:{[key:string]:1} = result.reduce((map, message) => {
        map[message.id!] = 1; return map;
        },
        {} as {[key:string]:1});
    return existing.concat(incoming.filter(message => {
        return !map[message.id!];
    }))
}

export function fetchMessengerStateTF(loggedUserId:string) {

    return (dispatch: ThunkDispatch<AppState, void, Action>, getState: () => AppState) => {
        const currentUser = getState().messenger.user;
        if(!currentUser) {
            throw new Error("user not logged in");
        }
        const decryptionRequirements:{ [key:string]:string} = {};
        let users:{[key:string]:User} = {};
        const globals = getState().messenger.globalUsers;
        for(let id in globals) {
            users[id] = {
                id: globals[id].user,
                publicKey: CryptService.base64ToUint8(globals[id].certificates[0])
            }
            if(globals[id].certificates.length > 0) {
                console.error("too much certs for " + id);
            }
        }
        ChatApi.getChats(loggedUserId).then(chatResp => {
            if(chatResp.length === 0) {
                return;
            }

            chatResp.forEach(chat => {
                const sender = users[chat.sender];
                if(!sender) {
                    decryptionRequirements[chat.sender] = '';
                }
            });
            const requiredUsers = [];
            for(let id in decryptionRequirements) {
                requiredUsers.push(id);
            }
            CustomerApi.getUsers(requiredUsers).then(response => {
                response.forEach((user) => {
                    users[user.id!] = user;
                });
                return null;
            }).then(() => {
                return chatResp.map<Chat>(chatDto => {
                    if(users[chatDto.sender]) {
                        try {
                            const chat = MessageMapper.toEntity(chatDto, users[chatDto.sender]);
                            return {
                                id: chat.chat!,
                                title: chat.data!,
                                confirmed: false,
                            }
                        } catch (e) {
                            Notification.add({message: 'Fail to decrypt chat title', severity: 'error', error: e})
                        }
                    }
                    return {id: chatDto.chat!, title: chatDto.chat!, confirmed: false}
                });
            }).then(chats => {
                const currentChat = chats[0];
                ChatApi.getParticipants(currentChat?.id!).then((allParticipants) => {
                    users = allParticipants.reduce((prev, next) => {
                        prev[next.id!] = {
                            id: next.id as string,
                            publicKey: next.publicKey,
                        }
                        return prev;
                    }, {} as {[key:string]:User});

                    return MessageApi.getMessages({
                        type: MessageType.iam,
                        receiver: currentUser.id,
                        chat: currentChat.id
                    }, users).then(knownParticipants => {

                        CustomerService.processParticipants(allParticipants, knownParticipants, currentChat, loggedUserId);
                        dispatch(setChats(chats.reduce((prev, next) => {
                            prev[next.id] = next;
                            return prev;
                        }, {} as {[key:string]:Chat})));
                        dispatch(setCurrentChat(currentChat.id));
                        dispatch(setUsers(users, currentChat.id));
                        return null;
                    }).then(() => {
                        dispatch(fetchMessagesTF());
                    });
                })
            })

        })
    }
}

function processMessages(dispatch: ThunkDispatch<AppState, void, Action>, getState: () => AppState, messages: Message[], users: { [p: string]: User }, currentUser: User | null) {
    const chatMessages:Message[] = [];
    let usersUpdated = false;
    if(currentUser === null) {
        console.error("current user is null")
        return;
    }
    const state = getState();
    const currentChat = state.messenger.currentChat;
    const chats = state.messenger.chats;
    let chatsUpdated = false;
    messages.forEach(message => {
        switch (message.type) {
            case MessageType.HELLO:
                if(!chats[message.chat]) {
                    chats[message.chat] = {
                        id: message.chat,
                        title: message.data as string,
                        confirmed: false
                    }
                    chatsUpdated = true;
                } else if(chats[message.chat] && message.data) {
                    chatsUpdated = true;
                    chats[message.chat].title = message.data;
                }
                if(currentChat == null) {
                    //case when user just create account (current chat null)
                    //and was invited in chat
                    dispatch(setCurrentChat(message.chat));
                }
                break;
            case MessageType.whisper:
                chatMessages.push(message);
                break;
            case MessageType.iam:
                usersUpdated = true;
                const mappedUser = {
                    id: message.sender,
                    title: message.data,
                    publicKey: users[message.sender].publicKey
                }
                users[mappedUser.id!] = mappedUser;
                if(mappedUser.id === currentUser?.id!) {
                    currentUser = {...currentUser, title: mappedUser.title} as User;
                    dispatch(setUser(currentUser))
                }
                users = {...users};
                chatMessages.push(message)
                break;
            case MessageType.who:
                if(message.sender === currentUser?.id) {
                    break;
                }
                if(message.receiver !== currentUser?.id) {
                    break;
                }
                dispatch(sendMessage(currentUser?.title || currentUser.id, MessageType.iam, () => {}));
                break;
            default:
                throw new Error('Unknown message type: ' + message.type);
        }
    })
    if(usersUpdated) {
        dispatch(setUsers(users, currentChat!));
    }
    if(chatsUpdated) {
        dispatch(setChats({...chats}));
    }
    if(chatMessages.length > 0) {
        dispatch(setMessages(appendMessages(state.messenger.messages, chatMessages)));
    }
}

export function updateUserTitle(title: string) {

    return (dispatch: ThunkDispatch<AppState, any, Action>, getState: () => AppState) => {
        const user = getState().messenger.user;
        if(!user) {
            throw new Error("User not logged in");
        }
        const users = getState().messenger.users!;
        const currentChat = getState().messenger.currentChat!
        if(!currentChat) {
            throw new Error("Chat not selected");
        }
        const messages: Message[] = []

        for(let key in users) {
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
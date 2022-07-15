import {ThunkDispatch} from "redux-thunk";
import {AppState} from "../../index";
import {Action} from "redux";
import {MessageType} from "../../model/messenger/messageType";
import {Message} from "../../model/messenger/message";
import {
    openChatTF,
    sendMessageNewVersion,
    setChats,
    setGlobalUsers,
    setMessages,
    setUser,
    setUsers
} from "../../redux/messenger/messengerActions";

export class MessageProcessingService {

    static processMessages(dispatch: ThunkDispatch<AppState, void, Action>,
                           getState: () => AppState,
                           newMessages: Message[]) {

        const state = getState();
        const currentChat = state.messenger.currentChat;
        let currentUser = {...state.messenger.user!};
        const chats = {...state.messenger.chats};
        const existing = [...state.messenger.messages];
        const globalUsers = {...state.messenger.globalUsers};
        const users = {...state.messenger.users}

        let isChatsUpdated = false;
        let isGlobalUsersUpdated = false;
        let isMessagesUpdated = false;
        let isCurrentUserUpdated = false;
        let isUsersUpdated = false;
        const incoming: Message[] = [];

        newMessages.forEach(message => {
            switch (message.type) {
                case MessageType.hello:
                    if (!chats[message.chat]) {
                        chats[message.chat] = {
                            id: message.chat,
                            title: message.data!,
                            confirmed: false,
                            isUnreadMessagesExist: false,
                            lastSeenAt: new Date()
                        }
                        isChatsUpdated = true;
                    } else if (chats[message.chat] && message.data) {
                        chats[message.chat].title = message.data;
                        isChatsUpdated = true;
                    }

                    if (currentChat == null) {
                        //case when user just create account (current chat null)
                        //and was invited in chat
                        dispatch(openChatTF(message.chat));
                    }

                    if (message.chat === currentChat) {
                        incoming.push(message);
                        isMessagesUpdated = true;
                    }
                    break;
                case MessageType.whisper:
                    if (message.chat === currentChat) {
                        incoming.push(message);
                        isMessagesUpdated = true;
                    } else {
                        chats[message.chat].isUnreadMessagesExist = true;
                        isChatsUpdated = true;
                    }
                    break;
                case MessageType.iam:
                    globalUsers[message.sender].titles[message.chat] = message.data!;

                    isGlobalUsersUpdated = true;
                    if (message.sender === currentUser?.id!) {
                        currentUser.title = message.data;
                        isCurrentUserUpdated = true;
                    }
                    if (message.chat === currentChat) {
                        incoming.push(message);

                        users[message.sender].title = message.data;
                        isUsersUpdated = true;
                        isMessagesUpdated = true;
                    }
                    break;
                case MessageType.who:
                    dispatch(sendMessageNewVersion(globalUsers[currentUser!.id].titles[message.chat] || currentUser!.id,
                        MessageType.iam,
                        message.chat,
                        message.sender)
                    );
                    break;
                default:
                    throw new Error('Unknown message type: ' + message.type);
            }
        })

        if (isChatsUpdated) {
            dispatch(setChats(chats));
        }
        if (isGlobalUsersUpdated) {
            dispatch(setGlobalUsers(globalUsers));
        }
        if (isMessagesUpdated) {
            dispatch(setMessages(appendMessages(existing, incoming)));
        }
        if (isCurrentUserUpdated) {
            dispatch(setUser(currentUser));
        }
        if (isUsersUpdated) {
            dispatch(setUsers(users, currentChat!));
        }
    }
}

function appendMessages(existing: Message[], incoming: Message[]) {
    const map: { [key: string]: 1 } = existing.reduce((map, message) => {
            map[message.id!] = 1;
            return map;
        },
        {} as { [key: string]: 1 });
    return existing.concat(incoming.filter(message => {
        return !map[message.id!];
    }))
}

// function processUnreadMessages(dispatch: ThunkDispatch<AppState, void, Action>,
//                                getState: () => AppState) {
//     const state = getState();
//
//     const chatsLastSeenAt = {...state.messenger.chatsLastSeenAt};
//     chatsLastSeenAt[state.messenger.currentChat!] = new Date();
//     dispatch(setChatsLastSeenAt(chatsLastSeenAt));
//
//     const chats = {...state.messenger.chats};
//     const messages = state.messenger.messages;
//     for(const chatId in chats) {
//         const lastSeenAt = chatsLastSeenAt[chatId];
//         chats[chatId].unreadMessages = messages[chatId].filter(message => message.created! > lastSeenAt).length;
//     }
//
//     dispatch(setChats(chats));
// }
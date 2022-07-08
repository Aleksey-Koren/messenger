import {ThunkDispatch} from "redux-thunk";
import {AppState} from "../../index";
import {Action} from "redux";
import {MessageType} from "../../model/messenger/messageType";
import {Message} from "../../model/messenger/message";
import {User} from "../../model/messenger/user";
import {
    sendMessage,
    setChats,
    setCurrentChat, setGlobalUsers,
    setMessages,
    setUser
} from "../../redux/messenger/messengerActions";

export class MessageProcessingService {

    static processMessages(dispatch: ThunkDispatch<AppState, void, Action>,
                           getState: () => AppState,
                           newMessages: Message[]) {

        const state = getState();
        const currentChat = state.messenger.currentChat;
        let currentUser = {...state.messenger.user!};
        const chats = {...state.messenger.chats};
        const messages = [...state.messenger.messages];
        const globalUsers = {...state.messenger.globalUsers};

        let isChatsUpdated = false;
        let isGlobalUsersUpdated = false;
        let isMessagesUpdated = false;
        let isCurrentUserUpdated = false;

        newMessages.forEach(message => {
            switch (message.type) {
                case MessageType.HELLO:
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
                        dispatch(setCurrentChat(message.chat));
                    }
                    if (message.chat === currentChat) {
                        messages.push(message);
                        isMessagesUpdated = true;
                    }
                    break;
                case MessageType.whisper:
                    if (message.chat === currentChat) {
                        messages.push(message);
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
                        messages.push(message);
                        isMessagesUpdated = true;
                    }
                    break;
                case MessageType.who:
                    dispatch(sendMessage(globalUsers[currentUser!.id].titles[message.chat] || currentUser!.id, MessageType.iam, () => {
                    }));
                    break;
                default:
                    throw new Error('Unknown message type: ' + message.type);
            }

            if (isChatsUpdated) {
                dispatch(setChats(chats));
            }
            if (isGlobalUsersUpdated) {
                dispatch(setGlobalUsers(globalUsers));
            }
            if (isMessagesUpdated) {
                dispatch(setMessages(messages));
            }
            if (isCurrentUserUpdated) {
                dispatch(setUser(currentUser));
            }
        })
    }
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
import {ThunkDispatch} from "redux-thunk";
import {AppState} from "../../index";
import {Action} from "redux";
import {Message} from "../../model/messenger/message";
import {MessageType} from "../../model/messenger/messageType";
import {User} from "../../model/messenger/user";
import {
    sendMessage,
    setChats,
    setChatsLastSeenAt,
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
        const messages = {...state.messenger.messages};
        const globalUsers = {...state.messenger.globalUsers};

        newMessages.forEach(message => {
            switch (message.type) {
                case MessageType.HELLO:
                    if (!chats[message.chat]) {
                        chats[message.chat] = {
                            id: message.chat,
                            title: message.data!,
                            confirmed: false,
                            unreadMessages: 0
                        }
                    } else if (chats[message.chat] && message.data) {
                        chats[message.chat].title = message.data;
                    }
                    dispatch(setChats(chats));
                    if (currentChat == null) {
                        //case when user just create account (current chat null)
                        //and was invited in chat
                        dispatch(setCurrentChat(message.chat));
                    }
                    messages[message.chat].push(message);
                    break;
                case MessageType.whisper:
                    messages[message.chat].push(message);
                    break;
                case MessageType.iam:
                    globalUsers[message.sender].titles[message.chat] = message.data!;
                    dispatch(setGlobalUsers(globalUsers));
                    if (message.sender === currentUser?.id!) {
                        currentUser = {...currentUser, title: message.data} as User;
                        dispatch(setUser(currentUser))
                    }
                    messages[message.chat].push(message);
                    break;

                case MessageType.who:
                    dispatch(sendMessage(globalUsers[currentUser!.id].titles[message.chat] || currentUser!.id, MessageType.iam, () => {
                    }));
                    messages[message.chat].push(message);
                    break;
                default:
                    throw new Error('Unknown message type: ' + message.type);
            }

            dispatch(setMessages(messages));

            processUnreadMessages(dispatch, getState);

        })
    }
}

function processUnreadMessages(dispatch: ThunkDispatch<AppState, void, Action>,
                               getState: () => AppState) {
    const state = getState();

    const chatsLastSeenAt = {...state.messenger.chatsLastSeenAt};
    chatsLastSeenAt[state.messenger.currentChat!] = new Date();
    dispatch(setChatsLastSeenAt(chatsLastSeenAt));

    const chats = {...state.messenger.chats};
    const messages = state.messenger.messages;
    for(const chatId in chats) {
        const lastSeenAt = chatsLastSeenAt[chatId];
        chats[chatId].unreadMessages = messages[chatId].filter(message => message.created! > lastSeenAt).length;
    }

    dispatch(setChats(chats));
}
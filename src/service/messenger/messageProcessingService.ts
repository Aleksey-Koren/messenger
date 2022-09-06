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
import {setLastRead} from "../../redux/messages-list/messagesListActions";
import {MessagesListService} from "./messagesListService";

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
        const isAtTheBottom = state.messagesList.isAtTheBottom;

        let isChatsUpdated = false;
        let isGlobalUsersUpdated = false;
        let isMessagesUpdated = false;
        let isCurrentUserUpdated = false;
        let isUsersUpdated = false;
        let isOpenChatNeeded = false;
        let newChatId: string;
        const incoming: Message[] = [];

        newMessages.forEach(message => {
            switch (message.type) {
                case MessageType.hello:
                    if (!chats[message.chat]) {
                        chats[message.chat] = {
                            id: message.chat,
                            title: message.data!,
                            confirmed: false,
                            isUnreadMessagesExist: true,
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
                        isOpenChatNeeded = true;
                        newChatId = message.chat;
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
            if(isAtTheBottom) {
                const appended = appendMessages(existing, incoming);
                dispatch(setMessages(appended));
                dispatch(setLastRead(MessagesListService.mapMessageToHTMLId(appended[0])));
            } else {
                appendMessages(existing, incoming);
            }
        }
        if (isCurrentUserUpdated) {
            dispatch(setUser(currentUser));
        }
        if (isUsersUpdated) {
            dispatch(setUsers(users, currentChat!));
        }
        if (isOpenChatNeeded) {
            dispatch(openChatTF(newChatId!));
        }
    }
}

function appendMessages(existing: Message[], incoming: Message[]) {
    const map: { [key: string]: 1 } = existing.reduce((map, message) => {
            map[message.id!] = 1;
            return map;
        },
        {} as { [key: string]: 1 });

    const newFiltered: Message[] = incoming.filter(message => {
        return !map[message.id!];
    });
    newFiltered.sort(sortByCreatedAtDesc);
    return [...newFiltered, ...existing];
}

function sortByCreatedAtDesc(a: Message, b: Message) {
    if(a.created!.getTime() > b.created!.getTime()) {
        return -1;
    } else if(a.created!.getTime() < b.created!.getTime()) {
        return 1;
    } else {
        return 0;
    }
}
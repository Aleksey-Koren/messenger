import {IMessengerState, SET_CURRENT_CHAT, SET_MESSAGES, SET_MESSENGER_STATE, SET_USER} from "./messengerTypes";
import {IPlainDataAction} from "../redux-types";
import {User} from "../../model/user";
import {AppDispatch, AppState} from "../../index";
import {ChatApi} from "../../api/chatApi";
import {MessageApi} from "../../api/messageApi";
import {Message} from "../../model/message";
import {Chat} from "../../model/chat";
import {MessageService} from "../../service/messageService";
import {CustomerService} from "../../service/customerService";
import {Action} from "redux";
import {ThunkDispatch} from "redux-thunk";
import {Builder} from "builder-pattern";
import {MessageType} from "../../model/messageType";
import {setIsEditTitleModalOpen} from "../messenger-menu/messengerMenuActions";
import {setErrorPopupState} from "../error-popup/errorPopupActions";

export function setUser(user: User): IPlainDataAction<User> {

    return {
        type: SET_USER,
        payload: user
    }
}

export function setMessengerState(context: IMessengerState): IPlainDataAction<IMessengerState> {

    return {
        type: SET_MESSENGER_STATE,
        payload: context
    }
}

export function setCurrentChat(chat: Chat): IPlainDataAction<Chat> {

    return {
        type: SET_CURRENT_CHAT,
        payload: chat
    }
}

export function setMessages(messages: Message[]): IPlainDataAction<Message[]> {

    return {
        type: SET_MESSAGES,
        payload: messages
    }
}

export function sendMessage(messageText: string) {

    return (dispatch: AppDispatch, getState: () => AppState) => {
        const currentChat = getState().messenger.currentChat;
        const user = getState().messenger.user;
        const chatMessages = getState().messenger.messages;
        const chatParticipants = getState().messenger.users;
        const messagesToSend: Message[] = []

        chatParticipants?.forEach(member => {
            const message = Builder(Message)
                .chat(currentChat?.id!)
                .data(messageText)
                .type(MessageType.whisper)
                .sender(user?.id!)
                .receiver(member.id)
                .build();

            if (user?.id === member.id) {
                dispatch(setMessages([...chatMessages!, message]))
            }

            messagesToSend.push(message);
        })

        MessageApi.sendMessages(messagesToSend);
    }
}

export function updateRoomTitle(roomTitle: string) {

    return (dispatch: AppDispatch, getState: () => AppState) => {
        const currentChat = getState().messenger.currentChat;
        const user = getState().messenger.user;
        const chatParticipants = getState().messenger.users;
        const messagesToSend: Message[] = []

        chatParticipants?.forEach(member => {
            const message = Builder(Message)
                .chat(currentChat?.id!)
                .data(roomTitle)
                .type(MessageType.hello)
                .sender(user?.id!)
                .receiver(member.id)
                .build();

            messagesToSend.push(message);
        })

        MessageApi.sendMessages(messagesToSend).then(() => {
            dispatch(setIsEditTitleModalOpen(false));
            //    todo: add setCurrentChat(chat with updated title)
        }).catch((err) => {
            console.log(err)
            dispatch(setErrorPopupState(true, 'Something went wrong. Try again'))
        });
    }
}

export function fetchMessengerStateTF(user: User) {

    return (dispatch: ThunkDispatch<AppState, void, Action>, getState: () => AppState) => {

        const messages: Message[] = [];
        const users: Map<string, User> = new Map<string, User>();
        let chats: Chat[] = [];

        ChatApi.getChats(user.id!).then(chatResp => {
            chats = chatResp.map<Chat>(chat => ({id: chat.chat, title: chat.data}));

            const currentChat = getState().messenger.currentChat || chats[0];

            if (!currentChat) {
                dispatch(setUser(user));
                return;
            }

            const messagesRequest = MessageApi.getMessages(user.id!, currentChat?.id!);
            const participantsRequest = ChatApi.getParticipants(currentChat?.id!)
            Promise.all([messagesRequest, participantsRequest])
                .then(([messagesResp, participantsResp]) => {
                    const participants = participantsResp;

                    messagesResp.forEach(message => MessageService.processMessage(message, messages, users, currentChat, participants, user));

                    if (participants.length !== users.size) {
                        CustomerService.processUnknownChatParticipants(participants, users, currentChat, user.id!);
                    }
                    dispatch(setMessengerState({chats, users, user, currentChat, messages}));
                })
        })
    }
}
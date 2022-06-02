import {IMessengerState, SET_MESSENGER_STATE, SET_USER} from "./messengerTypes";
import {IPlainDataAction} from "../redux-types";
import {User} from "../../model/user";
import {AppState} from "../../index";
import {ChatApi} from "../../api/chatApi";
import {MessageApi} from "../../api/messageApi";
import {Message} from "../../model/message";
import {Chat} from "../../model/chat";
import {MessageService} from "../../service/messageService";
import {CustomerService} from "../../service/customerService";
import {Action} from "redux";
import {ThunkDispatch} from "redux-thunk";

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

export function fetchMessengerStateTF(user: User) {

    return (dispatch: ThunkDispatch<AppState, void, Action>, getState: () => AppState) => {

        const messages: Message[] = [];
        const users: Map<string, User> = new Map<string, User>();
        let chats: Chat[] = [];

        ChatApi.getChats(user.id!).then(chatResp => {
            chats = chatResp.data.map<Chat>(chat => ({id: chat.chat, title: chat.data}));

            const currentChat = getState().messenger.currentChat || chats[0];

            if(!currentChat) {
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
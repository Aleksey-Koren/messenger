import {IPlainDataAction} from "../redux-types";
import {User} from "../../model/user";
import {Chat} from "../../model/chat";
import {Message} from "../../model/message";

export interface IMessengerState {
    user: User | null;
    chats: Chat[] | null;
    messages: Message[] | null;
    users: Map<string, User> | null;
    currentChat: Chat | null;
}

export type TMessengerAction = IPlainDataAction<User> | IPlainDataAction<IMessengerState> | IPlainDataAction<Message[]>

export const SET_USER = 'SET_USER';
export const SET_MESSENGER_STATE = 'SET_MESSENGER_STATE';
export const SET_MESSAGES = 'SET_MESSAGES';
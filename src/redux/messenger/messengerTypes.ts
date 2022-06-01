import {IPlainDataAction} from "../redux-types";
import {User} from "../../model/user";
import {Chat} from "../../model/chat";

export interface IMessengerState {
    user: User | null;
    chats: Chat[] | null;
    users: User[] | null;
    currentChat: Chat | null;
}

export type TMessengerAction = IPlainDataAction<User> | IPlainDataAction<IMessengerState>

export const SET_USER = 'SET_USER';
export const SET_MESSENGER_STATE = 'SET_MESSENGER_STATE';
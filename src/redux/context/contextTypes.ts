import {IPlainDataAction} from "../redux-types";
import {User} from "../../model/user";
import {Chat} from "../../model/chat";

export interface IContextState {
    user: User | null;
    chats: Chat[] | null;
    users: User[] | null;
    currentChat: Chat | null;
}

export type TContextAction = IPlainDataAction<User> | IPlainDataAction<IContextState>

export const SET_USER = 'SET_USER';
export const SET_CONTEXT = 'SET_CONTEXT';
import {IPlainDataAction} from "../redux-types";
import {User} from "../../model/user";
import {Chat} from "../../model/chat";
import {Message} from "../../model/message";

export type GlobalUsers = {[key:string]:{user:string, certificates:string[], titles:{[key:string]:string}}}

export interface IMessengerStateOpt {
    chats?: {[key:string]:Chat};
    messages?: Message[];
    users?: {[key:string]:User};
    globalUsers?: GlobalUsers;
    user?: User|null;
    currentChat?: string|null;
}
export interface IMessengerState extends IMessengerStateOpt {
    chats: {[key:string]:Chat};
    messages: Message[];
    users: {[key:string]:User};
    globalUsers: GlobalUsers;
    user: User|null;
    currentChat: string|null;
}

export type TMessengerAction = IPlainDataAction<IMessengerState>

export const SET_USER = 'SET_USER';
export const SET_CURRENT_CHAT = 'SET_CURRENT_CHAT';
export const SET_MESSAGES = 'SET_MESSAGES';
export const SET_USERS = 'SET_CURRENT_USERS';
export const SET_CHATS = 'SET_CURRENT_CHATS';
export const SET_PRIVATE_KEY = 'SET_PRIVATE_KEY';
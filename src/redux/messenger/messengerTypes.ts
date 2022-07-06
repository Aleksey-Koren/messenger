import {IPlainDataAction} from "../redux-types";
import {User} from "../../model/messenger/user";
import {Chat} from "../../model/messenger/chat";
import {Message} from "../../model/messenger/message";
import {GlobalUsers} from "../../model/local-storage/localStorageTypes";
import {StringIndexArray} from "../../model/stringIndexArray";

export interface IMessengerStateOpt {
    chats?: StringIndexArray<Chat>;
    messages?: Message[];
    users?: StringIndexArray<User>;
    globalUsers?: GlobalUsers;
    user?: User | null;
    currentChat?: string | null;
}

export interface IMessengerState extends IMessengerStateOpt {
    chats: StringIndexArray<Chat>;
    messages: Message[];
    users: StringIndexArray<User>;
    globalUsers: GlobalUsers;
    user: User | null;
    currentChat: string | null;
}

export type TMessengerAction = IPlainDataAction<IMessengerState>

export const SET_USER = 'SET_USER';
export const SET_CURRENT_CHAT = 'SET_CURRENT_CHAT';
export const SET_MESSAGES = 'SET_MESSAGES';
export const SET_USER_TITLE = 'SET_USER_TITLE';
export const SET_USERS = 'SET_CURRENT_USERS';
export const SET_CHATS = 'SET_CURRENT_CHATS';
export const SET_PRIVATE_KEY = 'SET_PRIVATE_KEY';
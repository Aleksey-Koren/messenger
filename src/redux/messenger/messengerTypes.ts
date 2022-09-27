import {IPlainDataAction} from "../redux-types";
import {User} from "../../model/messenger/user";
import {Message} from "../../model/messenger/message";
import {StringIndexArray} from "../../model/stringIndexArray";
import {GlobalUser} from "../../model/local-storage/localStorageTypes";
import {Client} from "stompjs";

export interface IMessengerStateOpt {
    messages?: Message[];
    users?: StringIndexArray<User>;
    globalUsers?: StringIndexArray<GlobalUser>;
    user?: User | null;
    lastMessagesFetch?: Date | null;
    currentPage?: number,
    sizePage?: number,
    totalElements?: number,
    totalPages?: number,
    numberOfElements?: number,
}

export interface IMessengerState extends IMessengerStateOpt {
    messages: Message[];
    users: StringIndexArray<User>;
    globalUsers: StringIndexArray<GlobalUser>;
    user: User | null;
    lastMessagesFetch: Date | null;
    stompClient: Client;
    currentPage: number,
    sizePage: number,
    totalElements: number,
    totalPages: number,
    numberOfElements: number,
}

export type TMessengerAction = IPlainDataAction<IMessengerState>

export const SET_USER = 'SET_USER';
export const SET_CURRENT_CHAT = 'SET_CURRENT_CHAT';
export const SET_MESSAGES = 'SET_MESSAGES';
export const SET_USER_TITLE = 'SET_USER_TITLE';
export const SET_USERS = 'SET_CURRENT_USERS';
export const SET_CHATS = 'SET_CURRENT_CHATS';
export const SET_PRIVATE_KEY = 'SET_PRIVATE_KEY';
export const SET_GLOBAL_USERS = 'SET_GLOBAL_USERS';
export const SET_LAST_MESSAGES_FETCH = 'SET_LAST_MESSAGES_FETCH';

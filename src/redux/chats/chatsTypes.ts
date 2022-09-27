import {IPlainDataAction} from "../redux-types";
import {Chat} from "../../model/messenger/chat";
import {Member} from "../../model/messenger/member";

export interface IChatsStateOpt {
    chats?: Chat[];
    chat?: Chat | null;
    members?: Member[];
    member?: Member | null;
    loadingChats?: boolean,
    loadingChat?: boolean,
}

export interface IChatState extends IChatsStateOpt {
    chats: Chat[];
    chat: Chat | null;
    members: Member[];
    member: Member | null;
    loadingChats: boolean,
    loadingChat: boolean,
}

export type TChatsAction = IPlainDataAction<IChatState>

export const SET_CHATS = 'SET_CHATS';
export const SET_CHAT = 'SET_CHAT';
export const SET_MEMBERS = 'SET_MEMBERS';
export const SET_MEMBER = 'SET_MEMBER';
export const CREATE_CHAT = 'CREATE_CHAT';
export const UPDATE_CHAT = 'UPDATE_CHAT';
export const DELETE_CHAT = 'DELETE_CHAT';
export const SET_LOADING_CHATS = "SET_LOADING_CHATS"
export const SET_LOADING_CHAT = "SET_LOADING_CHAT"

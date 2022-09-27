import {
    IChatState,
    SET_CHAT,
    SET_CHATS,
    SET_LOADING_CHAT,
    SET_LOADING_CHATS, SET_MEMBER, SET_MEMBERS,
    TChatsAction,
    UPDATE_CHAT
} from "./chatsTypes";
import {Chat} from "../../model/messenger/chat";


const initialState: IChatState = {
    chats: [],
    chat: null,
    members: [],
    member: null,
    loadingChats: true,
    loadingChat: true,
}

export function chatsReducer(state: IChatState = initialState, action: TChatsAction): IChatState {
    switch (action.type) {
        case SET_CHATS:
            return {
                ...state,
                chats: action.payload.chats,
                loadingChats: false,
            }
        case SET_CHAT:
            return {
                ...state,
                chat: action.payload.chat,
                loadingChat: false,
            }
        case SET_MEMBERS:
            return {
                ...state,
                members: action.payload.members,
            }
        case SET_MEMBER:
            return {
                ...state,
                member: action.payload.member,
            }
        case UPDATE_CHAT:
            const objIndex = state.chats.findIndex((item => item.id === action.payload.chat!.id));
            let updateChats: Chat[] = state.chats;
            state.chats[objIndex] = action.payload.chat!
            return {
                ...state,
                chats: updateChats,
            }
        case SET_LOADING_CHATS:
            return {
                ...state,
                loadingChats: false,
            }
        case SET_LOADING_CHAT:
            return {
                ...state,
                loadingChat: false,
            }
        default:
            return state;
    }
}
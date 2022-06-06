import {IMessengerState, SET_CURRENT_CHAT, SET_MESSENGER_STATE, SET_USER, TMessengerAction} from "./messengerTypes";
import {IPlainDataAction} from "../redux-types";
import {User} from "../../model/user";
import { Chat } from "../../model/chat";


const initialState: IMessengerState = {
    user: null,
    chats: null,
    messages: null,
    users: null,
    currentChat: null
}

export function messengerReducer(state: IMessengerState = initialState, action: TMessengerAction) {

    let castedAction;

    switch (action.type) {

        case SET_MESSENGER_STATE:
            castedAction = action as IPlainDataAction<IMessengerState>;
            return castedAction.payload

        case SET_USER:
            castedAction = action as IPlainDataAction<User>;
            return {...state, user: castedAction.payload};
            
        case SET_CURRENT_CHAT:
            castedAction = action as IPlainDataAction<Chat>;
            return {...state, currentChat: castedAction.payload}

        default:
            return state;
    }
}
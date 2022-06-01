import {IMessengerState, SET_MESSENGER_STATE, SET_USER, TMessengerAction} from "./messengerTypes";
import {IPlainDataAction} from "../redux-types";
import {User} from "../../model/user";


const initialState: IMessengerState = {
    user: null,
    chats: null,
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

        default: return state;
    }
}
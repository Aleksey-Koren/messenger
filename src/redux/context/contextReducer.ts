import {IContextState, SET_CONTEXT, SET_USER, TContextAction} from "./contextTypes";
import {IPlainDataAction} from "../redux-types";
import {User} from "../../model/user";


const initialState: IContextState = {
    user: null,
    chats: null,
    users: null,
    currentChat: null
}

export function contextReducer(state: IContextState = initialState, action: TContextAction) {

    let castedAction;

    switch (action.type) {

        case SET_CONTEXT:
            castedAction = action as IPlainDataAction<IContextState>;
            return castedAction.payload

        case SET_USER:
            castedAction = action as IPlainDataAction<User>;
            return {...state, user: castedAction.payload};

        default: return state;
    }
}
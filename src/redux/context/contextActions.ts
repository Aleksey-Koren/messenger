import {IContextState, SET_CONTEXT, SET_USER} from "./contextTypes";
import {IPlainDataAction} from "../redux-types";
import {User} from "../../model/user";

export function setUser(user: User): IPlainDataAction<User> {
    return {
        type: SET_USER,
        payload: user
    }
}

export function setContext(context: IContextState): IPlainDataAction<IContextState> {
    return {
        type: SET_CONTEXT,
        payload: context
    }
}


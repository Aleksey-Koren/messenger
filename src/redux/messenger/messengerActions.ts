import {IMessengerState, SET_MESSENGER_STATE, SET_USER} from "./messengerTypes";
import {IPlainDataAction} from "../redux-types";
import {User} from "../../model/user";
import {AppDispatch} from "../../index";
import {ChatService} from "../../service/chatService";

export function setUser(user: User): IPlainDataAction<User> {
    return {
        type: SET_USER,
        payload: user
    }
}

export function setMessengerState(context: IMessengerState): IPlainDataAction<IMessengerState> {
    return {
        type: SET_MESSENGER_STATE,
        payload: context
    }
}

export function fetchMessengerStateTF(user: User) {
    return (dispatch: AppDispatch) => {
        ChatService.getChats(user.id!).then(messages => {
            }
        )
    }
}


import {IPlainDataAction} from "../redux-types";
import {SET_IS_CREATE_PRIVATE_MODAL_OPENED} from "./messengerControlsTypes";
import {AppState} from "../../index";
import {ThunkDispatch} from "redux-thunk";
import {Action} from "redux";
import {Message} from "../../model/message";
import {User} from "../../model/user";
import {Builder} from "builder-pattern";
import {MessageType} from "../../model/messageType";
import {MessageApi} from "../../api/messageApi";
import {fetchMessengerStateTF} from "../messenger/messengerActions";

export function setIsNewPrivateModalOpened(isOpened: boolean): IPlainDataAction<boolean> {
    return {
        type: SET_IS_CREATE_PRIVATE_MODAL_OPENED,
        payload: isOpened
    }
}
//todo I must test this function
export function createNewPrivateRoom(myId: string, otherId: string) {
    return (dispatch: ThunkDispatch<AppState, void, Action>, getState: () => AppState) => {
        const me = getState().messenger.user;
        const messages = [prepareHello(me!, otherId), prepareHelloForMe(me!, otherId)];
        MessageApi.sendMessages(messages)
            .then(() => {dispatch(fetchMessengerStateTF(me!))})
    }
}

function prepareHello(me: User, otherId: string) {
    return Builder(Message)
        .sender(me.id)
        .receiver(otherId)
        .type(MessageType.hello)
        .data(me.id)
        .build()
}

function prepareHelloForMe(me: User, otherId: string) {
    return Builder(Message)
        .sender(me.id)
        .receiver(me.id)
        .type(MessageType.hello)
        .data(otherId)
        .build()
}
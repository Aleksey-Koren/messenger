import {IPlainDataAction} from "../redux-types";
import {
    SET_IS_CREATE_PRIVATE_MODAL_OPENED,
    SET_IS_CREATE_ROOM_MODAL_OPENED,
    SET_IS_EDIT_USER_TITLE_MODAL_OPEN
} from "./messengerControlsTypes";
import {AppState} from "../../index";
import {ThunkDispatch} from "redux-thunk";
import {Action} from "redux";
import {MessageApi} from "../../api/messageApi";
import {fetchMessengerStateTF, setCurrentChat} from "../messenger/messengerActions";
import {MessageService} from "../../service/messageService";
import {setErrorPopupState} from "../error-popup/errorPopupActions";

export function setIsNewPrivateModalOpened(isOpened: boolean): IPlainDataAction<boolean> {
    return {
        type: SET_IS_CREATE_PRIVATE_MODAL_OPENED,
        payload: isOpened
    }
}

export function setIsNewRoomModalOpened(isOpened: boolean): IPlainDataAction<boolean> {
    return {
        type: SET_IS_CREATE_ROOM_MODAL_OPENED,
        payload: isOpened
    }
}

export function setIsEditUserTitleModalOpen(isOpen: boolean): IPlainDataAction<boolean> {
    return {
        type: SET_IS_EDIT_USER_TITLE_MODAL_OPEN,
        payload: isOpen
    }
}

export function createNewRoomTF(title: string) {

    return (dispatch: ThunkDispatch<AppState, void, Action>, getState: () => AppState) => {
        const user = getState().messenger.user;
        MessageApi.sendMessageToMyself(MessageService.prepareHello(user!, user?.id!, title), user?.publicKey!)
            .then((message) => {
                dispatch(setCurrentChat({id: message.chat, title: message.data}));
                dispatch(fetchMessengerStateTF(user!));
                dispatch(setIsNewPrivateModalOpened(false));
            }).catch(err => {
            console.error(err)
            dispatch(setErrorPopupState(true, 'Something went wrong. Try again'))
        })
    }
}

//todo I must test this function
/*export function createNewPrivateRoom(myId: string, otherId: string) {
    return (dispatch: ThunkDispatch<AppState, void, Action>, getState: () => AppState) => {
        const me = getState().messenger.user;
        const messages = [prepareHello(me!, otherId), prepareHelloForMe(me!, otherId)];
       MessageApi.sendMessages(messages)
            .then(() => {dispatch(fetchMessengerStateTF(me!))})
    }
}

function prepareHelloForMe(me: User, otherId: string) {
    return Builder(Message)
        .sender(me.id)
        .receiver(me.id)
        .type(MessageType.hello)
        .data(otherId)
        .build()
}*/
import {IPlainDataAction} from "../redux-types";
import {ThunkDispatch} from "redux-thunk";
import {AppState} from "../../index";
import {Action} from "redux";
import {Chat} from "../../model/chat";
import {MessageApi} from "../../api/messageApi";
import {MessageService} from "../../service/messageService";
import {fetchMessengerStateTF} from "../messenger/messengerActions";
import {User} from "../../model/user";
import {CustomerApi} from "../../api/customerApi";
import {SET_IS_EDIT_TITLE_MODAL_OPEN, SET_IS_MEMBERS_MODAL_OPEN} from "./messengerMenuTypes";

export function setIsMembersModalOpened(isOpened: boolean): IPlainDataAction<boolean> {

    return {
        type: SET_IS_MEMBERS_MODAL_OPEN,
        payload: isOpened
    }
}

export function setIsAddUserModalOpened(isOpened: boolean): IPlainDataAction<boolean> {

    return {
        type: SET_IS_ADD_USER_MODAL_OPENED,
        payload: isOpened
    }
}

export function addUserToRoomTF(me: User, chat: Chat, otherId: string) {
    return (dispatch: ThunkDispatch<AppState, any, Action>, getState: () => AppState) => {
        console.log("Customer ID -- " + otherId);
        CustomerApi.getCustomer(otherId)
            .then(customer => {
                MessageApi.sendSingleMessage(MessageService.prepareHelloToExisting(me, otherId, chat), customer.pk!)
                    .then(() => {
                        dispatch(fetchMessengerStateTF(me))
                        dispatch(setIsAddUserModalOpened(false))
                    })
            })
    }
}

export function setIsEditTitleModalOpen(isOpen: boolean): IPlainDataAction<boolean> {

    return {
        type: SET_IS_EDIT_TITLE_MODAL_OPEN,
        payload: isOpen
    }
}
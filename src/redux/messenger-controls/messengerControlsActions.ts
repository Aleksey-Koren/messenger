import {IPlainDataAction} from "../redux-types";
import {
    GlobalUserConfigurationState,
    SET_IS_CONFIRM_MODAL_OPEN,
    SET_IS_CREATE_PRIVATE_MODAL_OPENED,
    SET_IS_CREATE_ROOM_MODAL_OPENED,
    SET_IS_EDIT_USER_TITLE_MODAL_OPEN,
    SET_IS_GLOBAL_USER_CONFIGURATION_MODAL_OPEN,
    SET_IS_LEAVE_CHAT_CONFIRM_MODAL_OPENED,
} from "./messengerControlsTypes";
import {AppDispatch, AppState} from "../../index";
import {ThunkDispatch} from "redux-thunk";
import {Action} from "redux";
import {sendMessage, setGlobalUsers, setMessages} from "../messenger/messengerActions";
import {MessageType} from "../../model/messenger/messageType";
import {Message} from "../../model/messenger/message";
import {GlobalUser} from "../../model/local-storage/localStorageTypes";
import {CustomerApi} from "../../api/customerApi";
import {MessageMapper} from "../../mapper/messageMapper";
import {ChatsApi} from "../../api/ChatsApi";
import {setChat, setChats} from "../chats/chatsActions";

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

export function setIsGlobalUserConfigurationModalOpen(isOpen: boolean, globalUserToEdit?: GlobalUser): IPlainDataAction<GlobalUserConfigurationState> {
    return {
        type: SET_IS_GLOBAL_USER_CONFIGURATION_MODAL_OPEN,
        payload: {
            isGlobalUserConfigurationModalOpen: isOpen,
            globalUserToEdit: globalUserToEdit
        }
    }
}

export function setIsConfirmModalOpen(isOpen: boolean): IPlainDataAction<boolean> {
    return {
        type: SET_IS_CONFIRM_MODAL_OPEN,
        payload: isOpen
    }
}

export function setIsLeaveChatConfirmModalOpened(isOpened: boolean): IPlainDataAction<boolean> {
    return {
        type: SET_IS_LEAVE_CHAT_CONFIRM_MODAL_OPENED,
        payload: isOpened,
    }
}

export function removeGlobalUserPublicKeyTF(publicKey: string, globalUser: GlobalUser) {
    return (dispatch: AppDispatch, getState: () => AppState) => {

        const globalUsers = {...getState().messenger.globalUsers};
        const globalUserToEdit = globalUsers[globalUser.userId];

        globalUserToEdit.certificates = globalUserToEdit.certificates.filter(certificate => certificate !== publicKey);

        dispatch(setGlobalUsers(globalUsers));
    }
}

export function leaveChatTF(data: string) {
    return (dispatch: ThunkDispatch<AppState, void, Action>, getState: () => AppState) => {
        const state = getState();
        let currentChat = state.chats.chat!;

        CustomerApi.getServerUser()
            .then(serverUser => {
                const globalUsers = getState().messenger.globalUsers;
                const customerId = state.messenger.user!.id;

                const message = {
                    type: MessageType.SERVER,
                    sender: state.messenger.user!.id,
                    receiver: serverUser.id,
                    data: data,
                    chat: currentChat.id,
                    decrypted: false
                } as Message;


                MessageMapper.toDto(message, globalUsers[message.receiver])
                    .then(dto => {
                        const secretText = dto.data;
                        const nonce = dto.nonce
                        ChatsApi.removeCustomerFromRoom(currentChat.id, customerId, secretText!, nonce!)
                            .then(() => {
                                let chats = state.chats.chats;
                                let members = currentChat.members.filter(user => user.id !== customerId)

                                dispatch(sendMessage(customerId, MessageType.LEAVE_CHAT, members));
                                dispatch(setChats(chats.filter(chat => chat.id !== currentChat.id)))
                                dispatch(setMessages([]))
                                dispatch(setChat(null))
                            })
                    })
            })
    }
}
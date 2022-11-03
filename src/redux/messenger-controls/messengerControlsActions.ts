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
import {setGlobalUsers} from "../messenger/messengerActions";
import {MessageType} from "../../model/messenger/messageType";
import {Message} from "../../model/messenger/message";
import {GlobalUser} from "../../model/local-storage/localStorageTypes";
import {CustomerApi} from "../../api/customerApi";
import {MessageMapper} from "../../mapper/messageMapper";
import {ChatApi} from "../../api/chatApi";
import {CryptService} from "../../service/cryptService";

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

//!!!
export function createNewRoomTF(title: string, userTitle: string) {
    return (dispatch: ThunkDispatch<AppState, void, Action>, getState: () => AppState) => {
        const user = getState().messenger.user;
        const globalUsers = {...getState().messenger.globalUsers};

        if (!user) {
            throw new Error("User is not logged in");
        }

        const keyAES = CryptService.generateKeyAES(16);

        const message = {
            type: MessageType.hello,
            sender: user.id!,
            receiver: user.id!,
            data: title + "__" + keyAES
        } as Message

        Promise.all([message].map(message => MessageMapper.toDto(message, globalUsers[message.receiver])))
            .then(dto => {
                getState().messenger.stompClient
                    .send(`/app/chat/send-message/${user?.id}`, {}, JSON.stringify(dto))
            })
    }
}

export function leaveChatTF() {
    return (dispatch: ThunkDispatch<AppState, void, Action>, getState: () => AppState) => {
        const user = getState().messenger.user;
        const globalUsers = {...getState().messenger.globalUsers};
        const users = getState().messenger.users;

        CustomerApi.getServerUser()
            .then(serverUser => {
                const state = getState();
                const message = {
                    type: MessageType.server,
                    sender: state.messenger.user!.id,
                    receiver: serverUser.id,
                    data: user?.id,
                    chat: state.messenger.currentChat!,
                    decrypted: false
                } as Message

                Promise.all([message].map(message => MessageMapper.toDto(message, globalUsers[message.receiver])))
                    .then(dto => {
                        const token = `${dto[0].data}_${dto[0].nonce}_${dto[0].sender}`
                        ChatApi.leaveChat(state.messenger.currentChat!, dto[0].sender, token)
                            .then(() => {
                                const messagesLeaveChatToSend: Message[] = [];

                                for (let id in users) {
                                    const receiver = users[id];
                                    const messageLeaveChat = {
                                        type: MessageType.LEAVE_CHAT,
                                        sender: state.messenger.user!.id,
                                        receiver: receiver.id!,
                                        data: state.messenger.user!.id,
                                        chat: state.messenger.currentChat!,
                                        decrypted: false
                                    } as Message
                                    messagesLeaveChatToSend.push(messageLeaveChat)
                                }

                                Promise.all(messagesLeaveChatToSend.map(message => MessageMapper.toDto(message, globalUsers[message.receiver])))
                                    .then(dto => {
                                        getState().messenger.stompClient
                                            .send(`/app/chat/send-message/${user?.id}`, {}, JSON.stringify(dto))
                                    })
                            })

                    })
            })
    }
}
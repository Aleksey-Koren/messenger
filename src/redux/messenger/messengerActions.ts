import {
    IMessengerStateOpt,
    SET_GLOBAL_USERS,
    SET_LAST_MESSAGES_FETCH,
    SET_MESSAGES,
    SET_USER,
    SET_USER_TITLE,
    SET_USERS
} from "./messengerTypes";
import {IPlainDataAction} from "../redux-types";
import {User} from "../../model/messenger/user";
import {AppDispatch, AppState} from "../../index";
import {MessageApi} from "../../api/messageApi";
import {Message} from "../../model/messenger/message";
import {Action} from "redux";
import {ThunkDispatch} from "redux-thunk";
import {MessageType} from "../../model/messenger/messageType";
import {
    setIsEditUserTitleModalOpen,
    setIsGlobalUserConfigurationModalOpen
} from "../messenger-controls/messengerControlsActions";
import Notification from "../../Notification";
import {StringIndexArray} from "../../model/stringIndexArray";
import {GlobalUser} from "../../model/local-storage/localStorageTypes";
import {AttachmentsServiceUpload} from "../../service/messenger/attachments/attachmentsServiceUpload";
import {MessageMapper} from "../../mapper/messageMapper";
import {getLastMessage, setHasMore, setLastRead} from "../messages-list/messagesListActions";
import {MessagesListService} from "../../service/messenger/messagesListService";
import {over} from "stompjs";
import SockJS from "sockjs-client";
import {Customer} from "../../model/messenger/customer";

export function setUser(user: User): IPlainDataAction<IMessengerStateOpt> {
    return {
        type: SET_USER,
        payload: {
            user: user
        }
    }
}

export function setUsers(users: StringIndexArray<User>): IPlainDataAction<IMessengerStateOpt> {
    return {
        type: SET_USERS,
        payload: {
            users: users,
        }
    }
}

export function setMessages(messages: Message[]): IPlainDataAction<IMessengerStateOpt> {
    return {
        type: SET_MESSAGES,
        payload: {
            messages: messages
        }
    }
}

export function setUserTitle(title: string): IPlainDataAction<IMessengerStateOpt> {
    return {
        type: SET_USER_TITLE,
        payload: {
            user: {title: title, id: '', publicKey: new Uint8Array()}
        }
    }
}

export function setLastMessagesFetch(lastMessagesFetch: Date): IPlainDataAction<IMessengerStateOpt> {
    return {
        type: SET_LAST_MESSAGES_FETCH,
        payload: {
            lastMessagesFetch
        }
    }
}

export function setGlobalUsers(globalUsers: StringIndexArray<GlobalUser>): IPlainDataAction<IMessengerStateOpt> {
    return {
        type: SET_GLOBAL_USERS,
        payload: {globalUsers: globalUsers}
    }
}

export function connectStompClient(UUID: string) {
    return (dispatch: ThunkDispatch<AppState, void, Action>, getState: () => AppState) => {
        let stompClient = getState().messenger.stompClient;
        stompClient = over(new SockJS('//localhost:8080/ws'))
        stompClient.connect({},
            () => {
                if (stompClient.connected) {
                    stompClient.subscribe('/user/' + UUID + '/private',
                        (payload: { body: string; }) => dispatch(getLastMessage(JSON.parse(payload.body))));
                    stompClient.send("/app/chat/addUser", {}, UUID)
                }
            },
            () => console.log("ERROR TO CONNECT"));
    }
}

/**
 * Method that sends message.
 * @param messageText text content of message
 * @param messageType type of message
 * @param receivers
 * @param attachments files of message
 */
export function sendMessage(messageText: string, messageType: MessageType, receivers: Customer[], attachments?: FileList) {
    console.log("MessengerAction sendMessage")
    return async (dispatch: AppDispatch, getState: () => AppState) => {
        const currentChat = getState().chats.chat!.id;
        const user = getState().messenger.user;
        const globalUsers = getState().messenger.globalUsers;
        const messagesToSend: Message[] = []
        const attachArrays = !!attachments ? await AttachmentsServiceUpload.prepareByteArrays(attachments) : null;

        for (let id in receivers) {
            const receiver = receivers[id];
            const message = {
                chat: currentChat!,
                data: messageText,
                attachments: attachArrays,
                type: messageType,
                sender: user?.id!,
                receiver: receiver.id!
            } as Message;

            messagesToSend.push(message);
        }
        Promise.all(messagesToSend.map(message => MessageMapper.toDto(message, globalUsers[message.receiver])))
            .then(dto => {
                getState().messenger.stompClient
                    .send(`/app/chat/send-message`, {}, JSON.stringify(dto))
            })
    }
}

export function getMessagesByRoomId(roomId: string) {
    return (dispatch: ThunkDispatch<AppState, void, Action>, getState: () => AppState) => {
        const currentUser = getState().messenger.user!;
        MessageApi.getMessages({
            receiver: currentUser.id,
            chat: roomId,
            page: 0,
            size: 20,
            before: getState().messenger.lastMessagesFetch!
        }).then(messages => {
            dispatch(setMessages(messages));
            dispatch(setLastRead(MessagesListService.mapMessageToHTMLId(messages[0])));
            if (messages.length < 20) {
                dispatch(setHasMore(false));
            }
        })
    }
}

//CHANGE
export function updateUserTitle(title: string) {
    return (dispatch: ThunkDispatch<AppState, any, Action>, getState: () => AppState) => {
        // const user = getState().messenger.user;
        // if (!user) {
        //     throw new Error("User is not logged in");
        // }
        // const users = getState().messenger.users!;
        // const currentChat = getState().messenger.currentChat!
        // if (!currentChat) {
        //     throw new Error("Chat is not selected");
        // }
        // const messages: Message[] = []
        //
        // for (let key in users) {
        //     messages.push({
        //         sender: user.id as string,
        //         receiver: users[key].id as string,
        //         chat: currentChat as string,
        //         type: MessageType.iam,
        //         data: title
        //     } as Message);
        // }

        return MessageApi.updateUserTitle([], getState().messenger.globalUsers)
            .then((response) => {
                dispatch(setIsEditUserTitleModalOpen(false));
                // dispatch(setMessages(appendMessages(getState().messenger.messages, response.filter(message => message.receiver === user.id))));
            })
            .catch((e) => Notification.add({message: 'Fail to update user title', error: e, severity: "error"}));
    }
}

export function addPkToGlobalUserTF(userToEdit: GlobalUser, pkToAdd: string) {
    return (dispatch: ThunkDispatch<AppState, any, Action>, getState: () => AppState) => {

        const state = getState();
        const globalUsers = {...state.messenger.globalUsers};
        if (globalUsers[userToEdit.userId].certificates.indexOf(pkToAdd) === -1) {
            globalUsers[userToEdit.userId].certificates.unshift(pkToAdd);
            dispatch(setGlobalUsers(globalUsers));
        }
    }
}

export function addGhostUserTF(id: string) {
    return (dispatch: ThunkDispatch<AppState, any, Action>, getState: () => AppState) => {
        const globalUsers = {...getState().messenger.globalUsers};
        if (!globalUsers[id]) {

            const newUser = {
                userId: id,
                certificates: [],
                titles: {}
            }
            globalUsers[id] = newUser

            dispatch(setGlobalUsers(globalUsers));
            dispatch(setIsGlobalUserConfigurationModalOpen(true, newUser));
        }
    }
}
import {IPlainDataAction} from "../redux-types";
import {AppState} from "../../index";
import {Action} from "redux";
import {ThunkDispatch} from "redux-thunk";
import {
    IChatsStateOpt,
    SET_CHAT,
    SET_CHATS,
    SET_LOADING_CHAT,
    SET_LOADING_CHATS, SET_MEMBER,
    SET_MEMBERS,
    UPDATE_CHAT
} from "./chatsTypes";
import {Chat} from "../../model/messenger/chat";
import {ChatsApi} from "../../api/ChatsApi";
import Notification from "../../Notification";
import {getMessagesByRoomId, sendMessage, setGlobalUsers} from "../messenger/messengerActions";
import {setIsNewPrivateModalOpened} from "../messenger-controls/messengerControlsActions";
import {setIsMembersModalOpened} from "../messenger-menu/messengerMenuActions";
import {CustomerApi} from "../../api/customerApi";
import {CryptService} from "../../service/cryptService";
import {LocalStorageService} from "../../service/local-data/localStorageService";
import {MessageType} from "../../model/messenger/messageType";
import {Member} from "../../model/messenger/member";


export function setChats(chats: Chat[]): IPlainDataAction<IChatsStateOpt> {
    return {
        type: SET_CHATS,
        payload: {
            chats: chats
        }
    }
}

export function setChat(chat: Chat | null): IPlainDataAction<IChatsStateOpt> {
    return {
        type: SET_CHAT,
        payload: {
            chat: chat
        }
    }
}

export function setMembers(members: Member[]): IPlainDataAction<IChatsStateOpt> {
    return {
        type: SET_MEMBERS,
        payload: {
            members: members
        }
    }
}

export function setMember(member: Member | null): IPlainDataAction<IChatsStateOpt> {
    return {
        type: SET_MEMBER,
        payload: {
            member: member
        }
    }
}

export function updateChat(chat: Chat | null): IPlainDataAction<IChatsStateOpt> {
    return {
        type: UPDATE_CHAT,
        payload: {
            chat: chat
        }
    }
}

export function setLoadingChats(loading: boolean): IPlainDataAction<IChatsStateOpt> {
    return {
        type: SET_LOADING_CHATS,
        payload: {
            loadingChats: loading
        }
    }
}

export function setLoadingChat(loading: boolean): IPlainDataAction<IChatsStateOpt> {
    return {
        type: SET_LOADING_CHAT,
        payload: {
            loadingChat: loading
        }
    }
}

export function getChatsByCustomerId(customerId: string, page: number, size: number) {
    return (dispatch: ThunkDispatch<AppState, void, Action>) => {
        console.log("getChatsByCustomerId")
        dispatch(setLoadingChats(true))
        ChatsApi.getChatsByCustomerId(customerId, page, size)
            .then(response => {
                dispatch(setChats(response.content))
                dispatch(getChatById(response.content[0].id))
                dispatch(getMessagesByRoomId(response.content[0].id))
            })
            .finally(() => dispatch(setLoadingChats(false)))

    }
}

export function getChatById(chatId: string) {
    return (dispatch: ThunkDispatch<AppState, void, Action>) => {
        console.log("get chat by id")
        dispatch(setLoadingChat(true))
        ChatsApi.getChatById(chatId)
            .then(response => {
                console.log(response)
                dispatch(setChat(response))
                dispatch(getMessagesByRoomId(response.id))
                dispatch(getMembersByChatId(response.id))
            })
            .finally(() => dispatch(setLoadingChat(false)))
    }
}

export function getMembersByChatId(chatId: string) {
    return (dispatch: ThunkDispatch<AppState, void, Action>) => {
        const data = LocalStorageService.loadDataFromLocalStorage();
        CustomerApi.getMembersByChatId(chatId)
            .then(response => {
                console.log(response)
                dispatch(setMembers(response))
                dispatch(setMember(response.find(item => item.id === data!.user.id)!))
            })
    }
}

/**
 * Method that creates a new chat.
 * @param title
 * @param creatorId
 */
export function createChat(title: string, creatorId: string) {
    return (dispatch: ThunkDispatch<AppState, void, Action>, getState: () => AppState) => {
        const user = getState().messenger.user;
        const chats = {...getState().chats.chats};

        if (!user) {
            throw new Error("User is not logged in");
        }

        ChatsApi.createChat({
            title: title,
            creatorId: creatorId
        })
            .then(chat => {
                chats[chat.id] = chat;

                dispatch(setChats(chats));
                dispatch(setChat(chat))
                dispatch(getMessagesByRoomId(chat.id))

                dispatch(setIsNewPrivateModalOpened(false));
                dispatch(setIsMembersModalOpened(true));

                dispatch(sendMessage(`The chat was created with title «${chat.title}»`, MessageType.CHAT, chat.members));
            })
            .catch(error => {
                console.error(error)
                Notification.add({message: 'Something went wrong.', error: error, severity: 'error'});
            })
    }
}

export function addCustomerToChat(chatId: string, customerId: string) {
    return (dispatch: ThunkDispatch<AppState, any, Action>, getState: () => AppState) => {
        ChatsApi.addCustomerToChat(chatId, customerId)
            .then(chat => {
                dispatch(setChat(chat))

                const globalUsers = {...getState().messenger.globalUsers};
                const requiredUsers: string[] = [];
                requiredUsers.push(customerId);

                CustomerApi.getUsers(requiredUsers).then(response => {
                    response.forEach((user) => {
                        globalUsers[user.id!] = {
                            userId: user.id,
                            certificates: [CryptService.uint8ToBase64(user.publicKey)],
                            titles: {}
                        };
                    })
                    dispatch(setGlobalUsers(globalUsers));
                    LocalStorageService.globalUsersToStorage(globalUsers);
                    dispatch(sendMessage(customerId, MessageType.INVITE_CHAT, chat.members));
                });
            })
            .catch(error => {
                console.error(error.response.data)
                Notification.add({message: 'Error: ', error: error.response.data.message, severity: 'error'});
            })
    }
}

export function updateChatTitleById(chatId: string, title: string) {
    return (dispatch: ThunkDispatch<AppState, any, Action>) => {
        ChatsApi.updateChatTitleById(chatId, title)
            .then(chat => {
                dispatch(updateChat(chat))
                dispatch(setChat(chat))

                const text = `The chat was changed to «${title}»`;
                dispatch(sendMessage(text, MessageType.CHAT, chat.members));
            })
            .catch(error => {
                console.error(error.response.data)
                Notification.add({message: 'Error: ', error: error.response.data.message, severity: 'error'});
            })
    }
}


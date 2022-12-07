import {
    IMessengerState,
    SET_ADMINISTRATORS,
    SET_CHATS,
    SET_CURRENT_CHAT,
    SET_GLOBAL_USERS,
    SET_LAST_MESSAGES_FETCH,
    SET_MESSAGES,
    SET_USER,
    SET_BOT,
    SET_USER_TITLE,
    SET_USERS,
    TMessengerAction
} from "./messengerTypes";
import {User} from "../../model/messenger/user";
import {LOGOUT} from "../authorization/authorizationTypes";
import {LocalStorageService} from "../../service/local-data/localStorageService";
import {StringIndexArray} from "../../model/stringIndexArray";
import {GlobalUser} from "../../model/local-storage/localStorageTypes";
import {over} from "stompjs";
import SockJS from "sockjs-client";


const initialState: IMessengerState = {
    user: null,
    chats: {},
    messages: [],
    users: {},
    administrators: {},
    globalUsers: {},
    currentChat: null,
    lastMessagesFetch: null,
    stompClient: over(new SockJS('//localhost:8080/ws')),
}

export function messengerReducer(state: IMessengerState = initialState, action: TMessengerAction): IMessengerState {
    switch (action.type) {
        case SET_USER_TITLE:
            const user: User = {...state.user!, title: action.payload.user!.title}
            LocalStorageService.userToStorage(user);
            return {...state, user: user};
        case SET_MESSAGES:
            return {...state, messages: action.payload.messages};
        case SET_USER: {
            const user = action.payload.user;
            if (!user) {
                return state;
            }
            LocalStorageService.userToStorage(user);

            return {
                ...state,
                user: user,
                users: {...state.users, [user.id]: user},
                globalUsers: touchGlobalUsers(state.globalUsers, {[user.id]: user})
            }
        }
        case SET_BOT: {
            const bot = action.payload.bot;
            if (!bot) {
                return state;
            }
            
            // TODO: maybe change in future
            return {
                ...state,
                bot: bot
            }
        }
        case SET_CURRENT_CHAT: {
            const user = state.user;
            if (!user) {
                return state;
            }
            if (action.payload.currentChat !== state.currentChat) {
                return {
                    ...state,
                    currentChat: action.payload.currentChat,
                    messages: []
                }
            } else {
                return state;
            }
        }
        case SET_USERS:
            return {
                ...state,
                users: action.payload.users,
                globalUsers: touchGlobalUsers(state.globalUsers, action.payload.users)
            }
        case SET_ADMINISTRATORS:
            return {
                ...state,
                administrators: action.payload.administrators,
            }
        case SET_CHATS:
            LocalStorageService.chatsLastSeenToStorage(action.payload.chats);
            return {...state, chats: action.payload.chats}
        case SET_GLOBAL_USERS:
            LocalStorageService.globalUsersToStorage(action.payload.globalUsers);
            return {...state, globalUsers: action.payload.globalUsers};
        case LOGOUT:
            localStorage.clear();
            // SchedulerService.stopScheduler();
            return {...initialState, globalUsers: {}};
        case SET_LAST_MESSAGES_FETCH:
            LocalStorageService.lastMessagesFetchToStorage(action.payload.lastMessagesFetch!)
            return {...state, lastMessagesFetch: action.payload.lastMessagesFetch};
        default:
            return state;
    }
}


function touchGlobalUsers(globalUsers: StringIndexArray<GlobalUser>, usersCache: StringIndexArray<User>) {
    const globalUsersToChange = {...globalUsers};
    let isGlobalUsersChanged = false;
    for (let key in usersCache) {
        const user = usersCache[key];
        let cert;
        try {
            cert = user.publicKeyPem!;
        } catch (e) {
            console.error("fail to convert public key into string")
            cert = '';
        }
        if (!globalUsersToChange[key]) {
            globalUsersToChange[key] = {
                userId: key,
                certificates: [],
                titles: {}
            };
            isGlobalUsersChanged = true;
        }

        const globalUser = globalUsersToChange[key];

        if (cert && globalUser.certificates.indexOf(cert) === -1) {
            globalUser.certificates.unshift(cert);
            isGlobalUsersChanged = true;
        }
    }

    if (isGlobalUsersChanged) {
        LocalStorageService.globalUsersToStorage(globalUsersToChange);
        return globalUsersToChange
    } else {
        return globalUsers
    }
}
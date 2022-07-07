import {
    IMessengerState,
    SET_CURRENT_CHAT, SET_CHATS, SET_USERS,
    SET_MESSAGES,
    SET_USER,
    TMessengerAction, SET_USER_TITLE, SET_GLOBAL_USERS
} from "./messengerTypes";
import {User} from "../../model/messenger/user";
import {CryptService} from "../../service/cryptService";
import {LOGOUT} from "../authorization/authorizationTypes";
import {SchedulerService} from "../../service/schedulerService";
import {LocalStorageService} from "../../service/localStorageService";
import {GlobalUsers} from "../../model/local-storage/localStorageTypes";
import {StringIndexArray} from "../../model/stringIndexArray";


const initialState: IMessengerState = {
    user: null,
    chats: {},
    messages: {},
    users: {},
    globalUsers: {},
    currentChat: null,
    lastMessagesFetch: null,
    chatsLastSeenAt: {}
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
                users: {...state.users, [user.id!]: user},
                globalUsers: touchGlobalUsers(state.globalUsers, {[user.id]: user}, null)
            };
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
                    messages: [],
                    users: {[user?.id!]: user}
                }
            } else {
                return state;
            }
        }

        case SET_USERS:
            return {
                ...state,
                users: action.payload.users,
                globalUsers: touchGlobalUsers(state.globalUsers, action.payload.users, action.payload.currentChat!)
            }

        case SET_CHATS:
            return {...state, chats: action.payload.chats}

        case SET_GLOBAL_USERS:
            LocalStorageService.globalUsersToStorage(action.payload.globalUsers);
            return {...state, globalUsers: action.payload.globalUsers};

        case LOGOUT:
            localStorage.clear();
            SchedulerService.stopScheduler();
            return initialState;
        default:
            return state;
    }
}

function touchGlobalUsers(globalUsers: GlobalUsers, usersCache: StringIndexArray<User>, currentChat: string | null) {
    console.log('touch global users')
    const out = {...globalUsers};
    for (let key in usersCache) {
        const user = usersCache[key];
        let cert;
        try {
            cert = CryptService.uint8ToBase64(user.publicKey);
        } catch (e) {
            console.error("fail to convert public key into string")
            cert = '';
        }
        if (!out[key]) {
            out[key] = {
                user: key,
                certificates: [],
                titles: {}
            };
        }
        var global = out[key];
        if (currentChat) {
            global.titles[currentChat] = user.title!;
        }
        if (cert && global.certificates.indexOf(cert) === -1) {
            global.certificates.push(cert)
        }
    }

    LocalStorageService.globalUsersToStorage(out);
    return out;
}
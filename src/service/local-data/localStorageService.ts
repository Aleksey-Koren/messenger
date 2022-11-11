import {User} from "../../model/messenger/user";
import {GlobalUser, LocalStorageData, StateData} from "../../model/local-storage/localStorageTypes";
import {Builder} from "builder-pattern";
import {StringIndexArray} from "../../model/stringIndexArray";
import {Chat} from "../../model/messenger/chat";

export class LocalStorageService {

    static userToStorage(user: User) {
        const parsedLocalStorageData = retrieveParsedLocalStorageData();

        const localStorageState = {
            user: {
                id: user.id,
                publicKeyPem: user.publicKeyPem!,
                privateKeyPem: user.privateKeyPem!,
                title: user.title!
            },
            globalUsers: parsedLocalStorageData ? parsedLocalStorageData.globalUsers : {}
        };

        localStorage.setItem('whisper', JSON.stringify(localStorageState));
    }

    static retrieveUserFromLocalStorage(): User | null {
        const parsedLocalStorageData = retrieveParsedLocalStorageData();

        return parsedLocalStorageData && Builder<User>()
            .id(parsedLocalStorageData.user.id)
            .publicKeyPem(parsedLocalStorageData.user.publicKeyPem)
            .privateKeyPem(parsedLocalStorageData.user.privateKeyPem)
            .title(parsedLocalStorageData.user.title)
            .build();
    }

    static globalUsersToStorage(globalUsers: StringIndexArray<GlobalUser>) {
        const parsedLocalStorageData = retrieveParsedLocalStorageData()!;

        parsedLocalStorageData.globalUsers = globalUsers;

        localStorage.setItem('whisper', JSON.stringify(parsedLocalStorageData));
    }

    static retrieveGlobalUsersFromLocalStorage(): StringIndexArray<GlobalUser> | null {
        const parsedLocalStorageData = retrieveParsedLocalStorageData();

        return parsedLocalStorageData && parsedLocalStorageData.globalUsers;
    }

    static lastMessagesFetchToStorage(lastMessagesFetch: Date) {
        localStorage.setItem('lastMessagesFetch', lastMessagesFetch.toISOString());
    }

    static lastMessagesFetchFromLocalStorage(): Date | null {
        const lastMessagesFetch = localStorage.getItem('lastMessagesFetch');

        if (lastMessagesFetch) {
            return new Date(lastMessagesFetch)
        }

        return null;
    }

    static chatsLastSeenToStorage(chats: StringIndexArray<Chat>) {
        const chatsLastSeen: StringIndexArray<Date> = {};

        for (let chatId in chats) {
            chatsLastSeen[chatId] = chats[chatId].lastSeenAt
        }

        localStorage.setItem('chatsLastSeen', JSON.stringify(chatsLastSeen));
    }

    static updateChatLastSeenInStorage(chatId: string, lastSeenAt: Date) {
        const chatsLastSeen = JSON.parse(localStorage.getItem('chatsLastSeen')!) as StringIndexArray<Date>;
        chatsLastSeen[chatId] = lastSeenAt;

        localStorage.setItem('chatsLastSeen', JSON.stringify(chatsLastSeen));
    }

    static chatsLastSeenFromLocalStorage(): StringIndexArray<Date> | null {
        const chatsLastSeen = localStorage.getItem('chatsLastSeen');

        if (chatsLastSeen) {
            return JSON.parse(chatsLastSeen) as StringIndexArray<Date>
        }

        return null;
    }


    static loadDataFromLocalStorage() {
        const data = retrieveParsedLocalStorageData();

        return data && mapLocalStorageToState(data);
    }

    static isLocalStorageExists() {
        return !!localStorage.getItem('whisper');
    }
}

function mapLocalStorageToState(localStorageData: LocalStorageData): StateData {
    return {
        user: {
            id: localStorageData.user.id,
            publicKeyPem: localStorageData.user.publicKeyPem,
            privateKeyPem: localStorageData.user.privateKeyPem,
            title: localStorageData.user.title
        },
        globalUsers: localStorageData.globalUsers
    }
}

function retrieveParsedLocalStorageData(): LocalStorageData | null {
    const localStorageData = localStorage.getItem('whisper');

    return localStorageData && JSON.parse(localStorageData);
}
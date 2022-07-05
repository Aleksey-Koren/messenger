import {User} from "../model/messenger/user";
import {GlobalUsers, LocalStorageState} from "../model/local-storage/localStorageTypes";
import {Builder} from "builder-pattern";

export class LocalStorageService {

    static userToStorage(user: User) {
        const parsedLocalStorageData = retrieveParsedLocalStorageData();

        const localStorageState = {
            user: {
                id: user.id,
                publicKey: Array.from(user.publicKey!),
                privateKey: Array.from(user.privateKey!),
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
            .publicKey(new Uint8Array(parsedLocalStorageData.user.publicKey))
            .privateKey(new Uint8Array(parsedLocalStorageData.user.privateKey))
            .title(parsedLocalStorageData.user.title)
            .build();
    }

    static globalUsersToStorage(globalUsers: GlobalUsers) {
        const parsedLocalStorageData = retrieveParsedLocalStorageData()!;

        parsedLocalStorageData.globalUsers = globalUsers;

        localStorage.setItem('whisper', JSON.stringify(parsedLocalStorageData));
    }

    static retrieveGlobalUsersFromLocalStorage(): GlobalUsers | null {
        const parsedLocalStorageData = retrieveParsedLocalStorageData();

        return parsedLocalStorageData && parsedLocalStorageData.globalUsers;
    }
}


function retrieveParsedLocalStorageData(): LocalStorageState | null {
    const localStorageData = localStorage.getItem('whisper');

    return localStorageData && JSON.parse(localStorageData);
}
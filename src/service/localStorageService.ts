import {User} from "../model/messenger/user";
import {GlobalUser, LocalStorageData, StateData} from "../model/local-storage/localStorageTypes";
import {Builder} from "builder-pattern";
import {CryptService} from "./cryptService";
import {StringIndexArray} from "../model/stringIndexArray";

export class LocalStorageService {

    static userToStorage(user: User) {
        const parsedLocalStorageData = retrieveParsedLocalStorageData();

        const localStorageState = {
            user: {
                id: user.id,
                publicKey: CryptService.uint8ToBase64(user.publicKey),
                privateKey: CryptService.uint8ToBase64(user.privateKey!),
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
            .publicKey(CryptService.base64ToUint8(parsedLocalStorageData.user.publicKey))
            .privateKey(CryptService.base64ToUint8(parsedLocalStorageData.user.privateKey))
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

    static loadDataFromLocalStorage() {
        const data = retrieveParsedLocalStorageData();
        return data && mapLocalStorageToState(data);
    }

    static isLocalStorageExists() {
        return !!localStorage.getItem('whisper');
    }
}

function mapLocalStorageToState (localStorageData: LocalStorageData): StateData {
    return  {
        user: {
            id: localStorageData.user.id,
            publicKey: CryptService.base64ToUint8(localStorageData.user.publicKey),
            privateKey: CryptService.base64ToUint8(localStorageData.user.privateKey),
            title: localStorageData.user.title
        },
        globalUsers: localStorageData.globalUsers
    }
}

function retrieveParsedLocalStorageData(): LocalStorageData | null {
    const localStorageData = localStorage.getItem('whisper');
    return localStorageData && JSON.parse(localStorageData);
}
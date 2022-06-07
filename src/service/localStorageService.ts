import {User} from "../model/user";
import {Builder} from "builder-pattern";
import {LocalStorageUser} from "../model/localStorageUser";

export class LocalStorageService {

    static userToStorage(user: User) {

        const forString = {
            user: {
                id: user.id,
                publicKey: Array.from(user.publicKey!),
                privateKey: Array.from(user.privateKey!),
                title: user.title
            }
        };

        localStorage.setItem('whisper', JSON.stringify(forString));
    }

    static retrieveUserFromLocalStorage() {
        const localStorageData = localStorage.getItem('whisper');
        if(!localStorageData) {
            return null;
        }
        try {
            const parsedLocalStorageData = JSON.parse(localStorageData!) as { user: LocalStorageUser }

            return Builder(User)
                .id(parsedLocalStorageData.user?.id!)
                .publicKey(new Uint8Array(parsedLocalStorageData.user?.publicKey!))
                .privateKey(new Uint8Array(parsedLocalStorageData.user?.privateKey!))
                .title(parsedLocalStorageData.user.title!)
                .build();
        } catch (e) {
            console.error(e);
            return null;
        }

    }
}
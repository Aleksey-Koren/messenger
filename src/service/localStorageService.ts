import {User} from "../model/user";

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
}
import {User} from "../model/messenger/user";
import {StringIndexArray} from "../model/stringIndexArray";
import {GlobalUser} from "../model/local-storage/localStorageTypes";
import {CryptService} from "../service/cryptService";

export class UserMapper {

    static toGlobalUsers(users: User[]) {
        const globalUsers: StringIndexArray<GlobalUser> = {};

        for (let user of users) {
            globalUsers[user.id] = {
                userId: user.id,
                titles: {},
                certificates: [CryptService.uint8ToBase64(user.publicKey)]
            }
        }

        return globalUsers;
    }

    static toUsers(globalUsers: StringIndexArray<GlobalUser>) {
        const users: StringIndexArray<User> = {};

        for (let userId in globalUsers) {
            users[userId] = {
                id: userId,
                publicKey: CryptService.base64ToUint8(globalUsers[userId].certificates[0])
            }
        }

        return users;
    }

}
import {User} from "../model/messenger/user";
import {StringIndexArray} from "../model/stringIndexArray";
import {GlobalUser} from "../model/local-storage/localStorageTypes";

export class UserMapper {

    static toGlobalUsers(users: User[]) {
        const globalUsers: StringIndexArray<GlobalUser> = {};

        for (let user of users) {
            globalUsers[user.id] = {
                userId: user.id,
                titles: {},
                certificates: [user.publicKeyPem!]
            }
        }

        return globalUsers;
    }

    static toUsers(globalUsers: StringIndexArray<GlobalUser>) {
        const users: StringIndexArray<User> = {};

        for (let userId in globalUsers) {
            users[userId] = {
                id: userId,
                publicKeyPem: globalUsers[userId].certificates[0]
            }
        }

        return users;
    }

}
import {StringIndexArray} from "../stringIndexArray";
import {User} from "../messenger/user";

export interface GlobalUser {
    userId: string,
    certificates: string[],
    titles: StringIndexArray<string>
}

// export interface GlobalUsers {
//     users: StringIndexArray<GlobalUser>
// }

export interface LocalStorageUser {
    id: string,
    publicKey: string,
    privateKey: string,
    title: string
}

export interface LocalStorageData {
    user: LocalStorageUser,
    globalUsers: StringIndexArray<GlobalUser>
}

export interface StateData {
    user: User,
    globalUsers: StringIndexArray<GlobalUser>
}
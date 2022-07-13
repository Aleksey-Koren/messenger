import {StringIndexArray} from "../stringIndexArray";
import {User} from "../messenger/user";

export interface GlobalUsers {
    [key: string]: {
        user: string,
        certificates: string[],
        titles: StringIndexArray<string>
    }
}

export interface LocalStorageUser {
    id: string,
    publicKey: string,
    privateKey: string,
    title: string
}

export interface LocalStorageData {
    user: LocalStorageUser,
    globalUsers: GlobalUsers
}

export interface StateData {
    user: User,
    globalUsers: GlobalUsers
}
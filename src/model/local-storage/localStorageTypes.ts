import {StringIndexArray} from "../stringIndexArray";
import {User} from "../messenger/user";
import {Chat} from "../messenger/chat";

export interface GlobalUser {
    userId: string,
    certificates: string[],
    titles: StringIndexArray<string>
}

export interface LocalStorageUser {
    id: string,
    publicKey: string,
    privateKey: string,
    publicKeyPem: string,
    privateKeyPem: string,
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
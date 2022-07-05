import {StringIndexArray} from "../stringIndexArray";

export interface GlobalUsers {
    [key: string]: {
        user: string,
        certificates: string[],
        titles: StringIndexArray<string>
    }
}

export interface LocalStorageUser {
    id: string,
    publicKey: number[],
    privateKey: number[],
    title: string
}

export interface LocalStorageState {
    user: LocalStorageUser,
    globalUsers: GlobalUsers
}
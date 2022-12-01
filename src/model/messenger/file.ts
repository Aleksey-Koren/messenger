export enum FileType {
    IMAGE = 1,
    VIDEO = 2,
    AUDIO = 3,
    UNKNOWN = 4
}

export type TArrayWithMimeType = {
    fileType: FileType,
    unmarkedArray: Uint8Array
}

export type TAttachmentFile = {
    data?: Blob;
    name?: string,
    type?: string,
    isDecrypted: boolean
}
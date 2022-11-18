//@TODO ERROR it is not mime types
export enum MimeType {
    IMAGE = 1,
    VIDEO = 2,
    AUDIO = 3,
    UNKNOWN
}

export type TArrayWithMimeType = {
    mimeType: MimeType,
    unmarkedArray: Uint8Array
}

export type TAttachmentFile = {
    data?: Blob;
    mimeType?: MimeType,
    isDecrypted: boolean
}
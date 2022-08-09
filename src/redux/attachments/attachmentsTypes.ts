import {IDefaultStateFieldOpt} from "../redux-types";

export interface IAttachmentsStateOpt extends IDefaultStateFieldOpt {

}

export enum MimeType {
    IMAGE = 1,
    VIDEO = 2,
    AUDIO = 3
}

export type TAttachmentFile = {
    file?: Blob;
    mimeType?: MimeType,
    isDecrypted: boolean
}
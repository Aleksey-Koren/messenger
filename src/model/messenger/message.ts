import {MessageType} from "./messageType";
import {MyFile} from "./MyFile";

export interface Message {
    id?: string;
    sender: string;
    receiver: string;
    chat: string;
    type: MessageType;
    data?: string;
    nonce?: string;
    created?: Date;
    files?: MyFile[];
    attachments?: Uint8Array[];
    attachmentsFilenames?: string[];
    decrypted: boolean
}
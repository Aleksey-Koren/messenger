import {MessageType} from "./messageType";

export interface Message {
    id?: string;
    sender: string;
    receiver: string;
    chat: string;
    type: MessageType;
    data?: string;
    nonce?: string;
    created?: Date;
    attachments?: Uint8Array[];
    attachmentsFilenames?: string[];
    decrypted: boolean
}
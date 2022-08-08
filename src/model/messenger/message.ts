import {MessageType} from "./messageType";

export interface Message {
    id?: string;
    sender: string;
    receiver: string;
    chat: string;
    type: MessageType;
    data?: string;
    nonce?: Uint8Array;
    created?: Date;
    attachments?: Uint8Array[];
    attachmentsPath?: string[];
    decrypted: boolean
}
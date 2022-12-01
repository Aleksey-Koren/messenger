import {MessageType} from "../model/messenger/messageType";
import {MyFile} from "../model/messenger/MyFile";

export interface MessageDto {
    id?: string;
    sender: string;
    receiver: string;
    type: MessageType;
    chat: string | null;
    data?: string;
    files?: MyFile[];
    attachments?: string,
    nonce?: string;
    created?: string;
}
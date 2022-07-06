import {MessageType} from "../model/messenger/messageType";

export interface MessageDto {
    id?: string;
    sender: string;
    receiver: string;
    type: MessageType;
    chat: string | null;
    data?: string;
    nonce?: string;
    created?: string;
}
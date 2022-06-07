import {MessageType} from "../model/messageType";

export class MessageDto {
    public id: string | null = null;
    public sender: string | null = null;
    public receiver: string | null = null;
    public chat: string | null = null;
    public type: MessageType | null = null;
    public data: string | null = null;
    public nonce: string | null = null;
    public created: Date | null = null;
}
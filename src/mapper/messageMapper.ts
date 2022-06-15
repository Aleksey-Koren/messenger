import {Message} from "../model/message";
import {MessageDto} from "../dto/messageDto";
import {CryptService} from "../service/cryptService";
import {User} from "../model/user";
import {toByteArray} from "base64-js";

export class MessageMapper {

    static toEntity(dto: MessageDto, sender:User):Message {
        const message = {
            id: dto.id,
            sender: dto.sender,
            receiver: dto.receiver,
            chat: dto.chat,
            type: dto.type,
            created: dto.created,
            nonce: dto.nonce ? toByteArray(dto.nonce!) : null
        } as Message;

        if(dto.data) {
            message.data = CryptService.decrypt(dto, sender.publicKey);
        }
        return message;
    }

    static toDto(message: Message, receiver:User) {
        const dto = {
            id: message.id,
            sender: message.sender,
            receiver: message.receiver,
            chat: message.chat,
            type: message.type,
            created: message.created
        } as MessageDto;

        if(message.data) {
            const data = CryptService.encrypt(message, receiver.publicKey);
            dto.data = data.data;
            dto.nonce = data.nonce;
        }
        return dto;
    }
}
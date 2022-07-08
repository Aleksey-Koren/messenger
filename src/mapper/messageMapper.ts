import {Message} from "../model/messenger/message";
import {MessageDto} from "../dto/messageDto";
import {CryptService} from "../service/cryptService";
import {User} from "../model/messenger/user";
import {store} from "../index";
import {MessageService} from "../service/messenger/messageService";

export class MessageMapper {

    static toEntity(dto: MessageDto, userId: string): Message {
        const message: Message = {
            id: dto.id,
            sender: dto.sender,
            receiver: dto.receiver,
            chat: dto.chat!,
            type: dto.type,
            created: new Date(dto.created!),
            data: dto.data,
            nonce: dto.nonce ? CryptService.base64ToUint8(dto.nonce!) : undefined,
            decrypted: false
        };

        if (message.data) {
            MessageService.decryptMessageDataByIterateOverPublicKeys(message, userId);
        }

        return message;
    }

    static toDto(message: Message, receiver: User) {
        const dto = {
            id: message.id,
            sender: message.sender,
            receiver: message.receiver,
            chat: message.chat,
            type: message.type,
            created: message.created
        } as MessageDto;

        if (message.data) {
            const data = CryptService.encrypt(CryptService.plainStringToUint8(message.data), receiver.publicKey);
            dto.data = CryptService.uint8ToBase64(data.data);
            dto.nonce = CryptService.uint8ToBase64(data.nonce);
        }
        return dto;
    }
}
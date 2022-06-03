import {Builder} from "builder-pattern";
import {Message} from "../model/message";
import {MessageDto} from "../dto/messageDto";
import {CryptService} from "../service/cryptService";

export class MessageMapper {

    static async toEntity(dto: MessageDto) {
        const message = Builder(Message)
            .id(dto.id)
            .sender(dto.sender)
            .receiver(dto.receiver)
            .chat(dto.chat)
            .type(dto.type)
            .created(dto.created)
            .build();

        return CryptService.decrypt(dto, message, await CryptService.findPublicKey(dto.sender!));
    }

    static async toDto(message: Message, publicKey?: Uint8Array) {
        const dto = Builder(MessageDto)
            .id(message.id)
            .sender(message.sender)
            .receiver(message.receiver)
            .chat(message.chat)
            .type(message.type)
            .created(message.created)
            .build();

        return CryptService.encrypt(message, dto,
            publicKey ? publicKey : await CryptService.findPublicKey(message.receiver!));
    }
}
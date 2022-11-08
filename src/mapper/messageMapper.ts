import {Message} from "../model/messenger/message";
import {MessageDto} from "../dto/messageDto";
import {CryptService} from "../service/cryptService";
import {MessageService} from "../service/messenger/messageService";
import {CustomerApi} from "../api/customerApi";
import {GlobalUser} from "../model/local-storage/localStorageTypes";
import {MessageType} from "../model/messenger/messageType";
import {store} from "../index";

export class MessageMapper {

    static async toEntity(dto: MessageDto, userId: string) {
        const message: Message = {
            id: dto.id,
            sender: dto.sender,
            receiver: dto.receiver,
            chat: dto.chat!,
            type: dto.type,
            created: new Date(dto.created!),
            data: dto.data,
            attachmentsFilenames: !!dto.attachments ? dto.attachments?.split(";") : undefined,
            nonce: dto.nonce ? dto.nonce! : undefined,
            decrypted: false
        };

        if (message.data) {
            await MessageService.decryptMessageDataByIterateOverPublicKeys(message, userId);
        }

        return message;
    }

    static async toDto(message: Message, receiver: GlobalUser) {
        const chat = store.getState().messenger.chats[message.chat];

        const dto = {
            id: message.id,
            sender: message.sender,
            receiver: message.receiver,
            chat: message.chat,
            type: message.type,
            created: message.created
        } as MessageDto;

        if (!receiver) {
            const user = await CustomerApi.getCustomer(message.receiver).then(user => user);
            receiver = {
                userId: user.id,
                certificates: [user.publicKeyPem!],
                titles: {}
            }
        }

        if (message.data) {
            if (message.type === MessageType.whisper) {
                const result = CryptService.encryptAES(message.data, chat.keyAES!);
                dto.data = result.data
                dto.nonce = result.nonce

            } else {
                const result = CryptService.encryptRSA(message.data, receiver.certificates[0]);
                dto.data = result.data;
                dto.nonce = result.nonce;
            }

        }
        const nonce = dto.nonce;

        if (message.attachments) {
            const files: string[] = [];
            for (let attachment of message.attachments) {
                const result = CryptService.encryptAES(attachment, chat.keyAES!, nonce);

                files.push(result.data);
                dto.nonce = result.nonce
            }

            dto.attachments = files.join(";");
        }
        return dto;
    }
}
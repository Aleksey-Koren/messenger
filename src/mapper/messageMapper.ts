import {Message} from "../model/messenger/message";
import {MessageDto} from "../dto/messageDto";
import {CryptService} from "../service/cryptService";
import {User} from "../model/messenger/user";
import {store} from "../index";
import {MessageService} from "../service/messenger/messageService";
import {CustomerApi} from "../api/customerApi";
import {GlobalUser} from "../model/local-storage/localStorageTypes";
import {Customer} from "../model/messenger/customer";

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

    static async toDto(message: Message, receiver: GlobalUser) {
        const dto = {
            id: message.id,
            sender: message.sender,
            receiver: message.receiver,
            chat: message.chat,
            type: message.type,
            created: message.created
        } as MessageDto;

        if (message.data) {
            if (!receiver) {
                const user = await CustomerApi.getCustomer(message.receiver).then(user => user);
                receiver = {
                    userId: user.id,
                    certificates: [CryptService.uint8ToBase64(user.publicKey)],
                    titles: {}
                }
            }
            const data = CryptService.encrypt(CryptService.plainStringToUint8(message.data), CryptService.base64ToUint8(receiver.certificates[0]));
            dto.data = CryptService.uint8ToBase64(data.data);
            dto.nonce = CryptService.uint8ToBase64(data.nonce);
        }
        return dto;
    }
}
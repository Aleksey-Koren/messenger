import {Message} from "../model/messenger/message";
import {MessageDto} from "../dto/messageDto";
import {CryptService} from "../service/cryptService";
import {MessageService} from "../service/messenger/messageService";
import {CustomerApi} from "../api/customerApi";
import {GlobalUser} from "../model/local-storage/localStorageTypes";

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
            nonce: dto.nonce ? CryptService.base64ToUint8(dto.nonce!) : undefined,
            decrypted: false
        };

        if (message.data) {
            await MessageService.decryptMessageDataByIterateOverPublicKeys(message, userId);
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

        if (!receiver) {
            const user = await CustomerApi.getCustomer(message.receiver).then(user => user);
            receiver = {
                userId: user.id,
                certificates: [CryptService.uint8ToBase64(user.publicKey)],
                titles: {}
            }
        }

        const nonce: Uint8Array = crypto.getRandomValues(new Uint8Array(24));
        dto.nonce = CryptService.uint8ToBase64(nonce);

        if (message.data) {
            const data = CryptService.encrypt(CryptService.plainStringToUint8(message.data), CryptService.base64ToUint8(receiver.certificates[0]), nonce);
            dto.data = CryptService.uint8ToBase64(data.data);
        }

        if (message.attachments) {
            const files: string[] = [];
            let data: {nonce: Uint8Array, data: Uint8Array};
            for(let attachment of message.attachments) {
                data = CryptService.encrypt(attachment, CryptService.base64ToUint8(receiver.certificates[0]), nonce);
                files.push(CryptService.uint8ToBase64(data.data));
            }
            dto.attachments = files.join(";");
        }
        return dto;
    }
}
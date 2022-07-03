import {Message} from "../model/message";
import {MessageDto} from "../dto/messageDto";
import {CryptService} from "../service/cryptService";
import {User} from "../model/user";
import {store} from "../index";

export class MessageMapper {

    static toEntity(dto: MessageDto, sender:User):Message {
        const message:Message = {
            id: dto.id,
            sender: dto.sender,
            receiver: dto.receiver,
            chat: dto.chat!,
            type: dto.type,
            created: new Date(dto.created!),
            nonce: dto.nonce ? CryptService.base64ToUint8(dto.nonce!) : undefined,
            decrypted: false
        };

        if(dto.data) {
            message.data = dto.data;
            try {
                MessageMapper.decryptMessage(message, sender.publicKey);
                message.decrypted = true;
            } catch (e) {
                message.decrypted = false;
            }
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
            const data = CryptService.encrypt(CryptService.plainStringToUint8(message.data), receiver.publicKey);
            dto.data = CryptService.uint8ToBase64(data.data);
            dto.nonce = CryptService.uint8ToBase64(data.nonce);
        }
        return dto;
    }


    static decryptMessage(message:Message, publicKeyToVerify: Uint8Array, privateKeyToDecrypt?: Uint8Array) {
        if(!message.data) {
            return message;
        }
        privateKeyToDecrypt = privateKeyToDecrypt || store.getState().messenger.user?.privateKey!;
        if(!privateKeyToDecrypt) {
            throw new Error("user not logged in")
        }
        message.data = CryptService.decryptToString(
            CryptService.base64ToUint8(message.data),
            publicKeyToVerify,
            message.nonce!,
            privateKeyToDecrypt
        ) || undefined;
        return message;
    }
}
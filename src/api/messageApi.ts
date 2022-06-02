import {Message} from "../model/message";
import {axiosApi} from "../http/axios";
import {CryptService} from "../service/cryptService";

export class MessageApi {

    static async sendMessages(messages: Message[]) {
       const messagesPromise = messages.map(async message => CryptService.encrypt(message, (await CryptService.findPublicKey(message.receiver!))));
       messages = await Promise.all(messagesPromise);

       return axiosApi.put<Message[]>('messages', messages);
    }

    static sendSingleMessage(message: Message, publicKey: Uint8Array) {
        const encryptedMessage =  CryptService.encrypt(message, publicKey);
        axiosApi.put<Message[]>("messages", [encryptedMessage]);
    }

    static async getMessages(receiverId: string, chatId?: string, created?: Date) {

        let messages = (await axiosApi.get<Message[]>('messages', {
            params: {
                'receiver': receiverId,
                'created': created,
                'chat': chatId
            }
        })).data

        const messagesPromise = messages.map(async message => CryptService.decrypt(message, (await CryptService.findPublicKey(message.sender!))));
        messages = await Promise.all(messagesPromise);

        return messages
    }
}
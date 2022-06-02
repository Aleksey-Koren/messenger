import {Message} from "../model/message";
import {axiosApi} from "../http/axios";

export class MessageApi {

    static sendMessages(messages: Message[]) {

        return axiosApi.put<Message[]>('messages', messages);
    }

    static sendSingleMessage(message: Message, publicKey: string) {

    }

    static getMessages(receiverId: string, chatId?: string, created?: Date) {

        return axiosApi.get<Message[]>('messages', {
            params: {
                'receiver': receiverId,
                'created': created,
                'chat': chatId
            }
        })
    }

}
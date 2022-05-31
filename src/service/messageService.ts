import {Message} from "../model/message";
import {axiosApi} from "../http/axios";

export class MessageService {

    static sendMessages(messages: Message[]) {

        return axiosApi.put<Message[]>('messages', messages);
    }

    static getMessages(receiverId: string, created?: Date, chatId?: string) {

        return axiosApi.get<Message[]>('messages', {
            params: {
                'receiver': receiverId,
                'created': created,
                'chat': chatId
            }
        })
    }

}
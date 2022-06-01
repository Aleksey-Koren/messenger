import {axiosApi} from "../http/axios";
import {Customer} from "../model/customer";
import {Message} from "../model/message";

export class ChatService {

    static getChats(receiverId: string) {

        return axiosApi.get<Message[]>('chats', {
            params: {
                'receiver': receiverId
            }
        })
    }

    static getParticipants(chatId: string) {

        return axiosApi.get<Customer[]>(`chats/${chatId}/participants`)
    }
}
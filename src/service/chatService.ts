import {axiosApi} from "../http/axios";
import {Customer} from "../model/customer";

export class ChatService {

    static getChats(receiverId: string) {

        return axiosApi.get<string[]>('chats', {
            params: {
                'receiver': receiverId
            }
        })
    }

    static getParticipants(chatId: string) {

        return axiosApi.get<Customer[]>(`chats/${chatId}/participants`)
    }


}
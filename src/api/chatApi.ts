import {axiosApi} from "../http/axios";
import {MessageDto} from "../dto/messageDto";
import {CustomerDto} from "../dto/CustomerDto";
import {CustomerMapper} from "../mapper/customerMapper";

export class ChatApi {

    static getChats(receiverId: string) {
        return axiosApi.get<MessageDto[]>('chats', {
            params: {'receiver': receiverId}
        }).then(response => {
            return response.data;
        })
    }

    static async getParticipants(chatId: string) {
        return axiosApi.get<CustomerDto[]>(`chats/${chatId}/participants`).then(response => {
            return response.data.map(dto => CustomerMapper.toEntity(dto))
        });
    }

}
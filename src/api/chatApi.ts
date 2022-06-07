import {axiosApi} from "../http/axios";
import {MessageMapper} from "../mapper/messageMapper";
import {MessageDto} from "../dto/messageDto";
import {CustomerDto} from "../dto/CustomerDto";
import {CustomerMapper} from "../mapper/customerMapper";

export class ChatApi {

    static async getChats(receiverId: string) {

        const dto = (await axiosApi.get<MessageDto[]>('chats', {
            params: {
                'receiver': receiverId
            }
        })).data

        return await Promise.all(dto.map(async dto => await MessageMapper.toEntity(dto)));
    }

    static async getParticipants(chatId: string) {
        const dto = (await axiosApi.get<CustomerDto[]>(`chats/${chatId}/participants`)).data;

        return dto.map(dto => CustomerMapper.toEntity(dto))
    }
}
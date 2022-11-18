import {axiosApi} from "../http/axios";
import {MessageDto} from "../dto/messageDto";
import {CustomerDto} from "../dto/CustomerDto";
import {CustomerMapper} from "../mapper/customerMapper";

export class ChatApi {

    static getChats(receiverId: string) {
        return axiosApi.get<MessageDto[]>('chats', {
            params: {'receiver': receiverId}
        }).then(response => response.data)
    }

    static async getParticipants(chatId: string) {
        return axiosApi.get<CustomerDto[]>(`chats/${chatId}/customers`).then(response => {
            return response.data.map(dto => CustomerMapper.toEntity(dto))
        });
    }

    static removeCustomerFromChat(customerId: string, chatId: string, token: string) {
        return axiosApi.delete<any>(`chats/${chatId}/customers/${customerId}`, {
            headers: {
                Token: token,
            }
        }).then(response => response.data)
    }

    static quitFromChat(chatId: string, myId: string, data: { data: string, nonce: string }) {
        return axiosApi.delete(`chats/${chatId}`, {
            params: {
                sender: myId,
                data: data.data,
                nonce: data.nonce
            }
        });
    }

    static leaveChat(chatId: string, customerId: string, token: string) {
        return axiosApi.delete<any>(`chats/${chatId}/customers/${customerId}/leave-chat`, {
            headers: {
                Token: token,
            }
        }).then(response => response.data)
    }
}
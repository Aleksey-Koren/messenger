import {axiosApi} from "../http/axios";
import {Customer} from "../model/customer";
import {Message} from "../model/message";
import {CryptService} from "../service/cryptService";
import {AuthorizationService} from "../service/authorizationService";

export class ChatApi {

    static getChats(receiverId: string) {

        return axiosApi.get<Message[]>('chats', {
            params: {
                'receiver': receiverId
            }
        })
    }

    static async getParticipants(chatId: string) {
        const customers: Customer[] = (await axiosApi.get<Customer[]>(`chats/${chatId}/participants`)).data;

        return customers.map(customer => {
            customer.pk = AuthorizationService.JSONByteStringToUint8(customer.pk as string);
            return customer;
        })
    }
}
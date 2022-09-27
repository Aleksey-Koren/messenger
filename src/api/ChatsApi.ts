import {axiosApi} from "../http/axios";

/**
 * Class for working with backend's API - chats.
 * @Author Maxim Semianko
 */
export class ChatsApi {

    /**
     * Method that call backend api to get all chats where customer is a member.
     * @param customerId member of chat
     * @param page page for pagination
     * @param size size for pagination
     */
    static async getChatsByCustomerId(customerId: string, page: number, size: number) {
        console.log("api: getChatsByCustomerId")
        return axiosApi.get<any>(`chats/customers/${customerId}`, {
            params: {
                page: page,
                size: size
            }
        }).then(response => response.data)
    }

    /**
     * Method that call backend api to get chat by id.
     * @param chatId needed chat's id
     */
    static async getChatById(chatId: string) {
        console.log("api: getChatById")
        return axiosApi.get<any>(`chats/${chatId}`, {}).then(response => response.data)
    }

    /**
     * Method that call backend api to create a new chat.
     * @param request data
     */
    static async createChat(request: { title: string, creatorId: string }) {
        console.log("api: createChat")
        return axiosApi.post<any>(`chats/`, request).then(response => response.data)
    }

    static async updateChatTitleById(chatId: string, title: string) {
        console.log("api: updateChatTitleById")
        return axiosApi.patch<any>(`chats/${chatId}/title`,
            {
                title: title
            })
            .then(response => response.data)
    }

    /**
     * Method that call backend api to add customer to chat.
     * @param chatId needed chat's id
     * @param customerId needed customer's id
     */
    static async addCustomerToChat(chatId: string, customerId: string) {
        console.log("api: addMemberToChat")
        return axiosApi.put<any>(`chats/${chatId}/customers/${customerId}`)
            .then(response => response.data)
    }

    /**
     * Method that call backend api to remove customer from chat.
     * @param chatId needed chat's id
     * @param customerId needed customer's id
     * @param secretText secret message for backend
     * @param nonce
     */
    static async removeCustomerFromRoom(chatId: string, customerId: string, secretText: string, nonce: string) {
        console.log("api: removeMemberFromChat")
        return axiosApi.delete<any>(`chats/${chatId}/customers/${customerId}`, {
            data: {
                secretText: secretText,
                nonce: nonce,
            }
        })
            .then(response => response.data)
    }

}
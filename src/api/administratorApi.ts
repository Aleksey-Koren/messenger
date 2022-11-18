import {axiosApi} from "../http/axios";

export class AdministratorApi {

    static getAllAdministratorsByChatId(chatId: string) {
        return axiosApi.get<any>(`administrators/chats/${chatId}`)
            .then(response => response.data)
    }

    static assignRole(customerId: string, chatId: string, request: any, token: string) {
        return axiosApi.post<any>(`administrators/customers/${customerId}/chats/${chatId}`, request, {
            headers: {
                Token: token,
            }
        }).then(response => response.data)
    }

    static denyRole(customerId: string, chatId: string, token: string) {
        return axiosApi.delete<any>(`administrators/customers/${customerId}/chats/${chatId}`, {
            headers: {
                Token: token,
            }
        }).then(response => response.data)
    }

}
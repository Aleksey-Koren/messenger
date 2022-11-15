import {axiosApi} from "../http/axios";

export class AdministratorApi {

    //@TODO WARN write appropriate return type
    static getAllAdministratorsByChatId(chatId: string) {
        return axiosApi.get<any>(`administrators/chats/${chatId}`)
            .then(response => response.data)
    }
    //@TODO WARN write appropriate return type
    static assignRole(request: any, token: string) {
        return axiosApi.post<any>('administrators/', request, {
            headers: {
                Token: token,
            }
        }).then(response => response.data)
    }
    //@TODO WARN add return type Promise<void>, delete .then(, because it is not used
    static denyRole(customerId: string, chatId: string, token: string) {
        return axiosApi.delete<any>(`administrators/customers/${customerId}/chats/${chatId}`, {
            headers: {
                Token: token,
            }
        }).then(response => response.data)
    }

}
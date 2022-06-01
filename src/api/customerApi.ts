import {Customer} from "../model/customer";
import {axiosApi} from "../http/axios";
import {AuthorizationService} from "../service/authorizationService";

export class CustomerApi {

    static register(customer: Customer) {

        return axiosApi.post<Customer>('customers', customer);
    }

    static async getCustomer(customerId: string) {
        let customer = (await axiosApi.get<Customer>(`customers/${customerId}`)).data
        customer.pk = AuthorizationService.JSONByteStringToUint8(customer.pk as string);
        return customer
    }

    static delete(customer: Customer) {

        return axiosApi.delete<void>('customers', {data: customer});
    }




}
import {Customer} from "../model/customer";
import {axiosApi} from "../http/axios";

export class CustomerApi {

    static register(customer: Customer) {

        return axiosApi.post<Customer>('customers', customer);
    }

    static getCustomer(customerId: string) {

        return axiosApi.get<Customer>(`customers/${customerId}`)
    }

    static delete(customer: Customer) {

        return axiosApi.delete<void>('customers', {data: customer});
    }




}
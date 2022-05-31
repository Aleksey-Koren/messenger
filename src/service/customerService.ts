import {Customer} from "../model/customer";
import {axiosApi} from "../http/axios";

export class CustomerService {

    static register(customer: Customer) {

        return axiosApi.post<Customer>('customers', customer);
    }

    static getCustomer(customerId: string) {

        return axiosApi.get(`customers/${customerId}`)
    }

    static delete(customer: Customer) {

        return axiosApi.delete<void>('customers', {data: customer});
    }




}
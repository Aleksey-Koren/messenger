import {Customer} from "../model/customer";
import {axiosApi} from "../http/axios";
import {CustomerDto} from "../dto/CustomerDto";
import {CustomerMapper} from "../mapper/customerMapper";

export class CustomerApi {

    static async register(customer: Customer) {
        return CustomerMapper.toEntity((await axiosApi.post<CustomerDto>('customers', CustomerMapper.toDto(customer))).data);
    }

    static async getCustomer(customerId: string) {
        return CustomerMapper.toEntity((await axiosApi.get<CustomerDto>(`customers/${customerId}`)).data)
    }

    static delete(customer: Customer) {

        return axiosApi.delete<void>('customers', {data: CustomerMapper.toDto(customer)});
    }
}
import {Customer} from "../model/customer";
import {axiosApi} from "../http/axios";
import {CustomerDto} from "../dto/CustomerDto";
import {CustomerMapper} from "../mapper/customerMapper";
import {User} from "../model/user";

export class CustomerApi {

    static register(customer: Customer):Promise<User> {
        return axiosApi.post<CustomerDto>('customers', CustomerMapper.toDto(customer)).then(response => {
            return CustomerMapper.toEntity(response.data);
        })
    }

    static getCustomer(customerId: string):Promise<User> {
        return axiosApi.get<CustomerDto>(`customers/${customerId}`).then(response => {
            return CustomerMapper.toEntity(response.data)
        })
    }

    static delete(customer: Customer) {
        return axiosApi.delete<void>('customers', {data: CustomerMapper.toDto(customer)});
    }

    static getUsers(idList: string[]) {
        const packages = [];
        let chunk = [];
        for(let i = 0; i < idList.length; i++) {
            chunk.push(idList[i]);
            if(chunk.length > 20) {
                packages.push(chunk);
                chunk = [];
            }
        }
        if(chunk.length > 0) {
            packages.push(chunk);
        }
        return Promise.all(
            packages.map(chunk => axiosApi.get<CustomerDto[]>("/customers/?id=" + chunk.join(',')))
        ).then(responses => {
            let out:User[] = [];
            responses.forEach(response => {
                out = out.concat(response.data.map(customer => CustomerMapper.toEntity(customer)));
            })
            return out;
        });
    }
}
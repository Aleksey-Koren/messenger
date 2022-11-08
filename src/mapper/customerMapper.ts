import {CustomerDto} from "../dto/CustomerDto";
import {Builder} from "builder-pattern";
import {Customer} from "../model/messenger/customer";
import {User} from "../model/messenger/user";

export class CustomerMapper {

    static toDto(customer: Customer) {
        return Builder(CustomerDto)
            .id(customer.id)
            .pk(customer.pk!)
            .build()
    }

    static toEntity(customer: CustomerDto): User {
        return {
            id: customer.id!,
            privateKeyPem: customer.pk!,
            publicKeyPem: customer.pk!
        }
    }
}
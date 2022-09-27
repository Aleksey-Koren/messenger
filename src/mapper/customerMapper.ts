import {CustomerDto} from "../dto/CustomerDto";
import {Builder} from "builder-pattern";
import {Customer} from "../model/messenger/customer";
import {CryptService} from "../service/cryptService";
import {User} from "../model/messenger/user";

export class CustomerMapper {

    static toDto(customer: Customer) {
        return Builder(CustomerDto)
            .id(customer.id)
            .pk(CryptService.uint8ToBase64(customer.pk!))
            .build()
    }

    static toEntity(customer: CustomerDto): User {
        return {
            id: customer.id!,
            publicKey: CryptService.base64ToUint8(customer.pk!)
        }
    }
}
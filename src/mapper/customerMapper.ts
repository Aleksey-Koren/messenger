import {CustomerDto} from "../dto/CustomerDto";
import {Builder} from "builder-pattern";
import {Customer} from "../model/customer";
import {CryptService} from "../service/cryptService";
import {User} from "../model/user";

export class CustomerMapper {

    static toDto(customer: Customer) {
        return Builder(CustomerDto)
            .id(customer.id)
            .pk(customer.pk!.join(","))
            .build()
    }

    static toEntity(customer:CustomerDto):User {
        return {
            id: customer.id!,
            publicKey: CryptService.JSONByteStringToUint8(customer.pk!)
        }
    }
}
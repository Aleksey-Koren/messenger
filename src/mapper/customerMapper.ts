import {CustomerDto} from "../dto/CustomerDto";
import {Builder} from "builder-pattern";
import {Customer} from "../model/customer";
import {CryptService} from "../service/cryptService";

export class CustomerMapper {

    static toEntity(dto: CustomerDto) {

        return Builder(Customer)
            .id(dto.id)
            .pk(CryptService.JSONByteStringToUint8(dto.pk!))
            .build()
    }

    static toDto(customer: Customer) {
        return Builder(CustomerDto)
            .id(customer.id)
            .pk(customer.pk!.join(","))
            .build()
    }
}
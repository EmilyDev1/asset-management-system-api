import { CustomRepository } from "src/database/typeorm-ex.decorator";
import { Address } from "./entities/address.entity";
import { Repository } from "typeorm";
import { CreateAddressDto } from "./dto/create-address.dto";
import { InternalServerErrorException } from "@nestjs/common";

@CustomRepository(Address)
export class AddressRepository extends Repository<Address> {
    
    async createAddress(createAddressDto:CreateAddressDto){
            const address = this.create(createAddressDto)
            try {
                await this.save(address)
                return address
            } catch (error) {
                throw new InternalServerErrorException("Error saving address")
                
            }
        }
}  
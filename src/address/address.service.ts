import { Injectable } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { AddressRepository } from './address.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from 'src/user/user.repository';

@Injectable()
export class AddressService {

  constructor(@InjectRepository(AddressRepository) private addressRepo:AddressRepository,
  @InjectRepository(UserRepository) private userRepo: UserRepository,
){}

  async create(createAddressDto: CreateAddressDto, userId:string) {
    console.log(userId)

    const user = await this.userRepo.findOne({ where: { id: userId } });
    
        console.log('My User', user);
    
        const address = this.addressRepo.create({ ...createAddressDto, user });
    
        this.addressRepo.save(address);
        return address;
  }

  findAll() {
    return this.addressRepo.find();
  }

  findOne(id: string) {
    return this.addressRepo.findOne ({where:{id}})
  }

  update(id: string, updateAddressDto: UpdateAddressDto) {
    return this.addressRepo.update(id,updateAddressDto)
  }

  
}
 
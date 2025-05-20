import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository} from '@nestjs/typeorm';
import { DeepPartial } from 'typeorm';
import { UserRepository } from './user.repository';
import { AdminService } from 'src/admin/admin.service';

export type User = any;

@Injectable()
export class UserService {


  constructor(@InjectRepository(UserRepository) private userRepo:UserRepository, private adminservice:AdminService){}

  async create(adminId:string,createUserDto: CreateUserDto) {
    const admin= await this.adminservice.findOne(adminId)
   return await this.userRepo.createUser(admin,createUserDto)
  }

  findAll() {
    return this.userRepo.find()
  }
 
  findOne(id: string) {
    return this.userRepo
    .findOne({where:{id}})
    
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return await this.userRepo.update(id,updateUserDto as DeepPartial<User>)
  }

  
} 
